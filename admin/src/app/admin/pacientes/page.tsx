"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Search, Plus, Edit, Eye, Filter, Loader2, AlertCircle, Trash2, Ban, X } from 'lucide-react'
import { usePatients } from '@/hooks/useApi'
import { apiService } from '@/lib/api'


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

export default function PacientesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cep: '',
    status: 'novo'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: patientsData, loading, error, refetch } = usePatients()
  const { toast } = useToast()

  const patients = patientsData?.patients || []
  const filteredPatients = patients.filter((patient: Patient) => {
    const matchesSearch = (patient.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (patient.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (patient.cpf && patient.cpf.includes(searchTerm))
    
    const matchesStatus = !statusFilter || statusFilter === 'all' || patient.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      cep: '',
      status: 'novo'
    })
  }

  // Handle create patient
  const handleCreatePatient = async () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Erro",
        description: "Nome e email são obrigatórios",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await apiService.createPatient({
        nome: formData.name,
        email: formData.email,
        telefone: formData.phone,
        cep: formData.cep,
        consentimento: true
      }) as { success: boolean }

      if (response.success) {
        toast({
          title: "Sucesso",
          description: "Paciente criado com sucesso"
        })
        setIsCreateDialogOpen(false)
        resetForm()
        refetch()
      }
    } catch (error: unknown) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao criar paciente",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle edit patient
  const handleEditPatient = async () => {
    if (!selectedPatient || !formData.name || !formData.email) {
      toast({
        title: "Erro",
        description: "Nome e email são obrigatórios",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await apiService.updatePatient(selectedPatient.id.toString(), {
        nome: formData.name,
        email: formData.email,
        telefone: formData.phone,
        cep: formData.cep,
        status: formData.status
      }) as { success: boolean }

      if (response.success) {
        toast({
          title: "Sucesso",
          description: "Paciente atualizado com sucesso"
        })
        setIsEditDialogOpen(false)
        resetForm()
        setSelectedPatient(null)
        refetch()
      }
    } catch (error: unknown) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao atualizar paciente",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle cancel patient
  const handleCancelPatient = async () => {
    if (!selectedPatient) return

    setIsSubmitting(true)
    try {
      const response = await apiService.cancelPatient(selectedPatient.id.toString()) as { success: boolean }

      if (response.success) {
        toast({
          title: "Sucesso",
          description: "Paciente cancelado com sucesso"
        })
        setIsCancelDialogOpen(false)
        setSelectedPatient(null)
        refetch()
      }
    } catch (error: unknown) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao cancelar paciente",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle delete patient
  const handleDeletePatient = async () => {
    if (!selectedPatient) return

    setIsSubmitting(true)
    try {
      const response = await apiService.deletePatient(selectedPatient.id.toString()) as { success: boolean }

      if (response.success) {
        toast({
          title: "Sucesso",
          description: "Paciente excluído permanentemente"
        })
        setIsDeleteDialogOpen(false)
        setSelectedPatient(null)
        refetch()
      }
    } catch (error: unknown) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao excluir paciente",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle view patient
  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient)
    setIsViewDialogOpen(true)
  }

  // Handle edit patient setup
  const handleEditPatientSetup = (patient: Patient) => {
    setSelectedPatient(patient)
    setFormData({
      name: patient.name,
      email: patient.email,
      phone: patient.phone || '',
      cep: '',
      status: patient.status
    })
    setIsEditDialogOpen(true)
  }

  // Handle cancel patient setup
  const handleCancelPatientSetup = (patient: Patient) => {
    setSelectedPatient(patient)
    setIsCancelDialogOpen(true)
  }

  // Handle delete patient setup
  const handleDeletePatientSetup = (patient: Patient) => {
    setSelectedPatient(patient)
    setIsDeleteDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'novo':
        return <Badge className="bg-blue-100 text-blue-800">Novo</Badge>
      case 'contatado':
        return <Badge className="bg-yellow-100 text-yellow-800">Contatado</Badge>
      case 'agendado':
        return <Badge className="bg-purple-100 text-purple-800">Agendado</Badge>
      case 'atribuido':
        return <Badge className="bg-green-100 text-green-800">Em Andamento</Badge>
      case 'convertido':
        return <Badge className="bg-emerald-100 text-emerald-800">Convertido</Badge>
      case 'cancelado':
        return <Badge className="bg-orange-100 text-orange-800">Cancelado</Badge>
      case 'excluido':
        return <Badge className="bg-red-100 text-red-800">Excluído</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-gray-600 mt-2">Gerencie os pacientes cadastrados no sistema</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => {
            resetForm()
            setIsCreateDialogOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Paciente
        </Button>
      </div>

      {/* Connection Status */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800">Erro ao carregar pacientes: {error}</span>
            <span className="text-sm text-red-600 ml-auto">Usando dados locais</span>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome, email ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button 
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
            {statusFilter && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setStatusFilter('')}
                className="text-red-600 hover:text-red-700"
              >
                <X className="mr-1 h-3 w-3" />
                Limpar filtros
              </Button>
            )}
          </div>
          
          {/* Filter Panel */}
          {isFilterOpen && (
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="novo">Novo</SelectItem>
                      <SelectItem value="contatado">Contatado</SelectItem>
                      <SelectItem value="agendado">Agendado</SelectItem>
                      <SelectItem value="atribuido">Em Andamento</SelectItem>
                      <SelectItem value="convertido">Convertido</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                      <SelectItem value="excluido">Excluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pacientes</CardTitle>
          <CardDescription>
            {filteredPatients.length} paciente(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Carregando pacientes...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Etapa do Tratamento</TableHead>
                  <TableHead>Ortodontista</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient: Patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>{patient.cpf || 'N/A'}</TableCell>
                    <TableCell>{getStatusBadge(patient.status)}</TableCell>
                    <TableCell>{patient.treatmentStage || 'N/A'}</TableCell>
                    <TableCell>{patient.orthodontist || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewPatient(patient)}
                          title="Visualizar paciente"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditPatientSetup(patient)}
                          title="Editar paciente"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {patient.status !== 'cancelado' && patient.status !== 'excluido' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleCancelPatientSetup(patient)}
                            title="Cancelar paciente"
                            className="text-orange-600 hover:text-orange-800 hover:bg-orange-50"
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeletePatientSetup(patient)}
                          title="Excluir permanentemente"
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Patient Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Paciente</DialogTitle>
            <DialogDescription>
              Preencha as informações básicas do paciente
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-name">Nome Completo *</Label>
              <Input 
                id="create-name" 
                placeholder="Digite o nome completo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-email">Email *</Label>
              <Input 
                id="create-email" 
                type="email" 
                placeholder="email@exemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-phone">Telefone</Label>
              <Input 
                id="create-phone" 
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-cep">CEP</Label>
              <Input 
                id="create-cep" 
                placeholder="00000-000"
                value={formData.cep}
                onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={handleCreatePatient}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Cadastrar
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Patient Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Paciente</DialogTitle>
            <DialogDescription>
              Atualize as informações do paciente
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome Completo *</Label>
              <Input 
                id="edit-name" 
                placeholder="Digite o nome completo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input 
                id="edit-email" 
                type="email" 
                placeholder="email@exemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Telefone</Label>
              <Input 
                id="edit-phone" 
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="novo">Novo</SelectItem>
                  <SelectItem value="contatado">Contatado</SelectItem>
                  <SelectItem value="agendado">Agendado</SelectItem>
                  <SelectItem value="atribuido">Em Andamento</SelectItem>
                  <SelectItem value="convertido">Convertido</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                  <SelectItem value="excluido">Excluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={handleEditPatient}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Salvar
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Patient Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Paciente</DialogTitle>
            <DialogDescription>
              Informações completas do paciente
            </DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Nome</Label>
                  <p className="text-sm text-gray-600">{selectedPatient.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedPatient.status)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-gray-600">{selectedPatient.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Telefone</Label>
                  <p className="text-sm text-gray-600">{selectedPatient.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Etapa do Tratamento</Label>
                  <p className="text-sm text-gray-600">{selectedPatient.treatmentStage || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Ortodontista</Label>
                  <p className="text-sm text-gray-600">{selectedPatient.orthodontist || 'Não atribuído'}</p>
                </div>
              </div>
              <div className="pt-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Patient Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cancelar Paciente</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar este paciente? O paciente ficará com status &quot;Cancelado&quot;.
            </DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4">
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <p className="font-medium text-orange-800">{selectedPatient.name}</p>
                    <p className="text-sm text-orange-600">{selectedPatient.email}</p>
                    <p className="text-xs text-orange-600">Status atual: {selectedPatient.status}</p>
                  </div>
                </CardContent>
              </Card>
              <div className="flex gap-2 pt-4">
                <Button 
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                  onClick={handleCancelPatient}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Cancelar Paciente
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsCancelDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Voltar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Patient Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir Paciente Permanentemente</DialogTitle>
            <DialogDescription>
              ⚠️ ATENÇÃO: Esta ação excluirá permanentemente o paciente do sistema. Esta operação NÃO pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4">
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <p className="font-medium text-red-800">{selectedPatient.name}</p>
                    <p className="text-sm text-red-600">{selectedPatient.email}</p>
                    <p className="text-xs text-red-600">Status: {selectedPatient.status}</p>
                  </div>
                </CardContent>
              </Card>
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="destructive"
                  className="flex-1"
                  onClick={handleDeletePatient}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Excluir
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  disabled={isSubmitting}
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