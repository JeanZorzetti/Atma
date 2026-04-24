const { executeQuery } = require('../config/database');
const { logger } = require('../utils/logger');
const emailService = require('../services/emailService');

// Buscar logs de emails
const getEmailLogs = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 50,
      status,
      template_name,
      data_inicio,
      data_fim,
      search
    } = req.query;
    
    const offset = (page - 1) * limit;
    let whereConditions = [];
    let queryParams = [];
    
    // Filtros
    if (status) {
      whereConditions.push('status = ?');
      queryParams.push(status);
    }
    
    if (template_name) {
      whereConditions.push('template_name = ?');
      queryParams.push(template_name);
    }
    
    if (data_inicio) {
      whereConditions.push('created_at >= ?');
      queryParams.push(data_inicio);
    }
    
    if (data_fim) {
      whereConditions.push('created_at <= ?');
      queryParams.push(data_fim);
    }
    
    if (search) {
      whereConditions.push('(to_email LIKE ? OR subject LIKE ?)');
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm);
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    // Query principal
    const query = `
      SELECT 
        id, to_email, to_name, subject, template_name, status,
        related_table, related_id, created_at
      FROM email_logs
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    // Query para contar total
    const countQuery = `
      SELECT COUNT(*) as total
      FROM email_logs
      ${whereClause}
    `;
    
    queryParams.push(parseInt(limit), parseInt(offset));
    const countParams = queryParams.slice(0, -2);
    
    const [logs, totalResult] = await Promise.all([
      executeQuery(query, queryParams),
      executeQuery(countQuery, countParams)
    ]);
    
    const total = totalResult[0].total;
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          current_page: parseInt(page),
          total_pages: totalPages,
          total_items: total,
          items_per_page: parseInt(limit),
          has_next: page < totalPages,
          has_prev: page > 1
        }
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Erro ao buscar logs de email:', error);
    next(error);
  }
};

// Testar configuração de email
const testEmailConfiguration = async (req, res, next) => {
  try {
    const { email } = req.body;
    const testEmail = email || process.env.ADMIN_EMAIL || 'test@example.com';
    
    const result = await emailService.testEmailConfiguration();
    
    res.json({
      success: true,
      data: {
        message: 'Email de teste enviado com sucesso',
        destinatario: testEmail,
        resultado: result
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Erro no teste de email:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Falha no teste de email',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

// Listar templates de email
const getEmailTemplates = async (req, res, next) => {
  try {
    const templates = await executeQuery(
      'SELECT id, name, subject, description, is_active, variables FROM email_templates ORDER BY name'
    );
    
    res.json({
      success: true,
      data: {
        templates: templates.map(template => ({
          ...template,
          variables: JSON.parse(template.variables || '[]')
        }))
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Erro ao buscar templates:', error);
    next(error);
  }
};

// Recarregar templates de email
const reloadEmailTemplates = async (req, res, next) => {
  try {
    await emailService.reloadTemplates();
    
    res.json({
      success: true,
      data: {
        message: 'Templates recarregados com sucesso'
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Erro ao recarregar templates:', error);
    next(error);
  }
};

// Enviar email customizado
const sendCustomEmail = async (req, res, next) => {
  try {
    const { to, template_name, data, priority } = req.body;
    
    if (!to || !template_name) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Email destinatário e template são obrigatórios'
        },
        timestamp: new Date().toISOString()
      });
    }
    
    const result = await emailService.sendEmail(
      to,
      template_name,
      data || {},
      { priority: priority || 'normal' }
    );
    
    res.json({
      success: true,
      data: {
        message: 'Email enviado com sucesso',
        resultado: result
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Erro ao enviar email customizado:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Falha ao enviar email',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

// Estatísticas de emails
const getEmailStats = async (req, res, next) => {
  try {
    const { periodo = '30' } = req.query;
    
    const queries = [
      // Total de emails por status
      `SELECT status, COUNT(*) as count FROM email_logs WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${periodo} DAY) GROUP BY status`,
      
      // Emails por template
      `SELECT template_name, COUNT(*) as count FROM email_logs WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${periodo} DAY) GROUP BY template_name ORDER BY count DESC`,
      
      // Emails por dia (últimos 7 dias)
      `SELECT DATE(created_at) as data, COUNT(*) as count FROM email_logs WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) GROUP BY DATE(created_at) ORDER BY data`,
      
      // Taxa de sucesso
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'enviado' THEN 1 ELSE 0 END) as enviados,
        SUM(CASE WHEN status = 'falhado' THEN 1 ELSE 0 END) as falhados
       FROM email_logs WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${periodo} DAY)`,
      
      // Templates mais utilizados
      `SELECT 
        template_name,
        COUNT(*) as total_usos,
        SUM(CASE WHEN status = 'enviado' THEN 1 ELSE 0 END) as sucessos
       FROM email_logs 
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${periodo} DAY)
       GROUP BY template_name
       ORDER BY total_usos DESC
       LIMIT 10`
    ];
    
    const [
      emailsPorStatus,
      emailsPorTemplate,
      emailsPorDia,
      taxaSucesso,
      templatesMaisUsados
    ] = await Promise.all(queries.map(query => executeQuery(query)));
    
    const taxaPercentual = taxaSucesso[0].total > 0 
      ? ((taxaSucesso[0].enviados / taxaSucesso[0].total) * 100).toFixed(1)
      : 0;
    
    res.json({
      success: true,
      data: {
        resumo: {
          total_emails: taxaSucesso[0].total,
          emails_enviados: taxaSucesso[0].enviados,
          emails_falhados: taxaSucesso[0].falhados,
          taxa_sucesso: taxaPercentual,
          periodo_dias: parseInt(periodo)
        },
        emails_por_status: emailsPorStatus,
        emails_por_template: emailsPorTemplate,
        emails_por_dia: emailsPorDia,
        templates_mais_usados: templatesMaisUsados
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Erro ao buscar estatísticas de email:', error);
    next(error);
  }
};

module.exports = {
  getEmailLogs,
  testEmailConfiguration,
  getEmailTemplates,
  reloadEmailTemplates,
  sendCustomEmail,
  getEmailStats
};