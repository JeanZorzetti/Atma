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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useCrmLeads } from '@/hooks/useApi'
import { useToast } from '@/hooks/use-toast'
import { apiService, type CrmLead } from '@/lib/api'
import { useState } from 'react'

export default function CrmAgendaPage() {
  const { data: crmData, loading, error, refetch } = useCrmLeads()
  const leads = crmData?.leads || []
  const { toast } = useToast()
  const [showNewFollowUpModal, setShowNewFollowUpModal] = useState(false)
  const [followUpForm, setFollowUpForm] = useState({
    leadId: '',
    datetime: '',
    notes: ''
  })

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

  // Funções de ação da agenda
  const handlePhoneCall = (lead: CrmLead) => {
    window.open(`tel:${lead.telefone}`, '_self')
    toast({
      title: 'Ligando...',
      description: `Iniciando chamada para ${lead.nome}`,
    })
  }

  const handleEmail = (lead: CrmLead) => {
    const subject = encodeURIComponent(`Follow-up - ${lead.nome}`)
    const body = encodeURIComponent(`Olá ${lead.nome},\n\nEspero que esteja bem!\n\nRetomando nossa conversa sobre a Atma Aligner...\n\n`)
    window.open(`mailto:${lead.email}?subject=${subject}&body=${body}`, '_blank')
    toast({
      title: 'Email aberto',
      description: `Redigindo follow-up para ${lead.nome}`,
    })
  }

  const handleCompleteFollowUp = async (lead: CrmLead) => {
    try {
      await apiService.updateLead(lead.id, {
        próximo_followup: '',
        observacoes_internas: (lead.observacoes_internas || '') + 
          `\n[${new Date().toLocaleDateString('pt-BR')}] Follow-up concluído.`
      })

      toast({
        title: 'Follow-up concluído!',
        description: `Ação para ${lead.nome} marcada como concluída.`,
      })

      await refetch()
    } catch {
      toast({
        title: 'Erro ao concluir',
        description: 'Não foi possível marcar o follow-up como concluído.',
        variant: 'destructive'
      })
    }
  }

  const handleRescheduleFollowUp = (lead: CrmLead) => {
    // Pré-preencher o formulário com o lead selecionado
    setFollowUpForm({
      leadId: lead.id.toString(),
      datetime: lead.próximo_followup || '',
      notes: 'Reagendamento de follow-up'
    })
    setShowNewFollowUpModal(true)
  }

  const handleCreateFollowUp = async () => {
    if (!followUpForm.leadId || !followUpForm.datetime) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, selecione um lead e data/hora.',
        variant: 'destructive'
      })
      return
    }

    try {
      const selectedLead = leads.find(l => l.id === parseInt(followUpForm.leadId))
      
      await apiService.updateLead(parseInt(followUpForm.leadId), {
        próximo_followup: followUpForm.datetime,
        observacoes_internas: selectedLead?.observacoes_internas 
          ? selectedLead.observacoes_internas + `\n[${new Date().toLocaleDateString('pt-BR')}] Follow-up agendado: ${followUpForm.notes}`
          : `[${new Date().toLocaleDateString('pt-BR')}] Follow-up agendado: ${followUpForm.notes}`
      })

      toast({
        title: 'Follow-up agendado!',
        description: `Ação agendada para ${selectedLead?.nome} em ${new Date(followUpForm.datetime).toLocaleString('pt-BR')}.`,
      })

      setShowNewFollowUpModal(false)
      setFollowUpForm({ leadId: '', datetime: '', notes: '' })
      await refetch()
    } catch {
      toast({
        title: 'Erro ao agendar',
        description: 'Não foi possível agendar o follow-up.',
        variant: 'destructive'
      })
    }
  }

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
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0 hover:bg-green-50 hover:text-green-600"
                onClick={() => handlePhoneCall(lead)}
                title={`Ligar para ${lead.telefone}`}
              >
                <Phone className="h-3 w-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => handleEmail(lead)}
                title={`Email para ${lead.email}`}
              >
                <Mail className="h-3 w-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0 hover:bg-orange-50 hover:text-orange-600"
                onClick={() => handleRescheduleFollowUp(lead)}
                title="Reagendar follow-up"
              >
                <Calendar className="h-3 w-3" />
              </Button>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-7 text-xs hover:bg-green-50 hover:text-green-600"
              onClick={() => handleCompleteFollowUp(lead)}
            >
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
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowNewFollowUpModal(true)}
        >
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
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            Todos ({leadsWithFollowUp.length})
          </TabsTrigger>
          <TabsTrigger value="overdue">
            Atrasados ({overdueLeads.length})
          </TabsTrigger>
          <TabsTrigger value="today">
            Hoje ({todayLeads.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Próximos ({upcomingLeads.length})
          </TabsTrigger>
        </TabsList>

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
      </Tabs>

      {/* Modal de Novo Follow-up */}
      <Dialog open={showNewFollowUpModal} onOpenChange={setShowNewFollowUpModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agendar Novo Follow-up</DialogTitle>
            <DialogDescription>
              Selecione um lead e defina quando deve ser o próximo contato.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lead-select">Lead</Label>
              <select
                id="lead-select"
                value={followUpForm.leadId}
                onChange={(e) => setFollowUpForm(prev => ({ 
                  ...prev, 
                  leadId: e.target.value 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Selecione um lead...</option>
                {leads.map(lead => (
                  <option key={lead.id} value={lead.id.toString()}>
                    {lead.nome} - {lead.clinica}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="follow-datetime">Data e Horário</Label>
              <Input
                id="follow-datetime"
                type="datetime-local"
                value={followUpForm.datetime}
                onChange={(e) => setFollowUpForm(prev => ({ 
                  ...prev, 
                  datetime: e.target.value 
                }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="follow-notes">Observações</Label>
              <textarea
                id="follow-notes"
                placeholder="Adicione detalhes sobre o follow-up (opcional)"
                value={followUpForm.notes}
                onChange={(e) => setFollowUpForm(prev => ({ 
                  ...prev, 
                  notes: e.target.value 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowNewFollowUpModal(false)
                  setFollowUpForm({ leadId: '', datetime: '', notes: '' })
                }}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleCreateFollowUp}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!followUpForm.leadId || !followUpForm.datetime}
              >
                Agendar Follow-up
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}