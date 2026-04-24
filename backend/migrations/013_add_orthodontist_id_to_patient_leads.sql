-- Migration 013: Adicionar orthodontist_id à tabela patient_leads
-- Criado em: 2025-01-11
-- Descrição: Adiciona foreign key para vincular pacientes aos ortodontistas responsáveis
--            A atribuição acontece entre os status "contatado" e "agendado"

-- Adicionar coluna orthodontist_id
ALTER TABLE patient_leads
ADD COLUMN orthodontist_id INT NULL AFTER status;

-- Adicionar foreign key para orthodontists
ALTER TABLE patient_leads
ADD CONSTRAINT fk_patient_leads_orthodontist
FOREIGN KEY (orthodontist_id) REFERENCES orthodontists(id)
ON DELETE SET NULL
ON UPDATE CASCADE;

-- Criar índice para melhorar performance em queries de atribuição
CREATE INDEX idx_orthodontist_id ON patient_leads(orthodontist_id);

-- Comentário explicativo
-- Este campo deve ser preenchido quando o paciente está em status "contatado"
-- e antes de mudar para "agendado", pois a consulta é agendada com um ortodontista específico
