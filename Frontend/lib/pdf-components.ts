/**
 * PDF Components Library - Phase 6.1
 *
 * Biblioteca de componentes reutilizáveis para geração de PDFs
 * Centraliza todos os padrões visuais e temas em um único lugar
 */

import jsPDF from 'jspdf'
import QRCode from 'qrcode'

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

export type ThemeType = 'default' | 'dark' | 'print'
export type InfoBoxType = 'success' | 'warning' | 'info' | 'error'

export interface Theme {
  name: string
  colors: {
    primary: [number, number, number]
    secondary: [number, number, number]
    accent: [number, number, number]
    success: [number, number, number]
    warning: [number, number, number]
    error: [number, number, number]
    info: [number, number, number]
    text: [number, number, number]
    textSecondary: [number, number, number]
    background: [number, number, number]
    border: [number, number, number]
  }
  fonts: {
    title: { family: string; size: number; weight: 'bold' | 'normal' }
    subtitle: { family: string; size: number; weight: 'bold' | 'normal' }
    body: { family: string; size: number; weight: 'bold' | 'normal' }
    small: { family: string; size: number; weight: 'bold' | 'normal' }
  }
}

// ============================================================================
// TEMAS
// ============================================================================

const THEMES: Record<ThemeType, Theme> = {
  default: {
    name: 'Atma Blue (Default)',
    colors: {
      primary: [37, 99, 235],      // Blue-600
      secondary: [59, 130, 246],   // Blue-500
      accent: [16, 185, 129],      // Green-500
      success: [16, 185, 129],     // Green-500
      warning: [245, 158, 11],     // Amber-500
      error: [239, 68, 68],        // Red-500
      info: [59, 130, 246],        // Blue-500
      text: [31, 41, 55],          // Gray-800
      textSecondary: [107, 114, 128], // Gray-500
      background: [255, 255, 255], // White
      border: [229, 231, 235],     // Gray-200
    },
    fonts: {
      title: { family: 'helvetica', size: 20, weight: 'bold' },
      subtitle: { family: 'helvetica', size: 14, weight: 'bold' },
      body: { family: 'helvetica', size: 10, weight: 'normal' },
      small: { family: 'helvetica', size: 8, weight: 'normal' },
    },
  },
  dark: {
    name: 'Dark Mode',
    colors: {
      primary: [96, 165, 250],     // Blue-400
      secondary: [59, 130, 246],   // Blue-500
      accent: [52, 211, 153],      // Green-400
      success: [52, 211, 153],     // Green-400
      warning: [251, 191, 36],     // Amber-400
      error: [248, 113, 113],      // Red-400
      info: [96, 165, 250],        // Blue-400
      text: [243, 244, 246],       // Gray-100
      textSecondary: [156, 163, 175], // Gray-400
      background: [17, 24, 39],    // Gray-900
      border: [55, 65, 81],        // Gray-700
    },
    fonts: {
      title: { family: 'helvetica', size: 20, weight: 'bold' },
      subtitle: { family: 'helvetica', size: 14, weight: 'bold' },
      body: { family: 'helvetica', size: 10, weight: 'normal' },
      small: { family: 'helvetica', size: 8, weight: 'normal' },
    },
  },
  print: {
    name: 'Print Optimized (B&W)',
    colors: {
      primary: [0, 0, 0],          // Black
      secondary: [64, 64, 64],     // Dark Gray
      accent: [128, 128, 128],     // Medium Gray
      success: [64, 64, 64],       // Dark Gray
      warning: [96, 96, 96],       // Gray
      error: [0, 0, 0],            // Black
      info: [128, 128, 128],       // Medium Gray
      text: [0, 0, 0],             // Black
      textSecondary: [128, 128, 128], // Medium Gray
      background: [255, 255, 255], // White
      border: [192, 192, 192],     // Light Gray
    },
    fonts: {
      title: { family: 'helvetica', size: 18, weight: 'bold' },
      subtitle: { family: 'helvetica', size: 13, weight: 'bold' },
      body: { family: 'helvetica', size: 9, weight: 'normal' },
      small: { family: 'helvetica', size: 7, weight: 'normal' },
    },
  },
}

