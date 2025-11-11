const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runMigration() {
  let connection;

  try {
    // Criar conexão com o banco
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'atma',
      multipleStatements: true
    });

    console.log('✅ Conectado ao banco de dados');

    // Ler arquivo SQL
    const migrationPath = path.join(__dirname, '../migrations/012_add_cidade_bairro_to_patient_leads.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('📝 Executando migration 012: Adicionar cidade e bairro à patient_leads...');

    // Executar SQL
    await connection.query(sql);

    console.log('✅ Migration 012 executada com sucesso!');
    console.log('📌 Campos adicionados: cidade, bairro');
    console.log('📌 Índices criados: idx_cidade, idx_bairro');

  } catch (error) {
    console.error('❌ Erro ao executar migration:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexão com banco fechada');
    }
  }
}

runMigration();
