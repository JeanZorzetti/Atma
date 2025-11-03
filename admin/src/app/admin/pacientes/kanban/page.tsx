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
  DialogDescription,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ArrowLeft,
  MoreVertical,
  Phone,
  Mail,
  Calendar,
  MapPin,
  User,
  Edit,
  Trash2,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'
import { usePatients } from '@/hooks/useApi'
import { apiService } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

interface Patient {
  id: number
  name: string
  email: string
  phone?: string
  cpf?: string
  status: string
  treatmentStage?: string
  orthodontist?: string
  registrationDate?: string
}

const STATUS_COLORS = {
  'novo': 'bg-blue-100 text-blue-800 border-blue-200',
  'contatado': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'agendado': 'bg-purple-100 text-purple-800 border-purple-200',
  'avaliacao_inicial': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'atribuido': 'bg-orange-100 text-orange-800 border-orange-200', // Em tratamento
  'convertido': 'bg-green-100 text-green-800 border-green-200',
  'cancelado': 'bg-gray-100 text-gray-800 border-gray-200'
}

const getColumns = (patients: Patient[]) => [
  {
    id: 'novo',
    title: 'Novos',
    color: 'bg-blue-50 border-blue-200',
    count: patients.filter(p => p.status === 'novo').length,
    patients: patients.filter(p => p.status === 'novo')
  },
  {
    id: 'contatado',
    title: 'Contatados',
    color: 'bg-yellow-50 border-yellow-200',
    count: patients.filter(p => p.status === 'contatado').length,
    patients: patients.filter(p => p.status === 'contatado')
  },
  {
    id: 'agendado',
    title: 'Agendados',
    color: 'bg-purple-50 border-purple-200',
    count: patients.filter(p => p.status === 'agendado').length,
    patients: patients.filter(p => p.status === 'agendado')
  },
  {
    id: 'avaliacao_inicial',
    title: 'Avaliação Inicial',
    color: 'bg-indigo-50 border-indigo-200',
    count: 0, // Placeholder - adicionar quando tiver campo específico
    patients: []
  },
  {
    id: 'atribuido',
    title: 'Em Tratamento',
    color: 'bg-orange-50 border-orange-200',
    count: patients.filter(p => p.status === 'atribuido').length,
    patients: patients.filter(p => p.status === 'atribuido')
  },
  {
    id: 'convertido',
    title: 'Concluídos',
    color: 'bg-green-50 border-green-200',
    count: patients.filter(p => p.status === 'convertido').length,
    patients: patients.filter(p => p.status === 'convertido')
  }
]

