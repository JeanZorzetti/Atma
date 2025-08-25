const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const { logger } = require('../src/utils/logger');

// Carregar variáveis de ambiente
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'atma_aligner',
  port: process.env.DB_PORT || 3306,
  charset: 'utf8mb4',
  timezone: '+00:00'
};

async function createDatabase() {
  // Conectar sem especificar database para criar ela se não existir
  const tempConfig = { ...dbConfig };
  delete tempConfig.database;
  
  const connection = await mysql.createConnection(tempConfig);
  
  try {
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    logger.info(`✅ Database '${dbConfig.database}' criado/verificado com sucesso`);
  } catch (error) {
    logger.error('❌ Erro ao criar database:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

async function runMigrations() {
  let connection;
  
  try {
    // Primeiro, criar o database se não existir
    await createDatabase();
    
    // Conectar ao database
    connection = await mysql.createConnection(dbConfig);
    logger.info('🔌 Conectado ao MySQL para executar migrações');
    
    // Ler arquivo schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    // Dividir o arquivo em statements individuais
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    logger.info(`📋 Executando ${statements.length} statements de migração...`);
    
    // Executar cada statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        await connection.execute(statement);
        logger.info(`✅ Statement ${i + 1}/${statements.length} executado com sucesso`);
      } catch (error) {
        // Ignorar erros de "table already exists" ou "duplicate entry"
        if (error.code === 'ER_TABLE_EXISTS_ERROR' || 
            error.code === 'ER_DUP_ENTRY' ||
            error.message.includes('already exists')) {
          logger.warn(`⚠️ Statement ${i + 1}: ${error.message} (ignorado)`);
        } else {
          logger.error(`❌ Erro no statement ${i + 1}:`, error.message);
          logger.error(`Statement: ${statement.substring(0, 200)}...`);
          throw error;
        }
      }
    }
    
    // Verificar se as tabelas foram criadas
    const [tables] = await connection.execute('SHOW TABLES');
    logger.info(`📊 Tabelas no banco de dados: ${tables.map(t => Object.values(t)[0]).join(', ')}`);
    
    logger.info('🎉 Migração completa com sucesso!');
    
  } catch (error) {
    logger.error('❌ Erro durante a migração:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      logger.info('🔌 Conexão com MySQL encerrada');
    }
  }
}

async function seedDatabase() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    logger.info('🌱 Iniciando seed do banco de dados...');
    
    // Verificar se o arquivo seed.sql existe
    const seedPath = path.join(__dirname, 'seed.sql');
    if (!fs.existsSync(seedPath)) {
      logger.info('ℹ️ Arquivo seed.sql não encontrado, pulando seed');
      return;
    }
    
    // Ler e executar seed.sql
    const seedSQL = fs.readFileSync(seedPath, 'utf8');
    const statements = seedSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      try {
        await connection.execute(statement);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          logger.warn('⚠️ Dados de seed já existem (ignorado)');
        } else {
          throw error;
        }
      }
    }
    
    logger.info('🌱 Seed do banco de dados completo!');
    
  } catch (error) {
    logger.error('❌ Erro durante o seed:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function testConnection() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    logger.info('🧪 Testando conexão com banco de dados...');
    
    // Teste básico de query
    const [result] = await connection.execute('SELECT 1 as test');
    if (result[0].test === 1) {
      logger.info('✅ Conexão com banco de dados funcionando perfeitamente!');
    }
    
    // Verificar tabelas existentes
    const [tables] = await connection.execute('SHOW TABLES');
    logger.info(`📊 Tabelas disponíveis: ${tables.length}`);
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      logger.info(`  - ${tableName}`);
    });
    
    return true;
    
  } catch (error) {
    logger.error('❌ Erro no teste de conexão:', error.message);
    logger.error('Detalhes do erro:', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    logger.error('Configuração usada:', {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      database: dbConfig.database
    });
    return false;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Executar migração se chamado diretamente
if (require.main === module) {
  const command = process.argv[2] || 'migrate';
  
  (async () => {
    try {
      switch (command) {
        case 'migrate':
          await runMigrations();
          break;
        case 'seed':
          await seedDatabase();
          break;
        case 'test':
          await testConnection();
          break;
        case 'reset':
          await runMigrations();
          await seedDatabase();
          break;
        default:
          logger.info('Comandos disponíveis: migrate, seed, test, reset');
      }
    } catch (error) {
      logger.error('❌ Comando falhou:', error.message);
      process.exit(1);
    }
  })();
}

module.exports = {
  runMigrations,
  seedDatabase,
  testConnection,
  createDatabase
};