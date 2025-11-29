/**
 * Migration: Fix column sizes in relatorios table
 * Run this to fix VARCHAR lengths that are too small for frontend values
 */

const mysql = require('mysql2/promise')
const fs = require('fs')
const path = require('path')

async function runMigration() {
  let connection

  try {
    console.log('🔧 Connecting to database...')

    connection = await mysql.createConnection({
      host: process.env.DB_HOST || '31.97.23.166',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'atmadb',
      password: process.env.DB_PASSWORD || 'PAzo18**',
      database: process.env.DB_NAME || 'atmadb',
      multipleStatements: true,
    })

    console.log('✅ Connected successfully')

    // Read migration file
    const migrationPath = path.join(__dirname, 'migrations', 'fix-column-sizes.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

    console.log('\n📝 Executing migration:')
    console.log(migrationSQL)

    // Execute migration
    await connection.query(migrationSQL)

    console.log('\n✅ Migration completed successfully!')
    console.log('\nColumn sizes updated:')
    console.log('  - ja_usou_aparelho: VARCHAR(20) → VARCHAR(100)')
    console.log('  - expectativa_resultado: VARCHAR(50) → VARCHAR(100)')
    console.log('  - urgencia_tratamento: VARCHAR(50) → VARCHAR(100)')
    console.log('  - orcamento_recebido: VARCHAR(20) → VARCHAR(100)')
    console.log('  - disponibilidade_uso: VARCHAR(50) → VARCHAR(100)')

  } catch (error) {
    console.error('\n❌ Migration failed!')
    console.error('Error:', error.message)
    console.error('\nFull error:')
    console.error(error)
    process.exit(1)
  } finally {
    if (connection) {
      await connection.end()
      console.log('\n🔌 Database connection closed')
    }
  }
}

runMigration()
