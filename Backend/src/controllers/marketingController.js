const { logger } = require('../utils/logger');
const { getDB } = require('../config/database');
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

/**
 * Controller para métricas de marketing
 * Agrega dados de várias fontes para o dashboard de marketing
 */

// Função para calcular período de datas baseado no range
const getDateRange = (range) => {
  const endDate = new Date();
  let startDate = new Date();

  switch (range) {
    case '7d':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(endDate.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(endDate.getDate() - 90);
      break;
    case '1y':
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
    default:
      startDate.setDate(endDate.getDate() - 30);
  }

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0]
  };
};

// Função para buscar métricas reais do Google Analytics Data API
const getGoogleAnalyticsMetrics = async (startDate, endDate) => {
  try {
    // Verificar configurações no banco
    const pool = getDB();
    if (!pool) {
      throw new Error('Database connection not available');
    }

    const [gaSettings] = await pool.execute(`
      SELECT setting_key, setting_value
      FROM system_settings
      WHERE setting_key IN ('ga_property_id', 'ga_service_account_key', 'integration_google_analytics')
    `);

    const settings = {};
    gaSettings.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });

    const isGAEnabled = settings.integration_google_analytics === 'true';
    const hasPropertyId = settings.ga_property_id && settings.ga_property_id.trim() !== '';
    const hasServiceAccount = settings.ga_service_account_key && settings.ga_service_account_key.trim() !== '';

    logger.info(`🔍 Google Analytics Data API Status:`, {
      enabled: isGAEnabled,
      propertyId: hasPropertyId ? `${settings.ga_property_id?.substring(0, 8)}...` : 'Não configurado',
      serviceAccount: hasServiceAccount ? 'Configurado' : 'Não configurado',
      fullyConfigured: isGAEnabled && hasPropertyId && hasServiceAccount
    });

    if (!isGAEnabled) {
      return {
        totalVisits: 0,
        bounceRate: 0,
        avgSessionDuration: '0:00',
        pagesPerSession: 0,
        configured: false,
        configStatus: {
          enabled: false,
          propertyId: hasPropertyId,
          serviceAccount: hasServiceAccount,
          message: 'Integração Google Analytics não está ativada'
        }
      };
    }

    if (!hasPropertyId || !hasServiceAccount) {
      return {
        totalVisits: 0,
        bounceRate: 0,
        avgSessionDuration: '0:00',
        pagesPerSession: 0,
        configured: false,
        configStatus: {
          enabled: isGAEnabled,
          propertyId: hasPropertyId,
          serviceAccount: hasServiceAccount,
          message: 'Configuração incompleta - falta Property ID ou Service Account'
        }
      };
    }

    // Tentar buscar dados reais do Google Analytics
    try {
      // Parse do Service Account JSON
      const serviceAccountKey = JSON.parse(settings.ga_service_account_key);

      // Criar cliente com credenciais
      const analyticsDataClient = new BetaAnalyticsDataClient({
        credentials: serviceAccountKey,
        projectId: serviceAccountKey.project_id
      });

      const propertyId = settings.ga_property_id;

      // Formatar datas para GA4
      const formatDate = (date) => {
        const d = new Date(date);
        return d.toISOString().split('T')[0]; // YYYY-MM-DD
      };

      // Buscar métricas básicas
      const [response] = await analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [
          {
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
          },
        ],
        metrics: [
          // Traffic Metrics
          { name: 'sessions' },
          { name: 'screenPageViews' },
          { name: 'totalUsers' },
          { name: 'activeUsers' },
          { name: 'newUsers' },

          // Engagement Metrics
          { name: 'engagementRate' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' },
          { name: 'userEngagementDuration' },
          { name: 'sessionsPerUser' },
          { name: 'eventCount' },

          // Conversion Metrics
          { name: 'conversions' },
          { name: 'sessionConversionRate' },

          // E-commerce Metrics (if applicable)
          { name: 'totalRevenue' },
          { name: 'averageRevenuePerUser' },
          { name: 'firstTimePurchasers' }
        ],
        dimensions: [
          { name: 'country' },
          { name: 'deviceCategory' },
          { name: 'sessionSource' },
          { name: 'sessionMedium' }
        ]
      });

      // Processar dados expandidos
      const defaultMetrics = {
        // Traffic Metrics
        sessions: 0,
        screenPageViews: 0,
        totalUsers: 0,
        activeUsers: 0,
        newUsers: 0,

        // Engagement Metrics
        engagementRate: 0,
        averageSessionDuration: 0,
        bounceRate: 0,
        userEngagementDuration: 0,
        sessionsPerUser: 0,
        eventCount: 0,

        // Conversion Metrics
        conversions: 0,
        sessionConversionRate: 0,

        // E-commerce Metrics
        totalRevenue: 0,
        averageRevenuePerUser: 0,
        firstTimePurchasers: 0
      };

      let countryData = [];
      let deviceData = [];
      let sourceData = [];

      if (response.rows && response.rows.length > 0) {
        // Aggregate metrics from all rows
        let totalSessions = 0;
        let totalPageViews = 0;
        let totalUsers = 0;
        let totalActiveUsers = 0;
        let totalNewUsers = 0;
        let totalEngagementRate = 0;
        let totalSessionDuration = 0;
        let totalBounceRate = 0;
        let totalUserEngagement = 0;
        let totalSessionsPerUser = 0;
        let totalEventCount = 0;
        let totalConversions = 0;
        let totalSessionConversionRate = 0;
        let totalRevenue = 0;
        let totalARPU = 0;
        let totalFirstTimePurchasers = 0;

        response.rows.forEach(row => {
          const metrics = row.metricValues;
          const dimensions = row.dimensionValues;

          // Aggregate totals
          totalSessions += parseInt(metrics[0]?.value || '0');
          totalPageViews += parseInt(metrics[1]?.value || '0');
          totalUsers += parseInt(metrics[2]?.value || '0');
          totalActiveUsers += parseInt(metrics[3]?.value || '0');
          totalNewUsers += parseInt(metrics[4]?.value || '0');
          totalEngagementRate += parseFloat(metrics[5]?.value || '0');
          totalSessionDuration += parseFloat(metrics[6]?.value || '0');
          totalBounceRate += parseFloat(metrics[7]?.value || '0');
          totalUserEngagement += parseFloat(metrics[8]?.value || '0');
          totalSessionsPerUser += parseFloat(metrics[9]?.value || '0');
          totalEventCount += parseInt(metrics[10]?.value || '0');
          totalConversions += parseInt(metrics[11]?.value || '0');
          totalSessionConversionRate += parseFloat(metrics[12]?.value || '0');
          totalRevenue += parseFloat(metrics[13]?.value || '0');
          totalARPU += parseFloat(metrics[14]?.value || '0');
          totalFirstTimePurchasers += parseInt(metrics[15]?.value || '0');

          // Collect dimension data
          if (dimensions[0]) {
            countryData.push({ country: dimensions[0].value, sessions: parseInt(metrics[0]?.value || '0') });
          }
          if (dimensions[1]) {
            deviceData.push({ device: dimensions[1].value, sessions: parseInt(metrics[0]?.value || '0') });
          }
          if (dimensions[2] && dimensions[3]) {
            sourceData.push({
              source: dimensions[2].value,
              medium: dimensions[3].value,
              sessions: parseInt(metrics[0]?.value || '0')
            });
          }
        });

        // Calculate averages
        const rowCount = response.rows.length;
        defaultMetrics.sessions = totalSessions;
        defaultMetrics.screenPageViews = totalPageViews;
        defaultMetrics.totalUsers = totalUsers;
        defaultMetrics.activeUsers = totalActiveUsers;
        defaultMetrics.newUsers = totalNewUsers;
        defaultMetrics.engagementRate = totalEngagementRate / rowCount * 100;
        defaultMetrics.averageSessionDuration = totalSessionDuration / rowCount;
        defaultMetrics.bounceRate = totalBounceRate / rowCount * 100;
        defaultMetrics.userEngagementDuration = totalUserEngagement / rowCount;
        defaultMetrics.sessionsPerUser = totalSessionsPerUser / rowCount;
        defaultMetrics.eventCount = totalEventCount;
        defaultMetrics.conversions = totalConversions;
        defaultMetrics.sessionConversionRate = totalSessionConversionRate / rowCount * 100;
        defaultMetrics.totalRevenue = totalRevenue;
        defaultMetrics.averageRevenuePerUser = totalARPU / rowCount;
        defaultMetrics.firstTimePurchasers = totalFirstTimePurchasers;
      }

      // Converter duração média para formato legível
      const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      };

      logger.info(`✅ Dados reais obtidos do Google Analytics:`, {
        sessions: defaultMetrics.sessions,
        pageViews: defaultMetrics.screenPageViews,
        bounceRate: defaultMetrics.bounceRate.toFixed(1) + '%'
      });

      return {
        // Métricas básicas (compatibilidade)
        totalVisits: defaultMetrics.sessions,
        bounceRate: defaultMetrics.bounceRate.toFixed(1),
        avgSessionDuration: formatDuration(defaultMetrics.averageSessionDuration),
        pagesPerSession: defaultMetrics.sessions > 0 ? (defaultMetrics.screenPageViews / defaultMetrics.sessions).toFixed(1) : 0,

        // Novas métricas GA4 expandidas
        metrics: {
          // Traffic Metrics
          sessions: defaultMetrics.sessions,
          pageViews: defaultMetrics.screenPageViews,
          totalUsers: defaultMetrics.totalUsers,
          activeUsers: defaultMetrics.activeUsers,
          newUsers: defaultMetrics.newUsers,

          // Engagement Metrics
          engagementRate: defaultMetrics.engagementRate.toFixed(1),
          averageSessionDuration: formatDuration(defaultMetrics.averageSessionDuration),
          bounceRate: defaultMetrics.bounceRate.toFixed(1),
          userEngagementDuration: formatDuration(defaultMetrics.userEngagementDuration),
          sessionsPerUser: defaultMetrics.sessionsPerUser.toFixed(2),
          eventCount: defaultMetrics.eventCount,

          // Conversion Metrics
          conversions: defaultMetrics.conversions,
          sessionConversionRate: defaultMetrics.sessionConversionRate.toFixed(2),

          // E-commerce Metrics
          totalRevenue: defaultMetrics.totalRevenue.toFixed(2),
          averageRevenuePerUser: defaultMetrics.averageRevenuePerUser.toFixed(2),
          firstTimePurchasers: defaultMetrics.firstTimePurchasers
        },

        // Demographic & Device Data
        demographics: {
          countries: countryData.slice(0, 10), // Top 10 countries
          devices: deviceData,
          sources: sourceData.slice(0, 10) // Top 10 sources
        },

        configured: true,
        configStatus: {
          enabled: true,
          propertyId: true,
          serviceAccount: true,
          message: 'Dados reais obtidos do Google Analytics',
          dataSource: 'Google Analytics Data API v4'
        }
      };

    } catch (apiError) {
      logger.error('Erro ao buscar dados da API do Google Analytics:', apiError.message);

      return {
        totalVisits: 0,
        bounceRate: 0,
        avgSessionDuration: '0:00',
        pagesPerSession: 0,
        configured: false,
        configStatus: {
          enabled: isGAEnabled,
          propertyId: hasPropertyId,
          serviceAccount: hasServiceAccount,
          error: `Erro da API: ${apiError.message}`,
          message: 'Configurado mas falha ao obter dados'
        }
      };
    }

  } catch (error) {
    logger.error('Erro ao verificar configurações do Google Analytics:', error.message);
    logger.error('Stack trace:', error.stack);
    return {
      totalVisits: 0,
      bounceRate: 0,
      avgSessionDuration: '0:00',
      pagesPerSession: 0,
      configured: false,
      error: `Erro ao verificar configurações: ${error.message}`
    };
  }
};

