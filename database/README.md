# Schema do Banco de Dados - Portal do Paciente

## Visão Geral

O schema do Portal do Paciente foi criado no banco de dados MySQL existente `atmadb`, que já é usado pelo CRM do Backend.

### Informações de Conexão

**Servidor:** 31.97.23.166:3306
**Database:** atmadb
**User:** atmadb

As credenciais estão configuradas em `Frontend/.env.local`:

```env
DB_HOST=31.97.23.166
DB_PORT=3306
DB_USER=atmadb
DB_PASSWORD=PAzo18**
DB_NAME=atmadb
```

---

## Tabelas Criadas

### 1. `portal_users` - Usuários do Portal

Armazena dados dos usuários sincronizados com o Clerk.

**Colunas principais:**

- `id` - ID auto-incremental (PK)
- `clerk_user_id` - ID único do usuário no Clerk (UNIQUE)
- `email` - Email do usuário (UNIQUE)
- `nome` - Nome completo
- `telefone` - Telefone (opcional)
- `cpf` - CPF do paciente (opcional)
- `data_nascimento` - Data de nascimento (opcional)
- `foto_url` - URL da foto de perfil
- `created_at` - Data de criação
- `updated_at` - Última atualização
- `last_login_at` - Último login

**Relacionamentos:**

- Um usuário pode ter múltiplos relatórios
- Um usuário pode ter múltiplos acessos
- Um usuário pode ter múltiplas interações

**Índices:**

- `clerk_user_id` (UNIQUE)
- `email` (UNIQUE)
- `created_at`

---

### 2. `portal_relatorios` - Relatórios de Viabilidade

Armazena os relatórios de viabilidade ortodôntica de cada paciente.

**Colunas principais:**

- `id` - ID auto-incremental (PK)
- `user_id` - FK para portal_users
- `dados_json` - Dados completos do relatório em JSON
- `score` - Score de viabilidade (0.0 - 10.0)
- `custo_estimado` - Custo em reais
- `duracao_meses` - Duração do tratamento
- `complexidade` - ENUM('Simples', 'Moderada', 'Complexa', 'Muito Complexa')
- `status` - ENUM('novo', 'em_analise', 'ativo', 'concluido', 'cancelado')
- `payment_id` - ID do pagamento no Mercado Pago
- `payment_status` - Status do pagamento
- `amount_paid` - Valor pago
- `paid_at` - Data do pagamento
- `expires_at` - Data de expiração do acesso
- `is_active` - Relatório ativo/inativo
- `pdf_url` - URL do PDF gerado
- `pdf_generated_at` - Data de geração do PDF
- `created_at` - Data de criação
- `updated_at` - Última atualização

**Relacionamentos:**

- `user_id` → `portal_users.id` (CASCADE)

**Índices:**

- `user_id`
- `status`
- `payment_id`
- `is_active`
- `score`

---

### 3. `portal_acessos` - Logs de Acesso

Registra todos os acessos ao portal para auditoria e análise.

**Colunas principais:**

- `id` - ID auto-incremental (PK)
- `user_id` - FK para portal_users
- `ip_address` - IP do usuário (IPv4 ou IPv6)
- `user_agent` - User agent do navegador
- `device_type` - ENUM('desktop', 'mobile', 'tablet', 'unknown')
- `page_url` - URL da página acessada
- `page_type` - ENUM do tipo de página
- `action` - Ação realizada (login, download_pdf, etc.)
- `country_code` - Código do país (ISO 3166-1)
- `city` - Cidade
- `accessed_at` - Data e hora do acesso

**Relacionamentos:**

- `user_id` → `portal_users.id` (CASCADE)

**Índices:**

- `user_id`
- `accessed_at`
- `page_type`
- `action`
- `ip_address`

**Trigger:**

- `trg_update_last_login` - Atualiza `last_login_at` em `portal_users`

---

### 4. `portal_interacoes` - Interações dos Usuários

Tracking de engajamento para gamificação e análise.

**Colunas principais:**

- `id` - ID auto-incremental (PK)
- `user_id` - FK para portal_users
- `relatorio_id` - FK para portal_relatorios (opcional)
- `tipo` - ENUM com tipos de interação:
  - `visualizou_score`
  - `baixou_pdf`
  - `compartilhou_relatorio`
  - `agendou_consulta`
  - `calculou_parcela`
  - `visitou_secao`
  - `completou_checklist`
  - `assistiu_video`
  - `leu_depoimento`
  - `fez_pergunta`
  - `outros`
- `detalhes` - JSON com detalhes adicionais
- `created_at` - Data da interação

**Relacionamentos:**

- `user_id` → `portal_users.id` (CASCADE)
- `relatorio_id` → `portal_relatorios.id` (SET NULL)

**Índices:**

- `user_id`
- `relatorio_id`
- `tipo`
- `created_at`

---

### 5. `portal_preferencias` - Preferências do Usuário

Personalização da experiência do usuário.

**Colunas principais:**

