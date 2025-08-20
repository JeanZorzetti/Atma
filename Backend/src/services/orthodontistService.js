const { executeQuery } = require('../config/database');
const { logger } = require('../utils/logger');
const cepService = require('./cepService');

class OrthodontistService {
  
  // Encontrar ortodontista próximo baseado no CEP ou localização
  async findNearbyOrthodontist(location) {
    try {
      let searchCriteria = {};
      
      // Se location é um CEP
      if (/^\d{5}-?\d{3}$/.test(location)) {
        searchCriteria = await this.findByCep(location);
      } 
      // Se location é cidade, estado
      else if (location.includes(',')) {
        const [cidade, estado] = location.split(',').map(s => s.trim());
        searchCriteria = { cidade, estado };
      }
      // Se é só cidade
      else {
        searchCriteria = { cidade: location };
      }
      
      return await this.searchOrthodontistsByLocation(searchCriteria);
      
    } catch (error) {
      logger.error('Erro ao buscar ortodontista próximo:', error.message);
      return null;
    }
  }
  
  // Buscar ortodontista por CEP
  async findByCep(cep) {
    try {
      const cepLimpo = cep.replace(/\D/g, '');
      
      // Primeiro, tentar busca exata por CEP
      let orthodontists = await executeQuery(
        'SELECT * FROM orthodontists WHERE REPLACE(cep, "-", "") = ? AND status = "ativo" ORDER BY capacidade_mensal DESC LIMIT 1',
        [cepLimpo]
      );
      
      if (orthodontists.length > 0) {
        return orthodontists[0];
      }
      
      // Se não encontrar, buscar por região (primeiros 5 dígitos)
      const cepRegiao = cepLimpo.substring(0, 5);
      orthodontists = await executeQuery(
        'SELECT * FROM orthodontists WHERE REPLACE(cep, "-", "") LIKE ? AND status = "ativo" ORDER BY capacidade_mensal DESC LIMIT 1',
        [`${cepRegiao}%`]
      );
      
      if (orthodontists.length > 0) {
        return orthodontists[0];
      }
      
      // Se ainda não encontrar, buscar por cidade usando API de CEP
      const endereco = await cepService.buscarEnderecoPorCep(cep);
      if (endereco.cidade && endereco.estado) {
        return await this.searchOrthodontistsByLocation({
          cidade: endereco.cidade,
          estado: endereco.estado
        });
      }
      
      return null;
      
    } catch (error) {
      logger.error('Erro ao buscar ortodontista por CEP:', error.message);
      return null;
    }
  }
  
  // Buscar ortodontistas por localização
  async searchOrthodontistsByLocation(criteria) {
    try {
      let query = 'SELECT * FROM orthodontists WHERE status = "ativo"';
      let params = [];
      
      if (criteria.cidade) {
        query += ' AND cidade = ?';
        params.push(criteria.cidade);
      }
      
      if (criteria.estado) {
        query += ' AND estado = ?';
        params.push(criteria.estado);
      }
      
      // Ordenar por capacidade mensal (maior primeiro) e depois por data de início
      query += ' ORDER BY capacidade_mensal DESC, data_inicio ASC LIMIT 1';
      
      const orthodontists = await executeQuery(query, params);
      
      return orthodontists.length > 0 ? orthodontists[0] : null;
      
    } catch (error) {
      logger.error('Erro ao buscar ortodontistas por localização:', error.message);
      return null;
    }
  }
  
  // Algoritmo de distribuição de leads
  async assignLeadToOrthodontist(patientLead) {
    try {
      const orthodontist = await this.findNearbyOrthodontist(patientLead.cep);
      
      if (!orthodontist) {
        logger.warn('Nenhum ortodontista encontrado para a localização:', patientLead.cep);
        return null;
      }
      
      // Verificar capacidade do ortodontista
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      const leadsThisMonth = await executeQuery(
        `SELECT COUNT(*) as total 
         FROM patient_orthodontist_assignments poa
         JOIN patient_leads pl ON poa.patient_lead_id = pl.id
         WHERE poa.orthodontist_id = ? 
         AND DATE_FORMAT(poa.data_atribuicao, '%Y-%m') = ?`,
        [orthodontist.id, currentMonth]
      );
      
      const totalLeadsThisMonth = leadsThisMonth[0].total;
      
      // Se o ortodontista já atingiu sua capacidade mensal, buscar outro
      if (totalLeadsThisMonth >= orthodontist.capacidade_mensal) {
        logger.info(`Ortodontista ${orthodontist.nome} atingiu capacidade mensal (${orthodontist.capacidade_mensal})`);
        
        // Buscar ortodontista alternativo na mesma região
        const alternativeOrthodontist = await this.findAlternativeOrthodontist(
          orthodontist.cidade, 
          orthodontist.estado, 
          orthodontist.id
        );
        
        return alternativeOrthodontist;
      }
      
      return orthodontist;
      
    } catch (error) {
      logger.error('Erro ao atribuir lead para ortodontista:', error.message);
      return null;
    }
  }
  
