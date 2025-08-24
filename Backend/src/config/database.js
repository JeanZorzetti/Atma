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

const connectDB = async (forceReconnect = false) => {
  try {
    // Se já existe uma conexão ativa e não é para forçar reconexão, retorna a pool existente
    if (pool && !forceReconnect) {
      try {
        const connection = await pool.getConnection();
        await connection.ping();
        connection.release();
        logger.info('✅ Conexão existente com banco de dados ainda ativa.');
        return pool;
      } catch (error) {
        logger.warn('Conexão existente falhou, criando nova:', error.message);
        // Fechar pool quebrada
        if (pool) {
          await pool.end().catch(err => logger.error('Erro ao fechar pool quebrada:', err));
          pool = null;
        }
      }
    }

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
          pool.end().catch(err => logger.error('Erro ao fechar pool quebrada:', err));
          pool = null;
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
const executeQuery = async (query, params = [], retryCount = 0) => {
  const maxRetries = 2;

  try {
    let db = getDB();
    if (!db) {
      logger.warn('Pool não disponível, tentando reconectar...');
      await connectDB(true); // Força reconexão
      db = getDB();
      if (!db) {
        logger.error('Query falhou: Database não disponível após tentativa de reconexão');
        throw new Error('Database não disponível');
      }
    }

    // Teste de conexão antes da execução
    const connection = await db.getConnection();
    const [results] = await connection.execute(query, params);
    connection.release();
    return results;
  } catch (error) {
    logger.error('Erro ao executar query:', { query, params, error: error.message, code: error.code, retryCount });
    
    // Erros que indicam pool fechada ou problemas de conectividade
    const connectionErrors = [
      'Pool is closed',
      'ECONNREFUSED', 
      'ENOTFOUND', 
      'ETIMEDOUT',
      'ER_ACCESS_DENIED_ERROR',
      'Connection lost',
      'Cannot enqueue'
    ];

    const isConnectionError = connectionErrors.some(errorType => 
      error.message.includes(errorType) || error.code === errorType
    );

    // Se é erro de conexão e ainda temos tentativas, reconectar e tentar novamente
    if (isConnectionError && retryCount < maxRetries) {
      logger.warn(`Tentando reconectar e executar query novamente (tentativa ${retryCount + 1}/${maxRetries})`);
      
      // Fechar pool quebrada se existir
      if (pool) {
        await pool.end().catch(err => logger.error('Erro ao fechar pool quebrada:', err));
        pool = null;
      }

      // Tentar reconectar
      try {
        await connectDB(true);
        // Tentativa recursiva com contador incrementado
        return executeQuery(query, params, retryCount + 1);
      } catch (reconnectError) {
        logger.error('Erro ao tentar reconectar:', reconnectError.message);
      }
    }
    
    // Tratamento específico para erros de conexão quando não conseguimos mais reconectar
    if (isConnectionError) {
      logger.error('Erro de conectividade com banco de dados:', {
        code: error.code,
        message: error.message,
        host: dbConfig.host,
        port: dbConfig.port,
        database: dbConfig.database,
        retriesAttempted: retryCount
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