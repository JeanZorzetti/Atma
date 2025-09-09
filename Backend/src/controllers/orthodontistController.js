const { executeQuery, executeTransaction } = require('../config/database');
const { logger, logDBOperation } = require('../utils/logger');
const emailService = require('../services/emailService');
const cepService = require('../services/cepService');

// Criar solicitação de parceria
const createPartnershipRequest = async (req, res, next) => {
  const startTime = Date.now();
  
  try {
    const {
      nome, clinica, cro, email, telefone,
      consultórios, scanner, scannerMarca, casosmes,
      interesse, mensagem
    } = req.body;
    
    // Verificar se já existe solicitação com o mesmo CRO ou email
    const existingRequest = await executeQuery(
      'SELECT id, cro, email FROM orthodontist_partnerships WHERE (cro = ? OR email = ?) AND status NOT IN ("rejeitado", "fechado")',
      [cro, email]
    );
    
    if (existingRequest.length > 0) {
      const existing = existingRequest[0];
      const conflictField = existing.cro === cro ? 'CRO' : 'email';
      
      return res.status(409).json({
        success: false,
        error: {
          message: `Já existe uma solicitação ativa para este ${conflictField}.`,
          suggestion: 'Entre em contato conosco se precisar atualizar suas informações.'
        },
        timestamp: new Date().toISOString()
      });
    }
    
    // Criar a solicitação de parceria
    const query = `
      INSERT INTO orthodontist_partnerships (
        nome, clinica, cro, email, telefone,
        consultórios, scanner, scanner_marca, casos_mes,
        interesse, mensagem, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'novo')
    `;
    
    const result = await executeQuery(query, [
      nome, clinica, cro, email, telefone,
      consultórios, scanner, scannerMarca || null, casosmes,
      interesse, mensagem || null
    ]);
    
    const requestId = result.insertId;
    
    logDBOperation('INSERT', 'orthodontist_partnerships', result, Date.now() - startTime);
    
    // Enviar email de confirmação para o ortodontista
    try {
      await emailService.sendOrthodontistPartnershipConfirmation({
        nome, email, clinica, cro, interesse
      });
    } catch (error) {
      logger.error('Erro ao enviar email de confirmação para ortodontista:', error.message);
    }
    
    // Enviar notificação para equipe comercial
    try {
      await emailService.sendNewPartnershipNotification({
        nome, clinica, cro, email, telefone,
        consultórios, scanner, scannerMarca, casosmes,
        interesse, mensagem, requestId
      });
    } catch (error) {
      logger.error('Erro ao enviar notificação para equipe comercial:', error.message);
    }
    
    logger.info('Solicitação de parceria criada com sucesso', {
      requestId,
      nome,
      clinica,
      cro,
      interesse
    });
    
    res.status(201).json({
      success: true,
      data: {
        id: requestId,
        message: 'Solicitação de parceria recebida com sucesso!',
        proximosPassos: [
          'Análise do perfil da sua clínica',
          'Apresentação personalizada dos modelos de parceria',
          'Demonstração da tecnologia e software',
          'Proposta comercial customizada',
          'Suporte completo para implementação'
        ]
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Erro ao criar solicitação de parceria:', error);
    next(error);
  }
};

// Listar solicitações de parceria
const getPartnershipRequests = async (req, res, next) => {
  const startTime = Date.now();
  
  try {
    const {
      page = 1,
      limit = 20,
      status,
      interesse,
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
    
    if (interesse) {
      whereConditions.push('interesse = ?');
      queryParams.push(interesse);
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
      whereConditions.push('(nome LIKE ? OR clinica LIKE ? OR email LIKE ? OR cro LIKE ?)');
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    // Query principal
    const query = `
      SELECT 
        *,
        CASE 
          WHEN status = 'novo' THEN 1
          WHEN status = 'analisando' THEN 2
          WHEN status = 'proposta-enviada' THEN 3
          WHEN status = 'negociacao' THEN 4
          WHEN status = 'fechado' THEN 5
          WHEN status = 'rejeitado' THEN 6
          ELSE 7
        END as status_priority
      FROM orthodontist_partnerships
      ${whereClause}
      ORDER BY status_priority ASC, created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    // Query para contar total
    const countQuery = `
      SELECT COUNT(*) as total
      FROM orthodontist_partnerships
      ${whereClause}
    `;
    
    queryParams.push(parseInt(limit), parseInt(offset));
    const countParams = queryParams.slice(0, -2);
    
    const [requests, totalResult] = await Promise.all([
      executeQuery(query, queryParams),
      executeQuery(countQuery, countParams)
    ]);
    
    const total = totalResult[0].total;
    const totalPages = Math.ceil(total / limit);
    
    logDBOperation('SELECT', 'orthodontist_partnerships', requests, Date.now() - startTime);
    
    // Mapear partnerships para formato de orthodontists para o admin
    const orthodontists = requests.map(partnership => ({
      id: partnership.id,
      name: partnership.nome,
      email: partnership.email,
      phone: partnership.telefone,
      cro: partnership.cro,
      specialty: 'Ortodontia',
      city: 'A definir',
      state: 'SP',
      status: partnership.status === 'fechado' ? 'Ativo' : 'Pendente',
      patientsCount: 0,
      rating: 0,
      registrationDate: partnership.created_at.split('T')[0],
      partnershipModel: partnership.interesse === 'atma-aligner' ? 'Standard' : 'Premium'
    }));

    res.json({
      success: true,
      orthodontists: orthodontists,
      total: total,
      pagination: {
        current_page: parseInt(page),
        total_pages: totalPages,
        total_items: total,
        items_per_page: parseInt(limit),
        has_next: page < totalPages,
        has_prev: page > 1
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Erro ao buscar solicitações de parceria:', error);
    next(error);
  }
};

// Buscar solicitação específica por ID
const getPartnershipRequestById = async (req, res, next) => {
  const startTime = Date.now();
  
  try {
    const { id } = req.params;
    
    const result = await executeQuery(
      'SELECT * FROM orthodontist_partnerships WHERE id = ?',
      [id]
    );
    
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Solicitação de parceria não encontrada'
        },
        timestamp: new Date().toISOString()
      });
    }
    
    logDBOperation('SELECT', 'orthodontist_partnerships', result, Date.now() - startTime);
    
    res.json({
      success: true,
      data: {
        partnership: result[0]
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Erro ao buscar solicitação por ID:', error);
    next(error);
  }
};

// Atualizar status da solicitação
const updatePartnershipStatus = async (req, res, next) => {
  const startTime = Date.now();
  
  try {
    const { id } = req.params;
    const { status, observacoes, responsavel_comercial } = req.body;
    
    // Verificar se solicitação existe
    const existingRequest = await executeQuery(
      'SELECT * FROM orthodontist_partnerships WHERE id = ?',
      [id]
    );
    
    if (existingRequest.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Solicitação de parceria não encontrada'
        },
        timestamp: new Date().toISOString()
      });
    }
    
    // Atualizar status
    const updateQuery = `
      UPDATE orthodontist_partnerships 
      SET status = ?, observacoes_internas = ?, responsavel_comercial = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    const result = await executeQuery(updateQuery, [
      status, 
      observacoes || existingRequest[0].observacoes_internas,
      responsavel_comercial || existingRequest[0].responsavel_comercial,
      id
    ]);
    
    logDBOperation('UPDATE', 'orthodontist_partnerships', result, Date.now() - startTime);
    
    // Se status foi alterado para "fechado", criar ortodontista na tabela de parceiros
    if (status === 'fechado' && existingRequest[0].status !== 'fechado') {
      try {
        await createOrthodontistFromPartnership(existingRequest[0]);
        logger.info('Ortodontista criado automaticamente após fechamento da parceria', {
          partnershipId: id,
          cro: existingRequest[0].cro
        });
      } catch (error) {
        logger.error('Erro ao criar ortodontista automaticamente:', error.message);
      }
    }
    
    logger.info('Status da parceria atualizado', {
      partnershipId: id,
      novoStatus: status,
      statusAnterior: existingRequest[0].status,
      responsavelComercial: responsavel_comercial
    });
    
    res.json({
      success: true,
      data: {
        message: 'Status atualizado com sucesso',
        partnership_id: id,
        novo_status: status
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Erro ao atualizar status da parceria:', error);
    next(error);
  }
};

// Deletar solicitação de parceria
const deletePartnershipRequest = async (req, res, next) => {
  const startTime = Date.now();
  
  try {
    const { id } = req.params;
    
    // Verificar se solicitação existe
    const existingRequest = await executeQuery(
      'SELECT * FROM orthodontist_partnerships WHERE id = ?',
      [id]
    );
    
    if (existingRequest.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Solicitação de parceria não encontrada'
        },
        timestamp: new Date().toISOString()
      });
    }
    
    // Atualizar status para rejeitado ao invés de deletar
    const result = await executeQuery(
      'UPDATE orthodontist_partnerships SET status = "rejeitado", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );
    
    logDBOperation('UPDATE', 'orthodontist_partnerships', result, Date.now() - startTime);
    
    logger.info('Solicitação de parceria rejeitada', {
      partnershipId: id,
      nome: existingRequest[0].nome,
      clinica: existingRequest[0].clinica
    });
    
    res.json({
      success: true,
      data: {
        message: 'Solicitação rejeitada com sucesso'
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Erro ao rejeitar solicitação:', error);
    next(error);
  }
};

// Listar ortodontistas ativos (parceiros)
const getActiveOrthodontists = async (req, res, next) => {
  const startTime = Date.now();
  
  try {
    const {
      page = 1,
      limit = 20,
      modelo_parceria,
      cidade,
      estado,
      search
    } = req.query;
    
    const offset = (page - 1) * limit;
    let whereConditions = ['status = "ativo"'];
    let queryParams = [];
    
    // Filtros
    if (modelo_parceria) {
      whereConditions.push('modelo_parceria = ?');
      queryParams.push(modelo_parceria);
    }
    
    if (cidade) {
      whereConditions.push('cidade = ?');
      queryParams.push(cidade);
    }
    
    if (estado) {
      whereConditions.push('estado = ?');
      queryParams.push(estado);
    }
    
    if (search) {
      whereConditions.push('(nome LIKE ? OR clinica LIKE ? OR cro LIKE ?)');
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }
    
    const whereClause = `WHERE ${whereConditions.join(' AND ')}`;
    
    // Query principal
    const query = `
      SELECT 
        id, nome, clinica, cro, cidade, estado, modelo_parceria,
        tem_scanner, scanner_marca, capacidade_mensal, data_inicio
      FROM orthodontists
      ${whereClause}
      ORDER BY nome ASC
      LIMIT ? OFFSET ?
    `;
    
    // Query para contar total
    const countQuery = `
      SELECT COUNT(*) as total
      FROM orthodontists
      ${whereClause}
    `;
    
    queryParams.push(parseInt(limit), parseInt(offset));
    const countParams = queryParams.slice(0, -2);
    
    const [orthodontists, totalResult] = await Promise.all([
      executeQuery(query, queryParams),
      executeQuery(countQuery, countParams)
    ]);
    
    const total = totalResult[0].total;
    const totalPages = Math.ceil(total / limit);
    
    logDBOperation('SELECT', 'orthodontists', orthodontists, Date.now() - startTime);
    
    res.json({
      success: true,
      data: {
        orthodontists,
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
    logger.error('Erro ao buscar ortodontistas ativos:', error);
    next(error);
  }
};

// Buscar ortodontistas por localização
const searchOrthodontists = async (req, res, next) => {
  const startTime = Date.now();
  
  try {
    const { cep, cidade, estado, distancia = 50 } = req.query;
    
    let whereConditions = ['status = "ativo"'];
    let queryParams = [];
    
    if (cep) {
      // Buscar por CEP próximo (implementação simplificada)
      const cepNumerico = cep.replace(/\D/g, '');
      whereConditions.push('cep LIKE ?');
      queryParams.push(`${cepNumerico.substring(0, 5)}%`);
    } else if (cidade && estado) {
      whereConditions.push('cidade = ? AND estado = ?');
      queryParams.push(cidade, estado);
    } else if (estado) {
      whereConditions.push('estado = ?');
      queryParams.push(estado);
    }
    
    const whereClause = `WHERE ${whereConditions.join(' AND ')}`;
    
    const query = `
      SELECT 
        id, nome, clinica, cro, cidade, estado, cep,
        modelo_parceria, tem_scanner, capacidade_mensal
      FROM orthodontists
      ${whereClause}
      ORDER BY cidade ASC, nome ASC
      LIMIT 20
    `;
    
    const orthodontists = await executeQuery(query, queryParams);
    
    logDBOperation('SELECT', 'orthodontists_search', orthodontists, Date.now() - startTime);
    
    res.json({
      success: true,
      data: {
        orthodontists,
        total_encontrados: orthodontists.length,
        criterios_busca: { cep, cidade, estado, distancia }
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Erro ao buscar ortodontistas por localização:', error);
    next(error);
  }
};

// Estatísticas de parcerias
const getOrthodontistStats = async (req, res, next) => {
  const startTime = Date.now();
  
  try {
    const { periodo = '30' } = req.query;
    
    const queries = [
      // Total de solicitações
      `SELECT COUNT(*) as total_solicitacoes FROM orthodontist_partnerships WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${periodo} DAY)`,
      
      // Solicitações por status
      `SELECT status, COUNT(*) as count FROM orthodontist_partnerships WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${periodo} DAY) GROUP BY status`,
      
      // Solicitações por tipo de interesse
      `SELECT interesse, COUNT(*) as count FROM orthodontist_partnerships WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${periodo} DAY) GROUP BY interesse`,
      
      // Ortodontistas ativos
      `SELECT COUNT(*) as total_ativos FROM orthodontists WHERE status = "ativo"`,
      
      // Ortodontistas por modelo de parceria
      `SELECT modelo_parceria, COUNT(*) as count FROM orthodontists WHERE status = "ativo" GROUP BY modelo_parceria`,
      
      // Taxa de conversão (fechados vs total)
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = "fechado" THEN 1 ELSE 0 END) as fechados
       FROM orthodontist_partnerships WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${periodo} DAY)`
    ];
    
    const [
      totalSolicitacoes,
      solicitacoesPorStatus,
      solicitacoesPorInteresse,
      ortodontistasAtivos,
      ortodontistasPorModelo,
      taxaConversao
    ] = await Promise.all(queries.map(query => executeQuery(query)));
    
    logDBOperation('SELECT', 'orthodontist_stats', { length: 6 }, Date.now() - startTime);
    
    res.json({
      success: true,
      data: {
        resumo: {
          total_solicitacoes: totalSolicitacoes[0].total_solicitacoes,
          ortodontistas_ativos: ortodontistasAtivos[0].total_ativos,
          taxa_conversao: taxaConversao[0].total > 0 
            ? ((taxaConversao[0].fechados / taxaConversao[0].total) * 100).toFixed(1)
            : 0,
          periodo_dias: parseInt(periodo)
        },
        solicitacoes_por_status: solicitacoesPorStatus,
        solicitacoes_por_interesse: solicitacoesPorInteresse,
        ortodontistas_por_modelo: ortodontistasPorModelo
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Erro ao buscar estatísticas de ortodontistas:', error);
    next(error);
  }
};

// Criar ortodontista (após aprovação da parceria)
const createOrthodontist = async (req, res, next) => {
  try {
    const orthodontistData = req.body;
    
    const query = `
      INSERT INTO orthodontists (
        nome, clinica, cro, email, telefone, endereco_completo, 
        cep, cidade, estado, modelo_parceria, tem_scanner, 
        scanner_marca, capacidade_mensal, data_inicio, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ativo')
    `;
    
    const result = await executeQuery(query, [
      orthodontistData.nome,
      orthodontistData.clinica,
      orthodontistData.cro,
      orthodontistData.email,
      orthodontistData.telefone,
      orthodontistData.endereco_completo,
      orthodontistData.cep,
      orthodontistData.cidade,
      orthodontistData.estado,
      orthodontistData.modelo_parceria,
      orthodontistData.tem_scanner || false,
      orthodontistData.scanner_marca || null,
      orthodontistData.capacidade_mensal || 0,
      orthodontistData.data_inicio || new Date().toISOString().split('T')[0]
    ]);
    
    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        message: 'Ortodontista criado com sucesso'
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Erro ao criar ortodontista:', error);
    next(error);
  }
};

// Listar ortodontistas cadastrados
const getOrthodontists = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status = 'ativo' } = req.query;
    const offset = (page - 1) * limit;

    // Verificar se tabela existe primeiro
    const tableExistsQuery = `
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      AND table_name = 'orthodontists'
    `;

    const tableExists = await executeQuery(tableExistsQuery);
    
    if (!tableExists[0] || tableExists[0].count === 0) {
      // Tabela não existe, retornar lista vazia
      return res.json({
        success: true,
        data: {
          orthodontists: [],
          total: 0,
          pagination: {
            currentPage: parseInt(page),
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
            itemsPerPage: parseInt(limit)
          }
        },
        message: "Tabela orthodontists não encontrada. Nenhum ortodontista cadastrado ainda.",
        timestamp: new Date().toISOString()
      });
    }

    // Consulta principal para ortodontistas (simplificada primeiro)
    const orthodontistsQuery = `
      SELECT 
        id,
        nome,
        clinica,
        cro,
        email,
        telefone,
        cidade,
        estado,
        modelo_parceria,
        status,
        data_inicio
      FROM orthodontists 
      WHERE status = ?
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `;

    // Consulta para contagem total
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM orthodontists 
      WHERE status = ?
    `;

    const [orthodontists, countResult] = await Promise.all([
      executeQuery(orthodontistsQuery, [status, parseInt(limit), offset]),
      executeQuery(countQuery, [status])
    ]);

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Debug logs
    logger.info(`Orthodontists query result: ${JSON.stringify({ count: orthodontists.length, total, status })}`);
    if (orthodontists.length > 0) {
      logger.info(`First orthodontist: ${JSON.stringify(orthodontists[0])}`);
    }

    res.json({
      success: true,
      data: {
        orthodontists: orthodontists.map(orthodontist => ({
          id: orthodontist.id,
          name: orthodontist.nome || 'Nome não informado',
          email: orthodontist.email || 'Email não informado',
          phone: orthodontist.telefone || '',
          cro: orthodontist.cro || '',
          specialty: 'Ortodontia',
          city: orthodontist.cidade || '',
          state: orthodontist.estado || '',
          status: orthodontist.status === 'ativo' ? 'Ativo' : 'Inativo',
          patientsCount: 0, // TODO: implementar contagem real
          rating: 4.5, // TODO: implementar sistema de avaliação
          registrationDate: orthodontist.data_inicio || new Date().toISOString().split('T')[0],
          partnershipModel: orthodontist.modelo_parceria === 'atma-aligner' ? 'Standard' : 'Premium'
        })),
        total,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1,
          itemsPerPage: parseInt(limit)
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Erro ao buscar ortodontistas:', error);
    
    // Retornar resposta de erro estruturada
    res.status(500).json({
      success: false,
      error: {
        message: "Erro interno do servidor ao buscar ortodontistas",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      data: {
        orthodontists: [],
        total: 0,
        pagination: {
          currentPage: parseInt(req.query.page || 1),
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
          itemsPerPage: parseInt(req.query.limit || 10)
        }
      },
      timestamp: new Date().toISOString()
    });
  }
};

// Função auxiliar para criar ortodontista a partir da parceria
const createOrthodontistFromPartnership = async (partnershipData) => {
  // Buscar dados de endereço se tiver CEP no campo cep
  let enderecoDados = {};
  
  if (partnershipData.consultórios && /^\d{5}-?\d{3}$/.test(partnershipData.cep)) {
    try {
      enderecoDados = await cepService.buscarEnderecoPorCep(partnershipData.cep);
    } catch (error) {
      logger.warn('Erro ao buscar endereço por CEP:', error.message);
    }
  }
  
  const orthodontistData = {
    nome: partnershipData.nome,
    clinica: partnershipData.clinica,
    cro: partnershipData.cro,
    email: partnershipData.email,
    telefone: partnershipData.telefone,
    endereco_completo: enderecoDados.endereco_completo || 'A definir',
    cep: enderecoDados.cep || partnershipData.cep || '00000-000',
    cidade: enderecoDados.cidade || 'A definir',
    estado: enderecoDados.estado || 'SP',
    modelo_parceria: partnershipData.interesse === 'ambos' ? 'atma-aligner' : partnershipData.interesse,
    tem_scanner: partnershipData.scanner === 'sim',
    scanner_marca: partnershipData.scanner_marca,
    capacidade_mensal: parseInt(partnershipData.casos_mes?.split('-')[1]) || 5,
    data_inicio: new Date().toISOString().split('T')[0]
  };
  
  const query = `
    INSERT INTO orthodontists (
      nome, clinica, cro, email, telefone, endereco_completo, 
      cep, cidade, estado, modelo_parceria, tem_scanner, 
      scanner_marca, capacidade_mensal, data_inicio, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ativo')
  `;
  
  return executeQuery(query, [
    orthodontistData.nome,
    orthodontistData.clinica,
    orthodontistData.cro,
    orthodontistData.email,
    orthodontistData.telefone,
    orthodontistData.endereco_completo,
    orthodontistData.cep,
    orthodontistData.cidade,
    orthodontistData.estado,
    orthodontistData.modelo_parceria,
    orthodontistData.tem_scanner,
    orthodontistData.scanner_marca,
    orthodontistData.capacidade_mensal,
    orthodontistData.data_inicio
  ]);
};

// Atualizar ortodontista
const updateOrthodontist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Construir query de update dinamicamente
    const fields = Object.keys(updateData).map(field => `${field} = ?`);
    const values = Object.values(updateData);
    
    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Nenhum campo para atualizar' },
        timestamp: new Date().toISOString()
      });
    }
    
    const query = `
      UPDATE orthodontists 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    values.push(id);
    const result = await executeQuery(query, values);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Ortodontista não encontrado' },
        timestamp: new Date().toISOString()
      });
    }
    
    res.json({
      success: true,
      data: { message: 'Ortodontista atualizado com sucesso' },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Erro ao atualizar ortodontista:', error);
    next(error);
  }
};

module.exports = {
  createPartnershipRequest,
  getPartnershipRequests,
  getPartnershipRequestById,
  updatePartnershipStatus,
  deletePartnershipRequest,
  getActiveOrthodontists,
  searchOrthodontists,
  getOrthodontistStats,
  createOrthodontist,
  updateOrthodontist,
  getOrthodontists
};