import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface RelatorioData {
  cliente: {
    nome: string
    idade: string
    localizacao: string
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

export async function gerarPDFRelatorio(dados: RelatorioData): Promise<Buffer> {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  let yPosition = 20

  // Helper functions
  const addNewPageIfNeeded = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      doc.addPage()
      yPosition = 20
      return true
    }
    return false
  }

  const addSectionTitle = (title: string) => {
    addNewPageIfNeeded(20)
    doc.setFillColor(37, 99, 235) // Blue-600
    doc.rect(10, yPosition, pageWidth - 20, 10, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(title, 15, yPosition + 7)
    doc.setTextColor(0, 0, 0)
    yPosition += 15
  }

  const addText = (text: string, fontSize = 11, style: 'normal' | 'bold' = 'normal') => {
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', style)
    const lines = doc.splitTextToSize(text, pageWidth - 30)
    lines.forEach((line: string) => {
      addNewPageIfNeeded(7)
      doc.text(line, 15, yPosition)
      yPosition += 7
    })
  }

  // ======================
  // PÁGINA 1: CAPA
  // ======================
  doc.setFillColor(37, 99, 235)
  doc.rect(0, 0, pageWidth, pageHeight, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(32)
  doc.setFont('helvetica', 'bold')
  doc.text('RELATÓRIO DE', pageWidth / 2, 80, { align: 'center' })
  doc.text('VIABILIDADE', pageWidth / 2, 95, { align: 'center' })
  doc.text('ORTODÔNTICA', pageWidth / 2, 110, { align: 'center' })

  doc.setFontSize(18)
  doc.setFont('helvetica', 'normal')
  doc.text('Análise Personalizada Completa', pageWidth / 2, 130, { align: 'center' })

  // Box com info do cliente
  doc.setFillColor(255, 255, 255, 0.1)
  doc.rect(30, 150, pageWidth - 60, 40, 'F')
  doc.setFontSize(12)
  doc.text(`Cliente: ${dados.cliente.nome}`, pageWidth / 2, 165, { align: 'center' })
  doc.text(`Idade: ${dados.cliente.idade} anos`, pageWidth / 2, 175, { align: 'center' })
  doc.text(`Localização: ${dados.cliente.localizacao}`, pageWidth / 2, 185, { align: 'center' })

  doc.setFontSize(10)
  doc.text(`Data: ${dados.dataGeracao}`, pageWidth / 2, 250, { align: 'center' })
  doc.text('Atma Aligner - Tecnologia Alemã', pageWidth / 2, 260, { align: 'center' })

  // ======================
  // PÁGINA 2: SCORE
  // ======================
  doc.addPage()
  yPosition = 20

  addSectionTitle('📊 SCORE DE VIABILIDADE')

  // Grande score visual
  const scoreColor = dados.score >= 70 ? [16, 185, 129] : dados.score >= 50 ? [251, 191, 36] : [239, 68, 68]
  doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2], 0.1)
  doc.rect(30, yPosition, pageWidth - 60, 50, 'F')

  doc.setFontSize(60)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2])
  doc.text(`${dados.score}/100`, pageWidth / 2, yPosition + 35, { align: 'center' })

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  yPosition += 55

  // Interpretação do score
  let interpretacao = ''
  if (dados.score >= 75) {
    interpretacao = '✅ EXCELENTE - Seu caso apresenta alta viabilidade para alinhadores invisíveis!'
  } else if (dados.score >= 60) {
    interpretacao = '✓ BOM - Seu caso é adequado para alinhadores com algumas considerações.'
  } else if (dados.score >= 40) {
    interpretacao = '⚠️ MODERADO - Alinhadores são possíveis, mas pode haver desafios.'
  } else {
    interpretacao = '⚠️ BAIXO - Recomendamos avaliação presencial detalhada.'
  }

  addText(interpretacao, 12, 'bold')
  yPosition += 5

  // ======================
  // ANÁLISE PERSONALIZADA
  // ======================
  addSectionTitle('🔍 ANÁLISE PERSONALIZADA')
  addText(dados.analise)
  yPosition += 10

  // ======================
  // PÁGINA 3: CUSTOS
  // ======================
  doc.addPage()
  yPosition = 20

  addSectionTitle('💰 ESTIMATIVA DE CUSTOS')

  addText(`Categoria do Caso: ${dados.estimativaCustos.categoria.toUpperCase()}`, 12, 'bold')
  addText(`Alinhadores Necessários: ${dados.estimativaCustos.alinhadores}`)
  addText(`Timeline Estimado: ${dados.timeline}`)
  yPosition += 5

  // Tabela de custos
  autoTable(doc, {
    startY: yPosition,
    head: [['Item', 'Valor']],
    body: [
      ['Faixa de Preço (Atma)', `R$ ${dados.estimativaCustos.faixaPreco.min.toLocaleString('pt-BR')} - R$ ${dados.estimativaCustos.faixaPreco.max.toLocaleString('pt-BR')}`],
      ['Parcelamento', `12x de R$ ${Math.round(dados.estimativaCustos.faixaPreco.min / 12)} sem juros`],
    ],
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235] },
    margin: { left: 15, right: 15 },
  })

  yPosition = (doc as any).lastAutoTable.finalY + 10

  // Comparativo de mercado
  addSectionTitle('📊 COMPARATIVO DE MERCADO')

  autoTable(doc, {
    startY: yPosition,
    head: [['Opção', 'Preço Estimado', 'Diferença']],
    body: [
      [
        'Atma Aligner',
        `R$ ${dados.estimativaCustos.comparacao.atma.toLocaleString('pt-BR')}`,
        'Base'
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
    headStyles: { fillColor: [37, 99, 235] },
    margin: { left: 15, right: 15 },
  })

  yPosition = (doc as any).lastAutoTable.finalY + 10

  addText(`💡 Economia Potencial: Escolhendo Atma ao invés de Invisalign, você pode economizar até R$ ${dados.estimativaCustos.comparacao.economia.toLocaleString('pt-BR')}!`, 11, 'bold')

  // ======================
  // PÁGINA 4: PLANO DE AÇÃO
  // ======================
  doc.addPage()
  yPosition = 20

  addSectionTitle('🎯 PLANO DE AÇÃO PERSONALIZADO')

  dados.planoAcao.forEach((acao, index) => {
    addNewPageIfNeeded(15)
    doc.setFillColor(37, 99, 235, 0.05)
    doc.rect(15, yPosition - 5, pageWidth - 30, 10, 'F')
    addText(acao, 10)
    yPosition += 5
  })

  // ======================
  // PÁGINA FINAL: PRÓXIMOS PASSOS
  // ======================
  doc.addPage()
  yPosition = 20

  addSectionTitle('📞 PRÓXIMOS PASSOS')

  addText('Parabéns por dar este importante passo! Agora que você tem este relatório completo:', 11, 'bold')
  yPosition += 5

  const proximosPassos = [
    '1. Agende consultas com pelo menos 3 ortodontistas',
    '2. Leve este relatório impresso para as consultas',
    '3. Use as perguntas sugeridas neste documento',
    '4. Compare os orçamentos recebidos com nossa tabela de referência',
    '5. Não tenha pressa - escolha o profissional que te passar mais confiança',
  ]

  proximosPassos.forEach(passo => {
    addText(passo)
    yPosition += 2
  })

  yPosition += 10

  // Box de contato
  doc.setFillColor(37, 99, 235, 0.1)
  doc.rect(15, yPosition, pageWidth - 30, 40, 'F')
  yPosition += 10

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Entre em Contato com a Atma', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 10

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('📧 Email: contato@atma.com.br', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 7
  doc.text('📱 WhatsApp: (11) 99999-9999', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 7
  doc.text('🌐 Site: www.atma.com.br', pageWidth / 2, yPosition, { align: 'center' })

  yPosition += 15

  // Disclaimer
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  const disclaimer = 'Este relatório é uma análise preliminar baseada nas suas respostas. Não substitui consulta presencial com ortodontista. Os valores são estimativas e podem variar conforme complexidade do caso e região. Consulte sempre um profissional habilitado.'
  const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth - 30)
  disclaimerLines.forEach((line: string) => {
    doc.text(line, pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 4
  })

  // Retornar PDF como Buffer
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'))
  return pdfBuffer
}
