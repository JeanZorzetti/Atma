const { google } = require('googleapis');
const { executeQuery } = require('../config/database');
const { logger } = require('../utils/logger');

/**
 * GoogleSearchConsoleService
 *
 * Service layer for interacting with Google Search Console API
 * Handles authentication, data fetching, and database synchronization
 */
class GoogleSearchConsoleService {
  constructor() {
    this.oauth2Client = null;
    this.searchconsole = null;
    this.siteUrl = process.env.SEARCH_CONSOLE_SITE_URL || 'https://atma.roilabs.com.br';
    this.init();
  }

  /**
   * Initialize OAuth2 client
   */
  init() {
    try {
      this.oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/api/search-console/auth/callback'
      );

      this.searchconsole = google.searchconsole({
        version: 'v1',
        auth: this.oauth2Client
      });

      logger.info('✅ GoogleSearchConsoleService initialized');
    } catch (error) {
      logger.error('❌ Error initializing GoogleSearchConsoleService:', error);
    }
  }

  /**
   * Get stored OAuth tokens from database
   */
  async getStoredTokens() {
    try {
      const rows = await executeQuery(
        'SELECT * FROM google_auth_tokens ORDER BY created_at DESC LIMIT 1'
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
        return await this.refreshAccessToken(token.refresh_token);
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
  async refreshAccessToken(refreshToken) {
    try {
      this.oauth2Client.setCredentials({
        refresh_token: refreshToken
      });

      const { credentials } = await this.oauth2Client.refreshAccessToken();

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
   * Ensure we have valid authentication before API calls
   */
  async authenticate() {
    const tokens = await this.getStoredTokens();

    if (!tokens) {
      throw new Error('Not authenticated with Google Search Console. Please authorize first.');
    }

    this.oauth2Client.setCredentials(tokens);
    return true;
  }

  /**
   * Fetch SEO metrics from Google Search Console for a date range
   *
   * @param {string} startDate - YYYY-MM-DD format
   * @param {string} endDate - YYYY-MM-DD format
   * @param {string} dimensions - 'query', 'page', or 'date'
   * @param {number} rowLimit - Max rows to return
   */
  async fetchMetrics(startDate, endDate, dimensions = ['date'], rowLimit = 1000) {
    try {
      await this.authenticate();

      logger.info(`📊 Fetching Search Console data: ${startDate} to ${endDate}`);

      const response = await this.searchconsole.searchanalytics.query({
        siteUrl: this.siteUrl,
        requestBody: {
          startDate,
          endDate,
          dimensions,
          rowLimit,
          dataState: 'final' // Use 'all' for fresh data, 'final' for stable data
        }
      });

      const rows = response.data.rows || [];
      logger.info(`✅ Retrieved ${rows.length} rows from Search Console`);

      return rows;
    } catch (error) {
      logger.error('Error fetching Search Console metrics:', error);
      throw error;
    }
  }

  /**
   * Sync daily metrics to database
   * Fetches data for a specific date and stores in seo_metrics_history
   *
   * @param {string} date - YYYY-MM-DD format
   */
  async syncDailyMetrics(date) {
    try {
      logger.info(`🔄 Syncing metrics for ${date}...`);

      // Fetch daily aggregated metrics
      const dailyData = await this.fetchMetrics(date, date, ['date']);

      if (dailyData.length === 0) {
        logger.warn(`⚠️ No data available for ${date}`);
        return { success: false, message: 'No data available for this date' };
      }

      const dayMetrics = dailyData[0];

      // Fetch top 20 keywords
      const keywordsData = await this.fetchMetrics(date, date, ['query'], 20);
      const topKeywords = keywordsData.map(row => ({
        query: row.keys[0],
        impressions: row.impressions,
        clicks: row.clicks,
        ctr: row.ctr,
        position: row.position
      }));

      // Fetch top 20 pages
      const pagesData = await this.fetchMetrics(date, date, ['page'], 20);
      const topPages = pagesData.map(row => ({
        page: row.keys[0],
        impressions: row.impressions,
        clicks: row.clicks,
        ctr: row.ctr,
        position: row.position
      }));

      // Insert or update database
      await executeQuery(
        `INSERT INTO seo_metrics_history
          (date, impressions, clicks, ctr, position, top_keywords, top_pages, synced_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
         ON DUPLICATE KEY UPDATE
          impressions = VALUES(impressions),
          clicks = VALUES(clicks),
          ctr = VALUES(ctr),
          position = VALUES(position),
          top_keywords = VALUES(top_keywords),
          top_pages = VALUES(top_pages),
          synced_at = NOW()`,
        [
          date,
          dayMetrics.impressions,
          dayMetrics.clicks,
          (dayMetrics.ctr * 100).toFixed(2), // Convert to percentage
          dayMetrics.position.toFixed(2),
          JSON.stringify(topKeywords),
          JSON.stringify(topPages)
        ]
      );

      logger.info(`✅ Synced metrics for ${date}: ${dayMetrics.clicks} clicks, ${dayMetrics.impressions} impressions`);

      // Check for alerts (significant changes)
      await this.checkForAlerts(date, dayMetrics);

      return {
        success: true,
        date,
        metrics: dayMetrics,
        topKeywords: topKeywords.length,
        topPages: topPages.length
      };
    } catch (error) {
      logger.error(`Error syncing metrics for ${date}:`, error);
      throw error;
    }
  }

  /**
   * Sync metrics for a date range
   *
   * @param {string} startDate - YYYY-MM-DD
   * @param {string} endDate - YYYY-MM-DD
   */
  async syncDateRange(startDate, endDate) {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const results = [];

      logger.info(`🔄 Syncing metrics from ${startDate} to ${endDate}...`);

      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        const dateStr = date.toISOString().split('T')[0];

        try {
          const result = await this.syncDailyMetrics(dateStr);
          results.push(result);

          // Delay to avoid rate limiting (1 second between requests)
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          logger.error(`Failed to sync ${dateStr}:`, error.message);
          results.push({ success: false, date: dateStr, error: error.message });
        }
      }

      const successful = results.filter(r => r.success).length;
      logger.info(`✅ Synced ${successful}/${results.length} days successfully`);

      return {
        success: true,
        total: results.length,
        successful,
        failed: results.length - successful,
        results
      };
    } catch (error) {
      logger.error('Error syncing date range:', error);
      throw error;
    }
  }

  /**
   * Check for significant metric changes and create alerts
   *
   * @param {string} date - Current date (YYYY-MM-DD)
   * @param {object} currentMetrics - Current day metrics
   */
  async checkForAlerts(date, currentMetrics) {
    try {
      // Get previous day metrics
      const [previousRows] = await db.query(
        `SELECT * FROM seo_metrics_history
         WHERE date < ?
         ORDER BY date DESC
         LIMIT 1`,
        [date]
      );

      if (previousRows.length === 0) {
        // No previous data to compare
        return;
      }

      const previousMetrics = previousRows[0];

      // Check for significant drops
      const alerts = [];

      // Impressions drop
      const impressionsChange = ((currentMetrics.impressions - previousMetrics.impressions) / previousMetrics.impressions) * 100;
      if (impressionsChange < -20) {
        alerts.push({
          type: 'impressions_drop',
          severity: impressionsChange < -50 ? 'critical' : 'warning',
          message: `Impressions dropped by ${Math.abs(impressionsChange).toFixed(1)}%`,
          metric_name: 'impressions',
          metric_value: currentMetrics.impressions,
          previous_value: previousMetrics.impressions,
          change_percentage: impressionsChange,
          date
        });
      }

      // Clicks drop
      const clicksChange = ((currentMetrics.clicks - previousMetrics.clicks) / previousMetrics.clicks) * 100;
      if (clicksChange < -20) {
        alerts.push({
          type: 'clicks_drop',
          severity: clicksChange < -50 ? 'critical' : 'warning',
          message: `Clicks dropped by ${Math.abs(clicksChange).toFixed(1)}%`,
          metric_name: 'clicks',
          metric_value: currentMetrics.clicks,
          previous_value: previousMetrics.clicks,
          change_percentage: clicksChange,
          date
        });
      }

      // Position drop (higher number = worse position)
      const positionChange = ((currentMetrics.position - previousMetrics.position) / previousMetrics.position) * 100;
      if (positionChange > 20) {
        alerts.push({
          type: 'position_drop',
          severity: positionChange > 50 ? 'critical' : 'warning',
          message: `Average position dropped by ${positionChange.toFixed(1)}%`,
          metric_name: 'position',
          metric_value: currentMetrics.position,
          previous_value: previousMetrics.position,
          change_percentage: positionChange,
          date
        });
      }

      // Insert alerts into database
      for (const alert of alerts) {
        await executeQuery(
          `INSERT INTO seo_alerts
            (type, severity, message, metric_name, metric_value, previous_value, change_percentage, date)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            alert.type,
            alert.severity,
            alert.message,
            alert.metric_name,
            alert.metric_value,
            alert.previous_value,
            alert.change_percentage,
            alert.date
          ]
        );

        logger.warn(`🚨 Alert created: ${alert.message}`);
      }
    } catch (error) {
      logger.error('Error checking for alerts:', error);
      // Don't throw - alerts are non-critical
    }
  }

  /**
   * Get metrics summary for dashboard
   *
   * @param {number} days - Number of days to include (default: 30)
   * @param {string} startDate - Optional start date (YYYY-MM-DD)
   * @param {string} endDate - Optional end date (YYYY-MM-DD)
   */
  async getMetricsSummary(days = 30, startDate = null, endDate = null) {
    try {
      let query;
      let params;

      // If specific dates provided, use them; otherwise use days from current date
      if (startDate && endDate) {
        query = `SELECT
          date,
          impressions,
          clicks,
          ctr,
          position
         FROM seo_metrics_history
         WHERE date >= ? AND date <= ?
         ORDER BY date DESC`;
        params = [startDate, endDate];
      } else {
        query = `SELECT
          date,
          impressions,
          clicks,
          ctr,
          position
         FROM seo_metrics_history
         WHERE date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
         ORDER BY date DESC`;
        params = [days];
      }

      const rows = await executeQuery(query, params);

      if (rows.length === 0) {
        return {
          success: true,
          data: [],
          summary: null
        };
      }

      // Calculate summary statistics
      const totalImpressions = rows.reduce((sum, row) => sum + row.impressions, 0);
      const totalClicks = rows.reduce((sum, row) => sum + row.clicks, 0);
      // Calculate actual CTR from totals (not average of daily CTRs)
      const actualCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
      const avgPosition = rows.reduce((sum, row) => sum + parseFloat(row.position), 0) / rows.length;

      return {
        success: true,
        data: rows,
        summary: {
          totalImpressions,
          totalClicks,
          avgCtr: actualCtr.toFixed(2),
          avgPosition: avgPosition.toFixed(2),
          days: rows.length
        }
      };
    } catch (error) {
      logger.error('Error getting metrics summary:', error);
      throw error;
    }
  }

  /**
   * Get unresolved alerts
   */
  async getUnresolvedAlerts() {
    try {
      const rows = await executeQuery(
        `SELECT * FROM seo_alerts
         WHERE resolved = FALSE
         ORDER BY created_at DESC
         LIMIT 50`
      );

      return {
        success: true,
        alerts: rows,
        count: rows.length
      };
    } catch (error) {
      logger.error('Error getting unresolved alerts:', error);
      throw error;
    }
  }

  /**
   * Resolve alert by ID
   */
  async resolveAlert(alertId, userId = null) {
    try {
      await executeQuery(
        `UPDATE seo_alerts
         SET resolved = TRUE, resolved_at = NOW(), resolved_by = ?
         WHERE id = ?`,
        [userId, alertId]
      );

      logger.info(`✅ Alert ${alertId} resolved`);

      return {
        success: true,
        message: 'Alert resolved successfully'
      };
    } catch (error) {
      logger.error('Error resolving alert:', error);
      throw error;
    }
  }
}

// Export singleton instance
module.exports = new GoogleSearchConsoleService();
