const express = require('express');
const router = express.Router();
const notificationService = require('../services/notificationService');
const { logger } = require('../utils/logger');

/**
 * POST /api/notifications/send
 * Envia notificação manual
 *
 * Body:
 * {
 *   type: 'newPatients' | 'appointments' | 'payments' | 'weeklyReports' | 'systemAlerts',
 *   to: 'email@example.com' ou '+5554999999999',
 *   subject: 'Assunto',
 *   message: 'Mensagem',
 *   templateName: 'nome_do_template' (opcional),
 *   data: { ... } (opcional),
 *   priority: true (opcional)
 * }
 */
router.post('/send', async (req, res) => {
  try {
    const { type, to, subject, message, templateName, data, priority } = req.body;

    // Validações básicas
    if (!type || !to || !subject) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: type, to, subject'
      });
    }

    const validTypes = ['newPatients', 'appointments', 'payments', 'weeklyReports', 'systemAlerts'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: `Tipo inválido. Use: ${validTypes.join(', ')}`
      });
    }

    const result = await notificationService.sendNotification({
      type,
      to,
      subject,
      message,
      templateName,
      data,
      priority
    });

    if (result.success) {
      logger.info(`Notificação enviada via API: ${type} para ${to}`);
      return res.json({
        success: true,
        message: 'Notificação enviada com sucesso',
        results: result.results
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Falha ao enviar notificação',
        reason: result.reason || result.error
      });
    }

  } catch (error) {
    logger.error('Erro ao enviar notificação via API:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/notifications/test
 * Envia notificação de teste
 *
 * Body:
 * {
 *   to: 'email@example.com',
 *   type: 'systemAlerts' (opcional, padrão: systemAlerts)
 * }
 */
router.post('/test', async (req, res) => {
  try {
    const { to, type = 'systemAlerts' } = req.body;

    if (!to) {
      return res.status(400).json({
        success: false,
        error: 'Campo "to" (destinatário) é obrigatório'
      });
    }

    const result = await notificationService.sendTestNotification(to, type);

    if (result.success) {
      logger.info(`Notificação de teste enviada para ${to}`);
      return res.json({
        success: true,
        message: `Notificação de teste enviada para ${to}`,
        results: result.results
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Falha ao enviar notificação de teste',
        reason: result.reason || result.error
      });
    }

  } catch (error) {
    logger.error('Erro ao enviar notificação de teste:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/notifications/log
 * Retorna histórico de notificações
 *
 * Query params:
 * - limit: número de registros (padrão: 50, max: 200)
 * - offset: paginação (padrão: 0)
 * - type: filtrar por tipo (opcional)
 * - status: filtrar por status (opcional: sent, failed, pending)
 */
router.get('/log', async (req, res) => {
  try {
    const { executeQuery } = require('../config/database');

    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const offset = parseInt(req.query.offset) || 0;
    const type = req.query.type;
    const status = req.query.status;

    let query = 'SELECT * FROM notification_log WHERE 1=1';
    const params = [];

    if (type) {
      query += ' AND notification_type = ?';
      params.push(type);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY sent_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const logs = await executeQuery(query, params);

    // Contar total para paginação
    let countQuery = 'SELECT COUNT(*) as total FROM notification_log WHERE 1=1';
    const countParams = [];

    if (type) {
      countQuery += ' AND notification_type = ?';
      countParams.push(type);
    }

    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    const [{ total }] = await executeQuery(countQuery, countParams);

    return res.json({
      success: true,
      data: logs,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    logger.error('Erro ao buscar log de notificações:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/notifications/settings
 * Retorna configurações atuais de notificação
 */
router.get('/settings', async (req, res) => {
  try {
    return res.json({
      success: true,
      settings: notificationService.settings
    });

  } catch (error) {
    logger.error('Erro ao buscar configurações de notificação:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/notifications/settings/reload
 * Recarrega configurações do banco de dados
 */
router.post('/settings/reload', async (req, res) => {
  try {
    await notificationService.reloadSettings();

    logger.info('Configurações de notificação recarregadas via API');

    return res.json({
      success: true,
      message: 'Configurações recarregadas com sucesso',
      settings: notificationService.settings
    });

  } catch (error) {
    logger.error('Erro ao recarregar configurações:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/notifications/weekly-report
 * Envia relatório semanal manualmente
 */
router.post('/weekly-report', async (req, res) => {
  try {
    await notificationService.sendWeeklyReport();

    logger.info('Relatório semanal enviado manualmente via API');

    return res.json({
      success: true,
      message: 'Relatório semanal enviado com sucesso'
    });

  } catch (error) {
    logger.error('Erro ao enviar relatório semanal:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/notifications/stats
 * Retorna estatísticas de notificações
 */
router.get('/stats', async (req, res) => {
  try {
    const { executeQuery } = require('../config/database');

    const period = req.query.period || '7'; // dias

    const stats = await executeQuery(`
      SELECT
        notification_type,
        COUNT(*) as total,
        SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sent,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
        SUM(CASE WHEN email_sent = 1 THEN 1 ELSE 0 END) as email_sent,
        SUM(CASE WHEN sms_sent = 1 THEN 1 ELSE 0 END) as sms_sent
      FROM notification_log
      WHERE sent_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY notification_type
    `, [period]);

    const totalStats = await executeQuery(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sent,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
      FROM notification_log
      WHERE sent_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
    `, [period]);

    return res.json({
      success: true,
      period: `Últimos ${period} dias`,
      byType: stats,
      total: totalStats[0]
    });

  } catch (error) {
    logger.error('Erro ao buscar estatísticas de notificações:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
