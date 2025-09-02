const { logger } = require('./logger');
const { executeQuery, getDB } = require('../config/database');

/**
 * Verifica se as tabelas essenciais existem no banco de dados
 */
const checkEssentialTables = async () => {
  const essentialTables = [
    'patient_leads',
    'orthodontists',
    'orthodontist_partnerships',
    'email_logs',
    'system_settings',
    'crm_leads',
    'crm_activities'
  ];

  const results = {};
  
  for (const table of essentialTables) {
    try {
      await executeQuery(`SELECT 1 FROM ${table} LIMIT 1`);
      results[table] = true;
      logger.info(`✅ Tabela ${table} existe e está acessível`);
    } catch (error) {
      if (error.code === 'ER_NO_SUCH_TABLE') {
        results[table] = false;
        logger.warn(`❌ Tabela ${table} não existe`);
      } else {
        results[table] = 'error';
        logger.error(`❌ Erro ao verificar tabela ${table}:`, error.message);
      }
    }
  }

  return results;
};

/**
 * Cria tabelas básicas necessárias para o funcionamento mínimo
 */
const createBasicTables = async () => {
  const basicTables = {
    patient_leads: `
      CREATE TABLE IF NOT EXISTS patient_leads (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        telefone VARCHAR(20) NOT NULL,
        cep VARCHAR(10) NOT NULL,
        consentimento BOOLEAN NOT NULL DEFAULT false,
        status ENUM('novo', 'contatado', 'agendado', 'convertido', 'cancelado') DEFAULT 'novo',
        ortodontista_id INT NULL,
        observacoes TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_email (email),
        INDEX idx_telefone (telefone),
        INDEX idx_cep (cep),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      )
    `,
    orthodontists: `
      CREATE TABLE IF NOT EXISTS orthodontists (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nome VARCHAR(255) NOT NULL,
        clinica VARCHAR(255) NOT NULL,
        cro VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        telefone VARCHAR(20) NOT NULL,
        endereco_completo TEXT NULL,
        cep VARCHAR(10) NULL,
        cidade VARCHAR(100) NULL,
        estado VARCHAR(2) NULL,
        modelo_parceria ENUM('atma-aligner', 'atma-labs') NULL,
        status ENUM('ativo', 'inativo', 'suspenso') DEFAULT 'ativo',
        data_inicio DATE NULL,
        data_fim DATE NULL,
        tem_scanner BOOLEAN DEFAULT false,
        scanner_marca VARCHAR(100) NULL,
        capacidade_mensal INT DEFAULT 0,
        comissao_percentual DECIMAL(5,2) NULL,
        valor_lab_fee DECIMAL(10,2) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_cep (cep),
        INDEX idx_cidade_estado (cidade, estado),
        INDEX idx_status (status),
        INDEX idx_modelo_parceria (modelo_parceria)
      )
    `,
    system_settings: `
      CREATE TABLE IF NOT EXISTS system_settings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value TEXT NOT NULL,
        description TEXT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_setting_key (setting_key)
      )
    `,
    crm_leads: `
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
    `,
    crm_activities: `
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
    `
  };

  const results = {};

  for (const [tableName, createSQL] of Object.entries(basicTables)) {
    try {
      await executeQuery(createSQL);
      results[tableName] = true;
      logger.info(`✅ Tabela ${tableName} criada/verificada com sucesso`);
    } catch (error) {
      results[tableName] = false;
      logger.error(`❌ Erro ao criar tabela ${tableName}:`, error.message);
    }
  }

  return results;
};

/**
 * Insere dados iniciais básicos se necessário
 */
const insertBasicData = async () => {
  try {
    // Verificar se já existem configurações básicas
    const existingSettings = await executeQuery('SELECT COUNT(*) as count FROM system_settings');
    
    if (existingSettings[0].count === 0) {
      const basicSettings = [
        ['email_from_address', 'contato@roilabs.com.br', 'Email remetente padrão'],
        ['email_from_name', 'ROI Labs - Atma Aligner', 'Nome do remetente padrão'],
        ['admin_email', 'admin@roilabs.com.br', 'Email do administrador para notificações'],
        ['max_distance_km', '50', 'Distância máxima em km para busca de ortodontistas'],
        ['auto_assignment_enabled', 'true', 'Habilitar atribuição automática de leads']
      ];

      for (const [key, value, description] of basicSettings) {
        await executeQuery(
          'INSERT INTO system_settings (setting_key, setting_value, description) VALUES (?, ?, ?)',
          [key, value, description]
        );
      }

      logger.info('✅ Configurações básicas do sistema inseridas');
      return true;
    }

    logger.info('ℹ️ Configurações básicas já existem');
    return true;
  } catch (error) {
    logger.error('❌ Erro ao inserir dados básicos:', error.message);
    return false;
  }
};

/**
 * Executa verificação completa de saúde do banco
 */
const performHealthCheck = async () => {
  logger.info('🔍 Iniciando verificação de saúde do banco de dados...');

  const db = getDB();
  if (!db) {
    logger.error('❌ Pool de conexão não está disponível');
    return {
      status: 'ERROR',
      message: 'Banco de dados não disponível',
      details: { connection: false }
    };
  }

  try {
    // Teste de conexão básica
    await executeQuery('SELECT 1 as test');
    logger.info('✅ Conexão com banco de dados OK');

    // Verificar tabelas essenciais
    const tablesStatus = await checkEssentialTables();
    const missingTables = Object.entries(tablesStatus)
      .filter(([table, exists]) => !exists)
      .map(([table]) => table);

    if (missingTables.length > 0) {
      logger.warn(`❌ Tabelas faltando: ${missingTables.join(', ')}`);
      
      // Tentar criar tabelas básicas
      logger.info('🔧 Tentando criar tabelas básicas...');
      const createResults = await createBasicTables();
      
      // Inserir dados iniciais
      await insertBasicData();

      return {
        status: 'WARNING',
        message: 'Algumas tabelas foram criadas automaticamente',
        details: {
          connection: true,
          tablesStatus,
          createResults,
          missingTables
        }
      };
    }

    return {
      status: 'OK',
      message: 'Banco de dados funcionando corretamente',
      details: {
        connection: true,
        tablesStatus
      }
    };

  } catch (error) {
    logger.error('❌ Erro na verificação de saúde do banco:', error);
    return {
      status: 'ERROR',
      message: 'Falha na verificação do banco de dados',
      details: {
        connection: false,
        error: error.message,
        code: error.code
      }
    };
  }
};

module.exports = {
  checkEssentialTables,
  createBasicTables,
  insertBasicData,
  performHealthCheck
};