"use client"

import { useState } from 'react'
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

interface Orthodontist {
  id: number
  nome: string
  clinica: string
  cro: string
  email: string
  telefone: string
  consultórios: string
  casos_mes: string
  interesse: string
  responsavel_comercial?: string
  created_at: string
}

const mockOrthodontists: Orthodontist[] = [
  {
    id: 1,
    nome: "Dr. João Silva",
    clinica: "Clínica OrthoSmile",
    cro: "CRO-SP 12345",
    email: "joao@orthosmile.com.br",
    telefone: "(11) 9999-8888",
    consultórios: "2-3",
    casos_mes: "11-20",
    interesse: "atma-aligner",
    responsavel_comercial: "Maria Santos",
    created_at: "2024-01-15"
  },
  {
    id: 2,
    nome: "Dra. Ana Costa",
    clinica: "Costa Ortodontia",
    cro: "CRO-RJ 67890",
    email: "ana@costaorotdontia.com.br", 
    telefone: "(21) 8888-7777",
    consultórios: "4-5",
    casos_mes: "21+",
    interesse: "atma-labs",
    created_at: "2024-01-10"
  }
]

const columns = [
  { 
    id: 'novo', 
    title: 'Prospecção', 
    color: 'bg-gray-100 border-gray-300',
    count: 2 
  },
  { 
    id: 'analisando', 
    title: 'Contato Inicial', 
    color: 'bg-blue-50 border-blue-200',
    count: 0 
  },
  { 
    id: 'proposta-enviada', 
    title: 'Apresentação', 
    color: 'bg-yellow-50 border-yellow-200',
    count: 0 
  },
  { 
    id: 'negociacao', 
    title: 'Negociação', 
    color: 'bg-orange-50 border-orange-200',
    count: 0 
  },
  { 
    id: 'fechado', 
    title: 'Fechado', 
    color: 'bg-green-50 border-green-200',
    count: 0 
  }
]

export default function KanbanPage() {
  const [orthodontists] = useState<Orthodontist[]>(mockOrthodontists)

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
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
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Novo Lead
        </Button>
      </div>

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
              <CardContent className="space-y-3">
                {column.id === 'novo' && orthodontists.map((orthodontist) => (
                  <Card key={orthodontist.id} className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Header do Card */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-blue-100 text-blue-800 text-sm font-semibold">
                                {getInitials(orthodontist.nome)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-sm">{orthodontist.nome}</h3>
                              <p className="text-xs text-gray-600">{orthodontist.cro}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Clínica */}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building className="h-4 w-4" />
                          <span className="truncate">{orthodontist.clinica}</span>
                        </div>

                        {/* Perfil comercial */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <MapPin className="h-3 w-3" />
                            <span>{orthodontist.consultórios} consultórios</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Stethoscope className="h-3 w-3" />
                            <span>{orthodontist.casos_mes} casos/mês</span>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex items-center gap-2">
                          {getInterestBadge(orthodontist.interesse)}
                          {orthodontist.responsavel_comercial && (
                            <Badge variant="outline" className="text-xs">
                              {orthodontist.responsavel_comercial}
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
                            {new Date(orthodontist.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Placeholder para colunas vazias */}
                {column.id !== 'novo' && column.count === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <div className="text-sm">Arraste cards aqui</div>
                  </div>
                )}

                {/* Botão para adicionar novo card */}
                <Button 
                  variant="ghost" 
                  className="w-full border-2 border-dashed border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-700"
                  size="sm"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Lead
                </Button>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}