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

    const keywords = JSON.parse(rows[0].top_keywords || '[]').slice(0, limit);

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

    const pages = JSON.parse(rows[0].top_pages || '[]').slice(0, limit);

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
