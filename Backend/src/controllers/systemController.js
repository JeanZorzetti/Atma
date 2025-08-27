const { executeQuery, getDB } = require('../config/database');
const { logger } = require('../utils/logger');
const orthodontistService = require('../services/orthodontistService');
const cepService = require('../services/cepService');
const emailService = require('../services/emailService');
const { withDbErrorHandling } = require('../middleware/dbErrorHandler');

// Listar configurações do sistema
const getSystemSettings = async (req, res, next) => {
  try {
    const settings = await executeQuery('SELECT * FROM system_settings ORDER BY setting_key');
    
    const settingsObject = {};
    settings.forEach(setting => {
      settingsObject[setting.setting_key] = {
        value: setting.setting_value,
        description: setting.description,
        updated_at: setting.updated_at
      };
    });
    
    res.json({
      success: true,
      data: {
        settings: settingsObject
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Erro ao buscar configurações do sistema:', error);
    next(error);
  }
};

// Atualizar configuração do sistema
const updateSystemSetting = async (req, res, next) => {
  try {
    const { setting_key, setting_value, description } = req.body;
    
    // Verificar se configuração existe
    const existing = await executeQuery(
      'SELECT * FROM system_settings WHERE setting_key = ?',
      [setting_key]
    );
    
    let result;
    if (existing.length > 0) {
      // Atualizar
      result = await executeQuery(
        'UPDATE system_settings SET setting_value = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = ?',
        [setting_value, description || existing[0].description, setting_key]
      );
    } else {
      // Criar nova
      result = await executeQuery(
        'INSERT INTO system_settings (setting_key, setting_value, description) VALUES (?, ?, ?)',
        [setting_key, setting_value, description || null]
      );
    }
    
    logger.info('Configuração do sistema atualizada', {
      setting_key,
      new_value: setting_value,
      action: existing.length > 0 ? 'updated' : 'created'
    });
    
    res.json({
      success: true,
      data: {
        message: 'Configuração atualizada com sucesso',
        setting_key,
        action: existing.length > 0 ? 'updated' : 'created'
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Erro ao atualizar configuração:', error);
    next(error);
  }
};

// Health check detalhado
const getSystemHealth = async (req, res, next) => {
  try {
    const health = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      checks: {}
    };
    
    // Verificar banco de dados
    try {
      await executeQuery('SELECT 1 as test');
      health.checks.database = { status: 'OK', message: 'Conectado' };
    } catch (error) {
      health.checks.database = { status: 'ERROR', message: error.message };
      health.status = 'ERROR';
    }
    
    // Verificar serviço de email
    try {
      if (emailService.transporter) {
        await emailService.transporter.verify();
        health.checks.email = { status: 'OK', message: 'Configurado e conectado' };
      } else {
        health.checks.email = { status: 'WARNING', message: 'Não configurado' };
      }
    } catch (error) {
      health.checks.email = { status: 'ERROR', message: error.message };
      if (health.status === 'OK') health.status = 'WARNING';
    }
    
    // Verificar cache de CEP
    try {
      const cepStats = cepService.estatisticasCache();
      health.checks.cep_cache = { 
        status: 'OK', 
        message: `${cepStats.total} entradas, ${cepStats.validos} válidas`,
        stats: cepStats
      };
    } catch (error) {
      health.checks.cep_cache = { status: 'ERROR', message: error.message };
    }
    
    // Verificar uso de memória
    const memUsage = process.memoryUsage();
    const memUsageMB = {
      rss: Math.round(memUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
      external: Math.round(memUsage.external / 1024 / 1024)
    };
    
    health.checks.memory = {
      status: memUsageMB.heapUsed > 500 ? 'WARNING' : 'OK',
      message: `Heap usado: ${memUsageMB.heapUsed}MB`,
      usage: memUsageMB
    };
    
    const statusCode = health.status === 'OK' ? 200 : health.status === 'WARNING' ? 200 : 503;
    
    res.status(statusCode).json({
      success: health.status !== 'ERROR',
      data: health,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Erro no health check:', error);
    res.status(503).json({
      success: false,
      data: {
        status: 'ERROR',
        message: 'Falha no health check',
        error: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

// Estatísticas gerais do sistema with enhanced error handling
const getSystemStats = withDbErrorHandling('SystemController.getSystemStats', {
  totalPatients: 0,
  patientsGrowth: '0% este mês',
  totalOrthodontists: 0,
  orthodontistsGrowth: '0 ativos',
  todayAppointments: 0,
  appointmentsConfirmed: '0 confirmadas',
  monthlyRevenue: 0,
  revenueGrowth: 'N/A - dados indisponíveis',
  recentActivities: []
})(async (req, res, next) => {
  const startTime = Date.now();
  
  try {
    logger.info('Iniciando busca de estatísticas do sistema');
    
    // Verificar se a conexão com banco está disponível
    const db = getDB();
    if (!db) {
      logger.warn('Database não disponível para estatísticas - retornando valores padrão');
      return res.status(200).json({
        success: true,
        data: {
          totalPatients: 0,
          patientsGrowth: '0% este mês',
          totalOrthodontists: 0,
          orthodontistsGrowth: '0 ativos',
          todayAppointments: 0,
          appointmentsConfirmed: '0 confirmadas',
          monthlyRevenue: 0,
          revenueGrowth: 'N/A - sistema iniciando',
          recentActivities: []
        },
        warning: 'Sistema temporariamente com conectividade limitada',
        timestamp: new Date().toISOString()
      });
    }

    const queries = [
      'SELECT COUNT(*) as total FROM patient_leads',
      'SELECT COUNT(*) as total FROM orthodontists WHERE status = "ativo"',
      'SELECT COUNT(*) as total FROM patient_leads WHERE DATE(created_at) = CURDATE()',
      'SELECT COUNT(*) as confirmed FROM patient_leads WHERE status IN ("agendado", "contatado")',
      'SELECT SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as current_month, SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 60 DAY) AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as previous_month FROM patient_leads'
    ];
    
    // Execute all queries with Promise.allSettled for better error handling
    const queryPromises = queries.map(async (query, index) => {
      try {
        const result = await executeQuery(query);
        logger.debug(`Query ${index + 1} executada com sucesso`, { 
          query: query.substring(0, 50) + '...',
          resultCount: result?.length || 0
        });
        return { success: true, data: result };
      } catch (queryError) {
        logger.error(`Erro em query ${index + 1}: ${query.substring(0, 50)}...`, {
          error: queryError.message,
          code: queryError.code
        });
        
        // Provide fallback data for different types of queries
        if (query.includes('COUNT(*)')) {
          return { success: false, data: [{ total: 0, confirmed: 0, current_month: 0, previous_month: 1 }] };
        }
        
        throw queryError;
      }
    });
    
    const queryResults = await Promise.allSettled(queryPromises);
    
    // Extract results with fallbacks
    const results = queryResults.map((result, index) => {
      if (result.status === 'fulfilled' && result.value.success) {
        return result.value.data;
      } else {
        logger.warn(`Usando fallback para query ${index + 1}:`, result.reason?.message || 'Unknown error');
        return [{ total: 0, confirmed: 0, current_month: 0, previous_month: 1 }];
      }
    });
    
    const [
      totalPatientsResult,
      totalOrthodontistsResult, 
      todayAppointmentsResult,
      confirmedAppointmentsResult,
      growthResult
    ] = results;
    
    const totalPatients = totalPatientsResult[0]?.total || 0;
    const totalOrthodontists = totalOrthodontistsResult[0]?.total || 0;
    const todayAppointments = todayAppointmentsResult[0]?.total || 0;
    const confirmedAppointments = confirmedAppointmentsResult[0]?.confirmed || 0;
    
    // Calcular crescimento percentual
    const currentMonth = growthResult[0]?.current_month || 0;
    const previousMonth = growthResult[0]?.previous_month || 1;
    const growthPercent = previousMonth > 0 ? ((currentMonth - previousMonth) / previousMonth * 100).toFixed(1) : '0';
    
    // Buscar atividades recentes (com fallback em caso de erro)
    let recentActivities = [];
    try {
      const recentActivitiesQuery = `
        SELECT 
          'new_patient' as type,
          CONCAT('Novo lead: ', nome) as message,
          created_at as time,
          'success' as status
        FROM patient_leads 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
        ORDER BY created_at DESC 
        LIMIT 5
      `;
      
      const activitiesResult = await executeQuery(recentActivitiesQuery);
      recentActivities = activitiesResult.map((activity, index) => ({
        id: index + 1,
        type: activity.type,
        message: activity.message,
        time: new Date(activity.time).toLocaleString('pt-BR'),
        status: activity.status
      }));
    } catch (error) {
      logger.warn('Erro ao buscar atividades recentes - usando lista vazia:', error.message);
      recentActivities = [];
    }
    
    const stats = {
      totalPatients,
      patientsGrowth: `${growthPercent > 0 ? '+' : ''}${growthPercent}% este mês`,
      totalOrthodontists,
      orthodontistsGrowth: `${totalOrthodontists} ativos`,
      todayAppointments,
      appointmentsConfirmed: `${confirmedAppointments} confirmadas`,
      monthlyRevenue: 0, // Implementar quando houver tabela de receita
      revenueGrowth: 'N/A - implementar futuramente',
      recentActivities
    };
    
    logger.info('Estatísticas do sistema obtidas com sucesso', {
      executionTime: Date.now() - startTime,
      totalPatients,
      totalOrthodontists,
      activitiesCount: recentActivities.length
    });
    
    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Erro ao buscar estatísticas do sistema:', {
      error: error.message,
      stack: error.stack,
      executionTime: Date.now() - startTime
    });
    
    // This will be caught by withDbErrorHandling wrapper
    throw error;
  }
});

// Executar tarefas de manutenção
const runMaintenance = async (req, res, next) => {
  try {
    const { tasks } = req.body;
    const results = {};
    
    // Se tasks contém "migrate", executar migrações
    if (tasks && tasks.includes && tasks.includes('migrate')) {
      logger.info('🚀 Executando migrações via maintenance endpoint');
      
      const fs = require('fs');
      const path = require('path');
      const mysql = require('mysql2/promise');
      
      try {
        const dbConfig = {
          host: process.env.DB_HOST || 'localhost',
          user: process.env.DB_USER || 'root', 
          password: process.env.DB_PASSWORD || '',
          database: process.env.DB_NAME || 'atma_aligner',
          port: process.env.DB_PORT || 3306,
          charset: 'utf8mb4',
          timezone: '+00:00'
        };
        
        // Conectar e executar schema
        const connection = await mysql.createConnection(dbConfig);
        const schemaPath = path.join(__dirname, '../../database/schema.sql');
        const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
        
        // Executar statements SQL
        const statements = schemaSQL.split(';').filter(stmt => stmt.trim().length > 0);
        
        for (let statement of statements) {
          try {
            await connection.execute(statement);
          } catch (err) {
            if (!err.message.includes('already exists')) {
              throw err;
            }
          }
        }
        
        await connection.end();
        
        results.migrate = {
          success: true,
          message: 'Migrações executadas com sucesso'
        };
        
        logger.info('✅ Migrações via maintenance executadas com sucesso');
        
      } catch (error) {
        logger.error('❌ Erro nas migrações via maintenance:', error.message);
        results.migrate = {
          success: false,
          error: error.message
        };
      }
      
      return res.json({
        success: results.migrate.success,
        results,
        timestamp: new Date().toISOString()
      });
    }
    
    // Lista de tarefas disponíveis
    const availableTasks = [
      'clean_expired_cache',
      'rebalance_leads',
      'cleanup_old_logs',
      'refresh_email_templates',
      'check_capacity_warnings'
    ];
    
    const tasksToRun = tasks && Array.isArray(tasks) ? tasks : availableTasks;
    
    // Limpar cache expirado
    if (tasksToRun.includes('clean_expired_cache')) {
      try {
        const removed = cepService.limparCacheExpirado();
        results.clean_expired_cache = {
          success: true,
          message: `${removed} entradas expiradas removidas do cache`
        };
      } catch (error) {
        results.clean_expired_cache = {
          success: false,
          error: error.message
        };
      }
    }
    
    // Rebalancear leads
    if (tasksToRun.includes('rebalance_leads')) {
      try {
        const rebalanceResult = await orthodontistService.rebalanceLeads();
        results.rebalance_leads = {
          success: true,
          message: rebalanceResult.message,
          rebalanced: rebalanceResult.rebalanced
        };
      } catch (error) {
        results.rebalance_leads = {
          success: false,
          error: error.message
        };
      }
    }
    
    // Limpar logs antigos (>90 dias)
    if (tasksToRun.includes('cleanup_old_logs')) {
      try {
        const deletedEmails = await executeQuery(
          'DELETE FROM email_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY)'
        );
        results.cleanup_old_logs = {
          success: true,
          message: `${deletedEmails.affectedRows} logs de email antigos removidos`
        };
      } catch (error) {
        results.cleanup_old_logs = {
          success: false,
          error: error.message
        };
      }
    }
    
    // Recarregar templates de email
    if (tasksToRun.includes('refresh_email_templates')) {
      try {
        await emailService.reloadTemplates();
        results.refresh_email_templates = {
          success: true,
          message: 'Templates de email recarregados'
        };
      } catch (error) {
        results.refresh_email_templates = {
          success: false,
          error: error.message
        };
      }
    }
    
    // Verificar avisos de capacidade
    if (tasksToRun.includes('check_capacity_warnings')) {
      try {
        const warnings = await orthodontistService.checkCapacityWarnings();
        results.check_capacity_warnings = {
          success: true,
          message: `${warnings.length} ortodontistas próximos ao limite de capacidade`,
          warnings: warnings
        };
      } catch (error) {
        results.check_capacity_warnings = {
          success: false,
          error: error.message
        };
      }
    }
    
    logger.info('Tarefas de manutenção executadas', { tasks: tasksToRun, results });
    
    res.json({
      success: true,
      data: {
        message: 'Tarefas de manutenção executadas',
        tasks_executadas: tasksToRun,
        resultados: results
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Erro ao executar manutenção:', error);
    next(error);
  }
};

// Buscar ações rápidas (dados para a seção de ações rápidas do dashboard)
const getQuickActions = withDbErrorHandling('SystemController.getQuickActions', [])(async (req, res, next) => {
  const startTime = Date.now();
  
  try {
    logger.info('Iniciando busca de ações rápidas');
    
    const db = getDB();
    if (!db) {
      logger.warn('Database não disponível para ações rápidas - retornando lista vazia');
      return res.status(200).json({
        success: true,
        data: [],
        warning: 'Sistema temporariamente com conectividade limitada',
        timestamp: new Date().toISOString()
      });
    }

    const actions = [];
    
    try {
      // 1. Verificar leads de pacientes pendentes (status = 'pendente')
      const pendingPatientsQuery = `
        SELECT COUNT(*) as count
        FROM patient_leads 
        WHERE status = 'pendente' AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      `;
      const pendingPatients = await executeQuery(pendingPatientsQuery);
      const pendingCount = pendingPatients[0]?.count || 0;
      
      if (pendingCount > 0) {
        actions.push({
          id: 1,
          type: 'patients',
          priority: 'urgent',
          title: `${pendingCount} lead${pendingCount > 1 ? 's' : ''} de paciente${pendingCount > 1 ? 's' : ''} pendente${pendingCount > 1 ? 's' : ''}`,
          description: 'Necessário fazer contato inicial',
          count: pendingCount,
          color: 'red',
          badge: 'Urgente',
          badgeVariant: 'destructive'
        });
      }
      
      // 2. Verificar solicitações de parceria pendentes
      const pendingPartnershipsQuery = `
        SELECT COUNT(*) as count
        FROM orthodontist_partnerships 
        WHERE status = 'pendente'
      `;
      const pendingPartnerships = await executeQuery(pendingPartnershipsQuery);
      const partnershipCount = pendingPartnerships[0]?.count || 0;
      
      if (partnershipCount > 0) {
        actions.push({
          id: 2,
          type: 'partnerships',
          priority: 'normal',
          title: `${partnershipCount} nova${partnershipCount > 1 ? 's' : ''} solicitaç${partnershipCount > 1 ? 'ões' : 'ão'} de parceria`,
          description: 'Aguardando aprovação de cadastro',
          count: partnershipCount,
          color: 'blue',
          badge: 'Novo',
          badgeVariant: 'outline'
        });
      }
      
      // 3. Verificar leads que precisam de follow-up (contatados há mais de 3 dias sem resposta)
      const followUpQuery = `
        SELECT COUNT(*) as count
        FROM patient_leads 
        WHERE status = 'contatado' 
        AND updated_at < DATE_SUB(NOW(), INTERVAL 3 DAY)
      `;
      const followUpNeeded = await executeQuery(followUpQuery);
      const followUpCount = followUpNeeded[0]?.count || 0;
      
      if (followUpCount > 0) {
        actions.push({
          id: 3,
          type: 'followup',
          priority: 'attention',
          title: `${followUpCount} lead${followUpCount > 1 ? 's' : ''} precisam de follow-up`,
          description: 'Sem resposta há mais de 3 dias',
          count: followUpCount,
          color: 'yellow',
          badge: 'Atenção',
          badgeVariant: 'secondary'
        });
      }
      
    } catch (queryError) {
      logger.error('Erro ao executar queries para ações rápidas:', queryError);
      // Continue sem quebrar a resposta
    }
    
    logger.info('Ações rápidas obtidas com sucesso', {
      executionTime: Date.now() - startTime,
      actionsCount: actions.length
    });
    
    res.json({
      success: true,
      data: actions,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Erro ao buscar ações rápidas:', {
      error: error.message,
      stack: error.stack,
      executionTime: Date.now() - startTime
    });
    
    throw error;
  }
});

// Executar migrações do banco de dados (temporário para setup)
const runDatabaseMigrations = async (req, res, next) => {
  try {
    logger.info('🚀 Iniciando execução de migrações do banco de dados');
    
    // Import dinamico para evitar problemas de dependência circular
    const { spawn } = require('child_process');
    const path = require('path');
    
    const migrationScript = path.join(__dirname, '../../database/migrate.js');
    
    // Executar script de migração
    const migration = spawn('node', [migrationScript, 'migrate'], {
      cwd: path.join(__dirname, '../../'),
      env: process.env
    });
    
    let output = '';
    let errorOutput = '';
    
    migration.stdout.on('data', (data) => {
      output += data.toString();
      logger.info('Migration output:', data.toString().trim());
    });
    
    migration.stderr.on('data', (data) => {
      errorOutput += data.toString();
      logger.error('Migration error:', data.toString().trim());
    });
    
    migration.on('close', (code) => {
      if (code === 0) {
        logger.info('✅ Migrações executadas com sucesso');
        res.json({
          success: true,
          message: 'Migrações do banco de dados executadas com sucesso',
          output: output.trim(),
          timestamp: new Date().toISOString()
        });
      } else {
        logger.error('❌ Erro ao executar migrações, código:', code);
        res.status(500).json({
          success: false,
          error: {
            message: 'Erro ao executar migrações do banco de dados',
            details: errorOutput.trim() || output.trim(),
            code
          },
          timestamp: new Date().toISOString()
        });
      }
    });
    
    // Timeout para evitar travamento
    setTimeout(() => {
      migration.kill();
      if (!res.headersSent) {
        res.status(408).json({
          success: false,
          error: {
            message: 'Timeout ao executar migrações - processo cancelado'
          },
          timestamp: new Date().toISOString()
        });
      }
    }, 30000); // 30 segundos de timeout
    
  } catch (error) {
    logger.error('Erro ao iniciar migrações:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Erro interno ao executar migrações',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

// Testar query simples no banco (debug)
const testDatabaseQuery = async (req, res, next) => {
  try {
    logger.info('🔍 Testando queries do patient_leads');
    
    const { executeQuery } = require('../config/database');
    
    // Testar query simples primeiro
    const simpleResult = await executeQuery('SELECT COUNT(*) as total FROM patient_leads');
    logger.info('✅ Query COUNT executada com sucesso:', simpleResult);
    
    // Testar query complexa do getPatientLeads
    const complexQuery = `
      SELECT 
        pl.*,
        o.nome as ortodontista_nome,
        o.clinica as ortodontista_clinica,
        o.telefone as ortodontista_telefone,
        poa.status as atribuicao_status,
        poa.data_atribuicao
      FROM patient_leads pl
      LEFT JOIN orthodontists o ON pl.ortodontista_id = o.id
      LEFT JOIN patient_orthodontist_assignments poa ON pl.id = poa.patient_lead_id
      ORDER BY pl.created_at DESC
      LIMIT 10 OFFSET 0
    `;
    
    const complexResult = await executeQuery(complexQuery);
    logger.info('✅ Query complexa executada com sucesso:', complexResult);
    
    res.json({
      success: true,
      message: 'Queries de teste executadas com sucesso',
      results: {
        simple: simpleResult,
        complex: complexResult
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('❌ Erro na query de teste:', error);
    
    res.status(500).json({
      success: false,
      error: {
        message: 'Erro na query de teste',
        details: error.message,
        stack: error.stack?.substring(0, 500)
      },
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = {
  getSystemSettings,
  updateSystemSetting,
  getSystemHealth,
  getSystemStats,
  getQuickActions,
  runMaintenance,
  runDatabaseMigrations,
  testDatabaseQuery
};