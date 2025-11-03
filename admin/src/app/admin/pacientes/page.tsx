"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Users,
  TrendingUp,
  UserCheck,
  Calendar,
  CheckCircle,
  Search,
  Phone,
  Mail,
  Video,
  FileText,
  Clock,
  ArrowRight,
  Activity
} from 'lucide-react'
import Link from 'next/link'
import { usePatients } from '@/hooks/useApi'
import { CrmActivity } from '@/lib/api'

interface Patient {
  id: number
  name: string
  email: string
  phone?: string
  status: string
  registrationDate?: string
}

interface PatientStats {
  total_pacientes: number
  novos_mes: number
  em_tratamento: number
  concluidos: number
  taxa_conversao: number
  pipeline: {
    novo: number
    contatado: number
    agendado: number
    avaliacao_inicial: number
    em_tratamento: number
    concluido: number
  }
}

export default function PacientesCRMPage() {
  const { data: patientsData, loading, error } = usePatients()
  const [activities, setActivities] = useState<CrmActivity[]>([])
  const [loadingActivities, setLoadingActivities] = useState(true)

  const patients = patientsData?.patients || []

  // Calculate stats from patients data
  const stats: PatientStats = {
    total_pacientes: patients.length,
    novos_mes: patients.filter((p: Patient) => {
      if (!p.registrationDate) return false
      const regDate = new Date(p.registrationDate)
      const now = new Date()
      return regDate.getMonth() === now.getMonth() && regDate.getFullYear() === now.getFullYear()
    }).length,
    em_tratamento: patients.filter((p: Patient) => p.status === 'atribuido').length,
    concluidos: patients.filter((p: Patient) => p.status === 'convertido').length,
    taxa_conversao: patients.length > 0
      ? parseFloat(((patients.filter((p: Patient) => p.status === 'convertido').length / patients.length) * 100).toFixed(1))
      : 0,
    pipeline: {
      novo: patients.filter((p: Patient) => p.status === 'novo').length,
      contatado: patients.filter((p: Patient) => p.status === 'contatado').length,
      agendado: patients.filter((p: Patient) => p.status === 'agendado').length,
      avaliacao_inicial: 0, // Placeholder
      em_tratamento: patients.filter((p: Patient) => p.status === 'atribuido').length,
      concluido: patients.filter((p: Patient) => p.status === 'convertido').length
    }
  }

  const fetchActivities = async () => {
    try {
      setLoadingActivities(true)
      // For now, use mock data since we don't have patient activities yet
      setActivities([])
    } catch (error) {
      console.error('Erro ao buscar atividades:', error)
    } finally {
      setLoadingActivities(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [])

  const getActivityIcon = (tipo: CrmActivity['tipo']) => {
    const iconProps = { className: "h-4 w-4" }

    switch (tipo) {
      case 'ligacao':
        return <Phone {...iconProps} />
      case 'email':
        return <Mail {...iconProps} />
      case 'reuniao':
        return <Video {...iconProps} />
      case 'apresentacao':
        return <FileText {...iconProps} />
      case 'proposta':
        return <FileText {...iconProps} />
      case 'followup':
        return <Clock {...iconProps} />
      case 'mudanca_status':
        return <UserCheck {...iconProps} />
      default:
        return <ArrowRight {...iconProps} />
    }
  }

  const getActivityTypeLabel = (tipo: CrmActivity['tipo']) => {
    const labels = {
      'ligacao': 'Ligação',
      'email': 'E-mail',
      'reuniao': 'Consulta',
      'apresentacao': 'Apresentação',
      'proposta': 'Orçamento',
      'followup': 'Follow-up',
      'mudanca_status': 'Mudança de Status'
    }
    return labels[tipo] || tipo
  }

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Agora há pouco'
    if (diffInMinutes < 60) return `${diffInMinutes}min atrás`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h atrás`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d atrás`

    return date.toLocaleDateString('pt-BR')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CRM Pacientes</h1>
            <p className="text-gray-600 mt-2">Gerencie o pipeline de atendimento aos pacientes</p>
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
            <h1 className="text-3xl font-bold text-gray-900">CRM Pacientes</h1>
            <p className="text-gray-600 mt-2">Gerencie o pipeline de atendimento aos pacientes</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">Erro ao carregar estatísticas: {error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CRM Pacientes</h1>
          <p className="text-gray-600 mt-2">Gerencie o pipeline de atendimento aos pacientes</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/pacientes/lista">
            <Button variant="outline">
              <Search className="mr-2 h-4 w-4" />
              Ver Lista Completa
            </Button>
          </Link>
        </div>
      </div>

      {/* KPIs do CRM Pacientes */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_pacientes}</div>
            <p className="text-xs text-gray-600">Cadastrados no sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Este Mês</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.novos_mes}</div>
            <p className="text-xs text-gray-600">Novos cadastros</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Tratamento</CardTitle>
            <UserCheck className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.em_tratamento}</div>
            <p className="text-xs text-gray-600">Tratamentos ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.concluidos}</div>
            <p className="text-xs text-gray-600">Tratamentos finalizados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.taxa_conversao}%</div>
            <p className="text-xs text-gray-600">Leads → Tratamento</p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline de Pacientes</CardTitle>
          <CardDescription>Distribuição por etapa do atendimento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">{stats.pipeline.novo}</div>
              <div className="text-xs text-blue-600 mt-1">Novos</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-700">{stats.pipeline.contatado}</div>
              <div className="text-xs text-yellow-600 mt-1">Contatados</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">{stats.pipeline.agendado}</div>
              <div className="text-xs text-purple-600 mt-1">Agendados</div>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-700">{stats.pipeline.avaliacao_inicial}</div>
              <div className="text-xs text-indigo-600 mt-1">Avaliação</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-700">{stats.pipeline.em_tratamento}</div>
              <div className="text-xs text-orange-600 mt-1">Em Tratamento</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">{stats.pipeline.concluido}</div>
              <div className="text-xs text-green-600 mt-1">Concluídos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Kanban Pipeline
            </CardTitle>
            <CardDescription>Visualize e gerencie o funil de atendimento</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Arraste e solte pacientes entre as etapas do processo de atendimento.
            </p>
            <Link href="/admin/pacientes/kanban">
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
              Lista de Pacientes
            </CardTitle>
            <CardDescription>Visualização em tabela com filtros</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Gerencie todos os pacientes em formato de lista com busca avançada.
            </p>
            <Link href="/admin/pacientes/lista">
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
              Agenda de Acompanhamento
            </CardTitle>
            <CardDescription>Próximas consultas e lembretes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Acompanhe consultas agendadas e lembretes de follow-up com pacientes.
            </p>
            <Link href="/admin/pacientes/agenda">
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
          <CardDescription>Últimas interações com pacientes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loadingActivities ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Clock className="mx-auto h-8 w-8 text-gray-400 animate-spin" />
                  <p className="mt-2 text-sm text-gray-500">Carregando atividades...</p>
                </div>
              </div>
            ) : activities.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-gray-500">
                <div className="text-center">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium">Nenhuma atividade ainda</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    As interações com pacientes aparecerão aqui.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border bg-gray-50/50">
                    <div className="flex-shrink-0 p-2 bg-white rounded-full border">
                      {getActivityIcon(activity.tipo)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.titulo}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatRelativeTime(activity.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center text-xs text-gray-600 mt-1">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          {getActivityTypeLabel(activity.tipo)}
                        </span>
                        <span className="ml-2">•</span>
                        <span className="ml-2">
                          {activity.lead_nome}
                        </span>
                        <span className="ml-2">•</span>
                        <span className="ml-2">{activity.usuario}</span>
                      </div>
                      {activity.descricao && (
                        <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                          {activity.descricao}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
