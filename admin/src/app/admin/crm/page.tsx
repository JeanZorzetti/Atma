"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  TrendingUp, 
  Target,
  PhoneCall,
  Calendar,
  CheckCircle,
  Plus,
  Filter,
  Search
} from 'lucide-react'
import Link from 'next/link'
import { useCrmStats } from '@/hooks/useApi'

export default function CRMPage() {
  const { data: stats, loading, error } = useCrmStats()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CRM B2B</h1>
            <p className="text-gray-600 mt-2">Gerencie o pipeline de captação de ortodontistas</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CRM B2B</h1>
            <p className="text-gray-600 mt-2">Gerencie o pipeline de captação de ortodontistas</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">Erro ao carregar estatísticas do CRM: {error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const crmData = stats?.data || {
    pipeline: { prospeccao: 0, contato_inicial: 0, apresentacao: 0, negociacao: 0, fechado: 0 },
    conversion_rates: { overall: '0.0' },
    total_leads_crm: 0,
    total_fechados: 0
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CRM B2B</h1>
          <p className="text-gray-600 mt-2">Gerencie o pipeline de captação de ortodontistas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Novo Lead
          </Button>
        </div>
      </div>

      {/* KPIs do CRM */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crmData.total_leads_crm}</div>
            <p className="text-xs text-gray-600">Ortodontistas no pipeline</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crmData.conversion_rates.overall}%</div>
            <p className="text-xs text-gray-600">Fechamentos vs leads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Negociação</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crmData.pipeline.negociacao}</div>
            <p className="text-xs text-gray-600">Propostas ativas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fechamentos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crmData.total_fechados}</div>
            <p className="text-xs text-gray-600">Parcerias fechadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PhoneCall className="h-5 w-5" />
              Kanban Pipeline
            </CardTitle>
            <CardDescription>Visualize e gerencie o funil de vendas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Arraste e solte ortodontistas entre as etapas do pipeline de vendas.
            </p>
            <Link href="/admin/crm/kanban">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Abrir Kanban
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Lista de Leads
            </CardTitle>
            <CardDescription>Visualização em tabela com filtros</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Gerencie todos os ortodontistas em formato de lista com busca avançada.
            </p>
            <Link href="/admin/crm/leads">
              <Button className="w-full" variant="outline">
                Ver Lista
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Agenda de Follow-up
            </CardTitle>
            <CardDescription>Próximas ações e lembretes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Acompanhe tarefas pendentes e agendamentos com ortodontistas.
            </p>
            <Link href="/admin/crm/agenda">
              <Button className="w-full" variant="outline">
                Ver Agenda
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Atividades Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
          <CardDescription>Últimas interações com ortodontistas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-center py-8 text-gray-500">
              <div className="text-center">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium">Nenhuma atividade ainda</h3>
                <p className="mt-1 text-sm text-gray-500">
                  As interações com ortodontistas aparecerão aqui.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}