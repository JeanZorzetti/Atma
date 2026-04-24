import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import QRCode from 'qrcode'

// Paleta de cores Atma
const COLORS = {
  primary: [37, 99, 235], // Blue-600
  primaryLight: [219, 234, 254], // Blue-100
  success: [16, 185, 129], // Green-500
  warning: [251, 191, 36], // Amber-400
  danger: [239, 68, 68], // Red-500
  gray: [107, 114, 128], // Gray-500
  grayLight: [243, 244, 246], // Gray-100
  white: [255, 255, 255],
  black: [0, 0, 0],
}

interface RelatorioData {
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
}

export class PDFGeneratorV2 {
  private doc: jsPDF
  private pageWidth: number
  private pageHeight: number
  private yPosition: number
  private currentPage: number
  private totalPages: number

  constructor() {
    this.doc = new jsPDF()
    this.pageWidth = this.doc.internal.pageSize.getWidth()
    this.pageHeight = this.doc.internal.pageSize.getHeight()
    this.yPosition = 20
    this.currentPage = 1
    this.totalPages = 0
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
    this.yPosition = 30 // Deixar espaço para header
    this.addHeader()
  }

  private addHeader() {
    // Header com logo e linha
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

  private addFooter(pageNum: number, total: number) {
    const footerY = this.pageHeight - 15

    // Linha separadora
    this.doc.setDrawColor(...COLORS.grayLight)
    this.doc.line(15, footerY - 5, this.pageWidth - 15, footerY - 5)

    // Texto do rodapé
    this.doc.setFontSize(8)
    this.doc.setTextColor(...COLORS.gray)
    this.doc.setFont('helvetica', 'normal')

    this.doc.text('© 2024 Atma Aligner - Tecnologia PETG Duran® Alemã', 15, footerY)
    this.doc.text(`Página ${pageNum} de ${total}`, this.pageWidth - 15, footerY, { align: 'right' })

    this.doc.setTextColor(...COLORS.black)
  }

  private addSectionTitle(title: string, icon?: string) {
    this.addNewPageIfNeeded(25)

    // Box do título
    this.doc.setFillColor(...COLORS.primary)
    this.doc.roundedRect(10, this.yPosition, this.pageWidth - 20, 12, 2, 2, 'F')

    this.doc.setTextColor(...COLORS.white)
    this.doc.setFontSize(13)
    this.doc.setFont('helvetica', 'bold')

    const text = icon ? `${icon}  ${title}` : title
    this.doc.text(text, 15, this.yPosition + 8)

    this.doc.setTextColor(...COLORS.black)
    this.yPosition += 18
  }

  private addText(
    text: string,
    fontSize = 10,
    style: 'normal' | 'bold' = 'normal',
    color: number[] = COLORS.black
  ) {
    this.doc.setFontSize(fontSize)
    this.doc.setFont('helvetica', style)
    this.doc.setTextColor(...color)

    const lines = this.doc.splitTextToSize(text, this.pageWidth - 30)
    lines.forEach((line: string) => {
      this.addNewPageIfNeeded(7)
      this.doc.text(line, 15, this.yPosition)
      this.yPosition += 6
    })

    this.doc.setTextColor(...COLORS.black)
  }

  private addInfoBox(
    title: string,
    content: string,
    type: 'info' | 'success' | 'warning' | 'danger' = 'info'
  ) {
    this.addNewPageIfNeeded(30)

    const boxColor = {
      info: COLORS.primaryLight,
      success: [220, 252, 231], // Green-100
      warning: [254, 243, 199], // Amber-100
      danger: [254, 226, 226], // Red-100
    }[type]

    const iconColor = {
      info: COLORS.primary,
      success: COLORS.success,
      warning: COLORS.warning,
      danger: COLORS.danger,
    }[type]

    const startY = this.yPosition

    // Calcular altura necessária
    const contentLines = this.doc.splitTextToSize(content, this.pageWidth - 40)
    const boxHeight = 15 + (contentLines.length * 5)

    // Box de fundo
    this.doc.setFillColor(...boxColor)
    this.doc.roundedRect(15, startY, this.pageWidth - 30, boxHeight, 3, 3, 'F')

    // Título
    this.doc.setFontSize(11)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(...iconColor)
    this.doc.text(title, 20, startY + 8)

    // Conteúdo
    this.doc.setFontSize(9)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(...COLORS.black)

    let lineY = startY + 14
    contentLines.forEach((line: string) => {
      this.doc.text(line, 20, lineY)
      lineY += 5
    })

    this.yPosition += boxHeight + 5
  }

  private async addQRCode(url: string, x: number, y: number, size = 30) {
    try {
      const qrDataURL = await QRCode.toDataURL(url, {
        width: size * 4, // Alta qualidade
        margin: 1,
        color: {
          dark: '#2563EB', // Cor primária
          light: '#FFFFFF'
        }
      })

      this.doc.addImage(qrDataURL, 'PNG', x, y, size, size)
    } catch (error) {
      console.error('Erro ao gerar QR code:', error)
    }
  }

  private addScoreGauge(score: number, x: number, y: number, size = 60) {
    const centerX = x + size / 2
    const centerY = y + size / 2
    const radius = size / 2 - 5

    // Círculo de fundo
    this.doc.setFillColor(...COLORS.grayLight)
    this.doc.circle(centerX, centerY, radius, 'F')

    // Arco colorido baseado no score
    const scoreColor = score >= 70
      ? COLORS.success
      : score >= 50
      ? COLORS.warning
      : COLORS.danger

    // Simular gauge com círculo parcial
    this.doc.setFillColor(...scoreColor)
    this.doc.setLineWidth(8)
    this.doc.setDrawColor(...scoreColor)

    // Desenhar arco (simplificado - círculo completo com alpha)
    const alpha = score / 100
    this.doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2], alpha)
    this.doc.circle(centerX, centerY, radius - 4, 'F')

