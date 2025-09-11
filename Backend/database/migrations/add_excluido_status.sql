-- Migration to add 'excluido' status to patient_leads table
-- This fixes the 500 error when trying to delete patient records

-- Add 'excluido' to the status ENUM
ALTER TABLE patient_leads 
MODIFY COLUMN status ENUM('novo', 'contatado', 'agendado', 'convertido', 'cancelado', 'excluido') DEFAULT 'novo';

-- Verify the change was applied
DESCRIBE patient_leads;