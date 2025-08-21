const mysql = require('mysql2/promise');
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
    pool = mysql.createPool(dbConfig);
    
    // Test connection
    const connection = await pool.getConnection();
    logger.info('✅ Conectado ao banco de dados MySQL');
    connection.release();
    
    return pool;
  } catch (error) {
    logger.error('❌ Erro ao conectar com o banco de dados:', error.message);
    logger.warn('⚠️ Aplicação continuará sem banco de dados - usando dados mock');
    // Não mata o processo - permite rodar sem banco
    return null;
  }
};

const getDB = () => {
  if (!pool) {
    logger.warn('Database não disponível - retornando null');
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
  try {
    const db = getDB();
    if (!db) {
      throw new Error('Database não disponível');
    }
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