export default function PacientesKanbanPage() {
  const [draggedPatient, setDraggedPatient] = useState<Patient | null>(null)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [showPatientModal, setShowPatientModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { toast } = useToast()

  const { data: patientsData, loading, refetch } = usePatients()

  const serverPatients = React.useMemo(() => patientsData?.patients || [], [patientsData?.patients])

  // Use React 19's useOptimistic for real-time updates
  const [optimisticPatients, updateOptimisticPatients] = useOptimistic(
    serverPatients,
    (currentPatients, { patientId, newStatus }: { patientId: number, newStatus: string }) => {
      return currentPatients.map(patient =>
        patient.id === patientId
          ? { ...patient, status: newStatus }
          : patient
      )
    }
  )

  const columns = getColumns(optimisticPatients)

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, patient: Patient) => {
    setDraggedPatient(patient)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault()

    if (!draggedPatient || draggedPatient.status === targetStatus) {
      setDraggedPatient(null)
      return
    }

    // Optimistic update
    updateOptimisticPatients({ patientId: draggedPatient.id, newStatus: targetStatus })

    try {
      // Update in backend
      await apiService.updatePatient(draggedPatient.id.toString(), {
        status: targetStatus
      })

      toast({
        title: 'Status atualizado',
        description: `Paciente movido para ${getStatusLabel(targetStatus)}`,
      })

      // Refetch to ensure consistency
      await refetch()
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar status do paciente',
        variant: 'destructive'
      })
      // Revert optimistic update on error
      await refetch()
    }

    setDraggedPatient(null)
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'novo': 'Novos',
      'contatado': 'Contatados',
      'agendado': 'Agendados',
      'avaliacao_inicial': 'Avaliação Inicial',
      'atribuido': 'Em Tratamento',
      'convertido': 'Concluídos',
      'cancelado': 'Cancelados'
    }
    return labels[status] || status
  }

  // Card actions
  const handleCardClick = (patient: Patient) => {
    setSelectedPatient(patient)
    setShowPatientModal(true)
  }

  const handlePhoneCall = (patient: Patient) => {
    if (patient.phone) {
      window.open(`tel:${patient.phone}`, '_self')
      toast({
        title: 'Ligando...',
        description: `Iniciando chamada para ${patient.name}`,
      })
    }
  }

  const handleEmail = (patient: Patient) => {
    const subject = encodeURIComponent(`Atma Aligner - Tratamento ${patient.name}`)
    const body = encodeURIComponent(`Olá ${patient.name},\n\nEspero que esteja bem!\n\n`)
    window.open(`mailto:${patient.email}?subject=${subject}&body=${body}`, '_blank')
    toast({
      title: 'Email aberto',
      description: `Redigindo email para ${patient.name}`,
    })
  }

  const handleDeletePatient = async () => {
    if (!selectedPatient) return

    try {
      await apiService.deletePatient(selectedPatient.id.toString())
      toast({
        title: 'Paciente excluído',
        description: 'Paciente removido do sistema',
      })
      setShowDeleteDialog(false)
      setShowPatientModal(false)
      refetch()
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir paciente',
        variant: 'destructive'
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kanban de Pacientes</h1>
            <p className="text-gray-600 mt-2">Carregando...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/pacientes">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para CRM
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Kanban de Pacientes</h1>
          <p className="text-gray-600 mt-2">
            Arraste e solte os pacientes entre as colunas para atualizar seu status
          </p>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`min-w-[280px] rounded-lg border-2 ${column.color} p-4`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">{column.title}</h3>
              <Badge variant="secondary" className="text-xs">
                {column.count}
              </Badge>
            </div>

            <div className="space-y-3 min-h-[200px]">
              {column.patients.map((patient) => (
                <Card
                  key={patient.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, patient)}
                  className="cursor-move hover:shadow-md transition-shadow"
                  onClick={() => handleCardClick(patient)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                            {getInitials(patient.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{patient.name}</p>
                          <p className="text-xs text-gray-500 truncate">{patient.email}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            handlePhoneCall(patient)
                          }}>
                            <Phone className="mr-2 h-4 w-4" />
                            Ligar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            handleEmail(patient)
                          }}>
                            <Mail className="mr-2 h-4 w-4" />
                            Enviar Email
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            setSelectedPatient(patient)
                            setShowDeleteDialog(true)
                          }} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {patient.phone && (
                      <div className="flex items-center text-xs text-gray-600 mb-1">
                        <Phone className="h-3 w-3 mr-1" />
                        {patient.phone}
                      </div>
                    )}

                    {patient.orthodontist && (
                      <div className="flex items-center text-xs text-gray-600">
                        <User className="h-3 w-3 mr-1" />
                        {patient.orthodontist}
                      </div>
                    )}

                    {patient.cpf && (
                      <div className="text-xs text-gray-500 mt-2">
                        CPF: {patient.cpf}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {column.patients.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Nenhum paciente
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Patient Detail Modal */}
      <Dialog open={showPatientModal} onOpenChange={setShowPatientModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Paciente</DialogTitle>
            <DialogDescription>
              Informações completas do paciente
            </DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {getInitials(selectedPatient.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedPatient.name}</h3>
                    <p className="text-sm text-gray-600">{selectedPatient.email}</p>
                  </div>
                </div>
                <Badge className={STATUS_COLORS[selectedPatient.status as keyof typeof STATUS_COLORS]}>
                  {getStatusLabel(selectedPatient.status)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                {selectedPatient.phone && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Telefone</p>
                    <p className="text-sm font-medium">{selectedPatient.phone}</p>
                  </div>
                )}
                {selectedPatient.cpf && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">CPF</p>
                    <p className="text-sm font-medium">{selectedPatient.cpf}</p>
                  </div>
                )}
                {selectedPatient.orthodontist && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Ortodontista</p>
                    <p className="text-sm font-medium">{selectedPatient.orthodontist}</p>
                  </div>
                )}
                {selectedPatient.treatmentStage && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Etapa do Tratamento</p>
                    <p className="text-sm font-medium">{selectedPatient.treatmentStage}</p>
                  </div>
                )}
                {selectedPatient.registrationDate && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Data de Cadastro</p>
                    <p className="text-sm font-medium">
                      {new Date(selectedPatient.registrationDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={() => handlePhoneCall(selectedPatient)} className="flex-1">
                  <Phone className="mr-2 h-4 w-4" />
                  Ligar
                </Button>
                <Button onClick={() => handleEmail(selectedPatient)} variant="outline" className="flex-1">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Button>
                <Link href={`/admin/pacientes/lista`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Excluir Paciente
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-medium">{selectedPatient.name}</p>
                <p className="text-sm text-gray-600">{selectedPatient.email}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={handleDeletePatient}
                  className="flex-1"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
