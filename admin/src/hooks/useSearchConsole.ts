import { useState, useEffect, useCallback } from 'react'
import { apiService } from '@/lib/api'

// =============================================================================
// Types
// =============================================================================

export interface SearchConsoleMetrics {
  date: string
  impressions: number
  clicks: number
  ctr: number
  position: number
  top_keywords?: Array<{
    query: string
    impressions: number
    clicks: number
    ctr: number
    position: number
  }>
  top_pages?: Array<{
    page: string
    impressions: number
    clicks: number
    ctr: number
    position: number
  }>
}

export interface MetricsSummary {
  totalImpressions: number
  totalClicks: number
  avgCtr: string
  avgPosition: string
  days: number
}

export interface SearchConsoleAlert {
  id: number
  type: string
  severity: 'critical' | 'warning' | 'info'
  message: string
  metric_name: string
  metric_value: number
  previous_value: number
  change_percentage: number
  url?: string
  keyword?: string
  date: string
  resolved: boolean
  resolved_at?: string
  created_at: string
}

export interface AuthStatus {
  authenticated: boolean
  expiresAt?: string
  message: string
}

// =============================================================================
// useSearchConsoleAuth - Authentication status and actions
// =============================================================================

export function useSearchConsoleAuth() {
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.searchConsole.getAuthStatus() as AuthStatus
      setAuthStatus(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check auth status')
    } finally {
      setLoading(false)
    }
  }, [])

  const getAuthUrl = useCallback(async () => {
    try {
      const response = await apiService.searchConsole.getAuthUrl() as { authUrl: string }
      return response.authUrl
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to get auth URL')
    }
  }, [])

  const revokeAuth = useCallback(async () => {
    try {
      setLoading(true)
      await apiService.searchConsole.revokeAuth()
      await checkAuthStatus()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revoke auth')
      throw err
    } finally {
      setLoading(false)
    }
  }, [checkAuthStatus])

  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  return {
    authStatus,
    loading,
    error,
    checkAuthStatus,
    getAuthUrl,
    revokeAuth
  }
}

// =============================================================================
// useSearchConsoleMetrics - Metrics data and summary
// =============================================================================

export function useSearchConsoleMetrics(days: number = 30) {
  const [metrics, setMetrics] = useState<SearchConsoleMetrics[]>([])
  const [summary, setSummary] = useState<MetricsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.searchConsole.getMetrics(days) as {
        success: boolean
        data?: SearchConsoleMetrics[]
        summary?: MetricsSummary
        error?: string
      }

      if (response.success) {
        setMetrics(response.data || [])
        setSummary(response.summary || null)
      } else {
        throw new Error(response.error || 'Failed to fetch metrics')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics')
    } finally {
      setLoading(false)
    }
  }, [days])

  const syncMetrics = useCallback(async (options?: {
    date?: string
    startDate?: string
    endDate?: string
  }) => {
    try {
      setLoading(true)
      const response = await apiService.searchConsole.syncMetrics(options) as {
        success: boolean
        error?: string
      }

      if (response.success) {
        // Refresh metrics after sync
        await fetchMetrics()
        return response
      } else {
        throw new Error(response.error || 'Failed to sync metrics')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync metrics')
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchMetrics])

  useEffect(() => {
    fetchMetrics()
  }, [fetchMetrics])

  return {
    metrics,
    summary,
    loading,
    error,
    refetch: fetchMetrics,
    syncMetrics
  }
}

// =============================================================================
// useSearchConsoleKeywords - Top keywords
// =============================================================================

export function useSearchConsoleKeywords(date?: string, limit: number = 20) {
  const [keywords, setKeywords] = useState<SearchConsoleMetrics['top_keywords']>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchKeywords = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.searchConsole.getTopKeywords(date, limit) as {
        success: boolean
        keywords?: SearchConsoleMetrics['top_keywords']
        error?: string
      }

      if (response.success) {
        setKeywords(response.keywords || [])
      } else {
        throw new Error(response.error || 'Failed to fetch keywords')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch keywords')
    } finally {
      setLoading(false)
    }
  }, [date, limit])

  useEffect(() => {
    fetchKeywords()
  }, [fetchKeywords])

  return {
    keywords,
    loading,
    error,
    refetch: fetchKeywords
  }
}

// =============================================================================
// useSearchConsolePages - Top pages
// =============================================================================

export function useSearchConsolePages(date?: string, limit: number = 20) {
  const [pages, setPages] = useState<SearchConsoleMetrics['top_pages']>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPages = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.searchConsole.getTopPages(date, limit) as {
        success: boolean
        pages?: SearchConsoleMetrics['top_pages']
        error?: string
      }

      if (response.success) {
        setPages(response.pages || [])
      } else {
        throw new Error(response.error || 'Failed to fetch pages')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch pages')
    } finally {
      setLoading(false)
    }
  }, [date, limit])

  useEffect(() => {
    fetchPages()
  }, [fetchPages])

  return {
    pages,
    loading,
    error,
    refetch: fetchPages
  }
}

// =============================================================================
// useSearchConsoleAlerts - Alerts management
// =============================================================================

export function useSearchConsoleAlerts(unresolvedOnly: boolean = false) {
  const [alerts, setAlerts] = useState<SearchConsoleAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = unresolvedOnly
        ? await apiService.searchConsole.getUnresolvedAlerts() as { success: boolean; alerts?: SearchConsoleAlert[]; error?: string }
        : await apiService.searchConsole.getAlerts() as { success: boolean; alerts?: SearchConsoleAlert[]; error?: string }

      if (response.success) {
        setAlerts(response.alerts || [])
      } else {
        throw new Error(response.error || 'Failed to fetch alerts')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch alerts')
    } finally {
      setLoading(false)
    }
  }, [unresolvedOnly])

  const resolveAlert = useCallback(async (alertId: number) => {
    try {
      await apiService.searchConsole.resolveAlert(alertId)
      // Refresh alerts after resolving
      await fetchAlerts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resolve alert')
      throw err
    }
  }, [fetchAlerts])

  useEffect(() => {
    fetchAlerts()
  }, [fetchAlerts])

  return {
    alerts,
    loading,
    error,
    refetch: fetchAlerts,
    resolveAlert
  }
}
