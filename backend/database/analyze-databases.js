const mysql = require('mysql2/promise');
require('dotenv').config();

async function analyzeDatabases() {
  try {
    console.log('🔍 Iniciando análise dos bancos de dados...\n');

    // Conectar ao CRM
    const crmConn = await mysql.createConnection({
      host: process.env.DB_HOST_CRM || process.env.DB_HOST,
      user: process.env.DB_USER_CRM || process.env.DB_USER,
      password: process.env.DB_PASSWORD_CRM || process.env.DB_PASSWORD,
      database: 'atma_crm',
      port: process.env.DB_PORT || 3306
    });

    // Conectar ao Backend
    const backendConn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'atma_aligner',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Conexões estabelecidas\n');

    // Análise do CRM
    console.log('📊 DATABASE: atma_crm');
    console.log('═'.repeat(60));

    const [crmClientes] = await crmConn.execute('SELECT COUNT(*) as total FROM clientes');
    const [crmRelatorios] = await crmConn.execute('SELECT COUNT(*) as total FROM relatorios_pdf');
    const [crmJornada] = await crmConn.execute('SELECT COUNT(*) as total FROM jornada_cliente');
    const [crmConsultas] = await crmConn.execute('SELECT COUNT(*) as total FROM consultas');
    const [crmTratamentos] = await crmConn.execute('SELECT COUNT(*) as total FROM tratamentos');

    console.log(`Clientes: ${crmClientes[0].total}`);
    console.log(`Relatórios PDF: ${crmRelatorios[0].total}`);
    console.log(`Jornada Cliente: ${crmJornada[0].total}`);
    console.log(`Consultas: ${crmConsultas[0].total}`);
    console.log(`Tratamentos: ${crmTratamentos[0].total}`);

    // Emails CRM
    const [crmEmails] = await crmConn.execute('SELECT DISTINCT email FROM clientes WHERE email IS NOT NULL');
    console.log(`Emails únicos: ${crmEmails.length}`);

    console.log('\n📊 DATABASE: atma_aligner');
    console.log('═'.repeat(60));

    // Análise do Backend
    const [backendLeads] = await backendConn.execute('SELECT COUNT(*) as total FROM patient_leads');
    const [backendOrtho] = await backendConn.execute('SELECT COUNT(*) as total FROM orthodontists');
    const [backendPartner] = await backendConn.execute('SELECT COUNT(*) as total FROM orthodontist_partnerships');
    const [backendAssign] = await backendConn.execute('SELECT COUNT(*) as total FROM patient_orthodontist_assignments');

    console.log(`Patient Leads: ${backendLeads[0].total}`);
    console.log(`Orthodontists: ${backendOrtho[0].total}`);
    console.log(`Partnership Requests: ${backendPartner[0].total}`);
    console.log(`Assignments: ${backendAssign[0].total}`);

    // Emails Backend
    const [backendEmails] = await backendConn.execute('SELECT DISTINCT email FROM patient_leads WHERE email IS NOT NULL');
    console.log(`Emails únicos: ${backendEmails.length}`);

    // Identificar emails duplicados
    console.log('\n🔍 ANÁLISE DE DUPLICAÇÃO');
    console.log('═'.repeat(60));

    const crmEmailSet = new Set(crmEmails.map(e => e.email.toLowerCase()));
    const backendEmailSet = new Set(backendEmails.map(e => e.email.toLowerCase()));

    const duplicatedEmails = [...crmEmailSet].filter(email => backendEmailSet.has(email));

    console.log(`Emails ÚNICOS no CRM: ${crmEmailSet.size}`);
    console.log(`Emails ÚNICOS no Backend: ${backendEmailSet.size}`);
    console.log(`Emails DUPLICADOS (existem em AMBOS): ${duplicatedEmails.length}`);

    if (duplicatedEmails.length > 0) {
      console.log('\n⚠️ Emails duplicados encontrados:');
      duplicatedEmails.slice(0, 10).forEach(email => console.log(`  - ${email}`));
      if (duplicatedEmails.length > 10) {
        console.log(`  ... e mais ${duplicatedEmails.length - 10} emails`);
      }
    }

    // Estatísticas finais
    console.log('\n📈 RESUMO TOTAL');
    console.log('═'.repeat(60));
    const totalClientesCRM = crmClientes[0].total;
    const totalLeadsBackend = backendLeads[0].total;
    const totalClientes = totalClientesCRM + totalLeadsBackend - duplicatedEmails.length;

    console.log(`Total de clientes CRM: ${totalClientesCRM}`);
    console.log(`Total de leads Backend: ${totalLeadsBackend}`);
    console.log(`Duplicados: -${duplicatedEmails.length}`);
    console.log(`TOTAL UNIFICADO: ${totalClientes} clientes`);

    // Salvar lista de emails duplicados para análise detalhada
    const duplicatedData = {
      total_duplicados: duplicatedEmails.length,
      emails: duplicatedEmails,
      data_analise: new Date().toISOString()
    };

    const fs = require('fs');
    const path = require('path');
    fs.writeFileSync(
      path.join(__dirname, 'emails-duplicados.json'),
      JSON.stringify(duplicatedData, null, 2)
    );
    console.log('\n💾 Lista de emails duplicados salva em: database/emails-duplicados.json');

    await crmConn.end();
    await backendConn.end();

    console.log('\n✅ Análise concluída com sucesso!\n');

    return {
      crm: {
        clientes: crmClientes[0].total,
        relatorios: crmRelatorios[0].total,
        jornada: crmJornada[0].total,
        consultas: crmConsultas[0].total,
        tratamentos: crmTratamentos[0].total,
        emails_unicos: crmEmailSet.size
      },
      backend: {
        patient_leads: backendLeads[0].total,
        orthodontists: backendOrtho[0].total,
        partnerships: backendPartner[0].total,
        assignments: backendAssign[0].total,
        emails_unicos: backendEmailSet.size
      },
      duplicacao: {
        emails_duplicados: duplicatedEmails.length,
        total_unificado: totalClientes
      }
    };

  } catch (error) {
    console.error('❌ Erro durante análise:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  analyzeDatabases();
}

module.exports = { analyzeDatabases };
