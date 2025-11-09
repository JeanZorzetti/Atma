-- Migration 009: Add 'parceria_fechada' status to patients_leads
-- Author: Claude Code
-- Date: 2025-11-07
-- Description: Aligns status ENUM with frontend interfaces (Kanban, Leads)

-- Add 'parceria_fechada' to status ENUM
ALTER TABLE patients_leads
MODIFY COLUMN status ENUM(
  'prospeccao',
  'contato_inicial',
  'apresentacao',
  'negociacao',
  'parceria_fechada'
) DEFAULT 'prospeccao'
COMMENT 'Pipeline status: prospeccao → contato_inicial → apresentacao → negociacao → parceria_fechada';

-- Update any existing NULL status to 'prospeccao'
UPDATE patients_leads
SET status = 'prospeccao'
WHERE status IS NULL;

-- Add index for faster status filtering
CREATE INDEX idx_patients_leads_status ON patients_leads(status);

-- Verification query
SELECT
  status,
  COUNT(*) as count
FROM patients_leads
GROUP BY status
ORDER BY
  FIELD(status, 'prospeccao', 'contato_inicial', 'apresentacao', 'negociacao', 'parceria_fechada');
