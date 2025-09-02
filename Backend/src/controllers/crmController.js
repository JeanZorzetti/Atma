const { executeQuery } = require('../config/database');
const logger = require('../utils/logger');

// GET /api/crm/leads - Listar todos os leads do CRM
const getCrmLeads = async (req, res, next) => {
  try {
    const { status, responsavel, page = 1, limit = 50 } = req.query;
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(Math.max(1, parseInt(limit) || 50), 100);
    const offset = (pageNum - 1) * limitNum;

    let whereConditions = [];
    let queryParams = [];

    // Filtros
    if (status && status !== 'all') {
      whereConditions.push('status = ?');
      queryParams.push(status);
    }

    if (responsavel) {
      whereConditions.push('responsavel_comercial = ?');
      queryParams.push(responsavel);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Query principal
    const query = `
      SELECT 
        id, nome, clinica, cro, email, telefone, cidade, estado,
        consultórios, scanner, scanner_marca, casos_mes, interesse,
        status, responsavel_comercial, origem_lead,
        observacoes_internas, próximo_followup,
        data_prospeccao, data_contato_inicial, data_apresentacao, data_negociacao,
        created_at, updated_at
      FROM crm_leads 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `;

    // Query de contagem
    const countQuery = `SELECT COUNT(*) as total FROM crm_leads ${whereClause}`;

    const [leadsResult, totalResult] = await Promise.allSettled([
      executeQuery(query, [...queryParams, limitNum, offset]),
      executeQuery(countQuery, queryParams)
    ]);

    let leads = [];
    let total = 0;

    if (leadsResult.status === 'fulfilled') {
      leads = leadsResult.value || [];
      logger.info('Query de leads CRM executada com sucesso:', { count: leads.length });
    } else {
      logger.error('Erro na query de leads CRM:', leadsResult.reason?.message);
      return res.status(500).json({
        success: false,
        error: { message: 'Erro ao buscar leads do CRM', details: leadsResult.reason?.message },
        timestamp: new Date().toISOString()
      });
    }

    if (totalResult.status === 'fulfilled') {
      total = totalResult.value?.[0]?.total || 0;
    } else {
      total = leads.length;
    }

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      leads,
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
    logger.error('Erro no endpoint de leads CRM:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Erro interno do servidor', details: error.message },
      timestamp: new Date().toISOString()
    });
  }
};

