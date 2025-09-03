const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// Tipos de resposta da API
export interface PatientsResponse {
  patients: Array<{
    id: number
    name: string
    email: string
    cpf?: string
    status: string
    treatmentStage?: string
    orthodontist?: string
  }>
  total: number
}

export interface Orthodontist {
  id: number;
  name: string;
  email: string;
  phone: string;
  cro: string;
  specialty: string;
  city: string;
  state: string;
  status: string;
  patientsCount: number;
  rating: number;
  registrationDate: string;
  partnershipModel: string;
}

export interface OrthodontistsResponse {
  orthodontists: Orthodontist[];
  total: number;
}

export interface SystemStatsResponse {
  totalPatients: number
  patientsGrowth: string
  totalOrthodontists: number
  orthodontistsGrowth: string
  todayAppointments: number
  appointmentsConfirmed: string
  monthlyRevenue: number
  revenueGrowth: string
  recentActivities: Array<{
    id: number
    type: string
    message: string
    time: string
    status: string
  }>
}

export interface QuickAction {
  id: number
  type: string
  priority: string
  title: string
  description: string
  count: number
  color: 'red' | 'yellow' | 'blue' | 'green'
  badge: string
  badgeVariant: 'destructive' | 'secondary' | 'outline'
}

export interface QuickActionsResponse {
  success: boolean
  data: QuickAction[]
  warning?: string
  timestamp: string
}

export interface ReportsResponse {
  success: boolean
  data: {
    totalRevenue: number
    revenueGrowth: string
    newPatients: number
    patientsGrowth: string
    conversionRate: number
    conversionGrowth: string
    averageRating: number
    ratingLabel: string
    monthlyData: Array<{
      month: string
      patients: number
      revenue: number
      consultations: number
    }>
    topOrthodontists: Array<{
      name: string
      patients: number
      revenue: number
      rating: number
    }>
    monthlyConsultations: number
    noShowRate: number
    averageTreatmentTime: number
    revenueDistribution: {
      tratamentosAtivos: number
      consultas: number
      outros: number
      percentages: {
        tratamentosAtivos: string
        consultas: string
        outros: string
      }
    }
    quarterGoals: {
      newPatients: {
        current: number
        target: number
        percentage: number
      }
      revenue: {
        current: number
        target: number
        percentage: number
      }
    }
  }
  warning?: string
  timestamp: string
}

export interface SettingsResponse {
  success: boolean
  data: {
    settings: {
      [key: string]: {
        value: string
        description: string
        updated_at: string
      }
    }
  }
  timestamp: string
}

export interface CrmLead {
  id: number
  nome: string
  clinica: string
  cro: string
  email: string
  telefone: string
  cidade?: string
  estado?: string
  consultórios?: string
  scanner?: 'sim' | 'nao'
  scanner_marca?: string
  casos_mes?: string
  interesse?: 'atma-aligner' | 'atma-labs' | 'ambos'
  status: 'prospeccao' | 'contato_inicial' | 'apresentacao' | 'negociacao'
  responsavel_comercial?: string
  origem_lead?: 'inbound' | 'outbound' | 'indicacao' | 'evento' | 'outro'
  observacoes_internas?: string
  próximo_followup?: string
  created_at: string
  updated_at: string
}

export interface CrmLeadsResponse {
  success: boolean
  leads: CrmLead[]
  total: number
  pagination: {
    currentPage: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
    itemsPerPage: number
  }
  timestamp: string
}

export interface CrmStatsResponse {
  success: boolean
  data: {
    pipeline: {
      prospeccao: number
      contato_inicial: number
      apresentacao: number
      negociacao: number
      fechado: number
    }
    conversion_rates: {
      prospeccao_to_contato: string
      contato_to_apresentacao: string
      apresentacao_to_negociacao: string
      negociacao_to_fechado: string
      overall: string
    }
    by_responsavel: { [key: string]: number }
    by_origem: { [key: string]: number }
    tempo_medio_dias: {
      prospeccao: number
      contato: number
      apresentacao: number
    }
    total_leads_crm: number
    total_fechados: number
    total_geral: number
  }
  timestamp: string
}

