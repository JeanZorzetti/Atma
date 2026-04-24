/**
 * PDF Generator Showcase - Phase 6: Design System Demo
 *
 * Demonstração completa da biblioteca PDFComponents
 * Mostra como usar todos os componentes reutilizáveis e temas
 *
 * Este arquivo serve como:
 * 1. Documentação viva dos componentes
 * 2. Template para novos geradores
 * 3. Teste visual dos temas
 */

import jsPDF from 'jspdf'
import { PDFComponents, ThemeType } from './pdf-components'

export class PDFGeneratorShowcase {
  private doc: jsPDF
  private pageWidth: number
  private pageHeight: number
  private yPosition: number

  constructor(theme: ThemeType = 'default') {
    this.doc = new jsPDF()
    this.pageWidth = this.doc.internal.pageSize.getWidth()
    this.pageHeight = this.doc.internal.pageSize.getHeight()
    this.yPosition = 20

    // Configurar tema
    PDFComponents.setTheme(theme)
  }

  private addNewPageIfNeeded(requiredSpace: number): void {
    if (this.yPosition + requiredSpace > this.pageHeight - 30) {
      this.doc.addPage()
      this.yPosition = 30
    }
  }

  /**
   * Página 1: Demonstração de Headers e Footers
   */
  private generateHeaderFooterDemo() {
    const theme = PDFComponents.getTheme()

    // Título da página
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(24)
    this.doc.setTextColor(...theme.colors.primary)
    this.doc.text('PDFComponents Showcase', this.pageWidth / 2, 40, { align: 'center' })

    this.yPosition = 55

    // Subtítulo
    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(12)
    this.doc.setTextColor(...theme.colors.textSecondary)
    this.doc.text(
      `Tema Atual: ${theme.name}`,
      this.pageWidth / 2,
      this.yPosition,
      { align: 'center' }
    )

    this.yPosition = 70

    // Demonstrar InfoBox
    this.yPosition = PDFComponents.infoBox(this.doc, {
      title: 'Bem-vindo ao Design System!',
      content: 'Este PDF demonstra todos os componentes reutilizáveis da biblioteca PDFComponents. Explore cada seção para ver exemplos práticos de uso.',
      type: 'info',
      yPosition: this.yPosition,
      pageWidth: this.pageWidth,
    })

    this.yPosition += 10

    // Demonstrar os 4 tipos de InfoBox
    this.yPosition = PDFComponents.infoBox(this.doc, {
      title: 'InfoBox Tipo: Success',
      content: 'Use este tipo para mensagens de sucesso, confirmações e feedback positivo.',
      type: 'success',
      yPosition: this.yPosition,
      pageWidth: this.pageWidth,
    })

    this.yPosition += 5

    this.yPosition = PDFComponents.infoBox(this.doc, {
      title: 'InfoBox Tipo: Warning',
      content: 'Use este tipo para avisos, alertas não críticos e informações importantes.',
      type: 'warning',
      yPosition: this.yPosition,
      pageWidth: this.pageWidth,
    })

    this.yPosition += 5

    this.yPosition = PDFComponents.infoBox(this.doc, {
      title: 'InfoBox Tipo: Error',
      content: 'Use este tipo para erros críticos, problemas que precisam atenção imediata.',
      type: 'error',
      yPosition: this.yPosition,
      pageWidth: this.pageWidth,
    })
  }

