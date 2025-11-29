import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { salvarCliente } from '@/lib/repositories/cliente-repository'
import { salvarRelatorio } from '@/lib/repositories/relatorio-repository'

export async function POST(request: NextRequest) {
  const requestId = `req-${Date.now()}`

  console.log(`[${requestId}] ========== INÍCIO CHECKOUT ==========`)

  try {
    console.log(`[${requestId}] STEP 1: Parsing request body`)
    const body = await request.json()
    console.log(`[${requestId}] ✅ Body parsed successfully`)

    const {
      nome,
      email,
      telefone,
      produto,
      valor,
      // Dados do formulário completo
      idade,
      cidade,
      estado,
      profissao,
      problemasAtuais,
      jaUsouAparelho,
      problemasSaude,
      expectativaResultado,
      urgenciaTratamento,
      orcamentoRecebido,
      disponibilidadeUso
    } = body

    console.log(`[${requestId}] STEP 2: Validating required fields`, {
      hasNome: !!nome,
      hasEmail: !!email,
      hasProduto: !!produto,
      hasValor: !!valor
    })

    // Validação básica
    if (!nome || !email || !produto || !valor) {
      console.error(`[${requestId}] ❌ Validation failed - missing required fields`)
      return NextResponse.json(
        { success: false, error: 'Dados incompletos' },
        { status: 400 }
      )
    }

    console.log(`[${requestId}] ✅ Validation passed`)
    console.log(`[${requestId}] STEP 3: Preparing to save to database`, {
      nome,
      email,
      valor,
      hasIdade: !!idade,
      hasCidade: !!cidade,
      hasProblemasAtuais: !!problemasAtuais
    })

    // NOVO: Salvar cliente e dados do relatório ANTES do checkout
    let clienteId: number | null = null
    let relatorioId: number | null = null

    try {
      console.log(`[${requestId}] STEP 4: Saving cliente to database`)
      const clienteData = {
        nome,
        email,
        idade: parseInt(idade) || undefined,
        cidade,
        estado,
        telefone,
        profissao
      }
      console.log(`[${requestId}] Cliente data:`, JSON.stringify(clienteData, null, 2))

      clienteId = await salvarCliente(clienteData)
      console.log(`[${requestId}] ✅ Cliente saved successfully: ID ${clienteId}`)

      // Salvar dados do relatório (sem score ainda, será calculado no webhook)
      console.log(`[${requestId}] STEP 5: Saving relatorio to database`)
      const relatorioData = {
        cliente_id: clienteId,
        score: 0, // Será atualizado no webhook
        categoria: 'pendente',
        problemas_atuais: problemasAtuais || [],
        problema_principal: problemasAtuais?.[0] || 'geral',
        tempo_estimado: '',
        custo_min: 0,
        custo_max: 0,
        custo_atma: 0,
        custo_invisalign: 0,
        custo_aparelho_fixo: 0,
        ja_usou_aparelho: jaUsouAparelho,
        problemas_saude: problemasSaude || [],
        expectativa_resultado: expectativaResultado,
        urgencia_tratamento: urgenciaTratamento,
        orcamento_recebido: orcamentoRecebido,
        disponibilidade_uso: disponibilidadeUso,
        score_complexidade: 0,
        score_idade: 0,
        score_historico: 0,
        score_saude: 0,
        score_expectativas: 0,
        pdf_gerado: false,
        pdf_enviado: false,
        consulta_agendada: false,
        tratamento_iniciado: false,
        pagamento_status: 'pending'
      }
      console.log(`[${requestId}] Relatorio data (first 3 fields):`, {
        cliente_id: relatorioData.cliente_id,
        score: relatorioData.score,
        categoria: relatorioData.categoria,
        pagamento_status: relatorioData.pagamento_status
      })

      relatorioId = await salvarRelatorio(relatorioData)
      console.log(`[${requestId}] ✅ Relatorio saved successfully: ID ${relatorioId}`)
    } catch (dbError: any) {
      console.error(`[${requestId}] ❌ DATABASE ERROR - Failed to save data`)
      console.error(`[${requestId}] Error name: ${dbError?.name}`)
      console.error(`[${requestId}] Error message: ${dbError?.message}`)
      console.error(`[${requestId}] Error code: ${dbError?.code}`)
      console.error(`[${requestId}] Error errno: ${dbError?.errno}`)
      console.error(`[${requestId}] SQL State: ${dbError?.sqlState}`)
      console.error(`[${requestId}] SQL Message: ${dbError?.sqlMessage}`)
      console.error(`[${requestId}] Full error stack:`, dbError?.stack)

      return NextResponse.json(
        {
          success: false,
          error: 'Erro ao salvar dados',
          details: {
            message: dbError?.message,
            code: dbError?.code,
            sqlMessage: dbError?.sqlMessage
          }
        },
        { status: 500 }
      )
    }

    // Configurar Mercado Pago (nova API)
    console.log(`[${requestId}] STEP 6: Creating Mercado Pago preference`)

    try {
      const client = new MercadoPagoConfig({
        accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
        options: { timeout: 5000 }
      })

      const preference = new Preference(client)

      // Criar preferência de pagamento (Checkout Pro)
      // SEM auto_return - usuário clica "Voltar ao site" manualmente
      const externalReference = `relatorio-${relatorioId}-${clienteId}`
      console.log(`[${requestId}] External reference: ${externalReference}`)

      const preferenceData = {
        items: [
          {
            title: 'Relatório de Viabilidade Ortodôntica - Atma',
            description: 'Análise personalizada completa do seu caso ortodôntico',
            unit_price: valor,
            quantity: 1,
            currency_id: 'BRL'
          }
        ],
        payer: {
          name: nome,
          email: email
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_URL}/infoproduto/relatorio-viabilidade/sucesso`,
          failure: `${process.env.NEXT_PUBLIC_URL}/infoproduto/relatorio-viabilidade/checkout`,
          pending: `${process.env.NEXT_PUBLIC_URL}/infoproduto/relatorio-viabilidade/checkout`
        },
        notification_url: `${process.env.NEXT_PUBLIC_URL}/api/infoproduto/webhook`,
        statement_descriptor: 'ATMA ALIGNER',
        external_reference: externalReference
      }

      console.log(`[${requestId}] Creating MP preference...`)
      const response = await preference.create({ body: preferenceData })

      console.log(`[${requestId}] ✅ Mercado Pago preference created: ${response.id}`)
      console.log(`[${requestId}] Init point: ${response.init_point}`)

      console.log(`[${requestId}] ========== CHECKOUT SUCCESS ==========`)

      return NextResponse.json({
        success: true,
        checkoutUrl: response.init_point,
        preferenceId: response.id
      })

    } catch (mpError: any) {
      console.error(`[${requestId}] ❌ MERCADO PAGO ERROR`)
      console.error(`[${requestId}] MP Error message: ${mpError?.message}`)
      console.error(`[${requestId}] MP Error status: ${mpError?.status}`)
      console.error(`[${requestId}] MP Error cause: ${JSON.stringify(mpError?.cause)}`)
      console.error(`[${requestId}] Full MP error:`, mpError)

      return NextResponse.json(
        {
          success: false,
          error: 'Erro ao criar preferência de pagamento',
          details: {
            message: mpError?.message,
            status: mpError?.status
          }
        },
        { status: 500 }
      )
    }

  } catch (error: any) {
    console.error(`[${requestId}] ❌ UNEXPECTED ERROR in checkout route`)
    console.error(`[${requestId}] Error type: ${error?.constructor?.name}`)
    console.error(`[${requestId}] Error message: ${error?.message}`)
    console.error(`[${requestId}] Error stack:`, error?.stack)

    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao processar pagamento',
        details: {
          type: error?.constructor?.name,
          message: error?.message || String(error)
        }
      },
      { status: 500 }
    )
  }
}
