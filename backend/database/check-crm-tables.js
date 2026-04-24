const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function checkCRMTables() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
  });

  console.log('Verificando se tabelas do CRM existem no atmadb:\n');

  const crmTables = ['clientes', 'relatorios', 'consultas', 'tratamentos', 'atividades'];

  for (const table of crmTables) {
    const [result] = await conn.query(`SHOW TABLES LIKE '${table}'`);
    const exists = result.length > 0;
    const emoji = exists ? '✅' : '❌';
    console.log(`${emoji} ${table.padEnd(20)} ${exists ? 'EXISTE' : 'NAO EXISTE'}`);

    if (exists) {
      const [count] = await conn.execute(`SELECT COUNT(*) as total FROM ${table}`);
      console.log(`   -> ${count[0].total} registros\n`);
    }
  }

  await conn.end();
}

checkCRMTables();
