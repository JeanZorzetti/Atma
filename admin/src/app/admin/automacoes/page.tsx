"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Workflow,
  RefreshCw,
  Plus,
  Activity,
  AlertCircle,
  Zap,
  ExternalLink,
  Loader2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  BarChart3,
  FileText,
  GitBranch,
  Sparkles,
  Copy
} from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { WorkflowDocumentationModal } from '@/components/workflow-documentation-modal'
import { WorkflowGitHistory } from '@/components/workflow-git-history'
import { WorkflowTemplateGallery } from '@/components/workflow-template-gallery'
import { WorkflowTemplateCreator } from '@/components/workflow-template-creator'
import { WorkflowEnvironmentSelector } from '@/components/workflow-environment-selector'

interface N8nWorkflow {
  id: string
  name: string
  active: boolean
  nodes: unknown[]
  connections: unknown
  createdAt: string
  updatedAt: string
}

interface WorkflowStats {
  totalWorkflows: number
  activeWorkflows: number
  totalExecutions: number
  avgSuccessRate: number
}

interface WorkflowExecution {
  id: string
  workflowId: string
  workflowName: string
  status: string
  startedAt: string
  finishedAt: string | null
  duration: number | null
  nodesExecuted: number
  errorMessage: string | null
  logs: WorkflowLog[]
}

interface WorkflowLog {
  id: string
  level: string
  message: string
  nodeName: string | null
  timestamp: string
}

interface WorkflowAlert {
  id: string
  type: string
  title: string
  message: string
  workflowName: string
  status: string
  createdAt: string
}