  /**
   * Página 2: Demonstração de Section Titles e Score Gauges
   */
  private generateSectionTitleDemo() {
    this.doc.addPage()
    this.yPosition = 30

    // Section Title com diferentes ícones
    this.yPosition = PDFComponents.sectionTitle(this.doc, {
      title: 'TÍTULOS DE SEÇÃO',
      icon: '🎨',
      yPosition: this.yPosition,
      pageWidth: this.pageWidth,
    })

    this.yPosition = PDFComponents.paragraph(this.doc, {
      text: 'Os títulos de seção fornecem separação visual clara entre diferentes partes do documento.',
      yPosition: this.yPosition,
    })

    this.yPosition += 10

    // Vários section titles
    this.yPosition = PDFComponents.sectionTitle(this.doc, {
      title: 'ANÁLISE DE DADOS',
      icon: '📊',
      yPosition: this.yPosition,
      pageWidth: this.pageWidth,
    })

    this.yPosition = PDFComponents.sectionTitle(this.doc, {
      title: 'RESULTADOS',
      icon: '✅',
      yPosition: this.yPosition,
      pageWidth: this.pageWidth,
    })

    this.yPosition = PDFComponents.sectionTitle(this.doc, {
      title: 'PRÓXIMOS PASSOS',
      icon: '🚀',
      yPosition: this.yPosition,
      pageWidth: this.pageWidth,
    })

    this.yPosition += 10

    // Score Gauges
    this.yPosition = PDFComponents.sectionTitle(this.doc, {
      title: 'MEDIDORES DE PONTUAÇÃO',
      icon: '📈',
      yPosition: this.yPosition,
      pageWidth: this.pageWidth,
    })

    this.yPosition += 15

    // Três gauges lado a lado
    const gaugeY = this.yPosition
    const spacing = (this.pageWidth - 60) / 3

    PDFComponents.scoreGauge(this.doc, {
      score: 45,
      maxScore: 100,
      x: 30 + spacing / 2,
      y: gaugeY,
      radius: 25,
      label: 'Score Baixo',
    })

    PDFComponents.scoreGauge(this.doc, {
      score: 70,
      maxScore: 100,
      x: 30 + spacing * 1.5,
      y: gaugeY,
      radius: 25,
      label: 'Score Médio',
    })

    PDFComponents.scoreGauge(this.doc, {
      score: 95,
      maxScore: 100,
      x: 30 + spacing * 2.5,
      y: gaugeY,
      radius: 25,
      label: 'Score Alto',
    })

    this.yPosition = gaugeY + 50
  }

  /**
   * Página 3: Demonstração de Listas e Parágrafos
   */
  private generateTextDemo() {
    this.doc.addPage()
    this.yPosition = 30

    this.yPosition = PDFComponents.sectionTitle(this.doc, {
      title: 'TEXTO E LISTAS',
      icon: '📝',
      yPosition: this.yPosition,
      pageWidth: this.pageWidth,
    })

    // Parágrafo
    this.yPosition = PDFComponents.paragraph(this.doc, {
      text: 'Este é um exemplo de parágrafo formatado usando PDFComponents. O texto é automaticamente quebrado em linhas e pode conter conteúdo extenso que flui naturalmente pelo documento.',
      yPosition: this.yPosition,
    })

    this.yPosition += 5

    // Lista com bullets
    const theme = PDFComponents.getTheme()
    this.doc.setFont(theme.fonts.body.family, 'bold')
    this.doc.setFontSize(theme.fonts.body.size + 1)
    this.doc.setTextColor(...theme.colors.text)
    this.doc.text('Vantagens dos Componentes:', 15, this.yPosition)
    this.yPosition += 7

    this.yPosition = PDFComponents.bulletList(this.doc, {
      items: [
        'Código reutilizável e manutenível',
        'Consistência visual em todo o documento',
        'Suporte a múltiplos temas (default, dark, print)',
        'Fácil customização através do sistema de temas',
        'Componentes testados e documentados',
      ],
      yPosition: this.yPosition,
    })

    this.yPosition += 10

    // Callout
    this.yPosition = PDFComponents.callout(this.doc, {
      text: '💡 Dica Pro: Use callouts para destacar informações importantes e chamar atenção do leitor!',
      yPosition: this.yPosition,
      pageWidth: this.pageWidth,
    })
  }

  /**
   * Página 4: Demonstração de Timeline
   */
  private generateTimelineDemo() {
    this.doc.addPage()
    this.yPosition = 30

    this.yPosition = PDFComponents.sectionTitle(this.doc, {
      title: 'TIMELINE DE PROCESSO',
      icon: '⏱️',
      yPosition: this.yPosition,
      pageWidth: this.pageWidth,
    })

    this.yPosition += 5

    const steps = [
      {
        title: 'Pesquisa',
        icon: '🔍',
        duration: 'Semana 1',
      },
      {
        title: 'Design',
        icon: '🎨',
        duration: 'Semana 2-3',
      },
      {
        title: 'Desenvolvimento',
        icon: '⚙️',
        duration: 'Semana 4-6',
      },
      {
        title: 'Testes',
        icon: '🧪',
        duration: 'Semana 7',
      },
      {
        title: 'Lançamento',
        icon: '🚀',
        duration: 'Semana 8',
      },
    ]

    this.yPosition = PDFComponents.timeline(this.doc, {
      steps,
      yPosition: this.yPosition,
      pageWidth: this.pageWidth,
    })

    this.yPosition += 10

    this.yPosition = PDFComponents.paragraph(this.doc, {
      text: 'Timelines são perfeitas para mostrar processos sequenciais, cronogramas de projeto ou etapas de tratamento.',
      yPosition: this.yPosition,
    })
  }