// GET /api/crm/stats - Estatísticas e conversões do funil
const getCrmStats = async (req, res, next) => {
  try {
    const queries = [
      // Contagem por status
      `SELECT status, COUNT(*) as count FROM crm_leads GROUP BY status`,
      
      // Conversões entre etapas (baseado em timestamps)
      `SELECT 
        SUM(CASE WHEN data_contato_inicial IS NOT NULL THEN 1 ELSE 0 END) as prospeccao_to_contato,
        SUM(CASE WHEN data_apresentacao IS NOT NULL THEN 1 ELSE 0 END) as contato_to_apresentacao,
        SUM(CASE WHEN data_negociacao IS NOT NULL THEN 1 ELSE 0 END) as apresentacao_to_negociacao,
        COUNT(*) as total_leads
       FROM crm_leads`,
      
      // Leads fechados (migrados para orthodontist_partnerships)
      `SELECT COUNT(*) as fechados FROM orthodontist_partnerships WHERE status = 'fechado'`,
      
      // Leads por responsável
      `SELECT responsavel_comercial, COUNT(*) as count 
       FROM crm_leads 
       WHERE responsavel_comercial IS NOT NULL 
       GROUP BY responsavel_comercial`,
       
      // Leads por origem
      `SELECT origem_lead, COUNT(*) as count FROM crm_leads GROUP BY origem_lead`,
      
      // Tempo médio por etapa (em dias)
      `SELECT 
        AVG(DATEDIFF(COALESCE(data_contato_inicial, NOW()), data_prospeccao)) as tempo_prospeccao_dias,
        AVG(DATEDIFF(COALESCE(data_apresentacao, NOW()), data_contato_inicial)) as tempo_contato_dias,
        AVG(DATEDIFF(COALESCE(data_negociacao, NOW()), data_apresentacao)) as tempo_apresentacao_dias
       FROM crm_leads 
       WHERE data_contato_inicial IS NOT NULL`
    ];

    const queryResults = await Promise.allSettled(
      queries.map(query => executeQuery(query))
    );

    const [
      statusResult,
      conversionResult, 
      fechadosResult,
      responsavelResult,
      origemResult,
      tempoResult
    ] = queryResults.map(result => 
      result.status === 'fulfilled' ? result.value : []
    );

    // Processar contagem por status
    const statusCount = {
      prospeccao: 0,
      contato_inicial: 0,
      apresentacao: 0,
      negociacao: 0
    };

    statusResult.forEach(row => {
      if (statusCount.hasOwnProperty(row.status)) {
        statusCount[row.status] = row.count;
      }
    });

    // Calcular conversões
    const conversions = conversionResult[0] || {};
    const totalLeads = conversions.total_leads || 1;
    const fechados = fechadosResult[0]?.fechados || 0;

    const conversionRates = {
      prospeccao_to_contato: totalLeads > 0 ? ((conversions.prospeccao_to_contato || 0) / totalLeads * 100).toFixed(1) : '0.0',
      contato_to_apresentacao: conversions.prospeccao_to_contato > 0 ? ((conversions.contato_to_apresentacao || 0) / conversions.prospeccao_to_contato * 100).toFixed(1) : '0.0',
      apresentacao_to_negociacao: conversions.contato_to_apresentacao > 0 ? ((conversions.apresentacao_to_negociacao || 0) / conversions.contato_to_apresentacao * 100).toFixed(1) : '0.0',
      negociacao_to_fechado: conversions.apresentacao_to_negociacao > 0 ? (fechados / conversions.apresentacao_to_negociacao * 100).toFixed(1) : '0.0',
      overall: totalLeads > 0 ? (fechados / totalLeads * 100).toFixed(1) : '0.0'
    };

    // Processar dados por responsável
    const leadsByResponsavel = responsavelResult.reduce((acc, row) => {
      acc[row.responsavel_comercial] = row.count;
      return acc;
    }, {});

    // Processar dados por origem
    const leadsByOrigem = origemResult.reduce((acc, row) => {
      acc[row.origem_lead] = row.count;
      return acc;
    }, {});

    // Tempo médio por etapa
    const tempoMedio = tempoResult[0] || {};

    res.json({
      success: true,
      data: {
        // Contadores por etapa
        pipeline: {
          prospeccao: statusCount.prospeccao,
          contato_inicial: statusCount.contato_inicial,
          apresentacao: statusCount.apresentacao,
          negociacao: statusCount.negociacao,
          fechado: fechados
        },
        
        // Taxa de conversão por etapa
        conversion_rates: conversionRates,
        
        // Distribuições
        by_responsavel: leadsByResponsavel,
        by_origem: leadsByOrigem,
        
        // Tempo médio
        tempo_medio_dias: {
          prospeccao: Math.round(tempoMedio.tempo_prospeccao_dias || 0),
          contato: Math.round(tempoMedio.tempo_contato_dias || 0),
          apresentacao: Math.round(tempoMedio.tempo_apresentacao_dias || 0)
        },
        
        // Totais
        total_leads_crm: totalLeads,
        total_fechados: fechados,
        total_geral: totalLeads + fechados
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Erro ao buscar estatísticas do CRM:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao calcular estatísticas', details: error.message },
      timestamp: new Date().toISOString()
    });
  }
};

// PUT /api/crm/leads/:id/status - Atualizar status do lead
const updateLeadStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, observacoes } = req.body;

    const validStatuses = ['prospeccao', 'contato_inicial', 'apresentacao', 'negociacao'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Status inválido', validStatuses },
        timestamp: new Date().toISOString()
      });
    }

    // Determinar qual campo de timestamp atualizar
    const timestampField = {
      'prospeccao': 'data_prospeccao',
      'contato_inicial': 'data_contato_inicial', 
      'apresentacao': 'data_apresentacao',
      'negociacao': 'data_negociacao'
    }[status];

    // Atualizar o lead
    const updateQuery = `
      UPDATE crm_leads 
      SET status = ?, 
          ${timestampField} = COALESCE(${timestampField}, NOW()),
          observacoes_internas = COALESCE(?, observacoes_internas),
          updated_at = NOW()
      WHERE id = ?
    `;

    await executeQuery(updateQuery, [status, observacoes, id]);

    // Registrar atividade
    const activityQuery = `
      INSERT INTO crm_activities (crm_lead_id, tipo, titulo, descricao, usuario)
      VALUES (?, 'mudanca_status', ?, ?, 'Sistema')
    `;

    const activityTitle = `Status alterado para: ${status}`;
    const activityDesc = observacoes || `Lead movido para etapa ${status}`;

    await executeQuery(activityQuery, [id, activityTitle, activityDesc]);

    logger.info(`Status do lead ${id} atualizado para ${status}`);

    res.json({
      success: true,
      message: 'Status atualizado com sucesso',
      data: { id, status, timestamp: new Date().toISOString() },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Erro ao atualizar status do lead:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao atualizar status', details: error.message },
      timestamp: new Date().toISOString()
    });
  }
};

