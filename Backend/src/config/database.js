const mysql = require('mysql2/promise');
const pRetry = require('p-retry');
const { logger } = require('../utils/logger');

let pool = null;

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'atma_aligner',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  timezone: '+00:00'
};

const connectDB = async () => {
  try {
    logger.info('Iniciando conexão com banco de dados...', { 
      host: dbConfig.host, 
      database: dbConfig.database, 
      port: dbConfig.port 
    });
    
    await pRetry(async () => {
      logger.info('Tentando conectar ao banco de dados...');
      pool = mysql.createPool(dbConfig);
      const connection = await pool.getConnection();
      await connection.ping(); // Test the connection to ensure it's live
      connection.release();
      logger.info('✅ Conexão com o banco de dados estabelecida com sucesso.');
    }, {
      retries: 3,
      factor: 2,
      minTimeout: 2000, // Start with a 2-second wait
      onFailedAttempt: error => {
        logger.warn(`Tentativa ${error.attemptNumber} de conectar ao banco falhou. Restam ${error.retriesLeft} tentativas.`, {
          error: error.message,
          code: error.code,
          host: dbConfig.host,
          database: dbConfig.database
        });
        // Clean up the broken pool
        if (pool) {
          pool.end().catch(err => logger.error('Erro ao fechar pool quebrado:', err));
        }
      },
    });
    return pool;
  } catch (error) {
    logger.error('❌ Não foi possível conectar ao banco de dados após várias tentativas.', {
      error: error.message,
      code: error.code,
      config: {
        host: dbConfig.host,
        database: dbConfig.database,
        port: dbConfig.port,
        user: dbConfig.user
      }
    });
    
    // Em ambiente de desenvolvimento, não sair do processo
    if (process.env.NODE_ENV === 'development') {
      logger.warn('Modo desenvolvimento: continuando sem banco de dados');
      return null;
    }
    
    process.exit(1);
  }
};

const getDB = () => {
  if (!pool) {
    // This case should ideally not be hit if connectDB is called on startup
    // and exits on failure. But as a safeguard:
    logger.warn('Pool de conexão não está disponível.', {
      dbConfig: {
        host: dbConfig.host,
        database: dbConfig.database,
        port: dbConfig.port
      }
    });
    return null;
  }
  return pool;
};

const closeDB = async () => {
  if (pool) {
    await pool.end();
    logger.info('🔌 Conexão com banco de dados encerrada');
  }
};

// Utility function para executar queries
const executeQuery = async (query, params = []) => {
  const db = getDB();
  if (!db) {
    logger.error('Query falhou: Database não disponível');
    throw new Error('Database não disponível');
  }
  try {
    // Teste de conexão antes da execução
    const connection = await db.getConnection();
    const [results] = await connection.execute(query, params);
    connection.release();
    return results;
  } catch (error) {
    logger.error('Erro ao executar query:', { query, params, error: error.message, code: error.code });
    
    // Tratamento específico para erros de conexão
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
      logger.error('Erro de conectividade com banco de dados:', {
        code: error.code,
        host: dbConfig.host,
        port: dbConfig.port,
        database: dbConfig.database
      });
      const dbError = new Error('Falha na conexão com banco de dados');
      dbError.code = 'DB_CONNECTION_ERROR';
      throw dbError;
    }
    
    throw error;
  }
};

// Utility function para transações
const executeTransaction = async (queries) => {
  const db = getDB();
  if (!db) {
    logger.error('Transação falhou: Database não disponível');
    throw new Error('Database não disponível');
  }
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    const results = [];
    for (const { query, params } of queries) {
      const [result] = await connection.execute(query, params);
      results.push(result);
    }
    
    await connection.commit();
    return results;
  } catch (error) {
    await connection.rollback();
    logger.error('Erro na transação:', error.message);
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  connectDB,
  getDB,
  closeDB,
  executeQuery,
  executeTransaction
};