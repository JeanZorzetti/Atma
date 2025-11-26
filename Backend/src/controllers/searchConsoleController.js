const { google } = require('googleapis');
const { executeQuery } = require('../config/database');
const { logger } = require('../utils/logger');

// =============================================================================
// OAuth 2.0 Configuration
// =============================================================================

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/api/search-console/auth/callback'
);

const SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly'];

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get stored OAuth tokens from database
 */
async function getStoredTokens() {
  try {
    const rows = await executeQuery(
      'SELECT * FROM google_auth_tokens ORDER BY created_at DESC LIMIT 1',
      []
    );

    if (rows.length === 0) {
      return null;
    }

    const token = rows[0];

    // Check if token is expired
    const now = new Date();
    const expiresAt = new Date(token.expires_at);

    if (now >= expiresAt) {
      // Token expired, need to refresh
      return await refreshAccessToken(token.refresh_token);
    }

    return {
      access_token: token.access_token,
      refresh_token: token.refresh_token,
      token_type: token.token_type,
      expiry_date: expiresAt.getTime()
    };
  } catch (error) {
    logger.error('Error getting stored tokens:', error);
    throw error;
  }
}

/**
 * Refresh expired access token
 */
async function refreshAccessToken(refreshToken) {
  try {
    oauth2Client.setCredentials({
      refresh_token: refreshToken
    });

    const { credentials } = await oauth2Client.refreshAccessToken();

    // Update database with new access token
    await executeQuery(
      `UPDATE google_auth_tokens
       SET access_token = ?, expires_at = ?, updated_at = NOW()
       WHERE refresh_token = ?`,
      [credentials.access_token, new Date(credentials.expiry_date), refreshToken]
    );

    logger.info('✅ Access token refreshed successfully');

    return credentials;
  } catch (error) {
    logger.error('Error refreshing access token:', error);
    throw error;
  }
}

/**
 * Save OAuth tokens to database
 */