// Função para buscar leads por fonte
const getLeadsBySource = async (startDate, endDate) => {
  try {
    const pool = getDB();
    if (!pool) {
      throw new Error('Database connection not available');
    }

    const [rows] = await pool.execute(`
      SELECT
        COALESCE(origem_lead, 'Não especificado') as source,
        COUNT(*) as count,
        ROUND((COUNT(*) * 100.0 / SUM(COUNT(*)) OVER()), 1) as conversion
      FROM crm_leads
      WHERE created_at BETWEEN ? AND ?
      GROUP BY origem_lead
      ORDER BY count DESC
    `, [startDate, endDate]);

    return rows;
  } catch (error) {
    logger.error('Erro ao buscar leads por fonte:', error);
    return [];
  }
};

// Função para buscar leads por status
const getLeadsByStatus = async (startDate, endDate) => {
  try {
    const pool = getDB();
    if (!pool) {
      throw new Error('Database connection not available');
    }

    const [rows] = await pool.execute(`
      SELECT
        status,
        COUNT(*) as count,
        ROUND((COUNT(*) * 100.0 / SUM(COUNT(*)) OVER()), 1) as percentage
      FROM crm_leads
      WHERE created_at BETWEEN ? AND ?
      GROUP BY status
      ORDER BY count DESC
    `, [startDate, endDate]);

    return rows;
  } catch (error) {
    logger.error('Erro ao buscar leads por status:', error);
    return [];
  }
};