  // Encontrar ortodontista alternativo
  async findAlternativeOrthodontist(cidade, estado, excludeId) {
    try {
      const query = `
        SELECT o.*, 
               COALESCE(monthly_assignments.total, 0) as leads_this_month
        FROM orthodontists o
        LEFT JOIN (
          SELECT poa.orthodontist_id, COUNT(*) as total
          FROM patient_orthodontist_assignments poa
          WHERE DATE_FORMAT(poa.data_atribuicao, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m')
          GROUP BY poa.orthodontist_id
        ) monthly_assignments ON o.id = monthly_assignments.orthodontist_id
        WHERE o.status = "ativo" 
        AND o.cidade = ? 
        AND o.estado = ? 
        AND o.id != ?
        AND (monthly_assignments.total < o.capacidade_mensal OR monthly_assignments.total IS NULL)
        ORDER BY monthly_assignments.total ASC, o.capacidade_mensal DESC
        LIMIT 1
      `;
      
      const orthodontists = await executeQuery(query, [cidade, estado, excludeId]);
      
      if (orthodontists.length > 0) {
        return orthodontists[0];
      }
      
      // Se não encontrar na mesma cidade, buscar no estado
      const stateQuery = `
        SELECT o.*, 
               COALESCE(monthly_assignments.total, 0) as leads_this_month
        FROM orthodontists o
        LEFT JOIN (
          SELECT poa.orthodontist_id, COUNT(*) as total
          FROM patient_orthodontist_assignments poa
          WHERE DATE_FORMAT(poa.data_atribuicao, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m')
          GROUP BY poa.orthodontist_id
        ) monthly_assignments ON o.id = monthly_assignments.orthodontist_id
        WHERE o.status = "ativo" 
        AND o.estado = ? 
        AND o.id != ?
        AND (monthly_assignments.total < o.capacidade_mensal OR monthly_assignments.total IS NULL)
        ORDER BY monthly_assignments.total ASC, o.capacidade_mensal DESC
        LIMIT 1
      `;
      
      const stateOrthodontists = await executeQuery(stateQuery, [estado, excludeId]);
      
      return stateOrthodontists.length > 0 ? stateOrthodontists[0] : null;
      
    } catch (error) {
      logger.error('Erro ao buscar ortodontista alternativo:', error.message);
      return null;
    }
  }
  
  // Obter estatísticas de distribuição de leads
  async getDistributionStats(period = 30) {
    try {
      const query = `
        SELECT 
          o.id,
          o.nome,
          o.clinica,
          o.cidade,
          o.estado,
          o.capacidade_mensal,
          COUNT(poa.id) as total_leads_atribuidos,
          COUNT(CASE WHEN poa.data_atribuicao >= DATE_SUB(NOW(), INTERVAL ? DAY) THEN 1 END) as leads_periodo,
          COUNT(CASE WHEN poa.status = 'convertido' THEN 1 END) as leads_convertidos,
          ROUND(
            COUNT(CASE WHEN poa.status = 'convertido' THEN 1 END) * 100.0 / 
            NULLIF(COUNT(poa.id), 0), 2
          ) as taxa_conversao
        FROM orthodontists o
        LEFT JOIN patient_orthodontist_assignments poa ON o.id = poa.orthodontist_id
        WHERE o.status = 'ativo'
        GROUP BY o.id
        ORDER BY leads_periodo DESC, taxa_conversao DESC
      `;
      
      const stats = await executeQuery(query, [period]);
      
      return stats;
      
    } catch (error) {
      logger.error('Erro ao obter estatísticas de distribuição:', error.message);
      return [];
    }
  }
  
