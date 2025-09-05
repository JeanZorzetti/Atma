"use client"

import React, { useState, useOptimistic } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  ArrowLeft,
  Plus,
  MoreVertical,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Building,
  Stethoscope,
  Edit,
  Save,
  X
} from 'lucide-react'
import Link from 'next/link'
import { useCrmLeads } from '@/hooks/useApi'
import { CrmFilters } from '@/components/crm/filters'
import { NewLeadModal } from '@/components/crm/new-lead-modal'
import { apiService } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import type { CrmLead } from '@/lib/api'


const getColumns = (leads: CrmLead[]) => [
  { 
    id: 'prospeccao', 
    title: 'Prospecção', 
    color: 'bg-gray-100 border-gray-300',
    count: leads.filter(l => l.status === 'prospeccao').length,
    leads: leads.filter(l => l.status === 'prospeccao')
  },
  { 
    id: 'contato_inicial', 
    title: 'Contato Inicial', 
    color: 'bg-blue-50 border-blue-200',
    count: leads.filter(l => l.status === 'contato_inicial').length,
    leads: leads.filter(l => l.status === 'contato_inicial')
  },
  { 
    id: 'apresentacao', 
    title: 'Apresentação', 
    color: 'bg-yellow-50 border-yellow-200',
    count: leads.filter(l => l.status === 'apresentacao').length,
    leads: leads.filter(l => l.status === 'apresentacao')
  },
  { 
    id: 'negociacao', 
    title: 'Negociação', 
    color: 'bg-orange-50 border-orange-200',
    count: leads.filter(l => l.status === 'negociacao').length,
    leads: leads.filter(l => l.status === 'negociacao')
  },
  { 
    id: 'parceria_fechada', 
    title: 'Parceria Fechada', 
    color: 'bg-green-50 border-green-200',
    count: leads.filter(l => l.status === 'parceria_fechada').length,
    leads: leads.filter(l => l.status === 'parceria_fechada')
  }
]

