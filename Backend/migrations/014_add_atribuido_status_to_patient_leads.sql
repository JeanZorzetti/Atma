-- Adicionar status 'atribuido' ao ENUM de status da tabela patient_leads
-- Este status representa pacientes que foram atribuídos a um ortodontista

ALTER TABLE patient_leads
MODIFY COLUMN status ENUM('novo', 'contatado', 'atribuido', 'agendado', 'convertido', 'cancelado', 'excluido') DEFAULT 'novo';
