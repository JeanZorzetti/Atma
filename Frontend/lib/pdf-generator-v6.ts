/**
 * PDF Generator V6 - Fase 4.1: Interatividade com QR Codes
 *
 * Adiciona ao V5:
 * - QR code para casos reais/antes-depois (na seção de Depoimentos)
 * - QR code para site Atma (na página de Próximos Passos)
 */

import { PDFGeneratorV5 } from './pdf-generator-v5'
import QRCode from 'qrcode'
import autoTable from 'jspdf-autotable'

interface RelatorioDataV6 extends any {
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

export class PDFGeneratorV6 extends PDFGeneratorV5 {

  /**
   * OVERRIDE: Seção de Depoimentos com QR Code para Casos Reais
   */
  protected generateTestimonialsSection(dados: RelatorioDataV6) {
    // Chamar método original da classe pai
    super.generateTestimonialsSection(dados)

    // Adicionar QR code para ver mais casos reais
    this.addNewPageIfNeeded(90)
    this.yPosition += 15

    // Box destacado para QR code
    this.doc.setFillColor(239, 246, 255) // Blue-50
    this.doc.roundedRect(15, this.yPosition, this.pageWidth - 30, 85, 3, 3, 'F')

    this.yPosition += 8

    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(12)
    this.doc.text('📱 VEJA MAIS CASOS REAIS', 20, this.yPosition)
    this.yPosition += 8

    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(10)
    this.addText('Confira centenas de casos antes/depois de pacientes reais que transformaram seus sorrisos com alinhadores invisíveis:', 10, 'normal')
    this.yPosition += 10

    this.generateQRCodeBlock(
      'https://atma.roilabs.com.br/pacientes/antes-depois',
      'atma.roilabs.com.br/pacientes/antes-depois',
      50
    )

    this.yPosition += 8

    this.doc.setFont('helvetica', 'italic')
    this.doc.setFontSize(9)
    this.doc.setTextColor(107, 114, 128)
    this.addText('💡 Você pode filtrar por problema ortodôntico similar ao seu e ver resultados de verdade!', 10, 'italic')
    this.doc.setTextColor(0, 0, 0)

    this.yPosition += 15
  }

  /**
   * OVERRIDE: Seção de Próximos Passos com QR Code para Site Atma
   */
  protected generateNextStepsSection(dados: RelatorioDataV6) {
    // Chamar método original da classe pai
    super.generateNextStepsSection(dados)

    // Adicionar QR code para o site Atma
    this.addNewPageIfNeeded(100)
    this.yPosition += 15

    // Título
    this.addSectionTitle('CONHEÇA MAIS SOBRE A TECNOLOGIA ATMA', '🚀')
    this.yPosition += 10

    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(10)
    this.addText('Quer saber mais sobre a tecnologia por trás dos alinhadores Atma, certificações, ciência e diferenciais?', 10, 'normal')
    this.yPosition += 8

    this.addText('Acesse nosso site e descubra por que somos a escolha de milhares de brasileiros:', 10, 'normal')
    this.yPosition += 12

    this.generateQRCodeBlock(
      'https://atma.roilabs.com.br',
      'atma.roilabs.com.br',
      55
    )

    this.yPosition += 10

    // Box com informações adicionais
    this.addNewPageIfNeeded(50)

    this.doc.setFillColor(243, 244, 246) // Gray-100
    this.doc.roundedRect(15, this.yPosition, this.pageWidth - 30, 45, 3, 3, 'F')

    this.yPosition += 8

    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('📚 No nosso site você encontra:', 20, this.yPosition)
    this.yPosition += 8

    const recursos = [
      '• Artigos educativos sobre ortodontia invisível',
      '• Vídeos explicativos sobre o tratamento',
      '• FAQ com as dúvidas mais comuns',
      '• Calculadora de economia (compare preços)',
      '• Encontre ortodontistas parceiros na sua região'
    ]

    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(9)

    recursos.forEach(recurso => {
      this.doc.text(recurso, 25, this.yPosition)
      this.yPosition += 5
    })

    this.yPosition += 15

    // NOVO: QR Code para Blog (artigos educativos)
    this.addNewPageIfNeeded(95)

    // Box destacado para QR code do blog
    this.doc.setFillColor(254, 249, 195) // Yellow-100
    this.doc.roundedRect(15, this.yPosition, this.pageWidth - 30, 90, 3, 3, 'F')

    this.yPosition += 8

    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(12)
    this.doc.text('📖 APRENDA MAIS NO NOSSO BLOG', 20, this.yPosition)
    this.yPosition += 8

    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(10)
    this.addText('Acesse artigos completos sobre ortodontia invisível, dicas de cuidados, comparações de preços e muito mais:', 10, 'normal')
    this.yPosition += 10

    this.generateQRCodeBlock(
      'https://atma.roilabs.com.br/blog',
      'atma.roilabs.com.br/blog',
      50
    )

    this.yPosition += 8

    this.doc.setFont('helvetica', 'italic')
    this.doc.setFontSize(9)
    this.doc.setTextColor(107, 114, 128)
    this.addText('💡 Novos artigos publicados semanalmente com dicas práticas e informações atualizadas!', 10, 'italic')
    this.doc.setTextColor(0, 0, 0)

    this.yPosition += 15
  }

