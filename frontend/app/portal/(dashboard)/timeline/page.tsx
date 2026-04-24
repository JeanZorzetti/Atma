'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import {
  Clock,
  CheckCircle2,
  Circle,
  Calendar,
  TrendingUp,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  Check,
  Info,
} from 'lucide-react'

// Dados da curva de progresso (S-curve)
const progressData = [
  { mes: 0, progresso: 0, ideal: 0 },
  { mes: 1, progresso: 5, ideal: 8 },
  { mes: 2, progresso: 12, ideal: 15 },
  { mes: 3, progresso: 20, ideal: 25 },
  { mes: 4, progresso: 30, ideal: 35 },
  { mes: 5, progresso: 40, ideal: 45 },
  { mes: 6, progresso: 52, ideal: 55 },
  { mes: 7, progresso: 65, ideal: 65 },
  { mes: 8, progresso: 75, ideal: 75 },
  { mes: 9, progresso: 83, ideal: 83 },
  { mes: 10, progresso: 90, ideal: 90 },
  { mes: 11, progresso: 95, ideal: 95 },
  { mes: 12, progresso: 100, ideal: 100 },
]

// Etapas do tratamento
const etapas = [
  {
    id: 1,
    periodo: 'Mês 1-3',
    inicio: 0,
    fim: 3,
    titulo: 'Fase Inicial',
    subtitulo: 'Adaptação e Primeiros Movimentos',
    descricao: 'Período de adaptação aos alinhadores e início dos movimentos dentários.',
    status: 'em_andamento' as const,
    icone: Play,
    cor: 'blue',
    progresso: 20,
    acoes: [
      { id: 1, texto: 'Receber kit inicial de alinhadores', concluido: true },
      { id: 2, texto: 'Agendar consulta de acompanhamento (semana 4)', concluido: true },
      { id: 3, texto: 'Usar alinhadores 22h/dia', concluido: false },
      { id: 4, texto: 'Trocar alinhadores a cada 2 semanas', concluido: false },
    ],
    detalhes: [
      'Você receberá 6 pares de alinhadores para os primeiros 3 meses',
      'Adaptação pode causar leve desconforto nos primeiros dias',
      'Progresso inicial será visível após 4-6 semanas',
    ],
  },
  {
    id: 2,
    periodo: 'Mês 4-6',
    inicio: 3,
    fim: 6,
    titulo: 'Alinhamento Principal',
    subtitulo: 'Correção dos Desalinhamentos Principais',
    descricao: 'Fase mais ativa do tratamento com movimentos significativos.',
    status: 'pendente' as const,
    icone: TrendingUp,
    cor: 'purple',
    progresso: 0,
    acoes: [
      { id: 5, texto: 'Receber segundo kit de alinhadores', concluido: false },
      { id: 6, texto: 'Check-up presencial (mês 4)', concluido: false },
      { id: 7, texto: 'Fotografias de progresso (mês 5)', concluido: false },
      { id: 8, texto: 'Continuar uso rigoroso 22h/dia', concluido: false },
    ],
    detalhes: [
      'Fase de maior movimento dentário',
      'Resultados visíveis tornam-se mais evidentes',
      'Possível necessidade de attachments (botões)',
    ],
  },
  {
    id: 3,
    periodo: 'Mês 7-9',
    inicio: 6,
    fim: 9,
    titulo: 'Refinamento',
    subtitulo: 'Ajustes Finos e Otimização',
    descricao: 'Correção detalhada e ajuste da mordida para resultado ideal.',
    status: 'pendente' as const,
    icone: CheckCircle2,
    cor: 'cyan',
    progresso: 0,
    acoes: [
      { id: 9, texto: 'Avaliação de refinamento (mês 7)', concluido: false },
      { id: 10, texto: 'Possíveis alinhadores extras de refinamento', concluido: false },
      { id: 11, texto: 'Ajuste de mordida', concluido: false },
      { id: 12, texto: 'Preparação para fase final', concluido: false },
    ],
    detalhes: [
      'Ajustes mais delicados e precisos',
      'Foco na oclusão (mordida) perfeita',
      'Possível escaneamento para refinamentos',
    ],
  },
  {
    id: 4,
    periodo: 'Mês 10-12',
    inicio: 9,
    fim: 12,
    titulo: 'Finalização',
    subtitulo: 'Últimos Ajustes e Contenção',
    descricao: 'Finalização do tratamento e início do protocolo de contenção.',
    status: 'pendente' as const,
    icone: Check,
    cor: 'green',
    progresso: 0,
    acoes: [
      { id: 13, texto: 'Últimos alinhadores de tratamento', concluido: false },
      { id: 14, texto: 'Fotografias finais', concluido: false },
      { id: 15, texto: 'Moldagem para contenções', concluido: false },
      { id: 16, texto: 'Receber contenções permanentes', concluido: false },
    ],
    detalhes: [
      'Conclusão do alinhamento ativo',
      'Preparação das contenções personalizadas',
      'Instruções de uso das contenções',
    ],
  },
]

