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
   * Now includes detailed status breakdown from patient_leads table
   */
  async getCRMMetrics(startDate, endDate) {
    try {
      // Get patient registrations in period (all new leads)
      const registrations = await executeQuery(
        `SELECT COUNT(*) as count
         FROM patient_leads
         WHERE DATE(created_at) >= ? AND DATE(created_at) <= ?`,
        [startDate, endDate]
      );

      // Get HISTORICAL status breakdown (how many reached each status)
      // This uses patient_status_history to count patients who REACHED each stage,
      // not just those currently in each stage
      let statusCounts = {
        novo: 0,
        contatado: 0,
        agendado: 0,
        avaliacao_inicial: 0,
        atribuido: 0,
        convertido: 0,
        cancelado: 0
      };

      try {
        // Try to get historical counts from patient_status_history
        const historicalCounts = await this.getHistoricalStatusCounts(startDate, endDate);
        statusCounts = historicalCounts;
      } catch (historyError) {
        // Fallback: If patient_status_history doesn't exist, use current status
        logger.warn('Using current status counts (patient_status_history not available)');
        const statusBreakdown = await executeQuery(
          `SELECT
            status,
            COUNT(*) as count
           FROM patient_leads
           WHERE DATE(created_at) >= ? AND DATE(created_at) <= ?
           GROUP BY status`,
          [startDate, endDate]
        );

        statusBreakdown.forEach(row => {
          statusCounts[row.status] = parseInt(row.count) || 0;
        });
      }

      // Legacy appointments table support (if it exists)
      let appointments = 0;
      let attendance = 0;
      let cancellations = 0;

      try {
        const appointmentsResult = await executeQuery(
          `SELECT COUNT(*) as count
           FROM appointments
           WHERE DATE(scheduled_date) >= ? AND DATE(scheduled_date) <= ?
           AND status != 'cancelled'`,
          [startDate, endDate]
        );
        appointments = parseInt(appointmentsResult[0]?.count) || 0;

        const attendanceResult = await executeQuery(
          `SELECT COUNT(*) as count
           FROM appointments
           WHERE DATE(scheduled_date) >= ? AND DATE(scheduled_date) <= ?
           AND status IN ('confirmed', 'completed')`,
          [startDate, endDate]
        );
        attendance = parseInt(attendanceResult[0]?.count) || 0;

        const cancellationsResult = await executeQuery(
          `SELECT COUNT(*) as count
           FROM appointments
           WHERE DATE(scheduled_date) >= ? AND DATE(scheduled_date) <= ?
           AND status = 'cancelled'`,
          [startDate, endDate]
        );
        cancellations = parseInt(cancellationsResult[0]?.count) || 0;
      } catch (err) {
        // Appointments table doesn't exist, use status counts instead
        logger.warn('Appointments table not found, using patient_leads status');
        appointments = statusCounts.agendado;
        attendance = statusCounts.atribuido + statusCounts.convertido;
        cancellations = statusCounts.cancelado;
      }

      return {
        registrations: parseInt(registrations[0]?.count) || 0,
        appointments: appointments || statusCounts.agendado,
        attendance: attendance || (statusCounts.atribuido + statusCounts.convertido),
        cancellations: cancellations || statusCounts.cancelado,
        // New detailed status breakdown
        statusBreakdown: statusCounts
      };
    } catch (error) {
      logger.error('Error getting CRM metrics:', error);
      throw error;
    }
  }

  /**
   * Get historical status counts from patient_status_history
   * This counts how many patients REACHED each status, not how many are currently in it
   *
   * @param {string} startDate - YYYY-MM-DD
   * @param {string} endDate - YYYY-MM-DD
   * @returns {object} Historical counts for each status
   */
  async getHistoricalStatusCounts(startDate, endDate) {
    try {
      // Count distinct patients who reached each status in the period
      const query = `
        SELECT
          h.new_status as status,
          COUNT(DISTINCT h.patient_id) as count
        FROM patient_status_history h
        INNER JOIN patient_leads p ON h.patient_id = p.id
        WHERE DATE(p.created_at) >= ? AND DATE(p.created_at) <= ?
        GROUP BY h.new_status
      `;

      const results = await executeQuery(query, [startDate, endDate]);

      // Initialize counts
      const statusCounts = {
        novo: 0,
        contatado: 0,
        agendado: 0,
        avaliacao_inicial: 0,
        atribuido: 0,
        convertido: 0,
        cancelado: 0
      };

      // Fill in the counts from query results
      results.forEach(row => {
        if (statusCounts.hasOwnProperty(row.status)) {
          statusCounts[row.status] = parseInt(row.count) || 0;
        }
      });

      // Important: 'novo' should equal total registrations since all patients start as 'novo'
      // Get total registrations to set 'novo' count correctly
      const registrations = await executeQuery(
        `SELECT COUNT(*) as count
         FROM patient_leads
         WHERE DATE(created_at) >= ? AND DATE(created_at) <= ?`,
        [startDate, endDate]
      );
      statusCounts.novo = parseInt(registrations[0]?.count) || 0;

      logger.info(`Historical status counts: ${JSON.stringify(statusCounts)}`);
      return statusCounts;
    } catch (error) {
      logger.error('Error getting historical status counts:', error);
      throw error;
    }
  }

  /**
   * Calculate conversion rates for each funnel step
   * Now includes detailed B2C patient journey stages
   */
  calculateConversionRates(seo, crm) {
    const status = crm.statusBreakdown || {};

    // SEO to CRM conversion (top of funnel)
    const impressionToClick = seo.impressions > 0
      ? (seo.clicks / seo.impressions) * 100
      : 0;

    const clickToRegistration = seo.clicks > 0
      ? (crm.registrations / seo.clicks) * 100
      : 0;

    const impressionToRegistration = seo.impressions > 0
      ? (crm.registrations / seo.impressions) * 100
      : 0;

    // New detailed B2C patient journey conversion rates
    const novoToContatado = crm.registrations > 0
      ? (status.contatado / crm.registrations) * 100
      : 0;

    const contatadoToAgendado = status.contatado > 0
      ? (status.agendado / status.contatado) * 100
      : 0;

    const agendadoToAvaliacaoInicial = status.agendado > 0
      ? (status.avaliacao_inicial / status.agendado) * 100
      : 0;

    const avaliacaoInicialToAtribuido = status.avaliacao_inicial > 0
      ? (status.atribuido / status.avaliacao_inicial) * 100
      : 0;

    const atribuidoToConvertido = status.atribuido > 0
      ? (status.convertido / status.atribuido) * 100
      : 0;

    // Legacy metrics (backward compatibility)
    const registrationToAppointment = crm.registrations > 0
      ? (crm.appointments / crm.registrations) * 100
      : 0;

    const appointmentToAttendance = crm.appointments > 0
      ? (crm.attendance / crm.appointments) * 100
      : 0;

    const clickToAttendance = seo.clicks > 0
      ? (status.avaliacao_inicial / seo.clicks) * 100
      : 0;

    // Cancellation rate
    const cancellationRate = crm.registrations > 0
      ? (status.cancelado / crm.registrations) * 100
      : 0;

    return {
      // SEO funnel (legacy)
      impressionToClick: parseFloat(impressionToClick.toFixed(2)),
      clickToRegistration: parseFloat(clickToRegistration.toFixed(2)),
      impressionToRegistration: parseFloat(impressionToRegistration.toFixed(2)),

      // Legacy CRM funnel
      registrationToAppointment: parseFloat(registrationToAppointment.toFixed(2)),
      appointmentToAttendance: parseFloat(appointmentToAttendance.toFixed(2)),
      clickToAttendance: parseFloat(clickToAttendance.toFixed(2)),

      // New detailed B2C patient journey (7 stages)
      novoToContatado: parseFloat(novoToContatado.toFixed(2)),
      contatadoToAgendado: parseFloat(contatadoToAgendado.toFixed(2)),
      agendadoToAvaliacaoInicial: parseFloat(agendadoToAvaliacaoInicial.toFixed(2)),
      avaliacaoInicialToAtribuido: parseFloat(avaliacaoInicialToAtribuido.toFixed(2)),
      atribuidoToConvertido: parseFloat(atribuidoToConvertido.toFixed(2)),

      // Cancellation rate
      cancellationRate: parseFloat(cancellationRate.toFixed(2))
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
   * Get detailed funnel metrics with status history and average transition times
   * This method uses the patient_status_history table for accurate funnel analysis
   *
   * @param {string} startDate - YYYY-MM-DD
   * @param {string} endDate - YYYY-MM-DD
   * @returns {object} Detailed funnel with timing analysis
   */
  async getDetailedFunnelMetrics(startDate, endDate) {
    try {
      logger.info(`📊 Getting DETAILED funnel metrics from ${startDate} to ${endDate}`);

      // 1. Get SEO metrics (same as before)
      const seoMetrics = await this.getSEOMetrics(startDate, endDate);

      // 2. Get CRM metrics with status breakdown (same as before)
      const crmMetrics = await this.getCRMMetrics(startDate, endDate);

      // 3. Get average time between status transitions
      const transitionTimes = await this.getTransitionTimes(startDate, endDate);

      // 4. Get cancellation breakdown by stage
      const cancellationBreakdown = await this.getCancellationBreakdown(startDate, endDate);

      // 5. Calculate conversion rates (same as before)
      const conversions = this.calculateConversionRates(seoMetrics, crmMetrics);

      logger.info(`✅ Detailed funnel metrics calculated successfully`);

      return {
        success: true,
        period: {
          startDate,
          endDate,
          days: this.calculateDaysBetween(startDate, endDate)
        },
        seo: seoMetrics,
        crm: crmMetrics,
        conversions,
        transitionTimes,
        cancellationBreakdown,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Error getting detailed funnel metrics:', error);
      throw error;
    }
  }

  /**
   * Get average time (in hours) between each status transition
   * Uses patient_status_history table
   */
  async getTransitionTimes(startDate, endDate) {
    try {
      const query = `
        SELECT
          h1.new_status as from_status,
          h2.new_status as to_status,
          COUNT(*) as occurrences,
          ROUND(AVG(TIMESTAMPDIFF(HOUR, h1.changed_at, h2.changed_at)), 2) as avg_hours,
          ROUND(MIN(TIMESTAMPDIFF(HOUR, h1.changed_at, h2.changed_at)), 2) as min_hours,
          ROUND(MAX(TIMESTAMPDIFF(HOUR, h1.changed_at, h2.changed_at)), 2) as max_hours,
          ROUND(STDDEV(TIMESTAMPDIFF(HOUR, h1.changed_at, h2.changed_at)), 2) as stddev_hours
        FROM patient_status_history h1
        JOIN patient_status_history h2 ON h1.patient_id = h2.patient_id
        WHERE h2.id = (
          SELECT MIN(id)
          FROM patient_status_history
          WHERE patient_id = h1.patient_id
            AND id > h1.id
        )
        AND h1.changed_at >= ? AND h1.changed_at <= ?
        GROUP BY h1.new_status, h2.new_status
        ORDER BY
          FIELD(h1.new_status, 'novo', 'contatado', 'agendado', 'avaliacao_inicial', 'atribuido', 'convertido', 'cancelado'),
          FIELD(h2.new_status, 'novo', 'contatado', 'agendado', 'avaliacao_inicial', 'atribuido', 'convertido', 'cancelado')
      `;

      const results = await executeQuery(query, [startDate, endDate]);

      // Format results into a more usable structure
      const transitions = {};
      results.forEach(row => {
        const key = `${row.from_status}_to_${row.to_status}`;
        transitions[key] = {
          fromStatus: row.from_status,
          toStatus: row.to_status,
          occurrences: parseInt(row.occurrences),
          avgHours: parseFloat(row.avg_hours) || 0,
          minHours: parseFloat(row.min_hours) || 0,
          maxHours: parseFloat(row.max_hours) || 0,
          stddevHours: parseFloat(row.stddev_hours) || 0,
          avgDays: parseFloat(((row.avg_hours || 0) / 24).toFixed(2))
        };
      });

      return transitions;
    } catch (error) {
      logger.error('Error getting transition times:', error);
      // Return empty object if patient_status_history table doesn't exist yet
      return {};
    }
  }

  /**
   * Get breakdown of cancellations by previous status
   * Shows at which stage patients are cancelling most
   */
  async getCancellationBreakdown(startDate, endDate) {
    try {
      const query = `
        SELECT
          h.previous_status as from_status,
          COUNT(*) as count
        FROM patient_status_history h
        WHERE h.new_status = 'cancelado'
          AND h.changed_at >= ? AND h.changed_at <= ?
          AND h.previous_status IS NOT NULL
        GROUP BY h.previous_status
        ORDER BY count DESC
      `;

      const results = await executeQuery(query, [startDate, endDate]);

      // Format results
      const breakdown = {
        novoToCancelado: 0,
        contatadoToCancelado: 0,
        agendadoToCancelado: 0,
        avaliacaoInicialToCancelado: 0,
        atribuidoToCancelado: 0
      };

      results.forEach(row => {
        const key = `${row.from_status}ToCancelado`;
        breakdown[key] = parseInt(row.count) || 0;
      });

      // Calculate total cancellations
      breakdown.total = Object.values(breakdown).reduce((sum, count) => sum + count, 0);

      return breakdown;
    } catch (error) {
      logger.error('Error getting cancellation breakdown:', error);
      // Return zero counts if patient_status_history table doesn't exist yet
      return {
        novoToCancelado: 0,
        contatadoToCancelado: 0,
        agendadoToCancelado: 0,
        avaliacaoInicialToCancelado: 0,
        atribuidoToCancelado: 0,
        total: 0
      };
    }
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

      // Get daily registrations from patient_leads
      const registrationsDaily = await executeQuery(
        `SELECT
          DATE(created_at) as date,
          COUNT(*) as count
         FROM patient_leads
         WHERE DATE(created_at) >= ? AND DATE(created_at) <= ?
         GROUP BY DATE(created_at)
         ORDER BY date ASC`,
        [startDate, endDate]
      );

      // Get daily status breakdown from patient_leads
      const statusDaily = await executeQuery(
        `SELECT
          DATE(created_at) as date,
          status,
          COUNT(*) as count
         FROM patient_leads
         WHERE DATE(created_at) >= ? AND DATE(created_at) <= ?
         GROUP BY DATE(created_at), status
         ORDER BY date ASC`,
        [startDate, endDate]
      );

      // Get daily appointments (legacy support)
      let appointmentsDaily = [];
      try {
        appointmentsDaily = await executeQuery(
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
      } catch (err) {
        logger.warn('Appointments table not found for daily breakdown');
      }

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
          appointments: 0,
          // New detailed status breakdown
          statusBreakdown: {
            novo: 0,
            contatado: 0,
            agendado: 0,
            avaliacao_inicial: 0,
            atribuido: 0,
            convertido: 0,
            cancelado: 0
          }
        });
      });

      registrationsDaily.forEach(row => {
        const dateStr = row.date.toISOString().split('T')[0];
        if (dailyMap.has(dateStr)) {
          dailyMap.get(dateStr).registrations = row.count;
        } else {
          // Create entry if not exists (in case there's CRM data but no SEO data for that day)
          dailyMap.set(dateStr, {
            date: dateStr,
            impressions: 0,
            clicks: 0,
            ctr: 0,
            position: 0,
            registrations: row.count,
            appointments: 0,
            statusBreakdown: {
              novo: 0,
              contatado: 0,
              agendado: 0,
              avaliacao_inicial: 0,
              atribuido: 0,
              convertido: 0,
              cancelado: 0
            }
          });
        }
      });

      // Add status breakdown to each day
      statusDaily.forEach(row => {
        const dateStr = row.date.toISOString().split('T')[0];
        if (dailyMap.has(dateStr)) {
          dailyMap.get(dateStr).statusBreakdown[row.status] = row.count;
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
