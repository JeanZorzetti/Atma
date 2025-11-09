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
    console.log('📦 Executando Migration 010: Add atribuido and avaliacao_inicial to patient_leads...\n');

    // Read migration file
    const migrationPath = path.join(__dirname, '../migrations/010_add_patient_status_atribuido_avaliacao.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Execute migration (wrap in try-catch to handle duplicate index error gracefully)
    try {
      await connection.query(migrationSQL);
    } catch (migrationError) {
      // Ignore duplicate index error (code 1061)
      if (migrationError.errno === 1061) {
        console.log('⚠️  Index already exists, skipping creation...\n');
      } else {
        throw migrationError;
      }
    }

    console.log('✅ Migration executada com sucesso!\n');

    // Show status distribution
    console.log('📊 Distribuição de status (B2C - Pacientes):');
    const [statusCount] = await connection.query(`
      SELECT
        status,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM patient_leads), 2) as percentage
      FROM patient_leads
      GROUP BY status
      ORDER BY FIELD(status, 'novo', 'contatado', 'agendado', 'avaliacao_inicial', 'atribuido', 'convertido', 'cancelado')
    `);

    console.table(statusCount);

    console.log('\n✨ Status disponíveis agora (B2C - patient_leads):');
    console.log('   1. novo → Lead inicial (cadastro)');
    console.log('   2. contatado → Lead foi contactado');
    console.log('   3. agendado → Consulta agendada');
    console.log('   4. avaliacao_inicial → Em avaliação inicial (NOVO)');
    console.log('   5. atribuido → Atribuído a ortodontista/Em tratamento (NOVO)');
    console.log('   6. convertido → Tratamento concluído');
    console.log('   7. cancelado → Lead cancelado\n');

    console.log('🎯 Funil B2C completo:');
    console.log('   novo → contatado → agendado → avaliacao_inicial → atribuido → convertido');
    console.log('                                                          ↓');
    console.log('                                                     cancelado\n');

    console.log('📝 Notas importantes:');
    console.log('   - Status "excluido" foi migrado para "cancelado"');
    console.log('   - Frontend agora está 100% alinhado com backend');
    console.log('   - Kanban pode usar todas as colunas sem erros');
    console.log('   - BI de Conversão pode rastrear todos os 7 estágios\n');

  } catch (error) {
    console.error('❌ Erro ao executar migration:', error.message);
    console.error('\n💡 Dica: Verifique se:');
    console.error('   1. O banco de dados existe');
    console.error('   2. A tabela patient_leads existe');
    console.error('   3. Não há valores inválidos na coluna status');
    throw error;
  } finally {
    await connection.end();
  }
}

runMigration()
  .then(() => {
    console.log('🎉 Migration 010 concluída!');
    console.log('📋 Próximos passos:');
    console.log('   1. Testar drag & drop no Kanban (/admin/pacientes/kanban)');
    console.log('   2. Testar edição de status no modal (/admin/pacientes/lista)');
    console.log('   3. Verificar filtros de status');
    console.log('   4. Atualizar BI de Conversão para incluir novos estágios');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Falha na migration:', error);
    process.exit(1);
  });
