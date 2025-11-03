"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle2,
  CalendarClock
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { usePatients } from '@/hooks/useApi'
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

export default function PacientesAgendaPage() {
  const { data: patientsData, loading, error } = usePatients()
  const patients = patientsData?.patients || []
  const { toast } = useToast()

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  // Filter patients by status for agenda view
  const agendadosPatients = patients.filter((p: Patient) => p.status === 'agendado')
  const emTratamentoPatients = patients.filter((p: Patient) => p.status === 'atribuido')
  const novosPatients = patients.filter((p: Patient) => p.status === 'novo')

  const handlePhoneCall = (patient: Patient) => {
    if (patient.phone) {
      window.open(`tel:${patient.phone}`, '_self')
      toast({
        title: 'Ligando...',
        description: `Iniciando chamada para ${patient.name}`,
      })
    } else {
      toast({
        title: 'Telefone não disponível',
        description: 'Este paciente não possui telefone cadastrado',
        variant: 'destructive'
      })
    }
  }

  const handleEmail = (patient: Patient) => {
    const subject = encodeURIComponent(`Atma Aligner - Agendamento ${patient.name}`)
    const body = encodeURIComponent(`Olá ${patient.name},\n\nEspero que esteja bem!\n\nRetomando sobre seu agendamento...\n\n`)
    window.open(`mailto:${patient.email}?subject=${subject}&body=${body}`, '_blank')
    toast({
      title: 'Email aberto',
      description: `Redigindo email para ${patient.name}`,
    })
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string, className: string }> = {
      'novo': { label: 'Novo', className: 'bg-blue-100 text-blue-800' },
      'contatado': { label: 'Contatado', className: 'bg-yellow-100 text-yellow-800' },
      'agendado': { label: 'Agendado', className: 'bg-purple-100 text-purple-800' },
      'atribuido': { label: 'Em Tratamento', className: 'bg-orange-100 text-orange-800' },
      'convertido': { label: 'Concluído', className: 'bg-green-100 text-green-800' },
      'cancelado': { label: 'Cancelado', className: 'bg-gray-100 text-gray-800' }
    }
    const { label, className } = statusMap[status] || { label: status, className: '' }
    return <Badge className={className}>{label}</Badge>
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Agenda de Pacientes</h1>
            <p className="text-gray-600 mt-2">Carregando...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Agenda de Pacientes</h1>
            <p className="text-gray-600 mt-2">Erro ao carregar: {error}</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Agenda de Pacientes</h1>
          <p className="text-gray-600 mt-2">
            Acompanhe consultas agendadas e acompanhamentos
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendados</CardTitle>
            <CalendarClock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agendadosPatients.length}</div>
            <p className="text-xs text-gray-600">Consultas agendadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Tratamento</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emTratamentoPatients.length}</div>
            <p className="text-xs text-gray-600">Acompanhamentos ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aguardando Contato</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{novosPatients.length}</div>
            <p className="text-xs text-gray-600">Novos pacientes</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="agendados" className="space-y-4">
        <TabsList>
          <TabsTrigger value="agendados" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Agendados ({agendadosPatients.length})
          </TabsTrigger>
          <TabsTrigger value="tratamento" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Em Tratamento ({emTratamentoPatients.length})
          </TabsTrigger>
          <TabsTrigger value="novos" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Aguardando Contato ({novosPatients.length})
          </TabsTrigger>
        </TabsList>

        {/* Agendados Tab */}
        <TabsContent value="agendados" className="space-y-4">
          {agendadosPatients.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Calendar className="h-12 w-12 mb-4 text-gray-400" />
                <p className="text-center">Nenhuma consulta agendada no momento</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agendadosPatients.map((patient: Patient) => (
                <Card key={patient.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback className="bg-purple-100 text-purple-700">
                            {getInitials(patient.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-gray-600">{patient.email}</p>
                        </div>
                      </div>
                      {getStatusBadge(patient.status)}
                    </div>

                    {patient.phone && (
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Phone className="h-4 w-4 mr-2" />
                        {patient.phone}
                      </div>
                    )}

                    {patient.orthodontist && (
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <User className="h-4 w-4 mr-2" />
                        {patient.orthodontist}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handlePhoneCall(patient)}
                        className="flex-1"
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Ligar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEmail(patient)}
                        className="flex-1"
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Em Tratamento Tab */}
        <TabsContent value="tratamento" className="space-y-4">
          {emTratamentoPatients.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Clock className="h-12 w-12 mb-4 text-gray-400" />
                <p className="text-center">Nenhum paciente em tratamento</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {emTratamentoPatients.map((patient: Patient) => (
                <Card key={patient.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback className="bg-orange-100 text-orange-700">
                            {getInitials(patient.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-gray-600">{patient.email}</p>
                        </div>
                      </div>
                      {getStatusBadge(patient.status)}
                    </div>

                    {patient.phone && (
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Phone className="h-4 w-4 mr-2" />
                        {patient.phone}
                      </div>
                    )}

                    {patient.orthodontist && (
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <User className="h-4 w-4 mr-2" />
                        {patient.orthodontist}
                      </div>
                    )}

                    {patient.treatmentStage && (
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        {patient.treatmentStage}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handlePhoneCall(patient)}
                        className="flex-1"
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Ligar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEmail(patient)}
                        className="flex-1"
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Novos Tab */}
        <TabsContent value="novos" className="space-y-4">
          {novosPatients.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-gray-500">
                <AlertCircle className="h-12 w-12 mb-4 text-gray-400" />
                <p className="text-center">Nenhum paciente aguardando contato</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {novosPatients.map((patient: Patient) => (
                <Card key={patient.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {getInitials(patient.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-gray-600">{patient.email}</p>
                        </div>
                      </div>
                      {getStatusBadge(patient.status)}
                    </div>

                    {patient.phone && (
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <Phone className="h-4 w-4 mr-2" />
                        {patient.phone}
                      </div>
                    )}

                    {patient.registrationDate && (
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <Calendar className="h-4 w-4 mr-2" />
                        Cadastro: {new Date(patient.registrationDate).toLocaleDateString('pt-BR')}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handlePhoneCall(patient)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Ligar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEmail(patient)}
                        className="flex-1"
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
