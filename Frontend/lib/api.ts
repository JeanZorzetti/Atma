const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://atmaapi.roilabs.com.br/api'

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  timestamp: string
}

class ApiService {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
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

  // Patient lead methods
  async createPatientLead(data: {
    nome: string
    email: string
    telefone: string
    cep: string
    consentimento: boolean
  }) {
    return this.request('/patients/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getPatientLeads(page = 1, limit = 10) {
    return this.request(`/patients/leads?page=${page}&limit=${limit}`)
  }

  // Orthodontist methods
  async createOrthodontistPartnership(data: {
    name: string
    email: string
    phone: string
    cro: string
    clinicName: string
    address: {
      street: string
      city: string
      state: string
      zipCode: string
    }
    experience: string
    specialties: string[]
    message?: string
  }) {
    return this.request('/orthodontists/partnership', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getOrthodontists(filters?: {
    city?: string
    state?: string
    specialties?: string[]
  }) {
    const params = new URLSearchParams()
    if (filters?.city) params.append('city', filters.city)
    if (filters?.state) params.append('state', filters.state)
    if (filters?.specialties) {
      filters.specialties.forEach(specialty => 
        params.append('specialties', specialty)
      )
    }

    const queryString = params.toString()
    return this.request(`/orthodontists${queryString ? `?${queryString}` : ''}`)
  }

  async getOrthodontistById(id: string) {
    return this.request(`/orthodontists/${id}`)
  }

  // Email methods
  async sendContactEmail(data: {
    name: string
    email: string
    subject: string
    message: string
    type: 'contact' | 'support' | 'partnership'
  }) {
    return this.request('/emails/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // CEP lookup
  async lookupCEP(cep: string) {
    return this.request(`/system/cep/${cep.replace(/\D/g, '')}`)
  }

  // System health check
  async getSystemHealth() {
    const healthUrl = this.baseUrl.replace('/api', '/health')
    return fetch(healthUrl).then(res => res.json())
  }
}

export const apiService = new ApiService()
export default apiService

// Types para os hooks
import { useState, useEffect } from 'react'

// Hook personalizado para usar com React
export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiCall()
        
        if (mounted) {
          setData(response.data)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Erro desconhecido')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      mounted = false
    }
  }, dependencies)

  return { data, loading, error }
}