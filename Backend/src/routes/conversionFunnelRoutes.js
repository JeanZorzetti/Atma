const express = require('express');
const router = express.Router();
const conversionFunnelController = require('../controllers/conversionFunnelController');
const { adminLimiter } = require('../middleware/rateLimiter');

// Apply admin limiter (60 req/min instead of general 100 req/15min)
router.use(adminLimiter);

// GET /api/conversion-funnel/metrics - Get unified funnel metrics
router.get('/metrics', conversionFunnelController.getFunnelMetrics);

// GET /api/conversion-funnel/daily - Get daily breakdown
router.get('/daily', conversionFunnelController.getDailyBreakdown);

module.exports = router;