class ApiService {
  private baseUrl: string
  private requestCache: Map<string, { data: unknown; timestamp: number }> = new Map()
  private pendingRequests: Map<string, Promise<unknown>> = new Map()
  private rateLimitCache: Map<string, number> = new Map()
  private readonly CACHE_TTL = 30000 // 30 seconds
  private readonly RATE_LIMIT_DELAY = 60000 // 1 minute delay after 429

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const cacheKey = `${endpoint}:${JSON.stringify(options)}`
    const now = Date.now()

    // Check rate limiting
    const rateLimitEnd = this.rateLimitCache.get(endpoint)
    if (rateLimitEnd && now < rateLimitEnd) {
      const waitTime = Math.ceil((rateLimitEnd - now) / 1000)
      throw new Error(`Rate limited. Try again in ${waitTime} seconds.`)
    }

    // Check cache for GET requests
    if (!options.method || options.method === 'GET') {
      const cached = this.requestCache.get(cacheKey)
      if (cached && (now - cached.timestamp) < this.CACHE_TTL) {
        return cached.data as T
      }

      // Check for pending request to avoid duplicate calls
      const pending = this.pendingRequests.get(cacheKey)
      if (pending) {
        return pending as Promise<T>
      }
    }

    const url = `${this.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    const requestPromise = this.executeRequest<T>(url, config, endpoint, cacheKey)
    
    // Store pending request for GET requests
    if (!options.method || options.method === 'GET') {
      this.pendingRequests.set(cacheKey, requestPromise)
    }

    try {
      const result = await requestPromise
      return result
    } finally {
      this.pendingRequests.delete(cacheKey)
    }
  }

  private async executeRequest<T>(
    url: string,
    config: RequestInit,
    endpoint: string,
    cacheKey: string
  ): Promise<T> {
    try {
      const response = await fetch(url, config)
      
      if (response.status === 429) {
        // Rate limited - set rate limit cache
        const retryAfter = response.headers.get('Retry-After')
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : this.RATE_LIMIT_DELAY
        this.rateLimitCache.set(endpoint, Date.now() + delay)
        throw new Error(`Rate limited. Server is busy. Please try again later.`)
      }
      
      if (!response.ok) {
        // Tentar extrair mensagem de erro do backend
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          // Se não conseguir fazer parse do JSON, usar mensagem genérica
        }
        
        const error = new Error(`HTTP error! status: ${response.status}`) as any;
        error.errorData = errorData; // Anexar dados do erro para o componente usar
        throw error;
      }

      const data = await response.json()
      
      // Cache successful GET requests
      if ((!config.method || config.method === 'GET') && response.ok) {
        this.requestCache.set(cacheKey, {
          data,
          timestamp: Date.now()
        })
      }

      return data
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  // Patient methods (corrigido para usar /patients/leads)
  async getPatients(page = 1, limit = 10): Promise<PatientsResponse> {
    return this.request<PatientsResponse>(`/patients/leads?page=${page}&limit=${limit}`)
  }

  async getPatient(id: string) {
    return this.request(`/patients/leads/${id}`)
  }

  async createPatient(data: Record<string, unknown>) {
    return this.request('/patients/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  }

  async updatePatient(id: string, data: Record<string, unknown>) {
    return this.request(`/patients/leads/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  }

  async deletePatient(id: string) {
    return this.request(`/patients/leads/${id}`, {
      method: 'DELETE',
    })
  }

  // Orthodontist methods (corrigido para usar endpoints corretos do backend)
  async getOrthodontists(page = 1, limit = 10): Promise<OrthodontistsResponse> {
    return this.request<OrthodontistsResponse>(`/orthodontists/partnerships?page=${page}&limit=${limit}`)
  }

  async getActiveOrthodontists() {
    return this.request('/orthodontists/active')
  }

  async getOrthodontistStats() {
    return this.request('/orthodontists/stats')
  }

  async searchOrthodontists(params: Record<string, string>) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/orthodontists/search?${queryString}`)
  }

  async getOrthodontist(id: string) {
    return this.request(`/orthodontists/partnerships/${id}`)
  }

  async createPartnershipRequest(data: Record<string, unknown>) {
    return this.request('/orthodontists/partnerships', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async createOrthodontist(data: Record<string, unknown>) {
    return this.request('/orthodontists', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateOrthodontist(id: string, data: Record<string, unknown>) {
    return this.request(`/orthodontists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async updatePartnershipStatus(id: string, status: string) {
    return this.request(`/orthodontists/partnerships/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  }

  async deletePartnershipRequest(id: string) {
    return this.request(`/orthodontists/partnerships/${id}`, {
      method: 'DELETE',
    })
  }

  // System/Stats methods
  async getSystemStats(): Promise<SystemStatsResponse> {
    return this.request<SystemStatsResponse>('/system/stats')
  }

  async getQuickActions(): Promise<QuickActionsResponse> {
    return this.request<QuickActionsResponse>('/system/quick-actions')
  }

  async getSystemHealth() {
    const healthUrl = this.baseUrl.replace('/api', '/health')
    const cacheKey = 'health'
    const now = Date.now()

    // Check rate limiting
    const rateLimitEnd = this.rateLimitCache.get('health')
    if (rateLimitEnd && now < rateLimitEnd) {
      const waitTime = Math.ceil((rateLimitEnd - now) / 1000)
      throw new Error(`Rate limited. Try again in ${waitTime} seconds.`)
    }

    // Check cache
    const cached = this.requestCache.get(cacheKey)
    if (cached && (now - cached.timestamp) < this.CACHE_TTL) {
      return cached.data
    }

    try {
      const response = await fetch(healthUrl)
      
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After')
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : this.RATE_LIMIT_DELAY
        this.rateLimitCache.set('health', Date.now() + delay)
        throw new Error(`Rate limited. Server is busy. Please try again later.`)
      }
      
      const data = await response.json()
      
      // Cache successful response
      this.requestCache.set(cacheKey, {
        data,
        timestamp: Date.now()
      })
      
      return data
    } catch (error) {
      console.error('Health check failed:', error)
      throw error
    }
  }

  // Email methods
  async sendEmail(data: Record<string, unknown>) {
    return this.request('/emails/send', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getEmailTemplates() {
    return this.request('/emails/templates')
  }

  // Reports methods
  async getReports(): Promise<ReportsResponse> {
    return this.request<ReportsResponse>('/system/reports')
  }

  // Settings methods
  async getSettings(): Promise<SettingsResponse> {
    return this.request<SettingsResponse>('/system/settings')
  }

  async updateSetting(settingKey: string, settingValue: string, description?: string) {
    return this.request('/system/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        setting_key: settingKey, 
        setting_value: settingValue,
        description 
      }),
    })
  }

  // CRM methods
  async getCrmLeads(page = 1, limit = 50, status?: string, responsavel?: string, origem?: string, search?: string): Promise<CrmLeadsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    if (status) params.append('status', status)
    if (responsavel) params.append('responsavel', responsavel)
    if (origem) params.append('origem', origem)
    if (search) params.append('search', search)
    
    return this.request<CrmLeadsResponse>(`/crm/leads?${params.toString()}`)
  }

  async getCrmStats(): Promise<CrmStatsResponse> {
    return this.request<CrmStatsResponse>('/crm/stats')
  }

  async createCrmLead(leadData: Partial<CrmLead>) {
    return this.request('/crm/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData)
    })
  }

  async getCrmLead(id: number) {
    return this.request(`/crm/leads/${id}`)
  }

  async updateLeadStatus(id: number, status: string, observacoes?: string) {
    return this.request(`/crm/leads/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, observacoes }),
    })
  }
}

export const apiService = new ApiService()
export default apiService