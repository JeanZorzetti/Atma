'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin, Video, CheckCircle, Info, Phone } from 'lucide-react'
import { registrarAcao } from '@/hooks/usePortalTracking'

// Tipos de consulta disponíveis
const tiposConsulta = [
  {
    id: 'avaliacao',
    titulo: 'Avaliação Inicial',
    duracao: '45 min',
    descricao: 'Primeira consulta para análise completa e definição do plano de tratamento',
    preco: 'Gratuita',
    icone: '🦷',
    destaque: true,
  },
  {
    id: 'acompanhamento',
    titulo: 'Consulta de Acompanhamento',
    duracao: '30 min',
    descricao: 'Verificação do progresso e ajustes necessários durante o tratamento',
    preco: 'Incluso',
    icone: '📊',
    destaque: false,
  },
  {
    id: 'emergencia',
    titulo: 'Atendimento de Emergência',
    duracao: '20 min',
    descricao: 'Para casos urgentes durante o tratamento (desconforto, alinhador quebrado, etc)',
    preco: 'Incluso',
    icone: '🚨',
    destaque: false,
  },
  {
    id: 'online',
    titulo: 'Consulta Online',
    duracao: '20 min',
    descricao: 'Atendimento por videochamada para esclarecimento de dúvidas',
    preco: 'Gratuita',
    icone: '💻',
    destaque: false,
  },
]

// Unidades de atendimento
const unidades = [
  {
    id: 'sp-jardins',
    nome: 'São Paulo - Jardins',
    endereco: 'Rua Augusta, 2676 - Cerqueira César',
    cidade: 'São Paulo - SP',
    telefone: '(11) 3456-7890',
    horarios: 'Seg-Sex: 8h-19h | Sáb: 8h-14h',
    calendlyUrl: 'https://calendly.com/atma-sp-jardins/consulta',
  },
  {
    id: 'sp-morumbi',
    nome: 'São Paulo - Morumbi',
    endereco: 'Av. Giovanni Gronchi, 5930 - Vila Andrade',
    cidade: 'São Paulo - SP',
    telefone: '(11) 3456-7891',
    horarios: 'Seg-Sex: 8h-19h | Sáb: 8h-14h',
    calendlyUrl: 'https://calendly.com/atma-sp-morumbi/consulta',
  },
  {
    id: 'rj-ipanema',
    nome: 'Rio de Janeiro - Ipanema',
    endereco: 'Rua Visconde de Pirajá, 550 - Ipanema',
    cidade: 'Rio de Janeiro - RJ',
    telefone: '(21) 3456-7892',
    horarios: 'Seg-Sex: 8h-19h | Sáb: 8h-14h',
    calendlyUrl: 'https://calendly.com/atma-rj-ipanema/consulta',
  },
  {
    id: 'online',
    nome: 'Atendimento Online',
    endereco: 'Videochamada',
    cidade: 'Todo o Brasil',
    telefone: '0800 123 4567',
    horarios: 'Seg-Sex: 8h-20h | Sáb: 8h-16h',
    calendlyUrl: 'https://calendly.com/atma-online/consulta',
  },
]

