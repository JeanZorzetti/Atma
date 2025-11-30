import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import { gerarPDFRelatorioV6 } from '@/lib/pdf-generator-v6'
import { enviarRelatorio } from '@/lib/email'
import { atualizarStatusRelatorio } from '@/lib/repositories/relatorio-repository'

// Configuração do banco de dados
const dbConfig = {
  host: process.env.DB_HOST || '31.97.23.166',
  user: process.env.DB_USER || 'atmadb',
  password: process.env.DB_PASSWORD || 'atma2024',
  database: process.env.DB_NAME || 'atmadb',
}

export async function POST(request: NextRequest) {
  try {
    // Validar que é uma chamada interna
    const internalHeader = request.headers.get('X-Internal-Request')
    if (internalHeader !== 'true') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { relatorioId, clienteId, paymentId } = await request.json()

    console.log('📄 Gerando PDF via webhook:', { relatorioId, clienteId, paymentId })

    // Conectar ao banco de dados
    const connection = await mysql.createConnection(dbConfig)

    try {
      // Buscar dados do cliente e relatório
      const [rows]: any = await connection.query(`
        SELECT
          c.nome,
          c.email,
          c.idade,
          c.cidade,
          c.estado,
          c.telefone,
          c.profissao,
          r.problemas_atuais,
          r.problema_principal,
          r.ja_usou_aparelho,
          r.problemas_saude,
          r.expectativa_resultado,
          r.urgencia_tratamento,
          r.orcamento_recebido,
          r.disponibilidade_uso,
          r.pdf_enviado
        FROM clientes c
        INNER JOIN relatorios r ON c.id = r.cliente_id
        WHERE c.id = ? AND r.id = ?
      `, [clienteId, relatorioId])

      if (rows.length === 0) {
        console.error('❌ Cliente ou relatório não encontrado')
        return NextResponse.json(
          { success: false, error: 'Cliente ou relatório não encontrado' },
          { status: 404 }
        )
      }

      const data = rows[0]

      // Verificar se PDF já foi enviado (evitar duplicação)
      if (data.pdf_enviado) {
        console.log('⚠️ PDF já foi enviado anteriormente. Pulando...')
        return NextResponse.json({
          success: true,
          message: 'PDF já foi enviado anteriormente',
          alreadySent: true
        })
      }

      console.log('📊 Dados recuperados:', {
        nome: data.nome,
        email: data.email,
        problemas: data.problemas_atuais
      })

      // Preparar dados do formulário
      const formData = {
        nome: data.nome,
        email: data.email,
        idade: data.idade?.toString() || '30',
        cidade: data.cidade || '',
        estado: data.estado || '',
        telefone: data.telefone || '',
        profissao: data.profissao || '',
        problemasAtuais: Array.isArray(data.problemas_atuais)
          ? data.problemas_atuais
          : JSON.parse(data.problemas_atuais || '[]'),
        jaUsouAparelho: data.ja_usou_aparelho || '',
        problemasSaude: Array.isArray(data.problemas_saude)
          ? data.problemas_saude
          : JSON.parse(data.problemas_saude || '[]'),
        expectativaResultado: data.expectativa_resultado || '',
        urgenciaTratamento: data.urgencia_tratamento || '',
        orcamentoRecebido: data.orcamento_recebido || '',
        disponibilidadeUso: data.disponibilidade_uso || ''
      }

      console.log('🔄 Calculando score e estimativas...')

      // Calcular Score de Viabilidade (0-100)
      const score = calcularScore(formData)

      // Estimar custos baseado nas respostas
      const estimativaCustos = estimarCustos(formData)

      // Estimar timeline
      const timeline = estimarTimeline(formData)

      // Gerar análise personalizada
      const analise = gerarAnalisePersonalizada(formData, score)

      // Gerar plano de ação
      const planoAcao = gerarPlanoAcao(formData, score)

      const relatorioData = {
        cliente: {
          nome: formData.nome,
          idade: formData.idade,
          localizacao: `${formData.cidade}/${formData.estado}`,
          email: formData.email
        },
        score,
        estimativaCustos,
        timeline,
        analise,
        planoAcao,
        dataGeracao: new Date().toLocaleDateString('pt-BR'),
        formData
      }

      console.log('🔄 Gerando PDF v3 (Com seções redesenhadas)...')
      const pdfBuffer = await gerarPDFRelatorioV6(relatorioData)
      console.log('✅ PDF v3 gerado com sucesso (Timeline + Calendario + Recursos melhorados)')

      // Atualizar status: PDF gerado
      await atualizarStatusRelatorio(relatorioId, { pdf_gerado: true })

      // Enviar email com PDF anexo
      console.log('📧 Enviando email para:', formData.email)
      await enviarRelatorio(formData.email, formData.nome, pdfBuffer)
      console.log('✅ Email enviado com sucesso')

      // Atualizar status: PDF enviado + pagamento aprovado
      await atualizarStatusRelatorio(relatorioId, {
        pdf_enviado: true,
        score,
        categoria: estimativaCustos.categoria,
        tempo_estimado: timeline,
        custo_min: estimativaCustos.faixaPreco.min,
        custo_max: estimativaCustos.faixaPreco.max,
        custo_atma: estimativaCustos.comparacao.atma,
        custo_invisalign: estimativaCustos.comparacao.invisalign,
        custo_aparelho_fixo: estimativaCustos.comparacao.aparelhoFixo
      })

      console.log('✅ Processo completo! PDF enviado para:', formData.email)

      return NextResponse.json({
        success: true,
        message: 'Relatório gerado e enviado com sucesso',
        data: {
          email: formData.email,
          score,
          categoria: estimativaCustos.categoria,
          relatorioId,
          clienteId
        }
      })

    } finally {
      await connection.end()
    }

  } catch (error) {
    console.error('❌ Erro ao gerar PDF via webhook:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao gerar relatório', details: String(error) },
      { status: 500 }
    )
  }
}

