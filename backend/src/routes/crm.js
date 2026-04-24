const express = require('express');
const router = express.Router();
const { getCrmLeads, getCrmStats, updateLeadStatus, updateCrmLead, deleteCrmLead, migrateLeadToPpartnership, createCrmLead, getCrmLead, migrateStatusEnum, migrateFollowUpColumn, importLeads, upload, getCrmActivities } = require('../controllers/crmController');

// GET /api/crm/leads - Listar todos os leads do CRM (com filtros e paginação)
router.get('/leads', getCrmLeads);

// POST /api/crm/leads - Criar novo lead
router.post('/leads', createCrmLead);

// POST /api/crm/leads/import - Importar leads via planilha Excel/CSV
router.post('/leads/import', upload.single('file'), importLeads);

// GET /api/crm/leads/:id - Buscar lead específico
router.get('/leads/:id', getCrmLead);

// PUT /api/crm/leads/:id - Atualizar lead completo
router.put('/leads/:id', updateCrmLead);

// DELETE /api/crm/leads/:id - Excluir lead
router.delete('/leads/:id', deleteCrmLead);

// GET /api/crm/stats - Estatísticas e conversões do funil
router.get('/stats', getCrmStats);

// GET /api/crm/activities - Buscar atividades recentes do CRM
router.get('/activities', getCrmActivities);

// PUT /api/crm/leads/:id/status - Atualizar status do lead
router.put('/leads/:id/status', updateLeadStatus);

// POST /api/crm/leads/:id/migrate - Migrar lead fechado para orthodontist_partnerships
router.post('/leads/:id/migrate', migrateLeadToPpartnership);

// POST /api/crm/migrate-status - Migrar ENUM da tabela para incluir parceria_fechada
router.post('/migrate-status', migrateStatusEnum);

// POST /api/crm/migrate-followup - Adicionar coluna próximo_followup
router.post('/migrate-followup', migrateFollowUpColumn);

module.exports = router;