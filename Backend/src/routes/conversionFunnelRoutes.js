const express = require('express');
const router = express.Router();
const conversionFunnelController = require('../controllers/conversionFunnelController');

// GET /api/conversion-funnel/metrics - Get unified funnel metrics
router.get('/metrics', conversionFunnelController.getFunnelMetrics);

// GET /api/conversion-funnel/daily - Get daily breakdown
router.get('/daily', conversionFunnelController.getDailyBreakdown);

module.exports = router;
