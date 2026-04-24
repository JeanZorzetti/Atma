const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function applyCRMSchema() {
  try {
    console.log('🚀 Aplicando schema CRM no banco atmadb...\n');

    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      multipleStatements: true
    });

    console.log('✅ Conectado ao banco:', process.env.DB_NAME);
    console.log('📍 Host:', process.env.DB_HOST, '\n');

    // Ler schema SQL do Frontend
    const schemaPath = path.join(__dirname, '../../Frontend/db/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('📋 Executando schema SQL...\n');

    // Executar schema
    await conn.query(schema);

    console.log('✅ Schema aplicado com sucesso!\n');

    // Verificar tabelas criadas
    console.log('📊 Verificando tabelas criadas:\n');

    const tables = ['clientes', 'relatorios', 'consultas', 'tratamentos', 'atividades'];

    for (const table of tables) {
      const [result] = await conn.query(`SHOW TABLES LIKE '${table}'`);
      if (result.length > 0) {
        const [count] = await conn.execute(`SELECT COUNT(*) as total FROM ${table}`);
        console.log(`✅ ${table.padEnd(20)} criada (${count[0].total} registros)`);
      } else {
        console.log(`❌ ${table.padEnd(20)} NÃO foi criada`);
      }
    }

    // Verificar views
    console.log('\n📊 Verificando views criadas:\n');

    const views = ['estatisticas_gerais', 'problemas_mais_comuns', 'relatorios_recentes'];

    for (const view of views) {
      const [result] = await conn.query(`SHOW FULL TABLES WHERE Table_type = 'VIEW' AND Tables_in_${process.env.DB_NAME} = '${view}'`);
      if (result.length > 0) {
        console.log(`✅ ${view.padEnd(30)} criada`);
      } else {
        console.log(`❌ ${view.padEnd(30)} NÃO foi criada`);
      }
    }

    await conn.end();

    console.log('\n🎉 CRM pronto para uso!\n');

  } catch (error) {
    console.error('❌ Erro ao aplicar schema:', error.message);
    if (error.sql) {
      console.error('\nSQL com erro:', error.sql);
    }
    process.exit(1);
  }
}

applyCRMSchema();
