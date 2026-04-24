const { logger } = require('./logger');
const { executeQuery, getDB } = require('../config/database');

const essentialTables = [
  'patient_leads',
  'orthodontists',
  'orthodontist_partnerships',
  'email_logs',
  'system_settings',
  'crm_leads',
  'crm_activities'
];

const checkEssentialTables = async () => {
  const results = {};
  for (const table of essentialTables) {
    try {
      await executeQuery(`SELECT 1 FROM "${table}" LIMIT 1`);
      results[table] = true;
      logger.info(`✅ Tabela ${table} existe e está acessível`);
    } catch (error) {
      // 42P01 = undefined_table in PostgreSQL
      if (error.code === '42P01' || error.code === 'ER_NO_SUCH_TABLE') {
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

const createBasicTables = async () => {
  const basicTables = {
    patient_leads: `
      CREATE TABLE IF NOT EXISTS patient_leads (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        telefone VARCHAR(20) NOT NULL,
        cep VARCHAR(10) NOT NULL,
        consentimento BOOLEAN NOT NULL DEFAULT false,
        status VARCHAR(20) DEFAULT 'novo',
        ortodontista_id INTEGER NULL,
        observacoes TEXT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `,
    orthodontists: `
      CREATE TABLE IF NOT EXISTS orthodontists (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        clinica VARCHAR(255) NOT NULL,
        cro VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        telefone VARCHAR(20) NOT NULL,
        endereco_completo TEXT NULL,
        cep VARCHAR(10) NULL,
        cidade VARCHAR(100) NULL,
        estado VARCHAR(2) NULL,
        modelo_parceria VARCHAR(20) NULL,
        status VARCHAR(20) DEFAULT 'ativo',
        data_inicio DATE NULL,
        data_fim DATE NULL,
        tem_scanner BOOLEAN DEFAULT false,
        scanner_marca VARCHAR(100) NULL,
        capacidade_mensal INTEGER DEFAULT 0,
        comissao_percentual NUMERIC(5,2) NULL,
        valor_lab_fee NUMERIC(10,2) NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `,
    system_settings: `
      CREATE TABLE IF NOT EXISTS system_settings (
        id SERIAL PRIMARY KEY,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value TEXT NOT NULL,
        description TEXT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `,
    crm_leads: `
      CREATE TABLE IF NOT EXISTS crm_leads (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        clinica VARCHAR(255) NOT NULL,
        cro VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL,
        telefone VARCHAR(20) NOT NULL,
        cep VARCHAR(10) NULL,
        cidade VARCHAR(100) NULL,
        estado VARCHAR(2) NULL,
        endereco_completo TEXT NULL,
        scanner VARCHAR(10) NULL,
        scanner_marca VARCHAR(100) NULL,
        interesse VARCHAR(20) NULL,
        status VARCHAR(30) DEFAULT 'prospeccao',
        responsavel_comercial VARCHAR(255) NULL,
        origem_lead VARCHAR(20) DEFAULT 'outbound',
        observacoes_internas TEXT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `,
    crm_activities: `
      CREATE TABLE IF NOT EXISTS crm_activities (
        id SERIAL PRIMARY KEY,
        crm_lead_id INTEGER NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
        tipo VARCHAR(30) NOT NULL,
        titulo VARCHAR(255) NOT NULL,
        descricao TEXT NULL,
        usuario VARCHAR(255) NOT NULL,
        agendada_para TIMESTAMPTZ NULL,
        concluida_em TIMESTAMPTZ NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `
  };

  const results = {};
  for (const [tableName, sql] of Object.entries(basicTables)) {
    try {
      await executeQuery(sql);
      results[tableName] = true;
      logger.info(`✅ Tabela ${tableName} criada/verificada`);
    } catch (error) {
      results[tableName] = false;
      logger.error(`❌ Erro ao criar tabela ${tableName}:`, error.message);
    }
  }
  return results;
};

const insertBasicData = async () => {
  try {
    const rows = await executeQuery('SELECT COUNT(*) AS count FROM system_settings');
    const count = parseInt(rows[0]?.count || rows[0]?.COUNT || 0, 10);

    if (count === 0) {
      const basicSettings = [
        ['email_from_address', 'contato@roilabs.com.br', 'Email remetente padrão'],
        ['email_from_name', 'ROI Labs - Atma Aligner', 'Nome do remetente padrão'],
        ['admin_email', 'admin@roilabs.com.br', 'Email do administrador'],
        ['max_distance_km', '50', 'Distância máxima em km'],
        ['auto_assignment_enabled', 'true', 'Habilitar atribuição automática de leads']
      ];

      for (const [key, value, description] of basicSettings) {
        await executeQuery(
          'INSERT INTO system_settings (setting_key, setting_value, description) VALUES (?, ?, ?) ON CONFLICT (setting_key) DO NOTHING',
          [key, value, description]
        );
      }
      logger.info('✅ Configurações básicas inseridas');
    }
    return true;
  } catch (error) {
    logger.error('❌ Erro ao inserir dados básicos:', error.message);
    return false;
  }
};

const performHealthCheck = async () => {
  logger.info('🔍 Iniciando verificação de saúde do banco de dados...');

  const db = getDB();
  if (!db) {
    logger.error('❌ Pool de conexão não está disponível');
    return { status: 'ERROR', message: 'Banco de dados não disponível', details: { connection: false } };
  }

  try {
    await executeQuery('SELECT 1 AS test');
    logger.info('✅ Conexão com banco de dados OK');

    const tablesStatus = await checkEssentialTables();
    const missingTables = Object.entries(tablesStatus)
      .filter(([, exists]) => !exists)
      .map(([table]) => table);

    if (missingTables.length > 0) {
      logger.warn(`⚠️ Tabelas faltando: ${missingTables.join(', ')} — tentando criar...`);
      const createResults = await createBasicTables();
      await insertBasicData();
      return {
        status: 'WARNING',
        message: 'Algumas tabelas foram criadas automaticamente',
        details: { connection: true, tablesStatus, createResults, missingTables }
      };
    }

    return {
      status: 'OK',
      message: 'Banco de dados funcionando corretamente',
      details: { connection: true, tablesStatus }
    };
  } catch (error) {
    logger.error('❌ Erro na verificação de saúde do banco:', error);
    return {
      status: 'ERROR',
      message: 'Falha na verificação do banco de dados',
      details: { connection: false, error: error.message, code: error.code }
    };
  }
};

module.exports = { checkEssentialTables, createBasicTables, insertBasicData, performHealthCheck };
