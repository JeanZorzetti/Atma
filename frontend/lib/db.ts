import { Pool } from 'pg'

// Lazy singleton — not instantiated at build time
let _pool: Pool | null = null

function getPool(): Pool {
  if (!_pool) {
    _pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 300000,
      connectionTimeoutMillis: 10000,
    })
  }
  return _pool
}

// Convert MySQL ? placeholders to PostgreSQL $1, $2, ...
function convertPlaceholders(sql: string): string {
  let i = 0
  return sql.replace(/\?/g, () => `$${++i}`)
}

export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  try {
    const result = await getPool().query(convertPlaceholders(sql), params)
    return result.rows as T[]
  } catch (error) {
    console.error('❌ Erro ao executar query:', error)
    throw error
  }
}

// Alias used by some routes
export const queryMany = query

export async function queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(sql, params)
  return rows.length > 0 ? rows[0] : null
}

export async function insert(sql: string, params?: any[]): Promise<number> {
  try {
    const pgSql = convertPlaceholders(sql) + ' RETURNING id'
    const result = await getPool().query(pgSql, params)
    return result.rows[0]?.id ?? 0
  } catch (error) {
    console.error('❌ Erro ao inserir registro:', error)
    throw error
  }
}

export async function testConnection(): Promise<boolean> {
  try {
    await getPool().query('SELECT 1')
    console.log('✅ Conexão com PostgreSQL estabelecida')
    return true
  } catch (error) {
    console.error('❌ Erro ao conectar ao PostgreSQL:', error)
    return false
  }
}

export async function closePool(): Promise<void> {
  if (_pool) {
    await _pool.end()
    _pool = null
  }
}

export default { query, queryMany, queryOne, insert, testConnection, closePool }
