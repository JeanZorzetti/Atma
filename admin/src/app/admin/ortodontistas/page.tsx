"use client" // trigger redeploy

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Search, Plus, Edit, Eye, Filter, MapPin, Star, Loader2, AlertCircle, Trash2 } from 'lucide-react'
import { useOrthodontists } from '@/hooks/useApi'
import { Orthodontist, apiService } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const mockOrthodontists: Orthodontist[] = [
  {
    id: 1,
    name: 'Dr. João Santos',
    email: 'joao@email.com',
    phone: '(11) 99999-9999',
    cro: 'CRO-SP 12345',
    specialty: 'Ortodontia',
    city: 'São Paulo',
    state: 'SP',
    status: 'Ativo',
    patientsCount: 45,
    rating: 4.8,
    registrationDate: '2024-01-10',
    partnershipModel: 'Premium'
  },
  {
    id: 2,
    name: 'Dra. Ana Costa',
    email: 'ana@email.com',
    phone: '(11) 88888-8888',
    cro: 'CRO-SP 67890',
    specialty: 'Ortodontia e Ortopedia',
    city: 'Campinas',
    state: 'SP',
    status: 'Ativo',
    patientsCount: 32,
    rating: 4.9,
    registrationDate: '2024-02-15',
    partnershipModel: 'Standard'
  },
  {
    id: 3,
    name: 'Dr. Carlos Lima',
    email: 'carlos@email.com',
    phone: '(21) 77777-7777',
    cro: 'CRO-RJ 54321',
    specialty: 'Ortodontia',
    city: 'Rio de Janeiro',
    state: 'RJ',
    status: 'Pendente',
    patientsCount: 0,
    rating: 0,
    registrationDate: '2024-03-01',
    partnershipModel: 'Standard'
  }
]