  /**
   * Página 5: Demonstração de Price Table
   */
  private generatePriceTableDemo() {
    this.doc.addPage()
    this.yPosition = 30

    this.yPosition = PDFComponents.sectionTitle(this.doc, {
      title: 'TABELA DE PREÇOS',
      icon: '💰',
      yPosition: this.yPosition,
      pageWidth: this.pageWidth,
    })

    this.yPosition += 10

    const items = [
      {
        name: 'Plano Básico',
        price: 1990,
        description: 'Recursos essenciais para começar',
      },
      {
        name: 'Plano Premium',
        price: 3990,
        highlight: true,
        description: 'Mais popular - Todos os recursos avançados',
      },
      {
        name: 'Plano Enterprise',
        price: 7990,
        description: 'Solução completa para grandes empresas',
      },
    ]

    this.yPosition = PDFComponents.priceTable(this.doc, {
      items,
      yPosition: this.yPosition,
      pageWidth: this.pageWidth,
    })

    this.yPosition += 10

    this.yPosition = PDFComponents.callout(this.doc, {
      text: '🎁 Oferta especial: 20% de desconto para pagamento anual!',
      yPosition: this.yPosition,
      pageWidth: this.pageWidth,
    })
  }

  /**
   * Página 6: Demonstração de Testimonials
   */
  private generateTestimonialDemo() {
    this.doc.addPage()
    this.yPosition = 30

    this.yPosition = PDFComponents.sectionTitle(this.doc, {
      title: 'DEPOIMENTOS',
      icon: '💬',
      yPosition: this.yPosition,
      pageWidth: this.pageWidth,
    })

    this.yPosition += 5

    this.yPosition = PDFComponents.testimonial(this.doc, {
      text: 'A biblioteca PDFComponents revolucionou a forma como geramos relatórios. O código ficou muito mais limpo e manutenível!',
      author: 'Maria Silva',
      role: 'Desenvolvedora Frontend',
      rating: 5,
      yPosition: this.yPosition,
      pageWidth: this.pageWidth,
    })

    this.yPosition += 5

    this.yPosition = PDFComponents.testimonial(this.doc, {
      text: 'Sistema de temas facilita muito criar versões para impressão e dark mode. Recomendo fortemente!',
      author: 'João Santos',
      role: 'Tech Lead',
      rating: 5,
      yPosition: this.yPosition,
      pageWidth: this.pageWidth,
    })
  }

  /**
   * Página 7: Demonstração de QR Codes
   */
  private async generateQRCodeDemo() {
    this.doc.addPage()
    this.yPosition = 30

    this.yPosition = PDFComponents.sectionTitle(this.doc, {
      title: 'QR CODES',
      icon: '📱',
      yPosition: this.yPosition,
      pageWidth: this.pageWidth,
    })

    this.yPosition += 10

    this.yPosition = PDFComponents.paragraph(this.doc, {
      text: 'QR Codes permitem interatividade fácil - os usuários podem escanear com smartphones para acessar links rapidamente.',
      yPosition: this.yPosition,
    })

    this.yPosition += 15

    // Dois QR codes lado a lado
    const qrSize = 50
    const spacing = 20

    await PDFComponents.qrCode(this.doc, {
      url: 'https://atma.roilabs.com.br',
      x: (this.pageWidth - (qrSize * 2 + spacing)) / 2,
      y: this.yPosition,
      size: qrSize,
      label: 'Site Atma',
    })

    await PDFComponents.qrCode(this.doc, {
      url: 'https://github.com/anthropics/claude-code',
      x: (this.pageWidth - (qrSize * 2 + spacing)) / 2 + qrSize + spacing,
      y: this.yPosition,
      size: qrSize,
      label: 'Claude Code',
    })

    this.yPosition += qrSize + 30

    this.yPosition = PDFComponents.callout(this.doc, {
      text: '📱 Experimente escanear os QR codes acima com seu celular!',
      yPosition: this.yPosition,
      pageWidth: this.pageWidth,
    })
  }

