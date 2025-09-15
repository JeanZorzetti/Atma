const { logger } = require('../utils/logger');
const { pool } = require('../config/database');

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

// Função para buscar métricas do Google Analytics (simulado)
const getGoogleAnalyticsMetrics = async (startDate, endDate) => {
  // Em produção, aqui seria integração real com Google Analytics API
  return {
    totalVisits: 0,
    bounceRate: 0,
    avgSessionDuration: '0:00',
    pagesPerSession: 0
  };
};

// Função para buscar leads por fonte
const getLeadsBySource = async (startDate, endDate) => {
  try {
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

    // Simular dados de fontes de tráfego (em produção viria do Google Analytics)
    const trafficSources = [
      { name: 'Orgânico', visits: Math.floor(patientMetrics.totalLeads * 0.4), percentage: 40, growth: 8.7 },
      { name: 'Google Ads', visits: Math.floor(patientMetrics.totalLeads * 0.3), percentage: 30, growth: 15.2 },
      { name: 'Facebook', visits: Math.floor(patientMetrics.totalLeads * 0.2), percentage: 20, growth: -5.3 },
      { name: 'Direto', visits: Math.floor(patientMetrics.totalLeads * 0.1), percentage: 10, growth: 3.4 }
    ];

    // Simular dados de dispositivos
    const deviceData = [
      { name: 'Mobile', visitors: Math.floor(patientMetrics.totalLeads * 0.6), percentage: 60 },
      { name: 'Desktop', visitors: Math.floor(patientMetrics.totalLeads * 0.3), percentage: 30 },
      { name: 'Tablet', visitors: Math.floor(patientMetrics.totalLeads * 0.1), percentage: 10 }
    ];

    // Simular campanhas (em produção viria de APIs de anúncios)
    const campaigns = [
      {
        name: 'Ortodontia Digital',
        status: 'Ativa',
        budget: 5000,
        spent: Math.floor(Math.random() * 4000 + 1000),
        clicks: Math.floor(Math.random() * 1000 + 200),
        impressions: Math.floor(Math.random() * 50000 + 10000),
        ctr: (Math.random() * 3 + 1).toFixed(2),
        cpc: (Math.random() * 5 + 2).toFixed(2),
        conversions: Math.floor(Math.random() * 50 + 10)
      }
    ];

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
          avgSessionDuration: googleAnalytics.avgSessionDuration,
          pagesPerSession: googleAnalytics.pagesPerSession,
          bounceRate: googleAnalytics.bounceRate,
          socialMedia: [
            { platform: 'Facebook', followers: 12500, engagement: 3.2 },
            { platform: 'Instagram', followers: 8900, engagement: 5.7 }
          ]
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