'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Target,
  Lightbulb,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Minus,
} from 'lucide-react'

interface WorkflowAnalyticsPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workflowId?: string
  workflowName?: string
}

interface PerformanceStats {
  avgExecutionTime: number
  p50ExecutionTime: number
  p95ExecutionTime: number
  p99ExecutionTime: number
  successRate: number
  failureRate: number
  totalExecutions: number
  successfulExecutions: number
  failedExecutions: number
  trendDirection: 'improving' | 'stable' | 'degrading'
  bottlenecks: Array<{
    nodeName: string
    avgDuration: number
    percentageOfTotal: number
    impactLevel: string
    suggestions: string[]
  }>
  errorPatterns: Array<{
    errorType: string
    occurrences: number
    percentage: number
    trend: string
  }>
}

interface Recommendation {
  id: string
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  impact: string
  estimatedTimeSaved?: number
  priority: number
  implementationComplexity: 'low' | 'medium' | 'high'
  actions: Array<{
    id: string
    description: string
    automated: boolean
  }>
}

export default function WorkflowAnalyticsPanel({
  open,
  onOpenChange,
  workflowId,
  workflowName,
}: WorkflowAnalyticsPanelProps) {
  const [stats, setStats] = useState<PerformanceStats | null>(null)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [healthScore, setHealthScore] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (open && workflowId) {
      loadAnalytics()
    }
  }, [open, workflowId])

  const loadAnalytics = async () => {
    if (!workflowId) return

    setLoading(true)
    try {
      // Carregar estatísticas e recomendações
      const [statsResponse, recsResponse, healthResponse] = await Promise.all([
        fetch(`/api/analytics?action=analyze-performance&workflowId=${workflowId}`),
        fetch(
          `/api/analytics?action=generate-recommendations&workflowId=${workflowId}&workflowName=${encodeURIComponent(workflowName || 'Workflow')}`
        ),
        fetch(`/api/analytics?action=calculate-health-score&workflowId=${workflowId}`),
      ])

      if (statsResponse.ok) {
        const data = await statsResponse.json()
        setStats(data.stats)
      }

      if (recsResponse.ok) {
        const data = await recsResponse.json()
        setRecommendations(data.recommendations || [])
      }

      if (healthResponse.ok) {
        const data = await healthResponse.json()
        setHealthScore(data.healthScore)
      }
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    if (score >= 50) return 'text-orange-600'
    return 'text-red-600'
  }

  const getHealthScoreBadge = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800 border-green-200'
    if (score >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    if (score >= 50) return 'bg-orange-100 text-orange-800 border-orange-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  const getTrendIcon = (trend: string) => {
    if (trend === 'improving') return <TrendingUp className="h-4 w-4 text-green-600" />
    if (trend === 'degrading') return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-600" />
  }

  const getSeverityBadge = (severity: string) => {
    const colors = {
      low: 'bg-blue-100 text-blue-800 border-blue-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      critical: 'bg-red-100 text-red-800 border-red-200',
    }
    return colors[severity as keyof typeof colors] || colors.low
  }

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  if (!workflowId) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Analytics de Workflow</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8 text-slate-500">
            Selecione um workflow para ver as análises
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[95vh] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analytics: {workflowName || 'Workflow'}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Activity className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
              <div className="text-sm text-slate-600">Analisando workflow...</div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Health Score */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Health Score</div>
                    <div className={`text-4xl font-bold ${getHealthScoreColor(healthScore)}`}>
                      {healthScore}
                      <span className="text-lg text-slate-400">/100</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={getHealthScoreBadge(healthScore)}>
                      {healthScore >= 90
                        ? 'Excelente'
                        : healthScore >= 70
                          ? 'Bom'
                          : healthScore >= 50
                            ? 'Atenção'
                            : 'Crítico'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    Tempo Médio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats ? formatTime(stats.avgExecutionTime) : '-'}
                  </div>
                  {stats && (
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                      {getTrendIcon(stats.trendDirection)}
                      <span className="capitalize">{stats.trendDirection}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-600" />
                    Taxa de Sucesso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats ? `${stats.successRate.toFixed(1)}%` : '-'}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {stats?.successfulExecutions || 0} / {stats?.totalExecutions || 0} execuções
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-600" />
                    P95
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats ? formatTime(stats.p95ExecutionTime) : '-'}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">95% das execuções</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="h-4 w-4 text-purple-600" />
                    Total
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalExecutions || 0}</div>
                  <div className="text-xs text-slate-500 mt-1">execuções analisadas</div>
                </CardContent>
              </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="recommendations">
                  Recomendações ({recommendations.length})
                </TabsTrigger>
                <TabsTrigger value="bottlenecks">Gargalos</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Distribuição de Tempo</CardTitle>
                    <CardDescription>Percentis de tempo de execução</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Mínimo</span>
                        <span className="font-semibold">
                          {stats ? formatTime(stats.p50ExecutionTime) : '-'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">P50 (Mediana)</span>
                        <span className="font-semibold">
                          {stats ? formatTime(stats.p50ExecutionTime) : '-'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">P95</span>
                        <span className="font-semibold">
                          {stats ? formatTime(stats.p95ExecutionTime) : '-'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">P99</span>
                        <span className="font-semibold">
                          {stats ? formatTime(stats.p99ExecutionTime) : '-'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {stats && stats.errorPatterns && stats.errorPatterns.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Padrões de Erro</CardTitle>
                      <CardDescription>Erros mais frequentes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {stats.errorPatterns.slice(0, 5).map((error, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-red-50 rounded border border-red-100">
                            <div className="flex-1">
                              <div className="text-sm font-medium text-red-900">{error.errorType}</div>
                              <div className="text-xs text-red-600 mt-1">
                                {error.occurrences} ocorrências ({error.percentage.toFixed(1)}%)
                              </div>
                            </div>
                            <Badge variant="outline" className="bg-red-100 text-red-800">
                              {error.trend}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Recommendations Tab */}
              <TabsContent value="recommendations" className="space-y-3">
                {recommendations.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
                      <div className="font-semibold">Tudo em ordem!</div>
                      <div className="text-sm text-slate-600">
                        Nenhuma recomendação de otimização no momento
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  recommendations.map(rec => (
                    <Card key={rec.id} className="border-l-4 border-l-blue-500">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Lightbulb className="h-4 w-4 text-blue-600" />
                              {rec.title}
                            </CardTitle>
                            <CardDescription className="mt-1">{rec.description}</CardDescription>
                          </div>
                          <Badge variant="outline" className={getSeverityBadge(rec.severity)}>
                            {rec.severity.toUpperCase()}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Target className="h-4 w-4 text-green-600" />
                            <span className="font-medium">Impacto:</span>
                            <span className="text-slate-600">{rec.impact}</span>
                          </div>

                          {rec.estimatedTimeSaved && (
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-blue-600" />
                              <span className="font-medium">Economia estimada:</span>
                              <span className="text-slate-600">{formatTime(rec.estimatedTimeSaved)}</span>
                            </div>
                          )}

                          <div>
                            <div className="text-sm font-medium mb-2">Ações Recomendadas:</div>
                            <div className="space-y-2">
                              {rec.actions.map(action => (
                                <div
                                  key={action.id}
                                  className="flex items-start gap-2 text-sm p-2 bg-slate-50 rounded"
                                >
                                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                  </div>
                                  <span className="flex-1">{action.description}</span>
                                  {action.automated && (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                                      Auto
                                    </Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t">
                            <span>Prioridade: #{rec.priority}</span>
                            <span>Complexidade: {rec.implementationComplexity}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              {/* Bottlenecks Tab */}
              <TabsContent value="bottlenecks" className="space-y-3">
                {stats && stats.bottlenecks && stats.bottlenecks.length > 0 ? (
                  stats.bottlenecks.map((bottleneck, idx) => (
                    <Card key={idx} className="border-l-4 border-l-orange-500">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                          {bottleneck.nodeName}
                        </CardTitle>
                        <CardDescription>
                          Consome {bottleneck.percentageOfTotal.toFixed(1)}% do tempo total
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-4">
                            <div>
                              <div className="text-xs text-slate-600">Tempo Médio</div>
                              <div className="text-lg font-bold">{formatTime(bottleneck.avgDuration)}</div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-600">Nível de Impacto</div>
                              <Badge
                                variant="outline"
                                className={
                                  bottleneck.impactLevel === 'critical'
                                    ? 'bg-red-100 text-red-800'
                                    : bottleneck.impactLevel === 'high'
                                      ? 'bg-orange-100 text-orange-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                }
                              >
                                {bottleneck.impactLevel.toUpperCase()}
                              </Badge>
                            </div>
                          </div>

                          {bottleneck.suggestions.length > 0 && (
                            <div>
                              <div className="text-sm font-medium mb-2">Sugestões:</div>
                              <div className="space-y-1">
                                {bottleneck.suggestions.map((suggestion, sIdx) => (
                                  <div key={sIdx} className="text-sm text-slate-600 pl-4">
                                    • {suggestion}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
                      <div className="font-semibold">Sem gargalos identificados</div>
                      <div className="text-sm text-slate-600">
                        O workflow está executando de forma eficiente
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>

            <div className="flex justify-end pt-4 border-t">
              <Button variant="outline" onClick={loadAnalytics} disabled={loading}>
                <Activity className="h-4 w-4 mr-2" />
                Atualizar Análise
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
