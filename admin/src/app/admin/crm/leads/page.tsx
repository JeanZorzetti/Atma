"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  ArrowLeft,
  Plus,
  Phone,
  Mail,
  Calendar,
  Building,
  Eye,
  Edit,
  MoreHorizontal
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { CrmFilters } from '@/components/crm/filters'
import { NewLeadModal } from '@/components/crm/new-lead-modal'
import { apiService } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

export default function CrmLeadsListPage() {
  const [filters, setFilters] = useState({})
  const [showNewLeadModal, setShowNewLeadModal] = useState(false)
  const [showFollowUpModal, setShowFollowUpModal] = useState(false)
  const [selectedLeadForFollowUp, setSelectedLeadForFollowUp] = useState<unknown>(null)
  const [followUpForm, setFollowUpForm] = useState({
    leadId: '',
    datetime: '',
    notes: ''
  })
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 20
  const { toast } = useToast()
  
  const { data: crmData, loading, refetch } = useCrmLeads(
    currentPage, pageSize,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (filters as any).status,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (filters as any).responsavel,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (filters as any).origem,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (filters as any).search
  )
  
  const leads = crmData?.leads || []
  const totalPages = crmData?.pagination?.totalPages || 1
  const total = crmData?.total || 0

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
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

  const getInterestBadge = (interesse: string) => {
    const badges = {
      'atma-aligner': { label: 'Aligner', color: 'bg-blue-100 text-blue-800' },
      'atma-labs': { label: 'Labs', color: 'bg-purple-100 text-purple-800' },
      'ambos': { label: 'Ambos', color: 'bg-green-100 text-green-800' }
    }
    const badge = badges[interesse as keyof typeof badges]
    return badge ? (
      <Badge variant="outline" className={badge.color}>
        {badge.label}
      </Badge>
    ) : null
  }

  const handleStatusChange = async (leadId: number, newStatus: string) => {
    try {
      await apiService.updateLeadStatus(leadId, newStatus)
      toast({
        title: 'Status atualizado!',
        description: 'O status do lead foi atualizado com sucesso.',
      })
      refetch()
    } catch {
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível atualizar o status do lead.',
        variant: 'destructive'
      })
    }
  }

  const handleScheduleFollowUp = (lead: unknown) => {
    const leadData = lead as { 
      id: number; 
      nome?: string; 
      próximo_followup?: string;
      observacoes_internas?: string;
    }
    setSelectedLeadForFollowUp(lead)
    setFollowUpForm({
      leadId: leadData.id.toString(),
      datetime: leadData.próximo_followup || '',
      notes: leadData.próximo_followup ? 'Reagendamento de follow-up' : 'Novo follow-up agendado'
    })
    setShowFollowUpModal(true)
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
      const selectedLead = selectedLeadForFollowUp as {
        nome?: string;
        observacoes_internas?: string;
      } | null

      await apiService.updateLead(parseInt(followUpForm.leadId), {
        próximo_followup: followUpForm.datetime,
        observacoes_internas: selectedLead?.observacoes_internas 
          ? selectedLead.observacoes_internas + `\n[${new Date().toLocaleDateString('pt-BR')}] Follow-up agendado: ${followUpForm.notes}`
          : `[${new Date().toLocaleDateString('pt-BR')}] Follow-up agendado: ${followUpForm.notes}`
      })

      toast({
        title: 'Follow-up agendado!',
        description: `Ação agendada para ${selectedLead?.nome || 'lead'} em ${new Date(followUpForm.datetime).toLocaleString('pt-BR')}.`,
      })

      setShowFollowUpModal(false)
      setFollowUpForm({ leadId: '', datetime: '', notes: '' })
      setSelectedLeadForFollowUp(null)
      await refetch()
    } catch {
      toast({
        title: 'Erro ao agendar',
        description: 'Não foi possível agendar o follow-up.',
        variant: 'destructive'
      })
    }
  }

  if (loading && leads.length === 0) {
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
              <h1 className="text-3xl font-bold text-gray-900">Lista de Leads</h1>
              <p className="text-gray-600">Visualização em tabela com busca avançada</p>
            </div>
          </div>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 animate-pulse">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (false) {
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
              <h1 className="text-3xl font-bold text-gray-900">Lista de Leads</h1>
              <p className="text-gray-600">Visualização em tabela com busca avançada</p>
            </div>
          </div>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">Erro ao carregar leads</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Lista de Leads</h1>
            <p className="text-gray-600">
              {total} leads encontrados
            </p>
          </div>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowNewLeadModal(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Lead
        </Button>
      </div>

      {/* Filtros */}
      <CrmFilters 
        activeFilters={filters}
        onFiltersChange={setFilters}
      />

      {/* Tabela de Leads */}
      <Card>
        <CardHeader>
          <CardTitle>Leads CRM</CardTitle>
          <CardDescription>
            Lista completa de ortodontistas no pipeline de vendas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ortodontista</TableHead>
                  <TableHead>Clínica</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Interesse</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      <div className="text-center">
                        <Building className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium">Nenhum lead encontrado</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Tente ajustar os filtros ou criar um novo lead.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-blue-100 text-blue-800 text-xs font-semibold">
                              {getInitials(lead.nome)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{lead.nome}</div>
                            <div className="text-sm text-gray-500">{lead.cro}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{lead.clinica}</div>
                          {(lead.cidade || lead.estado) && (
                            <div className="text-sm text-gray-500">
                              {[lead.cidade, lead.estado].filter(Boolean).join(', ')}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(lead.status)}
                      </TableCell>
                      <TableCell>
                        {lead.interesse ? getInterestBadge(lead.interesse) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {lead.responsavel_comercial || (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {lead.origem_lead || 'outbound'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Phone className="mr-2 h-4 w-4" />
                              Ligar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Enviar email
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleScheduleFollowUp(lead)}>
                              <Calendar className="mr-2 h-4 w-4" />
                              Agendar follow-up
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Mudar Status</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleStatusChange(lead.id, 'prospeccao')}>
                              Prospecção
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(lead.id, 'contato_inicial')}>
                              Contato Inicial
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(lead.id, 'apresentacao')}>
                              Apresentação
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(lead.id, 'negociacao')}>
                              Negociação
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-gray-500">
                Página {currentPage} de {totalPages} ({total} leads no total)
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Novo Lead */}
      <NewLeadModal 
        open={showNewLeadModal}
        onOpenChange={setShowNewLeadModal}
        onSuccess={() => {
          refetch()
        }}
      />

      {/* Modal de Follow-up */}
      <Dialog open={showFollowUpModal} onOpenChange={setShowFollowUpModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agendar Follow-up</DialogTitle>
            <DialogDescription>
              Agende um follow-up para {(selectedLeadForFollowUp as { nome?: string } | null)?.nome || 'este lead'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="datetime">Data e Hora</Label>
              <Input
                id="datetime"
                type="datetime-local"
                value={followUpForm.datetime}
                onChange={(e) => setFollowUpForm(prev => ({ ...prev, datetime: e.target.value }))}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Observações</Label>
              <Input
                id="notes"
                value={followUpForm.notes}
                onChange={(e) => setFollowUpForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Adicione observações sobre este follow-up..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowFollowUpModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateFollowUp} className="bg-blue-600 hover:bg-blue-700">
              Agendar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}