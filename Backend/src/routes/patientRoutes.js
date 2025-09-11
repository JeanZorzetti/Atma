const express = require('express');
const router = express.Router();
const { contactLimiter } = require('../middleware/rateLimiter');
const { validatePatientLead, validateId, validateStatusUpdate } = require('../middleware/validators');
const patientController = require('../controllers/patientController');

// POST /api/patients/leads - Criar novo lead de paciente
router.post('/leads', contactLimiter, validatePatientLead, patientController.createPatientLead);

// GET /api/patients/leads - Listar leads de pacientes (para admin)
router.get('/leads', patientController.getPatientLeadsForAdmin);

// GET /api/patients/leads/:id - Buscar lead específico
router.get('/leads/:id', validateId, patientController.getPatientLeadById);

// PUT /api/patients/leads/:id/status - Atualizar status do lead
router.put('/leads/:id/status', validateId, validateStatusUpdate, patientController.updatePatientLeadStatus);

// PUT /api/patients/leads/:id - Atualizar informações do paciente
router.put('/leads/:id', validateId, patientController.updatePatientLead);

// PUT /api/patients/leads/:id/cancel - Cancelar paciente
router.put('/leads/:id/cancel', validateId, patientController.cancelPatientLead);

// DELETE /api/patients/leads/:id - Excluir lead
router.delete('/leads/:id', validateId, patientController.deletePatientLead);

// GET /api/patients/stats - Estatísticas de leads
router.get('/stats', patientController.getPatientStats);

module.exports = router;