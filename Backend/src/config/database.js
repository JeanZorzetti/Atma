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
    await pRetry(async () => {
      logger.info('Tentando conectar ao banco de dados...');
      pool = mysql.createPool(dbConfig);
      const connection = await pool.getConnection();
      await connection.ping(); // Test the connection to ensure it's live
      connection.release();
      logger.info('✅ Conexão com o banco de dados estabelecida com sucesso.');
    }, {
      retries: 5,
      factor: 2,
      minTimeout: 2000, // Start with a 2-second wait
      onFailedAttempt: error => {
        logger.warn(`Tentativa ${error.attemptNumber} de conectar ao banco falhou. Restam ${error.retriesLeft} tentativas. Erro: ${error.message}`);
        // Clean up the broken pool
        if (pool) {
          pool.end().catch(err => logger.error('Erro ao fechar pool quebrado:', err));
        }
      },
    });
    return pool;
  } catch (error) {
    logger.error('❌ Não foi possível conectar ao banco de dados após várias tentativas. Encerrando aplicação.');
    process.exit(1);
  }
};

const getDB = () => {
  if (!pool) {
    // This case should ideally not be hit if connectDB is called on startup
    // and exits on failure. But as a safeguard:
    logger.warn('Pool de conexão não está disponível.');
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
    const [results] = await db.execute(query, params);
    return results;
  } catch (error) {
    logger.error('Erro ao executar query:', { query, params, error: error.message });
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