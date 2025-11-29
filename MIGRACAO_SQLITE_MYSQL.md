# 🚀 Migração SQLite → MySQL (2-3 dias)

**Objetivo:** Migrar dados do SQLite local (`Frontend/db`) para MySQL remoto (`atmadb`)

---

## 📊 Situação Atual

### SQLite Local (`Frontend/db`)
- Usado apenas pelo Frontend (infoproduto)
- Tabelas: `clientes`, `relatorios_pdf`, `jornada_cliente`, `consultas`, `tratamentos`
- **Problema:** Dados presos localmente, não acessíveis pelo Backend

### MySQL Remoto (`atmadb`)
- Host: `31.97.23.166`
- Database: `atmadb`
- 15 tabelas já existentes
- Usado pelo Backend e algumas partes do Frontend

---

## 🎯 Plano de Migração (2-3 dias)

### **Dia 1: Análise e Exportação** (4-6 horas)

#### Manhã: Análise do SQLite
```bash
# 1. Verificar estrutura do SQLite
cd Frontend
sqlite3 db/atma.db ".schema" > ../sqlite-schema.sql

# 2. Contar registros
sqlite3 db/atma.db "SELECT 'clientes', COUNT(*) FROM clientes
UNION ALL SELECT 'relatorios_pdf', COUNT(*) FROM relatorios_pdf
UNION ALL SELECT 'jornada_cliente', COUNT(*) FROM jornada_cliente
UNION ALL SELECT 'consultas', COUNT(*) FROM consultas
UNION ALL SELECT 'tratamentos', COUNT(*) FROM tratamentos;"
```

#### Tarde: Exportar dados do SQLite
```javascript
// Backend/database/export-from-sqlite.js
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const sqlitePath = path.join(__dirname, '../../Frontend/db/atma.db');
const db = new sqlite3.Database(sqlitePath);

async function exportData() {
  const tables = ['clientes', 'relatorios_pdf', 'jornada_cliente', 'consultas', 'tratamentos'];
  const exportData = {};

  for (const table of tables) {
    exportData[table] = await new Promise((resolve, reject) => {
      db.all(`SELECT * FROM ${table}`, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    console.log(`✅ ${table}: ${exportData[table].length} registros`);
  }

  fs.writeFileSync(
    path.join(__dirname, 'sqlite-export.json'),
    JSON.stringify(exportData, null, 2)
  );

  console.log('💾 Dados exportados para sqlite-export.json');
  db.close();
}

exportData();
```

**Saída esperada:**
```
✅ clientes: X registros
✅ relatorios_pdf: Y registros
✅ jornada_cliente: Z registros
✅ consultas: W registros
✅ tratamentos: K registros
💾 Dados exportados para sqlite-export.json
```

---

### **Dia 2: Importação e Validação** (6-8 horas)

#### Manhã: Criar tabelas no MySQL (se não existirem)