  /**
   * HELPER: Método reutilizável para gerar bloco de QR code
   */
  private generateQRCodeBlock(url: string, displayText: string, qrSize: number = 55) {
    try {
      // Gerar QR code de forma síncrona para evitar problemas de async
      QRCode.toDataURL(url, {
        width: 200,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).then(qrCodeDataURL => {
        const qrX = (this.pageWidth - qrSize) / 2

        this.doc.addImage(qrCodeDataURL, 'PNG', qrX, this.yPosition, qrSize, qrSize)
        this.yPosition += qrSize + 6

        // Link abaixo do QR code
        this.doc.setFont('helvetica', 'normal')
        this.doc.setFontSize(9)
        this.doc.setTextColor(37, 99, 235)
        this.doc.textWithLink(displayText, this.pageWidth / 2, this.yPosition, {
          align: 'center',
          url: url
        })
        this.doc.setTextColor(0, 0, 0)
        this.yPosition += 8

      }).catch(error => {
        console.error('Erro ao gerar QR code:', error)
        // Fallback: apenas mostrar o link
        this.doc.setFont('helvetica', 'normal')
        this.doc.setFontSize(9)
        this.doc.setTextColor(37, 99, 235)
        this.doc.textWithLink(displayText, this.pageWidth / 2, this.yPosition, {
          align: 'center',
          url: url
        })
        this.doc.setTextColor(0, 0, 0)
        this.yPosition += 15
      })

    } catch (error) {
      console.error('Erro ao gerar QR code:', error)
      // Fallback: apenas mostrar o link
      this.doc.setFont('helvetica', 'normal')
      this.doc.setFontSize(9)
      this.doc.setTextColor(37, 99, 235)
      this.doc.textWithLink(displayText, this.pageWidth / 2, this.yPosition, {
        align: 'center',
        url: url
      })
      this.doc.setTextColor(0, 0, 0)
      this.yPosition += 15
    }
  }

  /**
   * NOVA SEÇÃO: Como Funciona? (Infográfico melhorado)
   */
  private generateHowItWorksSection() {
    this.addPage()
    this.yPosition = 30

    // Header da seção com fundo azul
    this.doc.setFillColor(37, 99, 235)
    this.doc.rect(0, this.yPosition - 5, this.pageWidth, 25, 'F')

    this.doc.setTextColor(255, 255, 255)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(16)
    this.doc.text('Como Funciona?', this.pageWidth / 2, this.yPosition + 8, { align: 'center' })

    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(10)
    this.doc.text('Consulta Online de Ortodontia - Processo Completo em 4 Passos', this.pageWidth / 2, this.yPosition + 15, { align: 'center' })
    this.doc.setTextColor(0, 0, 0)

    this.yPosition += 30

    const passos = [
      {
        numero: 1,
        titulo: 'Agende Sua Consulta',
        subtitulo: 'Rapido e Facil',
        itens: [
          'Use o QR code abaixo ou acesse o link',
          'Escolha data e horario disponiveis',
          'Confirmacao instantanea por email'
        ],
        cor: [59, 130, 246] as [number, number, number],
        icon: '[CAL]'
      },
      {
        numero: 2,
        titulo: 'Preparacao',
        subtitulo: 'Antes da Consulta',
        itens: [
          'Receba link da videochamada por email',
          'Checklist de preparacao e documentos',
          'Teste de camera e microfone'
        ],
        cor: [16, 185, 129] as [number, number, number],
        icon: '[DOC]'
      },
      {
        numero: 3,
        titulo: 'Consulta Online (30min)',
        subtitulo: 'Atendimento Personalizado',
        itens: [
          'Conversa inicial com ortodontista',
          'Analise visual do sorriso',
          'Tire todas as suas duvidas'
        ],
        cor: [245, 158, 11] as [number, number, number],
        icon: '[VID]'
      },
      {
        numero: 4,
        titulo: 'Receba Recomendacoes',
        subtitulo: 'Proximos Passos',
        itens: [
          'Orientacoes personalizadas por email',
          'Plano de tratamento sugerido',
          'Proximos passos e agendamentos'
        ],
        cor: [139, 92, 246] as [number, number, number],
        icon: '[OK]'
      },
    ]

    const stepWidth = (this.pageWidth - 40) / 2
    const stepHeight = 65

    passos.forEach((passo, index) => {
      const isLeft = index % 2 === 0
      const xPos = isLeft ? 15 : (this.pageWidth / 2 + 5)

      if (index > 0 && index % 2 === 0) {
        this.yPosition += stepHeight + 15
      }

      this.addNewPageIfNeeded(stepHeight + 10)

      // Setas conectoras
      if (index > 0) {
        this.doc.setDrawColor(107, 114, 128)
        this.doc.setLineWidth(2)
        if (index === 1) {
          const arrowY = this.yPosition - (stepHeight / 2)
          this.doc.line(15 + stepWidth, arrowY, this.pageWidth / 2 + 5, arrowY)
          this.doc.line(this.pageWidth / 2 + 5, arrowY, this.pageWidth / 2, arrowY - 3)
          this.doc.line(this.pageWidth / 2 + 5, arrowY, this.pageWidth / 2, arrowY + 3)
        } else if (index === 2) {
          this.doc.line(this.pageWidth / 2 + 5 + stepWidth / 2, this.yPosition - stepHeight - 15, this.pageWidth / 2 + 5 + stepWidth / 2, this.yPosition)
          this.doc.line(this.pageWidth / 2 + 5 + stepWidth / 2, this.yPosition, this.pageWidth / 2 + 5 + stepWidth / 2 - 3, this.yPosition - 5)
          this.doc.line(this.pageWidth / 2 + 5 + stepWidth / 2, this.yPosition, this.pageWidth / 2 + 5 + stepWidth / 2 + 3, this.yPosition - 5)
        } else if (index === 3) {
          const arrowY = this.yPosition + (stepHeight / 2)
          this.doc.line(this.pageWidth / 2 + 5, arrowY, 15 + stepWidth, arrowY)
          this.doc.line(15 + stepWidth, arrowY, 15 + stepWidth + 5, arrowY - 3)
          this.doc.line(15 + stepWidth, arrowY, 15 + stepWidth + 5, arrowY + 3)
        }
      }

      const yStart = (index > 1 && index % 2 === 0) ? this.yPosition : (index === 0 ? this.yPosition : this.yPosition)

      // Badge com número
      this.doc.setFillColor(...passo.cor)
      this.doc.roundedRect(xPos, yStart, 25, 12, 2, 2, 'F')
      this.doc.setTextColor(255, 255, 255)
      this.doc.setFont('helvetica', 'bold')
      this.doc.setFontSize(14)
      this.doc.text(String(passo.numero), xPos + 12.5, yStart + 8.5, { align: 'center' })

      // Ícone
      this.doc.setFont('helvetica', 'bold')
      this.doc.setFontSize(9)
      this.doc.text(passo.icon, xPos + stepWidth - 20, yStart + 8.5)
      this.doc.setTextColor(0, 0, 0)

      // Box principal
      this.doc.setDrawColor(...passo.cor)
      this.doc.setLineWidth(2)
      this.doc.setFillColor(255, 255, 255)
      this.doc.roundedRect(xPos, yStart + 15, stepWidth, stepHeight - 15, 3, 3, 'FD')

      // Título
      this.doc.setFont('helvetica', 'bold')
      this.doc.setFontSize(11)
      this.doc.setTextColor(...passo.cor)
      this.doc.text(passo.titulo, xPos + 5, yStart + 23)

      // Subtítulo
      this.doc.setFont('helvetica', 'italic')
      this.doc.setFontSize(8)
      this.doc.setTextColor(107, 114, 128)
      this.doc.text(passo.subtitulo, xPos + 5, yStart + 29)
      this.doc.setTextColor(0, 0, 0)

      // Linha separadora
      this.doc.setDrawColor(...passo.cor)
      this.doc.setLineWidth(0.5)
      this.doc.line(xPos + 5, yStart + 31, xPos + stepWidth - 5, yStart + 31)

      // Itens (bullets)
      let itemY = yStart + 38
      this.doc.setFont('helvetica', 'normal')
      this.doc.setFontSize(8)
      passo.itens.forEach(item => {
        this.doc.setFillColor(...passo.cor)
        this.doc.circle(xPos + 8, itemY - 1.5, 1.5, 'F')

        const itemLines = this.doc.splitTextToSize(item, stepWidth - 20)
        this.doc.text(itemLines, xPos + 12, itemY)
        itemY += itemLines.length * 4 + 2
      })
    })

    this.yPosition += stepHeight + 20

    // CTA box com QR Code
    this.addNewPageIfNeeded(90)

    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(12)
    this.doc.text('Agende Agora Sua Consulta Online', this.pageWidth / 2, this.yPosition, { align: 'center' })
    this.yPosition += 8

    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(10)
    this.addText('Escaneie o QR code abaixo com a camera do seu celular ou acesse o link:', 10, 'normal')
    this.yPosition += 10

    // QR Code para agendamento
    const consultaURL = 'https://atma.roilabs.com.br/consulta-online'
    this.generateQRCodeBlock(consultaURL, 'atma.roilabs.com.br/consulta-online', 60)

    this.yPosition += 10

    // Box final com bônus
    this.addNewPageIfNeeded(45)

    this.doc.setFillColor(240, 253, 244) // Green-50
    this.doc.roundedRect(15, this.yPosition, this.pageWidth - 30, 40, 3, 3, 'F')

    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(11)
    this.doc.text('[BONUS] BONUS EXCLUSIVO', 20, this.yPosition + 8)

    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(9)
    this.yPosition += 14

    const maxWidth = this.pageWidth - 50
    const bonusText = 'Quem agendar a consulta online recebe um desconto de R$ 97 no valor do tratamento caso decida seguir com a Atma! Ou seja, a consulta sai de GRACA se voce fechar o tratamento.'

    const lines = this.doc.splitTextToSize(bonusText, maxWidth)
    lines.forEach((line: string) => {
      this.doc.text(line, 20, this.yPosition)
      this.yPosition += 5
    })

    this.yPosition += 15
  }

  /**
   * OVERRIDE: Generate com seção "Como Funciona?" adicionada
   */
  async generate(dados: RelatorioDataV6): Promise<Buffer> {
    // Copiar o fluxo do V5, mas adicionar generateHowItWorksSection antes de NextSteps

    // Do V5/V4/V3
    this.generateCoverPage(dados)
    this.generateIndexPage(dados)
    this.generateAboutYouSection(dados)

    // Do V4
    await (this as any).generateCaseSpecificSection(dados)

    // Do V3
    this.generateScoreSection(dados)

    // Do V4 (com gráficos)
    await (this as any).generateDetailedAnalysisSectionV4(dados)
    await (this as any).generateExpandedComparativeSectionV4(dados)
    await (this as any).generateDetailedTimelineSectionV4(dados)
    await (this as any).generateFinancialPlanSectionV4(dados)

    // Do V3
    this.generateQuestionsForOrthodontistSection(dados)
    this.generateScienceTechnologySection(dados)
    this.generateCareMaintenanceSection(dados)

    // Do V3/V6 (override de Testimonials com QR code)
    this.generateTestimonialsSection(dados)

    // Do V5
    await (this as any).generateOnlineConsultationUpsell(dados)

    // NOVO V6: Como Funciona? (infográfico melhorado)
    this.generateHowItWorksSection()

    // Do V3/V6 (override de NextSteps com QR code)
    this.generateNextStepsSection(dados)

    // Adicionar footers
    const totalPages = this.doc.getNumberOfPages()
    for (let i = 2; i <= totalPages; i++) {
      this.doc.setPage(i)
      this.addFooter(i)
    }

    // Retornar PDF
    const pdfBuffer = Buffer.from(this.doc.output('arraybuffer'))
    return pdfBuffer
  }
}

// Função wrapper para manter compatibilidade
export async function gerarPDFRelatorioV6(dados: any): Promise<Buffer> {
  const generator = new PDFGeneratorV6()
  return await generator.generate(dados)
}
