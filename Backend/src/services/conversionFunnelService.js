const { executeQuery } = require('../config/database');
const { logger } = require('../utils/logger');

/**
 * ConversionFunnelService
 *
 * Combines SEO metrics (Google Search Console) with commercial metrics (CRM)
 * to provide a unified conversion funnel view
 */
class ConversionFunnelService {
  /**
   * Get unified conversion funnel metrics for a date range
   *
   * @param {string} startDate - YYYY-MM-DD
   * @param {string} endDate - YYYY-MM-DD
   * @returns {object} Complete funnel metrics with conversion rates
   */
  async getFunnelMetrics(startDate, endDate) {
    try {
      logger.info(`📊 Getting funnel metrics from ${startDate} to ${endDate}`);

      // 1. Get SEO metrics (top of funnel)
      const seoMetrics = await this.getSEOMetrics(startDate, endDate);

      // 2. Get CRM metrics (middle/bottom of funnel)
      const crmMetrics = await this.getCRMMetrics(startDate, endDate);

      // 3. Calculate conversion rates
      const funnel = this.calculateConversionRates(seoMetrics, crmMetrics);

      logger.info(`✅ Funnel metrics calculated successfully`);

      return {
        success: true,
        period: {
          startDate,
          endDate,
          days: this.calculateDaysBetween(startDate, endDate)
        },
        seo: seoMetrics,
        crm: crmMetrics,
        funnel,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Error getting funnel metrics:', error);
      throw error;
    }
  }

  /**
   * Get SEO metrics from Google Search Console
   */
  async getSEOMetrics(startDate, endDate) {
    try {
      const rows = await executeQuery(
        `SELECT
          SUM(impressions) as totalImpressions,
          SUM(clicks) as totalClicks,
          AVG(position) as avgPosition
         FROM seo_metrics_history
         WHERE date >= ? AND date <= ?`,
        [startDate, endDate]
      );

      if (rows.length === 0 || !rows[0].totalImpressions) {
        return {
          impressions: 0,
          clicks: 0,
          ctr: 0,
          avgPosition: 0
        };
      }

      const data = rows[0];
      const ctr = data.totalImpressions > 0
        ? (data.totalClicks / data.totalImpressions) * 100
        : 0;

      return {
        impressions: parseInt(data.totalImpressions) || 0,
        clicks: parseInt(data.totalClicks) || 0,
        ctr: parseFloat(ctr.toFixed(2)),
        avgPosition: parseFloat(parseFloat(data.avgPosition).toFixed(2)) || 0
      };
    } catch (error) {
      logger.error('Error getting SEO metrics:', error);
      throw error;
    }
  }

  /**
   * Get CRM metrics (registrations, appointments, attendance, cancellations)
   */
  async getCRMMetrics(startDate, endDate) {
    try {
      // Get patient registrations in period
      const registrations = await executeQuery(
        `SELECT COUNT(*) as count
         FROM patients
         WHERE DATE(created_at) >= ? AND DATE(created_at) <= ?`,
        [startDate, endDate]
      );

      // Get appointments scheduled in period
      const appointments = await executeQuery(
        `SELECT COUNT(*) as count
         FROM appointments
         WHERE DATE(scheduled_date) >= ? AND DATE(scheduled_date) <= ?
         AND status != 'cancelled'`,
        [startDate, endDate]
      );

      // Get appointments attended (confirmed/completed)
      const attendance = await executeQuery(
        `SELECT COUNT(*) as count
         FROM appointments
         WHERE DATE(scheduled_date) >= ? AND DATE(scheduled_date) <= ?
         AND status IN ('confirmed', 'completed')`,
        [startDate, endDate]
      );

      // Get cancellations
      const cancellations = await executeQuery(
        `SELECT COUNT(*) as count
         FROM appointments
         WHERE DATE(scheduled_date) >= ? AND DATE(scheduled_date) <= ?
         AND status = 'cancelled'`,
        [startDate, endDate]
      );

      return {
        registrations: parseInt(registrations[0]?.count) || 0,
        appointments: parseInt(appointments[0]?.count) || 0,
        attendance: parseInt(attendance[0]?.count) || 0,
        cancellations: parseInt(cancellations[0]?.count) || 0
      };
    } catch (error) {
      logger.error('Error getting CRM metrics:', error);
      throw error;
    }
  }

  /**
   * Calculate conversion rates for each funnel step
   */
  calculateConversionRates(seo, crm) {
    // Calculate conversion rates (handle division by zero)
    const clickToRegistration = seo.clicks > 0
      ? (crm.registrations / seo.clicks) * 100
      : 0;

    const registrationToAppointment = crm.registrations > 0
      ? (crm.appointments / crm.registrations) * 100
      : 0;

    const appointmentToAttendance = crm.appointments > 0
      ? (crm.attendance / crm.appointments) * 100
      : 0;

    const impressionToClick = seo.impressions > 0
      ? (seo.clicks / seo.impressions) * 100
      : 0;

    const impressionToRegistration = seo.impressions > 0
      ? (crm.registrations / seo.impressions) * 100
      : 0;

    const clickToAttendance = seo.clicks > 0
      ? (crm.attendance / seo.clicks) * 100
      : 0;

    return {
      // Step-by-step conversion rates
      impressionToClick: parseFloat(impressionToClick.toFixed(2)),
      clickToRegistration: parseFloat(clickToRegistration.toFixed(2)),
      registrationToAppointment: parseFloat(registrationToAppointment.toFixed(2)),
      appointmentToAttendance: parseFloat(appointmentToAttendance.toFixed(2)),

      // Overall conversion rates
      impressionToRegistration: parseFloat(impressionToRegistration.toFixed(2)),
      clickToAttendance: parseFloat(clickToAttendance.toFixed(2)),

      // Cancellation rate
      cancellationRate: crm.appointments > 0
        ? parseFloat(((crm.cancellations / crm.appointments) * 100).toFixed(2))
        : 0
    };
  }

  /**
   * Calculate days between two dates
   */
  calculateDaysBetween(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Include both start and end date
  }

  /**
   * Get daily breakdown for trend analysis
   */
  async getDailyBreakdown(startDate, endDate) {
    try {
      // Get daily SEO metrics
      const seoDaily = await executeQuery(
        `SELECT
          date,
          impressions,
          clicks,
          ctr,
          position
         FROM seo_metrics_history
         WHERE date >= ? AND date <= ?
         ORDER BY date ASC`,
        [startDate, endDate]
      );

      // Get daily registrations
      const registrationsDaily = await executeQuery(
        `SELECT
          DATE(created_at) as date,
          COUNT(*) as count
         FROM patients
         WHERE DATE(created_at) >= ? AND DATE(created_at) <= ?
         GROUP BY DATE(created_at)
         ORDER BY date ASC`,
        [startDate, endDate]
      );

      // Get daily appointments
      const appointmentsDaily = await executeQuery(
        `SELECT
          DATE(scheduled_date) as date,
          COUNT(*) as count
         FROM appointments
         WHERE DATE(scheduled_date) >= ? AND DATE(scheduled_date) <= ?
         AND status != 'cancelled'
         GROUP BY DATE(scheduled_date)
         ORDER BY date ASC`,
        [startDate, endDate]
      );

      // Merge all daily data
      const dailyMap = new Map();

      seoDaily.forEach(row => {
        const dateStr = row.date.toISOString().split('T')[0];
        dailyMap.set(dateStr, {
          date: dateStr,
          impressions: row.impressions || 0,
          clicks: row.clicks || 0,
          ctr: parseFloat(row.ctr) || 0,
          position: parseFloat(row.position) || 0,
          registrations: 0,
          appointments: 0
        });
      });

      registrationsDaily.forEach(row => {
        const dateStr = row.date.toISOString().split('T')[0];
        if (dailyMap.has(dateStr)) {
          dailyMap.get(dateStr).registrations = row.count;
        }
      });

      appointmentsDaily.forEach(row => {
        const dateStr = row.date.toISOString().split('T')[0];
        if (dailyMap.has(dateStr)) {
          dailyMap.get(dateStr).appointments = row.count;
        }
      });

      return {
        success: true,
        data: Array.from(dailyMap.values())
      };
    } catch (error) {
      logger.error('Error getting daily breakdown:', error);
      throw error;
    }
  }
}

module.exports = new ConversionFunnelService();
