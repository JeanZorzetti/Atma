const { logger } = require('../utils/logger');

class CepService {
  constructor() {
    this.apiUrl = process.env.CEP_API_URL || 'https://viacep.com.br/ws';
    this.cache = new Map();
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 horas
  }

  async buscarEnderecoPorCep(cep) {
    try {
      const cepLimpo = cep.replace(/\D/g, '');
      
      if (cepLimpo.length !== 8) {
        throw new Error('CEP deve ter 8 dígitos');
      }

      // Verificar cache
      const cacheKey = cepLimpo;
      const cached = this.cache.get(cacheKey);
      
      if (cached && (Date.now() - cached.timestamp) < this.cacheExpiry) {
        logger.debug('CEP encontrado no cache:', cepLimpo);
        return cached.data;
      }

      // Buscar na API
      const response = await fetch(`${this.apiUrl}/${cepLimpo}/json/`);
      
      if (!response.ok) {
        throw new Error(`Erro na API de CEP: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.erro) {
        throw new Error('CEP não encontrado');
      }

      // Padronizar dados
      const endereco = {
        cep: this.formatarCep(cepLimpo),
        logradouro: data.logradouro || '',
        complemento: data.complemento || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || '',
        ibge: data.ibge || '',
        endereco_completo: this.montarEnderecoCompleto(data)
      };

      // Salvar no cache
      this.cache.set(cacheKey, {
        data: endereco,
        timestamp: Date.now()
      });

      logger.debug('CEP consultado na API:', cepLimpo);
      
      return endereco;

    } catch (error) {
      logger.warn('Erro ao buscar CEP:', { cep, error: error.message });
      
      // Retornar dados padrão em caso de erro
      return {
        cep: this.formatarCep(cep.replace(/\D/g, '')),
        logradouro: '',
        complemento: '',
        bairro: '',
        cidade: 'A definir',
        estado: 'SP',
        ibge: '',
        endereco_completo: 'Endereço a ser definido'
      };
    }
  }

  async buscarCepsPorCidade(cidade, estado) {
    try {
      // Esta é uma implementação simplificada
      // Para uso em produção, considere usar uma API mais robusta
      const response = await fetch(`${this.apiUrl}/${estado}/${cidade}/`);
      
      if (!response.ok) {
        throw new Error(`Erro na busca por cidade: ${response.status}`);
      }

      const data = await response.json();
      
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Nenhum CEP encontrado para esta cidade');
      }

      return data.map(item => ({
        cep: this.formatarCep(item.cep),
        logradouro: item.logradouro || '',
        bairro: item.bairro || '',
        cidade: item.localidade || cidade,
        estado: item.uf || estado
      }));

    } catch (error) {
      logger.warn('Erro ao buscar CEPs por cidade:', { cidade, estado, error: error.message });
      return [];
    }
  }

  calcularDistanciaAproximada(cep1, cep2) {
    try {
      const num1 = parseInt(cep1.replace(/\D/g, ''));
      const num2 = parseInt(cep2.replace(/\D/g, ''));
      
      // Cálculo muito simplificado baseado na diferença dos CEPs
      // Em produção, use uma API de geolocalização real
      const diferenca = Math.abs(num1 - num2);
      
      // Estimativa grosseira: cada 1000 na diferença = ~10km
      const distanciaEstimada = Math.round(diferenca / 1000 * 10);
      
      return Math.min(distanciaEstimada, 1000); // máximo 1000km
      
    } catch (error) {
      logger.warn('Erro ao calcular distância:', { cep1, cep2, error: error.message });
      return 999; // distância muito alta em caso de erro
    }
  }

  formatarCep(cep) {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      return `${cepLimpo.substring(0, 5)}-${cepLimpo.substring(5)}`;
    }
    return cepLimpo;
  }

  montarEnderecoCompleto(data) {
    const partes = [];
    
    if (data.logradouro) partes.push(data.logradouro);
    if (data.bairro) partes.push(data.bairro);
    if (data.localidade) partes.push(data.localidade);
    if (data.uf) partes.push(data.uf);
    
    return partes.join(', ') || 'Endereço não disponível';
  }

  validarCep(cep) {
    const cepLimpo = cep.replace(/\D/g, '');
    return /^\d{8}$/.test(cepLimpo);
  }

  // Método para limpar cache
  limparCache() {
    this.cache.clear();
    logger.info('Cache de CEPs limpo');
  }

  // Método para obter estatísticas do cache
  estatisticasCache() {
    const agora = Date.now();
    let validos = 0;
    let expirados = 0;

    for (const [key, value] of this.cache.entries()) {
      if ((agora - value.timestamp) < this.cacheExpiry) {
        validos++;
      } else {
        expirados++;
      }
    }

    return {
      total: this.cache.size,
      validos,
      expirados,
      taxa_acerto: this.cache.size > 0 ? (validos / this.cache.size * 100).toFixed(1) : 0
    };
  }

  // Método para limpar entradas expiradas do cache
  limparCacheExpirado() {
    const agora = Date.now();
    let removidos = 0;

    for (const [key, value] of this.cache.entries()) {
      if ((agora - value.timestamp) >= this.cacheExpiry) {
        this.cache.delete(key);
        removidos++;
      }
    }

    if (removidos > 0) {
      logger.info(`${removidos} entradas expiradas removidas do cache de CEPs`);
    }

    return removidos;
  }

  // Buscar múltiplos CEPs de uma vez
  async buscarMultiplosCeps(ceps) {
    const resultados = {};
    const promises = [];

    for (const cep of ceps) {
      promises.push(
        this.buscarEnderecoPorCep(cep)
          .then(endereco => {
            resultados[cep] = { sucesso: true, endereco };
          })
          .catch(error => {
            resultados[cep] = { sucesso: false, erro: error.message };
          })
      );
    }

    await Promise.all(promises);
    return resultados;
  }

  // Validar e sugerir correção de CEP
  async validarESugerirCep(cep) {
    try {
      if (!this.validarCep(cep)) {
        return {
          valido: false,
          erro: 'Formato de CEP inválido',
          sugestao: null
        };
      }

      const endereco = await this.buscarEnderecoPorCep(cep);
      
      return {
        valido: true,
        endereco,
        sugestao: null
      };

    } catch (error) {
      // Tentar sugerir CEP próximo
      const cepLimpo = cep.replace(/\D/g, '');
      const sugestoes = [];

      // Gerar algumas variações próximas
      for (let i = -10; i <= 10; i += 5) {
        if (i === 0) continue;
        
        const novoCep = (parseInt(cepLimpo) + i).toString().padStart(8, '0');
        sugestoes.push(this.formatarCep(novoCep));
      }

      return {
        valido: false,
        erro: error.message,
        sugestoes: sugestoes.slice(0, 3) // máximo 3 sugestões
      };
    }
  }
}

// Criar instância singleton
const cepService = new CepService();

// Limpeza periódica do cache (a cada hora)
setInterval(() => {
  cepService.limparCacheExpirado();
}, 60 * 60 * 1000);

module.exports = cepService;