// ============================================================================
// CLASSE PRINCIPAL
// ============================================================================

export class PDFComponents {
  private static currentTheme: Theme = THEMES.default

  /**
   * Define o tema atual para todos os componentes
   */
  static setTheme(themeType: ThemeType): void {
    PDFComponents.currentTheme = THEMES[themeType]
  }

  /**
   * Obtém o tema atual
   */
  static getTheme(): Theme {
    return PDFComponents.currentTheme
  }

  // ==========================================================================
  // COMPONENTES DE LAYOUT
  // ==========================================================================

  /**
   * Header de página com logo e título
   */
  static header(
    doc: jsPDF,
    options: {
      title?: string
      subtitle?: string
      logoUrl?: string
      pageWidth: number
    }
  ): number {
    const { title, subtitle, logoUrl, pageWidth } = options
    const theme = PDFComponents.currentTheme
    let yPosition = 15

    // Logo (se fornecido)
    if (logoUrl) {
      try {
        doc.addImage(logoUrl, 'PNG', 15, yPosition, 40, 12)
      } catch (error) {
        console.warn('Erro ao adicionar logo no header:', error)
      }
    }

    // Título principal
    if (title) {
      doc.setFont(theme.fonts.title.family, theme.fonts.title.weight)
      doc.setFontSize(theme.fonts.title.size)
      doc.setTextColor(...theme.colors.primary)

      const titleX = logoUrl ? 60 : 15
      doc.text(title, titleX, yPosition + 7)
      yPosition += 12
    }

    // Subtítulo
    if (subtitle) {
      doc.setFont(theme.fonts.body.family, theme.fonts.body.weight)
      doc.setFontSize(theme.fonts.body.size)
      doc.setTextColor(...theme.colors.textSecondary)

      const subtitleX = logoUrl ? 60 : 15
      doc.text(subtitle, subtitleX, yPosition)
      yPosition += 8
    }

    // Linha separadora
    doc.setDrawColor(...theme.colors.border)
    doc.setLineWidth(0.5)
    doc.line(15, yPosition, pageWidth - 15, yPosition)
    yPosition += 8

    return yPosition
  }

  /**
   * Footer de página com número da página e informações
   */
  static footer(
    doc: jsPDF,
    options: {
      pageNumber: number
      totalPages: number
      pageWidth: number
      pageHeight: number
      text?: string
    }
  ): void {
    const { pageNumber, totalPages, pageWidth, pageHeight, text } = options
    const theme = PDFComponents.currentTheme
    const yPosition = pageHeight - 15

    // Linha separadora
    doc.setDrawColor(...theme.colors.border)
    doc.setLineWidth(0.3)
    doc.line(15, yPosition - 5, pageWidth - 15, yPosition - 5)

    // Texto do footer
    doc.setFont(theme.fonts.small.family, theme.fonts.small.weight)
    doc.setFontSize(theme.fonts.small.size)
    doc.setTextColor(...theme.colors.textSecondary)

    if (text) {
      doc.text(text, 15, yPosition)
    }

    // Número da página (direita)
    const pageText = `Página ${pageNumber} de ${totalPages}`
    const pageTextWidth = doc.getTextWidth(pageText)
    doc.text(pageText, pageWidth - 15 - pageTextWidth, yPosition)
  }

  /**
   * Título de seção com ícone
   */
  static sectionTitle(
    doc: jsPDF,
    options: {
      title: string
      icon?: string
      yPosition: number
      pageWidth: number
    }
  ): number {
    const { title, icon, yPosition, pageWidth } = options
    const theme = PDFComponents.currentTheme
    let currentY = yPosition

    // Background colorido
    doc.setFillColor(...theme.colors.primary)
    doc.roundedRect(15, currentY, pageWidth - 30, 12, 2, 2, 'F')

    // Texto do título
    doc.setFont(theme.fonts.subtitle.family, theme.fonts.subtitle.weight)
    doc.setFontSize(theme.fonts.subtitle.size)
    doc.setTextColor(255, 255, 255)

    const text = icon ? `${icon} ${title}` : title
    doc.text(text, 20, currentY + 8)

    currentY += 17

    return currentY
  }

