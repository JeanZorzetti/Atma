const express = require('express');
const router = express.Router();
const {
  getMarketingMetrics,
  getGoogleAnalyticsData,
  getFacebookAdsData,
  getInstagramInsights,
  getEmailMarketingStats,
  getWhatsAppMetrics,
  getCampaignPerformance,
  getLeadSourceAnalysis
} = require('../controllers/marketingController');

const { logger } = require('../utils/logger');

// Middleware para logging de requests de marketing
router.use((req, res, next) => {
  logger.info(`📊 Marketing API Request: ${req.method} ${req.path}`, {
    query: req.query,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

/**
 * @route GET /api/marketing/metrics
 * @desc Obter métricas consolidadas de marketing
 * @query {string} range - Período (7d, 30d, 90d, 1y)
 * @access Public
 */
router.get('/metrics', getMarketingMetrics);

/**
 * @route GET /api/marketing/analytics/google
 * @desc Obter dados do Google Analytics
 * @query {string} metrics - Métricas desejadas (sessions,users,bounceRate)
 * @query {string} range - Período (7d, 30d, 90d, 1y)
 * @access Public
 */
router.get('/analytics/google', getGoogleAnalyticsData);

/**
 * @route GET /api/marketing/ads/facebook
 * @desc Obter dados do Facebook Ads
 * @query {string} range - Período (7d, 30d, 90d, 1y)
 * @access Public
 */
router.get('/ads/facebook', getFacebookAdsData);

/**
 * @route GET /api/marketing/social/instagram
 * @desc Obter insights do Instagram
 * @query {string} range - Período (7d, 30d, 90d, 1y)
 * @access Public
 */
router.get('/social/instagram', getInstagramInsights);

/**
 * @route GET /api/marketing/email/stats
 * @desc Obter estatísticas de email marketing
 * @query {string} range - Período (7d, 30d, 90d, 1y)
 * @access Public
 */
router.get('/email/stats', getEmailMarketingStats);

/**
 * @route GET /api/marketing/whatsapp/metrics
 * @desc Obter métricas do WhatsApp Business
 * @query {string} range - Período (7d, 30d, 90d, 1y)
 * @access Public
 */
router.get('/whatsapp/metrics', getWhatsAppMetrics);

/**
 * @route GET /api/marketing/campaigns
 * @desc Obter performance de todas as campanhas
 * @access Public
 */
router.get('/campaigns', getCampaignPerformance);

/**
 * @route GET /api/marketing/campaigns/:campaignId
 * @desc Obter performance de uma campanha específica
 * @param {string} campaignId - ID da campanha
 * @access Public
 */
router.get('/campaigns/:campaignId', getCampaignPerformance);

/**
 * @route GET /api/marketing/leads/sources
 * @desc Obter análise de fontes de leads
 * @query {string} range - Período (7d, 30d, 90d, 1y)
 * @access Public
 */
router.get('/leads/sources', getLeadSourceAnalysis);

// Error handling middleware específico para rotas de marketing
router.use((err, req, res, next) => {
  logger.error('❌ Erro em rota de marketing:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    query: req.query
  });

  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor nas métricas de marketing',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;