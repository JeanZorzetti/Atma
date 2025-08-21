"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Search, Plus, Edit, Eye, Filter, Loader2, AlertCircle } from 'lucide-react'
import { usePatients } from '@/hooks/useApi'

const mockPatients = [
  {
    id: 1,
    name: 'Maria Silva',
    email: 'maria@email.com',
    phone: '(11) 99999-9999',
    cpf: '123.456.789-00',
    birthDate: '1990-05-15',
    status: 'Ativo',
    treatmentStage: 'Planejamento',
    orthodontist: 'Dr. João Santos',
    registrationDate: '2024-01-15'
  },
  {
    id: 2,
    name: 'Pedro Oliveira',
    email: 'pedro@email.com',
    phone: '(11) 88888-8888',
    cpf: '987.654.321-00',
    birthDate: '1985-12-20',
    status: 'Em Tratamento',
    treatmentStage: 'Alinhadores 3/12',
    orthodontist: 'Dra. Ana Costa',
    registrationDate: '2024-02-10'
  },
  {
    id: 3,
    name: 'Ana Carolina',
    email: 'ana@email.com',
    phone: '(11) 77777-7777',
    cpf: '456.789.123-00',
    birthDate: '1995-08-10',
    status: 'Concluído',
    treatmentStage: 'Finalizado',
    orthodontist: 'Dr. Carlos Lima',
    registrationDate: '2023-09-05'
  }
]

interface Patient {
  id: number
  name: string
  email: string
  cpf?: string
  status: string
  treatmentStage?: string
  orthodontist?: string
}

export default function PacientesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: patientsData, loading, error } = usePatients()

  const patients = patientsData?.patients || mockPatients
  const filteredPatients = patients.filter((patient: Patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.cpf && patient.cpf.includes(searchTerm))
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ativo':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>
      case 'Em Tratamento':
        return <Badge className="bg-blue-100 text-blue-800">Em Tratamento</Badge>
      case 'Concluído':
        return <Badge className="bg-gray-100 text-gray-800">Concluído</Badge>
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
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Novo Paciente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Paciente</DialogTitle>
              <DialogDescription>
                Preencha as informações básicas do paciente
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" placeholder="Digite o nome completo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@exemplo.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" placeholder="(11) 99999-9999" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" placeholder="000.000.000-00" />
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Cadastrar
                </Button>
                <Button variant="outline" className="flex-1">
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>
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
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
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