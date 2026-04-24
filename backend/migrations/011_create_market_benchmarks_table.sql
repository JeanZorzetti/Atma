-- Migration 011: Create market_benchmarks table for storing industry performance benchmarks
-- Created: 2025-11-09
-- Purpose: Store editable market benchmark metrics for comparison with Atma's performance

-- Create market_benchmarks table
CREATE TABLE IF NOT EXISTS market_benchmarks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category VARCHAR(50) NOT NULL COMMENT 'Category: SEO, CONVERSAO, or GERAL',
  metric_key VARCHAR(100) NOT NULL UNIQUE COMMENT 'Unique identifier for the metric',
  metric_name VARCHAR(200) NOT NULL COMMENT 'Display name of the metric',
  metric_value DECIMAL(10, 2) NOT NULL COMMENT 'Benchmark value (percentage or number)',
  metric_unit VARCHAR(20) DEFAULT '%' COMMENT 'Unit of measurement: %, dias, R$, etc',
  description TEXT COMMENT 'Description or context about the benchmark',
  source VARCHAR(500) COMMENT 'Source of the benchmark data',
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_category (category),
  INDEX idx_metric_key (metric_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Market benchmarks for orthodontics/digital aligners industry';

-- Insert default benchmark values (placeholder - to be updated with real market data)
INSERT INTO market_benchmarks (category, metric_key, metric_name, metric_value, metric_unit, description, source) VALUES
-- SEO Benchmarks
('SEO', 'ctr_medio', 'CTR Médio', 3.50, '%', 'Taxa de cliques média em resultados orgânicos do Google para o setor de ortodontia digital', 'A definir - aguardando pesquisa de mercado'),
('SEO', 'posicao_media', 'Posição Média Google', 8.00, 'posição', 'Posição média no Google para keywords principais do setor', 'A definir - aguardando pesquisa de mercado'),
('SEO', 'impressao_to_click', 'Impressões → Cliques', 3.50, '%', 'Taxa de conversão de impressões para cliques', 'A definir - aguardando pesquisa de mercado'),

-- Conversion Funnel Benchmarks
('CONVERSAO', 'click_to_cadastro', 'Cliques → Cadastro', 5.00, '%', 'Taxa de conversão de cliques no site para cadastro/lead', 'A definir - aguardando pesquisa de mercado'),
('CONVERSAO', 'cadastro_to_agendamento', 'Cadastro → Agendamento', 40.00, '%', 'Taxa de conversão de cadastros para agendamentos', 'A definir - aguardando pesquisa de mercado'),
('CONVERSAO', 'agendamento_to_comparecimento', 'Agendamento → Comparecimento', 70.00, '%', 'Taxa de comparecimento em avaliações agendadas', 'A definir - aguardando pesquisa de mercado'),
('CONVERSAO', 'comparecimento_to_conversao', 'Avaliação Inicial → Conversão', 35.00, '%', 'Taxa de conversão de avaliação inicial para início de tratamento', 'A definir - aguardando pesquisa de mercado'),
('CONVERSAO', 'taxa_cancelamento', 'Taxa de Cancelamento', 15.00, '%', 'Taxa de cancelamento ao longo do funil', 'A definir - aguardando pesquisa de mercado'),

-- Overall Conversion Benchmarks
('GERAL', 'click_to_conversao', 'Conversão Total (Cliques → Convertido)', 1.20, '%', 'Taxa de conversão end-to-end: cliques até conversão final', 'A definir - aguardando pesquisa de mercado'),
('GERAL', 'tempo_medio_funil', 'Tempo Médio do Funil', 14.00, 'dias', 'Tempo médio da primeira visita até conversão', 'A definir - aguardando pesquisa de mercado'),
('GERAL', 'bounce_rate', 'Taxa de Rejeição', 55.00, '%', 'Taxa de rejeição média em sites do setor', 'A definir - aguardando pesquisa de mercado'),
('GERAL', 'cac_medio', 'CAC Médio', 800.00, 'R$', 'Custo de Aquisição de Cliente médio no setor', 'A definir - aguardando pesquisa de mercado');

-- Add comment to table
ALTER TABLE market_benchmarks
COMMENT='Market benchmarks for digital orthodontics industry. Editable via admin panel.';
