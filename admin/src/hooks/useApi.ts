import { useState, useEffect, useCallback, useRef } from 'react'
import { apiService, PatientsResponse, OrthodontistsResponse, SystemStatsResponse, QuickActionsResponse, ReportsResponse, SettingsResponse, CrmLeadsResponse, CrmStatsResponse, MarketingMetricsResponse } from '@/lib/api'

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

export function useSettings() {
  const getSettings = useCallback(() => apiService.getSettings(), [])
  return useApi<SettingsResponse>(getSettings, [])
}

export function useCrmLeads(page = 1, limit = 50, status?: string, responsavel?: string, origem?: string, search?: string) {
  const getCrmLeads = useCallback(() => apiService.getCrmLeads(page, limit, status, responsavel, origem, search), [page, limit, status, responsavel, origem, search])
  return useApi<CrmLeadsResponse>(getCrmLeads, [page, limit, status, responsavel, origem, search])
}

export function useCrmStats() {
  const getCrmStats = useCallback(() => apiService.getCrmStats(), [])
  return useApi<CrmStatsResponse>(getCrmStats, [])
}

export function useMarketingMetrics(dateRange = '30d') {
  const getMarketingMetrics = useCallback(() => apiService.getMarketingMetrics(dateRange), [dateRange])
  return useApi<MarketingMetricsResponse>(getMarketingMetrics, [dateRange])
}

export function useGoogleAnalytics(metrics: string[], dateRange: string) {
  const getGoogleAnalytics = useCallback(() => apiService.getGoogleAnalyticsData(metrics, dateRange), [metrics, dateRange])
  return useApi(getGoogleAnalytics, [metrics, dateRange])
}

export function useFacebookAds(dateRange: string) {
  const getFacebookAds = useCallback(() => apiService.getFacebookAdsData(dateRange), [dateRange])
  return useApi(getFacebookAds, [dateRange])
}

export function useInstagramInsights(dateRange: string) {
  const getInstagramInsights = useCallback(() => apiService.getInstagramInsights(dateRange), [dateRange])
  return useApi(getInstagramInsights, [dateRange])
}

export function useEmailMarketing(dateRange: string) {
  const getEmailMarketing = useCallback(() => apiService.getEmailMarketingStats(dateRange), [dateRange])
  return useApi(getEmailMarketing, [dateRange])
}

export function useWhatsAppMetrics(dateRange: string) {
  const getWhatsAppMetrics = useCallback(() => apiService.getWhatsAppMetrics(dateRange), [dateRange])
  return useApi(getWhatsAppMetrics, [dateRange])
}

export function useCampaignPerformance(campaignId?: string) {
  const getCampaignPerformance = useCallback(() => apiService.getCampaignPerformance(campaignId), [campaignId])
  return useApi(getCampaignPerformance, [campaignId])
}

export function useLeadSourceAnalysis(dateRange: string) {
  const getLeadSourceAnalysis = useCallback(() => apiService.getLeadSourceAnalysis(dateRange), [dateRange])
  return useApi(getLeadSourceAnalysis, [dateRange])
}