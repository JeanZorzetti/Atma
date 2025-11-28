/**
 * Cliente MySQL para CRM Atma
 * Fase 5.1: CRM Integration
 */

import mysql from 'mysql2/promise'

// Configuração do pool de conexões
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'atma_crm',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
})

/**
 * Executa uma query no banco de dados
 */
export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  try {
    const [rows] = await pool.execute(sql, params)
    return rows as T[]
  } catch (error) {
    console.error('❌ Erro ao executar query:', error)
    throw error
  }
}

/**
 * Executa uma query e retorna apenas a primeira linha
 */
export async function queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(sql, params)
  return rows.length > 0 ? rows[0] : null
}

/**
 * Insere um registro e retorna o ID inserido
 */
export async function insert(sql: string, params?: any[]): Promise<number> {
  try {
    const [result] = await pool.execute(sql, params)
    return (result as any).insertId
  } catch (error) {
    console.error('❌ Erro ao inserir registro:', error)
    throw error
  }
}

/**
 * Testa a conexão com o banco
 */
export async function testConnection(): Promise<boolean> {
  try {
    await pool.query('SELECT 1')
    console.log('✅ Conexão com MySQL estabelecida')
    return true
  } catch (error) {
    console.error('❌ Erro ao conectar ao MySQL:', error)
    return false
  }
}

/**
 * Fecha o pool de conexões
 */
export async function closePool(): Promise<void> {
  await pool.end()
}

export default pool
