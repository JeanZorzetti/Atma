# 🔍 Teste de Verificação de Duplicatas - SEO Dashboard

## Como Testar

### 1. Iniciar o Servidor Backend

```bash
cd Backend
npm start
```

Aguarde até ver:
```
🚀 Servidor rodando na porta 3001
🌍 Ambiente: development
📊 Health check: http://localhost:3001/health
```

### 2. Testar o Endpoint de Verificação de Duplicatas

#### Via cURL (Terminal)

```bash
curl "http://localhost:3001/api/search-console/metrics/check-duplicates?startDate=2025-10-22&endDate=2025-11-22"
```

#### Via Browser

Abra no navegador:
```
http://localhost:3001/api/search-console/metrics/check-duplicates?startDate=2025-10-22&endDate=2025-11-22
```

#### Via Postman/Insomnia

```
GET http://localhost:3001/api/search-console/metrics/check-duplicates
Query Params:
  - startDate: 2025-10-22
  - endDate: 2025-11-22
```

---

## Interpretando os Resultados

### Caso 1: Nenhuma Duplicata ✅

```json
{
  "success": true,
  "period": {
    "startDate": "2025-10-22",
    "endDate": "2025-11-22"
  },
  "summary": {
    "hasDuplicates": false,
    "hasConflicts": false,
    "totalRecords": 23,
    "uniqueDates": 23,
    "potentialDuplicates": 0,
    "duplicateDetails": [],
    "conflicts": []
  },
  "recommendation": "Nenhuma duplicata encontrada. Dados estão consistentes.",
  "action": "Nenhuma ação necessária"
}
```

**Análise**:
- ✅ Dados estão corretos
- ✅ Problema era apenas falta de dados (já resolvido com resync)
- ✅ Não precisa de migration

**Próximos passos**:
1. ✅ Marcar tarefa como completa
2. ➡️ Prosseguir para otimização de queries (Fase 2)

---

### Caso 2: Duplicatas com Mesmos Valores ⚠️

```json
{
  "success": true,
  "period": {
    "startDate": "2025-10-22",
    "endDate": "2025-11-22"
  },
  "summary": {
    "hasDuplicates": true,
    "hasConflicts": false,
    "totalRecords": 30,
    "uniqueDates": 23,
    "potentialDuplicates": 7,
    "duplicateDetails": [
      {
        "date": "2025-11-15",
        "recordCount": 2,
        "totalImpressions": 500,
        "totalClicks": 20,
        "duplicateIds": [123, 124]
      },
      {
        "date": "2025-11-16",
        "recordCount": 2,
        "totalImpressions": 450,
        "totalClicks": 18,
        "duplicateIds": [125, 126]
      }
    ],
    "conflicts": []
  },
  "recommendation": "Duplicatas encontradas com mesmos valores. Migration recomendada para limpeza.",
  "action": "Execute a migration para remover duplicatas"
}
```

**Análise**:
- ⚠️ Há duplicatas, mas valores são idênticos
- ⚠️ Causando inflação de 2x nas métricas agregadas
- ⚠️ Precisa criar migration para remover

**Próximos passos**:
1. Criar migration `013_remove_seo_duplicates.sql`
2. Testar migration em ambiente de dev
3. Aplicar migration em produção
4. Adicionar constraint UNIQUE em `date` para prevenir futuras duplicatas

---

### Caso 3: Duplicatas com Valores Diferentes 🔴

```json
{
  "success": true,
  "period": {
    "startDate": "2025-10-22",
    "endDate": "2025-11-22"
  },
  "summary": {
    "hasDuplicates": true,
    "hasConflicts": true,
    "totalRecords": 30,
    "uniqueDates": 23,
    "potentialDuplicates": 7,
    "duplicateDetails": [
      {
        "date": "2025-11-15",
        "recordCount": 2,
        "totalImpressions": 600,
        "totalClicks": 25,
        "duplicateIds": [123, 124]
      }
    ],
    "conflicts": [
      {
        "date": "2025-11-15",
        "differentImpressions": 2,
        "differentClicks": 2,
        "totalRecords": 2,
        "impressionsValues": "250,350",
        "clicksValues": "10,15"
      }
    ]
  },
  "recommendation": "CRÍTICO: Duplicatas com valores diferentes encontradas. Revisão manual necessária.",
  "action": "Execute a migration para remover duplicatas"
}
```

**Análise**:
- 🔴 **PROBLEMA CRÍTICO** - Dados inconsistentes!
- 🔴 Mesma data tem valores diferentes (250 vs 350 impressões)
- 🔴 Precisa decidir qual registro manter
- 🔴 Investigar POR QUE dados diferentes foram sincronizados

**Critérios de Decisão**:
1. **Manter o mais recente** (campo `synced_at`)
   - Assumir que dados mais novos são mais precisos
2. **Manter o maior valor** (SUM)
   - Google pode ter atualizado dados retroativamente