export default function AgendarPage() {
  const [tipoSelecionado, setTipoSelecionado] = useState<string>('avaliacao')
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<string>('sp-jardins')
  const [calendlyVisible, setCalendlyVisible] = useState(false)

  const tipoConsulta = tiposConsulta.find((t) => t.id === tipoSelecionado)
  const unidade = unidades.find((u) => u.id === unidadeSelecionada)

  const abrirCalendly = () => {
    setCalendlyVisible(true)
    registrarAcao('abriu-calendly', {
      tipo: tipoSelecionado,
      unidade: unidadeSelecionada,
    })
  }

  const ligarUnidade = () => {
    if (unidade) {
      registrarAcao('ligou-unidade', { unidade: unidadeSelecionada })
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Agendar Consulta</h1>
        <p className="text-gray-600">
          Escolha o tipo de consulta e a unidade de sua preferência para agendar
        </p>
      </div>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="flex items-start gap-3 pt-6">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm text-blue-900 font-medium">
              Agendamento fácil e rápido
            </p>
            <p className="text-sm text-blue-700">
              Escolha data e horário disponível em tempo real. Você receberá confirmação por email e SMS.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tipo de Consulta */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Tipo de Consulta
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {tiposConsulta.map((tipo) => (
            <Card
              key={tipo.id}
              className={`cursor-pointer transition-all border-2 ${
                tipoSelecionado === tipo.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
              } ${tipo.destaque ? 'ring-2 ring-green-400' : ''}`}
              onClick={() => setTipoSelecionado(tipo.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{tipo.icone}</div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {tipo.titulo}
                        {tipo.destaque && (
                          <Badge variant="default" className="bg-green-600">
                            Recomendado
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {tipo.duracao}
                      </CardDescription>
                    </div>
                  </div>
                  {tipoSelecionado === tipo.id && (
                    <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-gray-600">{tipo.descricao}</p>
                <div className="flex items-center justify-between pt-2">
                  <Badge variant="outline" className="text-green-700 border-green-300">
                    {tipo.preco}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Unidade de Atendimento */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          Unidade de Atendimento
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {unidades.map((unid) => (
            <Card
              key={unid.id}
              className={`cursor-pointer transition-all border-2 ${
                unidadeSelecionada === unid.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
              }`}
              onClick={() => setUnidadeSelecionada(unid.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {unid.id === 'online' ? (
                      <Video className="h-5 w-5 text-purple-600" />
                    ) : (
                      <MapPin className="h-5 w-5 text-blue-600" />
                    )}
                    {unid.nome}
                  </CardTitle>
                  {unidadeSelecionada === unid.id && (
                    <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1 text-sm text-gray-600">
                  <p className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5 text-gray-400" />
                    <span>
                      {unid.endereco}
                      <br />
                      <span className="text-gray-500">{unid.cidade}</span>
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {unid.telefone}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    {unid.horarios}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Resumo e CTA */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-600" />
            Confirme seu agendamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tipo de Consulta</p>
              <p className="font-semibold text-gray-900 flex items-center gap-2">
                {tipoConsulta?.icone} {tipoConsulta?.titulo}
              </p>
              <p className="text-sm text-gray-500">{tipoConsulta?.duracao}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Local</p>
              <p className="font-semibold text-gray-900">{unidade?.nome}</p>
              <p className="text-sm text-gray-500">{unidade?.cidade}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              size="lg"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={abrirCalendly}
            >
              <Calendar className="h-5 w-5 mr-2" />
              Escolher Data e Horário
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
              onClick={ligarUnidade}
              asChild
            >
              <a href={`tel:${unidade?.telefone.replace(/\D/g, '')}`}>
                <Phone className="h-5 w-5 mr-2" />
                Ligar para Unidade
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Calendly Embed */}
      {calendlyVisible && unidade && (
        <Card className="border-2 border-blue-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              Escolha data e horário
            </CardTitle>
            <CardDescription>
              Selecione o melhor horário para sua consulta no calendário abaixo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[700px] rounded-lg overflow-hidden">
              <iframe
                src={`${unidade.calendlyUrl}?embed_domain=${typeof window !== 'undefined' ? window.location.hostname : ''}&embed_type=Inline&hide_event_type_details=1&hide_gdpr_banner=1`}
                width="100%"
                height="100%"
                frameBorder="0"
                title="Calendário de Agendamento"
              />
            </div>
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-green-900">
                    Confirmação Automática
                  </p>
                  <p className="text-sm text-green-700">
                    Após selecionar o horário, você receberá um email de confirmação com todos os detalhes da consulta e um lembrete 24h antes.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* FAQ Rápido */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Perguntas Frequentes sobre Agendamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-semibold text-gray-900 mb-1">
              Preciso pagar alguma taxa para agendar?
            </p>
            <p className="text-sm text-gray-600">
              Não! A avaliação inicial é totalmente gratuita e sem compromisso. Você só paga se decidir iniciar o tratamento.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-1">Posso remarcar ou cancelar?</p>
            <p className="text-sm text-gray-600">
              Sim, você pode remarcar ou cancelar com até 24h de antecedência pelo link que receberá no email de confirmação ou ligando para a unidade.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-1">
              O que devo levar na primeira consulta?
            </p>
            <p className="text-sm text-gray-600">
              Apenas um documento com foto. Se tiver exames odontológicos recentes (radiografias, tomografia), pode trazer para análise.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-1">
              Quanto tempo demora a avaliação inicial?
            </p>
            <p className="text-sm text-gray-600">
              Em média 45 minutos. Faremos fotos, escaneamento 3D e apresentaremos uma simulação inicial do seu tratamento.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