export default function AutomacoesPage() {
  const [workflows, setWorkflows] = useState<N8nWorkflow[]>([])
  const [stats, setStats] = useState<WorkflowStats>({
    totalWorkflows: 0,
    activeWorkflows: 0,
    totalExecutions: 0,
    avgSuccessRate: 0
  })
  const [executions, setExecutions] = useState<WorkflowExecution[]>([])
  const [alerts, setAlerts] = useState<WorkflowAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingExecutions, setLoadingExecutions] = useState(false)
  const [loadingAlerts, setLoadingAlerts] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [documentationModalOpen, setDocumentationModalOpen] = useState(false)
  const [gitHistoryModalOpen, setGitHistoryModalOpen] = useState(false)
  const [templateGalleryOpen, setTemplateGalleryOpen] = useState(false)
  const [templateCreatorOpen, setTemplateCreatorOpen] = useState(false)
  const [selectedWorkflow, setSelectedWorkflow] = useState<{ id: string; name: string; data?: unknown } | null>(null)

  const fetchWorkflows = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/n8n/workflows')

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const workflowsData = data.workflows || []
      setWorkflows(workflowsData)

      // Calcular estatísticas baseadas nos workflows reais
      const totalWorkflows = workflowsData.length
      const activeWorkflows = workflowsData.filter((w: N8nWorkflow) => w.active).length

      // Buscar execuções para calcular estatísticas
      const executionsResponse = await fetch('/api/n8n/executions?limit=100')
      const executionsData = await executionsResponse.json()
      const totalExecutions = executionsData.total || 0
      const successfulExecutions = executionsData.executions?.filter((e: WorkflowExecution) => e.status === 'success').length || 0
      const avgSuccessRate = totalExecutions > 0 ? Math.round((successfulExecutions / totalExecutions) * 100) : 0

      setStats({
        totalWorkflows,
        activeWorkflows,
        totalExecutions,
        avgSuccessRate
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar workflows'
      setError(errorMessage)
      console.error('Erro ao buscar workflows:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchExecutions = useCallback(async () => {
    setLoadingExecutions(true)
    try {
      const response = await fetch('/api/n8n/executions?limit=20')
      const data = await response.json()
      setExecutions(data.executions || [])
    } catch (err) {
      console.error('Erro ao buscar execuções:', err)
    } finally {
      setLoadingExecutions(false)
    }
  }, [])

  const fetchAlerts = useCallback(async () => {
    setLoadingAlerts(true)
    try {
      const response = await fetch('/api/n8n/alerts?status=pending&limit=10')
      const data = await response.json()
      setAlerts(data.alerts || [])
    } catch (err) {
      console.error('Erro ao buscar alertas:', err)
    } finally {
      setLoadingAlerts(false)
    }
  }, [])

  useEffect(() => {
    fetchWorkflows()
    fetchExecutions()
    fetchAlerts()
  }, [fetchWorkflows, fetchExecutions, fetchAlerts])

  // Auto-refresh a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      fetchExecutions()
      fetchAlerts()
    }, 30000)

    return () => clearInterval(interval)
  }, [fetchExecutions, fetchAlerts])

  const openN8nEditor = () => {
    const n8nUrl = process.env.NEXT_PUBLIC_N8N_URL || 'https://ia-n8n.tjmarr.easypanel.host'
    window.open(n8nUrl, '_blank')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'running':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      success: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800',
      running: 'bg-blue-100 text-blue-800',
      waiting: 'bg-yellow-100 text-yellow-800'
    }
    return variants[status] || 'bg-gray-100 text-gray-800'
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-blue-600" />
    }
  }

  const formatDuration = (ms: number | null) => {
    if (!ms) return '-'
    if (ms < 1000) return `${ms}ms`
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
    return `${(ms / 60000).toFixed(1)}min`
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Zap className="h-8 w-8 text-purple-600" />
            Automações
          </h1>
          <p className="text-gray-600 mt-2">Gerencie workflows e automações do sistema</p>
        </div>
        <div className="flex gap-2">
          <WorkflowEnvironmentSelector />
          <Button variant="outline" onClick={fetchWorkflows} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button
            variant="outline"
            onClick={() => setTemplateGalleryOpen(true)}
            className="border-purple-200 hover:border-purple-300 hover:bg-purple-50"
          >
            <Sparkles className="h-4 w-4 mr-2 text-purple-600" />
            Templates
          </Button>
          <Button onClick={openN8nEditor} className="bg-purple-600 hover:bg-purple-700">
            <ExternalLink className="h-4 w-4 mr-2" />
            Abrir n8n
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Workflows
            </CardTitle>
            <Workflow className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Carregando...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-gray-900">{stats.totalWorkflows}</div>
                <p className="text-xs text-gray-500 mt-1">Workflows configurados</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Workflows Ativos
            </CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Carregando...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-gray-900">{stats.activeWorkflows}</div>
                <p className="text-xs text-gray-500 mt-1">Em execução agora</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Execuções
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Carregando...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-gray-900">{stats.totalExecutions}</div>
                <p className="text-xs text-gray-500 mt-1">Últimos 30 dias</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Taxa de Sucesso
            </CardTitle>
            <Activity className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Carregando...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.avgSuccessRate > 0 ? `${stats.avgSuccessRate}%` : '-'}
                </div>
                <p className="text-xs text-gray-500 mt-1">Média geral</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* n8n Integration Info */}
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            Integração com n8n
          </CardTitle>
          <CardDescription>
            Plataforma de automação de workflows conectada ao sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Pronto para configurar automações</span>
          </div>
          <p className="text-sm text-gray-600">
            O n8n é uma plataforma de automação de workflows que permite criar integrações complexas
            sem código. Conecte diferentes serviços, APIs e bancos de dados para automatizar processos do seu negócio.
          </p>
          <Button variant="outline" onClick={openN8nEditor} className="w-full sm:w-auto">
            <ExternalLink className="h-4 w-4 mr-2" />
            Acessar Editor n8n
          </Button>
        </CardContent>
      </Card>

      {/* Tabs com Workflows, Execuções, Logs e Alertas */}
      <Tabs defaultValue="workflows" className="space-y-4">
        <TabsList>
          <TabsTrigger value="workflows" className="flex items-center gap-2">
            <Workflow className="h-4 w-4" />
            Workflows
          </TabsTrigger>
          <TabsTrigger value="executions" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Execuções
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Alertas
            {alerts.length > 0 && (
              <Badge className="ml-1 bg-red-500">{alerts.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Métricas
          </TabsTrigger>
        </TabsList>

        {/* Tab: Workflows */}
        <TabsContent value="workflows">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Workflows Configurados</CardTitle>
                  <CardDescription>
                    Automações ativas e configuradas no n8n
                  </CardDescription>
                </div>
                <Button onClick={openN8nEditor} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Workflow
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                  <span className="ml-3 text-gray-600">Carregando workflows...</span>
                </div>
              ) : workflows.length === 0 ? (
                <div className="text-center py-12">
                  <Workflow className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">Nenhum workflow configurado ainda</p>
                  <p className="text-sm text-gray-500 mb-4">Crie seu primeiro workflow no n8n para começar a automatizar processos</p>
                  <Button onClick={openN8nEditor}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Workflow
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {workflows.map((workflow) => (
                    <div
                      key={workflow.id}
                      className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all"
                    >
                      <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${workflow.active ? 'bg-green-500' : 'bg-gray-400'}`}></div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{workflow.name}</h4>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${workflow.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {workflow.active ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {workflow.nodes.length} nós • Atualizado em {new Date(workflow.updatedAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedWorkflow({ id: workflow.id, name: workflow.name })
                            setDocumentationModalOpen(true)
                          }}
                          title="Documentar workflow"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedWorkflow({ id: workflow.id, name: workflow.name })
                            setGitHistoryModalOpen(true)
                          }}
                          title="Histórico Git"
                        >
                          <GitBranch className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedWorkflow({ id: workflow.id, name: workflow.name, data: workflow })
                            setTemplateCreatorOpen(true)
                          }}
                          title="Criar Template"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={openN8nEditor}>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Execuções */}
        <TabsContent value="executions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Histórico de Execuções</CardTitle>
                  <CardDescription>
                    Últimas execuções de workflows com logs detalhados
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={fetchExecutions} disabled={loadingExecutions}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${loadingExecutions ? 'animate-spin' : ''}`} />
                  Atualizar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingExecutions ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                  <span className="ml-3 text-gray-600">Carregando execuções...</span>
                </div>
              ) : executions.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">Nenhuma execução registrada</p>
                  <p className="text-sm text-gray-500">As execuções de workflows aparecerão aqui</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {executions.map((execution) => (
                    <div
                      key={execution.id}
                      className="border border-gray-200 rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {getStatusIcon(execution.status)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{execution.workflowName}</h4>
                              <Badge className={getStatusBadge(execution.status)}>
                                {execution.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDate(execution.startedAt)}
                              </span>
                              <span>{formatDuration(execution.duration)}</span>
                              <span>{execution.nodesExecuted} nós executados</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {execution.errorMessage && (
                        <div className="bg-red-50 border border-red-200 rounded p-3">
                          <p className="text-sm text-red-800 font-medium mb-1">Erro:</p>
                          <p className="text-xs text-red-700">{execution.errorMessage}</p>
                        </div>
                      )}

                      {execution.logs && execution.logs.length > 0 && (
                        <div className="bg-gray-50 rounded p-3 space-y-2">
                          <p className="text-xs font-medium text-gray-700">Logs:</p>
                          <div className="space-y-1 max-h-40 overflow-y-auto">
                            {execution.logs.slice(0, 5).map((log) => (
                              <div key={log.id} className="flex items-start gap-2 text-xs">
                                <span className={`font-mono px-1.5 py-0.5 rounded ${
                                  log.level === 'error' ? 'bg-red-100 text-red-800' :
                                  log.level === 'warn' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {log.level}
                                </span>
                                {log.nodeName && (
                                  <span className="text-purple-600 font-medium">[{log.nodeName}]</span>
                                )}
                                <span className="text-gray-700">{log.message}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Alertas */}
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Alertas Pendentes</CardTitle>
                  <CardDescription>
                    Notificações e alertas que requerem atenção
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={fetchAlerts} disabled={loadingAlerts}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${loadingAlerts ? 'animate-spin' : ''}`} />
                  Atualizar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingAlerts ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                  <span className="ml-3 text-gray-600">Carregando alertas...</span>
                </div>
              ) : alerts.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">Nenhum alerta pendente</p>
                  <p className="text-sm text-gray-500">Todos os workflows estão funcionando corretamente</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`border rounded-lg p-4 ${
                        alert.type === 'critical' || alert.type === 'error'
                          ? 'border-red-200 bg-red-50'
                          : alert.type === 'warning'
                          ? 'border-yellow-200 bg-yellow-50'
                          : 'border-blue-200 bg-blue-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                            <Badge className="text-xs">
                              {alert.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{alert.workflowName}</span>
                            <span>{formatDate(alert.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Métricas */}
        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>Métricas de Performance</CardTitle>
              <CardDescription>
                Análise detalhada de performance e confiabilidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">Métricas detalhadas em breve</p>
                <p className="text-sm text-gray-500">Gráficos de performance, tendências e análises estarão disponíveis aqui</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            Como Usar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-medium mb-1">Acesse o Editor n8n</p>
                <p className="text-gray-600">Clique no botão &quot;Abrir n8n&quot; para acessar o editor visual de workflows</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-medium mb-1">Crie seus Workflows</p>
                <p className="text-gray-600">Arraste e conecte nós para criar automações personalizadas</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-medium mb-1">Ative e Monitore</p>
                <p className="text-gray-600">Ative seus workflows e acompanhe as execuções em tempo real no n8n</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modais */}
      {selectedWorkflow && (
        <>
          <WorkflowDocumentationModal
            open={documentationModalOpen}
            onOpenChange={setDocumentationModalOpen}
            workflowId={selectedWorkflow.id}
            workflowName={selectedWorkflow.name}
          />
          <WorkflowGitHistory
            open={gitHistoryModalOpen}
            onOpenChange={setGitHistoryModalOpen}
            workflowId={selectedWorkflow.id}
            workflowName={selectedWorkflow.name}
          />
          <WorkflowTemplateCreator
            open={templateCreatorOpen}
            onOpenChange={setTemplateCreatorOpen}
            workflowId={selectedWorkflow.id}
            workflowName={selectedWorkflow.name}
            workflowData={selectedWorkflow.data}
            onTemplateCreated={fetchWorkflows}
          />
        </>
      )}

      <WorkflowTemplateGallery
        open={templateGalleryOpen}
        onOpenChange={setTemplateGalleryOpen}
        onSelectTemplate={(template) => {
          console.log('Template selecionado:', template)
          // TODO: Implementar criação de workflow a partir do template
        }}
      />
    </div>
  )
}
