const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'atma_aligner',
    multipleStatements: true
  });

  try {
    console.log('📦 Executando Migration 009: Add parceria_fechada status...\n');

    // Read migration file
    const migrationPath = path.join(__dirname, '../migrations/009_add_parceria_fechada_status.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Execute migration
    const [results] = await connection.query(migrationSQL);

    console.log('✅ Migration executada com sucesso!\n');

    // Show status distribution
    console.log('📊 Distribuição de status:');
    const [statusCount] = await connection.query(`
      SELECT
        status,
        COUNT(*) as count
      FROM patients_leads
      GROUP BY status
      ORDER BY FIELD(status, 'prospeccao', 'contato_inicial', 'apresentacao', 'negociacao', 'parceria_fechada')
    `);

    console.table(statusCount);

    console.log('\n✨ Status disponíveis agora:');
    console.log('   1. prospeccao');
    console.log('   2. contato_inicial');
    console.log('   3. apresentacao');
    console.log('   4. negociacao');
    console.log('   5. parceria_fechada (NOVO)\n');

  } catch (error) {
    console.error('❌ Erro ao executar migration:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

runMigration()
  .then(() => {
    console.log('🎉 Migration 009 concluída!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Falha na migration:', error);
    process.exit(1);
  });
