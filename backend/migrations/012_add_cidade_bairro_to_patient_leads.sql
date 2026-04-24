-- Migration 012: Adicionar campos cidade e bairro à tabela patient_leads
-- Criado em: 2025-01-11
-- Descrição: Adiciona campos de cidade e bairro para melhor localização dos pacientes

ALTER TABLE patient_leads
ADD COLUMN cidade VARCHAR(100) NULL AFTER cep,
ADD COLUMN bairro VARCHAR(100) NULL AFTER cidade;

-- Adicionar índices para melhor performance em buscas por localização
CREATE INDEX idx_cidade ON patient_leads(cidade);
CREATE INDEX idx_bairro ON patient_leads(bairro);
