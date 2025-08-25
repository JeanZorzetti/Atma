"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, UserCheck, Calendar, TrendingUp, Activity, AlertCircle, Loader2 } from 'lucide-react'
import { useSystemStats, useSystemHealth, useQuickActions } from '@/hooks/useApi'

export default function AdminDashboard() {
  const { data: stats, loading: statsLoading, error: statsError } = useSystemStats()
  const { data: health, loading: healthLoading } = useSystemHealth()
  const { data: quickActions, loading: actionsLoading } = useQuickActions()

  // Mapeamento de cores para classes CSS válidas do Tailwind
  const colorClasses = {
    red: {
      bg: 'bg-red-50',
      text: 'text-red-900',
      textSecondary: 'text-red-700'
    },
    yellow: {
      bg: 'bg-yellow-50', 
      text: 'text-yellow-900',
      textSecondary: 'text-yellow-700'
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-900', 
      textSecondary: 'text-blue-700'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-900',
      textSecondary: 'text-green-700'
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const statsCards = [
    {
      title: 'Total de Pacientes',
      value: stats?.totalPatients?.toString() || '0',
      change: stats?.patientsGrowth || 'Sem dados',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Ortodontistas Ativos',
      value: stats?.totalOrthodontists?.toString() || '0',
      change: stats?.orthodontistsGrowth || 'Sem dados',
      icon: UserCheck,
      color: 'text-green-600'
    },
    {
      title: 'Consultas Hoje',
      value: stats?.todayAppointments?.toString() || '0',
      change: stats?.appointmentsConfirmed || 'Sem dados',
      icon: Calendar,
      color: 'text-orange-600'
    },
    {
      title: 'Receita Mensal',
      value: stats?.monthlyRevenue ? formatCurrency(stats.monthlyRevenue) : 'R$ 0',
      change: stats?.revenueGrowth || 'Sem dados',
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ]

  const recentActivities = stats?.recentActivities || [
    {
      id: 1,
      type: 'info',
      message: 'Sistema iniciado - conectando ao backend...',
      time: 'agora',
      status: 'info'
    }
  ]
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Bem-vindo ao painel administrativo da Atma Aligner</p>
      </div>

      {/* Connection Status */}
      {(statsLoading || healthLoading) && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="flex items-center gap-3 py-4">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <span className="text-blue-800">Conectando ao backend...</span>
          </CardContent>
        </Card>
      )}

      {statsError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800">Erro ao conectar com o backend: {statsError}</span>
          </CardContent>
        </Card>
      )}

      {health && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-800">Backend conectado - {health.environment}</span>
            </div>
            <Badge variant="outline" className="text-green-700 border-green-300">
              {health.status}
            </Badge>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {statsLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Carregando...</span>
                    </div>
                  ) : (
                    stat.value
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Atividades Recentes
            </CardTitle>
            <CardDescription>
              Últimas ações no sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'warning' ? 'bg-yellow-500' :
                  activity.status === 'info' ? 'bg-blue-500' : 'bg-gray-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Ações Rápidas
            </CardTitle>
            <CardDescription>
              Tarefas importantes que requerem atenção
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {actionsLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Carregando ações...</span>
              </div>
            ) : quickActions?.length > 0 ? (
              quickActions.map((action: any) => {
                const colors = colorClasses[action.color as keyof typeof colorClasses] || colorClasses.blue
                return (
                  <div key={action.id} className={`flex items-center justify-between p-3 ${colors.bg} rounded-lg`}>
                    <div>
                      <p className={`font-medium ${colors.text}`}>{action.title}</p>
                      <p className={`text-sm ${colors.textSecondary}`}>{action.description}</p>
                    </div>
                    <Badge variant={action.badgeVariant}>{action.badge}</Badge>
                  </div>
                )
              })
            ) : (
              <div className="flex items-center justify-center p-8 text-gray-500">
                <div className="text-center">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhuma ação requer atenção no momento</p>
                  <p className="text-xs text-gray-400 mt-1">Tudo está em dia! 🎉</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}