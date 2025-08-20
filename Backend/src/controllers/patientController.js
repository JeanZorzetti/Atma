const { executeQuery } = require('../config/database');
const { logger, logDBOperation } = require('../utils/logger');
const emailService = require('../services/emailService');
const orthodontistService = require('../services/orthodontistService');

// Criar novo lead de paciente
const createPatientLead = async (req, res, next) => {
  const startTime = Date.now();
  
  try {
    const { nome, email, telefone, cep, consentimento } = req.body;
    
    // Verificar se já existe lead com o mesmo email
    const existingLead = await executeQuery(
      'SELECT id FROM patient_leads WHERE email = ? AND status IN ("novo", "contatado", "agendado")',
      [email]
    );
    
    if (existingLead.length > 0) {
      return res.status(409).json({
        success: false,
        error: {
          message: 'Já existe uma solicitação ativa para este email.',
          suggestion: 'Entre em contato conosco se precisar atualizar suas informações.'
        },
        timestamp: new Date().toISOString()
      });
    }
    
    // Criar o lead
    const query = `
      INSERT INTO patient_leads (nome, email, telefone, cep, consentimento, status)
      VALUES (?, ?, ?, ?, ?, 'novo')
    `;
    
    const result = await executeQuery(query, [nome, email, telefone, cep, consentimento]);
    const leadId = result.insertId;
    
    logDBOperation('INSERT', 'patient_leads', result, Date.now() - startTime);
    
    // Buscar ortodontista próximo baseado no CEP/localização
    try {
      const assignedOrthodontist = await orthodontistService.findNearbyOrthodontist(cep);
      
      if (assignedOrthodontist) {
        // Atribuir ortodontista ao lead
        await executeQuery(
          'UPDATE patient_leads SET ortodontista_id = ?, status = "atribuido" WHERE id = ?',
          [assignedOrthodontist.id, leadId]
        );
        
        // Registrar a atribuição
        await executeQuery(
          'INSERT INTO patient_orthodontist_assignments (patient_lead_id, orthodontist_id, status) VALUES (?, ?, "atribuido")',
          [leadId, assignedOrthodontist.id]
        );
        
        // Enviar notificação para o ortodontista
        await emailService.sendNewLeadNotification(assignedOrthodontist, { nome, email, telefone, cep });
      }
    } catch (error) {
      logger.warn('Erro ao atribuir ortodontista automaticamente:', error.message);
      // Continua o processo mesmo se a atribuição falhar
    }
    
    // Enviar email de confirmação para o paciente
    try {
      await emailService.sendPatientConfirmation({ nome, email, telefone, cep });
    } catch (error) {
      logger.error('Erro ao enviar email de confirmação:', error.message);
      // Não falha o processo se o email não for enviado
    }
    
    // Buscar o lead criado com informações completas
    const createdLead = await executeQuery(
      `SELECT pl.*, o.nome as ortodontista_nome, o.clinica as ortodontista_clinica
       FROM patient_leads pl
       LEFT JOIN orthodontists o ON pl.ortodontista_id = o.id
       WHERE pl.id = ?`,
      [leadId]
    );
    
    logger.info('Lead de paciente criado com sucesso', {
      leadId,
      nome,
      email,
      ortodontistaAtribuido: !!createdLead[0].ortodontista_id
    });
    
    res.status(201).json({
      success: true,
      data: {
        id: leadId,
        message: 'Solicitação recebida com sucesso!',
        proximosPassos: [
          'Você receberá um contato em até 24 horas',
          'Agendamento da consulta de avaliação',
          'Análise do seu caso específico',
          'Apresentação do plano de tratamento personalizado'
        ],
        lead: createdLead[0]
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Erro ao criar lead de paciente:', error);
    next(error);
  }
};

// Listar leads de pacientes
const getPatientLeads = async (req, res, next) => {
  const startTime = Date.now();
  
  try {
    const {
      page = 1,
      limit = 20,
      status,
      ortodontista_id,
      data_inicio,
      data_fim,
      search
    } = req.query;
    
    const offset = (page - 1) * limit;
    let whereConditions = [];
    let queryParams = [];
    
    // Filtros
    if (status) {
      whereConditions.push('pl.status = ?');
      queryParams.push(status);
    }
    
    if (ortodontista_id) {
      whereConditions.push('pl.ortodontista_id = ?');
      queryParams.push(ortodontista_id);
    }
    
    if (data_inicio) {
      whereConditions.push('pl.created_at >= ?');
      queryParams.push(data_inicio);
    }
    
    if (data_fim) {
      whereConditions.push('pl.created_at <= ?');
      queryParams.push(data_fim);
    }
    
    if (search) {
      whereConditions.push('(pl.nome LIKE ? OR pl.email LIKE ? OR pl.telefone LIKE ?)');
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    // Query principal
    const query = `
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
      ${whereClause}
      ORDER BY pl.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    // Query para contar total
    const countQuery = `
      SELECT COUNT(*) as total
      FROM patient_leads pl
      LEFT JOIN orthodontists o ON pl.ortodontista_id = o.id
      ${whereClause}
    `;
    
    queryParams.push(parseInt(limit), parseInt(offset));
    const countParams = queryParams.slice(0, -2); // Remove limit e offset
    
    const [leads, totalResult] = await Promise.all([
      executeQuery(query, queryParams),
      executeQuery(countQuery, countParams)
    ]);
    
    const total = totalResult[0].total;
    const totalPages = Math.ceil(total / limit);
    
    logDBOperation('SELECT', 'patient_leads', leads, Date.now() - startTime);
    
    res.json({
      success: true,
      data: {
        leads,
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
    logger.error('Erro ao buscar leads de pacientes:', error);
    next(error);
  }
};

// Buscar lead específico por ID
const getPatientLeadById = async (req, res, next) => {
  const startTime = Date.now();
  
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        pl.*,
        o.nome as ortodontista_nome,
        o.clinica as ortodontista_clinica,
        o.telefone as ortodontista_telefone,
        o.email as ortodontista_email,
        poa.status as atribuicao_status,
        poa.data_atribuicao,
        poa.observacoes as atribuicao_observacoes
      FROM patient_leads pl
      LEFT JOIN orthodontists o ON pl.ortodontista_id = o.id
      LEFT JOIN patient_orthodontist_assignments poa ON pl.id = poa.patient_lead_id
      WHERE pl.id = ?
    `;
    
    const result = await executeQuery(query, [id]);
    
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Lead não encontrado'
        },
        timestamp: new Date().toISOString()
      });
    }
    
    logDBOperation('SELECT', 'patient_leads', result, Date.now() - startTime);
    
    res.json({
      success: true,
      data: {
        lead: result[0]
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Erro ao buscar lead por ID:', error);
    next(error);
  }
};

// Atualizar status do lead
const updatePatientLeadStatus = async (req, res, next) => {
  const startTime = Date.now();
  
  try {
    const { id } = req.params;
    const { status, observacoes } = req.body;
    
    // Verificar se lead existe
    const existingLead = await executeQuery('SELECT * FROM patient_leads WHERE id = ?', [id]);
    
    if (existingLead.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Lead não encontrado'
        },
        timestamp: new Date().toISOString()
      });
    }
    
    // Atualizar status
    const updateQuery = `
      UPDATE patient_leads 
      SET status = ?, observacoes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    const result = await executeQuery(updateQuery, [status, observacoes || null, id]);
    
    // Se houver atribuição, atualizar também
    if (existingLead[0].ortodontista_id) {
      await executeQuery(
        'UPDATE patient_orthodontist_assignments SET status = ?, observacoes = ? WHERE patient_lead_id = ?',
        [status, observacoes || null, id]
      );
    }
    
    logDBOperation('UPDATE', 'patient_leads', result, Date.now() - startTime);
    
    logger.info('Status do lead atualizado', {
      leadId: id,
      novoStatus: status,
      statusAnterior: existingLead[0].status
    });
    
    res.json({
      success: true,
      data: {
        message: 'Status atualizado com sucesso',
        lead_id: id,
        novo_status: status
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Erro ao atualizar status do lead:', error);
    next(error);
  }
};

// Deletar lead (soft delete)
const deletePatientLead = async (req, res, next) => {
  const startTime = Date.now();
  
  try {
    const { id } = req.params;
    
    // Verificar se lead existe
    const existingLead = await executeQuery('SELECT * FROM patient_leads WHERE id = ?', [id]);
    
    if (existingLead.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Lead não encontrado'
        },
        timestamp: new Date().toISOString()
      });
    }
    
    // Atualizar status para cancelado
    const result = await executeQuery(
      'UPDATE patient_leads SET status = "cancelado", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );
    
    logDBOperation('UPDATE', 'patient_leads', result, Date.now() - startTime);
    
    logger.info('Lead marcado como cancelado', {
      leadId: id,
      nome: existingLead[0].nome,
      email: existingLead[0].email
    });
    
    res.json({
      success: true,
      data: {
        message: 'Lead cancelado com sucesso'
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Erro ao deletar lead:', error);
    next(error);
  }
};

// Estatísticas de leads
const getPatientStats = async (req, res, next) => {
  const startTime = Date.now();
  
  try {
    const { periodo = '30' } = req.query; // últimos 30 dias por padrão
    
    const queries = [
      // Total de leads
      `SELECT COUNT(*) as total_leads FROM patient_leads WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${periodo} DAY)`,
      
      // Leads por status
      `SELECT status, COUNT(*) as count FROM patient_leads WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${periodo} DAY) GROUP BY status`,
      
      // Leads por dia (últimos 7 dias)
      `SELECT DATE(created_at) as data, COUNT(*) as count FROM patient_leads WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) GROUP BY DATE(created_at) ORDER BY data`,
      
      // Taxa de conversão (leads atribuídos vs total)
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN ortodontista_id IS NOT NULL THEN 1 ELSE 0 END) as atribuidos
       FROM patient_leads WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${periodo} DAY)`,
      
      // Top ortodontistas por leads recebidos
      `SELECT 
        o.nome, o.clinica, COUNT(pl.id) as total_leads
       FROM patient_leads pl
       JOIN orthodontists o ON pl.ortodontista_id = o.id
       WHERE pl.created_at >= DATE_SUB(NOW(), INTERVAL ${periodo} DAY)
       GROUP BY o.id
       ORDER BY total_leads DESC
       LIMIT 5`
    ];
    
    const [
      totalLeads,
      leadsPorStatus,
      leadsPorDia,
      taxaConversao,
      topOrtodontistas
    ] = await Promise.all(queries.map(query => executeQuery(query)));
    
    logDBOperation('SELECT', 'patient_leads_stats', { length: 5 }, Date.now() - startTime);
    
    res.json({
      success: true,
      data: {
        resumo: {
          total_leads: totalLeads[0].total_leads,
          taxa_atribuicao: taxaConversao[0].total > 0 
            ? ((taxaConversao[0].atribuidos / taxaConversao[0].total) * 100).toFixed(1)
            : 0,
          periodo_dias: parseInt(periodo)
        },
        leads_por_status: leadsPorStatus,
        leads_por_dia: leadsPorDia,
        top_ortodontistas: topOrtodontistas
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Erro ao buscar estatísticas:', error);
    next(error);
  }
};

module.exports = {
  createPatientLead,
  getPatientLeads,
  getPatientLeadById,
  updatePatientLeadStatus,
  deletePatientLead,
  getPatientStats
};