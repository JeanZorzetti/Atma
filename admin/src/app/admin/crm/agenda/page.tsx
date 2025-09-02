"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  ArrowLeft,
  Plus,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { useCrmLeads } from '@/hooks/useApi'
import type { CrmLead } from '@/lib/api'

export default function CrmAgendaPage() {
  const { data: crmData, loading, error } = useCrmLeads()
  const leads = crmData?.leads || []

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  // Filtrar leads que precisam de follow-up
  const leadsWithFollowUp = leads.filter(lead => lead.próximo_followup)
  const overdueLeads = leads.filter(lead => {
    if (!lead.próximo_followup) return false
    return new Date(lead.próximo_followup) < new Date()
  })
  const todayLeads = leads.filter(lead => {
    if (!lead.próximo_followup) return false
    const today = new Date().toDateString()
    return new Date(lead.próximo_followup).toDateString() === today
  })
  const upcomingLeads = leads.filter(lead => {
    if (!lead.próximo_followup) return false
    const followUpDate = new Date(lead.próximo_followup)
    const today = new Date()
    const oneWeekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    return followUpDate > today && followUpDate <= oneWeekFromNow
  })

  const getStatusBadge = (status: string) => {
    const badges = {
      'prospeccao': { label: 'Prospecção', color: 'bg-gray-100 text-gray-800' },
      'contato_inicial': { label: 'Contato', color: 'bg-blue-100 text-blue-800' },
      'apresentacao': { label: 'Apresentação', color: 'bg-yellow-100 text-yellow-800' },
      'negociacao': { label: 'Negociação', color: 'bg-orange-100 text-orange-800' }
    }
    const badge = badges[status as keyof typeof badges] || badges['prospeccao']
    return (
      <Badge variant="secondary" className={badge.color}>
        {badge.label}
      </Badge>
    )
  }

  const FollowUpCard = ({ lead, priority }: { lead: CrmLead, priority?: 'overdue' | 'today' | 'upcoming' }) => {
    const priorityConfig = {
      overdue: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50 border-red-200' },
      today: { icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50 border-orange-200' },
      upcoming: { icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-200' }
    }

    const config = priority ? priorityConfig[priority] : { icon: Calendar, color: 'text-gray-500', bg: 'bg-gray-50' }
    const Icon = config.icon

    return (
      <Card className={`${config.bg} border-2`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-white text-gray-800 text-sm font-semibold">
                  {getInitials(lead.nome)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm">{lead.nome}</h3>
                <p className="text-xs text-gray-600">{lead.clinica}</p>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusBadge(lead.status)}
                  {lead.responsavel_comercial && (
                    <Badge variant="outline" className="text-xs">
                      {lead.responsavel_comercial}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm">
                <Icon className={`h-4 w-4 ${config.color}`} />
                <span className={config.color}>
                  {lead.próximo_followup ? 
                    new Date(lead.próximo_followup).toLocaleDateString('pt-BR', { 
                      day: '2-digit', 
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : '-'
                  }
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t mt-3">
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <Phone className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <Mail className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <Calendar className="h-3 w-3" />
              </Button>
            </div>
            <Button size="sm" variant="outline" className="h-7 text-xs">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Concluir
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/crm">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao CRM
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Agenda de Follow-up</h1>
              <p className="text-gray-600">Próximas ações e lembretes</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
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
          <div className="flex items-center gap-4">
            <Link href="/admin/crm">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao CRM
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Agenda de Follow-up</h1>
              <p className="text-gray-600">Próximas ações e lembretes</p>
            </div>
          </div>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">Erro ao carregar agenda: {error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/crm">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao CRM
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Agenda de Follow-up</h1>
            <p className="text-gray-600">
              {leadsWithFollowUp.length} ações agendadas
            </p>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Novo Follow-up
        </Button>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Atrasados</p>
                <p className="text-2xl font-bold text-red-600">{overdueLeads.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Hoje</p>
                <p className="text-2xl font-bold text-orange-600">{todayLeads.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Próximos 7 dias</p>
                <p className="text-2xl font-bold text-blue-600">{upcomingLeads.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <User className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Total</p>
                <p className="text-2xl font-bold text-green-600">{leadsWithFollowUp.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs da agenda */}
      <Tabs defaultValue="overdue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overdue">
            Atrasados ({overdueLeads.length})
          </TabsTrigger>
          <TabsTrigger value="today">
            Hoje ({todayLeads.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Próximos ({upcomingLeads.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            Todos ({leadsWithFollowUp.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overdue" className="space-y-4">
          {overdueLeads.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-green-400" />
                  <h3 className="mt-2 text-sm font-medium">Nenhum follow-up atrasado</h3>
                  <p className="mt-1 text-sm text-gray-500">Parabéns! Você está em dia com todos os follow-ups.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {overdueLeads.map(lead => (
                <FollowUpCard key={lead.id} lead={lead} priority="overdue" />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="today" className="space-y-4">
          {todayLeads.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium">Nenhum follow-up para hoje</h3>
                  <p className="mt-1 text-sm text-gray-500">Você não tem ações agendadas para hoje.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todayLeads.map(lead => (
                <FollowUpCard key={lead.id} lead={lead} priority="today" />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingLeads.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium">Nenhum follow-up próximo</h3>
                  <p className="mt-1 text-sm text-gray-500">Você não tem ações agendadas para os próximos 7 dias.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingLeads.map(lead => (
                <FollowUpCard key={lead.id} lead={lead} priority="upcoming" />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {leadsWithFollowUp.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium">Nenhum follow-up agendado</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Comece agendando follow-ups com seus leads para manter o pipeline ativo.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {leadsWithFollowUp.map(lead => (
                <FollowUpCard key={lead.id} lead={lead} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}