  /**
   * Box informativo colorido
   */
  static infoBox(
    doc: jsPDF,
    options: {
      title?: string
      content: string
      type: InfoBoxType
      yPosition: number
      pageWidth: number
      maxWidth?: number
    }
  ): number {
    const { title, content, type, yPosition, pageWidth, maxWidth } = options
    const theme = PDFComponents.currentTheme
    let currentY = yPosition

    // Cores baseadas no tipo
    const typeColors: Record<InfoBoxType, [number, number, number]> = {
      success: theme.colors.success,
      warning: theme.colors.warning,
      error: theme.colors.error,
      info: theme.colors.info,
    }

    const typeIcons: Record<InfoBoxType, string> = {
      success: '✅',
      warning: '⚠️',
      error: '❌',
      info: 'ℹ️',
    }

    // Background com cor suave
    const bgColor = typeColors[type]
    doc.setFillColor(bgColor[0] + 40, bgColor[1] + 40, bgColor[2] + 40)

    const boxWidth = maxWidth || pageWidth - 30
    const boxX = (pageWidth - boxWidth) / 2

    // Calcular altura do box baseado no conteúdo
    doc.setFont(theme.fonts.body.family, theme.fonts.body.weight)
    doc.setFontSize(theme.fonts.body.size)
    const lines = doc.splitTextToSize(content, boxWidth - 20)
    const boxHeight = 12 + (title ? 8 : 0) + (lines.length * 5)

    doc.roundedRect(boxX, currentY, boxWidth, boxHeight, 3, 3, 'F')

    // Borda colorida
    doc.setDrawColor(...bgColor)
    doc.setLineWidth(1)
    doc.roundedRect(boxX, currentY, boxWidth, boxHeight, 3, 3, 'S')

    currentY += 7

    // Título do box (se fornecido)
    if (title) {
      doc.setFont(theme.fonts.body.family, 'bold')
      doc.setFontSize(theme.fonts.body.size + 1)
      doc.setTextColor(...typeColors[type])
      doc.text(`${typeIcons[type]} ${title}`, boxX + 10, currentY)
      currentY += 7
    }

    // Conteúdo
    doc.setFont(theme.fonts.body.family, theme.fonts.body.weight)
    doc.setFontSize(theme.fonts.body.size)
    doc.setTextColor(...theme.colors.text)
    doc.text(lines, boxX + 10, currentY)
    currentY += lines.length * 5 + 5

    return currentY
  }

  /**
   * Medidor de pontuação (gauge circular)
   */
  static scoreGauge(
    doc: jsPDF,
    options: {
      score: number
      maxScore: number
      x: number
      y: number
      radius: number
      label?: string
    }
  ): void {
    const { score, maxScore, x, y, radius, label } = options
    const theme = PDFComponents.currentTheme

    // Calcular porcentagem
    const percentage = (score / maxScore) * 100
    const angle = (percentage / 100) * 270 // 270 graus = 3/4 de círculo

    // Círculo de fundo (cinza)
    doc.setDrawColor(...theme.colors.border)
    doc.setLineWidth(8)
    doc.arc(x, y, radius, radius, 135, 405, undefined, 'S')

    // Arco de progresso (colorido baseado no score)
    let color = theme.colors.error
    if (percentage >= 80) color = theme.colors.success
    else if (percentage >= 60) color = theme.colors.info
    else if (percentage >= 40) color = theme.colors.warning

    doc.setDrawColor(...color)
    doc.setLineWidth(8)
    doc.arc(x, y, radius, radius, 135, 135 + angle, undefined, 'S')

    // Score no centro
    doc.setFont(theme.fonts.title.family, theme.fonts.title.weight)
    doc.setFontSize(theme.fonts.title.size + 4)
    doc.setTextColor(...color)

    const scoreText = `${score}`
    const scoreWidth = doc.getTextWidth(scoreText)
    doc.text(scoreText, x - scoreWidth / 2, y + 2)

    // Texto "/maxScore" menor
    doc.setFontSize(theme.fonts.body.size)
    doc.setTextColor(...theme.colors.textSecondary)
    const maxText = `/${maxScore}`
    doc.text(maxText, x + scoreWidth / 2 + 1, y + 2)

    // Label abaixo (se fornecido)
    if (label) {
      doc.setFont(theme.fonts.body.family, theme.fonts.body.weight)
      doc.setFontSize(theme.fonts.body.size)
      doc.setTextColor(...theme.colors.text)
      const labelWidth = doc.getTextWidth(label)
      doc.text(label, x - labelWidth / 2, y + radius + 8)
    }
  }

