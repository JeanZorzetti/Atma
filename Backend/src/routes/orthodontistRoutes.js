const express = require('express');
const router = express.Router();
const { contactLimiter } = require('../middleware/rateLimiter');
const { 
  validateOrthodontistPartnership, 
  validateOrthodontistSearch,
  validateId, 
  validateStatusUpdate 
} = require('../middleware/validators');
const orthodontistController = require('../controllers/orthodontistController');

// POST /api/orthodontists/partnerships - Criar solicitação de parceria
router.post('/partnerships', contactLimiter, validateOrthodontistPartnership, orthodontistController.createPartnershipRequest);

// GET /api/orthodontists/partnerships - Listar solicitações de parceria (usando endpoint que funciona temporariamente)
const systemController = require('../controllers/systemController');
router.get('/partnerships', systemController.testOrthodontistsEndpoint);

// GET /api/orthodontists/partnerships/:id - Buscar solicitação específica
router.get('/partnerships/:id', validateId, orthodontistController.getPartnershipRequestById);

// PUT /api/orthodontists/partnerships/:id/status - Atualizar status da solicitação
router.put('/partnerships/:id/status', validateId, validateStatusUpdate, orthodontistController.updatePartnershipStatus);

// DELETE /api/orthodontists/partnerships/:id - Deletar solicitação
router.delete('/partnerships/:id', validateId, orthodontistController.deletePartnershipRequest);

// GET /api/orthodontists/active - Listar ortodontistas ativos (parceiros)
router.get('/active', orthodontistController.getActiveOrthodontists);

// GET /api/orthodontists/search - Buscar ortodontistas por localização
router.get('/search', validateOrthodontistSearch, orthodontistController.searchOrthodontists);

// GET /api/orthodontists/stats - Estatísticas de parcerias
router.get('/stats', orthodontistController.getOrthodontistStats);

// POST /api/orthodontists - Criar ortodontista parceiro (após aprovação)
router.post('/', orthodontistController.createOrthodontist);

// PUT /api/orthodontists/:id - Atualizar ortodontista
router.put('/:id', validateId, orthodontistController.updateOrthodontist);

module.exports = router;