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
    console.log('📦 Executando Migration 011: Create market_benchmarks table...\n');

    // Read migration file
    const migrationPath = path.join(__dirname, '../migrations/011_create_market_benchmarks_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Execute migration
    await connection.query(migrationSQL);

    console.log('✅ Migration executada com sucesso!\n');

    // Show inserted benchmarks
    console.log('📊 Benchmarks de mercado inseridos:');
    const [benchmarks] = await connection.query(`
      SELECT
        category,
        metric_name,
        metric_value,
        metric_unit,
        source
      FROM market_benchmarks
      ORDER BY
        FIELD(category, 'SEO', 'CONVERSAO', 'GERAL'),
        id
    `);

    // Group by category
    const grouped = benchmarks.reduce((acc, row) => {
      if (!acc[row.category]) acc[row.category] = [];
      acc[row.category].push(row);
      return acc;
    }, {});

    Object.entries(grouped).forEach(([category, items]) => {
      console.log(`\n📌 ${category}:`);
      items.forEach(item => {
        console.log(`   ${item.metric_name}: ${item.metric_value}${item.metric_unit}`);
      });
    });

    console.log('\n✨ Tabela market_benchmarks criada com sucesso!');
    console.log(`   Total de métricas: ${benchmarks.length}`);
    console.log('\n📝 Nota importante:');
    console.log('   Os valores inseridos são placeholders.');
    console.log('   Use o Gemini Deep Research para obter dados reais do mercado.');
    console.log('   Depois, edite os benchmarks em /admin/configuracoes\n');

  } catch (error) {
    console.error('❌ Erro ao executar migration:', error.message);

    // Check if table already exists
    if (error.code === 'ER_TABLE_EXISTS_ERROR') {
      console.log('\n⚠️  Tabela market_benchmarks já existe!');
      console.log('💡 Para recriar a tabela, execute:');
      console.log('   DROP TABLE market_benchmarks;');
      console.log('   E rode a migration novamente.\n');
    } else {
      console.error('\n💡 Dica: Verifique se:');
      console.error('   1. O banco de dados existe');
      console.error('   2. As permissões estão corretas');
      console.error('   3. Não há conflitos de nome de tabela');
    }

    throw error;
  } finally {
    await connection.end();
  }
}

runMigration()
  .then(() => {
    console.log('🎉 Migration 011 concluída!');
    console.log('📋 Próximos passos:');
    console.log('   1. Executar pesquisa no Gemini Deep Research');
    console.log('   2. Criar API endpoints para CRUD de benchmarks');
    console.log('   3. Criar interface de edição em /admin/configuracoes');
    console.log('   4. Criar página de comparação em /admin/benchmark-mercado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Falha na migration:', error);
    process.exit(1);
  });
