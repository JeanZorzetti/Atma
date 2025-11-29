-- Fix column sizes in relatorios table
-- Alguns valores do frontend são maiores que os limites do schema

-- ja_usou_aparelho: de VARCHAR(20) para VARCHAR(100)
-- Exemplo de valor: "Sim, aparelho fixo (com brackets)" = 35 chars
ALTER TABLE relatorios
MODIFY COLUMN ja_usou_aparelho VARCHAR(100);

-- expectativa_resultado: de VARCHAR(50) para VARCHAR(100)
-- Exemplo: "Melhora significativa - 80-90% do ideal" = 42 chars
ALTER TABLE relatorios
MODIFY COLUMN expectativa_resultado VARCHAR(100);

-- urgencia_tratamento: de VARCHAR(50) para VARCHAR(100)
-- Exemplo: "Moderada - Nos próximos 3 meses" = 34 chars
ALTER TABLE relatorios
MODIFY COLUMN urgencia_tratamento VARCHAR(100);

-- orcamento_recebido: de VARCHAR(20) para VARCHAR(100)
-- Exemplo: "Não recebi nenhum orçamento ainda" = 35 chars
ALTER TABLE relatorios
MODIFY COLUMN orcamento_recebido VARCHAR(100);

-- disponibilidade_uso: de VARCHAR(50) para VARCHAR(100)
-- Exemplo: "Tempo normal (6-12 meses)" = 27 chars (OK mas aumentando por segurança)
ALTER TABLE relatorios
MODIFY COLUMN disponibilidade_uso VARCHAR(100);
