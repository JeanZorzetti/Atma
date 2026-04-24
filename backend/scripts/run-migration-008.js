const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    multipleStatements: true
  });

  console.log('✅ Conectado ao banco de dados MySQL');

  try {
    // Ler arquivo SQL
    const sqlFile = path.join(__dirname, '../migrations/008_create_google_search_console_tables_mysql.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Executar migration
    console.log('🔄 Executando migration 008...');
    await connection.query(sql);

    console.log('✅ Migration 008 executada com sucesso!');

    // Verificar tabelas criadas
    const [tables] = await connection.query("SHOW TABLES LIKE '%google%' OR SHOW TABLES LIKE '%seo%'");
    console.log('\n📊 Tabelas criadas:');
    tables.forEach(table => {
      console.log(`  - ${Object.values(table)[0]}`);
    });

    // Contar registros
    console.log('\n📈 Contagem de registros:');
    const [authCount] = await connection.query('SELECT COUNT(*) as count FROM google_auth_tokens');
    console.log(`  - google_auth_tokens: ${authCount[0].count}`);

    const [metricsCount] = await connection.query('SELECT COUNT(*) as count FROM seo_metrics_history');
    console.log(`  - seo_metrics_history: ${metricsCount[0].count}`);

    const [alertsCount] = await connection.query('SELECT COUNT(*) as count FROM seo_alerts');
    console.log(`  - seo_alerts: ${alertsCount[0].count}`);

  } catch (error) {
    console.error('❌ Erro ao executar migration:', error.message);
    throw error;
  } finally {
    await connection.end();
    console.log('\n✅ Conexão fechada');
  }
}

runMigration()
  .then(() => {
    console.log('\n🎉 Migration concluída com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Falha na migration:', error);
    process.exit(1);
  });
