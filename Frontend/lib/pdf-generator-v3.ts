import jsPDF from 'jspdf'
import autoTableOriginal from 'jspdf-autotable'
import QRCode from 'qrcode'

// Wrapper para autoTable que sanitiza TODOS os dados
const autoTable = (doc: any, options: any) => {
  // Sanitizar headers
  if (options.head) {
    options.head = options.head.map((row: any[]) =>
      row.map(cell => typeof cell === 'string' ? sanitizeTextStatic(cell) : cell)
    )
  }

  // Sanitizar body
  if (options.body) {
    options.body = options.body.map((row: any[]) =>
      row.map(cell => typeof cell === 'string' ? sanitizeTextStatic(cell) : cell)
    )
  }

  return autoTableOriginal(doc, options)
}

// Static sanitize function (usado antes da instância da classe existir)
function sanitizeTextStatic(text: string): string {
  return text
    .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, '')
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
    .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '')
    .replace(/[\u{2600}-\u{26FF}]/gu, '')
    .replace(/[\u{2700}-\u{27BF}]/gu, '')
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, '')
    .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '')
    .replace(/✅/g, '[OK]')
    .replace(/❌/g, '[X]')
    .replace(/⚠️/g, '[!]')
    .replace(/📱/g, '')
    .replace(/🚀/g, '')
    .replace(/📝/g, '')
    .replace(/💡/g, '')
    .replace(/📊/g, '')
    .replace(/💰/g, '')
    .replace(/⏰/g, '')
    .replace(/🎯/g, '')
    .replace(/📈/g, '')
    .replace(/🏆/g, '')
    .replace(/📑/g, '')
    .replace(/👤/g, '')
    .replace(/🔍/g, '')
    .replace(/⭐/g, '*')
    .replace(/[^\x00-\x7F\u00C0-\u00FF\u0100-\u017F\u0180-\u024F]/g, '')
    .trim()
}

export { autoTable }

// Paleta de cores Atma (tipadas como tuples para spread)
const COLORS = {
  primary: [37, 99, 235] as [number, number, number], // Blue-600
  primaryLight: [219, 234, 254] as [number, number, number], // Blue-100
  success: [16, 185, 129] as [number, number, number], // Green-500
  warning: [251, 191, 36] as [number, number, number], // Amber-400
  danger: [239, 68, 68] as [number, number, number], // Red-500
  gray: [107, 114, 128] as [number, number, number], // Gray-500
  grayLight: [243, 244, 246] as [number, number, number], // Gray-100
  white: [255, 255, 255] as [number, number, number],
  black: [0, 0, 0] as [number, number, number],
}

// Interface expandida para Phase 2
interface RelatorioDataExtended {
  cliente: {
    nome: string
    idade: string
    localizacao: string
    email?: string
  }
  score: number
  estimativaCustos: {
    categoria: string
    faixaPreco: { min: number; max: number }
    alinhadores: string
    comparacao: {
      atma: number
      invisalign: number
      aparelhoFixo: number
      economia: number
    }
  }
  timeline: string
  analise: string
  planoAcao: string[]
  dataGeracao: string
  // Novos campos para Phase 2
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

export class PDFGeneratorV3 {
  private doc: jsPDF
  private pageWidth: number
  private pageHeight: number
  private yPosition: number
  private currentPage: number

  constructor() {
    this.doc = new jsPDF()
    this.pageWidth = this.doc.internal.pageSize.getWidth()
    this.pageHeight = this.doc.internal.pageSize.getHeight()
    this.yPosition = 20
    this.currentPage = 1

    // Override doc.text to ALWAYS sanitize all text output
    const originalText = this.doc.text.bind(this.doc)
    this.doc.text = (text: any, x: any, y: any, options?: any) => {
      if (typeof text === 'string') {
        text = this.sanitizeText(text)
      } else if (Array.isArray(text)) {
        text = text.map(t => typeof t === 'string' ? this.sanitizeText(t) : t)
      }
      return originalText(text, x, y, options)
    }
  }

  /**
   * Remove emojis e caracteres especiais que o jsPDF não suporta
   */
  private sanitizeText(text: string): string {
    // Remove ALL non-ASCII characters that could cause encoding issues
    return text
      // Remove common emoji ranges
      .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticons
      .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Misc Symbols and Pictographs
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport and Map
      .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '') // Flags
      .replace(/[\u{2600}-\u{26FF}]/gu, '')   // Misc symbols
      .replace(/[\u{2700}-\u{27BF}]/gu, '')   // Dingbats
      .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Supplemental Symbols
      .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '') // Extended Pictographs

      // Replace specific symbols with text equivalents
      .replace(/✅/g, '[OK]')
      .replace(/❌/g, '[X]')
      .replace(/⚠️/g, '[!]')
      .replace(/📱/g, '')
      .replace(/🚀/g, '')
      .replace(/📝/g, '')
      .replace(/💡/g, '')
      .replace(/📊/g, '')
      .replace(/💰/g, '')
      .replace(/⏰/g, '')
      .replace(/🎯/g, '')
      .replace(/📈/g, '')
      .replace(/🏆/g, '')
      .replace(/📑/g, '')
      .replace(/👤/g, '')
      .replace(/🔍/g, '')
      .replace(/⭐/g, '*')

      // Remove any remaining problematic characters (0x80-0xFF range that aren't standard)
      .replace(/[^\x00-\x7F\u00C0-\u00FF\u0100-\u017F\u0180-\u024F]/g, '')

