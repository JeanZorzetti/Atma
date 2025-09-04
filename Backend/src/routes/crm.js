const express = require('express');
const router = express.Router();
const { getCrmLeads, getCrmStats, updateLeadStatus, migrateLeadToPpartnership, createCrmLead, getCrmLead, migrateStatusEnum } = require('../controllers/crmController');

// GET /api/crm/leads - Listar todos os leads do CRM (com filtros e paginação)
router.get('/leads', getCrmLeads);

// POST /api/crm/leads - Criar novo lead
router.post('/leads', createCrmLead);

// GET /api/crm/leads/:id - Buscar lead específico
router.get('/leads/:id', getCrmLead);

// GET /api/crm/stats - Estatísticas e conversões do funil
router.get('/stats', getCrmStats);

// PUT /api/crm/leads/:id/status - Atualizar status do lead
router.put('/leads/:id/status', updateLeadStatus);

// POST /api/crm/leads/:id/migrate - Migrar lead fechado para orthodontist_partnerships
router.post('/leads/:id/migrate', migrateLeadToPpartnership);

// POST /api/crm/migrate-status - Migrar ENUM da tabela para incluir parceria_fechada
router.post('/migrate-status', migrateStatusEnum);

module.exports = router;