const { Pool } = require('pg');
const { logger } = require('../utils/logger');

let pool = null;
let healthCheckInterval = null;

const connectDB = async () => {
  if (pool) {
    try {
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      logger.info('✅ Conexão existente com banco de dados ainda ativa.');
      return pool;
    } catch (err) {
      logger.warn('Conexão existente falhou, recriando pool:', err.message);
      await closeCurrentPool();
    }
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL não definida');
  }

  logger.info('Iniciando conexão com PostgreSQL...', { url: connectionString.replace(/:([^:@]+)@/, ':***@') });

  pool = new Pool({
    connectionString,
    max: 20,
    idleTimeoutMillis: 300000,
    connectionTimeoutMillis: 10000,
  });

  pool.on('error', (err) => {
    logger.error('Erro inesperado no pool PostgreSQL:', { error: err.message, code: err.code });
  });

  // Test connection with retries
  const maxRetries = 5;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.info(`Tentando conectar ao banco de dados (tentativa global ${attempt}/${maxRetries})...`);
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      logger.info('✅ Conexão com o banco de dados estabelecida com sucesso.');
      setupHealthCheck();
      return pool;
    } catch (err) {
      const remaining = maxRetries - attempt;
      logger.warn(`Tentativa ${attempt} de conectar ao banco falhou. Restam ${remaining} tentativas.`, { error: err.message });
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 2000 * attempt));
      }
    }
  }

  logger.error('❌ Não foi possível conectar ao banco de dados após várias tentativas.');
  pool = null;
  if (process.env.NODE_ENV === 'production') {
    logger.error('Todas as tentativas de conexão esgotadas. Encerrando processo...');
    process.exit(1);
  }
  return null;
};

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

const getDB = () => {
  if (!pool) {
    logger.warn('Pool de conexão não está disponível.');
    return null;
  }
  return pool;
};

const setupHealthCheck = () => {
  if (healthCheckInterval) clearInterval(healthCheckInterval);
  healthCheckInterval = setInterval(async () => {
    if (!pool) return;
    try {
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      logger.debug('Health check: Database connection OK');
    } catch (err) {
      logger.warn('Health check failed:', { error: err.message });
      await closeCurrentPool();
    }
  }, 120000);
};

const closeDB = async () => {
  if (healthCheckInterval) { clearInterval(healthCheckInterval); healthCheckInterval = null; }
  await closeCurrentPool();
  logger.info('🔌 Conexão com banco de dados encerrada');
};

// pg uses $1, $2 placeholders — convert ? to $N
const convertPlaceholders = (query) => {
  let i = 0;
  return query.replace(/\?/g, () => `$${++i}`);
};

const executeQuery = async (query, params = [], retryCount = 0) => {
  const maxRetries = 3;
  const startTime = Date.now();

  try {
    let db = getDB();
    if (!db) {
      if (retryCount >= maxRetries) throw new Error('Database não disponível após múltiplas tentativas');
      await connectDB();
      db = getDB();
      if (!db) throw new Error('Database não disponível');
    }

    const pgQuery = convertPlaceholders(query);
    const cleanParams = params.map(p => p === undefined ? null : p);

    const result = await db.query(pgQuery, cleanParams);

    logger.debug('Query executed successfully', {
      executionTime: Date.now() - startTime,
      rowCount: result.rowCount || result.rows?.length || 0
    });

    return result.rows;
  } catch (error) {
    logger.error('Erro ao executar query:', {
      query: query.substring(0, 200),
      error: error.message,
      code: error.code,
      retryCount,
      executionTime: Date.now() - startTime
    });

    const connectionErrors = ['ECONNREFUSED', 'ENOTFOUND', 'ETIMEDOUT', 'ECONNRESET', 'EPIPE', 'Connection timeout'];
    const isConnectionError = connectionErrors.some(e => error.message.includes(e) || error.code === e);

    if (isConnectionError && retryCount < maxRetries) {
      logger.warn(`Tentando reconectar e executar query novamente (tentativa ${retryCount + 1}/${maxRetries})`);
      await closeCurrentPool();
      await new Promise(r => setTimeout(r, Math.min(1000 * Math.pow(2, retryCount), 10000)));
      await connectDB();
      return executeQuery(query, params, retryCount + 1);
    }

    throw error;
  }
};

const executeTransaction = async (queries) => {
  const db = getDB();
  if (!db) throw new Error('Database não disponível');

  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const results = [];
    for (const { query, params = [] } of queries) {
      const pgQuery = convertPlaceholders(query);
      const cleanParams = params.map(p => p === undefined ? null : p);
      const result = await client.query(pgQuery, cleanParams);
      results.push(result.rows);
    }
    await client.query('COMMIT');
    return results;
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Erro na transação:', error.message);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { connectDB, getDB, closeDB, executeQuery, executeTransaction };
