const express = require('express');
const router = express.Router();
const { authLimiter } = require('../middleware/rateLimiter');
const emailController = require('../controllers/emailController');

// GET /api/emails/logs - Buscar logs de emails
router.get('/logs', emailController.getEmailLogs);

// POST /api/emails/test - Testar configuração de email
router.post('/test', authLimiter, emailController.testEmailConfiguration);

// GET /api/emails/templates - Listar templates de email
router.get('/templates', emailController.getEmailTemplates);

// POST /api/emails/templates/reload - Recarregar templates
router.post('/templates/reload', emailController.reloadEmailTemplates);

// POST /api/emails/send - Enviar email customizado
router.post('/send', authLimiter, emailController.sendCustomEmail);

// GET /api/emails/stats - Estatísticas de emails
router.get('/stats', emailController.getEmailStats);

module.exports = router;