// Calendário de marcos importantes
const marcos = [
  { dias: 1, titulo: 'Início do Tratamento', descricao: 'Recebimento dos alinhadores', tipo: 'inicio' },
  { dias: 30, titulo: '1º Mês', descricao: 'Primeira consulta de acompanhamento', tipo: 'consulta' },
  { dias: 60, titulo: '2 Meses', descricao: 'Avaliação de progresso', tipo: 'avaliacao' },
  { dias: 90, titulo: '3 Meses', descricao: 'Check-up trimestral', tipo: 'consulta' },
  { dias: 120, titulo: '4 Meses', descricao: 'Segunda fase - Alinhamento principal', tipo: 'fase' },
  { dias: 180, titulo: '6 Meses', descricao: 'Meio do tratamento - Avaliação', tipo: 'avaliacao' },
  { dias: 210, titulo: '7 Meses', descricao: 'Início da fase de refinamento', tipo: 'fase' },
  { dias: 270, titulo: '9 Meses', descricao: 'Avaliação de refinamento', tipo: 'avaliacao' },
  { dias: 300, titulo: '10 Meses', descricao: 'Fase final - Preparação para contenção', tipo: 'fase' },
  { dias: 360, titulo: '12 Meses', descricao: 'Conclusão do tratamento', tipo: 'conclusao' },
]

