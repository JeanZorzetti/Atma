-- ============================================================================
-- Migration 011: Create patient_status_history table + Auto-tracking trigger
-- ============================================================================
-- Author: Claude Code
-- Date: 2025-11-26
-- Description: Enable funnel analysis by tracking all patient status transitions
-- Purpose: Power BI de Conversão dashboard with detailed funnel metrics
-- ============================================================================

-- Step 1: Create patient_status_history table
-- This table logs every status change for funnel analysis and conversion tracking

CREATE TABLE IF NOT EXISTS patient_status_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  previous_status ENUM(
    'novo',
    'contatado',
    'agendado',
    'avaliacao_inicial',
    'atribuido',
    'convertido',
    'cancelado'
  ) COMMENT 'Status before the change (NULL for initial creation)',
  new_status ENUM(
    'novo',
    'contatado',
    'agendado',
    'avaliacao_inicial',
    'atribuido',
    'convertido',
    'cancelado'
  ) NOT NULL COMMENT 'Status after the change',
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'When the status change occurred',
  changed_by INT DEFAULT NULL COMMENT 'User ID who made the change (NULL for system changes)',
  notes TEXT DEFAULT NULL COMMENT 'Optional notes about the status change',

  -- Foreign key to patient_leads
  FOREIGN KEY (patient_id) REFERENCES patient_leads(id) ON DELETE CASCADE,

  -- Indexes for performance
  INDEX idx_patient_id (patient_id),
  INDEX idx_new_status (new_status),
  INDEX idx_previous_status (previous_status),
  INDEX idx_changed_at (changed_at),
  INDEX idx_patient_changed_at (patient_id, changed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT 'Historical log of patient status transitions for funnel analysis and BI';

-- Step 2: Populate initial data from existing patient_leads
-- For existing patients, create an initial entry with their current status

INSERT INTO patient_status_history (patient_id, previous_status, new_status, changed_at, notes)
SELECT
  id,
  NULL as previous_status,
  status as new_status,
  created_at as changed_at,
  CONCAT('Initial status: ', status, ' (migrated from patient_leads)') as notes
FROM patient_leads
WHERE id NOT IN (SELECT DISTINCT patient_id FROM patient_status_history);

-- Step 3: Create trigger to automatically log status changes
-- This trigger fires AFTER every UPDATE on patient_leads.status

DELIMITER $$

DROP TRIGGER IF EXISTS patient_status_change_tracker$$

CREATE TRIGGER patient_status_change_tracker
AFTER UPDATE ON patient_leads
FOR EACH ROW
BEGIN
  -- Only log if status actually changed
  IF OLD.status != NEW.status THEN
    INSERT INTO patient_status_history (
      patient_id,
      previous_status,
      new_status,
      changed_at,
      notes
    ) VALUES (
      NEW.id,
      OLD.status,
      NEW.status,
      NOW(),
      CONCAT('Status changed: ', OLD.status, ' → ', NEW.status)
    );
  END IF;
END$$

DELIMITER ;

-- Step 4: Create trigger for new patient insertions
-- Log initial status when a new patient is created

DELIMITER $$

DROP TRIGGER IF EXISTS patient_initial_status_tracker$$

CREATE TRIGGER patient_initial_status_tracker
AFTER INSERT ON patient_leads
FOR EACH ROW
BEGIN
  INSERT INTO patient_status_history (
    patient_id,
    previous_status,
    new_status,
    changed_at,
    notes
  ) VALUES (
    NEW.id,
    NULL,
    NEW.status,
    NEW.created_at,
    CONCAT('Patient created with initial status: ', NEW.status)
  );
END$$

DELIMITER ;

-- ============================================================================
-- Step 5: Verification Queries
-- ============================================================================

-- 5.1: Check table structure
DESCRIBE patient_status_history;

-- 5.2: Show triggers
SHOW TRIGGERS LIKE 'patient_leads';

-- 5.3: Count of historical records
SELECT
  'Total status changes logged' as metric,
  COUNT(*) as count
FROM patient_status_history;

-- 5.4: Status transition matrix (shows flow between statuses)
SELECT
  COALESCE(previous_status, 'NULL (initial)') as from_status,
  new_status as to_status,
  COUNT(*) as transition_count
FROM patient_status_history
GROUP BY previous_status, new_status
ORDER BY
  FIELD(previous_status, NULL, 'novo', 'contatado', 'agendado', 'avaliacao_inicial', 'atribuido', 'convertido', 'cancelado'),
  FIELD(new_status, 'novo', 'contatado', 'agendado', 'avaliacao_inicial', 'atribuido', 'convertido', 'cancelado');

-- 5.5: Average time between status transitions (in hours)
SELECT
  CONCAT(
    COALESCE(h1.new_status, 'novo'),
    ' → ',
    h2.new_status
  ) as transition,
  COUNT(*) as occurrences,
  ROUND(AVG(TIMESTAMPDIFF(HOUR, h1.changed_at, h2.changed_at)), 2) as avg_hours,
  ROUND(MIN(TIMESTAMPDIFF(HOUR, h1.changed_at, h2.changed_at)), 2) as min_hours,
  ROUND(MAX(TIMESTAMPDIFF(HOUR, h1.changed_at, h2.changed_at)), 2) as max_hours
FROM patient_status_history h1
JOIN patient_status_history h2 ON h1.patient_id = h2.patient_id
WHERE h2.id = (
  SELECT MIN(id)
  FROM patient_status_history
  WHERE patient_id = h1.patient_id
    AND id > h1.id
)
GROUP BY
  h1.new_status,
  h2.new_status
ORDER BY
  FIELD(h1.new_status, 'novo', 'contatado', 'agendado', 'avaliacao_inicial', 'atribuido', 'convertido', 'cancelado'),
  FIELD(h2.new_status, 'novo', 'contatado', 'agendado', 'avaliacao_inicial', 'atribuido', 'convertido', 'cancelado');

-- 5.6: Recent status changes (last 10)
SELECT
  h.id,
  p.nome as patient_name,
  h.previous_status,
  h.new_status,
  h.changed_at,
  h.notes
FROM patient_status_history h
JOIN patient_leads p ON h.patient_id = p.id
ORDER BY h.changed_at DESC
LIMIT 10;

-- ============================================================================
-- Migration Summary
-- ============================================================================

SELECT
  'Migration 011 completed successfully' as status,
  (SELECT COUNT(*) FROM patient_status_history) as total_history_records,
  (SELECT COUNT(*) FROM patient_leads) as total_patients,
  (SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_schema = DATABASE() AND event_object_table = 'patient_leads') as triggers_created;

-- ============================================================================
-- Rollback Instructions (if needed)
-- ============================================================================
-- DROP TRIGGER IF EXISTS patient_status_change_tracker;
-- DROP TRIGGER IF EXISTS patient_initial_status_tracker;
-- DROP TABLE IF EXISTS patient_status_history;
-- ============================================================================
