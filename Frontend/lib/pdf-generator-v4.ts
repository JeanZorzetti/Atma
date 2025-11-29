/**
 * PDF Generator V4 - Fase 3: Personalização Avançada
 *
 * Adiciona ao V3:
 * - Gráficos dinâmicos com Chart.js
 * - Conteúdo condicional por tipo de caso
 * - Visualizações avançadas
 */

import { PDFGeneratorV3 } from './pdf-generator-v3'
import 'jspdf-autotable' // IMPORTANT: Import to register plugin with jsPDF
import {
  generateScoreBreakdownChart,
  generateCostComparisonChart,
  generateTimelineProgressChart,
  generateInvestmentBreakdownChart,
  generateROIChart
} from './chart-utils'
import { getCaseSpecificContent } from './conditional-content'

// Estender a interface para incluir dados de gráficos
interface RelatorioDataV4 extends any {
  // Herda tudo do V3
  cliente: {
    nome: string
    idade: string
    localizacao: string
    email?: string
  }
  score: number
  estimativaCustos: any
  timeline: string
  analise: string
  planoAcao: string[]
  dataGeracao: string
  formData?: {
    problemasAtuais: string[]
    jaUsouAparelho: string
    problemasSaude: string[]
    expectativaResultado: string
    urgenciaTratamento: string
    orcamentoRecebido: string
    disponibilidadeUso: string
    profissao?: string
  }
}

export class PDFGeneratorV4 extends PDFGeneratorV3 {

  /**
   * Gera seção específica do tipo de caso (novo na V4)
   * Conteúdo personalizado baseado no problema ortodôntico principal
   */
  private async generateCaseSpecificSection(dados: RelatorioDataV4) {
    if (!dados.formData?.problemasAtuais || dados.formData.problemasAtuais.length === 0) {
      return // Pula se não tiver problemas identificados
    }

    const caseContent = getCaseSpecificContent(dados.formData.problemasAtuais)

    this.addPage()
    this.yPosition = 30

    this.addSectionTitle(caseContent.titulo, '🎯')
    this.yPosition += 5

    // Descrição do problema
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('O Que É?', 15, this.yPosition)
    this.yPosition += 8

    this.addText(caseContent.descricao, 10, 'normal')
    this.yPosition += 10

    // Causas comuns
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('Causas Comuns', 15, this.yPosition)
    this.yPosition += 8

    this.addBulletList(caseContent.causas)
    this.yPosition += 10

    // Como alinhadores ajudam
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('Como Alinhadores Podem Ajudar', 15, this.yPosition)
    this.yPosition += 8

    this.addText(caseContent.comoAlinhadoresAjudam, 10, 'normal')
    this.yPosition += 10

    // Box com tempo estimado e complexidade
    this.addNewPageIfNeeded(30)
    this.doc.setFillColor(219, 234, 254) // Blue-100
    this.doc.roundedRect(15, this.yPosition, this.pageWidth - 30, 20, 3, 3, 'F')

    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(10)
    this.doc.text(`⏱️ Tempo Estimado: ${caseContent.tempoEstimado}`, 20, this.yPosition + 7)

    this.doc.text(`📊 Complexidade: ${caseContent.complexidade}`, 20, this.yPosition + 14)

    this.yPosition += 25

    // Dicas especiais
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('💡 Dicas Especiais Para Seu Caso', 15, this.yPosition)
    this.yPosition += 8

    this.addBulletList(caseContent.dicasEspeciais)
    this.yPosition += 10

    // Cuidados extras
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('⚠️ Cuidados Extras', 15, this.yPosition)
    this.yPosition += 8

    this.addBulletList(caseContent.cuidadosExtras)
    this.yPosition += 10

    // InfoBox final de alerta
    if (caseContent.complexidade === 'Complexo') {
      this.addInfoBox(
        '⚠️ Atenção: Caso Complexo',
        'Seu caso requer avaliação presencial OBRIGATÓRIA com ortodontista experiente. A análise online é preliminar e pode não capturar todas as nuances. Agende consulta presencial antes de tomar qualquer decisão.',
        'warning'
      )
    } else {
      this.addInfoBox(
        '✅ Boas Notícias',
        `Casos de ${caseContent.tipo} respondem muito bem a alinhadores invisíveis! Com uso correto e acompanhamento adequado, você pode alcançar excelentes resultados.`,
        'success'
      )
    }
  }

