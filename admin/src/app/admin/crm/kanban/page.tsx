"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  ArrowLeft,
  Plus,
  MoreVertical,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Building,
  Stethoscope
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
  const [optimisticLeads, setOptimisticLeads] = useState<CrmLead[]>([])
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
  // Usar leads otimistas se disponíveis, senão usar leads do servidor
  const leads = optimisticLeads.length > 0 ? optimisticLeads : serverLeads
  const columns = getColumns(leads)
  
  // Sincronizar leads otimistas com leads do servidor quando atualizarem
  React.useEffect(() => {
    if (serverLeads.length > 0 && optimisticLeads.length === 0) {
      setOptimisticLeads(serverLeads)
    }
  }, [serverLeads, optimisticLeads.length])

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
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

    const originalStatus = draggedLead.status
    
    // 1. Atualização otimista - atualizar UI imediatamente
    setOptimisticLeads(currentLeads => 
      currentLeads.map(lead => 
        lead.id === draggedLead.id 
          ? { ...lead, status: newStatus as CrmLead['status'] }
          : lead
      )
    )

    // 2. Mostrar toast de carregamento
    toast({
      title: 'Movendo lead...',
      description: `Atualizando para ${getStatusLabel(newStatus)}.`,
    })

    try {
      // 3. Fazer request para o servidor
      await apiService.updateLeadStatus(draggedLead.id, newStatus)
      
      // 4. Toast de sucesso
      toast({
        title: 'Status atualizado!',
        description: `Lead movido para ${getStatusLabel(newStatus)}.`,
      })
      
      // 5. Sincronizar com servidor (opcional, para garantir consistência)
      await refetch()
      setOptimisticLeads([]) // Reset para usar dados do servidor
    } catch {
      // 6. Reverter em caso de erro
      setOptimisticLeads(currentLeads => 
        currentLeads.map(lead => 
          lead.id === draggedLead.id 
            ? { ...lead, status: originalStatus as CrmLead['status'] }
            : lead
        )
      )
      
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível mover o lead. Posição revertida.',
        variant: 'destructive'
      })
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
            <h1 className="text-3xl font-bold text-gray-900">Kanban Pipeline</h1>
            <p className="text-gray-600">Gerencie o funil de captação de ortodontistas</p>
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

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-80">
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
                className="space-y-3"
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
                      className={`bg-white shadow-sm hover:shadow-md transition-all cursor-move ${
                        draggedLead?.id === lead.id ? 'opacity-50 transform rotate-3' : ''
                      }`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead)}
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
                            <span className="text-xs text-gray-400">
                              {new Date(lead.created_at).toLocaleDateString('pt-BR')}
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