export default function TimelinePage() {
  const [expandedEtapa, setExpandedEtapa] = useState<number | null>(1)
  const [acoesConcluidas, setAcoesConcluidas] = useState<Record<number, boolean>>({
    1: true,
    2: true,
  })

  const toggleEtapa = (id: number) => {
    setExpandedEtapa(expandedEtapa === id ? null : id)
  }

  const toggleAcao = (acaoId: number) => {
    setAcoesConcluidas((prev) => ({
      ...prev,
      [acaoId]: !prev[acaoId],
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluido':
        return 'bg-green-50 border-green-200'
      case 'em_andamento':
        return 'bg-blue-50 border-blue-200'
      case 'pendente':
        return 'bg-gray-50 border-gray-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'concluido':
        return <Badge className="bg-green-100 text-green-700">Concluído</Badge>
      case 'em_andamento':
        return <Badge className="bg-blue-100 text-blue-700">Em Andamento</Badge>
      case 'pendente':
        return <Badge className="bg-gray-100 text-gray-700">Pendente</Badge>
      default:
        return null
    }
  }

  const getMarcoIcon = (tipo: string) => {
    switch (tipo) {
      case 'inicio':
        return <Play className="h-4 w-4 text-blue-600" />
      case 'consulta':
        return <Calendar className="h-4 w-4 text-purple-600" />
      case 'avaliacao':
        return <AlertCircle className="h-4 w-4 text-amber-600" />
      case 'fase':
        return <TrendingUp className="h-4 w-4 text-cyan-600" />
      case 'conclusao':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      default:
        return <Circle className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Timeline do Tratamento</h1>
        <p className="text-gray-600 mt-2">
          Acompanhe as etapas e o progresso do seu tratamento ortodôntico
        </p>
      </div>

      {/* Card de Resumo */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <Clock className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                Duração: 12 meses
              </h3>
              <p className="text-gray-600">
                Tratamento em andamento - Mês 1 de 12 (8% concluído)
              </p>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: '20%' }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Progresso (Curva S) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Curva de Progresso do Tratamento
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Acompanhe o progresso real vs. progresso ideal ao longo do tempo
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="mes"
                  label={{ value: 'Meses de Tratamento', position: 'insideBottom', offset: -5 }}
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis
                  label={{ value: 'Progresso (%)', angle: -90, position: 'insideLeft' }}
                  tick={{ fill: '#6b7280' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => `${value}%`}
                />
                <Area
                  type="monotone"
                  dataKey="ideal"
                  stroke="#9ca3af"
                  fill="#e5e7eb"
                  fillOpacity={0.3}
                  strokeDasharray="5 5"
                  name="Progresso Ideal"
                />
                <Area
                  type="monotone"
                  dataKey="progresso"
                  stroke="#2563eb"
                  fill="#3b82f6"
                  fillOpacity={0.4}
                  name="Seu Progresso"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <strong>Como interpretar:</strong> A curva em formato de "S" é típica de tratamentos
                ortodônticos. O progresso é mais lento no início (adaptação), acelera no meio (fase
                ativa) e desacelera no final (refinamentos).
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Vertical Interativa */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Fases do Tratamento</h2>
        <div className="space-y-4 relative">
          {/* Linha vertical conectora */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-purple-600 to-green-600 hidden md:block" />

          {etapas.map((etapa, index) => {
            const Icon = etapa.icone
            const isExpanded = expandedEtapa === etapa.id

            return (
              <Card
                key={etapa.id}
                className={`relative ${getStatusColor(etapa.status)} border-2 transition-all duration-300 ${
                  isExpanded ? 'shadow-lg' : ''
                }`}
              >
                <CardContent className="p-6">
                  {/* Ícone no círculo (conectado à linha) */}
                  <div className="absolute -left-6 top-6 w-12 h-12 bg-white rounded-full border-4 border-blue-600 items-center justify-center hidden md:flex">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>

                  {/* Header da Etapa */}
                  <div
                    className="flex items-start justify-between cursor-pointer"
                    onClick={() => toggleEtapa(etapa.id)}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex-shrink-0 md:hidden">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Icon className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline" className="text-sm font-semibold">
                            {etapa.periodo}
                          </Badge>
                          {getStatusBadge(etapa.status)}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {etapa.titulo}
                        </h3>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          {etapa.subtitulo}
                        </p>
                        <p className="text-sm text-gray-600">{etapa.descricao}</p>

                        {/* Barra de progresso da etapa */}
                        {etapa.status !== 'pendente' && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                              <span>Progresso da fase</span>
                              <span className="font-semibold">{etapa.progresso}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${etapa.progresso}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-shrink-0 ml-4">
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                  </div>

                  {/* Conteúdo Expandido */}
                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-4 animate-in fade-in duration-300">
                      {/* Ações/Checklist */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Ações e Acompanhamento
                        </h4>
                        <div className="space-y-2">
                          {etapa.acoes.map((acao) => (
                            <div
                              key={acao.id}
                              className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200"
                            >
                              <Checkbox
                                id={`acao-${acao.id}`}
                                checked={acoesConcluidas[acao.id] || acao.concluido}
                                onCheckedChange={() => toggleAcao(acao.id)}
                                disabled={etapa.status === 'pendente'}
                              />
                              <label
                                htmlFor={`acao-${acao.id}`}
                                className={`text-sm flex-1 cursor-pointer ${
                                  acoesConcluidas[acao.id] || acao.concluido
                                    ? 'line-through text-gray-500'
                                    : 'text-gray-900'
                                }`}
                              >
                                {acao.texto}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Detalhes da Fase */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          O que esperar nesta fase
                        </h4>
                        <ul className="space-y-2">
                          {etapa.detalhes.map((detalhe, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                              <span>{detalhe}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Botão de Ação */}
                      {etapa.status === 'em_andamento' && (
                        <div className="pt-4">
                          <a
                            href="/contato"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Calendar className="h-4 w-4" />
                            Agendar Consulta de Acompanhamento
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Calendário de Marcos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Calendário de Marcos Importantes
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Datas importantes ao longo do tratamento (estimativa baseada em 12 meses)
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {marcos.map((marco, index) => {
              const dataEstimada = new Date()
              dataEstimada.setDate(dataEstimada.getDate() + marco.dias)

              return (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex-shrink-0 mt-1">{getMarcoIcon(marco.tipo)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900">{marco.titulo}</h4>
                      <span className="text-xs text-gray-500">
                        +{marco.dias} dias
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{marco.descricao}</p>
                    <p className="text-xs text-gray-500">
                      Estimativa: {dataEstimada.toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <strong>Importante:</strong> As datas são estimativas e podem variar de acordo com
                sua resposta ao tratamento e adesão ao uso dos alinhadores. Consulte sempre seu
                ortodontista para datas específicas.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pós-Tratamento */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Após o Tratamento: Contenção
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-700">
              Após concluir as 4 fases do tratamento ativo, você iniciará o protocolo de contenção
              para manter seus dentes na posição ideal alcançada.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border border-green-200">
                <h4 className="font-semibold text-gray-900 mb-2">Contenção Fixa</h4>
                <p className="text-sm text-gray-600">
                  Fio metálico colado na parte de trás dos dentes anteriores, garantindo estabilidade
                  permanente.
                </p>
              </div>

              <div className="p-4 bg-white rounded-lg border border-green-200">
                <h4 className="font-semibold text-gray-900 mb-2">Contenção Removível</h4>
                <p className="text-sm text-gray-600">
                  Alinhador transparente para uso noturno, mantendo o alinhamento durante o sono.
                </p>
              </div>
            </div>

            <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-green-700 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-800">
                  <strong>Protocolo recomendado:</strong> Uso da contenção removível todas as noites
                  nos primeiros 6 meses, depois 3-4 noites por semana indefinidamente.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
