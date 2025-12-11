"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Workflow,
  RefreshCw,
  Plus,
  Activity,
  AlertCircle,
  Zap,
  ExternalLink,
  Loader2
} from 'lucide-react'
import { useState, useEffect } from 'react'

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

export default function AutomacoesPage() {
  const [workflows, setWorkflows] = useState<N8nWorkflow[]>([])
  const [stats, setStats] = useState<WorkflowStats>({
    totalWorkflows: 0,
    activeWorkflows: 0,
    totalExecutions: 0,
    avgSuccessRate: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWorkflows = async () => {
    setLoading(true)
    setError(null)

    try {
      // TODO: Implementar API para buscar workflows do n8n
      // const response = await fetch('/api/n8n/workflows')
      // const data = await response.json()
      // setWorkflows(data.workflows)

      // Simulação de loading
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Por enquanto, deixar vazio até implementar a API
      setWorkflows([])

      // Calcular estatísticas baseadas nos workflows reais
      const totalWorkflows = workflows.length
      const activeWorkflows = workflows.filter(w => w.active).length

      setStats({
        totalWorkflows,
        activeWorkflows,
        totalExecutions: 0,
        avgSuccessRate: 0
      })
    } catch (err) {
      setError('Erro ao carregar workflows')
      console.error('Erro ao buscar workflows:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkflows()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openN8nEditor = () => {
    const n8nUrl = process.env.NEXT_PUBLIC_N8N_URL || 'https://ia-n8n.tjmarr.easypanel.host'
    window.open(n8nUrl, '_blank')
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
          <Button variant="outline" onClick={fetchWorkflows} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
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

      {/* Workflows List */}
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

                  <Button variant="outline" size="sm" onClick={openN8nEditor}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
    </div>
  )
}
