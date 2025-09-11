const express = require('express');
const router = express.Router();
const { validateSystemSetting } = require('../middleware/validators');
const systemController = require('../controllers/systemController');

// GET /api/system/settings - Listar configurações do sistema
router.get('/settings', systemController.getSystemSettings);

// PUT /api/system/settings - Atualizar configuração
router.put('/settings', validateSystemSetting, systemController.updateSystemSetting);

// GET /api/system/health - Health check detalhado
router.get('/health', systemController.getSystemHealth);

// GET /api/system/version - Informações de versão da API
router.get('/version', systemController.getVersion);

// GET /api/system/stats - Estatísticas gerais do sistema
router.get('/stats', systemController.getSystemStats);

// GET /api/system/quick-actions - Ações rápidas para o dashboard
router.get('/quick-actions', systemController.getQuickActions);

// POST /api/system/maintenance - Executar tarefas de manutenção
router.post('/maintenance', systemController.runMaintenance);

// POST /api/system/migrate - Executar migrações do banco (temporário para setup)
router.post('/migrate', systemController.runDatabaseMigrations);

// GET /api/system/test-db - Testar query simples (debug)
router.get('/test-db', systemController.testDatabaseQuery);

// GET /api/system/test-patients - Testar endpoint de pacientes sem middleware (debug)
router.get('/test-patients', systemController.testPatientsEndpoint);

// GET /api/system/reports - Dados compilados para relatórios
router.get('/reports', systemController.getReportsData);

module.exports = router;