3. **Investigar manualmente**
   - Verificar logs de sincronização
   - Comparar com Google Search Console

**Próximos passos**:
1. 🔍 Investigar causa raiz
2. 📊 Verificar manualmente no GSC
3. 🛠️ Criar migration com lógica de decisão
4. 🔒 Adicionar validação para prevenir

---

## Exemplos de Queries SQL para Análise Manual

### 1. Ver detalhes de uma data duplicada

```sql
SELECT
  id,
  DATE(date) as metric_date,
  impressions,
  clicks,
  ctr,
  position,
  synced_at,
  created_at
FROM seo_metrics_history
WHERE DATE(date) = '2025-11-15'
ORDER BY synced_at DESC;
```

### 2. Comparar valores entre duplicatas

```sql
SELECT
  DATE(date) as metric_date,
  GROUP_CONCAT(CONCAT('ID:', id, '=', impressions, 'imp/', clicks, 'clk')) as registros
FROM seo_metrics_history
WHERE DATE(date) IN (
  SELECT DATE(date)
  FROM seo_metrics_history
  WHERE date BETWEEN '2025-10-22' AND '2025-11-22'
  GROUP BY DATE(date)
  HAVING COUNT(*) > 1
)
GROUP BY DATE(date);
```

### 3. Ver quando cada registro foi sincronizado

```sql
SELECT
  DATE(date) as metric_date,
  MIN(synced_at) as primeira_sync,
  MAX(synced_at) as ultima_sync,
  TIMESTAMPDIFF(HOUR, MIN(synced_at), MAX(synced_at)) as horas_entre_syncs
FROM seo_metrics_history
WHERE date BETWEEN '2025-10-22' AND '2025-11-22'
GROUP BY DATE(date)
HAVING COUNT(*) > 1;
```

---

## Migration de Exemplo (se necessário)

### Arquivo: `Backend/migrations/013_remove_seo_duplicates.sql`

```sql
-- ============================================================================
-- Migration 013: Remover Duplicatas de seo_metrics_history
-- ============================================================================
-- Objetivo: Manter apenas 1 registro por data, preservando o mais recente
-- ============================================================================

-- 1. Criar tabela temporária com IDs para manter (mais recente de cada data)
CREATE TEMPORARY TABLE ids_to_keep AS
SELECT
  MIN(id) as id
FROM (
  SELECT
    id,
    DATE(date) as metric_date,
    ROW_NUMBER() OVER (PARTITION BY DATE(date) ORDER BY synced_at DESC, id DESC) as row_num
  FROM seo_metrics_history
) as ranked
WHERE row_num = 1;

-- 2. Backup dos registros duplicados (antes de deletar)
CREATE TABLE IF NOT EXISTS seo_metrics_history_duplicates_backup AS
SELECT * FROM seo_metrics_history
WHERE id NOT IN (SELECT id FROM ids_to_keep);

-- 3. Remover duplicatas (manter apenas os IDs selecionados)
DELETE FROM seo_metrics_history
WHERE id NOT IN (SELECT id FROM ids_to_keep);

-- 4. Adicionar constraint UNIQUE para prevenir futuras duplicatas
ALTER TABLE seo_metrics_history
ADD CONSTRAINT unique_metric_date UNIQUE (date);

-- 5. Verificação pós-migration
SELECT
  'Total de registros após limpeza:' as descricao,
  COUNT(*) as valor
FROM seo_metrics_history

UNION ALL

SELECT
  'Registros duplicados removidos:' as descricao,
  COUNT(*) as valor
FROM seo_metrics_history_duplicates_backup

UNION ALL

SELECT
  'Datas únicas:' as descricao,
  COUNT(DISTINCT DATE(date)) as valor
FROM seo_metrics_history;

-- ============================================================================
-- Rollback (se necessário):
-- ============================================================================
-- INSERT INTO seo_metrics_history
-- SELECT * FROM seo_metrics_history_duplicates_backup;
--
-- ALTER TABLE seo_metrics_history
-- DROP CONSTRAINT unique_metric_date;
-- ============================================================================
```

---

## Status Atual

- [x] Script SQL criado (`check-seo-duplicates.sql`)
- [x] Endpoint de verificação implementado
- [ ] Servidor backend iniciado
- [ ] Teste executado
- [ ] Resultados analisados
- [ ] Migration criada (se necessário)
- [ ] Migration aplicada (se necessário)

---

## Próximos Passos Baseados no Resultado

### Se NÃO há duplicatas:
1. ✅ Atualizar roadmap: Fase 2 - Item "Executar query SQL" como completo
2. ➡️ Prosseguir para otimização de queries de agregação
3. ➡️ Ajustar range de datas default

### Se HÁ duplicatas:
1. 🛠️ Criar migration
2. 🧪 Testar em desenvolvimento
3. 🚀 Aplicar em produção
4. 🔒 Adicionar constraint UNIQUE
5. ✅ Atualizar roadmap
