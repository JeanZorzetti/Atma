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

class ApiService {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
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
  async getOrthodontists(page = 1, limit = 10) {
    return this.request(`/orthodontists/partnerships?page=${page}&limit=${limit}`)
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

  async getSystemHealth() {
    const healthUrl = this.baseUrl.replace('/api', '/health')
    return fetch(healthUrl).then(res => res.json())
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