async function saveTokens(tokens, userId = null) {
  try {
    const expiresAt = new Date(tokens.expiry_date);

    await executeQuery(
      `INSERT INTO google_auth_tokens (user_id, access_token, refresh_token, token_type, expires_at, scope)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        tokens.access_token,
        tokens.refresh_token,
        tokens.token_type || 'Bearer',
        expiresAt,
        tokens.scope
      ]
    );

    logger.info('✅ OAuth tokens saved to database');
  } catch (error) {
    logger.error('Error saving tokens:', error);
    throw error;
  }
}

// =============================================================================
// OAuth Controller Methods
// =============================================================================

/**
 * GET /api/search-console/auth/url
 * Generate Google OAuth authorization URL
 */
exports.getAuthUrl = async (req, res) => {
  try {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent' // Force consent screen to get refresh token
    });

    res.json({
      success: true,
      authUrl,
      message: 'Redirect user to this URL to authorize Google Search Console access'
    });
  } catch (error) {
    logger.error('Error generating auth URL:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate authorization URL',
      message: error.message
    });
  }
};

/**
 * GET /api/search-console/auth/callback
 * Handle OAuth callback from Google
 */
exports.handleAuthCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Authorization code not provided'
      });
    }

    // Exchange authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Save tokens to database
    await saveTokens(tokens);

    logger.info('✅ Google OAuth authorization successful');

    // Redirect to admin dashboard with success message
    res.redirect(`${process.env.ADMIN_URL || 'http://localhost:3000/admin'}/seo?auth=success`);
  } catch (error) {
    logger.error('Error handling OAuth callback:', error);
    res.redirect(`${process.env.ADMIN_URL || 'http://localhost:3000/admin'}/seo?auth=error&message=${encodeURIComponent(error.message)}`);
  }
};

/**
 * GET /api/search-console/auth/status
 * Check if user is authenticated with Google
 */
exports.getAuthStatus = async (req, res) => {
  try {
    const tokens = await getStoredTokens();

    if (!tokens) {
      return res.json({
        success: true,
        authenticated: false,
        message: 'Not authenticated with Google Search Console'
      });
    }

    res.json({
      success: true,
      authenticated: true,
      expiresAt: new Date(tokens.expiry_date).toISOString(),
      message: 'Authenticated with Google Search Console'
    });
  } catch (error) {
    logger.error('Error checking auth status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check authentication status',
      message: error.message
    });
  }
};

/**
 * DELETE /api/search-console/auth/revoke
 * Revoke Google OAuth tokens
 */
exports.revokeAuth = async (req, res) => {
  try {
    const tokens = await getStoredTokens();

    if (tokens) {
      oauth2Client.setCredentials(tokens);
      await oauth2Client.revokeCredentials();
    }

    // Delete all tokens from database
    await executeQuery('DELETE FROM google_auth_tokens');

    logger.info('✅ Google OAuth tokens revoked');

    res.json({
      success: true,
      message: 'Google Search Console access revoked successfully'
    });
  } catch (error) {
    logger.error('Error revoking auth:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to revoke authorization',
      message: error.message
    });
  }
};

// =============================================================================
// Metrics Controller Methods
// =============================================================================

const gscService = require('../services/googleSearchConsoleService');

/**
 * GET /api/search-console/metrics
 * Get SEO metrics summary (last 30 days by default or custom date range)
 * Query params: days (number) OR startDate + endDate (YYYY-MM-DD)
 */
exports.getMetrics = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const { startDate, endDate } = req.query;

    const result = await gscService.getMetricsSummary(days, startDate, endDate);

    res.json(result);
  } catch (error) {
    logger.error('Error getting metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get metrics',
      message: error.message
    });
  }
};

/**
 * GET /api/search-console/metrics/history
 * Get historical metrics from database
 */
exports.getMetricsHistory = async (req, res) => {
  try {
    const { startDate, endDate, limit = 90 } = req.query;

    let query = 'SELECT * FROM seo_metrics_history';
    const params = [];

    if (startDate && endDate) {
      query += ' WHERE date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    } else if (startDate) {
      query += ' WHERE date >= ?';
      params.push(startDate);
    } else if (endDate) {
      query += ' WHERE date <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY date DESC LIMIT ?';
    params.push(parseInt(limit));

    const rows = await executeQuery(query, params);

    res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    logger.error('Error getting metrics history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get metrics history',
      message: error.message
    });
  }
};

/**
 * POST /api/search-console/metrics/sync
 * Manually trigger sync from Google Search Console
 */
exports.syncMetrics = async (req, res) => {
  try {
    const { date, startDate, endDate } = req.body;

    let result;

    if (date) {
      // Sync single date
      result = await gscService.syncDailyMetrics(date);
    } else if (startDate && endDate) {
      // Sync date range
      result = await gscService.syncDateRange(startDate, endDate);
    } else {
      // Default: sync yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dateStr = yesterday.toISOString().split('T')[0];
      result = await gscService.syncDailyMetrics(dateStr);
    }

    res.json(result);
  } catch (error) {
    logger.error('Error syncing metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to sync metrics',
      message: error.message
    });
  }
};

/**
 * GET /api/search-console/keywords
 * Get top keywords from latest metrics
 */
exports.getTopKeywords = async (req, res) => {
  try {
    const { date, limit = 20 } = req.query;

    let query;
    let params;

    if (date) {
      query = 'SELECT top_keywords FROM seo_metrics_history WHERE date = ? LIMIT 1';
      params = [date];
    } else {
      query = 'SELECT top_keywords FROM seo_metrics_history ORDER BY date DESC LIMIT 1';
      params = [];
    }

    const rows = await executeQuery(query, params);

    if (rows.length === 0) {
      return res.json({
        success: true,
        keywords: [],
        message: 'No data available'
      });
    }

    // top_keywords might be a JSON string or already parsed object
    const topKeywordsRaw = rows[0].top_keywords;
    const keywords = (typeof topKeywordsRaw === 'string'
      ? JSON.parse(topKeywordsRaw || '[]')
      : topKeywordsRaw || []
    ).slice(0, limit);

    res.json({
      success: true,
      keywords,
      count: keywords.length
    });
  } catch (error) {
    logger.error('Error getting top keywords:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get top keywords',
      message: error.message
    });
  }
};

/**
 * GET /api/search-console/pages
 * Get top pages from latest metrics
 */
exports.getTopPages = async (req, res) => {
  try {
    const { date, limit = 20 } = req.query;

    let query;
    let params;

    if (date) {
      query = 'SELECT top_pages FROM seo_metrics_history WHERE date = ? LIMIT 1';
      params = [date];
    } else {
      query = 'SELECT top_pages FROM seo_metrics_history ORDER BY date DESC LIMIT 1';
      params = [];
    }

    const rows = await executeQuery(query, params);

    if (rows.length === 0) {
      return res.json({
        success: true,
        pages: [],
        message: 'No data available'
      });
    }

    // top_pages might be a JSON string or already parsed object
    const topPagesRaw = rows[0].top_pages;
    const pages = (typeof topPagesRaw === 'string'
      ? JSON.parse(topPagesRaw || '[]')
      : topPagesRaw || []
    ).slice(0, limit);

    res.json({
      success: true,
      pages,
      count: pages.length
    });
  } catch (error) {
    logger.error('Error getting top pages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get top pages',
      message: error.message
    });
  }
};

/**
 * GET /api/search-console/alerts
 * Get all alerts (with pagination)
 */
exports.getAlerts = async (req, res) => {
  try {
    const { limit = 50, offset = 0, severity } = req.query;

    let query = 'SELECT * FROM seo_alerts';
    const params = [];

    if (severity) {
      query += ' WHERE severity = ?';
      params.push(severity);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const rows = await executeQuery(query, params);

    res.json({
      success: true,
      alerts: rows,
      count: rows.length
    });
  } catch (error) {
    logger.error('Error getting alerts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get alerts',
      message: error.message
    });
  }
};

/**
 * GET /api/search-console/alerts/unresolved
 * Get unresolved alerts
 */
exports.getUnresolvedAlerts = async (req, res) => {
  try {
    const result = await gscService.getUnresolvedAlerts();
    res.json(result);
  } catch (error) {
    logger.error('Error getting unresolved alerts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get unresolved alerts',
      message: error.message
    });
  }
};

/**
 * PUT /api/search-console/alerts/:id/resolve
 * Mark alert as resolved
 */
exports.resolveAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId || null; // From auth middleware if available

    const result = await gscService.resolveAlert(id, userId);
    res.json(result);
  } catch (error) {
    logger.error('Error resolving alert:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to resolve alert',
      message: error.message
    });
  }
};

/**
 * GET /api/search-console/metrics/validate-period
 * Validate data coverage for a specific period
 */
exports.validatePeriod = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'startDate and endDate are required'
      });
    }

    logger.info('🔍 Validating period:', { startDate, endDate });

    // Count days with data in database
    const daysQuery = await executeQuery(
      `SELECT COUNT(DISTINCT DATE(date)) as days_count
       FROM seo_metrics_history
       WHERE date >= ? AND date <= ?`,
      [startDate, endDate]
    );

    // Get list of all dates with data
    const datesQuery = await executeQuery(
      `SELECT DISTINCT DATE(date) as date
       FROM seo_metrics_history
       WHERE date >= ? AND date <= ?
       ORDER BY date ASC`,
      [startDate, endDate]
    );

    // Calculate total expected days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const expectedDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const daysWithData = daysQuery[0].days_count;
    const coverage = ((daysWithData / expectedDays) * 100).toFixed(1);
    const missingDays = expectedDays - daysWithData;

    // Find missing dates
    const datesWithData = datesQuery.map(row => row.date.toISOString().split('T')[0]);
    const allDates = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      allDates.push(d.toISOString().split('T')[0]);
    }
    const missingDates = allDates.filter(date => !datesWithData.includes(date));

    logger.info('✅ Validation complete:', {
      expectedDays,
      daysWithData,
      coverage: coverage + '%',
      missingDays,
      missingDatesCount: missingDates.length
    });

    res.json({
      success: true,
      period: { startDate, endDate },
      expectedDays,
      daysWithData,
      coverage: coverage + '%',
      missingDays,
      missingDates: missingDates.slice(0, 10), // First 10 missing dates
      totalMissingDates: missingDates.length,
      datesWithData: datesWithData.slice(0, 10), // First 10 dates with data
      recommendation: coverage < 90 ?
        'Recomendamos ressincronizar este período para obter dados completos' :
        'Cobertura de dados adequada'
    });
  } catch (error) {
    logger.error('Error validating period:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate period',
      message: error.message
    });
  }
};

/**
 * GET /api/search-console/metrics/check-duplicates
 * Check for duplicate entries in seo_metrics_history
 */
exports.checkDuplicates = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'startDate and endDate are required'
      });
    }

    logger.info('🔍 Checking for duplicates:', { startDate, endDate });

    // Query 1: Encontrar duplicatas por data
    const duplicatesQuery = await executeQuery(
      `SELECT
        DATE(date) as metric_date,
        COUNT(*) as record_count,
        SUM(impressions) as total_impressions,
        SUM(clicks) as total_clicks,
        GROUP_CONCAT(id ORDER BY id) as duplicate_ids
       FROM seo_metrics_history
       WHERE date >= ? AND date <= ?
       GROUP BY DATE(date)
       HAVING COUNT(*) > 1
       ORDER BY metric_date DESC`,
      [startDate, endDate]
    );

    // Query 2: Contagem total vs únicas
    const countQuery = await executeQuery(
      `SELECT
        COUNT(*) as total_records,
        COUNT(DISTINCT DATE(date)) as unique_dates,
        (COUNT(*) - COUNT(DISTINCT DATE(date))) as potential_duplicates
       FROM seo_metrics_history
       WHERE date >= ? AND date <= ?`,
      [startDate, endDate]
    );

    // Query 3: Verificar se há valores diferentes para mesma data
    const conflictsQuery = await executeQuery(
      `SELECT
        DATE(date) as metric_date,
        COUNT(DISTINCT impressions) as different_impressions,
        COUNT(DISTINCT clicks) as different_clicks,
        COUNT(*) as total_records,
        GROUP_CONCAT(DISTINCT impressions ORDER BY impressions) as impressions_values,
        GROUP_CONCAT(DISTINCT clicks ORDER BY clicks) as clicks_values
       FROM seo_metrics_history
       WHERE date >= ? AND date <= ?
       GROUP BY DATE(date)
       HAVING COUNT(*) > 1`,
      [startDate, endDate]
    );

    const hasDuplicates = duplicatesQuery.length > 0;
    const hasConflicts = conflictsQuery.some(row =>
      row.different_impressions > 1 || row.different_clicks > 1
    );

    const summary = {
      hasDuplicates,
      hasConflicts,
      totalRecords: countQuery[0].total_records,
      uniqueDates: countQuery[0].unique_dates,
      potentialDuplicates: countQuery[0].potential_duplicates,
      duplicateDetails: duplicatesQuery.map(row => ({
        date: row.metric_date,
        recordCount: row.record_count,
        totalImpressions: row.total_impressions,
        totalClicks: row.total_clicks,
        duplicateIds: row.duplicate_ids.split(',').map(id => parseInt(id))
      })),
      conflicts: conflictsQuery.map(row => ({
        date: row.metric_date,
        differentImpressions: row.different_impressions,
        differentClicks: row.different_clicks,
        totalRecords: row.total_records,
        impressionsValues: row.impressions_values,
        clicksValues: row.clicks_values
      }))
    };

    logger.info('📊 Duplicate check results:', {
      hasDuplicates,
      hasConflicts,
      duplicateCount: duplicatesQuery.length,
      conflictCount: conflictsQuery.length
    });

    res.json({
      success: true,
      period: { startDate, endDate },
      summary,
      recommendation: hasDuplicates
        ? (hasConflicts
          ? 'CRÍTICO: Duplicatas com valores diferentes encontradas. Revisão manual necessária.'
          : 'Duplicatas encontradas com mesmos valores. Migration recomendada para limpeza.')
        : 'Nenhuma duplicata encontrada. Dados estão consistentes.',
      action: hasDuplicates
        ? 'Execute a migration para remover duplicatas'
        : 'Nenhuma ação necessária'
    });
  } catch (error) {
    logger.error('Error checking duplicates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check duplicates',
      message: error.message
    });
  }
};

/**
 * POST /api/search-console/metrics/resync-period
 * Resync missing data for a specific period
 */
exports.resyncPeriod = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'startDate and endDate are required'
      });
    }

    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    logger.info('🔄 RESYNC PERIOD REQUEST');
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    logger.info('📅 Period:', { startDate, endDate });

    // First, validate to see what's missing
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Get existing dates
    const datesQuery = await executeQuery(
      `SELECT DISTINCT DATE(date) as date
       FROM seo_metrics_history
       WHERE date >= ? AND date <= ?
       ORDER BY date ASC`,
      [startDate, endDate]
    );

    const datesWithData = datesQuery.map(row => row.date.toISOString().split('T')[0]);
    const allDates = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      allDates.push(d.toISOString().split('T')[0]);
    }
    const missingDates = allDates.filter(date => !datesWithData.includes(date));

    logger.info(`📊 Missing dates count: ${missingDates.length}`);
    logger.info(`📅 Missing dates: ${missingDates.join(', ')}`);

    if (missingDates.length === 0) {
      return res.json({
        success: true,
        message: 'No missing data for this period',
        missingDates: [],
        syncedDates: []
      });
    }

    // Sync only missing dates to avoid unnecessary API calls
    const results = [];
    let successful = 0;
    let failed = 0;

    for (const dateStr of missingDates) {
      try {
        logger.info(`🔄 Syncing missing date: ${dateStr}`);
        const result = await gscService.syncDailyMetrics(dateStr);

        if (result.success) {
          successful++;
          results.push({ date: dateStr, success: true });
          logger.info(`✅ Successfully synced ${dateStr}`);
        } else {
          failed++;
          results.push({ date: dateStr, success: false, error: result.message });
          logger.warn(`⚠️ Failed to sync ${dateStr}: ${result.message}`);
        }

        // Delay to avoid rate limiting (1 second between requests)
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        failed++;
        results.push({ date: dateStr, success: false, error: error.message });
        logger.error(`❌ Error syncing ${dateStr}:`, error.message);
      }
    }

    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    logger.info('✅ RESYNC PERIOD COMPLETE');
    logger.info(`📊 Results: ${successful} successful, ${failed} failed out of ${missingDates.length} missing dates`);
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    res.json({
      success: true,
      message: `Synced ${successful} missing dates`,
      period: { startDate, endDate },
      totalMissingDates: missingDates.length,
      successful,
      failed,
      results
    });
  } catch (error) {
    logger.error('Error resyncing period:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to resync period',
      message: error.message
    });
  }
};