// ============================================
// FUNÇÕES DE ANÁLISE (copiadas de gerar-pdf/route.ts)
// ============================================

function calcularScore(data: any): number {
  let score = 50

  const problemasComplexos = [
    'Mordida cruzada',
    'Prognatismo (queixo para frente)',
    'Sobremordida (dentes superiores cobrem muito os inferiores)'
  ]

  const problemasSimples = [
    'Dentes separados/espaçados',
    'Dentes tortos'
  ]

  let problemasComplexosCount = 0
  let problemasSimplesCount = 0

  data.problemasAtuais.forEach((problema: string) => {
    if (problemasComplexos.includes(problema)) problemasComplexosCount++
    if (problemasSimples.includes(problema)) problemasSimplesCount++
  })

  if (problemasComplexosCount > 1) {
    score -= 20
  } else if (problemasComplexosCount === 1) {
    score -= 10
  } else if (problemasSimplesCount > 0) {
    score += 15
  }

  const idade = parseInt(data.idade)
  if (idade < 25) score += 10
  else if (idade > 45) score -= 5

  if (data.jaUsouAparelho === 'Sim, mas não completei o tratamento') {
    score += 10
  } else if (data.jaUsouAparelho === 'Sim, aparelho fixo (com brackets)') {
    score -= 5
  }

  if (data.problemasSaude.length > 2) {
    score -= 15
  }

  if (data.expectativaResultado.includes('80-90%') || data.expectativaResultado.includes('necessário')) {
    score += 10
  } else if (data.expectativaResultado.includes('perfeito')) {
    score -= 5
  }

  return Math.max(0, Math.min(100, score))
}