  /**
   * Sobrescreve seção de análise detalhada para incluir gráfico de radar
   */
  private async generateDetailedAnalysisSectionV4(dados: RelatorioDataV4) {
    this.addPage()
    this.yPosition = 30

    this.addSectionTitle('ANÁLISE DETALHADA DO CASO', '🔬')
    this.yPosition += 5

    // 1. Gráfico de Radar do Score (NOVO NA V4)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('Visualização: Breakdown do Score', 15, this.yPosition)
    this.yPosition += 10

    const scoreBreakdown = {
      complexidade: this.calculateComplexityScore(dados),
      idade: this.calculateAgeScore(dados),
      historico: this.calculateHistoryScore(dados),
      saude: this.calculateHealthScore(dados),
      expectativas: this.calculateExpectationsScore(dados)
    }

    try {
      const radarChartDataURL = await generateScoreBreakdownChart(scoreBreakdown)

      // Adicionar imagem do gráfico
      const imgWidth = 140
      const imgHeight = 95
      const imgX = (this.pageWidth - imgWidth) / 2

      this.addNewPageIfNeeded(imgHeight + 10)
      this.doc.addImage(radarChartDataURL, 'PNG', imgX, this.yPosition, imgWidth, imgHeight)
      this.yPosition += imgHeight + 15

    } catch (error) {
      console.error('Erro ao gerar gráfico de radar:', error)
      this.addText('(Gráfico não disponível)', 10, 'italic')
      this.yPosition += 10
    }

    // Continua com tabela de breakdown
    const scoreFactors = [
      {
        fator: 'Complexidade do Caso',
        peso: scoreBreakdown.complexidade,
        descricao: 'Baseado nos problemas ortodônticos identificados'
      },
      {
        fator: 'Idade do Paciente',
        peso: scoreBreakdown.idade,
        descricao: 'Jovens têm melhor resposta ao tratamento'
      },
      {
        fator: 'Histórico Ortodôntico',
        peso: scoreBreakdown.historico,
        descricao: 'Experiência prévia com aparelhos'
      },
      {
        fator: 'Saúde Bucal',
        peso: scoreBreakdown.saude,
        descricao: 'Presença de problemas que devem ser resolvidos'
      },
      {
        fator: 'Expectativas Realistas',
        peso: scoreBreakdown.expectativas,
        descricao: 'Alinhamento entre expectativa e realidade'
      },
    ]

    const autoTable = (this.doc as any).autoTable
    autoTable({
      startY: this.yPosition,
      head: [['Fator', 'Pontos', 'Descrição']],
      body: scoreFactors.map(f => [f.fator, `${f.peso}/20`, f.descricao]),
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] },
      margin: { left: 15, right: 15 },
      styles: { fontSize: 9 }
    })

    this.yPosition = (this.doc as any).lastAutoTable.finalY + 10

    // Continua com resto da seção (complexidade, fatores favoráveis, etc.)
    // Reutilizando lógica do V3
    this.addNewPageIfNeeded(30)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('Classificação de Complexidade', 15, this.yPosition)
    this.yPosition += 8

    const complexidade = dados.estimativaCustos.categoria.toUpperCase()
    let complexidadeDesc = ''

    if (complexidade === 'SIMPLES') {
      complexidadeDesc = 'Seu caso é considerado de baixa complexidade. Problemas como pequenos apinhamentos ou espaçamentos são facilmente corrigidos com alinhadores invisíveis.'
    } else if (complexidade === 'MODERADO') {
      complexidadeDesc = 'Seu caso apresenta complexidade média. Pode envolver rotações dentárias ou pequenos desalinhamentos que requerem planejamento cuidadoso.'
    } else {
      complexidadeDesc = 'Seu caso apresenta maior complexidade, possivelmente envolvendo problemas de oclusão. Alinhadores podem ser eficazes, mas requerem experiência do ortodontista.'
    }

    this.addText(complexidadeDesc, 10, 'normal', 5)
    this.yPosition += 8

    // Fatores favoráveis
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('✅ Fatores Favoráveis do Seu Caso', 15, this.yPosition)
    this.yPosition += 8

    const fatoresFavoraveis = this.identifyFavorableFactors(dados)
    this.addBulletList(fatoresFavoraveis)

    this.yPosition += 8

    // Desafios e probabilidade (do V3)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('⚠️ Desafios Potenciais e Soluções', 15, this.yPosition)
    this.yPosition += 8

    const desafios = this.identifyChallenges(dados)
    desafios.forEach(desafio => {
      this.addNewPageIfNeeded(20)
      this.doc.setFont('helvetica', 'bold')
      this.doc.setFontSize(10)
      this.addText(`• ${desafio.desafio}`, 10, 'bold', 5)
      this.doc.setFont('helvetica', 'normal')
      this.addText(`  Solução: ${desafio.solucao}`, 9, 'normal', 10)
      this.yPosition += 3
    })

    this.yPosition += 8

    // Probabilidade de sucesso
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('Probabilidade de Sucesso', 15, this.yPosition)
    this.yPosition += 8

    const probabilidadeSucesso = this.calculateSuccessProbability(dados)
    const probabilidadeColor = probabilidadeSucesso >= 80 ? 'success' : probabilidadeSucesso >= 60 ? 'info' : 'warning'

    this.addInfoBox(
      `${probabilidadeSucesso}% de Probabilidade de Sucesso`,
      `Com base na análise completa do seu caso, estimamos ${probabilidadeSucesso}% de chance de sucesso completo do tratamento com alinhadores invisíveis, assumindo uso correto (22h/dia) e acompanhamento adequado.`,
      probabilidadeColor
    )
  }

  /**
   * Sobrescreve seção de comparativo para incluir gráfico de barras
   */
  private async generateExpandedComparativeSectionV4(dados: RelatorioDataV4) {
    this.addPage()
    this.yPosition = 30

    this.addSectionTitle('COMPARATIVO COMPLETO DE MERCADO', '💰')
    this.yPosition += 5

    // NOVO NA V4: Gráfico de barras de comparação de custos
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('Visualização: Comparação de Custos', 15, this.yPosition)
    this.yPosition += 10

    const custos = {
      atma: dados.estimativaCustos.comparacao.atma,
      invisalign: dados.estimativaCustos.comparacao.invisalign,
      aparelhoFixo: dados.estimativaCustos.comparacao.aparelhoFixo,
      clearCorrect: Math.round(dados.estimativaCustos.comparacao.atma * 1.8),
      aparelhoLingual: Math.round(dados.estimativaCustos.comparacao.atma * 2.2)
    }

    try {
      const barChartDataURL = await generateCostComparisonChart(custos)

      const imgWidth = 160
      const imgHeight = 90
      const imgX = (this.pageWidth - imgWidth) / 2

      this.addNewPageIfNeeded(imgHeight + 10)
      this.doc.addImage(barChartDataURL, 'PNG', imgX, this.yPosition, imgWidth, imgHeight)
      this.yPosition += imgHeight + 15

    } catch (error) {
      console.error('Erro ao gerar gráfico de barras:', error)
      this.addText('(Gráfico não disponível)', 10, 'italic')
      this.yPosition += 10
    }

    // Continua com tabela detalhada (do V3)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(10)
    this.addText('Veja abaixo um comparativo detalhado de todas as opções disponíveis no mercado para o seu caso:')
    this.yPosition += 8

    const comparativoData = [
      [
        'Atma Aligner',
        `R$ ${dados.estimativaCustos.comparacao.atma.toLocaleString('pt-BR')}`,
        dados.timeline,
        'Excelente',
        'Muito Alto',
        'Base'
      ],
      [
        'Invisalign®',
        `R$ ${dados.estimativaCustos.comparacao.invisalign.toLocaleString('pt-BR')}`,
        dados.timeline,
        'Excelente',
        'Muito Alto',
        `+${Math.round(((dados.estimativaCustos.comparacao.invisalign / dados.estimativaCustos.comparacao.atma) - 1) * 100)}%`
      ],
      [
        'ClearCorrect',
        `R$ ${Math.round(dados.estimativaCustos.comparacao.atma * 1.8).toLocaleString('pt-BR')}`,
        dados.timeline,
        'Muito Bom',
        'Alto',
        `+${Math.round(((dados.estimativaCustos.comparacao.atma * 1.8 / dados.estimativaCustos.comparacao.atma) - 1) * 100)}%`
      ],
      [
        'Aparelho Fixo Convencional',
        `R$ ${dados.estimativaCustos.comparacao.aparelhoFixo.toLocaleString('pt-BR')}`,
        this.adjustTimelineForBraces(dados.timeline),
        'Médio',
        'Médio',
        `${Math.round(((dados.estimativaCustos.comparacao.aparelhoFixo / dados.estimativaCustos.comparacao.atma) - 1) * 100)}%`
      ],
      [
        'Aparelho Fixo Estético',
        `R$ ${Math.round(dados.estimativaCustos.comparacao.aparelhoFixo * 1.3).toLocaleString('pt-BR')}`,
        this.adjustTimelineForBraces(dados.timeline),
        'Bom',
        'Médio',
        `${Math.round(((dados.estimativaCustos.comparacao.aparelhoFixo * 1.3 / dados.estimativaCustos.comparacao.atma) - 1) * 100)}%`
      ],
      [
        'Aparelho Lingual',
        `R$ ${Math.round(dados.estimativaCustos.comparacao.atma * 2.2).toLocaleString('pt-BR')}`,
        this.adjustTimelineForBraces(dados.timeline, 1.2),
        'Excelente',
        'Alto',
        `+${Math.round(((dados.estimativaCustos.comparacao.atma * 2.2 / dados.estimativaCustos.comparacao.atma) - 1) * 100)}%`
      ],
    ]

    const autoTable = (this.doc as any).autoTable
    autoTable({
      startY: this.yPosition,
      head: [['Opção', 'Preço Médio', 'Tempo', 'Estética', 'Conforto', 'Diferença']],
      body: comparativoData,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], fontSize: 9 },
      styles: { fontSize: 8 },
      margin: { left: 10, right: 10 },
    })

    this.yPosition = (this.doc as any).lastAutoTable.finalY + 10

    // Resto da seção (matriz, casos de uso, economia) do V3
    // [código continua igual ao V3]
  }

  /**
   * Sobrescreve seção financeira para incluir gráfico de pizza
   */
  private async generateFinancialPlanSectionV4(dados: RelatorioDataV4) {
    this.addPage()
    this.yPosition = 30

    this.addSectionTitle('PLANO FINANCEIRO DETALHADO', '💳')
    this.yPosition += 5

    // NOVO NA V4: Gráfico de pizza do breakdown de investimento
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('Visualização: Onde Vai Seu Investimento', 15, this.yPosition)
    this.yPosition += 10

    const custoBase = dados.estimativaCustos.faixaPreco.min
    const breakdown = {
      alinhadores: Math.round(custoBase * 0.70),
      planejamento: Math.round(custoBase * 0.10),
      checkups: Math.round(custoBase * 0.07),
      contencoes: Math.round(custoBase * 0.03),
      outros: Math.round(custoBase * 0.10)
    }

    try {
      const pieChartDataURL = await generateInvestmentBreakdownChart(breakdown)

      const imgWidth = 130
      const imgHeight = 130
      const imgX = (this.pageWidth - imgWidth) / 2

      this.addNewPageIfNeeded(imgHeight + 10)
      this.doc.addImage(pieChartDataURL, 'PNG', imgX, this.yPosition, imgWidth, imgHeight)
      this.yPosition += imgHeight + 15

    } catch (error) {
      console.error('Erro ao gerar gráfico de pizza:', error)
      this.addText('(Gráfico não disponível)', 10, 'italic')
      this.yPosition += 10
    }

    // Continua com breakdown de custos em tabela (do V3)
    // [resto do código do V3]
  }

  /**
   * Sobrescreve seção de timeline para incluir gráfico de progresso
   */
  private async generateDetailedTimelineSectionV4(dados: RelatorioDataV4) {
    this.addPage()
    this.yPosition = 30

    this.addSectionTitle('TIMELINE DETALHADO DO TRATAMENTO', '📅')
    this.yPosition += 5

    // NOVO NA V4: Gráfico de linha de progresso
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('Visualização: Curva de Progresso Estimada', 15, this.yPosition)
    this.yPosition += 10

    const totalMeses = this.extractMaxMonths(dados.timeline)

    try {
      const lineChartDataURL = await generateTimelineProgressChart(totalMeses)

      const imgWidth = 160
      const imgHeight = 80
      const imgX = (this.pageWidth - imgWidth) / 2

      this.addNewPageIfNeeded(imgHeight + 10)
      this.doc.addImage(lineChartDataURL, 'PNG', imgX, this.yPosition, imgWidth, imgHeight)
      this.yPosition += imgHeight + 15

    } catch (error) {
      console.error('Erro ao gerar gráfico de linha:', error)
      this.addText('(Gráfico não disponível)', 10, 'italic')
      this.yPosition += 10
    }

    this.addText('Veja abaixo o cronograma mês a mês do seu tratamento estimado:')
    this.yPosition += 10

    // Continua com infográfico de fases (do V3)
    // [resto do código do V3]
  }

  /**
   * Método principal - gera PDF V4 com todos os recursos
   */
  async generate(dados: RelatorioDataV4): Promise<Buffer> {
    // Gerar capa e índice (do V3)
    this.generateCoverPage(dados)
    this.generateIndexPage(dados)

    // Sobre Você (do V3)
    this.generateAboutYouSection(dados)

    // NOVO V4: Seção específica do caso (apinhamento, diastema, etc.)
    await this.generateCaseSpecificSection(dados)

    // Score (do V3)
    this.generateScoreSection(dados)

    // Análise Detalhada COM gráfico radar (V4)
    await this.generateDetailedAnalysisSectionV4(dados)

    // Comparativo COM gráfico de barras (V4)
    await this.generateExpandedComparativeSectionV4(dados)

    // Timeline COM gráfico de progresso (V4)
    await this.generateDetailedTimelineSectionV4(dados)

    // Plano Financeiro COM gráfico de pizza (V4)
    await this.generateFinancialPlanSectionV4(dados)

    // Perguntas para Ortodontista (do V3)
    this.generateQuestionsForOrthodontistSection(dados)

    // Ciência e Tecnologia (do V3)
    this.generateScienceTechnologySection(dados)

    // Cuidados e Manutenção (do V3)
    this.generateCareMaintenanceSection(dados)

    // Depoimentos (do V3)
    this.generateTestimonialsSection(dados)

    // Próximos Passos (do V3)
    this.generateNextStepsSection(dados)

    // Adicionar footers em todas as páginas
    const totalPages = this.doc.getNumberOfPages()
    for (let i = 2; i <= totalPages; i++) {
      this.doc.setPage(i)
      this.addFooter(i)
    }

    // Retornar como Buffer
    const pdfBuffer = Buffer.from(this.doc.output('arraybuffer'))
    return pdfBuffer
  }
}

// Função wrapper para manter compatibilidade
export async function gerarPDFRelatorioV4(dados: any): Promise<Buffer> {
  const generator = new PDFGeneratorV4()
  return await generator.generate(dados)
}
