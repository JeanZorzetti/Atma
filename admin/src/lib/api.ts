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
        throw new Error(`HTTP error! status: ${response.status}`)
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
      body: JSON.stringify(data),
    })
  }

  async updatePatient(id: string, data: Record<string, unknown>) {
    return this.request(`/patients/leads/${id}/status`, {
      method: 'PUT',
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
}

export const apiService = new ApiService()
export default apiService