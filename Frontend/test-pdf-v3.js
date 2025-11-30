/**
 * Script de teste para geração do PDF V3 (Phase 2)
 *
 * Para testar:
 * 1. cd Frontend
 * 2. node test-pdf-v3.js
 *
 * Isso vai gerar um PDF de teste e salvá-lo localmente
 */

// Este é um script Node.js puro, não TypeScript
// Precisamos usar require ao invés de import

const fs = require('fs');
const path = require('path');

// Dados de teste simulando um cliente real
const dadosTeste = {
  cliente: {
    nome: 'João Silva',
    idade: '32',
    localizacao: 'São Paulo/SP',
    email: 'joao.silva@teste.com'
  },
  score: 78,
  estimativaCustos: {
    categoria: 'moderado',
    faixaPreco: { min: 5990, max: 7990 },
    alinhadores: '21-35',
    comparacao: {
      atma: 5990,
      invisalign: 14975,
      aparelhoFixo: 4193,
      economia: 8985
    }
  },
  timeline: '9-15 meses',
  analise: 'Excelente notícia, João! Seu caso apresenta alta viabilidade para tratamento com alinhadores invisíveis. Baseado nas suas respostas, você tem 2 problema(s) identificado(s), que são típicos de casos tratados com sucesso usando alinhadores.',
  planoAcao: [
    '1. Agende consulta com ortodontista certificado na sua região (São Paulo/SP)',
    '2. Solicite orçamento para caso moderado (espere entre R$ 5.990 - R$ 7.990)',
    '3. Perguntas essenciais para fazer:',
    '   - Quantos alinhadores serão necessários no meu caso?',
    '   - Qual o tempo estimado de tratamento?',
    '   - Há necessidade de attachments (botões) nos dentes?',
    '   - O que está incluso no valor (contenção pós-tratamento, ajustes)?',
    '   - Qual o material dos alinhadores? (Procure por PETG médico)',
    '5. Compare no mínimo 3 orçamentos diferentes usando a tabela de referência deste relatório'
  ],
  dataGeracao: new Date().toLocaleDateString('pt-BR'),
  formData: {
    problemasAtuais: [
      'Dentes tortos',
      'Apinhamento (dentes montados)'
    ],
    jaUsouAparelho: 'Não, nunca usei aparelho ortodôntico',
    problemasSaude: [],
    expectativaResultado: '80-90% de melhora já estaria ótimo',
    urgenciaTratamento: 'Gostaria de começar em 1-2 meses',
    orcamentoRecebido: 'R$ 8.000 - R$ 12.000',
    disponibilidadeUso: 'Sim, consigo usar 22 horas por dia',
    profissao: 'Engenheiro de Software'
  }
};

async function testarPDFV3() {
  console.log('🔄 Iniciando teste do PDF V3...\n');

  try {
    // Importar o gerador V3
    console.log('📦 Importando pdf-generator-v3...');
    const { gerarPDFRelatorioV3 } = require('./lib/pdf-generator-v3.ts');

    console.log('✅ Módulo importado com sucesso\n');
    console.log('📊 Dados de teste:');
    console.log('   - Cliente:', dadosTeste.cliente.nome);
    console.log('   - Score:', dadosTeste.score);
    console.log('   - Categoria:', dadosTeste.estimativaCustos.categoria);
    console.log('   - Timeline:', dadosTeste.timeline);
    console.log('\n🔄 Gerando PDF...\n');

    // Gerar PDF
    const pdfBuffer = await gerarPDFRelatorioV3(dadosTeste);

    // Salvar em arquivo
    const outputPath = path.join(__dirname, 'teste-pdf-v3.pdf');
    fs.writeFileSync(outputPath, pdfBuffer);

    console.log('✅ PDF gerado com sucesso!');
    console.log('📁 Arquivo salvo em:', outputPath);
    console.log('📄 Tamanho:', (pdfBuffer.length / 1024).toFixed(2), 'KB');
    console.log('\n🎉 Teste concluído! Abra o arquivo para verificar o resultado.\n');

  } catch (error) {
    console.error('❌ Erro ao gerar PDF:');
    console.error(error);
    process.exit(1);
  }
}

// Executar teste
testarPDFV3();
