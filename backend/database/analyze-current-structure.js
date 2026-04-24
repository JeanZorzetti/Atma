const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function analyzeCurrentStructure() {
  try {
    console.log('🔍 Analisando estrutura atual do banco de dados...\n');

    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Conectado ao banco:', process.env.DB_NAME);
    console.log('📍 Host:', process.env.DB_HOST);
    console.log('\n' + '═'.repeat(70) + '\n');

    // 1. ANÁLISE DE TABELAS E REGISTROS
    console.log('📊 ANÁLISE DE TABELAS E REGISTROS\n');

    const tables = [
      // Tabelas CRM
      { name: 'crm_leads', category: 'CRM' },
      { name: 'crm_activities', category: 'CRM' },

      // Tabelas Backend/Leads
      { name: 'patient_leads', category: 'Leads de Pacientes' },
      { name: 'patient_status_history', category: 'Histórico' },

      // Tabelas Ortodontistas
      { name: 'orthodontists', category: 'Ortodontistas' },
      { name: 'orthodontist_partnerships', category: 'Parcerias' },
      { name: 'patient_orthodontist_assignments', category: 'Atribuições' },

      // Tabelas Sistema
      { name: 'email_logs', category: 'Sistema' },
      { name: 'email_templates', category: 'Sistema' },
      { name: 'system_settings', category: 'Sistema' },
      { name: 'notification_log', category: 'Sistema' },
      { name: 'google_auth_tokens', category: 'Integrações' },

      // Tabelas SEO
      { name: 'seo_metrics_history', category: 'SEO' },
      { name: 'seo_alerts', category: 'SEO' },
      { name: 'market_benchmarks', category: 'SEO' }
    ];

    const results = {};

    for (const table of tables) {
      try {
        const [count] = await conn.execute(`SELECT COUNT(*) as total FROM ${table.name}`);
        results[table.name] = {
          total: count[0].total,
          category: table.category
        };

        const categoryEmoji = {
          'CRM': '👥',
          'Leads de Pacientes': '🦷',
          'Ortodontistas': '👨‍⚕️',
          'Parcerias': '🤝',
          'Atribuições': '📌',
          'Sistema': '⚙️',
          'Integrações': '🔗',
          'SEO': '📈',
          'Histórico': '📜'
        };

        const emoji = categoryEmoji[table.category] || '📋';
        console.log(`${emoji} ${table.name.padEnd(35)} ${count[0].total.toString().padStart(6)} registros`);
      } catch (error) {
        console.log(`❌ ${table.name.padEnd(35)} ERRO: ${error.message}`);
      }
    }

    // 2. ANÁLISE DE EMAILS ÚNICOS
    console.log('\n' + '═'.repeat(70));
    console.log('\n📧 ANÁLISE DE EMAILS ÚNICOS\n');

    // Emails em crm_leads
    const [crmLeadsEmails] = await conn.execute(
      'SELECT DISTINCT email FROM crm_leads WHERE email IS NOT NULL AND email != ""'
    );

    // Emails em patient_leads
    const [patientLeadsEmails] = await conn.execute(
      'SELECT DISTINCT email FROM patient_leads WHERE email IS NOT NULL AND email != ""'
    );

    console.log(`Emails únicos em crm_leads:        ${crmLeadsEmails.length}`);
    console.log(`Emails únicos em patient_leads:    ${patientLeadsEmails.length}`);

    // Emails duplicados entre as duas tabelas
    const crmEmailSet = new Set(crmLeadsEmails.map(e => e.email.toLowerCase()));
    const patientEmailSet = new Set(patientLeadsEmails.map(e => e.email.toLowerCase()));

    const duplicatedEmails = [...crmEmailSet].filter(email => patientEmailSet.has(email));

    console.log(`Emails DUPLICADOS (ambas tabelas): ${duplicatedEmails.length}`);
    console.log(`Total ÚNICO de emails:              ${crmEmailSet.size + patientEmailSet.size - duplicatedEmails.length}`);

    if (duplicatedEmails.length > 0) {
      console.log('\n⚠️ Primeiros 10 emails duplicados:');
      duplicatedEmails.slice(0, 10).forEach((email, idx) => {
        console.log(`  ${idx + 1}. ${email}`);
      });
      if (duplicatedEmails.length > 10) {
        console.log(`  ... e mais ${duplicatedEmails.length - 10} emails`);
      }
    }

    // 3. ANÁLISE DE ESTRUTURA DAS TABELAS
    console.log('\n' + '═'.repeat(70));
    console.log('\n📐 ESTRUTURA DAS TABELAS PRINCIPAIS\n');

    // crm_leads structure
    const [crmLeadsStructure] = await conn.execute('DESCRIBE crm_leads');
    console.log('📋 Campos em crm_leads:');
    crmLeadsStructure.forEach(field => {
      console.log(`  • ${field.Field.padEnd(25)} ${field.Type.padEnd(20)} ${field.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    console.log('\n📋 Campos em patient_leads:');
    const [patientLeadsStructure] = await conn.execute('DESCRIBE patient_leads');
    patientLeadsStructure.forEach(field => {
      console.log(`  • ${field.Field.padEnd(25)} ${field.Type.padEnd(20)} ${field.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    // 4. ANÁLISE DE STATUS
    console.log('\n' + '═'.repeat(70));
    console.log('\n📊 DISTRIBUIÇÃO POR STATUS\n');

    // Status em crm_leads
    const [crmStatus] = await conn.execute(
      'SELECT status, COUNT(*) as total FROM crm_leads GROUP BY status ORDER BY total DESC'
    );

    console.log('Status em crm_leads:');
    crmStatus.forEach(s => {
      console.log(`  • ${(s.status || 'NULL').padEnd(20)} ${s.total.toString().padStart(6)} registros`);
    });

    // Status em patient_leads
    const [patientStatus] = await conn.execute(
      'SELECT status, COUNT(*) as total FROM patient_leads GROUP BY status ORDER BY total DESC'
    );

    console.log('\nStatus em patient_leads:');
    patientStatus.forEach(s => {
      console.log(`  • ${(s.status || 'NULL').padEnd(20)} ${s.total.toString().padStart(6)} registros`);
    });

    // 5. SALVAR RESULTADOS
    const fs = require('fs');
    const path = require('path');

    const analysisData = {
      data_analise: new Date().toISOString(),
      banco: process.env.DB_NAME,
      host: process.env.DB_HOST,
      tabelas: results,
      emails: {
        crm_leads: crmLeadsEmails.length,
        patient_leads: patientLeadsEmails.length,
        duplicados: duplicatedEmails.length,
        total_unico: crmEmailSet.size + patientEmailSet.size - duplicatedEmails.length,
        lista_duplicados: duplicatedEmails
      },
      status_distribution: {
        crm_leads: crmStatus,
        patient_leads: patientStatus
      }
    };

    fs.writeFileSync(
      path.join(__dirname, 'analise-estrutura-atual.json'),
      JSON.stringify(analysisData, null, 2)
    );

    console.log('\n' + '═'.repeat(70));
    console.log('\n💾 Análise salva em: database/analise-estrutura-atual.json');
    console.log('\n✅ Análise completa!\n');

    await conn.end();

    return analysisData;

  } catch (error) {
    console.error('❌ Erro durante análise:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  analyzeCurrentStructure();
}

module.exports = { analyzeCurrentStructure };
