const { executeQuery } = require('../config/database');
const { logger } = require('../utils/logger');

// GET /api/crm/leads - Listar todos os leads do CRM
const getCrmLeads = async (req, res, next) => {
  try {
    const { status, responsavel, origem, page = 1, limit = 50, search } = req.query;
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

    if (responsavel && responsavel !== 'all') {
      whereConditions.push('responsavel_comercial = ?');
      queryParams.push(responsavel);
    }

    if (origem && origem !== 'all') {
      whereConditions.push('origem_lead = ?');
      queryParams.push(origem);
    }

    if (search) {
      whereConditions.push('(nome LIKE ? OR clinica LIKE ? OR email LIKE ? OR cro LIKE ?)');
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Query principal com todas as colunas
    const query = `SELECT * FROM crm_leads ${whereClause} ORDER BY created_at DESC LIMIT ${limitNum} OFFSET ${offset}`;
    
    // Query de contagem
    const countQuery = `SELECT COUNT(*) as total FROM crm_leads ${whereClause}`;

    const leads = await executeQuery(query, queryParams);
    const countResult = await executeQuery(countQuery, queryParams);
    const total = countResult[0]?.total || 0;
    
    const totalPages = Math.ceil(total / limitNum);

    logger.info('Query de leads CRM executada com sucesso:', { count: leads.length, total, filters: { status, responsavel, origem, search } });

    res.json({
      success: true,
      leads: leads || [],
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
    const { status } = req.body;

    console.log('Simple updateLeadStatus - params:', { id, status });

    const validStatuses = ['prospeccao', 'contato_inicial', 'apresentacao', 'negociacao'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Status inválido', validStatuses },
        timestamp: new Date().toISOString()
      });
    }

    // Query mais simples possível para debug
    const leadId = parseInt(id);
    if (isNaN(leadId)) {
      return res.status(400).json({
        success: false,
        error: { message: 'ID inválido' },
        timestamp: new Date().toISOString()
      });
    }
    
    const updateQuery = `UPDATE crm_leads SET status = ?, updated_at = NOW() WHERE id = ?`;
    const queryParams = [status, leadId];
    console.log('Simple query params:', queryParams);
    
    await executeQuery(updateQuery, queryParams);
    console.log('Query executed successfully');

    res.json({
      success: true,
      message: 'Status atualizado com sucesso',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Erro ao atualizar status do lead:', error);
    console.error('Full error details:', error);
    res.status(500).json({
      success: false,
      error: { 
        message: 'Erro ao atualizar status',
        details: error.message 
      },
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

// POST /api/crm/leads - Criar novo lead
const createCrmLead = async (req, res, next) => {
  try {
    const {
      nome,
      clinica,
      cro,
      email,
      telefone,
      cep,
      cidade,
      estado,
      consultórios,
      scanner,
      scanner_marca,
      casos_mes,
      interesse,
      responsavel_comercial,
      origem_lead = 'outbound',
      observacoes_internas
    } = req.body;

    // Validação básica
    if (!nome || !clinica || !cro || !email || !telefone) {
      return res.status(400).json({
        success: false,
        error: { message: 'Campos obrigatórios: nome, clinica, cro, email, telefone' },
        timestamp: new Date().toISOString()
      });
    }

    // Verificar se CRO já existe
    const existingLead = await executeQuery('SELECT id FROM crm_leads WHERE cro = ?', [cro]);
    if (existingLead.length > 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Já existe um lead com este CRO' },
        timestamp: new Date().toISOString()
      });
    }

    // Usar apenas colunas básicas que sabemos que existem na tabela atual
    const insertQuery = `
      INSERT INTO crm_leads (
        nome, clinica, cro, email, telefone, 
        responsavel_comercial, origem_lead, observacoes_internas
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const queryParams = [
      nome, clinica, cro, email, telefone,
      responsavel_comercial || 'Sistema', 
      origem_lead || 'outbound', 
      observacoes_internas || `Lead criado via formulário: ${JSON.stringify({
        cidade, estado, cep, consultórios, scanner, scanner_marca, 
        casos_mes, interesse
      })}`
    ];

    const result = await executeQuery(insertQuery, queryParams);

    // Registrar atividade
    const activityQuery = `
      INSERT INTO crm_activities (crm_lead_id, tipo, titulo, descricao, usuario)
      VALUES (?, 'mudanca_status', 'Lead criado', 'Novo lead adicionado ao sistema', ?)
    `;
    await executeQuery(activityQuery, [result.insertId, responsavel_comercial || 'Sistema']);

    logger.info(`Novo lead CRM criado: ${nome} (${cro})`);

    res.status(201).json({
      success: true,
      message: 'Lead criado com sucesso',
      leadId: result.insertId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Erro ao criar lead CRM:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao criar lead', details: error.message },
      timestamp: new Date().toISOString()
    });
  }
};

// GET /api/crm/leads/:id - Buscar lead específico
const getCrmLead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lead = await executeQuery('SELECT * FROM crm_leads WHERE id = ?', [id]);
    
    if (!lead.length) {
      return res.status(404).json({
        success: false,
        error: { message: 'Lead não encontrado' },
        timestamp: new Date().toISOString()
      });
    }

    // Buscar atividades do lead
    const activities = await executeQuery(
      'SELECT * FROM crm_activities WHERE crm_lead_id = ? ORDER BY created_at DESC',
      [id]
    );

    res.json({
      success: true,
      lead: lead[0],
      activities: activities || [],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Erro ao buscar lead CRM:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Erro ao buscar lead', details: error.message },
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = {
  getCrmLeads,
  getCrmStats,
  updateLeadStatus,
  migrateLeadToPpartnership,
  createCrmLead,
  getCrmLead
};