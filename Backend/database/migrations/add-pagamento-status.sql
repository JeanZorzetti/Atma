-- Migration: Adicionar coluna pagamento_status à tabela relatorios
-- Data: 29/11/2025
-- Propósito: Rastrear status do pagamento do Mercado Pago

-- Adicionar coluna pagamento_status
ALTER TABLE relatorios
ADD COLUMN pagamento_status VARCHAR(20) DEFAULT 'pending' COMMENT 'Status do pagamento: pending, approved, rejected, cancelled';

-- Criar índice para consultas rápidas por status de pagamento
CREATE INDEX idx_pagamento_status ON relatorios(pagamento_status);

-- Atualizar relatórios existentes que já têm PDF enviado (considerar como aprovados)
UPDATE relatorios
SET pagamento_status = 'approved'
WHERE pdf_enviado = TRUE;