  /**
   * Timeline horizontal com steps
   */
  static timeline(
    doc: jsPDF,
    options: {
      steps: Array<{
        title: string
        description?: string
        icon?: string
        duration?: string
      }>
      yPosition: number
      pageWidth: number
    }
  ): number {
    const { steps, yPosition, pageWidth } = options
    const theme = PDFComponents.currentTheme
    let currentY = yPosition

    const stepWidth = (pageWidth - 40) / steps.length
    const lineY = currentY + 10

    // Linha conectora
    doc.setDrawColor(...theme.colors.border)
    doc.setLineWidth(2)
    doc.line(20, lineY, pageWidth - 20, lineY)

    // Desenhar cada step
    steps.forEach((step, index) => {
      const x = 20 + (stepWidth * index) + (stepWidth / 2)

      // Círculo do step
      doc.setFillColor(...theme.colors.primary)
      doc.circle(x, lineY, 5, 'F')

      // Número do step
      doc.setFont(theme.fonts.small.family, 'bold')
      doc.setFontSize(theme.fonts.small.size)
      doc.setTextColor(255, 255, 255)
      const numberText = `${index + 1}`
      const numberWidth = doc.getTextWidth(numberText)
      doc.text(numberText, x - numberWidth / 2, lineY + 1.5)

      // Ícone acima (se fornecido)
      if (step.icon) {
        doc.setFontSize(12)
        doc.setTextColor(...theme.colors.primary)
        const iconWidth = doc.getTextWidth(step.icon)
        doc.text(step.icon, x - iconWidth / 2, lineY - 8)
      }

      // Título abaixo
      doc.setFont(theme.fonts.small.family, 'bold')
      doc.setFontSize(theme.fonts.small.size)
      doc.setTextColor(...theme.colors.text)
      const titleLines = doc.splitTextToSize(step.title, stepWidth - 10)
      doc.text(titleLines, x, lineY + 8, { align: 'center', maxWidth: stepWidth - 10 })

      // Duração (se fornecida)
      if (step.duration) {
        doc.setFont(theme.fonts.small.family, theme.fonts.small.weight)
        doc.setTextColor(...theme.colors.textSecondary)
        const durationText = step.duration
        const durationWidth = doc.getTextWidth(durationText)
        doc.text(durationText, x - durationWidth / 2, lineY + 8 + (titleLines.length * 4) + 3)
      }
    })

    currentY += 35 + (steps.some(s => s.duration) ? 5 : 0)

    return currentY
  }

