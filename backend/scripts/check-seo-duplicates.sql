-- ============================================================================
-- Script de Diagnóstico: Verificar Duplicatas em seo_metrics_history
-- ============================================================================
-- Data: 26/11/2025
-- Objetivo: Identificar se há entradas duplicadas que podem estar causando
--           discrepâncias na agregação de métricas SEO
-- ============================================================================

-- 1. Verificar duplicatas por data
-- Deve retornar 1 linha por data. Se retornar > 1, há duplicatas.
SELECT
  DATE(date) as metric_date,
  COUNT(*) as registros_count,
  SUM(impressions) as total_impressions,
  SUM(clicks) as total_clicks,
  GROUP_CONCAT(id ORDER BY id) as ids_duplicados
FROM seo_metrics_history
WHERE date BETWEEN '2025-10-22' AND '2025-11-22'
GROUP BY DATE(date)
HAVING COUNT(*) > 1
ORDER BY metric_date DESC;

-- 2. Contagem total de registros vs datas únicas
SELECT
  COUNT(*) as total_registros,
  COUNT(DISTINCT DATE(date)) as datas_unicas,
  (COUNT(*) - COUNT(DISTINCT DATE(date))) as possivel_duplicatas
FROM seo_metrics_history
WHERE date BETWEEN '2025-10-22' AND '2025-11-22';

-- 3. Verificar se há registros com mesma data mas valores diferentes
-- (isso indicaria múltiplas sincronizações com dados diferentes)
SELECT
  DATE(date) as metric_date,
  COUNT(DISTINCT impressions) as valores_diferentes_impressions,
  COUNT(DISTINCT clicks) as valores_diferentes_clicks,
  COUNT(*) as total_registros,
  GROUP_CONCAT(DISTINCT impressions ORDER BY impressions) as impressions_valores,
  GROUP_CONCAT(DISTINCT clicks ORDER BY clicks) as clicks_valores
FROM seo_metrics_history
WHERE date BETWEEN '2025-10-22' AND '2025-11-22'
GROUP BY DATE(date)
HAVING COUNT(*) > 1;

-- 4. Listar TODAS as entradas do período para análise detalhada
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
WHERE date BETWEEN '2025-10-22' AND '2025-11-22'
ORDER BY date DESC, id DESC;

-- 5. Verificar padrão de sincronização (quantas vezes cada dia foi sincronizado)
SELECT
  DATE(date) as metric_date,
  COUNT(*) as sync_count,
  MIN(synced_at) as primeira_sync,
  MAX(synced_at) as ultima_sync,
  TIMESTAMPDIFF(MINUTE, MIN(synced_at), MAX(synced_at)) as minutos_entre_syncs
FROM seo_metrics_history
WHERE date BETWEEN '2025-10-22' AND '2025-11-22'
GROUP BY DATE(date)
ORDER BY metric_date DESC;

-- 6. Análise de todo o histórico (para ver se problema é só nesse período)
SELECT
  DATE_FORMAT(date, '%Y-%m') as mes,
  COUNT(*) as total_registros,
  COUNT(DISTINCT DATE(date)) as datas_unicas,
  (COUNT(*) - COUNT(DISTINCT DATE(date))) as duplicatas
FROM seo_metrics_history
GROUP BY DATE_FORMAT(date, '%Y-%m')
ORDER BY mes DESC;

-- ============================================================================
-- Interpretação dos Resultados:
-- ============================================================================
--
-- Query 1: Se retornar QUALQUER linha → HÁ DUPLICATAS
--   - registros_count > 1 = número de duplicatas para aquela data
--   - ids_duplicados = IDs dos registros duplicados (para remoção)
--
-- Query 2: possivel_duplicatas > 0 → CONFIRMA duplicatas
--
-- Query 3: Se valores_diferentes_* > 1 → DUPLICATAS COM DADOS DIFERENTES
--   - Isso é GRAVE - significa que sincronizações diferentes trouxeram dados diferentes
--   - Precisa decidir qual registro manter (geralmente o mais recente)
--
-- Query 4: Análise manual completa
--
-- Query 5: sync_count > 1 → Data foi sincronizada múltiplas vezes
--
-- Query 6: Verifica se problema é histórico ou apenas nesse período
-- ============================================================================

-- ============================================================================
-- Ações Recomendadas Baseadas nos Resultados:
-- ============================================================================
--
-- SE NÃO HÁ DUPLICATAS (Query 1 retorna vazio):
--   ✅ Dados estão corretos
--   ✅ Problema era apenas falta de dados (já resolvido com resync)
--   ✅ Não precisa de migration
--
-- SE HÁ DUPLICATAS COM MESMOS VALORES:
--   ⚠️ Criar migration para remover duplicatas (manter o mais recente)
--   ⚠️ Atualizar query de agregação para usar DISTINCT ou GROUP BY
--   ⚠️ Adicionar constraint UNIQUE em (date) na tabela
--
-- SE HÁ DUPLICATAS COM VALORES DIFERENTES:
--   🔴 PROBLEMA SÉRIO - dados inconsistentes
--   🔴 Investigar POR QUE dados diferentes foram sincronizados
--   🔴 Decidir critério: manter mais recente? Maior valor? Somar?
--   🔴 Criar migration complexa com lógica de decisão
-- ============================================================================
