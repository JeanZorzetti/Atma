"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Search, Plus, Edit, Eye, Filter, MapPin, Star } from 'lucide-react'

const mockOrthodontists = [
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

  const filteredOrthodontists = mockOrthodontists.filter(orthodontist =>
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ortodontistas</h1>
          <p className="text-gray-600 mt-2">Gerencie os ortodontistas parceiros da Atma</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Novo Ortodontista
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Ortodontista</DialogTitle>
              <DialogDescription>
                Preencha as informações do profissional
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" placeholder="Dr. Nome Sobrenome" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@exemplo.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cro">CRO</Label>
                <Input id="cro" placeholder="CRO-SP 12345" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" placeholder="(11) 99999-9999" />
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Ortodontistas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">56</div>
            <p className="text-xs text-muted-foreground">+3 este mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ortodontistas Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">52</div>
            <p className="text-xs text-muted-foreground">92.9% do total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7</div>
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
              {filteredOrthodontists.map((orthodontist) => (
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
        </CardContent>
      </Card>
    </div>
  )
}