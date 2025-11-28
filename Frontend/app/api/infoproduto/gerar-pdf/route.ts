import { NextRequest, NextResponse } from 'next/server'
import { gerarPDFRelatorioV5 } from '@/lib/pdf-generator-v5'
import { enviarRelatorio } from '@/lib/email'
import { salvarCliente } from '@/lib/repositories/cliente-repository'
import { salvarRelatorio, atualizarStatusRelatorio } from '@/lib/repositories/relatorio-repository'

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
        localizacao: `${formData.cidade}/${formData.estado}`,
        email: formData.email
      },
      score,
      estimativaCustos,
      timeline,
      analise,
      planoAcao,
      dataGeracao: new Date().toLocaleDateString('pt-BR'),
      // Dados completos do formulário para Phase 2
      formData: {
        problemasAtuais: formData.problemasAtuais || [],
        jaUsouAparelho: formData.jaUsouAparelho || '',
        problemasSaude: formData.problemasSaude || [],
        expectativaResultado: formData.expectativaResultado || '',
        urgenciaTratamento: formData.urgenciaTratamento || '',
        orcamentoRecebido: formData.orcamentoRecebido || '',
        disponibilidadeUso: formData.disponibilidadeUso || '',
        profissao: formData.profissao || ''
      }
    }

    console.log('📊 Dados do relatório preparados:', {
      nome: formData.nome,
      score,
      categoria: estimativaCustos.categoria
    })

    // FASE 5.1: Salvar cliente e relatório no banco de dados
    let clienteId: number
    let relatorioId: number

    try {
      console.log('💾 Salvando cliente no banco de dados...')
      clienteId = await salvarCliente({
        nome: formData.nome,
        email: formData.email,
        idade: parseInt(formData.idade) || undefined,
        cidade: formData.cidade,
        estado: formData.estado,
        telefone: formData.telefone,
        profissao: formData.profissao
      })
      console.log(`✅ Cliente salvo: ID ${clienteId}`)

      console.log('💾 Salvando relatório no banco de dados...')

      // Calcular breakdown do score (cada fator vale 0-20)
      const scoreBreakdown = calcularScoreBreakdown(formData)

      relatorioId = await salvarRelatorio({
        cliente_id: clienteId,
        score,
        categoria: estimativaCustos.categoria,
        problemas_atuais: formData.problemasAtuais || [],
        problema_principal: formData.problemasAtuais?.[0] || 'geral',
        tempo_estimado: timeline,
        custo_min: estimativaCustos.faixaPreco.min,
        custo_max: estimativaCustos.faixaPreco.max,
        custo_atma: estimativaCustos.comparacao.atma,
        custo_invisalign: estimativaCustos.comparacao.invisalign,
        custo_aparelho_fixo: estimativaCustos.comparacao.aparelhoFixo,
        ja_usou_aparelho: formData.jaUsouAparelho,
        problemas_saude: formData.problemasSaude || [],
        expectativa_resultado: formData.expectativaResultado,
        urgencia_tratamento: formData.urgenciaTratamento,
        orcamento_recebido: formData.orcamentoRecebido,
        disponibilidade_uso: formData.disponibilidadeUso,
        score_complexidade: scoreBreakdown.complexidade,
        score_idade: scoreBreakdown.idade,
        score_historico: scoreBreakdown.historico,
        score_saude: scoreBreakdown.saude,
        score_expectativas: scoreBreakdown.expectativas,
        pdf_gerado: false,
        pdf_enviado: false,
        consulta_agendada: false,
        tratamento_iniciado: false
      })
      console.log(`✅ Relatório salvo: ID ${relatorioId}`)
    } catch (dbError) {
      console.error('⚠️ Erro ao salvar no banco (continuando sem CRM):', dbError)
      // Continuar mesmo se falhar (não bloquear geração de PDF)
    }

    // Gerar PDF (Versão 5 - Phase 5: Integrações + Upsell)
    console.log('🔄 Gerando PDF v5 (Phase 5 - Upsell: Consulta Online)...')
    const pdfBuffer = await gerarPDFRelatorioV5(relatorioData)
    console.log('✅ PDF v5 gerado com sucesso (Gráficos + Conteúdo + Upsell)')

    // Atualizar status: PDF gerado
    if (relatorioId) {
      try {
        await atualizarStatusRelatorio(relatorioId, { pdf_gerado: true })
      } catch (dbError) {
        console.error('⚠️ Erro ao atualizar status PDF gerado:', dbError)
      }
    }

    // Enviar email com PDF anexo
    console.log('📧 Enviando email...')
    await enviarRelatorio(formData.email, formData.nome, pdfBuffer)
    console.log('✅ Email enviado com sucesso')

    // Atualizar status: PDF enviado
    if (relatorioId) {
      try {
        await atualizarStatusRelatorio(relatorioId, { pdf_enviado: true })
      } catch (dbError) {
        console.error('⚠️ Erro ao atualizar status PDF enviado:', dbError)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Relatório gerado e enviado com sucesso',
      data: {
        email: formData.email,
        score,
        categoria: estimativaCustos.categoria,
        clienteId: clienteId || null,
        relatorioId: relatorioId || null
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

function calcularScoreBreakdown(data: any): {
  complexidade: number
  idade: number
  historico: number
  saude: number
  expectativas: number
} {
  // Cada fator vale de 0 a 20 pontos
  let scoreComplexidade = 15 // Base
  let scoreIdade = 15 // Base
  let scoreHistorico = 15 // Base
  let scoreSaude = 15 // Base
  let scoreExpectativas = 15 // Base

  // 1. COMPLEXIDADE (baseado nos problemas)
  const problemasComplexos = [
    'Mordida cruzada',
    'Prognatismo (queixo para frente)',
    'Sobremordida (dentes superiores cobrem muito os inferiores)'
  ]
  const problemasSimples = [
    'Dentes separados/espaçados',
    'Dentes tortos'
  ]

  const complexosCount = data.problemasAtuais?.filter((p: string) =>
    problemasComplexos.includes(p)
  ).length || 0

  const simplesCount = data.problemasAtuais?.filter((p: string) =>
    problemasSimples.includes(p)
  ).length || 0

  if (complexosCount > 1) {
    scoreComplexidade = 5 // Muito complexo
  } else if (complexosCount === 1) {
    scoreComplexidade = 10 // Complexo
  } else if (simplesCount > 0) {
    scoreComplexidade = 18 // Simples
  }

  // 2. IDADE (jovens têm melhor resposta)
  const idade = parseInt(data.idade) || 30
  if (idade < 18) {
    scoreIdade = 20 // Ótimo (adolescente)
  } else if (idade < 25) {
    scoreIdade = 18 // Muito bom
  } else if (idade < 35) {
    scoreIdade = 15 // Bom
  } else if (idade < 50) {
    scoreIdade = 12 // Razoável
  } else {
    scoreIdade = 8 // Mais desafiador
  }

  // 3. HISTÓRICO ORTODÔNTICO
  if (data.jaUsouAparelho === 'Não, nunca usei') {
    scoreHistorico = 17 // Primeira vez (bom)
  } else if (data.jaUsouAparelho === 'Sim, mas não completei o tratamento') {
    scoreHistorico = 12 // Não completou (risco de não completar novamente)
  } else if (data.jaUsouAparelho === 'Sim, aparelho fixo (com brackets)') {
    scoreHistorico = 10 // Recidiva (precisou de novo)
  } else if (data.jaUsouAparelho === 'Sim, alinhadores invisíveis') {
    scoreHistorico = 14 // Já conhece alinhadores
  }

  // 4. SAÚDE BUCAL (problemas diminuem score)
  const problemasCount = data.problemasSaude?.length || 0
  if (problemasCount === 0) {
    scoreSaude = 20 // Saúde perfeita
  } else if (problemasCount === 1) {
    scoreSaude = 15 // Um problema (controlável)
  } else if (problemasCount === 2) {
    scoreSaude = 10 // Dois problemas (atenção necessária)
  } else {
    scoreSaude = 5 // Múltiplos problemas (tratamento prévio necessário)
  }

  // 5. EXPECTATIVAS (realistas vs. irrealistas)
  if (data.expectativaResultado?.includes('80-90%')) {
    scoreExpectativas = 18 // Expectativas realistas
  } else if (data.expectativaResultado?.includes('necessário')) {
    scoreExpectativas = 16 // Expectativas razoáveis
  } else if (data.expectativaResultado?.includes('perfeito')) {
    scoreExpectativas = 8 // Expectativas muito altas (risco de insatisfação)
  } else {
    scoreExpectativas = 12 // Neutro
  }

  return {
    complexidade: Math.max(0, Math.min(20, scoreComplexidade)),
    idade: Math.max(0, Math.min(20, scoreIdade)),
    historico: Math.max(0, Math.min(20, scoreHistorico)),
    saude: Math.max(0, Math.min(20, scoreSaude)),
    expectativas: Math.max(0, Math.min(20, scoreExpectativas))
  }
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