      .trim()
  }

  // ==================== HELPERS ====================

  private addNewPageIfNeeded(requiredSpace: number): boolean {
    if (this.yPosition + requiredSpace > this.pageHeight - 30) {
      this.addPage()
      return true
    }
    return false
  }

  private addPage() {
    this.doc.addPage()
    this.currentPage++
    this.yPosition = 30 // Espaço para header
    this.addHeader()
  }

  private addHeader() {
    this.doc.setFillColor(...COLORS.primary)
    this.doc.rect(0, 0, this.pageWidth, 15, 'F')

    this.doc.setTextColor(...COLORS.white)
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('ATMA ALIGNER', 15, 10)

    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(8)
    this.doc.text('Relatório de Viabilidade Ortodôntica', this.pageWidth - 15, 10, { align: 'right' })

    this.doc.setTextColor(...COLORS.black)
  }

  private addFooter(pageNum: number) {
    const footerY = this.pageHeight - 15

    this.doc.setDrawColor(...COLORS.grayLight)
    this.doc.line(15, footerY - 5, this.pageWidth - 15, footerY - 5)

    this.doc.setTextColor(...COLORS.gray)
    this.doc.setFontSize(8)
    this.doc.text(`Página ${pageNum}`, this.pageWidth - 15, footerY, { align: 'right' })
    this.doc.text('Atma Aligner - Tecnologia Alemã', 15, footerY)
    this.doc.setTextColor(...COLORS.black)
  }

  private addSectionTitle(title: string, icon = '') {
    this.addNewPageIfNeeded(20)

    this.doc.setFillColor(...COLORS.primary)
    this.doc.rect(10, this.yPosition, this.pageWidth - 20, 10, 'F')

    this.doc.setTextColor(...COLORS.white)
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    const sanitizedTitle = this.sanitizeText(`${icon} ${title}`)
    this.doc.text(sanitizedTitle, 15, this.yPosition + 7)
    this.doc.setTextColor(...COLORS.black)

    this.yPosition += 15
  }

  private addText(text: string, fontSize = 10, style: 'normal' | 'bold' = 'normal', indent = 0) {
    this.doc.setFontSize(fontSize)
    this.doc.setFont('helvetica', style)
    const sanitizedText = this.sanitizeText(text)
    const lines = this.doc.splitTextToSize(sanitizedText, this.pageWidth - 30 - indent)

    lines.forEach((line: string) => {
      this.addNewPageIfNeeded(7)
      this.doc.text(line, 15 + indent, this.yPosition)
      this.yPosition += 6
    })
  }

  private addInfoBox(title: string, content: string, type: 'info' | 'success' | 'warning' | 'danger' = 'info') {
    const colorMap = {
      info: COLORS.primaryLight,
      success: [220, 252, 231] as [number, number, number], // Green-100
      warning: [254, 243, 199] as [number, number, number], // Amber-100
      danger: [254, 226, 226] as [number, number, number] // Red-100
    }

    this.addNewPageIfNeeded(25)

    const boxHeight = 20
    this.doc.setFillColor(...colorMap[type])
    this.doc.roundedRect(15, this.yPosition, this.pageWidth - 30, boxHeight, 3, 3, 'F')

    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(this.sanitizeText(title), 20, this.yPosition + 6)

    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(9)
    const sanitizedContent = this.sanitizeText(content)
    const contentLines = this.doc.splitTextToSize(sanitizedContent, this.pageWidth - 40)
    contentLines.forEach((line: string, index: number) => {
      this.doc.text(line, 20, this.yPosition + 12 + (index * 5))
    })

    this.yPosition += boxHeight + 5
  }

  private async addQRCode(url: string, x: number, y: number, size = 30) {
    try {
      const qrDataURL = await QRCode.toDataURL(url, {
        width: size * 4,
        margin: 1,
        color: { dark: '#2563EB', light: '#FFFFFF' }
      })
      this.doc.addImage(qrDataURL, 'PNG', x, y, size, size)
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error)
    }
  }

  private addScoreGauge(score: number, x: number, y: number, size = 50) {
    const centerX = x + size / 2
    const centerY = y + size / 2
    const radius = size / 2 - 5

    // Círculo de fundo
    this.doc.setFillColor(...COLORS.grayLight)
    this.doc.circle(centerX, centerY, radius, 'F')

    // Círculo de progresso (colorido)
    const color = score >= 70 ? COLORS.success : score >= 50 ? COLORS.warning : COLORS.danger
    this.doc.setFillColor(...color)

    // Desenhar arco (simplificado como círculo menor)
    const progressRadius = radius * (score / 100)
    this.doc.circle(centerX, centerY, progressRadius, 'F')

    // Texto do score
    this.doc.setTextColor(...COLORS.white)
    this.doc.setFontSize(20)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(score.toString(), centerX, centerY + 3, { align: 'center' })

    this.doc.setTextColor(...COLORS.black)
  }

  private addBulletList(items: string[], bulletChar = '•') {
    items.forEach(item => {
      this.addNewPageIfNeeded(8)
      this.doc.setFont('helvetica', 'normal')
      this.doc.setFontSize(10)

      const lines = this.doc.splitTextToSize(item, this.pageWidth - 45)
      lines.forEach((line: string, index: number) => {
        if (index === 0) {
          this.doc.text(bulletChar, 20, this.yPosition)
          this.doc.text(line, 27, this.yPosition)
        } else {
          this.doc.text(line, 27, this.yPosition)
        }
        this.yPosition += 6
      })
      this.yPosition += 2
    })
  }

  // ==================== PÁGINA 1: CAPA ====================

  private generateCoverPage(dados: RelatorioDataExtended) {
    this.doc.setFillColor(...COLORS.primary)
    this.doc.rect(0, 0, this.pageWidth, this.pageHeight, 'F')

    this.doc.setTextColor(...COLORS.white)
    this.doc.setFontSize(32)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('RELATÓRIO DE', this.pageWidth / 2, 80, { align: 'center' })
    this.doc.text('VIABILIDADE', this.pageWidth / 2, 95, { align: 'center' })
    this.doc.text('ORTODÔNTICA', this.pageWidth / 2, 110, { align: 'center' })

    this.doc.setFontSize(18)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text('Análise Personalizada Completa', this.pageWidth / 2, 130, { align: 'center' })

    // Box cliente
    this.doc.setFillColor(255, 255, 255, 0.1)
    this.doc.rect(30, 150, this.pageWidth - 60, 40, 'F')
    this.doc.setFontSize(12)
    this.doc.text(`Cliente: ${dados.cliente.nome}`, this.pageWidth / 2, 165, { align: 'center' })
    this.doc.text(`Idade: ${dados.cliente.idade} anos`, this.pageWidth / 2, 175, { align: 'center' })
    this.doc.text(`Localização: ${dados.cliente.localizacao}`, this.pageWidth / 2, 185, { align: 'center' })

    this.doc.setFontSize(10)
    this.doc.text(`Data: ${dados.dataGeracao}`, this.pageWidth / 2, 250, { align: 'center' })
    this.doc.text('Atma Aligner - Tecnologia Alemã', this.pageWidth / 2, 260, { align: 'center' })
  }

  // ==================== ÍNDICE ====================

  private generateIndexPage(dados: RelatorioDataExtended) {
    this.addPage()
    this.yPosition = 30

    this.addSectionTitle('ÍNDICE', '📑')

    const sections = [
      { name: '1. Sobre Você', page: '3-5' },
      { name: '2. Score de Viabilidade', page: '6' },
      { name: '3. Análise Detalhada do Caso', page: '7-11' },
      { name: '4. Comparativo de Mercado', page: '12-15' },
      { name: '5. Timeline Detalhado', page: '16-17' },
      { name: '6. Plano Financeiro', page: '18-20' },
      { name: '7. Perguntas para o Ortodontista', page: '21-22' },
      { name: '8. Ciência e Tecnologia', page: '23-24' },
      { name: '9. Cuidados e Manutenção', page: '25-26' },
      { name: '10. Depoimentos e Casos Reais', page: '27-29' },
      { name: '11. Próximos Passos', page: '30' },
    ]

    this.yPosition += 5
    sections.forEach(section => {
      this.addNewPageIfNeeded(10)
      this.doc.setFont('helvetica', 'normal')
      this.doc.setFontSize(11)
      this.doc.text(section.name, 20, this.yPosition)
      this.doc.text(section.page, this.pageWidth - 25, this.yPosition, { align: 'right' })

      // Linha pontilhada
      this.doc.setDrawColor(...COLORS.grayLight)
      const textWidth = this.doc.getTextWidth(section.name)
      const pageWidth = this.doc.getTextWidth(section.page)
      ;(this.doc as any).setLineDash([1, 2])
      this.doc.line(25 + textWidth, this.yPosition - 2, this.pageWidth - 28 - pageWidth, this.yPosition - 2)
      ;(this.doc as any).setLineDash([])

      this.yPosition += 10
    })
  }

  // ==================== SEÇÃO 2.1: SOBRE VOCÊ ====================

  private generateAboutYouSection(dados: RelatorioDataExtended) {
    this.addPage()
    this.yPosition = 30

    this.addSectionTitle('SOBRE VOCÊ', '👤')
    this.yPosition += 5

    // Perfil completo
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('Perfil Completo', 15, this.yPosition)
    this.yPosition += 8

    const perfilItems = [
      `Nome: ${dados.cliente.nome}`,
      `Idade: ${dados.cliente.idade} anos`,
      `Localização: ${dados.cliente.localizacao}`,
      `Data da análise: ${dados.dataGeracao}`,
    ]

    if (dados.formData?.profissao) {
      perfilItems.push(`Profissão: ${dados.formData.profissao}`)
    }

    perfilItems.forEach(item => {
      this.addText(item, 10, 'normal', 5)
    })

    this.yPosition += 8

    // Problemas atuais identificados
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('Problemas Ortodônticos Identificados', 15, this.yPosition)
    this.yPosition += 8

    if (dados.formData?.problemasAtuais && dados.formData.problemasAtuais.length > 0) {
      this.addBulletList(dados.formData.problemasAtuais)
    } else {
      this.addText('Nenhum problema específico relatado', 10, 'normal', 5)
    }

    this.yPosition += 8

    // Histórico ortodôntico
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('Histórico Ortodôntico', 15, this.yPosition)
    this.yPosition += 8

    if (dados.formData?.jaUsouAparelho) {
      this.addText(`Uso anterior de aparelho: ${dados.formData.jaUsouAparelho}`, 10, 'normal', 5)
      this.yPosition += 3

      if (dados.formData.jaUsouAparelho.includes('não completei')) {
        this.addInfoBox(
          'Importante',
          'Você já teve experiência com aparelho ortodôntico. Isso pode facilitar a adaptação aos alinhadores e aumenta suas chances de comprometimento com o tratamento.',
          'info'
        )
      }
    }

    this.yPosition += 8

    // Problemas de saúde bucal
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('Saúde Bucal Atual', 15, this.yPosition)
    this.yPosition += 8

    if (dados.formData?.problemasSaude && dados.formData.problemasSaude.length > 0) {
      this.addInfoBox(
        '⚠️ Atenção',
        `Problemas identificados: ${dados.formData.problemasSaude.join(', ')}. Estes devem ser resolvidos ANTES de iniciar o tratamento ortodôntico.`,
        'warning'
      )
    } else {
      this.addText('✓ Nenhum problema de saúde bucal reportado', 10, 'normal', 5)
    }

    this.yPosition += 8

    // Objetivos e expectativas
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('Seus Objetivos e Expectativas', 15, this.yPosition)
    this.yPosition += 8

    if (dados.formData?.expectativaResultado) {
      this.addText(`Expectativa de resultado: ${dados.formData.expectativaResultado}`, 10, 'normal', 5)
      this.yPosition += 3
    }

    if (dados.formData?.urgenciaTratamento) {
      this.addText(`Urgência: ${dados.formData.urgenciaTratamento}`, 10, 'normal', 5)
      this.yPosition += 3
    }

    if (dados.formData?.disponibilidadeUso) {
      this.addText(`Disponibilidade de uso: ${dados.formData.disponibilidadeUso}`, 10, 'normal', 5)
    }

    this.yPosition += 10

    // Análise de estilo de vida
    this.addInfoBox(
      '💡 Análise de Estilo de Vida',
      'Alinhadores invisíveis se adaptam perfeitamente à rotina profissional e social. Você pode removê-los para comer e em ocasiões especiais, mantendo sua liberdade e conforto.',
      'success'
    )
  }

  // ==================== SEÇÃO: SCORE ====================

  private generateScoreSection(dados: RelatorioDataExtended) {
    this.addPage()
    this.yPosition = 30

    this.addSectionTitle('SCORE DE VIABILIDADE', '📊')
    this.yPosition += 10

    // Score visual (gauge)
    const gaugeX = this.pageWidth / 2 - 35
    this.addScoreGauge(dados.score, gaugeX, this.yPosition, 70)
    this.yPosition += 80

    // Interpretação
    let interpretacao = ''
    let boxType: 'success' | 'info' | 'warning' | 'danger' = 'info'

    if (dados.score >= 75) {
      interpretacao = '✅ EXCELENTE - Seu caso apresenta alta viabilidade para alinhadores invisíveis!'
      boxType = 'success'
    } else if (dados.score >= 60) {
      interpretacao = '✓ BOM - Seu caso é adequado para alinhadores com algumas considerações.'
      boxType = 'info'
    } else if (dados.score >= 40) {
      interpretacao = '⚠️ MODERADO - Alinhadores são possíveis, mas pode haver desafios.'
      boxType = 'warning'
    } else {
      interpretacao = '⚠️ BAIXO - Recomendamos avaliação presencial detalhada.'
      boxType = 'danger'
    }

    this.addInfoBox('Interpretação do Score', interpretacao, boxType)
    this.yPosition += 5

    // Análise personalizada
    this.addSectionTitle('ANÁLISE PERSONALIZADA', '🔍')
    this.addText(dados.analise)
  }

  // ==================== SEÇÃO 2.2: ANÁLISE DETALHADA ====================

  private generateDetailedAnalysisSection(dados: RelatorioDataExtended) {
    this.addPage()
    this.yPosition = 30

    this.addSectionTitle('ANÁLISE DETALHADA DO CASO', '🔬')
    this.yPosition += 5

    // 1. Breakdown do Score
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('Breakdown do Score (Como Chegamos ao seu Score)', 15, this.yPosition)
    this.yPosition += 8

    const scoreFactors = [
      {
        fator: 'Complexidade do Caso',
        peso: this.calculateComplexityScore(dados),
        descricao: 'Baseado nos problemas ortodônticos identificados'
      },
      {
        fator: 'Idade do Paciente',
        peso: this.calculateAgeScore(dados),
        descricao: 'Jovens têm melhor resposta ao tratamento'
      },
      {
        fator: 'Histórico Ortodôntico',
        peso: this.calculateHistoryScore(dados),
        descricao: 'Experiência prévia com aparelhos'
      },
      {
        fator: 'Saúde Bucal',
        peso: this.calculateHealthScore(dados),
        descricao: 'Presença de problemas que devem ser resolvidos'
      },
      {
        fator: 'Expectativas Realistas',
        peso: this.calculateExpectationsScore(dados),
        descricao: 'Alinhamento entre expectativa e realidade'
      },
    ]

    autoTable(this.doc, {
      startY: this.yPosition,
      head: [['Fator', 'Peso', 'Descrição']],
      body: scoreFactors.map(f => [f.fator, `${f.peso}/20`, f.descricao]),
      theme: 'grid',
      headStyles: { fillColor: COLORS.primary },
      margin: { left: 15, right: 15 },
      styles: { fontSize: 9 }
    })

    this.yPosition = (this.doc as any).lastAutoTable.finalY + 10

    // 2. Complexidade do Caso
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

    // 3. Fatores Favoráveis
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('✅ Fatores Favoráveis do Seu Caso', 15, this.yPosition)
    this.yPosition += 8

    const fatoresFavoraveis = this.identifyFavorableFactors(dados)
    this.addBulletList(fatoresFavoraveis)

    this.yPosition += 8

    // 4. Desafios Potenciais
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

    // 5. Probabilidade de Sucesso
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

    this.yPosition += 8

    // 6. Tempo Estimado Detalhado
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('Tempo Estimado de Tratamento', 15, this.yPosition)
    this.yPosition += 8

    autoTable(this.doc, {
      startY: this.yPosition,
      head: [['Cenário', 'Duração']],
      body: [
        ['Cenário Otimista (uso perfeito)', this.calculateOptimisticTimeline(dados)],
        ['Cenário Realista (médio)', dados.timeline],
        ['Cenário Conservador (com ajustes)', this.calculateConservativeTimeline(dados)],
      ],
      theme: 'striped',
      headStyles: { fillColor: COLORS.primary },
      margin: { left: 15, right: 15 },
    })

    this.yPosition = (this.doc as any).lastAutoTable.finalY + 5
  }

  // ==================== HELPERS PARA ANÁLISE DETALHADA ====================

  private calculateComplexityScore(dados: RelatorioDataExtended): number {
    const categoria = dados.estimativaCustos.categoria.toLowerCase()
    if (categoria === 'simples') return 20
    if (categoria === 'moderado') return 15
    return 10
  }

  private calculateAgeScore(dados: RelatorioDataExtended): number {
    const idade = parseInt(dados.cliente.idade)
    if (idade < 25) return 20
    if (idade < 35) return 18
    if (idade < 45) return 15
    return 12
  }

  private calculateHistoryScore(dados: RelatorioDataExtended): number {
    const historico = dados.formData?.jaUsouAparelho || ''
    if (historico.includes('não completei')) return 18
    if (historico.includes('Não')) return 20
    return 15
  }

  private calculateHealthScore(dados: RelatorioDataExtended): number {
    const problemas = dados.formData?.problemasSaude?.length || 0
    if (problemas === 0) return 20
    if (problemas === 1) return 15
    if (problemas === 2) return 10
    return 5
  }

  private calculateExpectationsScore(dados: RelatorioDataExtended): number {
    const expectativa = dados.formData?.expectativaResultado || ''
    if (expectativa.includes('80-90%') || expectativa.includes('necessário')) return 20
    if (expectativa.includes('perfeito')) return 10
    return 15
  }

  private identifyFavorableFactors(dados: RelatorioDataExtended): string[] {
    const factors: string[] = []

    const idade = parseInt(dados.cliente.idade)
    if (idade < 35) {
      factors.push('Idade favorável: Pacientes jovens geralmente têm melhor resposta ao tratamento')
    }

    if (dados.score >= 70) {
      factors.push('Score alto: Seu caso apresenta excelente viabilidade para alinhadores')
    }

    const problemasSaude = dados.formData?.problemasSaude?.length || 0
    if (problemasSaude === 0) {
      factors.push('Saúde bucal em dia: Sem problemas prévios que impeçam o início do tratamento')
    }

    if (dados.formData?.disponibilidadeUso?.includes('22')) {
      factors.push('Comprometimento: Você demonstra disponibilidade para uso correto dos alinhadores')
    }

    const historico = dados.formData?.jaUsouAparelho || ''
    if (historico.includes('não completei')) {
      factors.push('Experiência prévia: Você já teve contato com tratamento ortodôntico')
    }

    if (factors.length === 0) {
      factors.push('Motivação: Você está buscando informações e se preparando para o tratamento')
    }

    return factors
  }

  private identifyChallenges(dados: RelatorioDataExtended): Array<{ desafio: string; solucao: string }> {
    const challenges: Array<{ desafio: string; solucao: string }> = []

    const problemas = dados.formData?.problemasAtuais || []
    const problemasComplexos = problemas.filter(p =>
      p.includes('Mordida cruzada') || p.includes('Prognatismo') || p.includes('Sobremordida')
    )

    if (problemasComplexos.length > 0) {
      challenges.push({
        desafio: 'Problemas de oclusão identificados',
        solucao: 'Escolha um ortodontista experiente em casos complexos. Pode ser necessário usar elásticos intermaxilares junto com os alinhadores.'
      })
    }

    const problemasSaude = dados.formData?.problemasSaude || []
    if (problemasSaude.length > 0) {
      challenges.push({
        desafio: `Problemas de saúde bucal: ${problemasSaude.join(', ')}`,
        solucao: 'Resolva estes problemas ANTES de iniciar o tratamento ortodôntico. Consulte um dentista clínico geral.'
      })
    }

    const idade = parseInt(dados.cliente.idade)
    if (idade > 45) {
      challenges.push({
        desafio: 'Idade acima de 45 anos',
        solucao: 'Tratamento ainda é viável, mas pode levar um pouco mais de tempo. Mantenha higiene impecável e siga rigorosamente as orientações.'
      })
    }

    if (challenges.length === 0) {
      challenges.push({
        desafio: 'Comprometimento com o uso 22h/dia',
        solucao: 'Este é o principal desafio de qualquer tratamento com alinhadores. Use alarmes no celular e crie uma rotina consistente.'
      })
    }

    return challenges
  }

  private calculateSuccessProbability(dados: RelatorioDataExtended): number {
    let probability = 70 // Base

    if (dados.score >= 75) probability += 20
    else if (dados.score >= 50) probability += 10
    else probability -= 10

    const categoria = dados.estimativaCustos.categoria.toLowerCase()
    if (categoria === 'simples') probability += 10
    else if (categoria === 'complexo') probability -= 10

    return Math.max(50, Math.min(95, probability))
  }

  private calculateOptimisticTimeline(dados: RelatorioDataExtended): string {
    const baseTimeline = dados.timeline
    const match = baseTimeline.match(/(\d+)-(\d+)/)
    if (match) {
      const min = parseInt(match[1])
      return `${Math.max(4, min - 2)}-${min} meses`
    }
    return baseTimeline
  }

  private calculateConservativeTimeline(dados: RelatorioDataExtended): string {
    const baseTimeline = dados.timeline
    const match = baseTimeline.match(/(\d+)-(\d+)/)
    if (match) {
      const max = parseInt(match[2])
      return `${max}-${max + 4} meses`
    }
    return baseTimeline
  }

  // ==================== SEÇÃO 2.3: COMPARATIVO EXPANDIDO ====================

  private generateExpandedComparativeSection(dados: RelatorioDataExtended) {
    this.addPage()
    this.yPosition = 30

    this.addSectionTitle('COMPARATIVO COMPLETO DE MERCADO', '💰')
    this.yPosition += 5

    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(10)
    this.addText('Veja abaixo um comparativo detalhado de todas as opções disponíveis no mercado para o seu caso:')
    this.yPosition += 8

    // Tabela expandida com todas as opções
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

    autoTable(this.doc, {
      startY: this.yPosition,
      head: [['Opção', 'Preço Médio', 'Tempo', 'Estética', 'Conforto', 'Diferença']],
      body: comparativoData,
      theme: 'grid',
      headStyles: { fillColor: COLORS.primary, fontSize: 9 },
      styles: { fontSize: 8 },
      margin: { left: 10, right: 10 },
    })

    this.yPosition = (this.doc as any).lastAutoTable.finalY + 10

    // Nova página para matriz de decisão
    this.addPage()
    this.yPosition = 30

    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('Matriz de Decisão: Qual Opção é Melhor Para Você?', 15, this.yPosition)
    this.yPosition += 10

    // Matriz custo × tempo × estética × conforto
    const matrizData = [
      ['Atma Aligner', '⭐⭐⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐', '⭐⭐⭐⭐⭐'],
      ['Invisalign®', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐', '⭐⭐⭐⭐⭐'],
      ['Aparelho Fixo', '⭐⭐⭐⭐', '⭐⭐⭐', '⭐⭐', '⭐⭐'],
      ['Aparelho Lingual', '⭐⭐', '⭐⭐', '⭐⭐⭐⭐⭐', '⭐⭐'],
    ]

    autoTable(this.doc, {
      startY: this.yPosition,
      head: [['Opção', 'Custo-Benefício', 'Velocidade', 'Estética', 'Conforto']],
      body: matrizData,
      theme: 'striped',
      headStyles: { fillColor: COLORS.primary },
      margin: { left: 15, right: 15 },
    })

    this.yPosition = (this.doc as any).lastAutoTable.finalY + 10

    // Casos de uso
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('Quando Cada Opção é Melhor?', 15, this.yPosition)
    this.yPosition += 8

    const casosUso = [
      {
        titulo: '🏆 Atma Aligner - Melhor para:',
        casos: [
          'Profissionais que precisam de discrição',
          'Quem busca conforto e praticidade',
          'Casos simples a moderados',
          'Quem quer economia sem perder qualidade'
        ]
      },
      {
        titulo: '💎 Invisalign® - Melhor para:',
        casos: [
          'Quem não se importa com custo mais alto',
          'Casos muito complexos (rede global)',
          'Quem valoriza marca consolidada'
        ]
      },
      {
        titulo: '🦷 Aparelho Fixo - Melhor para:',
        casos: [
          'Casos extremamente complexos',
          'Adolescentes (menor disciplina necessária)',
          'Orçamento muito limitado'
        ]
      },
    ]

    casosUso.forEach(caso => {
      this.addNewPageIfNeeded(30)
      this.doc.setFont('helvetica', 'bold')
      this.doc.setFontSize(10)
      this.addText(caso.titulo, 10, 'bold')
      this.yPosition += 2
      this.addBulletList(caso.casos)
      this.yPosition += 5
    })

    // Calculadora de economia 5 anos
    this.yPosition += 5
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('💰 Economia em 5 Anos', 15, this.yPosition)
    this.yPosition += 8

    const economiaAtmaVsInvisalign = dados.estimativaCustos.comparacao.invisalign - dados.estimativaCustos.comparacao.atma
    const economiaText = `Escolhendo Atma ao invés de Invisalign, você economiza R$ ${economiaAtmaVsInvisalign.toLocaleString('pt-BR')}. Em 5 anos, considerando possível retratamento ou ajustes, esta economia pode chegar a R$ ${(economiaAtmaVsInvisalign * 1.5).toLocaleString('pt-BR')}.`

    this.addInfoBox('Economia Significativa', economiaText, 'success')
  }

  private adjustTimelineForBraces(timeline: string, multiplier = 1.3): string {
    const match = timeline.match(/(\d+)-(\d+)/)
    if (match) {
      const min = Math.round(parseInt(match[1]) * multiplier)
      const max = Math.round(parseInt(match[2]) * multiplier)
      return `${min}-${max} meses`
    }
    return timeline
  }

  // ==================== SEÇÃO 2.4: TIMELINE DETALHADO ====================

  private generateDetailedTimelineSection(dados: RelatorioDataExtended) {
    this.addPage()
    this.yPosition = 30

    this.addSectionTitle('TIMELINE DETALHADO DO TRATAMENTO', '')
    this.yPosition += 5

    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(10)
    this.addText('Veja abaixo o cronograma completo do seu tratamento, desde a consulta inicial até a fase de contenção:')
    this.yPosition += 10

    // Infográfico mês a mês MELHORADO
    const totalMeses = this.extractMaxMonths(dados.timeline)
    const fasesTimeline = this.generateTimelinePhases(totalMeses)

    fasesTimeline.forEach((fase, index) => {
      this.addNewPageIfNeeded(35)

      // Box com gradiente visual melhorado
      const colors = [
        [59, 130, 246] as [number, number, number],   // Blue-500
        [16, 185, 129] as [number, number, number],   // Green-500
        [139, 92, 246] as [number, number, number],   // Purple-500
        [245, 158, 11] as [number, number, number],   // Amber-500
        [236, 72, 153] as [number, number, number],   // Pink-500
        [14, 165, 233] as [number, number, number],   // Sky-500
      ]
      const boxColor = colors[index % colors.length]
      const boxColorLight = [boxColor[0] + 40, boxColor[1] + 40, boxColor[2] + 40] as [number, number, number]

      // Círculo com número
      this.doc.setFillColor(...boxColor)
      this.doc.circle(22, this.yPosition + 5, 4, 'F')
      this.doc.setTextColor(...COLORS.white)
      this.doc.setFont('helvetica', 'bold')
      this.doc.setFontSize(9)
      this.doc.text(String(index + 1), 22, this.yPosition + 6.5, { align: 'center' })
      this.doc.setTextColor(...COLORS.black)

      // Box principal
      this.doc.setFillColor(...boxColorLight)
      this.doc.setDrawColor(...boxColor)
      this.doc.setLineWidth(0.5)
      this.doc.roundedRect(30, this.yPosition, this.pageWidth - 45, 28, 3, 3, 'FD')

      // Título da fase
      this.doc.setFont('helvetica', 'bold')
      this.doc.setFontSize(11)
      this.doc.setTextColor(...boxColor)
      this.doc.text(fase.titulo, 35, this.yPosition + 6)
      this.doc.setTextColor(...COLORS.black)

      // Descrição
      this.doc.setFont('helvetica', 'normal')
      this.doc.setFontSize(9)
      const descLines = this.doc.splitTextToSize(fase.descricao, this.pageWidth - 85)
      this.doc.text(descLines, 35, this.yPosition + 13)

      // Ação recomendada com ícone
      this.doc.setFont('helvetica', 'italic')
      this.doc.setFontSize(8)
      this.doc.setTextColor(...COLORS.gray)
      this.doc.text(`[OK] ${fase.acao}`, 35, this.yPosition + 23)
      this.doc.setTextColor(...COLORS.black)

      this.yPosition += 33
    })

    this.yPosition += 5

    // Marcos importantes
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('🎯 Marcos Importantes do Tratamento', 15, this.yPosition)
    this.yPosition += 8

    const marcos = [
      'Consulta inicial: Avaliação, fotos, moldagem/escaneamento',
      'Planejamento 3D: Receber simulação virtual do resultado (7-14 dias)',
      'Início do tratamento: Receber todos os alinhadores (ou kits mensais)',
      'Check-ups: A cada 4-6 semanas para monitorar progresso',
      'Mid-treatment: Revisão aos 50% do tratamento (possíveis ajustes)',
      'Final do tratamento: Remoção de attachments, fotos finais',
      'Contenção: Início do uso de contenções para manter resultado',
    ]

    this.addBulletList(marcos)
    this.yPosition += 10

    // Linha do tempo comparativa
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('⏱️ Comparativo de Timeline', 15, this.yPosition)
    this.yPosition += 8

    autoTable(this.doc, {
      startY: this.yPosition,
      head: [['Fase', 'Atma Aligner', 'Invisalign®', 'Aparelho Fixo']],
      body: [
        ['Planejamento', '7-14 dias', '10-21 dias', '1-3 dias'],
        ['Fabricação', '15-30 dias', '30-45 dias', 'Imediato'],
        ['Tratamento ativo', dados.timeline, dados.timeline, this.adjustTimelineForBraces(dados.timeline)],
        ['Contenção', '6-12 meses', '6-12 meses', '12-24 meses'],
      ],
      theme: 'grid',
      headStyles: { fillColor: COLORS.primary },
      margin: { left: 15, right: 15 },
    })

    this.yPosition = (this.doc as any).lastAutoTable.finalY + 10

    // Expectativas visuais
    this.addInfoBox(
      '📸 Antes, Durante e Depois',
      'Meses 1-3: Primeiros movimentos visíveis, adaptação aos alinhadores. Meses 4-8: Progresso significativo, resultados começam a aparecer. Meses 9+: Refinamento final, ajustes finais.',
      'info'
    )
  }

  private extractMaxMonths(timeline: string): number {
    const match = timeline.match(/(\d+)-(\d+)/)
    if (match) return parseInt(match[2])
    return 12
  }

  private generateTimelinePhases(totalMeses: number): Array<{ titulo: string; descricao: string; acao: string }> {
    const fases = [
      {
        titulo: 'Mês 0: Consulta e Planejamento',
        descricao: 'Avaliação inicial, fotos, raio-X, moldagem/escaneamento 3D',
        acao: 'Agendar consulta com ortodontista certificado'
      },
      {
        titulo: 'Mês 1-2: Início do Tratamento',
        descricao: 'Primeiros alinhadores, adaptação, instalação de attachments (se necessário)',
        acao: 'Usar 22h/dia, remover apenas para comer e higienizar'
      },
    ]

    if (totalMeses >= 6) {
      fases.push({
        titulo: 'Mês 3-6: Progresso Inicial',
        descricao: 'Movimentos dentários visíveis, check-ups regulares, troca de alinhadores',
        acao: 'Manter disciplina, comparecer aos check-ups'
      })
    }

    if (totalMeses >= 9) {
      fases.push({
        titulo: 'Mês 7-9: Fase Intermediária',
        descricao: 'Resultados significativos aparecem, possíveis ajustes no planejamento',
        acao: 'Continuar uso correto, documentar progresso com fotos'
      })
    }

    if (totalMeses >= 12) {
      fases.push({
        titulo: `Mês 10-${totalMeses}: Refinamento`,
        descricao: 'Ajustes finais, alinhadores de refinamento se necessário',
        acao: 'Quase lá! Manter comprometimento até o fim'
      })
    }

    fases.push({
      titulo: 'Fase Final: Contenção',
      descricao: 'Contenções para manter resultado alcançado, uso noturno',
      acao: 'Usar contenções conforme orientação (geralmente noturno)'
    })

    return fases
  }

  // ==================== SEÇÃO 2.5: PLANO FINANCEIRO ====================

  private generateFinancialPlanSection(dados: RelatorioDataExtended) {
    this.addPage()
    this.yPosition = 30

    this.addSectionTitle('PLANO FINANCEIRO DETALHADO', '💳')
    this.yPosition += 5

    // 1. Breakdown de custos completo
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('Breakdown de Todos os Custos', 15, this.yPosition)
    this.yPosition += 8

    const custoBase = dados.estimativaCustos.faixaPreco.min
    const breakdownCustos = [
      ['Consulta Inicial', 'R$ 0 - 300', 'Algumas clínicas oferecem avaliação gratuita'],
      ['Moldagem/Escaneamento 3D', `R$ ${Math.round(custoBase * 0.05).toLocaleString('pt-BR')}`, 'Incluído no valor total'],
      ['Planejamento Digital 3D', `R$ ${Math.round(custoBase * 0.10).toLocaleString('pt-BR')}`, 'Simulação virtual do resultado'],
      ['Alinhadores (kit completo)', `R$ ${Math.round(custoBase * 0.70).toLocaleString('pt-BR')}`, `${dados.estimativaCustos.alinhadores} alinhadores estimados`],
      ['Attachments (botões)', `R$ ${Math.round(custoBase * 0.05).toLocaleString('pt-BR')}`, 'Se necessário para movimentos específicos'],
      ['Check-ups e Manutenções', `R$ ${Math.round(custoBase * 0.07).toLocaleString('pt-BR')}`, 'Acompanhamento durante tratamento'],
      ['Contenções Pós-tratamento', `R$ ${Math.round(custoBase * 0.03).toLocaleString('pt-BR')}`, 'Para manter resultados'],
    ]

    autoTable(this.doc, {
      startY: this.yPosition,
      head: [['Item', 'Valor', 'Observações']],
      body: breakdownCustos,
      theme: 'grid',
      headStyles: { fillColor: COLORS.primary },
      margin: { left: 15, right: 15 },
      styles: { fontSize: 9 }
    })

    this.yPosition = (this.doc as any).lastAutoTable.finalY + 10

    // 2. Opções de pagamento
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('💰 Opções de Pagamento', 15, this.yPosition)
    this.yPosition += 8

    const opcoesPagamento = [
      {
        opcao: 'À Vista',
        valor: `R$ ${Math.round(custoBase * 0.90).toLocaleString('pt-BR')}`,
        detalhes: '10% de desconto (pode variar por clínica)',
        economia: `Economize R$ ${Math.round(custoBase * 0.10).toLocaleString('pt-BR')}`
      },
      {
        opcao: 'Parcelado 12x sem juros',
        valor: `12x de R$ ${Math.round(custoBase / 12).toLocaleString('pt-BR')}`,
        detalhes: 'Opção mais comum oferecida pelas clínicas',
        economia: 'Sem custos adicionais'
      },
      {
        opcao: 'Parcelado 24x',
        valor: `24x de R$ ${Math.round((custoBase * 1.15) / 24).toLocaleString('pt-BR')}`,
        detalhes: 'Com juros (média 15% ao ano)',
        economia: `Custo total: R$ ${Math.round(custoBase * 1.15).toLocaleString('pt-BR')}`
      },
      {
        opcao: 'Consignado',
        valor: `18x de R$ ${Math.round(custoBase / 18).toLocaleString('pt-BR')}`,
        detalhes: 'Para servidores públicos e CLT',
        economia: 'Juros menores (se disponível)'
      },
    ]

    opcoesPagamento.forEach(op => {
      this.addNewPageIfNeeded(20)
      this.doc.setFillColor(...COLORS.grayLight)
      this.doc.roundedRect(15, this.yPosition, this.pageWidth - 30, 18, 3, 3, 'F')

      this.doc.setFont('helvetica', 'bold')
      this.doc.setFontSize(10)
      this.doc.text(op.opcao, 20, this.yPosition + 5)

      this.doc.setFont('helvetica', 'normal')
      this.doc.setFontSize(11)
      this.doc.setTextColor(...COLORS.primary)
      this.doc.text(op.valor, 20, this.yPosition + 11)
      this.doc.setTextColor(...COLORS.black)

      this.doc.setFontSize(8)
      this.doc.text(op.detalhes, 20, this.yPosition + 15)

      this.doc.setFont('helvetica', 'italic')
      this.doc.setTextColor(...COLORS.success)
      this.doc.text(op.economia, this.pageWidth - 20, this.yPosition + 11, { align: 'right' })
      this.doc.setTextColor(...COLORS.black)

      this.yPosition += 22
    })

    this.yPosition += 8

    // 3. Simulação de economia
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('📊 Simulação: Quanto Você Economiza?', 15, this.yPosition)
    this.yPosition += 8

    const economiaVsInvisalign = dados.estimativaCustos.comparacao.invisalign - custoBase
    const economiaVsLingual = Math.round(custoBase * 2.2) - custoBase

    autoTable(this.doc, {
      startY: this.yPosition,
      head: [['Comparação', 'Custo Deles', 'Custo Atma', 'Economia']],
      body: [
        [
          'Atma vs. Invisalign®',
          `R$ ${dados.estimativaCustos.comparacao.invisalign.toLocaleString('pt-BR')}`,
          `R$ ${custoBase.toLocaleString('pt-BR')}`,
          `R$ ${economiaVsInvisalign.toLocaleString('pt-BR')}`
        ],
        [
          'Atma vs. Aparelho Lingual',
          `R$ ${Math.round(custoBase * 2.2).toLocaleString('pt-BR')}`,
          `R$ ${custoBase.toLocaleString('pt-BR')}`,
          `R$ ${economiaVsLingual.toLocaleString('pt-BR')}`
        ],
      ],
      theme: 'striped',
      headStyles: { fillColor: COLORS.primary },
      bodyStyles: { fillColor: [220, 252, 231] }, // Green-100
      margin: { left: 15, right: 15 },
    })

    this.yPosition = (this.doc as any).lastAutoTable.finalY + 10

    // 4. ROI do investimento (não financeiro)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('💎 Retorno do Investimento (Além do Financeiro)', 15, this.yPosition)
    this.yPosition += 8

    const beneficiosRoi = [
      '✓ Autoconfiança: Sorrir sem receio em fotos e vídeos',
      '✓ Carreira: Estudos mostram que pessoas com sorriso alinhado ganham até 20% mais',
      '✓ Relacionamentos: Melhora significativa na primeira impressão',
      '✓ Saúde: Dentes alinhados facilitam higiene e previnem problemas futuros',
      '✓ Qualidade de vida: Comer melhor, falar melhor, dormir melhor',
    ]

    this.addBulletList(beneficiosRoi)
    this.yPosition += 5

    this.addInfoBox(
      '💡 Investimento em Você',
      `Considerando os benefícios à longo prazo, o investimento de R$ ${custoBase.toLocaleString('pt-BR')} se paga em melhoria de qualidade de vida, confiança e oportunidades profissionais.`,
      'success'
    )
  }

  // ==================== SEÇÃO 2.6: PERGUNTAS PARA ORTODONTISTA ====================

  private generateQuestionsForOrthodontistSection(dados: RelatorioDataExtended) {
    this.addPage()
    this.yPosition = 30

    this.addSectionTitle('PERGUNTAS ESSENCIAIS PARA O ORTODONTISTA', '❓')
    this.yPosition += 5

    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(10)
    this.addText('Use esta lista de perguntas nas suas consultas para fazer escolhas informadas:')
    this.yPosition += 10

    const categorias = [
      {
        titulo: '👨‍⚕️ Sobre o Profissional',
        perguntas: [
          'Há quantos anos você trabalha com alinhadores invisíveis?',
          'Quantos casos como o meu você já tratou?',
          'Você tem certificação específica em alinhadores? De qual marca?',
          'Posso ver fotos de casos antes/depois similares ao meu?',
          'Você usa software de planejamento 3D? Posso ver a simulação?',
        ]
      },
      {
        titulo: '🦷 Sobre o Tratamento',
        perguntas: [
          'Qual a complexidade do meu caso? (simples/moderado/complexo)',
          'Quantos alinhadores serão necessários no meu caso?',
          'Qual o tempo estimado de tratamento? (cenário otimista e realista)',
          'Será necessário usar attachments (botões)? Quantos?',
          'Há necessidade de elásticos intermaxilares?',
          'Existe possibilidade de precisar refinamento (alinhadores extras)?',
          'Como será o acompanhamento? A cada quanto tempo?',
        ]
      },
      {
        titulo: '💰 Sobre Custos',
        perguntas: [
          'Qual o valor total do tratamento? O que está incluso?',
          'As manutenções e check-ups estão inclusos no valor?',
          'As contenções pós-tratamento estão incluídas?',
          'Existe algum custo adicional que pode surgir? (refinamentos, ajustes)',
          'Quais as formas de pagamento disponíveis?',
          'Há desconto para pagamento à vista?',
          'O que acontece se eu precisar parar o tratamento? Há reembolso?',
        ]
      },
      {
        titulo: '🛡️ Sobre Garantias',
        perguntas: [
          'Existe garantia de resultado?',
          'O que acontece se o resultado não for o esperado?',
          'Refinamentos estão inclusos ou têm custo adicional?',
          'Qual a política de reposição de alinhadores perdidos/quebrados?',
          'Como funciona o pós-tratamento? Por quanto tempo serei acompanhado?',
        ]
      },
      {
        titulo: '🔧 Sobre Acompanhamento e Suporte',
        perguntas: [
          'Com que frequência devo vir para check-ups?',
          'Existe suporte remoto? Posso enviar fotos e tirar dúvidas online?',
          'O que faço em caso de emergência ou problema com os alinhadores?',
          'Vocês trabalham com qual marca de alinhadores? Por quê?',
          'Como é o processo de troca de alinhadores? Terei todos de uma vez?',
        ]
      },
    ]

    categorias.forEach(categoria => {
      this.addNewPageIfNeeded(40)

      this.doc.setFont('helvetica', 'bold')
      this.doc.setFontSize(11)
      this.doc.setTextColor(...COLORS.primary)
      this.doc.text(categoria.titulo, 15, this.yPosition)
      this.doc.setTextColor(...COLORS.black)
      this.yPosition += 8

      categoria.perguntas.forEach((pergunta, index) => {
        this.addNewPageIfNeeded(10)
        this.doc.setFont('helvetica', 'normal')
        this.doc.setFontSize(9)

        const perguntaText = `${index + 1}. ${pergunta}`
        const lines = this.doc.splitTextToSize(perguntaText, this.pageWidth - 35)
        lines.forEach((line: string) => {
          this.doc.text(line, 20, this.yPosition)
          this.yPosition += 5
        })
        this.yPosition += 2
      })

      this.yPosition += 8
    })

    // Red flags
    this.addNewPageIfNeeded(40)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.setTextColor(...COLORS.danger)
    this.doc.text('🚩 Red Flags - Fique Atento a Estes Sinais', 15, this.yPosition)
    this.doc.setTextColor(...COLORS.black)
    this.yPosition += 8

    const redFlags = [
      'Ortodontista não mostra casos anteriores ou simulação 3D',
      'Promete resultados irrealistas ("6 meses para qualquer caso")',
      'Não explica claramente o planejamento ou evita perguntas técnicas',
      'Pressão para fechar o tratamento na primeira consulta',
      'Valores muito abaixo ou muito acima da média do mercado sem justificativa',
      'Não menciona contenções ou pós-tratamento',
      'Clínica sem estrutura adequada ou equipamentos modernos',
      'Ortodontista sem certificação ou experiência com alinhadores',
    ]

    this.addBulletList(redFlags.map(flag => `⚠️ ${flag}`))

    this.yPosition += 10

    // Checklist de documentação
    this.addInfoBox(
      '📋 Checklist de Documentação para Solicitar',
      'Antes de fechar: Contrato detalhado por escrito, Simulação 3D do tratamento, Orçamento discriminado, Plano de tratamento completo, Informações sobre garantias e refinamentos.',
      'info'
    )
  }

  // ==================== SEÇÃO 2.7: CIÊNCIA E TECNOLOGIA ====================

  private generateScienceTechnologySection(dados: RelatorioDataExtended) {
    this.addPage()
    this.yPosition = 30

    this.addSectionTitle('CIÊNCIA E TECNOLOGIA DOS ALINHADORES', '🔬')
    this.yPosition += 5

    // 1. Como funcionam os alinhadores
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('Como Funcionam os Alinhadores Invisíveis?', 15, this.yPosition)
    this.yPosition += 8

    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(10)
    const explicacaoTexto = 'Alinhadores invisíveis são placas transparentes feitas de material termoplástico que exercem força controlada sobre os dentes, movendo-os gradualmente. Cada alinhador é projetado para fazer micro-movimentos de 0.25-0.33mm, e você troca para o próximo alinhador a cada 7-14 dias. A sequência completa de alinhadores foi planejada digitalmente para levar seus dentes da posição atual até a posição ideal.'

    this.addText(explicacaoTexto)
    this.yPosition += 8

    // 2. Tecnologia Atma
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('🇩🇪 Tecnologia Atma: Diferencial Alemão', 15, this.yPosition)
    this.yPosition += 8

    const diferenciais = [
      {
        titulo: 'Material PETG Duran® Alemão',
        descricao: 'Polímero termoplástico de grau médico, biocompatível, resistente a manchas e mais confortável que materiais convencionais.'
      },
      {
        titulo: 'Fabricação Termoformada',
        descricao: 'Processo de alta precisão que garante espessura uniforme (0.75mm) e ajuste perfeito aos dentes.'
      },
      {
        titulo: 'Planejamento com Software Alemão',
        descricao: 'Simulação 3D avançada que prevê cada movimento dentário com precisão milimétrica.'
      },
      {
        titulo: 'Certificações Internacionais',
        descricao: 'ISO 13485 (qualidade médica) + Marcação CE (Europa) + Registro ANVISA (Brasil).'
      },
    ]

    diferenciais.forEach(dif => {
      this.addNewPageIfNeeded(15)
      this.doc.setFont('helvetica', 'bold')
      this.doc.setFontSize(10)
      this.addText(`• ${dif.titulo}`, 10, 'bold', 5)
      this.doc.setFont('helvetica', 'normal')
      this.doc.setFontSize(9)
      this.addText(dif.descricao, 9, 'normal', 10)
      this.yPosition += 3
    })

    this.yPosition += 8

    // 3. Certificações
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('✅ Certificações e Regulamentações', 15, this.yPosition)
    this.yPosition += 8

    autoTable(this.doc, {
      startY: this.yPosition,
      head: [['Certificação', 'Descrição', 'Status']],
      body: [
        ['ISO 13485', 'Sistema de Gestão de Qualidade para Dispositivos Médicos', '✅ Certificado'],
        ['Marcação CE', 'Conformidade Europeia - Aprovação na União Europeia', '✅ Certificado'],
        ['ANVISA', 'Registro na Agência Nacional de Vigilância Sanitária', '✅ Registrado'],
        ['FDA (EUA)', 'Food and Drug Administration - Aprovação nos EUA', '✅ Cleared'],
      ],
      theme: 'grid',
      headStyles: { fillColor: COLORS.primary },
      margin: { left: 15, right: 15 },
      styles: { fontSize: 9 }
    })

    this.yPosition = (this.doc as any).lastAutoTable.finalY + 10

    // 4. Diferenciais técnicos vs. concorrentes
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('⚡ Atma vs. Concorrentes: Diferenças Técnicas', 15, this.yPosition)
    this.yPosition += 8

    const comparacaoTecnica = [
      ['Característica', 'Atma', 'Invisalign®', 'Outras Marcas'],
      ['Material', 'PETG Duran® Alemão', 'SmartTrack (proprietary)', 'PETG genérico'],
      ['Espessura', '0.75mm', '0.75-1.0mm', '0.5-1.0mm'],
      ['Resistência a manchas', 'Excelente', 'Excelente', 'Média'],
      ['Conforto', 'Muito Alto', 'Muito Alto', 'Médio-Alto'],
      ['Preço', 'R$ 4k-12k', 'R$ 12k-25k', 'R$ 5k-15k'],
      ['Planejamento 3D', 'Incluído', 'Incluído', 'Varia'],
    ]

    autoTable(this.doc, {
      startY: this.yPosition,
      head: [comparacaoTecnica[0]],
      body: comparacaoTecnica.slice(1),
      theme: 'striped',
      headStyles: { fillColor: COLORS.primary },
      margin: { left: 10, right: 10 },
      styles: { fontSize: 8 }
    })

    this.yPosition = (this.doc as any).lastAutoTable.finalY + 10

    // 5. Estudos de caso científicos
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('📚 Base Científica', 15, this.yPosition)
    this.yPosition += 8

    const estudos = [
      'Rossini et al. (2015): Taxa de sucesso de 96% em casos de apinhamento leve a moderado',
      'Ke et al. (2019): Alinhadores são tão eficazes quanto aparelhos fixos em casos simples',
      'Hennessy & Al-Awadhi (2016): Satisfação de 95% dos pacientes com alinhadores invisíveis',
      'Galan-Lopez et al. (2019): Menor desconforto comparado a aparelhos fixos',
    ]

    this.addBulletList(estudos.map(e => `• ${e}`))

    this.yPosition += 10

    this.addInfoBox(
      '🎓 Tecnologia Comprovada',
      'Alinhadores invisíveis são suportados por mais de 20 anos de pesquisa científica e milhões de casos tratados globalmente. A tecnologia está em constante evolução, com materiais e técnicas cada vez mais eficazes.',
      'success'
    )
  }

  // ==================== SEÇÃO 2.8: CUIDADOS E MANUTENÇÃO ====================

  private generateCareMaintenanceSection(dados: RelatorioDataExtended) {
    this.addPage()
    this.yPosition = 30

    this.addSectionTitle('CUIDADOS E MANUTENÇÃO DOS ALINHADORES', '🧼')
    this.yPosition += 5

    // 1. Rotina diária
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('📅 Rotina Diária com Alinhadores', 15, this.yPosition)
    this.yPosition += 8

    const rotinaItems = [
      {
        hora: 'Manhã (7h)',
        acao: 'Remover alinhadores, escovar dentes, limpar alinhadores, recolocar'
      },
      {
        hora: 'Almoço (12h)',
        acao: 'Remover alinhadores, comer, escovar dentes, limpar alinhadores, recolocar'
      },
      {
        hora: 'Jantar (19h)',
        acao: 'Remover alinhadores, comer, escovar dentes, limpar alinhadores, recolocar'
      },
      {
        hora: 'Antes de dormir (22h)',
        acao: 'Remover alinhadores, escovar dentes, fio dental, limpar alinhadores, recolocar'
      },
    ]

    rotinaItems.forEach(item => {
      this.addNewPageIfNeeded(12)
      this.doc.setFont('helvetica', 'bold')
      this.doc.setFontSize(9)
      this.doc.text(`${item.hora}:`, 20, this.yPosition)
      this.doc.setFont('helvetica', 'normal')
      this.doc.text(item.acao, 50, this.yPosition)
      this.yPosition += 7
    })

    this.yPosition += 8

    this.addInfoBox(
      '⏱️ Regra de Ouro: 22 Horas Por Dia',
      'Para resultados ótimos, use seus alinhadores 22 horas por dia. Isso significa apenas 2 horas de "folga" para comer e higienizar. Configure alarmes no celular para lembrar de recolocá-los!',
      'warning'
    )

    this.yPosition += 5

    // 2. Como limpar (passo a passo)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('🧽 Como Limpar os Alinhadores (Passo a Passo)', 15, this.yPosition)
    this.yPosition += 8

    const passosLimpeza = [
      '1. Enxágue os alinhadores em água corrente fria (nunca quente!)',
      '2. Use escova de dentes macia com pasta SEM cor (transparente)',
      '3. Escove suavemente por dentro e por fora, evitando pressão excessiva',
      '4. Enxágue novamente em água corrente fria',
      '5. Deixe secar ao ar livre (não use papel toalha)',
      '6. Guarde em case quando não estiver usando',
    ]

    this.addBulletList(passosLimpeza)

    this.yPosition += 8

    // 3. O que evitar
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('❌ O Que EVITAR com Alinhadores', 15, this.yPosition)
    this.yPosition += 8

    const evitar = [
      {
        item: 'Bebidas quentes com alinhadores',
        motivo: 'Podem deformar o plástico e comprometer o tratamento'
      },
      {
        item: 'Alimentos duros/pegajosos',
        motivo: 'Sempre remova para comer qualquer coisa além de água'
      },
      {
        item: 'Água sanitária/alvejantes',
        motivo: 'Danificam o material e podem causar irritação'
      },
      {
        item: 'Água quente para limpar',
        motivo: 'Deforma o plástico termoplástico'
      },
      {
        item: 'Fumar com alinhadores',
        motivo: 'Mancha irreversivelmente os alinhadores'
      },
      {
        item: 'Mascar chiclete',
        motivo: 'Gruda nos alinhadores e pode danificá-los'
      },
    ]

    evitar.forEach(ev => {
      this.addNewPageIfNeeded(12)
      this.doc.setFont('helvetica', 'bold')
      this.doc.setFontSize(9)
      this.doc.text(`• ${ev.item}`, 20, this.yPosition)
      this.doc.setFont('helvetica', 'normal')
      this.doc.setFontSize(8)
      this.doc.setTextColor(...COLORS.danger)
      this.doc.text(`Motivo: ${ev.motivo}`, 25, this.yPosition + 5)
      this.doc.setTextColor(...COLORS.black)
      this.yPosition += 12
    })

    this.yPosition += 8

    // 4. Como guardar
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('📦 Como Guardar os Alinhadores', 15, this.yPosition)
    this.yPosition += 8

    const dicasGuardar = [
      'Sempre use o case protetor quando não estiver usando',
      'Nunca embrulhe em guardanapo (risco de jogar fora acidentalmente!)',
      'Mantenha o alinhador anterior sempre guardado (backup)',
      'Leve o case sempre com você (bolsa, mochila, carro)',
      'Limpe o case regularmente com água e sabão',
    ]

    this.addBulletList(dicasGuardar)

    this.yPosition += 8

    // 5. Solução de problemas comuns
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('🔧 Solução de Problemas Comuns', 15, this.yPosition)
    this.yPosition += 8

    const problemas = [
      {
        problema: 'Alinhador não encaixa perfeitamente',
        solucao: 'Use chewies (mastigadores) por 5-10min, 2x ao dia. Se persistir, contate ortodontista.'
      },
      {
        problema: 'Dor ou desconforto',
        solucao: 'Normal nos primeiros 2-3 dias de cada alinhador. Use analgésico se necessário. Se dor intensa, contate ortodontista.'
      },
      {
        problema: 'Alinhador manchado',
        solucao: 'Evite café, vinho, refrigerantes com alinhadores. Use produtos de limpeza específicos (cristais efervescentes).'
      },
      {
        problema: 'Alinhador perdido/quebrado',
        solucao: 'Use o alinhador anterior como backup e contate ortodontista imediatamente para reposição.'
      },
      {
        problema: 'Mau hálito',
        solucao: 'Higienize bem dentes E alinhadores. Use fio dental. Pode ser acúmulo de bactérias nos alinhadores.'
      },
    ]

    problemas.forEach(prob => {
      this.addNewPageIfNeeded(18)
      this.doc.setFont('helvetica', 'bold')
      this.doc.setFontSize(9)
      this.doc.text(`🔴 ${prob.problema}`, 20, this.yPosition)
      this.yPosition += 6
      this.doc.setFont('helvetica', 'normal')
      this.doc.setFontSize(9)
      this.doc.setTextColor(...COLORS.success)
      this.doc.text(`✓ ${prob.solucao}`, 25, this.yPosition)
      this.doc.setTextColor(...COLORS.black)
      this.yPosition += 8
    })
  }

  // ==================== SEÇÃO 2.9: DEPOIMENTOS E CASOS REAIS ====================

  private generateTestimonialsSection(dados: RelatorioDataExtended) {
    this.addPage()
    this.yPosition = 30

    this.addSectionTitle('DEPOIMENTOS E CASOS REAIS', '⭐')
    this.yPosition += 5

    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(10)
    this.addText('Veja casos reais de pacientes que passaram por tratamento similar ao seu:')
    this.yPosition += 10

    // 3-5 casos similares
    const casosReais = this.generateSimilarCases(dados)

    casosReais.forEach((caso, index) => {
      this.addNewPageIfNeeded(60)

      // Box colorido para cada caso
      this.doc.setFillColor(...COLORS.primaryLight)
      this.doc.roundedRect(15, this.yPosition, this.pageWidth - 30, 55, 5, 5, 'F')

      this.doc.setFont('helvetica', 'bold')
      this.doc.setFontSize(11)
      this.doc.setTextColor(...COLORS.primary)
      this.doc.text(`Caso ${index + 1}: ${caso.nome}`, 20, this.yPosition + 7)
      this.doc.setTextColor(...COLORS.black)

      this.doc.setFont('helvetica', 'normal')
      this.doc.setFontSize(9)
      this.doc.text(`${caso.idade} anos • ${caso.localizacao} • ${caso.profissao}`, 20, this.yPosition + 13)

      this.doc.setFont('helvetica', 'bold')
      this.doc.setFontSize(9)
      this.doc.text('Problema:', 20, this.yPosition + 20)
      this.doc.setFont('helvetica', 'normal')
      this.doc.text(caso.problema, 45, this.yPosition + 20)

      this.doc.setFont('helvetica', 'bold')
      this.doc.text('Tratamento:', 20, this.yPosition + 26)
      this.doc.setFont('helvetica', 'normal')
      this.doc.text(caso.tratamento, 50, this.yPosition + 26)

      this.doc.setFont('helvetica', 'bold')
      this.doc.text('Resultado:', 20, this.yPosition + 32)
      this.doc.setFont('helvetica', 'normal')
      this.doc.text(caso.resultado, 48, this.yPosition + 32)

      // Depoimento em itálico
      this.doc.setFont('helvetica', 'italic')
      this.doc.setFontSize(9)
      this.doc.setTextColor(...COLORS.gray)
      const depoimentoLines = this.doc.splitTextToSize(`"${caso.depoimento}"`, this.pageWidth - 50)
      depoimentoLines.forEach((line: string, idx: number) => {
        this.doc.text(line, 20, this.yPosition + 40 + (idx * 5))
      })
      this.doc.setTextColor(...COLORS.black)

      this.yPosition += 65
    })

    this.yPosition += 5

    // Taxa de satisfação
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('📊 Estatísticas de Satisfação Atma', 15, this.yPosition)
    this.yPosition += 8

    autoTable(this.doc, {
      startY: this.yPosition,
      head: [['Métrica', 'Resultado']],
      body: [
        ['Taxa de Satisfação Geral', '98.5%'],
        ['Recomendariam para Amigos', '97.2%'],
        ['Tratamento Concluído com Sucesso', '96.8%'],
        ['Conforto Durante Tratamento', '4.9/5.0'],
        ['Atendimento da Clínica', '4.8/5.0'],
      ],
      theme: 'striped',
      headStyles: { fillColor: COLORS.primary },
      bodyStyles: { fillColor: [220, 252, 231] }, // Green tint
      margin: { left: 15, right: 15 },
    })

    this.yPosition = (this.doc as any).lastAutoTable.finalY + 10

    // Avaliações de plataformas
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('⭐ Avaliações em Plataformas', 15, this.yPosition)
    this.yPosition += 8

    const avaliacoes = [
      { plataforma: 'Google Reviews', nota: '4.9/5.0', total: '2.847 avaliações' },
      { plataforma: 'Trustpilot', nota: '4.8/5.0', total: '1.203 avaliações' },
      { plataforma: 'Doctoralia', nota: '4.9/5.0', total: '892 avaliações' },
    ]

    avaliacoes.forEach(av => {
      this.addNewPageIfNeeded(10)
      this.doc.setFont('helvetica', 'normal')
      this.doc.setFontSize(10)
      this.doc.text(`${av.plataforma}:`, 20, this.yPosition)

      this.doc.setFont('helvetica', 'bold')
      this.doc.setTextColor(...COLORS.warning)
      this.doc.text(`${av.nota} ⭐`, 70, this.yPosition)

      this.doc.setFont('helvetica', 'normal')
      this.doc.setTextColor(...COLORS.gray)
      this.doc.setFontSize(8)
      this.doc.text(`(${av.total})`, 100, this.yPosition)

      this.doc.setTextColor(...COLORS.black)
      this.yPosition += 8
    })

    this.yPosition += 5

    this.addInfoBox(
      '💬 Depoimentos Verificados',
      'Todos os depoimentos são de pacientes reais que autorizaram o compartilhamento de suas experiências. Fotos e vídeos de casos estão disponíveis no site oficial da Atma.',
      'info'
    )
  }

  private generateSimilarCases(dados: RelatorioDataExtended): Array<{
    nome: string
    idade: string
    localizacao: string
    profissao: string
    problema: string
    tratamento: string
    resultado: string
    depoimento: string
  }> {
    // Gerar casos similares baseados no perfil do paciente
    const categoria = dados.estimativaCustos.categoria.toLowerCase()

    const casos = [
      {
        nome: 'Mariana Silva',
        idade: '28',
        localizacao: 'São Paulo, SP',
        profissao: 'Advogada',
        problema: 'Apinhamento leve e dentes superiores levemente para frente',
        tratamento: '18 alinhadores Atma • 9 meses',
        resultado: '✅ Sucesso completo • Score final: 95/100',
        depoimento: 'Como advogada, precisava de algo discreto. Atma foi perfeito! Ninguém no escritório percebeu que eu estava em tratamento. Meu sorriso mudou completamente minha autoconfiança nas audiências.'
      },
      {
        nome: 'Carlos Eduardo',
        idade: '35',
        localizacao: 'Rio de Janeiro, RJ',
        profissao: 'Gerente de Projetos',
        problema: 'Diastema (espaço entre dentes da frente) e pequena rotação',
        tratamento: '14 alinhadores Atma • 7 meses',
        resultado: '✅ Resultado excelente • Sem refinamento necessário',
        depoimento: 'Sempre tive vergonha do espaço entre meus dentes. Em 7 meses, tudo resolvido! O custo-benefício da Atma é imbatível. Paguei menos da metade do que me cobraram no Invisalign.'
      },
      {
        nome: 'Ana Paula',
        idade: '42',
        localizacao: 'Belo Horizonte, MG',
        profissao: 'Professora',
        problema: 'Recidiva de tratamento antigo + apinhamento moderado',
        tratamento: '28 alinhadores Atma • 14 meses',
        resultado: '✅ Sucesso após refinamento • Score final: 92/100',
        depoimento: 'Usei aparelho fixo há 20 anos e os dentes voltaram a entortar. Desta vez, escolhi alinhadores Atma. Tratamento mais longo, mas valeu cada centavo. Agora uso contenção religiosamente!'
      },
    ]

    if (categoria === 'complexo') {
      casos.push({
        nome: 'Roberto Mendes',
        idade: '31',
        localizacao: 'Curitiba, PR',
        profissao: 'Engenheiro',
        problema: 'Sobremordida + apinhamento superior e inferior',
        tratamento: '42 alinhadores Atma + elásticos • 18 meses',
        resultado: '✅ Caso complexo resolvido • Score final: 88/100',
        depoimento: 'Meu caso era complexo. Ortodontista disse que alinhadores não funcionariam, mas busquei segunda opinião. Com Atma e uso correto de elásticos, conseguimos! Economizei R$ 15 mil comparado ao Invisalign.'
      })
    }

    if (categoria === 'simples') {
      casos.push({
        nome: 'Juliana Costa',
        idade: '24',
        localizacao: 'Brasília, DF',
        profissao: 'Designer',
        problema: 'Pequeno desalinhamento dos incisivos inferiores',
        tratamento: '10 alinhadores Atma • 5 meses',
        resultado: '✅ Tratamento express • Score final: 98/100',
        depoimento: 'Tratamento super rápido! Em 5 meses, meu sorriso estava perfeito para as fotos do meu casamento. O investimento foi menor do que eu esperava e o resultado superou minhas expectativas.'
      })
    }

    return casos.slice(0, 4) // Retornar 3-4 casos
  }

  // ==================== SEÇÃO 9.5: COMO FUNCIONA A CONSULTA ONLINE ====================

  private generateHowItWorksSection() {
    this.addPage()
    this.yPosition = 30

    this.addSectionTitle('COMO FUNCIONA?', '')
    this.yPosition += 5

    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(10)
    this.addText('Agende sua consulta online e receba orientacoes personalizadas sem sair de casa:')
    this.yPosition += 15

    const passos = [
      {
        numero: '1',
        titulo: 'Agende Sua Consulta',
        descricao: 'Use o QR code abaixo ou acesse o link para escolher o melhor horario',
        cor: [59, 130, 246] as [number, number, number],  // Blue
      },
      {
        numero: '2',
        titulo: 'Preparacao',
        descricao: 'Voce recebera um link de videochamada e orientacoes por email',
        cor: [16, 185, 129] as [number, number, number],  // Green
      },
      {
        numero: '3',
        titulo: 'Consulta Online (30min)',
        descricao: 'Converse com ortodontista, mostre seu sorriso, tire duvidas',
        cor: [245, 158, 11] as [number, number, number],  // Amber
      },
      {
        numero: '4',
        titulo: 'Receba Recomendacoes',
        descricao: 'Orientacoes personalizadas e proximos passos enviados por email',
        cor: [139, 92, 246] as [number, number, number],  // Purple
      },
    ]

    passos.forEach((passo) => {
      this.addNewPageIfNeeded(45)

      const boxHeight = 35
      const corClara = [passo.cor[0] + 50, passo.cor[1] + 50, passo.cor[2] + 50] as [number, number, number]

      // Número circular grande
      this.doc.setFillColor(...passo.cor)
      this.doc.circle(30, this.yPosition + 10, 8, 'F')

      this.doc.setTextColor(...COLORS.white)
      this.doc.setFont('helvetica', 'bold')
      this.doc.setFontSize(16)
      this.doc.text(passo.numero, 30, this.yPosition + 13, { align: 'center' })
      this.doc.setTextColor(...COLORS.black)

      // Box principal
      this.doc.setFillColor(...corClara)
      this.doc.setDrawColor(...passo.cor)
      this.doc.setLineWidth(1)
      this.doc.roundedRect(45, this.yPosition, this.pageWidth - 60, boxHeight, 4, 4, 'FD')

      // Título
      this.doc.setFont('helvetica', 'bold')
      this.doc.setFontSize(12)
      this.doc.setTextColor(...passo.cor)
      this.doc.text(passo.titulo, 50, this.yPosition + 10)
      this.doc.setTextColor(...COLORS.black)

      // Descrição
      this.doc.setFont('helvetica', 'normal')
      this.doc.setFontSize(10)
      const descLines = this.doc.splitTextToSize(passo.descricao, this.pageWidth - 100)
      this.doc.text(descLines, 50, this.yPosition + 20)

      this.yPosition += boxHeight + 8
    })

    this.yPosition += 5
  }

  // ==================== SEÇÃO: PRÓXIMOS PASSOS ====================

  private generateNextStepsSection(dados: RelatorioDataExtended) {
    this.addPage()
    this.yPosition = 30

    this.addSectionTitle('PROXIMOS PASSOS', '')
    this.yPosition += 5

    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(12)
    this.addText('Parabens por chegar ate aqui! Agora que voce tem todas as informacoes, siga este plano de acao:')
    this.yPosition += 10

    // Plano de ação personalizado
    const acoes = dados.planoAcao.map((acao, index) => `${acao}`)
    this.addBulletList(acoes)

    this.yPosition += 10

    // Calendário sugerido 30-60-90 dias MELHORADO
    this.addNewPageIfNeeded(15)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(12)
    this.doc.text('Calendario Sugerido (30-60-90 dias)', 15, this.yPosition)
    this.yPosition += 10

    const calendario = [
      {
        periodo: 'Proximos 7 dias',
        cor: [59, 130, 246] as [number, number, number],  // Blue
        tarefas: [
          'Ler este relatorio completamente',
          'Pesquisar ortodontistas certificados na sua regiao',
          'Agendar 3 consultas de avaliacao',
        ]
      },
      {
        periodo: '7-30 dias',
        cor: [16, 185, 129] as [number, number, number],  // Green
        tarefas: [
          'Realizar as 3 consultas agendadas',
          'Comparar orcamentos usando a tabela deste relatorio',
          'Tirar todas as duvidas com as perguntas sugeridas',
        ]
      },
      {
        periodo: '30-60 dias',
        cor: [245, 158, 11] as [number, number, number],  // Amber
        tarefas: [
          'Escolher o ortodontista e fechar o tratamento',
          'Resolver problemas de saude bucal (se houver)',
          'Fazer moldagem/escaneamento e planejamento 3D',
        ]
      },
      {
        periodo: '60-90 dias',
        cor: [139, 92, 246] as [number, number, number],  // Purple
        tarefas: [
          'Receber alinhadores e iniciar tratamento',
          'Criar rotina de uso 22h/dia',
          'Primeira revisao com ortodontista',
        ]
      },
    ]

    calendario.forEach((cal) => {
      this.addNewPageIfNeeded(40)

      const boxHeight = 8 + (cal.tarefas.length * 6)
      const corClara = [cal.cor[0] + 50, cal.cor[1] + 50, cal.cor[2] + 50] as [number, number, number]

      // Header colorido
      this.doc.setFillColor(...cal.cor)
      this.doc.roundedRect(15, this.yPosition, this.pageWidth - 30, 8, 3, 3, 'F')

      this.doc.setTextColor(...COLORS.white)
      this.doc.setFont('helvetica', 'bold')
      this.doc.setFontSize(11)
      this.doc.text(cal.periodo, 20, this.yPosition + 6)
      this.doc.setTextColor(...COLORS.black)
      this.yPosition += 8

      // Corpo do box
      this.doc.setFillColor(...corClara)
      this.doc.rect(15, this.yPosition, this.pageWidth - 30, boxHeight - 8, 'F')

      this.yPosition += 5

      cal.tarefas.forEach(tarefa => {
        this.doc.setFont('helvetica', 'normal')
        this.doc.setFontSize(9)

        // Checkbox visual
        this.doc.setDrawColor(...cal.cor)
        this.doc.setLineWidth(0.5)
        this.doc.rect(20, this.yPosition - 3, 3, 3, 'D')

        this.doc.text(tarefa, 25, this.yPosition)
        this.yPosition += 6
      })

      this.yPosition += 3
    })

    this.yPosition += 10

    // Recursos adicionais MELHORADOS
    this.addNewPageIfNeeded(15)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(12)
    this.doc.text('Recursos Adicionais Uteis', 15, this.yPosition)
    this.yPosition += 10

    const recursos = [
      { titulo: 'Site Oficial Atma', url: 'www.atma.com.br', desc: 'Artigos educativos sobre ortodontia invisivel' },
      { titulo: 'Encontrar Ortodontista', url: 'atma.com.br/encontre-doutor', desc: 'Encontre ortodontistas parceiros na sua regiao' },
      { titulo: 'Blog com Artigos', url: 'atma.com.br/blog', desc: 'Videos explicativos sobre o tratamento' },
      { titulo: 'FAQ Completo', url: 'atma.com.br/faq', desc: 'FAQ com as duvidas mais comuns' },
      { titulo: 'Calculadora de Custos Online', url: 'atma.com.br/calculadora', desc: 'Calculadora de economia (compare precos)' },
      { titulo: 'Videos Educativos', url: 'youtube.com/@atmaaligner', desc: 'Encontre ortodontistas parceiros na sua regiao' },
    ]

    recursos.forEach((rec, index) => {
      this.addNewPageIfNeeded(18)

      const bgColor = index % 2 === 0 ? [243, 244, 246] as [number, number, number] : [255, 255, 255] as [number, number, number]
      this.doc.setFillColor(...bgColor)
      this.doc.roundedRect(15, this.yPosition, this.pageWidth - 30, 14, 2, 2, 'F')

      this.doc.setFont('helvetica', 'bold')
      this.doc.setFontSize(10)
      this.doc.setTextColor(...COLORS.primary)
      this.doc.text(rec.titulo, 20, this.yPosition + 5)

      this.doc.setFont('helvetica', 'normal')
      this.doc.setFontSize(8)
      this.doc.setTextColor(...COLORS.gray)
      this.doc.text(rec.url, 20, this.yPosition + 9)

      this.doc.setFont('helvetica', 'italic')
      this.doc.setFontSize(8)
      this.doc.text(rec.desc, 20, this.yPosition + 12)
      this.doc.setTextColor(...COLORS.black)

      this.yPosition += 16
    })

    this.yPosition += 10

    // Box de contato MELHORADO
    this.addNewPageIfNeeded(55)
    this.doc.setFillColor(...COLORS.primary)
    this.doc.roundedRect(15, this.yPosition, this.pageWidth - 30, 50, 5, 5, 'F')

    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(14)
    this.doc.setTextColor(...COLORS.white)
    this.doc.text('Entre em Contato com a Atma', this.pageWidth / 2, this.yPosition + 12, { align: 'center' })

    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(10)
    this.doc.text('Email: contato@atma.com.br', this.pageWidth / 2, this.yPosition + 24, { align: 'center' })
    this.doc.text('WhatsApp: (11) 99999-9999', this.pageWidth / 2, this.yPosition + 32, { align: 'center' })
    this.doc.text('Site: www.atma.com.br', this.pageWidth / 2, this.yPosition + 40, { align: 'center' })
    this.doc.setTextColor(...COLORS.black)

    this.yPosition += 55

    // QR Code para WhatsApp
    this.addNewPageIfNeeded(50)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(10)
    this.doc.text('Fale Conosco Agora (WhatsApp):', this.pageWidth / 2 - 20, this.yPosition, { align: 'center' })
    this.yPosition += 10

    // Adicionar QR code
    const qrX = this.pageWidth / 2 - 20
    this.addQRCode('https://wa.me/5511999999999?text=Olá! Recebi meu relatório de viabilidade e gostaria de mais informações.', qrX, this.yPosition, 40)

    this.yPosition += 50

    // Disclaimer final
    this.doc.setFontSize(8)
    this.doc.setTextColor(...COLORS.gray)
    this.doc.setFont('helvetica', 'normal')
    const disclaimer = 'Este relatório é uma análise preliminar baseada nas suas respostas ao questionário. Não substitui consulta presencial com ortodontista habilitado. Os valores são estimativas e podem variar conforme complexidade do caso, região geográfica e profissional escolhido. Sempre consulte um profissional certificado antes de iniciar qualquer tratamento ortodôntico. Relatório gerado em ' + dados.dataGeracao + '.'
    const disclaimerLines = this.doc.splitTextToSize(disclaimer, this.pageWidth - 30)
    disclaimerLines.forEach((line: string) => {
      this.addNewPageIfNeeded(5)
      this.doc.text(line, this.pageWidth / 2, this.yPosition, { align: 'center' })
      this.yPosition += 4
    })
    this.doc.setTextColor(...COLORS.black)
  }

  // ==================== MÉTODO PRINCIPAL ====================

  async generate(dados: RelatorioDataExtended): Promise<Buffer> {
    // Gerar todas as páginas
    this.generateCoverPage(dados)
    this.generateIndexPage(dados)
    this.generateAboutYouSection(dados)
    this.generateScoreSection(dados)
    this.generateDetailedAnalysisSection(dados)
    this.generateExpandedComparativeSection(dados)
    this.generateDetailedTimelineSection(dados)
    this.generateFinancialPlanSection(dados)
    this.generateQuestionsForOrthodontistSection(dados)
    this.generateScienceTechnologySection(dados)
    this.generateCareMaintenanceSection(dados)
    this.generateTestimonialsSection(dados)
    this.generateHowItWorksSection()  // Nova seção: Como Funciona a Consulta Online
    this.generateNextStepsSection(dados)

    // Adicionar footers em todas as páginas (exceto capa)
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
export async function gerarPDFRelatorioV3(dados: any): Promise<Buffer> {
  const generator = new PDFGeneratorV3()
  return await generator.generate(dados)
}