  // Balanceamento de carga - redistribuir leads se necessário
  async rebalanceLeads() {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7);
      
      // Buscar ortodontistas sobrecarregados
      const overloadedQuery = `
        SELECT 
          o.id, o.nome, o.capacidade_mensal,
          COUNT(poa.id) as leads_atribuidos
        FROM orthodontists o
        JOIN patient_orthodontist_assignments poa ON o.id = poa.orthodontist_id
        WHERE o.status = 'ativo'
        AND DATE_FORMAT(poa.data_atribuicao, '%Y-%m') = ?
        AND poa.status IN ('atribuido', 'contatado')
        GROUP BY o.id
        HAVING leads_atribuidos > o.capacidade_mensal
      `;
      
      const overloaded = await executeQuery(overloadedQuery, [currentMonth]);
      
      if (overloaded.length === 0) {
        logger.info('Nenhum ortodontista sobrecarregado encontrado');
        return { rebalanced: 0, message: 'Sistema em equilíbrio' };
      }
      
      let totalRebalanced = 0;
      
      for (const orthodontist of overloaded) {
        const excess = orthodontist.leads_atribuidos - orthodontist.capacidade_mensal;
        
        // Buscar leads que podem ser redistribuídos (apenas os mais recentes, ainda não contatados)
        const redistributableLeads = await executeQuery(
          `SELECT poa.id, poa.patient_lead_id 
           FROM patient_orthodontist_assignments poa
           WHERE poa.orthodontist_id = ?
           AND poa.status = 'atribuido'
           AND DATE_FORMAT(poa.data_atribuicao, '%Y-%m') = ?
           ORDER BY poa.data_atribuicao DESC
           LIMIT ?`,
          [orthodontist.id, currentMonth, excess]
        );
        
        for (const lead of redistributableLeads) {
          // Buscar novo ortodontista para este lead
          const patientLead = await executeQuery(
            'SELECT * FROM patient_leads WHERE id = ?',
            [lead.patient_lead_id]
          );
          
          if (patientLead.length > 0) {
            const newOrthodontist = await this.findAlternativeOrthodontist(
              null, // deixar buscar por qualquer cidade
              null, // deixar buscar por qualquer estado
              orthodontist.id
            );
            
            if (newOrthodontist) {
              // Transferir o lead
              await executeQuery(
                'UPDATE patient_orthodontist_assignments SET orthodontist_id = ? WHERE id = ?',
                [newOrthodontist.id, lead.id]
              );
              
              await executeQuery(
                'UPDATE patient_leads SET ortodontista_id = ? WHERE id = ?',
                [newOrthodontist.id, lead.patient_lead_id]
              );
              
              totalRebalanced++;
              
              logger.info(`Lead redistribuído de ${orthodontist.nome} para ${newOrthodontist.nome}`);
            }
          }
        }
      }
      
      return {
        rebalanced: totalRebalanced,
        message: `${totalRebalanced} leads redistribuídos com sucesso`
      };
      
    } catch (error) {
      logger.error('Erro ao rebalancear leads:', error.message);
      throw error;
    }
  }
  
  // Verificar ortodontistas próximos ao limite de capacidade
  async checkCapacityWarnings() {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7);
      
      const query = `
        SELECT 
          o.id, o.nome, o.clinica, o.email, o.capacidade_mensal,
          COUNT(poa.id) as leads_atribuidos,
          ROUND((COUNT(poa.id) * 100.0 / o.capacidade_mensal), 1) as utilizacao_percentual
        FROM orthodontists o
        LEFT JOIN patient_orthodontist_assignments poa ON o.id = poa.orthodontist_id
          AND DATE_FORMAT(poa.data_atribuicao, '%Y-%m') = ?
        WHERE o.status = 'ativo'
        AND o.capacidade_mensal > 0
        GROUP BY o.id
        HAVING utilizacao_percentual >= 80
        ORDER BY utilizacao_percentual DESC
      `;
      
      const warnings = await executeQuery(query, [currentMonth]);
      
      return warnings;
      
    } catch (error) {
      logger.error('Erro ao verificar avisos de capacidade:', error.message);
      return [];
    }
  }
}

// Criar instância singleton
const orthodontistService = new OrthodontistService();

module.exports = orthodontistService;