  /**
   * Tabela de preços estilizada
   */
  static priceTable(
    doc: jsPDF,
    options: {
      items: Array<{
        name: string
        price: number
        highlight?: boolean
        description?: string
      }>
      yPosition: number
      pageWidth: number
    }
  ): number {
    const { items, yPosition, pageWidth } = options
    const theme = PDFComponents.currentTheme
    let currentY = yPosition

    const tableWidth = pageWidth - 40
    const rowHeight = 18

    items.forEach((item, index) => {
      const y = currentY + (index * rowHeight)

      // Background (destacado se highlight)
      if (item.highlight) {
        doc.setFillColor(...theme.colors.primary)
        doc.roundedRect(20, y, tableWidth, rowHeight - 2, 2, 2, 'F')
      } else {
        doc.setFillColor(250, 250, 250)
        doc.roundedRect(20, y, tableWidth, rowHeight - 2, 2, 2, 'F')
      }

      // Nome do item
      doc.setFont(theme.fonts.body.family, 'bold')
      doc.setFontSize(theme.fonts.body.size + 1)
      doc.setTextColor(item.highlight ? 255 : theme.colors.text[0], item.highlight ? 255 : theme.colors.text[1], item.highlight ? 255 : theme.colors.text[2])
      doc.text(item.name, 25, y + 7)

      // Preço (direita)
      const priceText = `R$ ${item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      const priceWidth = doc.getTextWidth(priceText)
      doc.text(priceText, pageWidth - 25 - priceWidth, y + 7)

      // Descrição (se fornecida)
      if (item.description) {
        doc.setFont(theme.fonts.small.family, theme.fonts.small.weight)
        doc.setFontSize(theme.fonts.small.size)
        doc.setTextColor(item.highlight ? 240 : theme.colors.textSecondary[0], item.highlight ? 240 : theme.colors.textSecondary[1], item.highlight ? 240 : theme.colors.textSecondary[2])
        doc.text(item.description, 25, y + 12)
      }
    })

    currentY += items.length * rowHeight + 5

    return currentY
  }

  /**
   * Card de depoimento
   */
  static testimonial(
    doc: jsPDF,
    options: {
      text: string
      author: string
      role?: string
      rating?: number
      yPosition: number
      pageWidth: number
    }
  ): number {
    const { text, author, role, rating, yPosition, pageWidth } = options
    const theme = PDFComponents.currentTheme
    let currentY = yPosition

    const cardWidth = pageWidth - 40
    const cardX = 20

    // Background do card
    doc.setFillColor(249, 250, 251)
    doc.roundedRect(cardX, currentY, cardWidth, 0, 3, 3, 'F') // Altura será ajustada

    currentY += 10

    // Ícone de aspas
    doc.setFont(theme.fonts.title.family, 'bold')
    doc.setFontSize(24)
    doc.setTextColor(...theme.colors.primary)
    doc.text('"', cardX + 10, currentY)

    currentY += 5

    // Texto do depoimento
    doc.setFont(theme.fonts.body.family, 'normal')
    doc.setFontSize(theme.fonts.body.size)
    doc.setTextColor(...theme.colors.text)
    const lines = doc.splitTextToSize(text, cardWidth - 30)
    doc.text(lines, cardX + 15, currentY)
    currentY += lines.length * 5 + 5

    // Estrelas (se fornecido rating)
    if (rating) {
      doc.setFontSize(10)
      doc.setTextColor(245, 158, 11) // Amber
      const stars = '⭐'.repeat(rating)
      doc.text(stars, cardX + 15, currentY)
      currentY += 6
    }

    // Autor
    doc.setFont(theme.fonts.body.family, 'bold')
    doc.setFontSize(theme.fonts.body.size)
    doc.setTextColor(...theme.colors.text)
    doc.text(`— ${author}`, cardX + 15, currentY)
    currentY += 5

    // Cargo/role (se fornecido)
    if (role) {
      doc.setFont(theme.fonts.small.family, theme.fonts.small.weight)
      doc.setFontSize(theme.fonts.small.size)
      doc.setTextColor(...theme.colors.textSecondary)
      doc.text(role, cardX + 15, currentY)
      currentY += 5
    }

    currentY += 10

    // Ajustar altura do card
    const cardHeight = currentY - yPosition
    doc.setFillColor(249, 250, 251)
    doc.roundedRect(cardX, yPosition, cardWidth, cardHeight, 3, 3, 'F')

    // Borda sutil
    doc.setDrawColor(...theme.colors.border)
    doc.setLineWidth(0.5)
    doc.roundedRect(cardX, yPosition, cardWidth, cardHeight, 3, 3, 'S')

    return currentY
  }

  /**
   * QR Code
   */
  static async qrCode(
    doc: jsPDF,
    options: {
      url: string
      x: number
      y: number
      size: number
      label?: string
    }
  ): Promise<void> {
    const { url, x, y, size, label } = options
    const theme = PDFComponents.currentTheme

    try {
      // Gerar QR code como data URL
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: size * 4,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })

      // Adicionar imagem do QR code
      doc.addImage(qrDataUrl, 'PNG', x, y, size, size)

      // Label abaixo (se fornecido)
      if (label) {
        doc.setFont(theme.fonts.small.family, theme.fonts.small.weight)
        doc.setFontSize(theme.fonts.small.size)
        doc.setTextColor(...theme.colors.textSecondary)
        const labelWidth = doc.getTextWidth(label)
        doc.text(label, x + (size / 2) - (labelWidth / 2), y + size + 5)
      }
    } catch (error) {
      console.error('Erro ao gerar QR code:', error)

      // Fallback: desenhar placeholder
      doc.setDrawColor(...theme.colors.border)
      doc.setLineWidth(1)
      doc.rect(x, y, size, size, 'S')

      doc.setFont(theme.fonts.small.family, theme.fonts.small.weight)
      doc.setFontSize(theme.fonts.small.size)
      doc.setTextColor(...theme.colors.textSecondary)
      doc.text('QR Code', x + size / 2, y + size / 2, { align: 'center' })
    }
  }

  // ==========================================================================
  // COMPONENTES DE TEXTO
  // ==========================================================================

  /**
   * Lista com bullets
   */
  static bulletList(
    doc: jsPDF,
    options: {
      items: string[]
      yPosition: number
      indent?: number
      bulletChar?: string
    }
  ): number {
    const { items, yPosition, indent = 15, bulletChar = '•' } = options
    const theme = PDFComponents.currentTheme
    let currentY = yPosition

    doc.setFont(theme.fonts.body.family, theme.fonts.body.weight)
    doc.setFontSize(theme.fonts.body.size)
    doc.setTextColor(...theme.colors.text)

    items.forEach((item) => {
      // Bullet
      doc.text(bulletChar, indent, currentY)

      // Texto (com wrap)
      const lines = doc.splitTextToSize(item, 170)
      doc.text(lines, indent + 5, currentY)

      currentY += lines.length * 5 + 2
    })

    return currentY
  }

  /**
   * Parágrafo formatado
   */
  static paragraph(
    doc: jsPDF,
    options: {
      text: string
      yPosition: number
      maxWidth?: number
      align?: 'left' | 'center' | 'right' | 'justify'
      indent?: number
    }
  ): number {
    const { text, yPosition, maxWidth = 170, align = 'left', indent = 15 } = options
    const theme = PDFComponents.currentTheme
    let currentY = yPosition

    doc.setFont(theme.fonts.body.family, theme.fonts.body.weight)
    doc.setFontSize(theme.fonts.body.size)
    doc.setTextColor(...theme.colors.text)

    const lines = doc.splitTextToSize(text, maxWidth)
    doc.text(lines, indent, currentY, { align })
    currentY += lines.length * 5 + 3

    return currentY
  }

  /**
   * Callout box (destaque)
   */
  static callout(
    doc: jsPDF,
    options: {
      text: string
      yPosition: number
      pageWidth: number
      color?: [number, number, number]
    }
  ): number {
    const { text, yPosition, pageWidth, color } = options
    const theme = PDFComponents.currentTheme
    let currentY = yPosition

    const bgColor = color || theme.colors.accent
    const boxWidth = pageWidth - 60
    const boxX = 30

    // Calcular altura
    doc.setFont(theme.fonts.body.family, 'bold')
    doc.setFontSize(theme.fonts.body.size + 2)
    const lines = doc.splitTextToSize(text, boxWidth - 20)
    const boxHeight = 10 + (lines.length * 6)

    // Background
    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2], 0.1)
    doc.roundedRect(boxX, currentY, boxWidth, boxHeight, 2, 2, 'F')

    // Barra lateral colorida
    doc.setFillColor(...bgColor)
    doc.rect(boxX, currentY, 4, boxHeight, 'F')

    // Texto
    currentY += 7
    doc.setFont(theme.fonts.body.family, 'bold')
    doc.setFontSize(theme.fonts.body.size + 1)
    doc.setTextColor(...theme.colors.text)
    doc.text(lines, boxX + 12, currentY)
    currentY += lines.length * 6 + 5

    return currentY
  }
}
