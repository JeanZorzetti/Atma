import { useState, useEffect } from 'react'
import { apiService } from '@/lib/api'

export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: unknown[] = []
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
        const result = await apiCall()
        
        if (mounted) {
          setData(result)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Erro desconhecido')
          console.error('API Error:', err)
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

  const refetch = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiCall()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, refetch }
}

// Tipos de resposta da API
interface PatientsResponse {
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

interface SystemStatsResponse {
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

// Hooks específicos
export function usePatients() {
  return useApi<PatientsResponse>(() => apiService.getPatients(), [])
}

export function useOrthodontists() {
  return useApi(() => apiService.getOrthodontists(), [])
}

export function useSystemStats() {
  return useApi<SystemStatsResponse>(() => apiService.getSystemStats(), [])
}

export function useSystemHealth() {
  return useApi(() => apiService.getSystemHealth(), [])
}