import { useState, useEffect, useCallback, useRef } from 'react'
import { apiService, PatientsResponse, OrthodontistsResponse, SystemStatsResponse, QuickActionsResponse, ReportsResponse } from '@/lib/api'

export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: unknown[] = []
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableApiCall = useCallback(apiCall, dependencies)

  useEffect(() => {
    mountedRef.current = true
    let retryTimeout: NodeJS.Timeout

    const fetchData = async () => {
      try {
        if (!mountedRef.current) return
        
        setLoading(true)
        setError(null)
        const result = await stableApiCall()
        
        if (mountedRef.current) {
          setData(result)
        }
      } catch (err) {
        if (mountedRef.current) {
          const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
          setError(errorMessage)
          
          // If rate limited, schedule a retry
          if (errorMessage.includes('Rate limited')) {
            const match = errorMessage.match(/(\d+) seconds/)
            const retryDelay = match ? parseInt(match[1]) * 1000 + 1000 : 60000 // Add 1s buffer
            
            retryTimeout = setTimeout(() => {
              if (mountedRef.current) {
                fetchData()
              }
            }, retryDelay)
          }
          
          console.error('API Error:', err)
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      mountedRef.current = false
      if (retryTimeout) {
        clearTimeout(retryTimeout)
      }
    }
  }, [stableApiCall])

  const refetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await stableApiCall()
      if (mountedRef.current) {
        setData(result)
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false)
      }
    }
  }, [stableApiCall])

  return { data, loading, error, refetch }
}

// Hooks específicos with stable API calls
export function usePatients() {
  const getPatients = useCallback(() => apiService.getPatients(), [])
  return useApi<PatientsResponse>(getPatients, [])
}

export function useOrthodontists() {
  const getOrthodontists = useCallback(() => apiService.getOrthodontists(), [])
  return useApi<OrthodontistsResponse>(getOrthodontists, [])
}

export function useSystemStats() {
  const getSystemStats = useCallback(() => apiService.getSystemStats(), [])
  return useApi<SystemStatsResponse>(getSystemStats, [])
}

export function useSystemHealth() {
  const getSystemHealth = useCallback(() => apiService.getSystemHealth(), [])
  return useApi(getSystemHealth, [])
}

export function useQuickActions() {
  const getQuickActions = useCallback(() => apiService.getQuickActions(), [])
  return useApi<QuickActionsResponse>(getQuickActions, [])
}

export function useReports() {
  const getReports = useCallback(() => apiService.getReports(), [])
  return useApi<ReportsResponse>(getReports, [])
}