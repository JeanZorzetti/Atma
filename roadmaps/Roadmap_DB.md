# 🗺️ Roadmap: Migração Segura para Banco Unificado

**Opção escolhida:** Opção 1 - Unificação Completa (Single Database)
**Estratégia:** Migração Segura com ZERO risco de perda de dados
**Duração estimada:** 20 dias úteis
**ROI esperado:** 6 meses

---

## 📋 Índice

1. [Preparação (Dias 1-3)](#fase-1-preparação-dias-1-3)
2. [Desenvolvimento (Dias 4-11)](#fase-2-desenvolvimento-dias-4-11)
3. [Testes (Dias 12-15)](#fase-3-testes-dias-12-15)
4. [Migração (Dias 16-18)](#fase-4-migração-dias-16-18)
5. [Validação e Rollout (Dias 19-20)](#fase-5-validação-e-rollout-dias-19-20)
6. [Checklist de Segurança](#checklist-de-segurança)

---

## 🛡️ Princípios de Segurança

### ✅ Garantias:
1. **NUNCA deletar dados originais antes de validar 100%**
2. **SEMPRE ter backups antes de qualquer operação**
3. **SEMPRE testar em staging antes de produção**
4. **SEMPRE ter plano de rollback pronto**
5. **SEMPRE rodar sistemas em paralelo (1-2 semanas)**

### ❌ Proibições:
1. ❌ Sobrescrever bancos existentes
2. ❌ Deletar dados sem confirmação tripla
3. ❌ Migrar direto em produção
4. ❌ Fazer mudanças irreversíveis sem backup

---

## 🎯 Fase 1: Preparação (Dias 1-3)

### 📅 Dia 1: Análise e Planejamento

**Objetivos:**
- [ ] Mapear todos os dados existentes
- [ ] Identificar conflitos potenciais
- [ ] Definir estratégia de merge

**Tarefas:**

1. **Análise de Dados**
```bash
# Contar registros em cada banco
cd Backend
node -e "
const mysql = require('mysql2/promise');

(async () => {
  // CRM
  const crm = await mysql.createConnection({
    host: process.env.DB_HOST_CRM,
    user: process.env.DB_USER_CRM,
    password: process.env.DB_PASSWORD_CRM,
    database: 'atma_crm'
  });

  const [crmClientes] = await crm.execute('SELECT COUNT(*) as total FROM clientes');
  const [crmRelatorios] = await crm.execute('SELECT COUNT(*) as total FROM relatorios');

  console.log('📊 CRM Database:');
  console.log('  Clientes:', crmClientes[0].total);
  console.log('  Relatórios:', crmRelatorios[0].total);

  // Backend
  const backend = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'atma_aligner'
  });

  const [backendLeads] = await backend.execute('SELECT COUNT(*) as total FROM patient_leads');
  const [backendOrtho] = await backend.execute('SELECT COUNT(*) as total FROM orthodontists');

  console.log('📊 Backend Database:');
  console.log('  Patient Leads:', backendLeads[0].total);
  console.log('  Orthodontists:', backendOrtho[0].total);

  await crm.end();
  await backend.end();
})();
"
```

2. **Identificar Emails Duplicados**
```sql
-- Emails que existem em AMBOS os bancos
SELECT
  c.email,
  c.nome as nome_crm,
  pl.nome as nome_backend,
  c.created_at as criado_crm,
  pl.created_at as criado_backend
FROM atma_crm.clientes c
INNER JOIN atma_aligner.patient_leads pl ON c.email = pl.email;
```

3. **Criar Documento de Mapeamento**
```markdown
# Mapeamento de Dados

## Tabela: clientes
- CRM: clientes (X registros)
- Backend: patient_leads (Y registros)
- Duplicados: Z registros (mesmo email)

## Estratégia de Merge:
- Se email duplicado → Manter dados mais completos
- CRM tem: idade, profissao, cidade, estado
- Backend tem: cep, ortodontista_id, status
- **Decisão:** Combinar ambos (campos complementares)
```

**Entregáveis:**
- ✅ Relatório de análise de dados (`docs/analise-dados-migracao.md`)
- ✅ Lista de conflitos identificados
- ✅ Estratégia de resolução de conflitos

---

### 📅 Dia 2: Backups e Ambiente de Staging

**Objetivos:**
- [ ] Criar backups completos de produção
- [ ] Configurar ambiente de staging
- [ ] Testar restauração de backups

**Tarefas:**

1. **Backup Completo de Produção**
```bash
# Criar diretório de backups
mkdir -p ~/backups/atma-migration-2025
cd ~/backups/atma-migration-2025

# Backup CRM
mysqldump \
  -h $DB_HOST_CRM \
  -u $DB_USER_CRM \
  -p$DB_PASSWORD_CRM \
  --databases atma_crm \
  --single-transaction \
  --routines \
  --triggers \
  --events \
  --add-drop-database \
  > atma_crm_backup_$(date +%Y%m%d_%H%M%S).sql

# Backup Backend
mysqldump \
  -h $DB_HOST \
  -u $DB_USER \
  -p$DB_PASSWORD \
  --databases atma_aligner \
  --single-transaction \
  --routines \
  --triggers \
  --events \
  --add-drop-database \
  > atma_aligner_backup_$(date +%Y%m%d_%H%M%S).sql

# Comprimir backups
gzip atma_crm_backup_*.sql
gzip atma_aligner_backup_*.sql

# Verificar tamanho
ls -lh *.sql.gz

# Upload para backup externo (S3/Google Drive)
# aws s3 cp . s3://atma-backups/migration-2025/ --recursive
```

2. **Testar Restauração de Backups**
```bash
# Criar database temporário para teste
mysql -h localhost -u root -p -e "CREATE DATABASE test_restore_crm;"

# Restaurar backup
gunzip -c atma_crm_backup_*.sql.gz | mysql -h localhost -u root -p test_restore_crm

# Verificar integridade
mysql -h localhost -u root -p test_restore_crm -e "
  SELECT COUNT(*) as total FROM clientes;
  SELECT COUNT(*) as total FROM relatorios;
"

# Limpar
mysql -h localhost -u root -p -e "DROP DATABASE test_restore_crm;"
```

3. **Configurar Ambiente de Staging**
```bash
# No Easypanel ou servidor de staging
# Criar 3 databases:
# - atma_crm_staging (cópia de produção)
# - atma_aligner_staging (cópia de produção)
# - atma_unified_staging (novo banco unificado)

mysql -h staging-host -u root -p -e "
  CREATE DATABASE atma_crm_staging CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  CREATE DATABASE atma_aligner_staging CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  CREATE DATABASE atma_unified_staging CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
"

# Restaurar backups em staging
gunzip -c atma_crm_backup_*.sql.gz | mysql -h staging-host -u root -p atma_crm_staging
gunzip -c atma_aligner_backup_*.sql.gz | mysql -h staging-host -u root -p atma_aligner_staging
```

**Entregáveis:**
- ✅ Backups em `~/backups/atma-migration-2025/` (+ S3)
- ✅ Ambiente de staging configurado
- ✅ Testes de restauração documentados

---

### 📅 Dia 3: Design do Schema Unificado

**Objetivos:**
- [ ] Criar schema SQL completo do `atma_unified`
- [ ] Validar foreign keys e índices
- [ ] Documentar mudanças

**Tarefas:**

1. **Criar Schema SQL**
```bash
# Arquivo: Backend/database/unified_schema.sql
# (Baseado no schema da Opção 1 do ANALISE_DATABASES.md)
```

2. **Aplicar em Staging**
```bash
cd Backend/database
mysql -h staging-host -u root -p atma_unified_staging < unified_schema.sql

# Verificar tabelas criadas
mysql -h staging-host -u root -p atma_unified_staging -e "SHOW TABLES;"
```

3. **Documentar Estrutura**
```bash
# Gerar diagrama ER
mysqldump -h staging-host -u root -p --no-data atma_unified_staging > unified_structure.sql

# Usar ferramenta de visualização (opcional)
# dbdiagram.io ou MySQL Workbench
```

**Entregáveis:**
- ✅ `Backend/database/unified_schema.sql`
- ✅ Schema aplicado em staging
- ✅ Documentação de tabelas (`docs/schema-unificado.md`)

---

## 🔧 Fase 2: Desenvolvimento (Dias 4-11)

### 📅 Dia 4-7: Script de Migração de Dados

**Objetivos:**
- [ ] Criar script que copia dados de CRM + Backend → Unified
- [ ] Lidar com conflitos (emails duplicados)
- [ ] Validar integridade referencial

**Tarefas:**

**Arquivo:** `Backend/database/migrate-to-unified.js`

```javascript
const mysql = require('mysql2/promise');
const { logger } = require('../src/utils/logger');

// Carregar variáveis de ambiente
require('dotenv').config();

const crmConfig = {
  host: process.env.DB_HOST_CRM,
  user: process.env.DB_USER_CRM,
  password: process.env.DB_PASSWORD_CRM,
  database: 'atma_crm_staging', // IMPORTANTE: Usar staging primeiro
  charset: 'utf8mb4'
};

const backendConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'atma_aligner_staging',
  charset: 'utf8mb4'
};

const unifiedConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'atma_unified_staging',
  charset: 'utf8mb4'
};

async function migrateToUnified() {
  let crmConn, backendConn, unifiedConn;

  try {
    // Conectar aos 3 bancos
    logger.info('🔌 Conectando aos bancos de dados...');
    crmConn = await mysql.createConnection(crmConfig);
    backendConn = await mysql.createConnection(backendConfig);
    unifiedConn = await mysql.createConnection(unifiedConfig);

    logger.info('✅ Conexões estabelecidas');

    // ============================================
    // PASSO 1: Migrar Ortodontistas (Backend → Unified)
    // ============================================
    logger.info('👨‍⚕️ Migrando ortodontistas...');
    const [orthodontists] = await backendConn.execute('SELECT * FROM orthodontists');

    for (const ortho of orthodontists) {
      await unifiedConn.execute(`
        INSERT INTO ortodontistas (
          id, nome, clinica, cro, email, telefone,
          endereco_completo, cep, cidade, estado,
          modelo_parceria, status, data_inicio, data_fim,
          tem_scanner, scanner_marca, capacidade_mensal,
          comissao_percentual, valor_lab_fee,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        ortho.id, ortho.nome, ortho.clinica, ortho.cro, ortho.email, ortho.telefone,
        ortho.endereco_completo, ortho.cep, ortho.cidade, ortho.estado,
        ortho.modelo_parceria, ortho.status, ortho.data_inicio, ortho.data_fim,
        ortho.tem_scanner, ortho.scanner_marca, ortho.capacidade_mensal,
        ortho.comissao_percentual, ortho.valor_lab_fee,
        ortho.created_at, ortho.updated_at
      ]);
    }

    logger.info(`✅ ${orthodontists.length} ortodontistas migrados`);

    // ============================================
    // PASSO 2: Migrar Clientes (CRM + Backend → Unified)
    // ============================================
    logger.info('👥 Migrando clientes...');

    // 2.1: Clientes do CRM (origem: infoproduto)
    const [crmClientes] = await crmConn.execute('SELECT * FROM clientes');

    for (const cliente of crmClientes) {
      // Verificar se email já existe no Backend
      const [backendLead] = await backendConn.execute(
        'SELECT * FROM patient_leads WHERE email = ?',
        [cliente.email]
      );

      let ortodontista_id = null;

      if (backendLead.length > 0) {
        // Email duplicado: Cliente está em AMBOS os sistemas
        logger.info(`🔄 Email duplicado encontrado: ${cliente.email}`);
        ortodontista_id = backendLead[0].ortodontista_id;

        // Inserir como 'ambos'
        await unifiedConn.execute(`
          INSERT INTO clientes (
            nome, email, telefone, cep, cidade, estado,
            idade, profissao,
            origem, tipo_cliente,
            ortodontista_atribuido_id,
            consentimento_marketing, consentimento_compartilhamento,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          cliente.nome,
          cliente.email,
          cliente.telefone || backendLead[0].telefone,
          backendLead[0].cep || '',
          cliente.cidade,
          cliente.estado,
          cliente.idade,
          cliente.profissao,
          'ambos', // Existe em CRM e Backend
          'b2c_lead',
          ortodontista_id,
          true, // Consentimento (já fez quiz)
          true,
          cliente.created_at,
          cliente.updated_at
        ]);

      } else {
        // Cliente só existe no CRM
        await unifiedConn.execute(`
          INSERT INTO clientes (
            nome, email, telefone, cep, cidade, estado,
            idade, profissao,
            origem, tipo_cliente,
            ortodontista_atribuido_id,
            consentimento_marketing, consentimento_compartilhamento,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          cliente.nome,
          cliente.email,
          cliente.telefone,
          '', // CRM não tem CEP
          cliente.cidade,
          cliente.estado,
          cliente.idade,
          cliente.profissao,
          'infoproduto',
          'b2c_infoproduto',
          null,
          true,
          false,
          cliente.created_at,
          cliente.updated_at
        ]);
      }
    }

    logger.info(`✅ ${crmClientes.length} clientes do CRM migrados`);

    // 2.2: Clientes do Backend que NÃO estão no CRM
    const [backendLeads] = await backendConn.execute('SELECT * FROM patient_leads');

    for (const lead of backendLeads) {
      // Verificar se já foi inserido (estava no CRM)
      const [existe] = await unifiedConn.execute(
        'SELECT id FROM clientes WHERE email = ?',
        [lead.email]
      );

      if (existe.length === 0) {
        // Lead só existe no Backend (formulário "Encontre um Doutor")
        await unifiedConn.execute(`
          INSERT INTO clientes (
            nome, email, telefone, cep,
            origem, tipo_cliente,
            ortodontista_atribuido_id,
            consentimento_marketing, consentimento_compartilhamento,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          lead.nome,
          lead.email,
          lead.telefone,
          lead.cep,
          'encontre_doutor',
          'b2c_lead',
          lead.ortodontista_id,
          lead.consentimento,
          lead.consentimento,
          lead.created_at,
          lead.updated_at
        ]);
      }
    }

    logger.info(`✅ Clientes do Backend migrados`);

    // ============================================
    // PASSO 3: Migrar Relatórios PDF (CRM → Unified)
    // ============================================
    logger.info('📄 Migrando relatórios PDF...');
    const [relatorios] = await crmConn.execute('SELECT * FROM relatorios');

    for (const rel of relatorios) {
      // Buscar cliente_id no unified pelo email
      const [crmCliente] = await crmConn.execute(
        'SELECT email FROM clientes WHERE id = ?',
        [rel.cliente_id]
      );

      if (crmCliente.length > 0) {
        const [unifiedCliente] = await unifiedConn.execute(
          'SELECT id FROM clientes WHERE email = ?',
          [crmCliente[0].email]
        );

        if (unifiedCliente.length > 0) {
          await unifiedConn.execute(`
            INSERT INTO relatorios_pdf (
              cliente_id, score, categoria,
              problemas_atuais, problema_principal, problemas_saude,
              tempo_estimado, custo_min, custo_max,
              custo_atma, custo_invisalign, custo_aparelho_fixo,
              ja_usou_aparelho, expectativa_resultado, urgencia_tratamento,
              orcamento_recebido, disponibilidade_uso,
              score_complexidade, score_idade, score_historico, score_saude, score_expectativas,
              pdf_gerado, pdf_enviado, pdf_url,
              created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            unifiedCliente[0].id,
            rel.score,
            rel.categoria,
            JSON.stringify(rel.problemas_atuais),
            rel.problema_principal,
            JSON.stringify(rel.problemas_saude),
            rel.tempo_estimado,
            rel.custo_min,
            rel.custo_max,
            rel.custo_atma,
            rel.custo_invisalign,
            rel.custo_aparelho_fixo,
            rel.ja_usou_aparelho,
            rel.expectativa_resultado,
            rel.urgencia_tratamento,
            rel.orcamento_recebido,
            rel.disponibilidade_uso,
            rel.score_complexidade,
            rel.score_idade,
            rel.score_historico,
            rel.score_saude,
            rel.score_expectativas,
            rel.pdf_gerado,
            rel.pdf_enviado,
            rel.pdf_url,
            rel.created_at,
            rel.updated_at
          ]);
        }
      }
    }

    logger.info(`✅ ${relatorios.length} relatórios PDF migrados`);

    // ============================================
    // PASSO 4: Validação de Contagens
    // ============================================
    logger.info('🔍 Validando contagens...');

    const [crmCount] = await crmConn.execute('SELECT COUNT(*) as total FROM clientes');
    const [backendCount] = await backendConn.execute('SELECT COUNT(*) as total FROM patient_leads');
    const [unifiedCount] = await unifiedConn.execute('SELECT COUNT(*) as total FROM clientes');

    logger.info(`📊 Contagens:`);
    logger.info(`  CRM Clientes: ${crmCount[0].total}`);
    logger.info(`  Backend Leads: ${backendCount[0].total}`);
    logger.info(`  Unified Clientes: ${unifiedCount[0].total}`);

    // A contagem unified deve ser >= max(crm, backend)
    // e <= crm + backend (devido a duplicados)

    logger.info('✅ Migração concluída com sucesso!');

  } catch (error) {
    logger.error('❌ Erro durante migração:', error);
    throw error;
  } finally {
    if (crmConn) await crmConn.end();
    if (backendConn) await backendConn.end();
    if (unifiedConn) await unifiedConn.end();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  (async () => {
    try {
      await migrateToUnified();
      process.exit(0);
    } catch (error) {
      logger.error('❌ Migração falhou:', error);
      process.exit(1);
    }
  })();
}

module.exports = { migrateToUnified };
```

**Entregáveis:**
- ✅ `Backend/database/migrate-to-unified.js`
- ✅ Script testado em staging
- ✅ Logs de migração documentados

---

### 📅 Dia 8-11: Atualizar Código da Aplicação

**Objetivos:**
- [ ] Criar novos repositories para `atma_unified`
- [ ] Atualizar APIs para usar novo banco
- [ ] Manter compatibilidade com bancos antigos (rodar em paralelo)

**Tarefas:**

1. **Criar Novo Connection Pool**

**Arquivo:** `Backend/src/db/unified-pool.js`

```javascript
const mysql = require('mysql2/promise');
const { logger } = require('../utils/logger');

const unifiedPool = mysql.createPool({
  host: process.env.DB_UNIFIED_HOST || process.env.DB_HOST,
  user: process.env.DB_UNIFIED_USER || process.env.DB_USER,
  password: process.env.DB_UNIFIED_PASSWORD || process.env.DB_PASSWORD,
  database: process.env.DB_UNIFIED_NAME || 'atma_unified',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

// Testar conexão
unifiedPool.getConnection()
  .then(conn => {
    logger.info('✅ Unified database connection pool criado');
    conn.release();
  })
  .catch(err => {
    logger.error('❌ Erro ao conectar ao unified database:', err);
  });

module.exports = unifiedPool;
```

2. **Criar Repositories Unificados**

**Arquivo:** `Backend/src/repositories/cliente-repository.js`

```javascript
const unifiedPool = require('../db/unified-pool');
const { logger } = require('../utils/logger');

class ClienteRepository {

  // Buscar cliente por email
  async findByEmail(email) {
    const [rows] = await unifiedPool.execute(
      'SELECT * FROM clientes WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  }

  // Criar cliente
  async create(clienteData) {
    const {
      nome, email, telefone, cep, cidade, estado,
      idade, profissao, origem, tipo_cliente
    } = clienteData;

    const [result] = await unifiedPool.execute(`
      INSERT INTO clientes (
        nome, email, telefone, cep, cidade, estado,
        idade, profissao, origem, tipo_cliente,
        consentimento_marketing, consentimento_compartilhamento
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      nome, email, telefone, cep, cidade, estado,
      idade, profissao, origem, tipo_cliente,
      true, true
    ]);

    return result.insertId;
  }

  // Listar todos
  async findAll(filters = {}) {
    let query = 'SELECT * FROM clientes WHERE 1=1';
    const params = [];

    if (filters.origem) {
      query += ' AND origem = ?';
      params.push(filters.origem);
    }

    if (filters.tipo_cliente) {
      query += ' AND tipo_cliente = ?';
      params.push(filters.tipo_cliente);
    }

    query += ' ORDER BY created_at DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }

    const [rows] = await unifiedPool.execute(query, params);
    return rows;
  }

  // Buscar com jornada completa
  async findWithJourney(clienteId) {
    const [cliente] = await unifiedPool.execute(
      'SELECT * FROM clientes WHERE id = ?',
      [clienteId]
    );

    if (!cliente[0]) return null;

    // Buscar relatórios PDF
    const [relatorios] = await unifiedPool.execute(
      'SELECT * FROM relatorios_pdf WHERE cliente_id = ? ORDER BY created_at DESC',
      [clienteId]
    );

    // Buscar consultas
    const [consultas] = await unifiedPool.execute(
      'SELECT * FROM consultas WHERE cliente_id = ? ORDER BY data_agendada DESC',
      [clienteId]
    );

    // Buscar jornada
    const [jornada] = await unifiedPool.execute(
      'SELECT * FROM jornada_cliente WHERE cliente_id = ?',
      [clienteId]
    );

    return {
      ...cliente[0],
      relatorios,
      consultas,
      jornada: jornada[0] || null
    };
  }
}

module.exports = new ClienteRepository();
```

3. **Atualizar APIs (com Feature Flag)**

**Arquivo:** `Backend/src/routes/cliente-routes.js`

```javascript
const express = require('express');
const router = express.Router();
const clienteRepository = require('../repositories/cliente-repository');
const { logger } = require('../utils/logger');

// Feature flag (usar unified ou bancos antigos)
const USE_UNIFIED = process.env.USE_UNIFIED_DB === 'true';

router.get('/clientes', async (req, res) => {
  try {
    if (USE_UNIFIED) {
      // Usar banco unificado
      const clientes = await clienteRepository.findAll(req.query);
      return res.json({ success: true, data: clientes });
    } else {
      // Usar bancos antigos (fallback)
      // ... código antigo
    }
  } catch (error) {
    logger.error('Erro ao buscar clientes:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/clientes/:email', async (req, res) => {
  try {
    if (USE_UNIFIED) {
      const cliente = await clienteRepository.findByEmail(req.params.email);

      if (!cliente) {
        return res.status(404).json({ success: false, error: 'Cliente não encontrado' });
      }

      return res.json({ success: true, data: cliente });
    } else {
      // Usar bancos antigos
      // ... código antigo
    }
  } catch (error) {
    logger.error('Erro ao buscar cliente:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
```

**Entregáveis:**
- ✅ Repositories unificados criados
- ✅ APIs atualizadas com feature flag
- ✅ Testes unitários dos repositories

---

## 🧪 Fase 3: Testes (Dias 12-15)

### 📅 Dia 12-13: Testes em Staging

**Objetivos:**
- [ ] Executar migração em staging
- [ ] Validar 100% dos dados
- [ ] Testar todas as APIs

**Tarefas:**

1. **Executar Migração em Staging**
```bash
cd Backend
USE_UNIFIED_DB=false node database/migrate-to-unified.js

# Logs esperados:
# ✅ X ortodontistas migrados
# ✅ Y clientes do CRM migrados
# ✅ Z relatórios PDF migrados
# ✅ Migração concluída com sucesso!
```

2. **Script de Validação**

**Arquivo:** `Backend/database/validate-migration.js`

```javascript
const mysql = require('mysql2/promise');
const { logger } = require('../src/utils/logger');

async function validateMigration() {
  const crmConn = await mysql.createConnection({ /* config */ });
  const backendConn = await mysql.createConnection({ /* config */ });
  const unifiedConn = await mysql.createConnection({ /* config */ });

  const errors = [];

  // 1. Validar contagens
  const [crmCount] = await crmConn.execute('SELECT COUNT(*) as total FROM clientes');
  const [unifiedCRMCount] = await unifiedConn.execute(
    'SELECT COUNT(*) as total FROM clientes WHERE origem IN ("infoproduto", "ambos")'
  );

  if (crmCount[0].total > unifiedCRMCount[0].total) {
    errors.push(`Faltam clientes do CRM: ${crmCount[0].total} → ${unifiedCRMCount[0].total}`);
  }

  // 2. Validar emails duplicados foram tratados
  const [duplicates] = await unifiedConn.execute(
    'SELECT email, COUNT(*) as count FROM clientes GROUP BY email HAVING count > 1'
  );

  if (duplicates.length > 0) {
    errors.push(`Emails duplicados no unified: ${duplicates.length}`);
  }

  // 3. Validar foreign keys
  const [orphanRelatorios] = await unifiedConn.execute(`
    SELECT COUNT(*) as total
    FROM relatorios_pdf r
    LEFT JOIN clientes c ON r.cliente_id = c.id
    WHERE c.id IS NULL
  `);

  if (orphanRelatorios[0].total > 0) {
    errors.push(`Relatórios órfãos (sem cliente): ${orphanRelatorios[0].total}`);
  }

  // 4. Validar dados específicos (spot check)
  const [sampleCRM] = await crmConn.execute('SELECT * FROM clientes LIMIT 10');

  for (const cliente of sampleCRM) {
    const [unified] = await unifiedConn.execute(
      'SELECT * FROM clientes WHERE email = ?',
      [cliente.email]
    );

    if (unified.length === 0) {
      errors.push(`Cliente do CRM não migrado: ${cliente.email}`);
    } else {
      // Validar campos
      if (unified[0].nome !== cliente.nome) {
        errors.push(`Nome diferente para ${cliente.email}`);
      }
    }
  }

  // Relatório
  if (errors.length > 0) {
    logger.error('❌ Validação FALHOU:');
    errors.forEach(err => logger.error(`  - ${err}`));
    return false;
  } else {
    logger.info('✅ Validação PASSOU! Todos os dados migrados corretamente.');
    return true;
  }
}

validateMigration();
```

3. **Testes de API**
```bash
# Ativar unified em staging
export USE_UNIFIED_DB=true

# Rodar servidor
npm run dev

# Testar endpoints
curl http://localhost:5000/api/clientes?limit=10
curl http://localhost:5000/api/clientes/test@example.com
```

**Entregáveis:**
- ✅ Migração executada em staging
- ✅ 100% dos dados validados
- ✅ Todas as APIs testadas

---

### 📅 Dia 14-15: Testes de Performance e Carga

**Objetivos:**
- [ ] Comparar performance (antigo vs unificado)
- [ ] Testar sob carga
- [ ] Otimizar queries lentas

**Tarefas:**

1. **Benchmark de Queries**
```sql
-- Query antiga (2 bancos):
-- SELECT FROM atma_crm.clientes + SELECT FROM atma_aligner.patient_leads
-- Tempo: ~250ms

-- Query nova (1 banco):
SELECT * FROM atma_unified.clientes WHERE email = 'test@example.com';
-- Tempo esperado: ~50ms (5x mais rápido)

-- Query de analytics:
SELECT
  origem,
  COUNT(*) as total,
  AVG(CASE WHEN jornada.ltv_atual IS NOT NULL THEN jornada.ltv_atual END) as ltv_medio
FROM clientes c
LEFT JOIN jornada_cliente jornada ON jornada.cliente_id = c.id
GROUP BY origem;
-- Tempo esperado: ~100ms (antes precisava de joins entre bancos)
```

2. **Teste de Carga (Apache Bench)**
```bash
# 1000 requests, 100 concorrentes
ab -n 1000 -c 100 http://staging-host/api/clientes?limit=50

# Resultados esperados:
# - Requests per second: > 100
# - Time per request: < 100ms (média)
# - Failed requests: 0
```

**Entregáveis:**
- ✅ Relatório de performance
- ✅ Queries otimizadas (se necessário)
- ✅ Índices adicionados (se necessário)

---

## 🚀 Fase 4: Migração (Dias 16-18)

### 📅 Dia 16: Preparação Final e Backup

**Objetivos:**
- [ ] Backup final de produção
- [ ] Comunicar downtime (se necessário)
- [ ] Preparar plano de rollback

**Tarefas:**

1. **Backup Final**
```bash
# MESMO PROCEDIMENTO DO DIA 2, MAS COM PRODUÇÃO
cd ~/backups/atma-migration-final-2025

mysqldump atma_crm > crm_final_$(date +%Y%m%d_%H%M%S).sql
mysqldump atma_aligner > aligner_final_$(date +%Y%m%d_%H%M%S).sql

gzip *.sql
# Upload para S3
```

2. **Plano de Rollback**
```markdown
# Plano de Rollback

## Se algo der errado durante migração:

1. Parar aplicação
2. Dropar atma_unified
3. Restaurar backups originais
4. Desativar feature flag (USE_UNIFIED_DB=false)
5. Reiniciar aplicação com bancos antigos

## Tempo estimado de rollback: 15 minutos
```

3. **Comunicação**
```
Enviar email/mensagem para equipe:

"🚀 Migração do Banco de Dados Agendada

Data: [Dia 17 - Sábado]
Horário: 2:00 AM - 6:00 AM (horário de menor tráfego)
Downtime esperado: 30-60 minutos

O que vai acontecer:
- Migração dos dados para banco unificado
- Sistema ficará em modo de manutenção por ~30min
- Após migração, tudo volta ao normal (mais rápido!)

Plano de contingência:
- Backups completos feitos
- Rollback em 15min se necessário
- Equipe de plantão 24h"
```

**Entregáveis:**
- ✅ Backups finais
- ✅ Plano de rollback documentado
- ✅ Equipe comunicada

---

### 📅 Dia 17: Execução da Migração (Produção)

**Objetivos:**
- [ ] Executar migração em produção
- [ ] Validar dados
- [ ] Ativar banco unificado

**Tarefas:**

**CRONOGRAMA (Sábado 2:00 AM):**

```
02:00 - Parar aplicação (modo manutenção)
02:05 - Criar atma_unified em produção
02:10 - Executar migrate-to-unified.js (15-30min)
02:40 - Executar validate-migration.js
02:50 - Ativar USE_UNIFIED_DB=true
03:00 - Reiniciar aplicação
03:05 - Testes manuais (smoke tests)
03:15 - Monitorar logs (30min)
03:45 - Liberar acesso público
04:00 - Migração concluída ✅
```

**Comandos:**

```bash
# 1. Modo manutenção
# (via Easypanel ou criar página manutenção.html)

# 2. Criar atma_unified
mysql -h prod-host -u root -p -e "
  CREATE DATABASE atma_unified CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
"

# 3. Aplicar schema
mysql -h prod-host -u root -p atma_unified < Backend/database/unified_schema.sql

# 4. Migrar dados
node Backend/database/migrate-to-unified.js

# 5. Validar
node Backend/database/validate-migration.js

# 6. Se validação PASSOU:
echo "USE_UNIFIED_DB=true" >> .env.production
pm2 restart atma-backend

# 7. Testar
curl https://api.atma.com.br/clientes?limit=10
curl https://api.atma.com.br/clientes/test@example.com

# 8. Remover modo manutenção
```

**Entregáveis:**
- ✅ Migração executada em produção
- ✅ Validação 100% passou
- ✅ Sistema online com unified

---

### 📅 Dia 18: Monitoramento Intensivo

**Objetivos:**
- [ ] Monitorar logs por 24h
- [ ] Verificar métricas de erro
- [ ] Ajustar se necessário

**Tarefas:**

1. **Dashboards de Monitoramento**
```javascript
// Adicionar métricas de uso de DB
const prometheus = require('prom-client');

const dbQueryCounter = new prometheus.Counter({
  name: 'db_queries_total',
  help: 'Total de queries ao banco unificado',
  labelNames: ['table', 'operation']
});

const dbQueryDuration = new prometheus.Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duração das queries',
  labelNames: ['table']
});

// Instrumentar queries
unifiedPool.on('query', (query) => {
  dbQueryCounter.inc({ table: query.table, operation: query.op });
  // ...
});
```

2. **Alertas**
```yaml
# alerts.yml (Prometheus/Grafana)
- alert: HighDatabaseErrorRate
  expr: rate(db_errors_total[5m]) > 0.1
  annotations:
    summary: "Taxa de erros no banco unificado está alta"

- alert: SlowQueries
  expr: histogram_quantile(0.95, db_query_duration_seconds) > 1
  annotations:
    summary: "95% das queries levam mais de 1s"
```

**Entregáveis:**
- ✅ Monitoramento 24h completo
- ✅ Nenhum erro crítico detectado
- ✅ Performance dentro do esperado

---

## ✅ Fase 5: Validação e Rollout (Dias 19-20)

### 📅 Dia 19: Rodar em Paralelo (Dual Mode)

**Objetivos:**
- [ ] Unified ativo em produção
- [ ] Bancos antigos ainda disponíveis (read-only)
- [ ] Comparar resultados

**Tarefas:**

1. **Modo Dual (Escrever no Unified, Ler de ambos para comparar)**
```javascript
// Comparação de integridade
async function compareResults(email) {
  const [unifiedResult] = await unifiedPool.execute(
    'SELECT * FROM clientes WHERE email = ?',
    [email]
  );

  const [crmResult] = await crmPool.execute(
    'SELECT * FROM clientes WHERE email = ?',
    [email]
  );

  if (JSON.stringify(unifiedResult) !== JSON.stringify(crmResult)) {
    logger.warn(`Divergência detectada para ${email}`);
    // Investigar
  }
}
```

2. **Logging de Divergências**
```javascript
// Se encontrar divergências, logar para análise
const divergencias = [];

setInterval(async () => {
  const [emails] = await unifiedPool.execute(
    'SELECT email FROM clientes ORDER BY RAND() LIMIT 100'
  );

  for (const { email } of emails) {
    await compareResults(email);
  }
}, 60000); // A cada 1 minuto
```

**Entregáveis:**
- ✅ Sistema rodando em dual mode
- ✅ Nenhuma divergência detectada
- ✅ Confiança de 100% no unified

---

### 📅 Dia 20: Desativar Bancos Antigos (Soft Delete)

**Objetivos:**
- [ ] Tornar bancos antigos read-only
- [ ] Manter por 30 dias como backup
- [ ] Documentar processo completo

**Tarefas:**

1. **Tornar Read-Only**
```sql
-- Produção
GRANT SELECT ON atma_crm.* TO 'app_user'@'%';
REVOKE INSERT, UPDATE, DELETE ON atma_crm.* FROM 'app_user'@'%';

GRANT SELECT ON atma_aligner.* TO 'app_user'@'%';
REVOKE INSERT, UPDATE, DELETE ON atma_aligner.* FROM 'app_user'@'%';
```

2. **Remover Feature Flag**
```bash
# .env.production
# USE_UNIFIED_DB=true  # Não precisa mais, é padrão

# Remover código de fallback
# Limpar repositories antigos (mover para /legacy)
```

3. **Documentar Sucesso**
```markdown
# Migração Completa - Relatório Final

## Resumo:
- ✅ Migração executada com sucesso
- ✅ 100% dos dados migrados
- ✅ 0 erros durante produção
- ✅ Performance melhorou 5x
- ✅ Downtime: 35 minutos (dentro do planejado)

## Métricas:
- Clientes migrados: X
- Relatórios migrados: Y
- Ortodontistas migrados: Z
- Tempo de migração: 25 minutos
- Queries 5x mais rápidas

## Próximos Passos:
- Dia 50 (30 dias): Deletar bancos antigos permanentemente
- Dia 30: Revisar performance e otimizar índices
```

**Entregáveis:**
- ✅ Bancos antigos em read-only
- ✅ Sistema 100% no unified
- ✅ Documentação completa

---

## 🛡️ Checklist de Segurança

### Antes da Migração:
- [ ] ✅ Backups de todos os bancos (CRM + Backend)
- [ ] ✅ Backups testados (restauração bem-sucedida)
- [ ] ✅ Ambiente de staging configurado
- [ ] ✅ Script de migração testado em staging
- [ ] ✅ Validação 100% passou em staging
- [ ] ✅ Plano de rollback documentado
- [ ] ✅ Equipe comunicada sobre downtime

### Durante a Migração:
- [ ] ✅ Aplicação em modo manutenção
- [ ] ✅ Backup final de produção
- [ ] ✅ Criar atma_unified (NÃO sobrescrever existentes)
- [ ] ✅ Executar migração
- [ ] ✅ Validar contagens (100% dos dados)
- [ ] ✅ Testar APIs manualmente
- [ ] ✅ Verificar logs de erro

### Após a Migração:
- [ ] ✅ Monitoramento 24h ativo
- [ ] ✅ Nenhum erro crítico detectado
- [ ] ✅ Rodar em dual mode (comparar resultados)
- [ ] ✅ Bancos antigos em read-only
- [ ] ✅ Aguardar 30 dias antes de deletar

### Critérios de Rollback:
- [ ] ❌ > 5% de erros nas queries
- [ ] ❌ Dados faltando (contagens divergentes)
- [ ] ❌ Performance 2x pior que antes
- [ ] ❌ Qualquer corrupção de dados detectada

---

## 📊 Métricas de Sucesso

### Performance:
- ✅ Queries 5x mais rápidas
- ✅ Funil completo em 1 query (antes precisava de 2)
- ✅ Dashboards carregam em < 500ms

### Negócio:
- ✅ Visão 360° do cliente funcionando
- ✅ LTV calculado automaticamente
- ✅ Conversões automáticas de PDF → Lead

### Técnico:
- ✅ 1 banco em vez de 2 (50% menos infraestrutura)
- ✅ Manutenção simplificada
- ✅ Backups unificados

---

## 🎯 Timeline Visual

```
Dia 1-3:   🔍 Preparação
           ├── Análise de dados
           ├── Backups
           └── Design do schema

Dia 4-11:  🔧 Desenvolvimento
           ├── Script de migração
           ├── Repositories unificados
           └── Atualizar APIs

Dia 12-15: 🧪 Testes
           ├── Migração em staging
           ├── Validação 100%
           └── Performance tests

Dia 16-18: 🚀 Migração Produção
           ├── Backup final
           ├── Executar migração
           └── Monitoramento 24h

Dia 19-20: ✅ Validação Final
           ├── Dual mode
           ├── Read-only antigos
           └── Documentação

Dia 30:    📈 Revisão
           └── Otimizações

Dia 50:    🗑️ Limpeza Final
           └── Deletar bancos antigos
```

---

## 🆘 Contatos de Emergência

- **DBA:** [Nome] - [Telefone]
- **DevOps:** [Nome] - [Telefone]
- **CTO:** [Nome] - [Telefone]
- **Suporte MySQL:** [Link]

---

## 📚 Referências

- [ANALISE_DATABASES.md](../ANALISE_DATABASES.md) - Análise completa das 3 opções
- [Backend/database/unified_schema.sql](../Backend/database/unified_schema.sql) - Schema unificado
- [Backend/database/migrate-to-unified.js](../Backend/database/migrate-to-unified.js) - Script de migração

---

**Última atualização:** 2025-01-28
**Status:** ⏳ Aguardando início da Fase 1
