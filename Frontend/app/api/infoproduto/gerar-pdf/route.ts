import { NextRequest, NextResponse } from 'next/server'
import { gerarPDFRelatorio } from '@/lib/pdf-generator'
import { enviarRelatorio } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()

    console.log('📄 Iniciando geração de relatório para:', formData.email)

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
        localizacao: `${formData.cidade}/${formData.estado}`
      },
      score,
      estimativaCustos,
      timeline,
      analise,
      planoAcao,
      dataGeracao: new Date().toLocaleDateString('pt-BR')
    }

    console.log('📊 Dados do relatório preparados:', {
      nome: formData.nome,
      score,
      categoria: estimativaCustos.categoria
    })

    // Gerar PDF
    console.log('🔄 Gerando PDF...')
    const pdfBuffer = await gerarPDFRelatorio(relatorioData)
    console.log('✅ PDF gerado com sucesso')

    // Enviar email com PDF anexo
    console.log('📧 Enviando email...')
    await enviarRelatorio(formData.email, formData.nome, pdfBuffer)
    console.log('✅ Email enviado com sucesso')

    return NextResponse.json({
      success: true,
      message: 'Relatório gerado e enviado com sucesso',
      data: {
        email: formData.email,
        score,
        categoria: estimativaCustos.categoria
      }
    })

  } catch (error) {
    console.error('❌ Erro ao gerar PDF:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao gerar relatório', details: String(error) },
      { status: 500 }
    )
  }
}

// ============================================
// FUNÇÕES DE ANÁLISE INTELIGENTE
// ============================================

function calcularScore(data: any): number {
  let score = 50 // Base

  // Análise de complexidade baseada nos problemas
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

  // Ajustar score baseado na complexidade
  if (problemasComplexosCount > 1) {
    score -= 20
  } else if (problemasComplexosCount === 1) {
    score -= 10
  } else if (problemasSimplesCount > 0) {
    score += 15
  }

  // Idade influencia (jovens têm melhor resposta)
  const idade = parseInt(data.idade)
  if (idade < 25) score += 10
  else if (idade > 45) score -= 5

  // Histórico de tratamento
  if (data.jaUsouAparelho === 'Sim, mas não completei o tratamento') {
    score += 10 // Já tem experiência
  } else if (data.jaUsouAparelho === 'Sim, aparelho fixo (com brackets)') {
    score -= 5 // Pode ser caso de recidiva
  }

  // Problemas de saúde bucal diminuem viabilidade
  if (data.problemasSaude.length > 2) {
    score -= 15
  }

  // Expectativas realistas aumentam viabilidade
  if (data.expectativaResultado.includes('80-90%') || data.expectativaResultado.includes('necessário')) {
    score += 10
  } else if (data.expectativaResultado.includes('perfeito')) {
    score -= 5 // Expectativa muito alta
  }

  // Manter entre 0-100
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

  // Adicionar análise de urgência
  if (data.urgenciaTratamento.includes('Urgente')) {
    analise += `\n\nNotamos que você tem urgência no tratamento. Isso é positivo, pois a disciplina no uso dos alinhadores (22h/dia) é crucial para resultados rápidos.`
  }

  // Análise de orçamento
  if (data.orcamentoRecebido.includes('15.000')) {
    analise += `\n\n⚠️ ATENÇÃO: Você mencionou ter recebido orçamentos acima de R$ 15.000. Isso está significativamente acima da média do mercado para casos similares ao seu. Recomendamos buscar segundas opiniões.`
  }

  return analise
}

function gerarPlanoAcao(data: any, score: number): string[] {
  const acoes: string[] = []

  acoes.push(`1. Agende consulta com ortodontista certificado na sua região (${data.cidade}/${data.estado})`)

  if (score >= 70) {
    acoes.push(`2. Solicite orçamento para caso ${estimarCustos(data).categoria} (espere entre R$ ${estimarCustos(data).faixaPreco.min} - R$ ${estimarCustos(data).faixaPreco.max})`)
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