export default function KanbanPage() {
  const [filters, setFilters] = useState({})
  const [showNewLeadModal, setShowNewLeadModal] = useState(false)
  const [draggedLead, setDraggedLead] = useState<CrmLead | null>(null)
  const [selectedLead, setSelectedLead] = useState<CrmLead | null>(null)
  const [showLeadModal, setShowLeadModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editFormData, setEditFormData] = useState<Partial<CrmLead>>({})
  const { toast } = useToast()
  
  const { data: crmData, loading, refetch } = useCrmLeads(
    1, 50, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (filters as any).status, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (filters as any).responsavel, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (filters as any).origem, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (filters as any).search
  )
  
  const serverLeads = React.useMemo(() => crmData?.leads || [], [crmData?.leads])
  
  // Use React 19's useOptimistic for real-time updates
  const [optimisticLeads, updateOptimisticLeads] = useOptimistic(
    serverLeads,
    (currentLeads, { leadId, newStatus }: { leadId: number, newStatus: CrmLead['status'] }) => {
      return currentLeads.map(lead => 
        lead.id === leadId 
          ? { ...lead, status: newStatus }
          : lead
      )
    }
  )
  
  const columns = getColumns(optimisticLeads)

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  // Funções de ação para os cards
  const handleCardClick = (lead: CrmLead) => {
    setSelectedLead(lead)
    setShowLeadModal(true)
    setIsEditing(false)
    setEditFormData({})
  }

  const handlePhoneCall = (lead: CrmLead) => {
    window.open(`tel:${lead.telefone}`, '_self')
    toast({
      title: 'Ligando...',
      description: `Iniciando chamada para ${lead.nome}`,
    })
  }

  const handleEmail = (lead: CrmLead) => {
    const subject = encodeURIComponent(`Atma Aligner - Contato ${lead.nome}`)
    const body = encodeURIComponent(`Olá ${lead.nome},\n\nEspero que esteja bem!\n\n`)
    window.open(`mailto:${lead.email}?subject=${subject}&body=${body}`, '_blank')
    toast({
      title: 'Email aberto',
      description: `Redigindo email para ${lead.nome}`,
    })
  }

  const handleSchedule = (lead: CrmLead) => {
    // Integração futura com sistema de agendamento
    toast({
      title: 'Agendar reunião',
      description: `Funcionalidade em desenvolvimento para ${lead.nome}`,
    })
  }

  // Funções de edição
  const handleEditClick = () => {
    if (selectedLead) {
      setEditFormData({
        nome: selectedLead.nome,
        email: selectedLead.email,
        telefone: selectedLead.telefone,
        clinica: selectedLead.clinica,
        cro: selectedLead.cro,
        cidade: selectedLead.cidade,
        estado: selectedLead.estado,
        consultórios: selectedLead.consultórios,
        casos_mes: selectedLead.casos_mes,
        status: selectedLead.status,
        responsavel_comercial: selectedLead.responsavel_comercial,
        interesse: selectedLead.interesse,
        observacoes_internas: selectedLead.observacoes_internas
      })
      setIsEditing(true)
    }
  }

  const handleSaveEdit = async () => {
    if (!selectedLead) return

    try {
      // Fazer request para atualizar o lead
      await apiService.updateLead(selectedLead.id, editFormData)
      
      toast({
        title: 'Lead atualizado!',
        description: `Informações de ${editFormData.nome} foram salvas.`,
      })
      
      // Atualizar a lista
      await refetch()
      setIsEditing(false)
      setShowLeadModal(false)
      
    } catch {
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível atualizar as informações do lead.',
        variant: 'destructive'
      })
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditFormData({})
  }

  // Funções de Drag & Drop
  const handleDragStart = (e: React.DragEvent, lead: CrmLead) => {
    setDraggedLead(lead)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    
    if (!draggedLead || draggedLead.status === newStatus) {
      setDraggedLead(null)
      return
    }

    // 1. Atualização otimista - atualizar UI imediatamente
    updateOptimisticLeads({ 
      leadId: draggedLead.id, 
      newStatus: newStatus as CrmLead['status'] 
    })

    // 2. Mostrar toast de carregamento
    toast({
      title: 'Movendo lead...',
      description: `Atualizando para ${getStatusLabel(newStatus)}.`,
    })

    try {
      // 3. Fazer request para o servidor (cache será invalidado automaticamente)
      await apiService.updateLeadStatus(draggedLead.id, newStatus)
      
      // 4. Toast de sucesso
      toast({
        title: 'Status atualizado!',
        description: `Lead movido para ${getStatusLabel(newStatus)}.`,
      })
      
      // 5. Forçar atualização dos dados do servidor
      await refetch()
      
    } catch {
      // 6. Em caso de erro, o useOptimistic automaticamente reverte 
      // quando os dados do servidor são recarregados
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível mover o lead. Tente novamente.',
        variant: 'destructive'
      })
      
      // Forçar um refetch para garantir que o estado volta ao normal
      await refetch()
    }
    
    setDraggedLead(null)
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      'prospeccao': 'Prospecção',
      'contato_inicial': 'Contato Inicial',
      'apresentacao': 'Apresentação',
      'negociacao': 'Negociação',
      'parceria_fechada': 'Parceria Fechada'
    }
    return labels[status as keyof typeof labels] || status
  }

  const getStatusColor = (status: string) => {
    const colors = {
      'prospeccao': 'bg-gray-100 text-gray-800',
      'contato_inicial': 'bg-blue-100 text-blue-800',
      'apresentacao': 'bg-yellow-100 text-yellow-800',
      'negociacao': 'bg-orange-100 text-orange-800',
      'parceria_fechada': 'bg-green-100 text-green-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getInterestBadge = (interesse: string) => {
    const badges = {
      'atma-aligner': { label: 'Aligner', color: 'bg-blue-100 text-blue-800' },
      'atma-labs': { label: 'Labs', color: 'bg-purple-100 text-purple-800' },
      'ambos': { label: 'Ambos', color: 'bg-green-100 text-green-800' }
    }
    const badge = badges[interesse as keyof typeof badges] || badges['atma-aligner']
    return <Badge className={`${badge.color} text-xs`}>{badge.label}</Badge>
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header responsivo */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <Link href="/admin/crm">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao CRM
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Kanban Pipeline</h1>
            <p className="text-sm sm:text-base text-gray-600">Gerencie o funil de captação de ortodontistas</p>
          </div>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
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

      {/* Kanban Board */}
      <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 min-h-[600px]">
        {columns.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-72 sm:w-80 min-w-[280px]">
            <Card className={`${column.color} border-2`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    {column.title}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {column.count}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent 
                className="space-y-3 min-h-[500px] max-h-[70vh] overflow-y-auto"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(2)].map((_, i) => (
                      <Card key={i} className="bg-white animate-pulse">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                                <div>
                                  <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                                </div>
                              </div>
                            </div>
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                            <div className="space-y-1">
                              <div className="h-3 bg-gray-200 rounded w-28"></div>
                              <div className="h-3 bg-gray-200 rounded w-24"></div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  column.leads?.map((lead) => (
                    <Card 
                      key={lead.id} 
                      className={`bg-white shadow-sm hover:shadow-md transition-all cursor-pointer ${
                        draggedLead?.id === lead.id ? 'opacity-50 transform rotate-3' : ''
                      }`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead)}
                      onClick={() => handleCardClick(lead)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Header do Card */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-blue-100 text-blue-800 text-sm font-semibold">
                                  {getInitials(lead.nome)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold text-sm">{lead.nome}</h3>
                                <p className="text-xs text-gray-600">{lead.cro}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Clínica */}
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Building className="h-4 w-4" />
                            <span className="truncate">{lead.clinica}</span>
                          </div>

                          {/* Perfil comercial */}
                          {(lead.consultórios || lead.casos_mes) && (
                            <div className="space-y-1">
                              {lead.consultórios && (
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <MapPin className="h-3 w-3" />
                                  <span>{lead.consultórios} consultórios</span>
                                </div>
                              )}
                              {lead.casos_mes && (
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Stethoscope className="h-3 w-3" />
                                  <span>{lead.casos_mes} casos/mês</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Tags */}
                          <div className="flex items-center gap-2">
                            {lead.interesse && getInterestBadge(lead.interesse)}
                            {lead.responsavel_comercial && (
                              <Badge variant="outline" className="text-xs">
                                {lead.responsavel_comercial}
                              </Badge>
                            )}
                          </div>

                          {/* Ações */}
                          <div className="flex items-center justify-between pt-2 border-t">
                            <div className="flex gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 w-7 p-0 hover:bg-green-50 hover:text-green-600"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handlePhoneCall(lead)
                                }}
                                title={`Ligar para ${lead.telefone}`}
                              >
                                <Phone className="h-3 w-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 w-7 p-0 hover:bg-blue-50 hover:text-blue-600"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEmail(lead)
                                }}
                                title={`Email para ${lead.email}`}
                              >
                                <Mail className="h-3 w-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 w-7 p-0 hover:bg-orange-50 hover:text-orange-600"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSchedule(lead)
                                }}
                                title="Agendar reunião"
                              >
                                <Calendar className="h-3 w-3" />
                              </Button>
                            </div>
                            <span className="text-xs text-gray-400">
                              {lead.created_at ? new Date(lead.created_at).toLocaleDateString('pt-BR') : 'Novo'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}

                {/* Placeholder para colunas vazias */}
                {!loading && column.count === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <div className="text-sm">Arraste cards aqui</div>
                  </div>
                )}

                {/* Botão para adicionar novo card */}
                <Button 
                  variant="ghost" 
                  className="w-full border-2 border-dashed border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-700"
                  size="sm"
                  onClick={() => setShowNewLeadModal(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Lead
                </Button>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Modal de Detalhes do Lead */}
      <Dialog open={showLeadModal} onOpenChange={setShowLeadModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedLead && (
                  <>
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-100 text-blue-800 text-sm font-semibold">
                        {getInitials(selectedLead.nome)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="text-xl">{selectedLead.nome}</span>
                      <p className="text-sm text-gray-600 font-normal">{selectedLead.cro}</p>
                    </div>
                  </>
                )}
              </div>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditClick}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveEdit}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Salvar
                  </Button>
                </div>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedLead && (
            <div className="space-y-6 mt-4">
              {/* Informações básicas */}
              {!isEditing ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900">Contato</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{selectedLead.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{selectedLead.telefone}</span>
                        </div>
                        {(selectedLead.cidade || selectedLead.estado) && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">
                              {selectedLead.cidade}{selectedLead.cidade && selectedLead.estado && ', '}{selectedLead.estado}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900">Clínica</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{selectedLead.clinica}</span>
                        </div>
                        {selectedLead.consultórios && (
                          <p className="text-sm text-gray-600">
                            <strong>Consultórios:</strong> {selectedLead.consultórios}
                          </p>
                        )}
                        {selectedLead.casos_mes && (
                          <p className="text-sm text-gray-600">
                            <strong>Casos/mês:</strong> {selectedLead.casos_mes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Observações internas - se existirem */}
                  {selectedLead.observacoes_internas && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900">Observações Internas</h3>
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {selectedLead.observacoes_internas}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Editar Informações</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome</Label>
                      <Input
                        id="nome"
                        value={editFormData.nome || ''}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, nome: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cro">CRO</Label>
                      <Input
                        id="cro"
                        value={editFormData.cro || ''}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, cro: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editFormData.email || ''}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        value={editFormData.telefone || ''}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, telefone: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clinica">Clínica</Label>
                      <Input
                        id="clinica"
                        value={editFormData.clinica || ''}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, clinica: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input
                        id="cidade"
                        value={editFormData.cidade || ''}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, cidade: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estado">Estado</Label>
                      <Input
                        id="estado"
                        value={editFormData.estado || ''}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, estado: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="consultorios">Consultórios</Label>
                      <Input
                        id="consultorios"
                        value={editFormData.consultórios || ''}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, consultórios: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="casos_mes">Casos/mês</Label>
                      <Input
                        id="casos_mes"
                        value={editFormData.casos_mes || ''}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, casos_mes: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        value={editFormData.status || ''}
                        onValueChange={(value) => setEditFormData(prev => ({ ...prev, status: value as CrmLead['status'] }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="prospeccao">Prospecção</SelectItem>
                          <SelectItem value="contato_inicial">Contato Inicial</SelectItem>
                          <SelectItem value="apresentacao">Apresentação</SelectItem>
                          <SelectItem value="negociacao">Negociação</SelectItem>
                          <SelectItem value="parceria_fechada">Parceria Fechada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="responsavel">Responsável Comercial</Label>
                      <Input
                        id="responsavel"
                        value={editFormData.responsavel_comercial || ''}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, responsavel_comercial: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  {/* Campo de observações em largura completa */}
                  <div className="space-y-2">
                    <Label htmlFor="observacoes">Observações Internas</Label>
                    <Textarea
                      id="observacoes"
                      placeholder="Adicione observações sobre este lead..."
                      value={editFormData.observacoes_internas || ''}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, observacoes_internas: e.target.value }))}
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Status e responsável - apenas no modo visualização */}
              {!isEditing && (
                <>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Badge className={getStatusColor(selectedLead.status)}>
                        {getStatusLabel(selectedLead.status)}
                      </Badge>
                      {selectedLead.responsavel_comercial && (
                        <p className="text-sm text-gray-600 mt-1">
                          Responsável: {selectedLead.responsavel_comercial}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Criado em {selectedLead.created_at ? new Date(selectedLead.created_at).toLocaleDateString('pt-BR') : 'Data não disponível'}
                      </p>
                    </div>
                  </div>

                  {/* Ações rápidas */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button 
                      className="flex-1"
                      onClick={() => {
                        handlePhoneCall(selectedLead)
                        setShowLeadModal(false)
                      }}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Ligar
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        handleEmail(selectedLead)
                        setShowLeadModal(false)
                      }}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        handleSchedule(selectedLead)
                        setShowLeadModal(false)
                      }}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Agendar
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Novo Lead */}
      <NewLeadModal 
        open={showNewLeadModal}
        onOpenChange={setShowNewLeadModal}
        onSuccess={() => {
          refetch() // Atualiza os leads
        }}
      />
    </div>
  )
}