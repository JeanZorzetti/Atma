/**
 * Script para aplicar migração de follow-up no banco MySQL
 * Adiciona colunas para controle de emails automatizados
 */

const mysql = require('mysql2/promise')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

async function runMigration() {
  console.log('🔄 Iniciando migração de follow-up...\n')

  // Conectar ao banco
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '31.97.23.166',
    user: process.env.DB_USER || 'atmadb',
    password: process.env.DB_PASSWORD || 'atma2024',
    database: process.env.DB_NAME || 'atmadb',
    port: process.env.DB_PORT || 3306,
    multipleStatements: true,
  })

  console.log('✅ Conectado ao banco MySQL\n')

  // Ler arquivo SQL de migração
  const migrationPath = path.join(__dirname, 'migrations', 'add-followup-columns.sql')
  const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

  try {
    // Executar migração
    console.log('📝 Aplicando migração add-followup-columns.sql...\n')
    await connection.query(migrationSQL)
    console.log('✅ Migração aplicada com sucesso!\n')

    // Verificar colunas criadas
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = '${process.env.DB_NAME || 'atmadb'}'
        AND TABLE_NAME = 'relatorios'
        AND COLUMN_NAME LIKE 'email_%'
      ORDER BY COLUMN_NAME
    `)

    console.log('📋 Colunas de email na tabela relatorios:')
    console.table(columns)

    // Verificar índices criados
    const [indexes] = await connection.query(`
      SELECT INDEX_NAME, COLUMN_NAME, SEQ_IN_INDEX
      FROM INFORMATION_SCHEMA.STATISTICS
      WHERE TABLE_SCHEMA = '${process.env.DB_NAME || 'atmadb'}'
        AND TABLE_NAME = 'relatorios'
        AND INDEX_NAME LIKE 'idx_email%'
      ORDER BY INDEX_NAME, SEQ_IN_INDEX
    `)

    console.log('\n📊 Índices criados:')
    console.table(indexes)

    console.log('\n🎉 Migração concluída com sucesso!')

  } catch (error) {
    console.error('\n❌ Erro ao aplicar migração:', error.message)
    throw error
  } finally {
    await connection.end()
  }
}

// Executar migração
runMigration().catch((error) => {
  console.error('Falha na migração:', error)
  process.exit(1)
})
