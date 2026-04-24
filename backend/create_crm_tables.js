const { executeQuery } = require('./src/config/database');

async function createCrmTables() {
  console.log('🔧 Iniciando criação das tabelas CRM...');
  
  try {
    // Criar tabela crm_leads
    const crmLeadsTable = `
      CREATE TABLE IF NOT EXISTS crm_leads (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nome VARCHAR(255) NOT NULL,
        clinica VARCHAR(255) NOT NULL,
        cro VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL,
        telefone VARCHAR(20) NOT NULL,
        cep VARCHAR(10) NULL,
        cidade VARCHAR(100) NULL,
        estado VARCHAR(2) NULL,
        endereco_completo TEXT NULL,
        consultórios ENUM('1', '2-3', '4-5', '6+') NULL,
        scanner ENUM('sim', 'nao') NULL,
        scanner_marca VARCHAR(100) NULL,
        casos_mes ENUM('1-5', '6-10', '11-20', '21+') NULL,
        interesse ENUM('atma-aligner', 'atma-labs', 'ambos') NULL,
        status ENUM('prospeccao', 'contato_inicial', 'apresentacao', 'negociacao') DEFAULT 'prospeccao',
        responsavel_comercial VARCHAR(255) NULL,
        origem_lead ENUM('inbound', 'outbound', 'indicacao', 'evento', 'outro') DEFAULT 'outbound',
        primeira_interacao TEXT NULL,
        observacoes_internas TEXT NULL,
        próximo_followup DATETIME NULL,
        data_prospeccao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        data_contato_inicial TIMESTAMP NULL,
        data_apresentacao TIMESTAMP NULL,
        data_negociacao TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_responsavel (responsavel_comercial),
        INDEX idx_created_at (created_at),
        INDEX idx_próximo_followup (próximo_followup)
      )
    `;

    await executeQuery(crmLeadsTable);
    console.log('✅ Tabela crm_leads criada com sucesso');

    // Criar tabela crm_activities
    const crmActivitiesTable = `
      CREATE TABLE IF NOT EXISTS crm_activities (
        id INT PRIMARY KEY AUTO_INCREMENT,
        crm_lead_id INT NOT NULL,
        tipo ENUM('ligacao', 'email', 'reuniao', 'apresentacao', 'proposta', 'followup', 'mudanca_status') NOT NULL,
        titulo VARCHAR(255) NOT NULL,
        descricao TEXT NULL,
        status_anterior ENUM('prospeccao', 'contato_inicial', 'apresentacao', 'negociacao') NULL,
        status_novo ENUM('prospeccao', 'contato_inicial', 'apresentacao', 'negociacao') NULL,
        usuario VARCHAR(255) NOT NULL,
        agendada_para DATETIME NULL,
        concluida_em DATETIME NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (crm_lead_id) REFERENCES crm_leads(id) ON DELETE CASCADE,
        INDEX idx_lead_id (crm_lead_id),
        INDEX idx_tipo (tipo),
        INDEX idx_agendada_para (agendada_para)
      )
    `;

    await executeQuery(crmActivitiesTable);
    console.log('✅ Tabela crm_activities criada com sucesso');

    // Inserir dados de exemplo
    const sampleLeads = `
      INSERT IGNORE INTO crm_leads (
        nome, clinica, cro, email, telefone, 
        consultórios, scanner, casos_mes, interesse, 
        status, responsavel_comercial, origem_lead,
        observacoes_internas
      ) VALUES
      (
        'Dr. João Silva', 'Clínica OrthoSmile', 'CRO-SP 12345', 
        'joao@orthosmile.com.br', '(11) 9999-8888',
        '2-3', 'sim', '11-20', 'atma-aligner',
        'prospeccao', 'Maria Santos', 'outbound',
        'Lead qualificado - tem interesse em tecnologia'
      ),
      (
        'Dra. Ana Costa', 'Costa Ortodontia', 'CRO-RJ 67890',
        'ana@costaortodontia.com.br', '(21) 8888-7777',
        '4-5', 'nao', '21+', 'atma-labs',
        'contato_inicial', 'João Oliveira', 'inbound',
        'Preencheu formulário no site - alto volume'
      ),
      (
        'Dr. Carlos Mendes', 'Mendes & Associados', 'CRO-MG 54321',
        'carlos@mendesortho.com.br', '(31) 7777-6666',
        '6+', 'sim', '21+', 'ambos',
        'apresentacao', 'Maria Santos', 'indicacao',
        'Indicação do Dr. Paulo - muito interessado'
      ),
      (
        'Dra. Lucia Fernandes', 'Sorriso Perfeito', 'CRO-SP 98765',
        'lucia@sorrisoperfeito.com.br', '(11) 6666-5555',
        '2-3', 'nao', '6-10', 'atma-aligner',
        'negociacao', 'João Oliveira', 'evento',
        'Conheceu no congresso - proposta enviada'
      )
    `;

    await executeQuery(sampleLeads);
    console.log('✅ Dados de exemplo inseridos na tabela crm_leads');

    // Inserir atividades de exemplo
    const sampleActivities = `
      INSERT IGNORE INTO crm_activities (
        crm_lead_id, tipo, titulo, descricao, usuario
      ) VALUES
      (1, 'ligacao', 'Primeira ligação', 'Contato inicial realizado, apresentou interesse', 'Maria Santos'),
      (2, 'email', 'Envio de material', 'Enviado catálogo e casos de sucesso', 'João Oliveira'),
      (3, 'reuniao', 'Apresentação online', 'Demo da plataforma - 45min', 'Maria Santos'),
      (4, 'proposta', 'Proposta comercial', 'Enviada proposta personalizada', 'João Oliveira')
    `;

    await executeQuery(sampleActivities);
    console.log('✅ Dados de exemplo inseridos na tabela crm_activities');

    // Verificar tabelas criadas
    const tables = await executeQuery('SHOW TABLES');
    console.log('📊 Tabelas no banco de dados:', tables.map(t => Object.values(t)[0]));

    console.log('🎉 Criação das tabelas CRM concluída com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao criar tabelas CRM:', error.message);
    throw error;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  createCrmTables()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('❌ Script falhou:', err.message);
      process.exit(1);
    });
}

module.exports = { createCrmTables };