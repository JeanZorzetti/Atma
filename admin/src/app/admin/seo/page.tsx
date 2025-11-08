"use client"

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { DateRange } from 'react-day-picker'
import { subDays } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import {
  TrendingUp,
  Eye,
  MousePointerClick,
  Target,
  Search,
  FileText,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Loader2,
  ExternalLink,
  Lock,
  Unlock
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  useSearchConsoleAuth,
  useSearchConsoleMetrics,
  useSearchConsoleKeywords,
  useSearchConsolePages,
  useSearchConsoleAlerts
} from '@/hooks/useSearchConsole'

function SEODashboardContent() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [syncing, setSyncing] = useState(false)

  // Date range state (default: last 7 days, accounting for GSC delay)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 9), // 9 days ago
    to: subDays(new Date(), 3),   // 3 days ago (accounting for GSC delay)
  })

  // Authentication hook
  const { authStatus, loading: authLoading, getAuthUrl, revokeAuth } = useSearchConsoleAuth()

  // Convert dateRange to strings for API
  const startDateStr = dateRange?.from?.toISOString().split('T')[0]
  const endDateStr = dateRange?.to?.toISOString().split('T')[0]

  // Data hooks (only active if authenticated) - pass date range
  const { summary, loading: metricsLoading, syncMetrics } = useSearchConsoleMetrics(30, startDateStr, endDateStr)
  const { keywords, loading: keywordsLoading } = useSearchConsoleKeywords(undefined, 10)
  const { pages, loading: pagesLoading } = useSearchConsolePages(undefined, 10)
  const { alerts, loading: alertsLoading, resolveAlert } = useSearchConsoleAlerts(true)

  // Check for OAuth callback
  useEffect(() => {
    const authParam = searchParams.get('auth')
    if (authParam === 'success') {
      toast({
        title: "Autenticação realizada!",
        description: "Google Search Console conectado com sucesso.",
      })
    } else if (authParam === 'error') {
      const message = searchParams.get('message') || 'Erro desconhecido'
      toast({
        title: "Erro na autenticação",
        description: message,
        variant: "destructive"
      })
    }
  }, [searchParams, toast])

  const handleAuthorize = async () => {
    try {
      const authUrl = await getAuthUrl()
      window.location.href = authUrl
    } catch (error) {
      toast({
        title: "Erro ao autorizar",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      })
    }
  }

  const handleRevoke = async () => {
    if (!confirm('Tem certeza que deseja desconectar o Google Search Console?')) return

    try {
      await revokeAuth()
      toast({
        title: "Autorização revogada",
        description: "Google Search Console desconectado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao revogar",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      })
    }
  }

  const handleSync = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast({
        title: "Selecione um período",
        description: "Por favor, selecione as datas de início e fim para sincronizar.",
        variant: "destructive"
      })
      return
    }

    setSyncing(true)
    try {
      const startDateStr = dateRange.from.toISOString().split('T')[0]
      const endDateStr = dateRange.to.toISOString().split('T')[0]

      await syncMetrics({ startDate: startDateStr, endDate: endDateStr })

      toast({
        title: "Sincronização concluída!",
        description: `Dados sincronizados de ${startDateStr} até ${endDateStr}`,
      })
    } catch (error) {
      toast({
        title: "Erro na sincronização",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      })
    } finally {
      setSyncing(false)
    }
  }

  const handleSync90Days = async () => {
    setSyncing(true)
    try {
      const endDate = subDays(new Date(), 3) // 3 days ago (GSC delay)
      const startDate = subDays(new Date(), 93) // 90 days before that

      const startDateStr = startDate.toISOString().split('T')[0]
      const endDateStr = endDate.toISOString().split('T')[0]

      // Update date range picker to show what we're syncing
      setDateRange({ from: startDate, to: endDate })

      toast({
        title: "Sincronizando últimos 90 dias...",
        description: "Isso pode levar ~2 minutos. Aguarde...",
      })

      await syncMetrics({ startDate: startDateStr, endDate: endDateStr })

      toast({
        title: "Sincronização completa!",
        description: `90 dias de dados importados com sucesso (${startDateStr} a ${endDateStr})`,
      })
    } catch (error) {
      toast({
        title: "Erro na sincronização",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      })
    } finally {
      setSyncing(false)
    }
  }

  const handleResolveAlert = async (alertId: number) => {
    try {
      await resolveAlert(alertId)
      toast({
        title: "Alerta resolvido",
        description: "O alerta foi marcado como resolvido.",
      })
    } catch (error) {
      toast({
        title: "Erro ao resolver alerta",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      })
    }
  }

  // Loading state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // Not authenticated state
  if (!authStatus?.authenticated) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard SEO</h1>
            <p className="text-gray-600 mt-2">Métricas do Google Search Console</p>
          </div>
        </div>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-blue-100">
                <Lock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl">Conectar ao Google Search Console</CardTitle>
                <CardDescription className="mt-2">
                  Para visualizar métricas de SEO, você precisa conectar sua conta do Google Search Console.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold mb-2">O que você terá acesso:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Impressões, cliques, CTR e posição média
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Top 20 palavras-chave com melhor desempenho
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Páginas com maior tráfego orgânico
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Alertas automáticos para quedas de performance
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Histórico de até 90 dias de métricas
                  </li>
                </ul>
              </div>

              <Button onClick={handleAuthorize} className="w-full bg-blue-600 hover:bg-blue-700">
                <Unlock className="mr-2 h-4 w-4" />
                Conectar ao Google Search Console
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Você será redirecionado para autorizar o acesso somente leitura ao Search Console
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Authenticated - show dashboard
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard SEO</h1>
          <p className="text-gray-600 mt-2">Google Search Console</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={syncing}
          >
            {syncing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Sincronizar
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleSync90Days}
            disabled={syncing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {syncing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Sincronizar 90 dias
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRevoke}
            disabled={syncing}
          >
            Desconectar
          </Button>
        </div>
      </div>

      {/* Date Range Picker */}
      <div className="flex items-center gap-4">
        <DateRangePicker
          date={dateRange}
          onDateChange={setDateRange}
          disabled={syncing}
        />
        <p className="text-sm text-gray-500">
          Selecione o período para sincronizar ou visualizar métricas
        </p>
      </div>

      {/* Alerts */}
      {alerts && alerts.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex justify-between items-center">
              <span className="font-semibold">
                {alerts.length} {alerts.length === 1 ? 'alerta ativo' : 'alertas ativos'} detectados
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // Scroll to alerts tab
                  document.getElementById('alerts-tab')?.click()
                }}
              >
                Ver alertas
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impressões Totais</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {metricsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {summary?.totalImpressions?.toLocaleString('pt-BR') || '0'}
                </div>
                <p className="text-xs text-muted-foreground">Últimos {summary?.days || 30} dias</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cliques Totais</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {metricsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {summary?.totalClicks?.toLocaleString('pt-BR') || '0'}
                </div>
                <p className="text-xs text-muted-foreground">Últimos {summary?.days || 30} dias</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CTR Médio</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {metricsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{summary?.avgCtr || '0.00'}%</div>
                <p className="text-xs text-muted-foreground">Taxa de cliques</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posição Média</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {metricsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{summary?.avgPosition || '0.00'}</div>
                <p className="text-xs text-muted-foreground">Nos resultados do Google</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="keywords" className="space-y-4">
        <TabsList>
          <TabsTrigger value="keywords">
            <Search className="mr-2 h-4 w-4" />
            Palavras-chave
          </TabsTrigger>
          <TabsTrigger value="pages">
            <FileText className="mr-2 h-4 w-4" />
            Páginas
          </TabsTrigger>
          <TabsTrigger value="alerts" id="alerts-tab">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Alertas {alerts && alerts.length > 0 && `(${alerts.length})`}
          </TabsTrigger>
        </TabsList>

        {/* Keywords Tab */}
        <TabsContent value="keywords" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Palavras-chave</CardTitle>
              <CardDescription>Palavras-chave com melhor desempenho</CardDescription>
            </CardHeader>
            <CardContent>
              {keywordsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : keywords && keywords.length > 0 ? (
                <div className="space-y-2">
                  {keywords.map((keyword, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{keyword?.query}</p>
                        <div className="flex gap-4 text-sm text-gray-600 mt-1">
                          <span>{keyword?.impressions?.toLocaleString('pt-BR')} impressões</span>
                          <span>{keyword?.clicks?.toLocaleString('pt-BR')} cliques</span>
                          <span>CTR: {(keyword?.ctr * 100).toFixed(2)}%</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {keyword?.position?.toFixed(1)}
                        </div>
                        <p className="text-xs text-gray-500">posição</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">Nenhum dado disponível</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pages Tab */}
        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Páginas</CardTitle>
              <CardDescription>Páginas com maior tráfego orgânico</CardDescription>
            </CardHeader>
            <CardContent>
              {pagesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : pages && pages.length > 0 ? (
                <div className="space-y-2">
                  {pages.map((page, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm truncate max-w-[500px]">
                            {page?.page}
                          </p>
                          <a
                            href={page?.page}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                        <div className="flex gap-4 text-sm text-gray-600 mt-1">
                          <span>{page?.impressions?.toLocaleString('pt-BR')} impressões</span>
                          <span>{page?.clicks?.toLocaleString('pt-BR')} cliques</span>
                          <span>CTR: {(page?.ctr * 100).toFixed(2)}%</span>
                          <span>Pos: {page?.position?.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">Nenhum dado disponível</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alertas Ativos</CardTitle>
              <CardDescription>Quedas significativas de performance detectadas</CardDescription>
            </CardHeader>
            <CardContent>
              {alertsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : alerts && alerts.length > 0 ? (
                <div className="space-y-2">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg border ${
                        alert.severity === 'critical'
                          ? 'bg-red-50 border-red-200'
                          : 'bg-yellow-50 border-yellow-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <AlertTriangle
                              className={`h-4 w-4 ${
                                alert.severity === 'critical' ? 'text-red-600' : 'text-yellow-600'
                              }`}
                            />
                            <span className="font-semibold">{alert.message}</span>
                          </div>
                          <div className="mt-2 text-sm text-gray-600 space-y-1">
                            <p>
                              Métrica: <strong>{alert.metric_name}</strong>
                            </p>
                            <p>
                              Valor atual: <strong>{alert.metric_value}</strong> (anterior:{' '}
                              {alert.previous_value})
                            </p>
                            <p>
                              Mudança: <strong>{alert.change_percentage.toFixed(1)}%</strong>
                            </p>
                            <p className="text-xs">
                              Data: {new Date(alert.date).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResolveAlert(alert.id)}
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Resolver
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <p className="text-gray-600">Nenhum alerta ativo</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Todas as métricas estão estáveis
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Export with Suspense boundary (required for useSearchParams in Next.js 15)
export default function SEODashboard() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-gray-600 ml-2 mt-4">Carregando dashboard SEO...</p>
      </div>
    }>
      <SEODashboardContent />
    </Suspense>
  )
}
