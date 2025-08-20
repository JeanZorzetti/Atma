"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, UserCheck, Calendar, TrendingUp, Activity, AlertCircle } from 'lucide-react'

const statsCards = [
  {
    title: 'Total de Pacientes',
    value: '1,234',
    change: '+12% este mês',
    icon: Users,
    color: 'text-blue-600'
  },
  {
    title: 'Ortodontistas Ativos',
    value: '56',
    change: '+3 novos',
    icon: UserCheck,
    color: 'text-green-600'
  },
  {
    title: 'Consultas Hoje',
    value: '28',
    change: '18 confirmadas',
    icon: Calendar,
    color: 'text-orange-600'
  },
  {
    title: 'Receita Mensal',
    value: 'R$ 45.890',
    change: '+8.2% vs mês anterior',
    icon: TrendingUp,
    color: 'text-purple-600'
  }
]

const recentActivities = [
  {
    id: 1,
    type: 'new_patient',
    message: 'Novo paciente cadastrado: Maria Silva',
    time: '2 min atrás',
    status: 'success'
  },
  {
    id: 2,
    type: 'appointment',
    message: 'Consulta agendada com Dr. João Santos',
    time: '15 min atrás',
    status: 'info'
  },
  {
    id: 3,
    type: 'payment',
    message: 'Pagamento recebido: R$ 2.500,00',
    time: '1h atrás',
    status: 'success'
  },
  {
    id: 4,
    type: 'alert',
    message: 'Consulta cancelada - necessário reagendar',
    time: '2h atrás',
    status: 'warning'
  }
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Bem-vindo ao painel administrativo da Atma Aligner</p>
      </div>

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
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
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
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium text-red-900">5 consultas pendentes</p>
                <p className="text-sm text-red-700">Necessário confirmar agendamentos</p>
              </div>
              <Badge variant="destructive">Urgente</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium text-yellow-900">12 pagamentos atrasados</p>
                <p className="text-sm text-yellow-700">Total: R$ 8.450,00</p>
              </div>
              <Badge variant="secondary">Atenção</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-blue-900">3 novos ortodontistas</p>
                <p className="text-sm text-blue-700">Aguardando aprovação de cadastro</p>
              </div>
              <Badge variant="outline">Novo</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}