// Função para buscar métricas de pacientes
const getPatientMetrics = async (startDate, endDate) => {
  try {
    const pool = getDB();
    if (!pool) {
      throw new Error('Database connection not available');
    }

    const [totalRows] = await pool.execute(`
      SELECT COUNT(*) as total
      FROM patient_leads
      WHERE created_at BETWEEN ? AND ?
    `, [startDate, endDate]);

    const [convertedRows] = await pool.execute(`
      SELECT COUNT(*) as converted
      FROM patient_leads
      WHERE created_at BETWEEN ? AND ?
      AND status = 'convertido'
    `, [startDate, endDate]);

    const total = totalRows[0].total || 0;
    const converted = convertedRows[0].converted || 0;
    const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(1) : 0;

    return {
      totalLeads: total,
      convertedLeads: converted,
      conversionRate: parseFloat(conversionRate)
    };
  } catch (error) {
    logger.error('Erro ao buscar métricas de pacientes:', error);
    return {
      totalLeads: 0,
      convertedLeads: 0,
      conversionRate: 0
    };
  }
};

// Função para calcular crescimento comparado ao período anterior
const getGrowthMetrics = async (currentStart, currentEnd, range) => {
  const rangeDays = Math.ceil((new Date(currentEnd) - new Date(currentStart)) / (1000 * 60 * 60 * 24));
  const previousEnd = new Date(currentStart);
  previousEnd.setDate(previousEnd.getDate() - 1);
  const previousStart = new Date(previousEnd);
  previousStart.setDate(previousStart.getDate() - rangeDays);

  try {
    const pool = getDB();
    if (!pool) {
      throw new Error('Database connection not available');
    }

    // Buscar dados do período atual
    const [currentPatients] = await pool.execute(`
      SELECT COUNT(*) as count FROM patient_leads
      WHERE created_at BETWEEN ? AND ?
    `, [currentStart, currentEnd]);

    const [currentLeads] = await pool.execute(`
      SELECT COUNT(*) as count FROM crm_leads
      WHERE created_at BETWEEN ? AND ?
    `, [currentStart, currentEnd]);

    // Buscar dados do período anterior
    const [previousPatients] = await pool.execute(`
      SELECT COUNT(*) as count FROM patient_leads
      WHERE created_at BETWEEN ? AND ?
    `, [previousStart.toISOString().split('T')[0], previousEnd.toISOString().split('T')[0]]);

    const [previousLeads] = await pool.execute(`
      SELECT COUNT(*) as count FROM crm_leads
      WHERE created_at BETWEEN ? AND ?
    `, [previousStart.toISOString().split('T')[0], previousEnd.toISOString().split('T')[0]]);

    const currentPatientsCount = currentPatients[0].count || 0;
    const currentLeadsCount = currentLeads[0].count || 0;
    const previousPatientsCount = previousPatients[0].count || 0;
    const previousLeadsCount = previousLeads[0].count || 0;

    const calculateGrowth = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return (((current - previous) / previous) * 100).toFixed(1);
    };

    return {
      visits: 0, // Placeholder - seria do Google Analytics
      conversion: 0, // Placeholder
      leads: parseFloat(calculateGrowth(currentLeadsCount, previousLeadsCount)),
      revenue: 0 // Placeholder - seria de sistema de pagamentos
    };
  } catch (error) {
    logger.error('Erro ao calcular métricas de crescimento:', error);
    return {
      visits: 0,
      conversion: 0,
      leads: 0,
      revenue: 0
    };
  }
};

