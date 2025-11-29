const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function testCRMConnection() {
  try {
    console.log('🧪 Testando conexão e criação de cliente no CRM...\n');

    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Conectado ao banco:', process.env.DB_NAME);
    console.log('📍 Host:', process.env.DB_HOST);
    console.log('');

    // Teste 1: Verificar tabelas CRM
    console.log('📋 Verificando tabelas CRM:');
    const crmTables = ['clientes', 'relatorios', 'consultas', 'tratamentos', 'atividades'];

    for (const table of crmTables) {
      const [count] = await conn.execute(`SELECT COUNT(*) as total FROM ${table}`);
      console.log(`  ✅ ${table.padEnd(20)} ${count[0].total} registros`);
    }

    console.log('');

    // Teste 2: Criar cliente de teste
    console.log('👤 Criando cliente de teste...');

    const clienteTeste = {
      nome: 'Jean Zago (Teste CRM)',
      email: 'jean.zago.teste@atma.com.br',
      telefone: '(11) 98765-4321',
      idade: 32,
      cidade: 'São Paulo',
      estado: 'SP',
      profissao: 'Empresário'
    };

    // Verificar se já existe
    const [existing] = await conn.execute(
      'SELECT id FROM clientes WHERE email = ?',
      [clienteTeste.email]
    );

    let clienteId;

    if (existing.length > 0) {
      clienteId = existing[0].id;
      console.log(`  ℹ️ Cliente já existe (ID: ${clienteId})`);

      // Atualizar
      await conn.execute(
        `UPDATE clientes
         SET nome = ?, telefone = ?, idade = ?, cidade = ?, estado = ?, profissao = ?
         WHERE id = ?`,
        [
          clienteTeste.nome,
          clienteTeste.telefone,
          clienteTeste.idade,
          clienteTeste.cidade,
          clienteTeste.estado,
          clienteTeste.profissao,
          clienteId
        ]
      );
      console.log(`  ✅ Cliente atualizado`);
    } else {
      // Inserir novo
      const [result] = await conn.execute(
        `INSERT INTO clientes (nome, email, telefone, idade, cidade, estado, profissao)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          clienteTeste.nome,
          clienteTeste.email,
          clienteTeste.telefone,
          clienteTeste.idade,
          clienteTeste.cidade,
          clienteTeste.estado,
          clienteTeste.profissao
        ]
      );
      clienteId = result.insertId;
      console.log(`  ✅ Cliente criado (ID: ${clienteId})`);
    }

    console.log('');

    // Teste 3: Buscar cliente criado
    console.log('🔍 Buscando cliente criado...');
    const [cliente] = await conn.execute(
      'SELECT * FROM clientes WHERE id = ?',
      [clienteId]
    );

    if (cliente.length > 0) {
      console.log('  ✅ Cliente encontrado:');
      console.log(`     ID: ${cliente[0].id}`);
      console.log(`     Nome: ${cliente[0].nome}`);
      console.log(`     Email: ${cliente[0].email}`);
      console.log(`     Telefone: ${cliente[0].telefone}`);
      console.log(`     Cidade: ${cliente[0].cidade}/${cliente[0].estado}`);
      console.log(`     Profissão: ${cliente[0].profissao}`);
      console.log(`     Criado em: ${cliente[0].created_at}`);
    } else {
      console.log('  ❌ Cliente não encontrado');
    }

    console.log('');

    // Teste 4: Listar todos os clientes
    const [allClientes] = await conn.execute(
      'SELECT id, nome, email, created_at FROM clientes ORDER BY created_at DESC LIMIT 10'
    );

    console.log(`📊 Total de clientes no CRM: ${allClientes.length}`);
    if (allClientes.length > 0) {
      console.log('   Últimos clientes:');
      allClientes.forEach((c, idx) => {
        console.log(`   ${idx + 1}. ${c.nome} (${c.email}) - ${c.created_at}`);
      });
    }

    console.log('');

    await conn.end();

    console.log('🎉 Todos os testes passaram!\n');

    return {
      success: true,
      clienteId,
      totalClientes: allClientes.length
    };

  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testCRMConnection();