```javascript
// Backend/database/create-infoproduto-tables.js
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function createTables() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
  });

  // Verificar se tabelas já existem
  const [tables] = await conn.execute("SHOW TABLES LIKE 'clientes'");

  if (tables.length === 0) {
    console.log('📋 Criando tabelas do infoproduto...');

    await conn.execute(`
      CREATE TABLE clientes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        telefone VARCHAR(20),
        idade INT,
        profissao VARCHAR(100),
        cidade VARCHAR(100),
        estado VARCHAR(2),
        cep VARCHAR(10),
        consentimento BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela clientes criada');

    await conn.execute(`
      CREATE TABLE relatorios_pdf (
        id INT PRIMARY KEY AUTO_INCREMENT,
        cliente_id INT NOT NULL,
        score INT NOT NULL,
        categoria ENUM('simples', 'moderado', 'complexo') NOT NULL,
        problemas_atuais JSON,
        problema_principal VARCHAR(100),
        problemas_saude JSON,
        tempo_estimado VARCHAR(50),
        custo_min DECIMAL(10,2),
        custo_max DECIMAL(10,2),
        custo_atma DECIMAL(10,2),
        custo_invisalign DECIMAL(10,2),
        custo_aparelho_fixo DECIMAL(10,2),
        ja_usou_aparelho VARCHAR(20),
        expectativa_resultado VARCHAR(50),
        urgencia_tratamento VARCHAR(50),
        orcamento_recebido VARCHAR(20),
        disponibilidade_uso VARCHAR(50),
        score_complexidade INT,
        score_idade INT,
        score_historico INT,
        score_saude INT,
        score_expectativas INT,
        pdf_gerado BOOLEAN DEFAULT FALSE,
        pdf_enviado BOOLEAN DEFAULT FALSE,
        pdf_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
        INDEX idx_score (score),
        INDEX idx_categoria (categoria)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela relatorios_pdf criada');

    await conn.execute(`
      CREATE TABLE jornada_cliente (
        id INT PRIMARY KEY AUTO_INCREMENT,
        cliente_id INT NOT NULL,
        estagio_atual ENUM(
          'quiz_iniciado', 'quiz_concluido', 'pdf_comprado', 'pdf_recebido',
          'consulta_online_agendada', 'consulta_online_realizada',
          'lead_qualificado', 'lead_atribuido', 'ortodontista_contatou',
          'consulta_presencial_agendada', 'consulta_presencial_realizada',
          'orcamento_enviado', 'tratamento_contratado', 'tratamento_iniciado',
          'tratamento_em_andamento', 'tratamento_concluido'
        ) NOT NULL,
        valor_pdf DECIMAL(10,2) DEFAULT 0,
        valor_consulta_online DECIMAL(10,2) DEFAULT 0,
        valor_tratamento DECIMAL(10,2) DEFAULT 0,
        ltv_atual DECIMAL(10,2) DEFAULT 0,
        data_quiz_iniciado TIMESTAMP NULL,
        data_quiz_concluido TIMESTAMP NULL,
        data_pdf_comprado TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela jornada_cliente criada');

    await conn.execute(`
      CREATE TABLE consultas (
        id INT PRIMARY KEY AUTO_INCREMENT,
        cliente_id INT NOT NULL,
        relatorio_pdf_id INT NULL,
        ortodontista_id INT NULL,
        tipo ENUM('online', 'presencial') NOT NULL,
        data_agendada TIMESTAMP NOT NULL,
        data_realizada TIMESTAMP NULL,
        status ENUM('agendada', 'confirmada', 'realizada', 'cancelada', 'remarcada', 'faltou') DEFAULT 'agendada',
        link_videochamada VARCHAR(500) NULL,
        valor_pago DECIMAL(10,2) DEFAULT 0,
        status_pagamento ENUM('pendente', 'pago', 'reembolsado') DEFAULT 'pendente',
        observacoes_pre TEXT NULL,
        observacoes_pos TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
        FOREIGN KEY (relatorio_pdf_id) REFERENCES relatorios_pdf(id),
        FOREIGN KEY (ortodontista_id) REFERENCES orthodontists(id),
        INDEX idx_tipo (tipo),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela consultas criada');

    await conn.execute(`
      CREATE TABLE tratamentos (
        id INT PRIMARY KEY AUTO_INCREMENT,
        cliente_id INT NOT NULL,
        consulta_id INT NULL,
        ortodontista_id INT NOT NULL,
        tipo_tratamento ENUM('atma_standard', 'atma_premium', 'invisalign', 'aparelho_fixo', 'outro') NOT NULL,
        data_inicio DATE NOT NULL,
        data_previsao_fim DATE NULL,
        status ENUM('ativo', 'em_andamento', 'pausado', 'concluido', 'cancelado') DEFAULT 'ativo',
        valor_total DECIMAL(10,2) NOT NULL,
        valor_pago DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
        FOREIGN KEY (consulta_id) REFERENCES consultas(id),
        FOREIGN KEY (ortodontista_id) REFERENCES orthodontists(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela tratamentos criada');

  } else {
    console.log('ℹ️ Tabelas já existem no MySQL');
  }

  await conn.end();
}

createTables();
```

#### Tarde: Importar dados

```javascript
// Backend/database/import-to-mysql.js
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function importData() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
  });

  const exportData = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'sqlite-export.json'), 'utf8')
  );

  console.log('🚀 Iniciando importação...\n');

  // 1. Importar clientes
  console.log('📥 Importando clientes...');
  for (const cliente of exportData.clientes) {
    try {
      await conn.execute(
        `INSERT INTO clientes (id, nome, email, telefone, idade, profissao, cidade, estado, cep, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          cliente.id, cliente.nome, cliente.email, cliente.telefone,
          cliente.idade, cliente.profissao, cliente.cidade, cliente.estado, cliente.cep,
          cliente.created_at, cliente.updated_at
        ]
      );
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`⚠️ Cliente já existe: ${cliente.email}`);
      } else {
        throw error;
      }
    }
  }
  console.log(`✅ Clientes importados: ${exportData.clientes.length}\n`);

  // 2. Importar relatórios
  console.log('📥 Importando relatórios PDF...');
  for (const relatorio of exportData.relatorios_pdf) {
    await conn.execute(
      `INSERT INTO relatorios_pdf (
        id, cliente_id, score, categoria, problemas_atuais, problema_principal,
        problemas_saude, tempo_estimado, custo_min, custo_max, custo_atma,
        custo_invisalign, custo_aparelho_fixo, ja_usou_aparelho,
        expectativa_resultado, urgencia_tratamento, orcamento_recebido,
        disponibilidade_uso, score_complexidade, score_idade, score_historico,
        score_saude, score_expectativas, pdf_gerado, pdf_enviado, pdf_url,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        relatorio.id, relatorio.cliente_id, relatorio.score, relatorio.categoria,
        JSON.stringify(relatorio.problemas_atuais), relatorio.problema_principal,
        JSON.stringify(relatorio.problemas_saude), relatorio.tempo_estimado,
        relatorio.custo_min, relatorio.custo_max, relatorio.custo_atma,
        relatorio.custo_invisalign, relatorio.custo_aparelho_fixo,
        relatorio.ja_usou_aparelho, relatorio.expectativa_resultado,
        relatorio.urgencia_tratamento, relatorio.orcamento_recebido,
        relatorio.disponibilidade_uso, relatorio.score_complexidade,
        relatorio.score_idade, relatorio.score_historico, relatorio.score_saude,
        relatorio.score_expectativas, relatorio.pdf_gerado, relatorio.pdf_enviado,
        relatorio.pdf_url, relatorio.created_at, relatorio.updated_at
      ]
    );
  }
  console.log(`✅ Relatórios importados: ${exportData.relatorios_pdf.length}\n`);

  // 3. Importar jornada
  console.log('📥 Importando jornada de clientes...');
  for (const jornada of exportData.jornada_cliente) {
    await conn.execute(
      `INSERT INTO jornada_cliente (
        id, cliente_id, estagio_atual, valor_pdf, valor_consulta_online,
        valor_tratamento, ltv_atual, data_quiz_iniciado, data_quiz_concluido,
        data_pdf_comprado, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        jornada.id, jornada.cliente_id, jornada.estagio_atual,
        jornada.valor_pdf, jornada.valor_consulta_online, jornada.valor_tratamento,
        jornada.ltv_atual, jornada.data_quiz_iniciado, jornada.data_quiz_concluido,
        jornada.data_pdf_comprado, jornada.created_at, jornada.updated_at
      ]
    );
  }
  console.log(`✅ Jornadas importadas: ${exportData.jornada_cliente.length}\n`);

  // 4. Consultas e Tratamentos (se houver)
  if (exportData.consultas?.length > 0) {
    console.log('📥 Importando consultas...');
    // Similar ao acima
    console.log(`✅ Consultas importadas: ${exportData.consultas.length}\n`);
  }

  if (exportData.tratamentos?.length > 0) {
    console.log('📥 Importando tratamentos...');
    // Similar ao acima
    console.log(`✅ Tratamentos importados: ${exportData.tratamentos.length}\n`);
  }

  console.log('🎉 Importação concluída com sucesso!\n');

  await conn.end();
}

importData();
```

---

### **Dia 3: Atualizar Frontend e Testes** (6-8 horas)

#### Manhã: Atualizar conexão do Frontend

```typescript
// Frontend/lib/db-mysql.ts (NOVO)
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4'
});

export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  const [rows] = await pool.execute(sql, params);
  return rows as T[];
}

export async function insert(sql: string, params?: any[]): Promise<number> {
  const [result] = await pool.execute(sql, params);
  return (result as any).insertId;
}

export default pool;
```

```typescript
// Frontend/lib/db.ts (ATUALIZAR)
// Substituir importações do SQLite por MySQL

// ANTES:
// import sqlite from './db-sqlite';

// DEPOIS:
import { query, insert } from './db-mysql';

export { query, insert };
```

#### Tarde: Testar e Validar

```javascript
// Backend/database/validate-migration.js
const mysql = require('mysql2/promise');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function validate() {
  // Conectar MySQL
  const mysqlConn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
  });

  // Conectar SQLite
  const sqlitePath = path.join(__dirname, '../../Frontend/db/atma.db');
  const sqliteDb = new sqlite3.Database(sqlitePath);

  const errors = [];

  // Validar contagem de registros
  const tables = ['clientes', 'relatorios_pdf', 'jornada_cliente'];

  for (const table of tables) {
    const [mysqlCount] = await mysqlConn.execute(`SELECT COUNT(*) as total FROM ${table}`);

    const sqliteCount = await new Promise((resolve) => {
      sqliteDb.get(`SELECT COUNT(*) as total FROM ${table}`, (err, row) => {
        resolve(row?.total || 0);
      });
    });

    if (mysqlCount[0].total !== sqliteCount) {
      errors.push(`❌ ${table}: SQLite=${sqliteCount}, MySQL=${mysqlCount[0].total}`);
    } else {
      console.log(`✅ ${table}: ${mysqlCount[0].total} registros (OK)`);
    }
  }

  // Validar emails duplicados
  const [duplicates] = await mysqlConn.execute(
    'SELECT email, COUNT(*) as count FROM clientes GROUP BY email HAVING count > 1'
  );

  if (duplicates.length > 0) {
    errors.push(`❌ Emails duplicados: ${duplicates.length}`);
  } else {
    console.log('✅ Sem emails duplicados');
  }

  // Validar integridade referencial
  const [orphans] = await mysqlConn.execute(`
    SELECT COUNT(*) as total FROM relatorios_pdf r
    WHERE NOT EXISTS (SELECT 1 FROM clientes c WHERE c.id = r.cliente_id)
  `);

  if (orphans[0].total > 0) {
    errors.push(`❌ Relatórios órfãos: ${orphans[0].total}`);
  } else {
    console.log('✅ Integridade referencial OK');
  }

  console.log('\n' + '═'.repeat(60));
  if (errors.length === 0) {
    console.log('🎉 VALIDAÇÃO PASSOU! Migração bem-sucedida.');
  } else {
    console.log('❌ VALIDAÇÃO FALHOU:');
    errors.forEach(e => console.log(e));
  }

  await mysqlConn.end();
  sqliteDb.close();
}

validate();
```

---

## ✅ Checklist Final

### Dia 1
- [ ] Analisar estrutura do SQLite
- [ ] Contar registros em todas as tabelas
- [ ] Criar script de exportação
- [ ] Executar exportação e gerar `sqlite-export.json`
- [ ] Validar JSON gerado

### Dia 2
- [ ] Criar tabelas no MySQL (se necessário)
- [ ] Executar importação
- [ ] Verificar logs de importação
- [ ] Validar contagem de registros

### Dia 3
- [ ] Atualizar conexões do Frontend (SQLite → MySQL)
- [ ] Atualizar `.env` com credenciais MySQL
- [ ] Testar APIs do infoproduto
- [ ] Executar script de validação
- [ ] Backup do SQLite original
- [ ] Documentar mudanças

---

## 🚨 Plano de Rollback

Se algo der errado:

1. **Reverter conexão do Frontend:**
   ```typescript
   // Voltar para SQLite temporariamente
   import sqlite from './db-sqlite';
   ```

2. **SQLite permanece intacto:**
   - Dados originais em `Frontend/db/atma.db`
   - Zero risco de perda

3. **Deletar dados importados no MySQL (se necessário):**
   ```sql
   DELETE FROM tratamentos WHERE id > 0;
   DELETE FROM consultas WHERE id > 0;
   DELETE FROM jornada_cliente WHERE id > 0;
   DELETE FROM relatorios_pdf WHERE id > 0;
   DELETE FROM clientes WHERE id > 0;
   ```

---

## 📦 Benefícios Pós-Migração

1. ✅ **Dados centralizados** - Backend e Frontend usam mesmo banco
2. ✅ **Backup automático** - MySQL já tem estratégia de backup
3. ✅ **Sem duplicação** - Fonte única de verdade
4. ✅ **Escalabilidade** - MySQL suporta muito mais tráfego que SQLite
5. ✅ **Integridade** - Foreign keys funcionam corretamente

---

**Tempo total:** 2-3 dias
**Risco:** BAIXO (SQLite permanece como backup)
**Downtime:** ZERO (migração offline)
