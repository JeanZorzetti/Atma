-- Migration 010: Add 'atribuido' and 'avaliacao_inicial' to patient_leads (B2C pipeline)
-- Author: Claude Code
-- Date: 2025-11-09
-- Description: Aligns patient_leads status ENUM with frontend interfaces (Kanban, Lista)
-- IMPORTANT: This is for patient_leads (B2C - pacientes), NOT crm_leads (B2B - ortodontistas)

-- Context: Frontend has 'atribuido' and 'avaliacao_inicial' but database doesn't
-- This causes errors when trying to save patients with these statuses

-- Step 1: Check current status values
-- SELECT DISTINCT status FROM patient_leads;

-- Step 2: Fix any invalid or NULL status values BEFORE modifying ENUM
UPDATE patient_leads
SET status = 'novo'
WHERE status IS NULL
   OR status = ''
   OR status NOT IN ('novo', 'contatado', 'agendado', 'convertido', 'cancelado', 'excluido');

-- Step 3: Handle 'excluido' status - move to 'cancelado' (soft delete alternative)
-- Reason: 'excluido' has no UI representation and should be handled via soft delete
UPDATE patient_leads
SET status = 'cancelado'
WHERE status = 'excluido';

-- Step 4: Temporarily change column to VARCHAR to avoid truncation during ENUM modification
ALTER TABLE patient_leads
MODIFY COLUMN status VARCHAR(50) DEFAULT 'novo';

-- Step 5: Now safely add the new statuses to ENUM (with complete B2C funnel)
ALTER TABLE patient_leads
MODIFY COLUMN status ENUM(
  'novo',
  'contatado',
  'agendado',
  'avaliacao_inicial',
  'atribuido',
  'convertido',
  'cancelado'
) DEFAULT 'novo'
COMMENT 'B2C Patient pipeline: novo → contatado → agendado → avaliacao_inicial → atribuido → convertido | cancelado';

-- Step 6: Add index for faster status filtering
-- Note: Ignore error if index already exists
ALTER TABLE patient_leads ADD INDEX idx_patient_leads_status (status);

-- Step 7: Verification query - show distribution by funnel order
SELECT
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM patient_leads), 2) as percentage
FROM patient_leads
GROUP BY status
ORDER BY
  FIELD(status, 'novo', 'contatado', 'agendado', 'avaliacao_inicial', 'atribuido', 'convertido', 'cancelado');

-- Step 8: Show migration summary
SELECT
  'Migration 010 completed' as message,
  COUNT(*) as total_patients,
  COUNT(DISTINCT status) as total_status_values
FROM patient_leads;
