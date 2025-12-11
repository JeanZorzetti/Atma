"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Workflow,
  Play,
  Pause,
  RefreshCw,
  Settings,
  Plus,
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
  ExternalLink
} from 'lucide-react'
import { useState } from 'react'

interface WorkflowData {
  id: string
  name: string
  description: string
  status: 'active' | 'paused' | 'error'
  lastRun?: string
  executions: number
  successRate: number
}

export default function AutomacoesPage() {
  const [workflows] = useState<WorkflowData[]>([
    {
      id: '1',
      name: 'Envio de Follow-up Automático',
      description: 'Envia emails de acompanhamento para leads após 3 dias sem resposta',
      status: 'active',
      lastRun: '2 horas atrás',
      executions: 145,
      successRate: 98.5
    },
    {
      id: '2',
      name: 'Notificação de Novo Lead',
      description: 'Notifica a equipe via WhatsApp quando um novo lead entra no sistema',
      status: 'active',
      lastRun: '15 minutos atrás',
      executions: 89,
      successRate: 100
    },
    {
      id: '3',
      name: 'Relatório Semanal',
      description: 'Gera e envia relatório de conversões toda segunda-feira às 9h',
      status: 'paused',
      lastRun: '3 dias atrás',
      executions: 24,
      successRate: 95.8
    }
  ])

  const [stats] = useState({
    totalWorkflows: 3,
    activeWorkflows: 2,
    totalExecutions: 258,
    avgSuccessRate: 98.1
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'paused':
        return 'bg-yellow-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pausado</Badge>
      case 'error':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Erro</Badge>
      default:
        return <Badge>Desconhecido</Badge>
    }
  }

  const openN8nEditor = () => {
    // Abre o n8n em uma nova aba - configure a URL do seu n8n aqui
    const n8nUrl = process.env.NEXT_PUBLIC_N8N_URL || 'https://n8n.roilabs.com.br'
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
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button onClick={openN8nEditor} className="bg-purple-600 hover:bg-purple-700">
            <ExternalLink className="h-4 w-4 mr-2" />
            Abrir n8n
          </Button>
        </div>
      </div>

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
            <div className="text-2xl font-bold text-gray-900">{stats.totalWorkflows}</div>
            <p className="text-xs text-gray-500 mt-1">Workflows configurados</p>
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
            <div className="text-2xl font-bold text-gray-900">{stats.activeWorkflows}</div>
            <p className="text-xs text-gray-500 mt-1">Em execução agora</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Execuções
            </CardTitle>
            <Play className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalExecutions}</div>
            <p className="text-xs text-gray-500 mt-1">Últimos 30 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Taxa de Sucesso
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.avgSuccessRate}%</div>
            <p className="text-xs text-gray-500 mt-1">Média geral</p>
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
            <span className="text-sm text-gray-700">Conexão ativa com n8n</span>
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
                Automações ativas e configuradas no sistema
              </CardDescription>
            </div>
            <Button onClick={openN8nEditor} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Novo Workflow
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <div
                key={workflow.id}
                className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all"
              >
                <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${getStatusColor(workflow.status)}`}></div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{workflow.name}</h4>
                    {getStatusBadge(workflow.status)}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{workflow.description}</p>

                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Última execução: {workflow.lastRun}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      <span>{workflow.executions} execuções</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{workflow.successRate}% sucesso</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {workflow.status === 'active' ? (
                    <Button variant="outline" size="sm">
                      <Pause className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={openN8nEditor}>
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {workflows.length === 0 && (
            <div className="text-center py-12">
              <Workflow className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">Nenhum workflow configurado ainda</p>
              <p className="text-sm text-gray-500 mb-4">Crie seu primeiro workflow no n8n</p>
              <Button onClick={openN8nEditor}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Workflow
              </Button>
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
                <p className="text-gray-600">Ative seus workflows e acompanhe as execuções em tempo real</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