/**
 * GET /api/marketing/metrics
 * Retorna métricas consolidadas de marketing
 */
exports.getMarketingMetrics = async (req, res) => {
  try {
    const { range = '30d' } = req.query;
    const { startDate, endDate } = getDateRange(range);

    logger.info(`📊 Buscando métricas de marketing para o período: ${startDate} - ${endDate}`);
    logger.info(`🔄 VERSÃO ATUALIZADA - Verificação Google Analytics implementada`);

    // Buscar dados de várias fontes em paralelo
    const [
      googleAnalytics,
      leadsBySource,
      leadsByStatus,
      patientMetrics,
      growthMetrics
    ] = await Promise.all([
      getGoogleAnalyticsMetrics(startDate, endDate),
      getLeadsBySource(startDate, endDate),
      getLeadsByStatus(startDate, endDate),
      getPatientMetrics(startDate, endDate),
      getGrowthMetrics(startDate, endDate, range)
    ]);

    // Dados reais de fontes de tráfego (placeholders para integrações futuras)
    const trafficSources = [];

    // Dados reais de dispositivos (placeholders para integrações futuras)
    const deviceData = [];

    // Campanhas reais (placeholders para integrações futuras)
    const campaigns = [];

    const response = {
      success: true,
      data: {
        overview: {
          totalVisits: patientMetrics.totalLeads,
          conversionRate: patientMetrics.conversionRate,
          leadGeneration: patientMetrics.totalLeads,
          revenue: patientMetrics.convertedLeads * 2500, // Estimativa de R$ 2.500 por conversão
          growth: growthMetrics
        },
        traffic: {
          sources: trafficSources,
          devices: deviceData
        },
        leads: {
          bySource: leadsBySource.length > 0 ? leadsBySource : [
            { source: 'Nenhum lead encontrado', count: 0, conversion: 0 }
          ],
          byStatus: leadsByStatus.length > 0 ? leadsByStatus : [
            { status: 'Nenhum lead encontrado', count: 0, percentage: 0 }
          ]
        },
        campaigns: campaigns,
        analytics: {
          ...googleAnalytics,
          socialMedia: []
        }
      },
      timestamp: new Date().toISOString()
    };

    logger.info(`✅ Métricas de marketing retornadas com sucesso - Leads: ${patientMetrics.totalLeads}, Conversão: ${patientMetrics.conversionRate}%`);
    res.json(response);

  } catch (error) {
    logger.error('❌ Erro ao buscar métricas de marketing:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao buscar métricas de marketing',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * GET /api/marketing/analytics/google
 * Endpoint específico para dados do Google Analytics
 */
exports.getGoogleAnalyticsData = async (req, res) => {
  try {
    const { metrics = 'sessions,users,bounceRate', range = '30d' } = req.query;
    const { startDate, endDate } = getDateRange(range);

    // Placeholder para integração real com Google Analytics
    const data = {
      success: true,
      data: {
        sessions: 0,
        users: 0,
        bounceRate: 0,
        avgSessionDuration: '0:00'
      },
      message: 'Google Analytics não configurado',
      timestamp: new Date().toISOString()
    };

    res.json(data);
  } catch (error) {
    logger.error('❌ Erro ao buscar dados do Google Analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar dados do Google Analytics',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * GET /api/marketing/ads/facebook
 * Endpoint específico para dados do Facebook Ads
 */
exports.getFacebookAdsData = async (req, res) => {
  try {
    const { range = '30d' } = req.query;

    // Placeholder para integração real com Facebook Ads API
    const data = {
      success: true,
      data: {
        campaigns: [],
        totalSpent: 0,
        totalClicks: 0,
        totalImpressions: 0
      },
      message: 'Facebook Ads não configurado',
      timestamp: new Date().toISOString()
    };

    res.json(data);
  } catch (error) {
    logger.error('❌ Erro ao buscar dados do Facebook Ads:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar dados do Facebook Ads',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * GET /api/marketing/social/instagram
 * Endpoint específico para dados do Instagram
 */
exports.getInstagramInsights = async (req, res) => {
  try {
    const { range = '30d' } = req.query;

    // Placeholder para integração real com Instagram API
    const data = {
      success: true,
      data: {
        followers: 0,
        engagement: 0,
        posts: []
      },
      message: 'Instagram não configurado',
      timestamp: new Date().toISOString()
    };

    res.json(data);
  } catch (error) {
    logger.error('❌ Erro ao buscar dados do Instagram:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar dados do Instagram',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * GET /api/marketing/email/stats
 * Endpoint específico para estatísticas de email marketing
 */
exports.getEmailMarketingStats = async (req, res) => {
  try {
    const { range = '30d' } = req.query;

    // Placeholder para integração real com Mailchimp ou outro provedor
    const data = {
      success: true,
      data: {
        campaigns: [],
        totalSent: 0,
        openRate: 0,
        clickRate: 0
      },
      message: 'Email marketing não configurado',
      timestamp: new Date().toISOString()
    };

    res.json(data);
  } catch (error) {
    logger.error('❌ Erro ao buscar estatísticas de email marketing:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas de email marketing',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * GET /api/marketing/whatsapp/metrics
 * Endpoint específico para métricas do WhatsApp
 */
exports.getWhatsAppMetrics = async (req, res) => {
  try {
    const { range = '30d' } = req.query;

    // Placeholder para integração real com WhatsApp Business API
    const data = {
      success: true,
      data: {
        messagesSent: 0,
        messagesDelivered: 0,
        messagesRead: 0
      },
      message: 'WhatsApp não configurado',
      timestamp: new Date().toISOString()
    };

    res.json(data);
  } catch (error) {
    logger.error('❌ Erro ao buscar métricas do WhatsApp:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar métricas do WhatsApp',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * GET /api/marketing/campaigns
 * Endpoint para performance de campanhas
 */
exports.getCampaignPerformance = async (req, res) => {
  try {
    const { campaignId } = req.params;

    // Em produção, buscaria dados reais de campanhas de múltiplas fontes
    const data = {
      success: true,
      data: {
        campaigns: [],
        totalBudget: 0,
        totalSpent: 0,
        totalConversions: 0
      },
      message: 'Campanhas não configuradas',
      timestamp: new Date().toISOString()
    };

    res.json(data);
  } catch (error) {
    logger.error('❌ Erro ao buscar performance de campanhas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar performance de campanhas',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * GET /api/marketing/leads/sources
 * Endpoint para análise de fontes de leads
 */
exports.getLeadSourceAnalysis = async (req, res) => {
  try {
    const { range = '30d' } = req.query;
    const { startDate, endDate } = getDateRange(range);

    const leadsBySource = await getLeadsBySource(startDate, endDate);

    const data = {
      success: true,
      data: {
        sources: leadsBySource,
        totalLeads: leadsBySource.reduce((sum, source) => sum + source.count, 0)
      },
      timestamp: new Date().toISOString()
    };

    res.json(data);
  } catch (error) {
    logger.error('❌ Erro ao buscar análise de fontes de leads:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar análise de fontes de leads',
      timestamp: new Date().toISOString()
    });
  }
};