function estimarCustos(data: any): any {
  const problemasComplexos = data.problemasAtuais.filter((p: string) =>
    p.includes('Mordida') || p.includes('Prognatismo') || p.includes('Sobremordida')
  ).length

  const problemasSimples = data.problemasAtuais.filter((p: string) =>
    p.includes('separados') || p.includes('tortos') || p.includes('espaç')
  ).length

  let categoria = 'moderado'
  let faixaPreco = { min: 5990, max: 7990 }
  let alinhadores = '21-35'

  if (problemasComplexos > 1) {
    categoria = 'complexo'
    faixaPreco = { min: 8990, max: 12000 }
    alinhadores = '36+'
  } else if (problemasSimples > 0 && problemasComplexos === 0) {
    categoria = 'simples'
    faixaPreco = { min: 3990, max: 5990 }
    alinhadores = 'Até 20'
  }

  return {
    categoria,
    faixaPreco,
    alinhadores,
    comparacao: {
      atma: faixaPreco.min,
      invisalign: faixaPreco.min * 2.5,
      aparelhoFixo: faixaPreco.min * 0.7,
      economia: Math.round(faixaPreco.min * 1.5)
    }
  }
}

function estimarTimeline(data: any): string {
  const problemasComplexosCount = data.problemasAtuais.filter((p: string) =>
    p.includes('Mordida') || p.includes('Prognatismo')
  ).length

  if (problemasComplexosCount > 1) {
    return '15-18 meses'
  } else if (problemasComplexosCount === 1) {
    return '9-15 meses'
  } else {
    return '6-12 meses'
  }
}

function gerarAnalisePersonalizada(data: any, score: number): string {
  let analise = ''

  if (score >= 75) {
    analise = `Excelente notícia, ${data.nome}! Seu caso apresenta alta viabilidade para tratamento com alinhadores invisíveis. `
    analise += `Baseado nas suas respostas, você tem ${data.problemasAtuais.length} problema(s) identificado(s), `
    analise += `que são típicos de casos tratados com sucesso usando alinhadores. `
  } else if (score >= 50) {
    analise = `${data.nome}, seu caso apresenta viabilidade moderada para alinhadores invisíveis. `
    analise += `Alguns dos problemas que você mencionou podem requerer atenção especial, `
    analise += `mas são tratáveis com a tecnologia de alinhadores. `
  } else {
    analise = `${data.nome}, seu caso requer avaliação cuidadosa. `
    analise += `Baseado nas respostas, você pode se beneficiar de alinhadores, mas alguns desafios foram identificados. `
    analise += `Recomendamos fortemente uma consulta presencial para análise detalhada. `
  }

  if (data.urgenciaTratamento.includes('Urgente')) {
    analise += `\n\nNotamos que você tem urgência no tratamento. Isso é positivo, pois a disciplina no uso dos alinhadores (22h/dia) é crucial para resultados rápidos.`
  }

  if (data.orcamentoRecebido.includes('15.000')) {
    analise += `\n\n⚠️ ATENÇÃO: Você mencionou ter recebido orçamentos acima de R$ 15.000. Isso está significativamente acima da média do mercado para casos similares ao seu. Recomendamos buscar segundas opiniões.`
  }

  return analise
}

function gerarPlanoAcao(data: any, score: number): string[] {
  const acoes: string[] = []

  acoes.push(`1. Agende consulta com ortodontista certificado na sua região (${data.cidade}/${data.estado})`)

  const custos = estimarCustos(data)
  if (score >= 70) {
    acoes.push(`2. Solicite orçamento para caso ${custos.categoria} (espere entre R$ ${custos.faixaPreco.min} - R$ ${custos.faixaPreco.max})`)
  } else {
    acoes.push(`2. Peça avaliação detalhada com exames complementares (raio-X panorâmico, fotos)`)
  }

  acoes.push(`3. Perguntas essenciais para fazer:`)
  acoes.push(`   - Quantos alinhadores serão necessários no meu caso?`)
  acoes.push(`   - Qual o tempo estimado de tratamento?`)
  acoes.push(`   - Há necessidade de attachments (botões) nos dentes?`)
  acoes.push(`   - O que está incluso no valor (contenção pós-tratamento, ajustes)?`)
  acoes.push(`   - Qual o material dos alinhadores? (Procure por PETG médico)`)

  if (data.problemasSaude.length > 0) {
    acoes.push(`4. ⚠️ Resolva problemas de saúde bucal antes de iniciar (${data.problemasSaude.join(', ')})`)
  }

  acoes.push(`5. Compare no mínimo 3 orçamentos diferentes usando a tabela de referência deste relatório`)

  return acoes
}