// POST /api/crm/leads/:id/migrate - Migrar lead fechado para orthodontist_partnerships
const migrateLeadToPpartnership = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      endereco_completo, 
      cep, 
      cidade, 
      estado, 
      modelo_parceria, 
      data_inicio,
      comissao_percentual,
      valor_lab_fee 
    } = req.body;

    // Verificar se o lead existe e está em negociação
    const leadQuery = 'SELECT * FROM crm_leads WHERE id = ? AND status = ?';
    const leadResult = await executeQuery(leadQuery, [id, 'negociacao']);

    if (!leadResult || leadResult.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Lead não encontrado ou não está em status de negociação' },
        timestamp: new Date().toISOString()
      });
    }

    const lead = leadResult[0];

    // Verificar se já existe ortodontista com mesmo CRO
    const existingOrthoQuery = 'SELECT id FROM orthodontists WHERE cro = ?';
    const existingOrtho = await executeQuery(existingOrthoQuery, [lead.cro]);

    if (existingOrtho && existingOrtho.length > 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Já existe um ortodontista cadastrado com este CRO' },
        timestamp: new Date().toISOString()
      });
    }

    // Iniciar transação
    const connection = await executeQuery('START TRANSACTION');

    try {
      // 1. Criar registro em orthodontist_partnerships com status fechado
      const partnershipQuery = `
        INSERT INTO orthodontist_partnerships (
          nome, clinica, cro, email, telefone, consultórios, scanner, 
          scanner_marca, casos_mes, interesse, status, responsavel_comercial,
          observacoes_internas, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'fechado', ?, ?, ?, ?)
      `;

      const partnershipResult = await executeQuery(partnershipQuery, [
        lead.nome,
        lead.clinica,
        lead.cro,
        lead.email,
        lead.telefone,
        lead.consultórios,
        lead.scanner,
        lead.scanner_marca,
        lead.casos_mes,
        lead.interesse,
        lead.responsavel_comercial,
        lead.observacoes_internas,
        lead.created_at,
        new Date()
      ]);

      // 2. Criar ortodontista ativo
      const orthodontistQuery = `
        INSERT INTO orthodontists (
          nome, clinica, cro, email, telefone, endereco_completo, cep, cidade, estado,
          modelo_parceria, status, data_inicio, tem_scanner, scanner_marca, 
          capacidade_mensal, comissao_percentual, valor_lab_fee, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ativo', ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const capacidade = {
        '1-5': 5,
        '6-10': 10,
        '11-20': 20,
        '21+': 50
      }[lead.casos_mes] || 10;

      await executeQuery(orthodontistQuery, [
        lead.nome,
        lead.clinica,
        lead.cro,
        lead.email,
        lead.telefone,
        endereco_completo,
        cep,
        cidade,
        estado,
        modelo_parceria,
        data_inicio,
        lead.scanner === 'sim',
        lead.scanner_marca,
        capacidade,
        comissao_percentual,
        valor_lab_fee,
        new Date(),
        new Date()
      ]);

      // 3. Remover lead do CRM
      await executeQuery('DELETE FROM crm_leads WHERE id = ?', [id]);

      // 4. Registrar atividade
      const activityQuery = `
        INSERT INTO crm_activities (crm_lead_id, tipo, titulo, descricao, usuario)
        VALUES (?, 'mudanca_status', 'Lead migrado para parceria', 'Lead fechado e migrado para orthodontist_partnerships e orthodontists', 'Sistema')
      `;

      await executeQuery(activityQuery, [id, 'Lead migrado para parceria', 'Lead fechado e migrado para orthodontist_partnerships e orthodontists', 'Sistema']);

      // Commit da transação
      await executeQuery('COMMIT');

      logger.info(`Lead ${id} migrado com sucesso para ortodontista ativo`);

      res.json({
        success: true,
        message: 'Lead migrado com sucesso para parceria ativa',
        data: {
          partnershipId: partnershipResult.insertId,
          leadId: id,
          status: 'fechado'
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      // Rollback em caso de erro
      await executeQuery('ROLLBACK');
      throw error;
    }

  } catch (error) {
    logger.error('Erro ao migrar lead para parceria:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao migrar lead para parceria', details: error.message },
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = {
  getCrmLeads,
  getCrmStats,
  updateLeadStatus,
  migrateLeadToPpartnership
};