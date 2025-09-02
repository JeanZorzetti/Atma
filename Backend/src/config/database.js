const mysql = require('mysql2/promise');
const pRetry = require('p-retry');
const { logger } = require('../utils/logger');

let pool = null;
let isConnecting = false;
let connectionRetries = 0;
const MAX_CONNECTION_RETRIES = 5;
let healthCheckInterval = null;

// Helper function to safely close the current pool
const closeCurrentPool = async () => {
  if (pool) {
    try {
      await pool.end();
      logger.info('Pool anterior fechada com sucesso');
    } catch (err) {
      logger.error('Erro ao fechar pool anterior:', err.message);
    } finally {
      pool = null;
    }
  }
};

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'atma_aligner',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 20, // Increased from 10
  queueLimit: 0,
  charset: 'utf8mb4',
  timezone: '+00:00',
  acquireTimeout: 60000, // 60 seconds
  timeout: 60000, // 60 seconds
  reconnect: true,
  idleTimeout: 300000, // 5 minutes
  // Connection management options
  maxIdle: 10, // Maximum idle connections
  idleCheckInterval: 30000, // Check for idle connections every 30 seconds
  maxReuses: 100, // Reuse connection up to 100 times before recreating
  // Error handling options
  supportBigNumbers: true,
  bigNumberStrings: true,
  dateStrings: false,
  debug: false,
  trace: true,
  multipleStatements: false
};

const connectDB = async (forceReconnect = false) => {
  // Prevent multiple simultaneous connection attempts
  if (isConnecting && !forceReconnect) {
    logger.info('Conexão já em andamento, aguardando...');
    // Wait up to 30 seconds for the connection attempt to complete
    for (let i = 0; i < 30; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (!isConnecting && pool) {
        logger.info('Conexão estabelecida durante espera');
        return pool;
      }
    }
    logger.warn('Timeout aguardando conexão em andamento');
  }

  try {
    isConnecting = true;
    
    // Se já existe uma conexão ativa e não é para forçar reconexão, retorna a pool existente
    if (pool && !forceReconnect) {
      try {
        const connection = await pool.getConnection();
        await connection.ping();
        connection.release();
        logger.info('✅ Conexão existente com banco de dados ainda ativa.');
        connectionRetries = 0; // Reset retry counter on successful ping
        return pool;
      } catch (error) {
        logger.warn('Conexão existente falhou, criando nova:', error.message);
        // Fechar pool quebrada
        await closeCurrentPool();
      }
    }

    logger.info('Iniciando conexão com banco de dados...', { 
      host: dbConfig.host, 
      database: dbConfig.database, 
      port: dbConfig.port 
    });
    
    // Check if we've exceeded maximum connection retries
    if (connectionRetries >= MAX_CONNECTION_RETRIES) {
      logger.error(`Máximo de tentativas de conexão excedido (${MAX_CONNECTION_RETRIES}). Aguardando antes de tentar novamente...`);
      connectionRetries = 0;
      // Wait 5 minutes before allowing reconnection attempts
      setTimeout(() => {
        logger.info('Período de espera encerrado. Tentativas de conexão liberadas.');
      }, 300000);
      throw new Error('Máximo de tentativas de conexão excedido');
    }

    await pRetry(async () => {
      logger.info(`Tentando conectar ao banco de dados (tentativa global ${connectionRetries + 1}/${MAX_CONNECTION_RETRIES})...`);
      
      // Close any existing broken pool
      await closeCurrentPool();
      
      pool = mysql.createPool(dbConfig);
      
      // Set up pool event listeners for better monitoring
      pool.on('connection', (connection) => {
        logger.info(`Nova conexão estabelecida: ${connection.threadId}`);
      });
      
      pool.on('error', (err) => {
        logger.error('Erro na pool de conexões:', {
          error: err.message,
          code: err.code,
          fatal: err.fatal,
          timestamp: new Date().toISOString()
        });
        
        if (err.fatal || err.code === 'PROTOCOL_CONNECTION_LOST') {
          logger.warn('Erro fatal detectado, pool será recriada');
          pool = null;
        }
      });
      
      pool.on('enqueue', () => {
        logger.debug('Aguardando conexão disponível na pool');
      });

      // Test the connection
      const connection = await pool.getConnection();
      await connection.ping();
      connection.release();
      
      logger.info('✅ Conexão com o banco de dados estabelecida com sucesso.');
      connectionRetries = 0; // Reset on success
      
      // Set up periodic health checks
      setupHealthCheck();
      
    }, {
      retries: 3,
      factor: 2,
      minTimeout: 2000,
      maxTimeout: 10000,
      onFailedAttempt: error => {
        logger.warn(`Tentativa ${error.attemptNumber} de conectar ao banco falhou. Restam ${error.retriesLeft} tentativas.`, {
          error: error.message,
          code: error.code,
          host: dbConfig.host,
          database: dbConfig.database,
          port: dbConfig.port
        });
        // Clean up the broken pool
        closeCurrentPool();
      },
    });
    
    connectionRetries++;
    return pool;
  } catch (error) {
    connectionRetries++;
    logger.error('❌ Não foi possível conectar ao banco de dados após várias tentativas.', {
      error: error.message,
      code: error.code,
      connectionRetries,
      maxRetries: MAX_CONNECTION_RETRIES,
      config: {
        host: dbConfig.host,
        database: dbConfig.database,
        port: dbConfig.port,
        user: dbConfig.user
      }
    });
    
    // Clean up any broken pool
    await closeCurrentPool();
    
    // In development or when retries aren't exhausted, continue without DB
    if (process.env.NODE_ENV === 'development' || connectionRetries < MAX_CONNECTION_RETRIES) {
      logger.warn('Continuando sem banco de dados - tentativas futuras serão feitas automaticamente');
      return null;
    }
    
    // Only exit if in production and all retries exhausted
    logger.fatal('Todas as tentativas de conexão esgotadas. Encerrando processo...');
    process.exit(1);
  } finally {
    isConnecting = false;
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

// Set up periodic health checks
const setupHealthCheck = () => {
  // Clear any existing health check
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
  }
  
  // Check database health every 2 minutes
  healthCheckInterval = setInterval(async () => {
    if (!pool) return;
    
    try {
      const connection = await pool.getConnection();
      await connection.ping();
      connection.release();
      logger.debug('Health check: Database connection OK');
    } catch (error) {
      logger.warn('Health check failed:', {
        error: error.message,
        code: error.code,
        timestamp: new Date().toISOString()
      });
      
      // If health check fails, mark pool as null so it gets recreated on next request
      if (error.code === 'PROTOCOL_CONNECTION_LOST' || 
          error.code === 'ECONNREFUSED' || 
          error.message.includes('Pool is closed')) {
        logger.warn('Connection lost detected - marking pool for recreation');
        await closeCurrentPool();
      }
    }
  }, 120000); // 2 minutes
};

const closeDB = async () => {
  // Clear health check interval
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
    healthCheckInterval = null;
  }
  
  await closeCurrentPool();
  logger.info('🔌 Conexão com banco de dados encerrada');
};

