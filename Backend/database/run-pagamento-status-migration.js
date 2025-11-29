const mysql = require('mysql2/promise')
const fs = require('fs')
const path = require('path')

async function runMigration() {
  let connection

  try {
    // Conectar ao banco de dados
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || '31.97.23.166',
      user: process.env.DB_USER || 'atmadb',
      password: process.env.DB_PASSWORD || 'atma2024',
      database: process.env.DB_NAME || 'atmadb',
      multipleStatements: true,
    })

    console.log('✅ Conectado ao banco de dados')

    // Ler arquivo de migração
    const migrationPath = path.join(__dirname, 'migrations', 'add-pagamento-status.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

    console.log('📄 Executando migration: add-pagamento-status.sql')

    // Executar migration
    await connection.query(migrationSQL)

    console.log('✅ Migration executada com sucesso!')

    // Verificar se a coluna foi criada
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME, COLUMN_TYPE, COLUMN_DEFAULT, IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = 'atmadb'
        AND TABLE_NAME = 'relatorios'
        AND COLUMN_NAME = 'pagamento_status';
    `)

    console.log('\n📊 Coluna criada:')
    console.table(columns)

    // Verificar índices criados
    const [indexes] = await connection.query(`
      SHOW INDEX FROM relatorios WHERE Key_name = 'idx_pagamento_status';
    `)

    console.log('\n🔍 Índice criado:')
    console.table(indexes)

    console.log('\n✅ Migration completa!')

  } catch (error) {
    console.error('❌ Erro na migration:', error)
    process.exit(1)
  } finally {
    if (connection) {
      await connection.end()
      console.log('🔌 Conexão fechada')
    }
  }
}

runMigration()
