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
