const { executeQuery, getDB } = require('../config/database');
const { logger } = require('../utils/logger');
const orthodontistService = require('../services/orthodontistService');
const cepService = require('../services/cepService');
const emailService = require('../services/emailService');
const { withDbErrorHandling } = require('../middleware/dbErrorHandler');
const packageInfo = require('../../package.json');

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

// Endpoint temporário para testar pacientes sem middleware
const testPatientsEndpoint = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(Math.max(1, parseInt(limit) || 10), 100);
    const offset = (pageNum - 1) * limitNum;
    
    const { executeQuery } = require('../config/database');
    
    // Usar a query que sabemos que funciona no debug
    const query = `
      SELECT 
        pl.*,
        o.nome as ortodontista_nome,
        o.clinica as ortodontista_clinica,
        o.telefone as ortodontista_telefone
      FROM patient_leads pl
      LEFT JOIN orthodontists o ON pl.ortodontista_id = o.id
      ORDER BY pl.created_at DESC
      LIMIT 10 OFFSET 0
    `;
    
    const countQuery = 'SELECT COUNT(*) as total FROM patient_leads';
    
    logger.info('Executando queries com parâmetros:', { limitNum, offset });
    
    const [patientsResult, totalResult] = await Promise.allSettled([
      executeQuery(query),  // Sem parâmetros agora
      executeQuery(countQuery)
    ]);
    
    let patients = [];
    let total = 0;
    
    if (patientsResult.status === 'fulfilled') {
      patients = patientsResult.value || [];
      logger.info('Query de pacientes executada com sucesso:', { count: patients.length, patients: patients.slice(0, 2) });
    } else {
      logger.error('Erro na query de pacientes:', patientsResult.reason?.message);
    }
    
    if (totalResult.status === 'fulfilled') {
      total = totalResult.value?.[0]?.total || 0;
    } else {
      logger.error('Erro na query de total:', totalResult.reason?.message);
    }
    
    const totalPages = Math.ceil(total / limitNum);
    
    res.json({
      success: true,
      patients,
      total,
      pagination: {
        currentPage: pageNum,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
        itemsPerPage: limitNum
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Erro no endpoint temporário de pacientes:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Erro interno do servidor',
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
    
    // Testar query específica do admin
    const adminQuery = `
      SELECT 
        pl.id,
        pl.nome as name,
        pl.email,
        pl.telefone as phone,
        '' as cpf,
        pl.status,
        'Avaliação Inicial' as treatmentStage,
        COALESCE(o.nome, 'Não atribuído') as orthodontist,
        pl.created_at
      FROM patient_leads pl
      LEFT JOIN orthodontists o ON pl.ortodontista_id = o.id
      ORDER BY pl.created_at DESC
      LIMIT 10 OFFSET 0
    `;
    
    const adminResult = await executeQuery(adminQuery);
    logger.info('✅ Query admin executada com sucesso:', adminResult);
    
    // Testar simulação completa do getPatientLeadsForAdmin
    const { page = 1, limit = 10 } = { page: 1, limit: 10 }; // Simular parâmetros
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(Math.max(1, parseInt(limit) || 10), 100);
    const offset = (pageNum - 1) * limitNum;
    
    const countQuery = 'SELECT COUNT(*) as total FROM patient_leads';
    const [patientsResult, totalResult] = await Promise.allSettled([
      executeQuery(adminQuery, []),
      executeQuery(countQuery)
    ]);
    
    let patients = [];
    let total = 0;
    
    if (patientsResult.status === 'fulfilled') {
      patients = patientsResult.value || [];
    }
    
    if (totalResult.status === 'fulfilled') {
      total = totalResult.value?.[0]?.total || 0;
    }
    
    const totalPages = Math.ceil(total / limitNum);
    const adminSimulation = {
      success: true,
      patients,
      total,
      pagination: {
        currentPage: pageNum,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
        itemsPerPage: limitNum
      }
    };
    
    logger.info('✅ Simulação admin executada com sucesso:', adminSimulation);
    
    res.json({
      success: true,
      message: 'Queries de teste executadas com sucesso',
      results: {
        simple: simpleResult,
        complex: complexResult,
        admin: adminResult,
        adminSimulation: adminSimulation
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

// Endpoint temporário para testar ortodontistas sem middleware - baseado no mesmo padrão dos pacientes
const testOrthodontistsEndpoint = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(Math.max(1, parseInt(limit) || 10), 100);
    const offset = (pageNum - 1) * limitNum;
    
    const { executeQuery } = require('../config/database');
    
    // Query baseada na tabela orthodontist_partnerships (como estava no controller original)
    const query = `
      SELECT 
        op.id,
        op.nome as name,
        op.email,
        op.telefone as phone,
        op.cro,
        'Ortodontia' as specialty,
        'A definir' as city,
        'SP' as state,
        CASE 
          WHEN op.status = 'fechado' THEN 'Ativo'
          WHEN op.status = 'rejeitado' THEN 'Inativo'
          ELSE 'Pendente'
        END as status,
        0 as patientsCount,
        0 as rating,
        DATE(op.created_at) as registrationDate,
        CASE 
          WHEN op.interesse = 'atma-aligner' THEN 'Standard'
          WHEN op.interesse = 'atma-labs' THEN 'Premium'
          ELSE 'Standard'
        END as partnershipModel
      FROM orthodontist_partnerships op
      ORDER BY op.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const countQuery = 'SELECT COUNT(*) as total FROM orthodontist_partnerships';
    
    logger.info('Executando queries de ortodontistas com parâmetros:', { limitNum, offset });
    
    const [orthodontistsResult, totalResult] = await Promise.allSettled([
      executeQuery(query, [limitNum, offset]),
      executeQuery(countQuery)
    ]);
    
    let orthodontists = [];
    let total = 0;
    
    if (orthodontistsResult.status === 'fulfilled') {
      orthodontists = orthodontistsResult.value || [];
      logger.info('Query de ortodontistas executada com sucesso:', { count: orthodontists.length });
    } else {
      logger.error('Erro na query de ortodontistas:', orthodontistsResult.reason?.message);
      
      // Se a tabela não existir, retornar dados vazios
      const errorMessage = orthodontistsResult.reason?.message || '';
      if (errorMessage.includes("doesn't exist") || errorMessage.includes("Table") || errorMessage.includes("1146")) {
        return res.status(200).json({
          success: true,
          orthodontists: [],
          total: 0,
          pagination: {
            currentPage: pageNum,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
            itemsPerPage: limitNum
          },
          warning: 'Tabela orthodontist_partnerships não foi criada ainda. Execute as migrações.',
          timestamp: new Date().toISOString()
        });
      }
    }
    
    if (totalResult.status === 'fulfilled') {
      total = totalResult.value?.[0]?.total || 0;
    } else {
      logger.error('Erro na query de total:', totalResult.reason?.message);
      total = orthodontists.length; // Use current page count as fallback
    }
    
    const totalPages = Math.ceil(total / limitNum);
    
    res.json({
      success: true,
      orthodontists,
      total,
      pagination: {
        currentPage: pageNum,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
        itemsPerPage: limitNum
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Erro no endpoint temporário de ortodontistas:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Erro interno do servidor',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

// Endpoint para dados de relatórios - compilando métricas reais do banco
const getReportsData = async (req, res, next) => {
  try {
    const startTime = Date.now();
    const { executeQuery } = require('../config/database');
    
    logger.info('Iniciando compilação de dados para relatórios');

    // Executar todas as queries necessárias para o relatório
    const queries = [
      // Total de pacientes este mês
      `SELECT COUNT(*) as current_month FROM patient_leads WHERE DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`,
      
      // Total de pacientes mês anterior
      `SELECT COUNT(*) as previous_month FROM patient_leads WHERE DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 60 DAY) AND DATE(created_at) < DATE_SUB(CURDATE(), INTERVAL 30 DAY)`,
      
      // Total de ortodontistas ativos
      `SELECT COUNT(*) as total FROM orthodontist_partnerships WHERE status = 'fechado'`,
      
      // Taxa de conversão atual (leads contatados/total)
      `SELECT 
        COUNT(*) as total_leads,
        SUM(CASE WHEN status IN ('contatado', 'agendado', 'convertido') THEN 1 ELSE 0 END) as converted_leads
       FROM patient_leads WHERE DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`,
      
      // Taxa de conversão mês anterior
      `SELECT 
        COUNT(*) as total_leads,
        SUM(CASE WHEN status IN ('contatado', 'agendado', 'convertido') THEN 1 ELSE 0 END) as converted_leads
       FROM patient_leads WHERE DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 60 DAY) 
       AND DATE(created_at) < DATE_SUB(CURDATE(), INTERVAL 30 DAY)`,
      
      // Dados mensais para gráficos (últimos 6 meses)
      `SELECT 
        MONTH(created_at) as month,
        YEAR(created_at) as year,
        COUNT(*) as patients,
        MONTHNAME(created_at) as month_name
       FROM patient_leads 
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
       GROUP BY YEAR(created_at), MONTH(created_at)
       ORDER BY YEAR(created_at), MONTH(created_at)`,
      
      // Top 5 ortodontistas por número de leads recebidos
      `SELECT 
        op.nome as name,
        COUNT(pl.id) as patients,
        AVG(CASE WHEN pl.status = 'convertido' THEN 5.0 ELSE 4.5 END) as rating
       FROM orthodontist_partnerships op
       LEFT JOIN patient_leads pl ON pl.ortodontista_id = (
         SELECT o.id FROM orthodontists o WHERE o.cro = op.cro LIMIT 1
       )
       WHERE op.status = 'fechado'
       GROUP BY op.id, op.nome
       ORDER BY patients DESC
       LIMIT 5`,
       
      // Cálculo de satisfação média baseado em conversões
      `SELECT 
        AVG(CASE 
          WHEN status = 'convertido' THEN 5.0
          WHEN status IN ('agendado', 'contatado') THEN 4.5
          WHEN status = 'respondido' THEN 4.0
          ELSE 3.5
        END) as avg_satisfaction
       FROM patient_leads WHERE DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`,
       
      // Distribuição de receita por categoria (baseado em status)
      `SELECT 
        SUM(CASE WHEN status = 'convertido' THEN 1500 ELSE 0 END) as tratamentos_ativos,
        SUM(CASE WHEN status IN ('agendado', 'contatado') THEN 300 ELSE 0 END) as consultas,
        SUM(CASE WHEN status = 'respondido' THEN 100 ELSE 0 END) as outros
       FROM patient_leads WHERE DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`,
       
      // Taxa de no-show baseada em dados reais
      `SELECT 
        COUNT(*) as total_scheduled,
        SUM(CASE WHEN status = 'nao_compareceu' THEN 1 ELSE 0 END) as no_shows
       FROM patient_leads WHERE status IN ('agendado', 'nao_compareceu') 
       AND DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`
    ];

    const queryResults = await Promise.allSettled(
      queries.map(query => executeQuery(query))
    );

    // Processar resultados com fallbacks
    const [
      currentMonthResult,
      previousMonthResult, 
      orthodontistsResult,
      conversionResult,
      conversionPreviousResult,
      monthlyResult,
      topOrthodontistsResult,
      satisfactionResult,
      revenueDistributionResult,
      noShowResult
    ] = queryResults.map(result => 
      result.status === 'fulfilled' ? result.value : []
    );

    // Calcular métricas
    const currentMonth = currentMonthResult[0]?.current_month || 0;
    const previousMonth = previousMonthResult[0]?.previous_month || 1;
    const totalOrthodontists = orthodontistsResult[0]?.total || 0;
    
    const totalLeads = conversionResult[0]?.total_leads || 0;
    const convertedLeads = conversionResult[0]?.converted_leads || 0;
    const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0.0';
    
    const totalLeadsPrevious = conversionPreviousResult[0]?.total_leads || 0;
    const convertedLeadsPrevious = conversionPreviousResult[0]?.converted_leads || 0;
    const conversionRatePrevious = totalLeadsPrevious > 0 ? ((convertedLeadsPrevious / totalLeadsPrevious) * 100) : 0;
    
    const conversionGrowth = conversionRatePrevious > 0 ? 
      (((parseFloat(conversionRate) - conversionRatePrevious) / conversionRatePrevious) * 100).toFixed(1) : '0.0';
    
    const growthPercent = previousMonth > 0 ? (((currentMonth - previousMonth) / previousMonth) * 100).toFixed(1) : '0.0';

    // Calcular satisfação, receita e no-show
    const avgSatisfaction = satisfactionResult[0]?.avg_satisfaction || 0;
    const satisfactionLabel = avgSatisfaction === 0 ? 'Sem dados disponíveis' :
                              avgSatisfaction >= 4.5 ? 'Excelente avaliação' : 
                              avgSatisfaction >= 4.0 ? 'Boa avaliação' : 'Avaliação regular';

    const revenueData = revenueDistributionResult[0] || { tratamentos_ativos: 0, consultas: 0, outros: 0 };
    const totalRevenue = revenueData.tratamentos_ativos + revenueData.consultas + revenueData.outros;
    
    const noShowData = noShowResult[0] || { total_scheduled: 0, no_shows: 0 };
    const noShowRate = noShowData.total_scheduled > 0 ? 
      ((noShowData.no_shows / noShowData.total_scheduled) * 100).toFixed(1) : '0.0';

    // Processar dados mensais para gráficos
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const monthlyData = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      
      const monthData = monthlyResult.find(m => 
        m.month === (monthIndex + 1) && m.year === year
      );
      
      monthlyData.push({
        month: monthNames[monthIndex],
        patients: monthData?.patients || 0,
        revenue: (monthData?.patients || 0) * 1500, // Estimativa R$1500 por paciente
        consultations: (monthData?.patients || 0) * 4 // Estimativa 4 consultas por paciente
      });
    }

    // Processar top ortodontistas
    const topOrthodontists = topOrthodontistsResult.map(ortho => ({
      name: ortho.name,
      patients: ortho.patients || 0,
      revenue: (ortho.patients || 0) * 1500, // Estimativa
      rating: parseFloat(ortho.rating) || 4.8
    }));

    // Montar resposta
    const reportsData = {
      // KPIs principais
      totalRevenue: Math.max(monthlyData.reduce((sum, month) => sum + month.revenue, 0), totalRevenue),
      revenueGrowth: `${growthPercent >= 0 ? '+' : ''}${growthPercent}%`,
      newPatients: currentMonth,
      patientsGrowth: `${growthPercent >= 0 ? '+' : ''}${growthPercent}%`,
      conversionRate: parseFloat(conversionRate),
      conversionGrowth: `${conversionGrowth >= 0 ? '+' : ''}${conversionGrowth}%`,
      averageRating: avgSatisfaction > 0 ? parseFloat(avgSatisfaction.toFixed(1)) : 0,
      ratingLabel: satisfactionLabel,
      
      // Dados para gráficos
      monthlyData,
      topOrthodontists: topOrthodontists.length > 0 ? topOrthodontists : [
        { name: 'Nenhum ortodontista ativo', patients: 0, revenue: 0, rating: 0 }
      ],
      
      // Métricas operacionais
      monthlyConsultations: monthlyData.reduce((sum, month) => sum + month.consultations, 0),
      noShowRate: parseFloat(noShowRate),
      averageTreatmentTime: 18, // Estimativa fixa
      
      // Distribuição de receita por categoria
      revenueDistribution: {
        tratamentosAtivos: revenueData.tratamentos_ativos,
        consultas: revenueData.consultas,
        outros: revenueData.outros,
        percentages: totalRevenue > 0 ? {
          tratamentosAtivos: ((revenueData.tratamentos_ativos / totalRevenue) * 100).toFixed(1),
          consultas: ((revenueData.consultas / totalRevenue) * 100).toFixed(1),
          outros: ((revenueData.outros / totalRevenue) * 100).toFixed(1)
        } : { tratamentosAtivos: '0', consultas: '0', outros: '0' }
      },
      
      // Metas
      quarterGoals: {
        newPatients: { current: currentMonth, target: 200, percentage: Math.min(100, parseFloat(((currentMonth / 200) * 100).toFixed(1))) },
        revenue: { 
          current: monthlyData.reduce((sum, month) => sum + month.revenue, 0), 
          target: 600000, 
          percentage: Math.min(100, parseFloat(((monthlyData.reduce((sum, month) => sum + month.revenue, 0) / 600000) * 100).toFixed(1)))
        }
      }
    };

    logger.info('Dados de relatórios compilados com sucesso', {
      executionTime: Date.now() - startTime,
      newPatients: currentMonth,
      orthodontists: totalOrthodontists,
      conversionRate
    });

    res.json({
      success: true,
      data: reportsData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Erro ao compilar dados de relatórios:', {
      error: error.message,
      stack: error.stack
    });
    
    // Retornar dados básicos em caso de erro
    res.status(200).json({
      success: true,
      data: {
        totalRevenue: 0,
        revenueGrowth: '+0%',
        newPatients: 0,
        patientsGrowth: '+0%',
        conversionRate: 0,
        conversionGrowth: '+0%',
        averageRating: 0,
        ratingLabel: 'Sem dados disponíveis',
        monthlyData: [],
        topOrthodontists: [],
        monthlyConsultations: 0,
        noShowRate: 0,
        averageTreatmentTime: 0,
        revenueDistribution: {
          tratamentosAtivos: 0,
          consultas: 0,
          outros: 0,
          percentages: { tratamentosAtivos: '0', consultas: '0', outros: '0' }
        },
        quarterGoals: {
          newPatients: { current: 0, target: 200, percentage: 0.0 },
          revenue: { current: 0, target: 600000, percentage: 0.0 }
        }
      },
      warning: 'Dados indisponíveis - usando valores padrão',
      timestamp: new Date().toISOString()
    });
  }
};

// Informações de versão da API
const getVersion = async (req, res) => {
  try {
    const buildInfo = {
      version: packageInfo.version,
      name: packageInfo.name,
      description: packageInfo.description,
      node_version: process.version,
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      api_status: 'online',
      features: [
        'Orthodontist Management',
        'Partnership Requests',
        'CRM Integration', 
        'Email Services',
        'Statistics & Reports'
      ]
    };

    logger.info('Version info requested:', { version: packageInfo.version, environment: buildInfo.environment });

    res.json({
      success: true,
      data: buildInfo,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Erro ao buscar informações de versão:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Erro interno do servidor', details: error.message },
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
  testDatabaseQuery,
  testPatientsEndpoint,
  testOrthodontistsEndpoint,
  getReportsData,
  getVersion
};