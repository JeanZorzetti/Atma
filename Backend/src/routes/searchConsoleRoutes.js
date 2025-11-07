const express = require('express');
const router = express.Router();
const searchConsoleController = require('../controllers/searchConsoleController');

// =============================================================================
// OAuth 2.0 Authentication Routes
// =============================================================================

// GET /api/search-console/auth/url - Generate Google OAuth authorization URL
router.get('/auth/url', searchConsoleController.getAuthUrl);

// GET /api/search-console/auth/callback - Handle OAuth callback from Google
router.get('/auth/callback', searchConsoleController.handleAuthCallback);

// GET /api/search-console/auth/status - Check if authenticated
router.get('/auth/status', searchConsoleController.getAuthStatus);

// DELETE /api/search-console/auth/revoke - Revoke Google OAuth tokens
router.delete('/auth/revoke', searchConsoleController.revokeAuth);

// =============================================================================
// SEO Metrics Routes
// =============================================================================

// GET /api/search-console/metrics - Get SEO metrics summary
router.get('/metrics', searchConsoleController.getMetrics);

// GET /api/search-console/metrics/history - Get historical metrics
router.get('/metrics/history', searchConsoleController.getMetricsHistory);

// POST /api/search-console/metrics/sync - Trigger manual sync from GSC
router.post('/metrics/sync', searchConsoleController.syncMetrics);

// =============================================================================
// Keywords & Pages Routes
// =============================================================================

// GET /api/search-console/keywords - Get top keywords
router.get('/keywords', searchConsoleController.getTopKeywords);

// GET /api/search-console/pages - Get top pages
router.get('/pages', searchConsoleController.getTopPages);

// =============================================================================
// Alerts Routes
// =============================================================================

// GET /api/search-console/alerts - Get all alerts
router.get('/alerts', searchConsoleController.getAlerts);

// GET /api/search-console/alerts/unresolved - Get unresolved alerts
router.get('/alerts/unresolved', searchConsoleController.getUnresolvedAlerts);

// PUT /api/search-console/alerts/:id/resolve - Mark alert as resolved
router.put('/alerts/:id/resolve', searchConsoleController.resolveAlert);

module.exports = router;