  /**
   * Página Final: Guia de Uso
   */
  private generateUsageGuide() {
    this.doc.addPage()
    this.yPosition = 30

    this.yPosition = PDFComponents.sectionTitle(this.doc, {
      title: 'GUIA DE USO',
      icon: '📚',
      yPosition: this.yPosition,
      pageWidth: this.pageWidth,
    })

    this.yPosition += 5

    const theme = PDFComponents.getTheme()

    // Como usar
    this.doc.setFont(theme.fonts.subtitle.family, theme.fonts.subtitle.weight)
    this.doc.setFontSize(theme.fonts.subtitle.size)
    this.doc.setTextColor(...theme.colors.text)
    this.doc.text('Como Usar PDFComponents:', 15, this.yPosition)
    this.yPosition += 10

    // Código de exemplo 1
    this.doc.setFillColor(245, 245, 245)
    this.doc.roundedRect(15, this.yPosition, this.pageWidth - 30, 35, 2, 2, 'F')
    this.yPosition += 8

    this.doc.setFont('courier', 'normal')
    this.doc.setFontSize(8)
    this.doc.setTextColor(0, 0, 0)

    const code1 = [
      'import { PDFComponents } from "./pdf-components"',
      '',
      '// Definir tema',
      'PDFComponents.setTheme("default") // ou "dark" ou "print"',
      '',
      '// Usar componentes',
      'yPosition = PDFComponents.infoBox(doc, { ... })',
    ]

    code1.forEach((line, i) => {
      this.doc.text(line, 20, this.yPosition + (i * 4))
    })

    this.yPosition += 40

    // Temas disponíveis
    this.doc.setFont(theme.fonts.subtitle.family, theme.fonts.subtitle.weight)
    this.doc.setFontSize(theme.fonts.subtitle.size)
    this.doc.setTextColor(...theme.colors.text)
    this.doc.text('Temas Disponíveis:', 15, this.yPosition)
    this.yPosition += 7

    this.yPosition = PDFComponents.bulletList(this.doc, {
      items: [
        'default - Tema azul padrão Atma (colorido, moderno)',
        'dark - Tema escuro com fundo cinza (para preferência dark mode)',
        'print - Tema preto e branco otimizado para impressão',
      ],
      yPosition: this.yPosition,
    })

    this.yPosition += 10

    // Componentes disponíveis
    this.doc.setFont(theme.fonts.subtitle.family, theme.fonts.subtitle.weight)
    this.doc.setFontSize(theme.fonts.subtitle.size)
    this.doc.setTextColor(...theme.colors.text)
    this.doc.text('Componentes Disponíveis:', 15, this.yPosition)
    this.yPosition += 7

    this.yPosition = PDFComponents.bulletList(this.doc, {
      items: [
        'header() - Cabeçalho de página com logo e título',
        'footer() - Rodapé com número de página',
        'sectionTitle() - Título de seção com ícone',
        'infoBox() - Box informativo colorido (success/warning/info/error)',
        'scoreGauge() - Medidor circular de pontuação',
        'timeline() - Timeline horizontal com steps',
        'priceTable() - Tabela de preços estilizada',
        'testimonial() - Card de depoimento com rating',
        'qrCode() - QR code com label',
        'bulletList() - Lista com bullets',
        'paragraph() - Parágrafo formatado',
        'callout() - Box de destaque com barra lateral',
      ],
      yPosition: this.yPosition,
    })

    this.yPosition += 10

    this.yPosition = PDFComponents.infoBox(this.doc, {
      title: '✅ Pronto para usar!',
      content: 'Todos os componentes retornam a nova posição Y, facilitando o posicionamento sequencial de elementos.',
      type: 'success',
      yPosition: this.yPosition,
      pageWidth: this.pageWidth,
    })
  }

  /**
   * Método principal - gera o PDF showcase
   */
  async generate(): Promise<Buffer> {
    // Página 1: Headers e InfoBoxes
    this.generateHeaderFooterDemo()

    // Página 2: Section Titles e Score Gauges
    this.generateSectionTitleDemo()

    // Página 3: Texto e Listas
    this.generateTextDemo()

    // Página 4: Timeline
    this.generateTimelineDemo()

    // Página 5: Price Table
    this.generatePriceTableDemo()

    // Página 6: Testimonials
    this.generateTestimonialDemo()

    // Página 7: QR Codes
    await this.generateQRCodeDemo()

    // Página Final: Guia de Uso
    this.generateUsageGuide()

    // Adicionar footers em todas as páginas
    const totalPages = this.doc.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i)
      PDFComponents.footer(this.doc, {
        pageNumber: i,
        totalPages,
        pageWidth: this.pageWidth,
        pageHeight: this.pageHeight,
        text: 'PDFComponents Showcase - Atma Aligner',
      })
    }

    // Retornar como Buffer
    const pdfBuffer = Buffer.from(this.doc.output('arraybuffer'))
    return pdfBuffer
  }
}

// Função para gerar showcase com tema específico
export async function gerarPDFShowcase(theme: ThemeType = 'default'): Promise<Buffer> {
  const generator = new PDFGeneratorShowcase(theme)
  return await generator.generate()
}
