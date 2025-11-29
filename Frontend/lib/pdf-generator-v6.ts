/**
 * PDF Generator V6 - Fase 4.1: Interatividade com QR Codes
 *
 * Adiciona ao V5:
 * - QR code para casos reais/antes-depois (na seção de Depoimentos)
 * - QR code para site Atma (na página de Próximos Passos)
 */

import { PDFGeneratorV5 } from './pdf-generator-v5'
import QRCode from 'qrcode'
import 'jspdf-autotable' // IMPORTANT: Import to register plugin with jsPDF

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
   * Método principal - gera PDF V6 com QR codes adicionais
   * (Herda todo o fluxo do V5, apenas sobrescreve seções específicas)
   */
  async generate(dados: RelatorioDataV6): Promise<Buffer> {
    // Simplesmente chamar o generate do V5
    // Os overrides de generateTestimonialsSection e generateNextStepsSection
    // já serão aplicados automaticamente
    return await super.generate(dados)
  }
}

// Função wrapper para manter compatibilidade
export async function gerarPDFRelatorioV6(dados: any): Promise<Buffer> {
  const generator = new PDFGeneratorV6()
  return await generator.generate(dados)
}
