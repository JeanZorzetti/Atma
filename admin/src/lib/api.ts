const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

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

  // Patient methods
  async getPatients(page = 1, limit = 10) {
    return this.request(`/patients?page=${page}&limit=${limit}`)
  }

  async getPatient(id: string) {
    return this.request(`/patients/${id}`)
  }

  async createPatient(data: Record<string, unknown>) {
    return this.request('/patients', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updatePatient(id: string, data: Record<string, unknown>) {
    return this.request(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deletePatient(id: string) {
    return this.request(`/patients/${id}`, {
      method: 'DELETE',
    })
  }

  // Orthodontist methods
  async getOrthodontists(page = 1, limit = 10) {
    return this.request(`/orthodontists?page=${page}&limit=${limit}`)
  }

  async getOrthodontist(id: string) {
    return this.request(`/orthodontists/${id}`)
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

  async deleteOrthodontist(id: string) {
    return this.request(`/orthodontists/${id}`, {
      method: 'DELETE',
    })
  }

  // System/Stats methods
  async getSystemStats() {
    return this.request('/system/stats')
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