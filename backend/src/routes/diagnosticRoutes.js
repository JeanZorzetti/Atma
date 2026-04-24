const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { logger } = require('../utils/logger');
const { executeQuery } = require('../config/database');

/**
 * GET /api/diagnostic/smtp
 * Testa configuração SMTP
 */
router.get('/smtp', async (req, res) => {
  const results = {
    timestamp: new Date().toISOString(),
    environment: {},
    smtpConnection: {},
    testEmail: {}
  };

  try {
    // 1. Verificar variáveis de ambiente
    const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'EMAIL_FROM_ADDRESS'];

    results.environment.status = 'checking';
    results.environment.variables = {};

    let allPresent = true;
    requiredVars.forEach(varName => {
      const value = process.env[varName];
      if (value) {
        if (varName === 'SMTP_PASS') {
          results.environment.variables[varName] = '****** (hidden)';
        } else {
          results.environment.variables[varName] = value;
        }
      } else {
        results.environment.variables[varName] = 'NOT SET';
        allPresent = false;
      }
    });

    results.environment.status = allPresent ? 'ok' : 'missing_variables';

    if (!allPresent) {
      return res.status(500).json({
        success: false,
        error: 'Missing required SMTP environment variables',
        results
      });
    }

    // 2. Testar conexão SMTP
    results.smtpConnection.status = 'testing';

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.verify();

    results.smtpConnection.status = 'ok';
    results.smtpConnection.message = 'SMTP connection successful';

    // 3. Enviar email de teste (opcional, apenas se query param sendTest=true)
    if (req.query.sendTest === 'true') {
      results.testEmail.status = 'sending';

      const testRecipient = req.query.to || process.env.SMTP_USER;

      const info = await transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || 'Atma Test'}" <${process.env.EMAIL_FROM_ADDRESS || process.env.SMTP_USER}>`,
        to: testRecipient,
        subject: 'SMTP Diagnostic Test - Atma Backend',
        text: `SMTP diagnostic test successful at ${new Date().toISOString()}!\n\nYour SMTP configuration is working correctly.`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #667eea;">✅ SMTP Test Successful!</h2>
            <p>Test completed at: <strong>${new Date().toLocaleString('pt-BR')}</strong></p>
            <p>Your SMTP configuration is working correctly.</p>
            <hr>
            <p style="font-size: 12px; color: #666;">
              Atma Backend - Diagnostic Endpoint
            </p>
          </div>
        `
      });

      results.testEmail.status = 'sent';
      results.testEmail.messageId = info.messageId;
      results.testEmail.recipient = testRecipient;
      results.testEmail.response = info.response;
    } else {
      results.testEmail.status = 'skipped';
      results.testEmail.message = 'Add ?sendTest=true to send test email';
    }

    logger.info('SMTP diagnostic completed successfully');

    return res.json({
      success: true,
      message: 'SMTP diagnostic completed',
      results
    });

  } catch (error) {
    logger.error('SMTP diagnostic error:', error);

    results.error = {
      code: error.code,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };

    // Diagnosticar tipo de erro
    if (error.code === 'EAUTH') {
      results.diagnosis = {
        problem: 'Authentication Error',
        possibleCauses: [
          'Incorrect email or password',
          'For Gmail: App Password required (not regular password)',
          'Two-factor authentication not enabled',
          'Gmail account security settings blocking access'
        ],
        solutions: [
          'Generate App Password at: https://myaccount.google.com/apppasswords',
          'Enable 2-factor authentication first',
          'Use App Password in SMTP_PASS variable'
        ]
      };
    } else if (error.code === 'ESOCKET' || error.code === 'ECONNECTION') {
      results.diagnosis = {
        problem: 'Connection Error',
        possibleCauses: [
          'Firewall blocking port 587',
          'Wrong SMTP host or port',
          'Network/DNS issues',
          'SMTP server is down'
        ],
        solutions: [
          'Check firewall rules for outbound port 587',
          'Try port 465 (SSL) or 25',
          'Verify SMTP_HOST is correct',
          'Test with: telnet smtp.gmail.com 587'
        ]
      };
    } else if (error.code === 'ETIMEDOUT') {
      results.diagnosis = {
        problem: 'Timeout Error',
        possibleCauses: [
          'Server firewall blocking outbound SMTP',
          'SMTP server not responding',
          'Wrong port configuration'
        ],
        solutions: [
          'Contact hosting provider to allow outbound SMTP',
          'Try alternative port (465 for SSL)',
          'Check server firewall rules'
        ]
      };
    }

    return res.status(500).json({
      success: false,
      error: 'SMTP diagnostic failed',
      results
    });
  }
});

/**
 * GET /api/diagnostic/database
 * Testa conexão com banco de dados
 */
router.get('/database', async (req, res) => {
  const results = {
    timestamp: new Date().toISOString(),
    connection: {},
    tables: {},
    settings: {}
  };

  try {
    // Testar conexão
    results.connection.status = 'testing';
    const [testResult] = await executeQuery('SELECT 1 as test');
    results.connection.status = testResult.test === 1 ? 'ok' : 'failed';

    // Verificar tabelas de notificação
    results.tables.status = 'checking';
    const tables = await executeQuery(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = DATABASE()
      AND table_name IN ('email_templates', 'notification_log', 'system_settings')
    `);

    results.tables.found = tables.map(t => t.table_name || t.TABLE_NAME);
    results.tables.missing = ['email_templates', 'notification_log', 'system_settings']
      .filter(t => !results.tables.found.includes(t));
    results.tables.status = results.tables.missing.length === 0 ? 'ok' : 'missing_tables';

    // Verificar configurações de notificação
    if (results.tables.found.includes('system_settings')) {
      results.settings.status = 'checking';
      const settings = await executeQuery(`
        SELECT setting_key, setting_value
        FROM system_settings
        WHERE category = 'notifications'
      `);

      results.settings.data = {};
      settings.forEach(s => {
        results.settings.data[s.setting_key] = s.setting_value;
      });
      results.settings.status = 'ok';
    } else {
      results.settings.status = 'table_not_found';
    }

    // Verificar templates
    if (results.tables.found.includes('email_templates')) {
      const templates = await executeQuery('SELECT COUNT(*) as count FROM email_templates WHERE is_active = 1');
      results.templates = {
        status: 'ok',
        active_count: templates[0].count
      };
    } else {
      results.templates = {
        status: 'table_not_found'
      };
    }

    logger.info('Database diagnostic completed successfully');

    return res.json({
      success: true,
      message: 'Database diagnostic completed',
      results
    });

  } catch (error) {
    logger.error('Database diagnostic error:', error);

    results.error = {
      code: error.code,
      message: error.message
    };

    return res.status(500).json({
      success: false,
      error: 'Database diagnostic failed',
      results
    });
  }
});

/**
 * GET /api/diagnostic/health
 * Health check completo
 */
router.get('/health', async (req, res) => {
  const health = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
    },
    services: {}
  };

  // Check SMTP
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.verify();
    health.services.smtp = { status: 'ok' };
  } catch (error) {
    health.services.smtp = { status: 'error', message: error.message };
  }

  // Check Database
  try {
    await executeQuery('SELECT 1');
    health.services.database = { status: 'ok' };
  } catch (error) {
    health.services.database = { status: 'error', message: error.message };
  }

  const allOk = Object.values(health.services).every(s => s.status === 'ok');

  return res.status(allOk ? 200 : 503).json({
    success: allOk,
    health
  });
});

module.exports = router;
