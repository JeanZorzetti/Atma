const conversionFunnelService = require('../services/conversionFunnelService');
const { logger } = require('../utils/logger');

/**
 * GET /api/conversion-funnel/metrics
 * Get unified SEO + CRM conversion funnel metrics
 * Query params: startDate, endDate (YYYY-MM-DD)
 */
exports.getFunnelMetrics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters',
        message: 'startDate and endDate are required (format: YYYY-MM-DD)'
      });
    }

    const result = await conversionFunnelService.getFunnelMetrics(startDate, endDate);
    res.json(result);
  } catch (error) {
    logger.error('Error getting funnel metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get funnel metrics',
      message: error.message
    });
  }
};

/**
 * GET /api/conversion-funnel/detailed-metrics
 * Get detailed funnel metrics with status history, transition times, and cancellation breakdown
 * This endpoint uses patient_status_history table for accurate funnel analysis
 * Query params: startDate, endDate (YYYY-MM-DD)
 */
exports.getDetailedFunnelMetrics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters',
        message: 'startDate and endDate are required (format: YYYY-MM-DD)'
      });
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format',
        message: 'Dates must be in YYYY-MM-DD format'
      });
    }

    // Validate date range (max 90 days)
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (diffDays > 90) {
      return res.status(400).json({
        success: false,
        error: 'Date range too large',
        message: 'Maximum date range is 90 days'
      });
    }

    if (diffDays < 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date range',
        message: 'startDate must be before endDate'
      });
    }

    logger.info(`📊 Fetching detailed funnel metrics from ${startDate} to ${endDate}`);

    const result = await conversionFunnelService.getDetailedFunnelMetrics(startDate, endDate);

    res.json(result);
  } catch (error) {
    logger.error('❌ Error getting detailed funnel metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get detailed funnel metrics',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * GET /api/conversion-funnel/daily
 * Get daily breakdown of metrics for trend analysis
 * Query params: startDate, endDate (YYYY-MM-DD)
 */
exports.getDailyBreakdown = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters',
        message: 'startDate and endDate are required (format: YYYY-MM-DD)'
      });
    }

    const result = await conversionFunnelService.getDailyBreakdown(startDate, endDate);
    res.json(result);
  } catch (error) {
    logger.error('Error getting daily breakdown:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get daily breakdown',
      message: error.message
    });
  }
};