// Utility function para executar queries
const executeQuery = async (query, params = [], retryCount = 0) => {
  const maxRetries = 3; // Increased from 2
  const startTime = Date.now();

  try {
    let db = getDB();
    if (!db) {
      logger.warn(`Pool não disponível, tentando reconectar... (tentativa ${retryCount + 1})`);
      
      // Don't retry connection if we're already at max retries for query
      if (retryCount >= maxRetries) {
        throw new Error('Database não disponível após múltiplas tentativas');
      }
      
      await connectDB(true); // Força reconexão
      db = getDB();
      if (!db) {
        logger.error('Query falhou: Database não disponível após tentativa de reconexão');
        throw new Error('Database não disponível');
      }
    }

    // Get connection with timeout
    const connection = await Promise.race([
      db.getConnection(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 30000)
      )
    ]);

    let results;
    try {
      // Filter out undefined values from params to prevent MySQL errors
      const cleanParams = params.map(param => param === undefined ? null : param);
      console.log('executeQuery - original params:', params);
      console.log('executeQuery - clean params:', cleanParams);
      
      // Execute query with timeout
      const queryPromise = connection.execute(query, cleanParams);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout')), 60000)
      );
      
      [results] = await Promise.race([queryPromise, timeoutPromise]);
      
      logger.debug('Query executed successfully', {
        executionTime: Date.now() - startTime,
        affectedRows: results.affectedRows || results.length || 0
      });
      
    } finally {
      // Always release the connection
      if (connection) {
        connection.release();
      }
    }
    
    return results;
  } catch (error) {
    const executionTime = Date.now() - startTime;
    logger.error('Erro ao executar query:', { 
      query: query.substring(0, 200) + (query.length > 200 ? '...' : ''), 
      paramsCount: params?.length || 0,
      error: error.message, 
      code: error.code, 
      retryCount,
      executionTime
    });
    
    // Erros que indicam pool fechada ou problemas de conectividade
    const connectionErrors = [
      'Pool is closed',
      'ECONNREFUSED', 
      'ENOTFOUND', 
      'ETIMEDOUT',
      'ECONNRESET',
      'EPIPE',
      'ER_ACCESS_DENIED_ERROR',
      'Connection lost',
      'Cannot enqueue',
      'Connection timeout',
      'Query timeout',
      'PROTOCOL_CONNECTION_LOST',
      'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR'
    ];

    const isConnectionError = connectionErrors.some(errorType => 
      error.message.includes(errorType) || error.code === errorType
    );

    // Se é erro de conexão e ainda temos tentativas, reconectar e tentar novamente
    if (isConnectionError && retryCount < maxRetries) {
      logger.warn(`Tentando reconectar e executar query novamente (tentativa ${retryCount + 1}/${maxRetries})`);
      
      // Close broken pool
      await closeCurrentPool();

      // Wait a bit before retrying (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
      await new Promise(resolve => setTimeout(resolve, delay));

      // Try to reconnect and retry query
      try {
        await connectDB(true);
        // Recursive retry with incremented counter
        return executeQuery(query, params, retryCount + 1);
      } catch (reconnectError) {
        logger.error('Erro ao tentar reconectar:', reconnectError.message);
        
        // If this is the last retry, throw the original connection error
        if (retryCount + 1 >= maxRetries) {
          const dbError = new Error('Falha na conexão com banco de dados após múltiplas tentativas');
          dbError.code = 'DB_CONNECTION_ERROR';
          dbError.originalError = error;
          throw dbError;
        }
        
        // Otherwise, throw reconnection error to be handled by next level
        throw reconnectError;
      }
    }
    
    // Handle non-connection errors or exhausted retries
    if (isConnectionError) {
      logger.error('Erro de conectividade esgotado todas tentativas:', {
        code: error.code,
        message: error.message,
        host: dbConfig.host,
        port: dbConfig.port,
        database: dbConfig.database,
        retriesAttempted: retryCount,
        maxRetries,
        executionTime
      });
      const dbError = new Error('Falha na conexão com banco de dados');
      dbError.code = 'DB_CONNECTION_ERROR';
      dbError.originalError = error;
      throw dbError;
    }
    
    // For non-connection errors, add context and rethrow
    error.context = {
      query: query.substring(0, 100),
      paramsCount: params?.length || 0,
      retryCount,
      executionTime
    };
    
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