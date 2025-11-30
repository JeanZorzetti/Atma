/**
 * PDF Generator V5 - Fase 5: Integrações e Automações
 *
 * Adiciona ao V4:
 * - Seção de upsell: Oferta de consulta online (R$ 97)
 */

import { PDFGeneratorV4 } from './pdf-generator-v4'
import QRCode from 'qrcode'
import autoTable from 'jspdf-autotable'

// Estender a interface para incluir URLs de upsell
interface RelatorioDataV5 extends any {
  // Herda tudo do V4
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

export class PDFGeneratorV5 extends PDFGeneratorV4 {

  /**
   * NOVA SEÇÃO V5: Oferta de Consulta Online (Upsell)
   * Promove consulta online com ortodontista por R$ 97
   */
  private async generateOnlineConsultationUpsell(dados: RelatorioDataV5) {
    this.addPage()
    this.yPosition = 30

    // Título da seção com emoji
    this.addSectionTitle('ACELERE SUA DECISÃO COM UMA CONSULTA ONLINE', '🎥')
    this.yPosition += 10

    // Box de destaque com oferta
    this.addNewPageIfNeeded(60)

    // Background azul para destacar a oferta
    this.doc.setFillColor(37, 99, 235) // Primary blue
    this.doc.roundedRect(15, this.yPosition, this.pageWidth - 30, 55, 5, 5, 'F')

    // Texto em branco sobre fundo azul
    this.doc.setTextColor(255, 255, 255)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(16)
    this.doc.text('OFERTA ESPECIAL', this.pageWidth / 2, this.yPosition + 10, { align: 'center' })

    this.doc.setFontSize(14)
    this.yPosition += 22
    this.doc.text('Consulta Online com Ortodontista Especialista', this.pageWidth / 2, this.yPosition, { align: 'center' })

    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(12)
    this.yPosition += 10
    this.doc.text('Tire todas as suas dúvidas em 30 minutos via videochamada', this.pageWidth / 2, this.yPosition, { align: 'center' })

    // Preço em destaque
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(24)
    this.yPosition += 15
    this.doc.text('Apenas R$ 97', this.pageWidth / 2, this.yPosition, { align: 'center' })

    this.yPosition += 20

    // Voltar para texto preto
    this.doc.setTextColor(0, 0, 0)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(10)

    // Benefícios da consulta online
    this.addNewPageIfNeeded(80)
    this.yPosition += 8

    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(12)
    this.doc.text('Por Que Fazer Uma Consulta Online?', 15, this.yPosition)
    this.yPosition += 10

    const beneficios = [
      '✅ Análise personalizada do seu caso por ortodontista certificado',
      '✅ Tire todas as suas dúvidas sobre alinhadores invisíveis',
      '✅ Receba orientações específicas para o seu problema ortodôntico',
      '✅ Conheça o passo a passo do tratamento com a Atma',
      '✅ Avalie se você é um bom candidato para alinhadores',
      '✅ 30 minutos de atenção exclusiva via videochamada',
      '✅ Sem compromisso - tome sua decisão com segurança',
      '✅ Agendamento flexível - escolha o melhor horário para você'
    ]

    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(10)

    beneficios.forEach(beneficio => {
      this.addNewPageIfNeeded(10)
      this.addText(beneficio, 10, 'normal', 7)
      this.yPosition += 7
    })

    this.yPosition += 15

    // Nota final (melhor aproveitamento do espaço)
    this.doc.setFont('helvetica', 'italic')
    this.doc.setFontSize(9)
    this.doc.setTextColor(107, 114, 128) // Gray-500
    this.addText('[!] Dica: A consulta online e perfeita para quem quer entender melhor o tratamento antes de visitar um consultorio presencial. Voce pode fazer de casa, do trabalho, ou de onde estiver!', 10, 'italic')
    this.doc.setTextColor(0, 0, 0)

    // REMOVIDO: Seção "Como Funciona?" movida para V6 com design melhorado
    // A nova versão está no V6.generateHowItWorksSection() com infográfico 2x2
  }

  /**
   * Método principal - gera PDF V5 com seção de upsell
   */
  async generate(dados: RelatorioDataV5): Promise<Buffer> {
    // Gerar capa e índice (do V3)
    this.generateCoverPage(dados)
    this.generateIndexPage(dados)

    // Sobre Você (do V3)
    this.generateAboutYouSection(dados)

    // Seção específica do caso (V4)
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

    // NOVO V5: Upsell - Consulta Online
    await this.generateOnlineConsultationUpsell(dados)

    // Próximos Passos (do V3) - vem depois do upsell
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
export async function gerarPDFRelatorioV5(dados: any): Promise<Buffer> {
  const generator = new PDFGeneratorV5()
  return await generator.generate(dados)
}
