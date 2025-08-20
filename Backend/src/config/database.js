const mysql = require('mysql2/promise');
const { logger } = require('../utils/logger');

let pool = null;

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'atma_align',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  charset: 'utf8mb4'
};

const connectDB = async () => {
  try {
    pool = mysql.createPool(dbConfig);
    
    // Test connection
    const connection = await pool.getConnection();
    logger.info('✅ Conectado ao banco de dados MySQL');
    connection.release();
    
    return pool;
  } catch (error) {
    logger.error('❌ Erro ao conectar com o banco de dados:', error.message);
    process.exit(1);
  }
};

const getDB = () => {
  if (!pool) {
    throw new Error('Database não foi inicializado. Chame connectDB() primeiro.');
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
  try {
    const db = getDB();
    const [results] = await db.execute(query, params);
    return results;
  } catch (error) {
    logger.error('Erro ao executar query:', { query, params, error: error.message });
    throw error;
  }
};

// Utility function para transações
const executeTransaction = async (queries) => {
  const connection = await getDB().getConnection();
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