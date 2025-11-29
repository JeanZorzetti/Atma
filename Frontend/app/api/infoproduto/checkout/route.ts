import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { salvarCliente } from '@/lib/repositories/cliente-repository'
import { salvarRelatorio } from '@/lib/repositories/relatorio-repository'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

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

    // Validação básica
    if (!nome || !email || !produto || !valor) {
      return NextResponse.json(
        { success: false, error: 'Dados incompletos' },
        { status: 400 }
      )
    }

    console.log('📝 Criando preferência Mercado Pago:', { nome, email, valor })

    // NOVO: Salvar cliente e dados do relatório ANTES do checkout
    let clienteId: number | null = null
    let relatorioId: number | null = null

    try {
      console.log('💾 Salvando cliente no banco...')
      clienteId = await salvarCliente({
        nome,
        email,
        idade: parseInt(idade) || undefined,
        cidade,
        estado,
        telefone,
        profissao
      })
      console.log(`✅ Cliente salvo: ID ${clienteId}`)

      // Salvar dados do relatório (sem score ainda, será calculado no webhook)
      console.log('💾 Salvando dados do relatório...')
      relatorioId = await salvarRelatorio({
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
      })
      console.log(`✅ Relatório salvo: ID ${relatorioId}`)
    } catch (dbError) {
      console.error('❌ Erro ao salvar dados:', dbError)
      return NextResponse.json(
        { success: false, error: 'Erro ao salvar dados' },
        { status: 500 }
      )
    }

    // Configurar Mercado Pago (nova API)
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
      options: { timeout: 5000 }
    })

    const preference = new Preference(client)

    // Criar preferência de pagamento (Checkout Pro)
    // SEM auto_return - usuário clica "Voltar ao site" manualmente
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
      external_reference: `relatorio-${relatorioId}-${clienteId}` // Formato: relatorio-{relatorioId}-{clienteId}
    }

    const response = await preference.create({ body: preferenceData })

    console.log('✅ Preferência criada:', response.id)

    return NextResponse.json({
      success: true,
      checkoutUrl: response.init_point,
      preferenceId: response.id
    })

  } catch (error: any) {
    console.error('❌ Erro no checkout:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao processar pagamento',
        details: error.message || String(error)
      },
      { status: 500 }
    )
  }
}