    // Score no centro
    this.doc.setFontSize(28)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(...scoreColor)
    this.doc.text(`${score}`, centerX, centerY, { align: 'center', baseline: 'middle' })

    this.doc.setFontSize(10)
    this.doc.setTextColor(...COLORS.gray)
    this.doc.text('/100', centerX, centerY + 10, { align: 'center' })

    this.doc.setTextColor(...COLORS.black)
  }

  // ==================== PÁGINAS ====================

  private async generateCoverPage(dados: RelatorioData) {
    // Fundo gradiente (simulado com retângulos)
    this.doc.setFillColor(...COLORS.primary)
    this.doc.rect(0, 0, this.pageWidth, this.pageHeight, 'F')

    // Logo/Nome (sem logo por enquanto, só texto)
    this.doc.setTextColor(...COLORS.white)
    this.doc.setFontSize(16)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('ATMA ALIGNER', this.pageWidth / 2, 40, { align: 'center' })

    // Título principal
    this.doc.setFontSize(36)
    this.doc.text('RELATÓRIO', this.pageWidth / 2, 80, { align: 'center' })
    this.doc.text('DE VIABILIDADE', this.pageWidth / 2, 95, { align: 'center' })
    this.doc.text('ORTODÔNTICA', this.pageWidth / 2, 110, { align: 'center' })

    // Subtítulo
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text('Análise Personalizada Completa', this.pageWidth / 2, 125, { align: 'center' })

    // Box com informações do cliente
    this.doc.setFillColor(255, 255, 255, 0.15)
    this.doc.roundedRect(25, 145, this.pageWidth - 50, 50, 5, 5, 'F')

    this.doc.setFontSize(11)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('CLIENTE:', this.pageWidth / 2, 160, { align: 'center' })

    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(13)
    this.doc.text(dados.cliente.nome, this.pageWidth / 2, 170, { align: 'center' })

    this.doc.setFontSize(10)
    this.doc.text(`${dados.cliente.idade} anos  •  ${dados.cliente.localizacao}`, this.pageWidth / 2, 180, { align: 'center' })

    // Data e selo
    this.doc.setFontSize(9)
    this.doc.text(`Gerado em: ${dados.dataGeracao}`, this.pageWidth / 2, 250, { align: 'center' })

    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(8)
    this.doc.text('🇩🇪 TECNOLOGIA PETG DURAN® ALEMÃ', this.pageWidth / 2, 260, { align: 'center' })
    this.doc.text('CERTIFICADO ISO 13485 + CE + ANVISA', this.pageWidth / 2, 268, { align: 'center' })

    this.doc.setTextColor(...COLORS.black)
  }

  private generateScorePage(dados: RelatorioData) {
    this.addPage()

    this.addSectionTitle('SCORE DE VIABILIDADE', '📊')

    // Score gauge grande e centralizado
    const gaugeX = (this.pageWidth - 80) / 2
    this.addScoreGauge(dados.score, gaugeX, this.yPosition, 80)
    this.yPosition += 90

    // Interpretação do score
    let interpretacao = ''
    let tipoBox: 'success' | 'info' | 'warning' | 'danger' = 'info'

    if (dados.score >= 75) {
      interpretacao = 'Seu caso apresenta ALTA viabilidade para alinhadores invisíveis. Você é um candidato excelente e pode esperar ótimos resultados!'
      tipoBox = 'success'
    } else if (dados.score >= 60) {
      interpretacao = 'Seu caso é adequado para alinhadores invisíveis com algumas considerações. A maioria dos objetivos pode ser alcançada.'
      tipoBox = 'info'
    } else if (dados.score >= 40) {
      interpretacao = 'Alinhadores são possíveis para seu caso, mas pode haver alguns desafios. Recomendamos consulta detalhada com ortodontista.'
      tipoBox = 'warning'
    } else {
      interpretacao = 'Seu caso apresenta complexidades que requerem avaliação presencial especializada. Outros tratamentos podem ser mais indicados.'
      tipoBox = 'danger'
    }

    this.addInfoBox(
      'O QUE ISSO SIGNIFICA?',
      interpretacao,
      tipoBox
    )

    this.yPosition += 10

    // Análise personalizada
    this.addSectionTitle('ANÁLISE PERSONALIZADA DO SEU CASO', '🔍')
    this.addText(dados.analise, 10)
  }

  private generateCostPage(dados: RelatorioData) {
    this.addPage()

    this.addSectionTitle('ESTIMATIVA DE CUSTOS', '💰')

    // Info do caso
    this.addText(`Categoria do Caso: `, 11, 'bold')
    this.addText(dados.estimativaCustos.categoria.toUpperCase(), 13, 'bold', COLORS.primary)
    this.yPosition += 3

    this.addText(`Alinhadores Necessários: ${dados.estimativaCustos.alinhadores}`, 10)
    this.addText(`Timeline Estimado: ${dados.timeline}`, 10)
    this.yPosition += 8

    // Tabela de custos Atma
    autoTable(this.doc, {
      startY: this.yPosition,
      head: [['Item', 'Valor']],
      body: [
        ['Faixa de Preço (Atma)', `R$ ${dados.estimativaCustos.faixaPreco.min.toLocaleString('pt-BR')} - R$ ${dados.estimativaCustos.faixaPreco.max.toLocaleString('pt-BR')}`],
        ['Parcelamento sem juros', `12x de R$ ${Math.round(dados.estimativaCustos.faixaPreco.min / 12)}`],
        ['Entrada sugerida (30%)', `R$ ${Math.round(dados.estimativaCustos.faixaPreco.min * 0.3).toLocaleString('pt-BR')}`],
      ],
      theme: 'grid',
      headStyles: {
        fillColor: COLORS.primary,
        fontSize: 11,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 10
      },
      margin: { left: 15, right: 15 },
    })

    this.yPosition = (this.doc as any).lastAutoTable.finalY + 12

    // Comparativo de mercado
    this.addSectionTitle('COMPARATIVO DE MERCADO', '📊')

    autoTable(this.doc, {
      startY: this.yPosition,
      head: [['Opção de Tratamento', 'Preço Médio', 'Diferença']],
      body: [
        [
          '✅ Atma Aligner',
          `R$ ${dados.estimativaCustos.comparacao.atma.toLocaleString('pt-BR')}`,
          'BASE'
        ],
        [
          'Invisalign®',
          `R$ ${dados.estimativaCustos.comparacao.invisalign.toLocaleString('pt-BR')}`,
          `+${Math.round(((dados.estimativaCustos.comparacao.invisalign / dados.estimativaCustos.comparacao.atma) - 1) * 100)}%`
        ],
        [
          'Aparelho Fixo',
          `R$ ${dados.estimativaCustos.comparacao.aparelhoFixo.toLocaleString('pt-BR')}`,
          `${Math.round(((dados.estimativaCustos.comparacao.aparelhoFixo / dados.estimativaCustos.comparacao.atma) - 1) * 100)}%`
        ],
      ],
      theme: 'striped',
      headStyles: {
        fillColor: COLORS.primary,
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9
      },
      margin: { left: 15, right: 15 },
    })

    this.yPosition = (this.doc as any).lastAutoTable.finalY + 10

    // Box de economia
    this.addInfoBox(
      '💡 ECONOMIA POTENCIAL',
      `Escolhendo Atma ao invés de Invisalign®, você pode economizar até R$ ${dados.estimativaCustos.comparacao.economia.toLocaleString('pt-BR')}! Isso representa uma economia de ${Math.round((dados.estimativaCustos.comparacao.economia / dados.estimativaCustos.comparacao.invisalign) * 100)}% do valor total.`,
      'success'
    )
  }

  private generateActionPlanPage(dados: RelatorioData) {
    this.addPage()

    this.addSectionTitle('PLANO DE AÇÃO PERSONALIZADO', '🎯')

    this.addText(
      'Siga este plano passo a passo para tomar a melhor decisão sobre seu tratamento ortodôntico:',
      10,
      'normal',
      COLORS.gray
    )

    this.yPosition += 5

    dados.planoAcao.forEach((acao, index) => {
      this.addNewPageIfNeeded(18)

      // Box para cada ação
      this.doc.setFillColor(...COLORS.primaryLight)
      this.doc.roundedRect(15, this.yPosition - 3, this.pageWidth - 30, 12, 2, 2, 'F')

      this.doc.setFontSize(10)
      this.doc.setFont('helvetica', 'normal')
      this.doc.setTextColor(...COLORS.black)

      const lines = this.doc.splitTextToSize(acao, this.pageWidth - 40)
      lines.forEach((line: string, i: number) => {
        this.doc.text(line, 20, this.yPosition + 2 + (i * 5))
      })

      this.yPosition += 15
    })
  }

  private async generateNextStepsPage(dados: RelatorioData) {
    this.addPage()

    this.addSectionTitle('PRÓXIMOS PASSOS', '📞')

    this.addText(
      'Parabéns por dar este importante passo! Agora que você tem este relatório completo em mãos:',
      11,
      'bold'
    )

    this.yPosition += 5

    const passos = [
      '1. Agende consultas com pelo menos 3 ortodontistas certificados',
      '2. Leve este relatório impresso para mostrar ao profissional',
      '3. Faça as perguntas sugeridas neste documento',
      '4. Compare os orçamentos usando nossa tabela de referência',
      '5. Não tenha pressa - escolha o profissional que transmitir mais confiança',
      '6. Considere experiência, localização e forma de pagamento',
    ]

    passos.forEach(passo => {
      this.addText(passo, 10)
      this.yPosition += 2
    })

    this.yPosition += 10

    // QR Code para agendar consulta
    this.addText('AGENDE SUA CONSULTA AGORA:', 12, 'bold', COLORS.primary)
    this.yPosition += 5

    const qrY = this.yPosition
    await this.addQRCode('https://atma.roilabs.com.br/pacientes/encontre-doutor', 15, qrY, 35)

    // Texto ao lado do QR
    this.doc.setFontSize(9)
    this.doc.text('Escaneie para encontrar', 55, qrY + 10)
    this.doc.text('ortodontistas certificados', 55, qrY + 16)
    this.doc.text('Atma na sua região', 55, qrY + 22)

    this.yPosition += 45

    // Box de contato
    this.addInfoBox(
      '📧 ENTRE EM CONTATO COM A ATMA',
      `Email: contato@atma.com.br\nWhatsApp: (11) 99999-9999\nSite: www.atma.roilabs.com.br`,
      'info'
    )

    this.yPosition += 10

    // Disclaimer
    this.doc.setFontSize(7)
    this.doc.setTextColor(...COLORS.gray)
    const disclaimer = 'IMPORTANTE: Este relatório é uma análise preliminar baseada nas suas respostas e não substitui consulta presencial com ortodontista habilitado. Os valores são estimativas e podem variar conforme complexidade do caso, região e profissional escolhido. Consulte sempre um especialista.'

    const disclaimerLines = this.doc.splitTextToSize(disclaimer, this.pageWidth - 30)
    disclaimerLines.forEach((line: string) => {
      this.addNewPageIfNeeded(4)
      this.doc.text(line, this.pageWidth / 2, this.yPosition, { align: 'center' })
      this.yPosition += 4
    })
  }

  // ==================== MÉTODO PRINCIPAL ====================

  public async gerarPDF(dados: RelatorioData): Promise<Buffer> {
    // Estimar total de páginas (aproximado)
    this.totalPages = 5

    // Gerar todas as páginas
    await this.generateCoverPage(dados)
    this.generateScorePage(dados)
    this.generateCostPage(dados)
    this.generateActionPlanPage(dados)
    await this.generateNextStepsPage(dados)

    // Adicionar rodapés em todas as páginas (exceto capa)
    const pages = this.doc.getNumberOfPages()
    for (let i = 2; i <= pages; i++) {
      this.doc.setPage(i)
      this.addFooter(i - 1, pages - 1)
    }

    // Retornar PDF como Buffer
    const pdfBuffer = Buffer.from(this.doc.output('arraybuffer'))
    return pdfBuffer
  }
}

// Função de conveniência para manter compatibilidade
export async function gerarPDFRelatorioV2(dados: RelatorioData): Promise<Buffer> {
  const generator = new PDFGeneratorV2()
  return await generator.gerarPDF(dados)
}
