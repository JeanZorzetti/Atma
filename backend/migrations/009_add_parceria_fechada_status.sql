-- Migration 009: Add 'parceria_fechada' status to crm_leads (B2B pipeline)
-- Author: Claude Code
-- Date: 2025-11-07
-- Description: Aligns status ENUM with frontend interfaces (Kanban, Leads)
-- IMPORTANT: This is for crm_leads (B2B - ortodontistas), NOT patient_leads (B2C - pacientes)

-- Step 1: Check current status values
-- SELECT DISTINCT status FROM crm_leads;

-- Step 2: Fix any invalid or NULL status values BEFORE modifying ENUM
UPDATE crm_leads
SET status = 'prospeccao'
WHERE status IS NULL OR status = '' OR status NOT IN ('prospeccao', 'contato_inicial', 'apresentacao', 'negociacao');

-- Step 3: Temporarily change column to VARCHAR to avoid truncation
ALTER TABLE crm_leads
MODIFY COLUMN status VARCHAR(50) DEFAULT 'prospeccao';

-- Step 4: Now safely add the new status to ENUM
ALTER TABLE crm_leads
MODIFY COLUMN status ENUM(
  'prospeccao',
  'contato_inicial',
  'apresentacao',
  'negociacao',
  'parceria_fechada'
) DEFAULT 'prospeccao'
COMMENT 'Pipeline status: prospeccao → contato_inicial → apresentacao → negociacao → parceria_fechada';

-- Step 5: Add index for faster status filtering (if not exists)
CREATE INDEX IF NOT EXISTS idx_crm_leads_status ON crm_leads(status);

-- Step 6: Verification query
SELECT
  status,
  COUNT(*) as count
FROM crm_leads
GROUP BY status
ORDER BY
  FIELD(status, 'prospeccao', 'contato_inicial', 'apresentacao', 'negociacao', 'parceria_fechada');