export default function OrtodontistasPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedOrthodontist, setSelectedOrthodontist] = useState<Orthodontist | null>(null)
  const [formData, setFormData] = useState({
    nome: '',
    clinica: '',
    cro: '',
    email: '',
    telefone: '',
    celular: '',
    endereco_completo: '',
    cep: '',
    cidade: '',
    estado: '',
    modelo_parceria: 'atma-aligner',
    tem_scanner: false,
    scanner_marca: '',
    capacidade_mensal: 10
  })
  
  const { data: orthodontistsData, loading, error, refetch } = useOrthodontists()
  const { toast } = useToast()

  const orthodontists = orthodontistsData?.orthodontists || mockOrthodontists

  const filteredOrthodontists = orthodontists.filter((orthodontist: Orthodontist) =>
    (orthodontist.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (orthodontist.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (orthodontist.cro?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (orthodontist.city?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ativo':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>
      case 'Pendente':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
      case 'Inativo':
        return <Badge className="bg-red-100 text-red-800">Inativo</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPartnershipBadge = (model: string) => {
    switch (model) {
      case 'Premium':
        return <Badge className="bg-purple-100 text-purple-800">Premium</Badge>
      case 'Standard':
        return <Badge className="bg-blue-100 text-blue-800">Standard</Badge>
      default:
        return <Badge variant="secondary">{model}</Badge>
    }
  }

  const handleViewOrthodontist = (orthodontist: Orthodontist) => {
    setSelectedOrthodontist(orthodontist)
    setIsViewModalOpen(true)
  }

  const handleEditOrthodontist = (orthodontist: Orthodontist) => {
    setSelectedOrthodontist(orthodontist)
    setFormData({
      nome: orthodontist.name,
      clinica: '',
      cro: orthodontist.cro,
      email: orthodontist.email,
      telefone: orthodontist.phone,
      celular: '',
      endereco_completo: '',
      cep: '',
      cidade: orthodontist.city,
      estado: orthodontist.state,
      modelo_parceria: orthodontist.partnershipModel === 'Premium' ? 'premium' : 'atma-aligner',
      tem_scanner: false,
      scanner_marca: '',
      capacidade_mensal: 10
    })
    setIsEditModalOpen(true)
  }

  const handleUpdateOrthodontist = async () => {
    if (!selectedOrthodontist) return
    
    try {
      setIsSubmitting(true)
      
      // Validar campos obrigatórios
      if (!formData.nome || !formData.email || !formData.cro) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha nome, email e CRO",
          variant: "destructive"
        })
        return
      }

      await apiService.updateOrthodontist(selectedOrthodontist.id.toString(), formData)
      
      toast({
        title: "Ortodontista atualizado!",
        description: "As alterações foram salvas com sucesso"
      })

      // Fechar modal e recarregar dados
      setIsEditModalOpen(false)
      setSelectedOrthodontist(null)
      refetch()

    } catch {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível salvar as alterações",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteOrthodontist = (orthodontist: Orthodontist) => {
    setSelectedOrthodontist(orthodontist)
    setIsDeleteModalOpen(true)
  }

  const confirmDeleteOrthodontist = async () => {
    if (!selectedOrthodontist) return
    
    try {
      setIsSubmitting(true)

      await apiService.deleteOrthodontist(selectedOrthodontist.id.toString())
      
      toast({
        title: "Ortodontista excluído!",
        description: "O ortodontista foi removido permanentemente com sucesso"
      })

      // Fechar modal e recarregar dados
      setIsDeleteModalOpen(false)
      setSelectedOrthodontist(null)
      refetch()

    } catch {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível remover o ortodontista",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const activeOrthodontists = orthodontists.filter((o: Orthodontist) => o.status === 'Ativo').length
  const averageRating = orthodontists.length > 0
    ? (orthodontists.reduce((acc: number, o: Orthodontist) => acc + o.rating, 0) / orthodontists.length).toFixed(1)
    : '0.0'

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      
      // Validar campos obrigatórios
      if (!formData.nome || !formData.email || !formData.cro) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha nome, email e CRO",
          variant: "destructive"
        })
        return
      }

      await apiService.createOrthodontist(formData)
      
      toast({
        title: "Ortodontista cadastrado!",
        description: "O ortodontista foi adicionado com sucesso"
      })

      // Resetar formulário e fechar modal
      setFormData({
        nome: '',
        clinica: '',
        cro: '',
        email: '',
        telefone: '',
        celular: '',
        endereco_completo: '',
        cep: '',
        cidade: '',
        estado: '',
        modelo_parceria: 'atma-aligner',
        tem_scanner: false,
        scanner_marca: '',
        capacidade_mensal: 10
      })
      setIsModalOpen(false)
      
      // Recarregar lista
      refetch()
      
    } catch (error: unknown) {
      let errorMessage = "Não foi possível cadastrar o ortodontista"
      
      if (error instanceof Error) {
        // Se for erro 409 (conflito), mostrar mensagem específica
        if (error.message.includes("409") || error.message.includes("duplicado") || error.message.includes("Registro duplicado")) {
          errorMessage = "CRO ou email já cadastrado. Verifique se este ortodontista já existe no sistema."
        } else {
          errorMessage = error.message
        }
      }
      
      toast({
        title: "Erro ao cadastrar",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ortodontistas</h1>
          <p className="text-gray-600 mt-2">Gerencie os ortodontistas parceiros da Atma</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Novo Ortodontista
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Ortodontista</DialogTitle>
              <DialogDescription>
                Preencha as informações do profissional parceiro
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input 
                    id="nome" 
                    placeholder="Dr. Nome Sobrenome" 
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinica">Nome da Clínica</Label>
                  <Input 
                    id="clinica" 
                    placeholder="Clínica Exemplo" 
                    value={formData.clinica}
                    onChange={(e) => handleInputChange('clinica', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cro">CRO *</Label>
                  <Input 
                    id="cro" 
                    placeholder="CRO-SP 12345" 
                    value={formData.cro}
                    onChange={(e) => handleInputChange('cro', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="email@exemplo.com" 
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input 
                    id="telefone" 
                    placeholder="(11) 3333-4444" 
                    value={formData.telefone}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="celular">Celular</Label>
                  <Input 
                    id="celular" 
                    placeholder="(11) 99999-9999" 
                    value={formData.celular}
                    onChange={(e) => handleInputChange('celular', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="modelo_parceria">Modelo de Parceria</Label>
                  <Select value={formData.modelo_parceria} onValueChange={(value) => handleInputChange('modelo_parceria', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="atma-aligner">Atma Aligner</SelectItem>
                      <SelectItem value="atma-labs">Atma Labs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Endereço */}
              <div className="space-y-2">
                <Label htmlFor="endereco_completo">Endereço Completo</Label>
                <Textarea 
                  id="endereco_completo" 
                  placeholder="Rua, número, bairro" 
                  value={formData.endereco_completo}
                  onChange={(e) => handleInputChange('endereco_completo', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input 
                    id="cep" 
                    placeholder="12345-678" 
                    value={formData.cep}
                    onChange={(e) => handleInputChange('cep', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input 
                    id="cidade" 
                    placeholder="São Paulo" 
                    value={formData.cidade}
                    onChange={(e) => handleInputChange('cidade', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select value={formData.estado} onValueChange={(value) => handleInputChange('estado', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SP">SP</SelectItem>
                      <SelectItem value="RJ">RJ</SelectItem>
                      <SelectItem value="MG">MG</SelectItem>
                      <SelectItem value="RS">RS</SelectItem>
                      <SelectItem value="PR">PR</SelectItem>
                      <SelectItem value="SC">SC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Configurações Técnicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacidade_mensal">Capacidade Mensal (casos)</Label>
                  <Input 
                    id="capacidade_mensal" 
                    type="number" 
                    min="1"
                    max="100"
                    value={formData.capacidade_mensal}
                    onChange={(e) => handleInputChange('capacidade_mensal', parseInt(e.target.value) || 10)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scanner_marca">Marca do Scanner (opcional)</Label>
                  <Input 
                    id="scanner_marca" 
                    placeholder="iTero, 3Shape, etc." 
                    value={formData.scanner_marca}
                    onChange={(e) => handleInputChange('scanner_marca', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cadastrando...
                    </>
                  ) : (
                    'Cadastrar'
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Visualização */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes do Ortodontista</DialogTitle>
              <DialogDescription>
                Visualize as informações completas do ortodontista
              </DialogDescription>
            </DialogHeader>
            {selectedOrthodontist && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Nome</Label>
                    <div className="mt-1 text-sm">{selectedOrthodontist.name}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Email</Label>
                    <div className="mt-1 text-sm">{selectedOrthodontist.email}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Telefone</Label>
                    <div className="mt-1 text-sm">{selectedOrthodontist.phone}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">CRO</Label>
                    <div className="mt-1 text-sm">{selectedOrthodontist.cro}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Cidade</Label>
                    <div className="mt-1 text-sm">{selectedOrthodontist.city}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Estado</Label>
                    <div className="mt-1 text-sm">{selectedOrthodontist.state}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedOrthodontist.status)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Modelo de Parceria</Label>
                    <div className="mt-1">{getPartnershipBadge(selectedOrthodontist.partnershipModel)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Pacientes</Label>
                    <div className="mt-1 text-sm">{selectedOrthodontist.patientsCount}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Avaliação</Label>
                    <div className="mt-1 flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm">{selectedOrthodontist.rating}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Data de Cadastro</Label>
                    <div className="mt-1 text-sm">{selectedOrthodontist.registrationDate}</div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => setIsViewModalOpen(false)}>
                    Fechar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal de Edição */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Ortodontista</DialogTitle>
              <DialogDescription>
                Atualize as informações do ortodontista
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-nome">Nome *</Label>
                  <Input
                    id="edit-nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    placeholder="Nome completo"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-telefone">Telefone</Label>
                  <Input
                    id="edit-telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    placeholder="(11) 3333-4444"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-celular">Celular</Label>
                  <Input
                    id="edit-celular"
                    value={formData.celular}
                    onChange={(e) => setFormData({...formData, celular: e.target.value})}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-cro">CRO *</Label>
                  <Input
                    id="edit-cro"
                    value={formData.cro}
                    onChange={(e) => setFormData({...formData, cro: e.target.value})}
                    placeholder="CRO-SP 12345"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-cidade">Cidade</Label>
                  <Input
                    id="edit-cidade"
                    value={formData.cidade}
                    onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                    placeholder="São Paulo"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-estado">Estado</Label>
                  <Select value={formData.estado} onValueChange={(value) => setFormData({...formData, estado: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SP">São Paulo</SelectItem>
                      <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                      <SelectItem value="MG">Minas Gerais</SelectItem>
                      <SelectItem value="GO">Goiás</SelectItem>
                      <SelectItem value="PR">Paraná</SelectItem>
                      <SelectItem value="SC">Santa Catarina</SelectItem>
                      <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  className="flex-1" 
                  onClick={handleUpdateOrthodontist}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar Alterações'
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Confirmação de Exclusão */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Esta ação não pode ser desfeita. O ortodontista será removido permanentemente do sistema.
              </DialogDescription>
            </DialogHeader>
            {selectedOrthodontist && (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium text-red-800">Excluir Ortodontista</p>
                      <p className="text-sm text-red-600 mt-1">
                        <strong>{selectedOrthodontist.name}</strong>
                        <br />
                        {selectedOrthodontist.email} • {selectedOrthodontist.cro}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    onClick={confirmDeleteOrthodontist}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Excluindo...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Confirmar Exclusão
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setIsDeleteModalOpen(false)}
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

      {/* Connection Status */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800">Erro ao carregar ortodontistas: {error}</span>
            <span className="text-sm text-red-600 ml-auto">Usando dados locais</span>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Ortodontistas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orthodontistsData?.total || orthodontists.length}</div>
            <p className="text-xs text-muted-foreground">+3 este mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ortodontistas Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrthodontists}</div>
            <p className="text-xs text-muted-foreground">
              {orthodontists.length > 0
                ? `${((activeOrthodontists / orthodontists.length) * 100).toFixed(1)}% do total`
                : '0% do total'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating}</div>
            <p className="text-xs text-muted-foreground">⭐ Excelente</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome, email, CRO ou cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orthodontists Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Ortodontistas</CardTitle>
          <CardDescription>
            {filteredOrthodontists.length} ortodontista(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Carregando ortodontistas...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CRO</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Parceria</TableHead>
                  <TableHead>Pacientes</TableHead>
                  <TableHead>Avaliação</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrthodontists.map((orthodontist: Orthodontist) => (
                  <TableRow key={orthodontist.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{orthodontist.name}</div>
                        <div className="text-sm text-gray-500">{orthodontist.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{orthodontist.cro}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-sm">{orthodontist.city}, {orthodontist.state}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(orthodontist.status)}</TableCell>
                    <TableCell>{getPartnershipBadge(orthodontist.partnershipModel)}</TableCell>
                    <TableCell>{orthodontist.patientsCount}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{orthodontist.rating || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewOrthodontist(orthodontist)}
                          title="Visualizar ortodontista"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditOrthodontist(orthodontist)}
                          title="Editar ortodontista"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteOrthodontist(orthodontist)}
                          title="Excluir ortodontista"
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
    </div>
  )
}