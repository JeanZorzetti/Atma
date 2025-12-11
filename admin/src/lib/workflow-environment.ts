/**
 * Gerenciamento de Ambientes para Workflows
 *
 * Permite configurar e alternar entre ambientes (dev, staging, prod)
 * para testes seguros de workflows.
 */

export type EnvironmentType = 'development' | 'staging' | 'production'

export interface Environment {
  id: string
  name: string
  type: EnvironmentType
  n8nApiUrl: string
  n8nApiKey?: string
  description?: string
  isActive: boolean
  color: string
  icon: string
}

export interface EnvironmentConfig {
  currentEnvironment: EnvironmentType
  environments: Environment[]
}

// Configurações padrão dos ambientes
export const DEFAULT_ENVIRONMENTS: Environment[] = [
  {
    id: 'dev',
    name: 'Desenvolvimento',
    type: 'development',
    n8nApiUrl: process.env.NEXT_PUBLIC_N8N_DEV_API_URL || 'http://localhost:5678/api/v1',
    n8nApiKey: process.env.NEXT_PUBLIC_N8N_DEV_API_KEY,
    description: 'Ambiente local para desenvolvimento e testes',
    isActive: false,
    color: 'blue',
    icon: '🔧'
  },
  {
    id: 'staging',
    name: 'Staging',
    type: 'staging',
    n8nApiUrl: process.env.NEXT_PUBLIC_N8N_STAGING_API_URL || 'https://n8n-staging.roilabs.com.br/api/v1',
    n8nApiKey: process.env.NEXT_PUBLIC_N8N_STAGING_API_KEY,
    description: 'Ambiente de homologação para testes antes da produção',
    isActive: false,
    color: 'yellow',
    icon: '🧪'
  },
  {
    id: 'prod',
    name: 'Produção',
    type: 'production',
    n8nApiUrl: process.env.NEXT_PUBLIC_N8N_API_URL || 'https://ia-n8n.tjmarr.easypanel.host/api/v1',
    n8nApiKey: process.env.NEXT_PUBLIC_N8N_API_KEY,
    description: 'Ambiente de produção - CUIDADO!',
    isActive: true,
    color: 'red',
    icon: '🚀'
  }
]

class EnvironmentManager {
  private currentEnv: EnvironmentType = 'production'
  private environments: Environment[] = DEFAULT_ENVIRONMENTS

  constructor() {
    // Carregar ambiente atual do localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('n8n_current_environment')
      if (saved) {
        this.currentEnv = saved as EnvironmentType
      }
    }
  }

  /**
   * Obtém o ambiente atual
   */
  getCurrentEnvironment(): Environment {
    const env = this.environments.find((e) => e.type === this.currentEnv)
    return env || this.environments[2] // Fallback para produção
  }

  /**
   * Obtém todos os ambientes
   */
  getAllEnvironments(): Environment[] {
    return this.environments
  }

  /**
   * Alterna para um ambiente específico
   */
  switchEnvironment(envType: EnvironmentType): void {
    const env = this.environments.find((e) => e.type === envType)
    if (!env) {
      throw new Error(`Ambiente ${envType} não encontrado`)
    }

    this.currentEnv = envType

    // Salvar no localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('n8n_current_environment', envType)
    }

    // Atualizar estado ativo
    this.environments.forEach((e) => {
      e.isActive = e.type === envType
    })
  }

  /**
   * Obtém a URL da API n8n do ambiente atual
   */
  getApiUrl(): string {
    const env = this.getCurrentEnvironment()
    return env.n8nApiUrl
  }

  /**
   * Obtém a API Key do ambiente atual
   */
  getApiKey(): string | undefined {
    const env = this.getCurrentEnvironment()
    return env.n8nApiKey
  }

  /**
   * Verifica se está em ambiente de produção
   */
  isProduction(): boolean {
    return this.currentEnv === 'production'
  }

  /**
   * Verifica se está em ambiente de desenvolvimento
   */
  isDevelopment(): boolean {
    return this.currentEnv === 'development'
  }

  /**
   * Verifica se está em ambiente de staging
   */
  isStaging(): boolean {
    return this.currentEnv === 'staging'
  }

  /**
   * Obtém headers para requisições à API n8n
   */
  getApiHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    const apiKey = this.getApiKey()
    if (apiKey) {
      headers['X-N8N-API-KEY'] = apiKey
    }

    return headers
  }

  /**
   * Atualiza configuração de um ambiente
   */
  updateEnvironment(envType: EnvironmentType, updates: Partial<Environment>): void {
    const index = this.environments.findIndex((e) => e.type === envType)
    if (index === -1) {
      throw new Error(`Ambiente ${envType} não encontrado`)
    }

    this.environments[index] = {
      ...this.environments[index],
      ...updates
    }
  }

  /**
   * Valida se um ambiente está configurado corretamente
   */
  validateEnvironment(envType: EnvironmentType): { valid: boolean; errors: string[] } {
    const env = this.environments.find((e) => e.type === envType)
    const errors: string[] = []

    if (!env) {
      return { valid: false, errors: ['Ambiente não encontrado'] }
    }

    if (!env.n8nApiUrl) {
      errors.push('URL da API n8n não configurada')
    }

    if (!env.n8nApiKey && envType !== 'development') {
      errors.push('API Key não configurada')
    }

    try {
      new URL(env.n8nApiUrl)
    } catch {
      errors.push('URL da API n8n inválida')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Testa conectividade com um ambiente
   */
  async testConnection(envType: EnvironmentType): Promise<{ success: boolean; message: string; latency?: number }> {
    const env = this.environments.find((e) => e.type === envType)
    if (!env) {
      return { success: false, message: 'Ambiente não encontrado' }
    }

    const validation = this.validateEnvironment(envType)
    if (!validation.valid) {
      return { success: false, message: validation.errors.join(', ') }
    }

    try {
      const startTime = Date.now()

      const response = await fetch(`${env.n8nApiUrl}/workflows`, {
        method: 'GET',
        headers: this.getApiHeaders()
      })

      const latency = Date.now() - startTime

      if (!response.ok) {
        return {
          success: false,
          message: `Erro HTTP: ${response.status} ${response.statusText}`,
          latency
        }
      }

      return {
        success: true,
        message: 'Conexão estabelecida com sucesso',
        latency
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      }
    }
  }

  /**
   * Obtém configuração completa
   */
  getConfig(): EnvironmentConfig {
    return {
      currentEnvironment: this.currentEnv,
      environments: this.environments
    }
  }

  /**
   * Reseta para configuração padrão
   */
  reset(): void {
    this.environments = [...DEFAULT_ENVIRONMENTS]
    this.currentEnv = 'production'

    if (typeof window !== 'undefined') {
      localStorage.removeItem('n8n_current_environment')
    }
  }
}

// Instância singleton
let environmentManager: EnvironmentManager | null = null

export function getEnvironmentManager(): EnvironmentManager {
  if (!environmentManager) {
    environmentManager = new EnvironmentManager()
  }
  return environmentManager
}

// Hook para usar no React
export function useEnvironment() {
  const manager = getEnvironmentManager()

  return {
    currentEnvironment: manager.getCurrentEnvironment(),
    allEnvironments: manager.getAllEnvironments(),
    switchEnvironment: (env: EnvironmentType) => manager.switchEnvironment(env),
    isProduction: manager.isProduction(),
    isDevelopment: manager.isDevelopment(),
    isStaging: manager.isStaging(),
    testConnection: (env: EnvironmentType) => manager.testConnection(env),
    validateEnvironment: (env: EnvironmentType) => manager.validateEnvironment(env)
  }
}
