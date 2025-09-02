const express = require('express');
const router = express.Router();
const { getCrmLeads, getCrmStats, updateLeadStatus, migrateLeadToPpartnership } = require('../controllers/crmController');

// GET /api/crm/leads - Listar todos os leads do CRM
router.get('/leads', getCrmLeads);

// GET /api/crm/stats - Estatísticas e conversões do funil
router.get('/stats', getCrmStats);

// PUT /api/crm/leads/:id/status - Atualizar status do lead
router.put('/leads/:id/status', updateLeadStatus);

// POST /api/crm/leads/:id/migrate - Migrar lead fechado para orthodontist_partnerships
router.post('/leads/:id/migrate', migrateLeadToPpartnership);

module.exports = router;