- `id` - ID auto-incremental (PK)
- `user_id` - FK para portal_users (UNIQUE)
- `notificacoes_email` - Receber emails (default: true)
- `notificacoes_sms` - Receber SMS (default: false)
- `idioma` - Idioma preferido (default: 'pt-BR')
- `timezone` - Fuso horário (default: 'America/Sao_Paulo')
- `aceita_marketing` - Marketing (default: false)
- `aceita_pesquisas` - Pesquisas (default: true)
- `perfil_publico` - Perfil público para depoimentos
- `compartilhar_antes_depois` - Permitir uso de fotos
- `outras_preferencias` - JSON para flexibilidade
- `created_at` - Data de criação
- `updated_at` - Última atualização

**Relacionamentos:**

- `user_id` → `portal_users.id` (CASCADE, UNIQUE)

---

## Views

### 1. `vw_relatorios_ativos`

Relatórios válidos com dados do usuário.

**Seleciona:**

- Dados do relatório (score, custo, duração, complexidade, status)
- Dados do usuário (id, email, nome, telefone)
- Dados de pagamento

**Filtro:**

- `is_active = TRUE`
- `expires_at IS NULL OR expires_at > NOW()`

### 2. `vw_estatisticas_uso`

Métricas de uso por usuário.

**Métricas calculadas:**

- Total de acessos
- Dias ativos
- Último acesso
- Total de interações
- Downloads de PDF
- Compartilhamentos

---

## Como Usar

### Executar Migração

```bash
cd Frontend
npm run db:migrate
```

### Verificar Tabelas Criadas

```sql
SHOW TABLES LIKE 'portal_%';
```

### Verificar Views

```sql
SHOW FULL TABLES WHERE TABLE_TYPE = 'VIEW';
```

### Queries de Exemplo

**Buscar usuário por Clerk ID:**

```sql
SELECT * FROM portal_users
WHERE clerk_user_id = 'user_xxxxx';
```

**Relatórios ativos de um usuário:**

```sql
SELECT * FROM vw_relatorios_ativos
WHERE user_id = 1;
```

**Estatísticas de uso:**

```sql
SELECT * FROM vw_estatisticas_uso
WHERE user_id = 1;
```

**Últimos acessos:**

```sql
SELECT * FROM portal_acessos
WHERE user_id = 1
ORDER BY accessed_at DESC
LIMIT 10;
```

**Interações de um relatório:**

```sql
SELECT tipo, COUNT(*) as total
FROM portal_interacoes
WHERE relatorio_id = 1
GROUP BY tipo
ORDER BY total DESC;
```

---

## Próximos Passos

### Fase 3: Integração com Clerk

1. **Webhook do Clerk** (`/api/webhooks/clerk`):
   - Evento `user.created` → Criar registro em `portal_users`
   - Evento `user.updated` → Atualizar `portal_users`
   - Evento `user.deleted` → Soft delete ou hard delete

### Fase 3: API Routes

2. **CRUD de Relatórios**:
   - `POST /api/portal/relatorios` - Criar relatório
   - `GET /api/portal/relatorios/:id` - Buscar relatório
   - `PUT /api/portal/relatorios/:id` - Atualizar relatório
   - `DELETE /api/portal/relatorios/:id` - Deletar relatório

3. **Tracking de Interações**:
   - `POST /api/portal/interacoes` - Registrar interação
   - `GET /api/portal/estatisticas` - Buscar estatísticas do usuário

### Fase 4: Features Avançadas

4. **Sistema de Expiração**:
   - Cron job para marcar relatórios expirados como `is_active = false`

5. **Notificações**:
   - Email quando relatório está próximo de expirar
   - SMS para eventos importantes

6. **Analytics**:
   - Dashboard administrativo com métricas de uso
   - Funis de conversão
   - Heatmaps de navegação

---

## Manutenção

### Backup

```bash
mysqldump -h 31.97.23.166 -u atmadb -p atmadb \
  portal_users \
  portal_relatorios \
  portal_acessos \
  portal_interacoes \
  portal_preferencias \
  > backup-portal-$(date +%Y%m%d).sql
```

### Índices e Performance

As tabelas já possuem índices otimizados para as queries mais comuns:

- Busca por usuário
- Busca por relatório
- Logs de acesso por data
- Interações por tipo

### Monitoramento

```sql
-- Tamanho das tabelas
SELECT
  table_name AS 'Tabela',
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Tamanho (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'atmadb'
  AND table_name LIKE 'portal_%'
ORDER BY (data_length + index_length) DESC;

-- Total de registros
SELECT
  'portal_users' as tabela,
  COUNT(*) as total
FROM portal_users
UNION ALL
SELECT 'portal_relatorios', COUNT(*) FROM portal_relatorios
UNION ALL
SELECT 'portal_acessos', COUNT(*) FROM portal_acessos
UNION ALL
SELECT 'portal_interacoes', COUNT(*) FROM portal_interacoes
UNION ALL
SELECT 'portal_preferencias', COUNT(*) FROM portal_preferencias;
```

---

**Criado em:** 2025-12-01
**Última atualização:** 2025-12-01
**Status:** ✅ Schema aplicado com sucesso
