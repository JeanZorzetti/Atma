-- ============================================
-- MIGRAÇÃO: Adicionar colunas de Follow-up
-- Fase 5.2: Follow-up Automatizado
-- Data: 29/11/2025
-- ============================================

-- Adicionar colunas de controle de emails de follow-up
ALTER TABLE relatorios
ADD COLUMN IF NOT EXISTS email_d7_enviado BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_d7_data DATETIME,
ADD COLUMN IF NOT EXISTS email_d14_enviado BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_d14_data DATETIME,
ADD COLUMN IF NOT EXISTS email_d30_enviado BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_d30_data DATETIME;

-- Renomear coluna existente para consistência
ALTER TABLE relatorios
CHANGE COLUMN pdf_enviado email_inicial_enviado BOOLEAN DEFAULT FALSE;

-- Adicionar coluna para data do email inicial
ALTER TABLE relatorios
ADD COLUMN IF NOT EXISTS email_inicial_data DATETIME;

-- Adicionar data_geracao se não existir (referência para calcular D+7, D+14, D+30)
ALTER TABLE relatorios
ADD COLUMN IF NOT EXISTS data_geracao DATETIME DEFAULT CURRENT_TIMESTAMP;

-- Criar índices para otimizar queries do cron job
CREATE INDEX IF NOT EXISTS idx_email_d7_pending ON relatorios(email_d7_enviado, data_geracao);
CREATE INDEX IF NOT EXISTS idx_email_d14_pending ON relatorios(email_d14_enviado, data_geracao);
CREATE INDEX IF NOT EXISTS idx_email_d30_pending ON relatorios(email_d30_enviado, data_geracao);

-- Mostrar estrutura atualizada
DESCRIBE relatorios;
