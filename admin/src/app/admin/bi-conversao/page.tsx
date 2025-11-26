"use client"

import { useState, useEffect } from 'react'
import { subDays } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import {
  Eye,
  MousePointerClick,
  UserPlus,
  Calendar,
  CheckCircle2,
  XCircle,
  TrendingUp,
  RefreshCw,
  Loader2,
  ArrowRight,
  Phone,
  UserCheck,
  Award,
  Clock,
  AlertCircle
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import dynamic from 'next/dynamic'

// Dynamic import para react-flow (cliente-side only)
const FunnelFlowVisualization = dynamic(
  () => import('@/components/funnel/FunnelFlowVisualization'),
  { ssr: false, loading: () => <div className="h-[500px] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div> }
)

interface DetailedFunnelMetrics {
  success: boolean
  seo: {
    impressions: number
    clicks: number
    ctr: number
    avgPosition: number
  }
  crm: {
    registrations: number
    appointments: number
    attendance: number
    cancellations: number
    statusBreakdown: {
      novo: number
      contatado: number
      agendado: number
      avaliacao_inicial: number
      atribuido: number
      convertido: number
      cancelado: number
    }
  }
  conversions: {
    impressionToClick: number
    clickToRegistration: number
    novoToContatado: number
    contatadoToAgendado: number
    agendadoToAvaliacaoInicial: number
    avaliacaoInicialToAtribuido: number
    atribuidoToConvertido: number
    cancellationRate: number
  }
  transitionTimes: {
    [key: string]: {
      fromStatus: string
      toStatus: string
      occurrences: number
      avgHours: number
      avgDays: number
      minHours: number
      maxHours: number
    }
  }
  cancellationBreakdown: {
    novoToCancelado: number
    contatadoToCancelado: number
    agendadoToCancelado: number
    avaliacaoInicialToCancelado: number
    atribuidoToCancelado: number
    total: number
  }
  period: {
    startDate: string
    endDate: string
    days: number
  }
}

export default function BIConversaoPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [metrics, setMetrics] = useState<DetailedFunnelMetrics | null>(null)

  // Default date range: last 30 days (accounting for GSC delay)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 33),
    to: subDays(new Date(), 3),
  })

  const fetchMetrics = async () => {
    if (!dateRange?.from || !dateRange?.to) return

    setLoading(true)
    try {
      const startDate = dateRange.from.toISOString().split('T')[0]
      const endDate = dateRange.to.toISOString().split('T')[0]

      // Use novo endpoint detailed-metrics
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/conversion-funnel/detailed-metrics?startDate=${startDate}&endDate=${endDate}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      )

      if (!response.ok) {
        throw new Error(`Erro ao carregar métricas: ${response.statusText}`)
      }

      const data = await response.json()
      setMetrics(data)
    } catch (error) {
      toast({
        title: "Erro ao carregar métricas",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      fetchMetrics()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange])

  // Helper function to get health status based on conversion rate
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getHealthStatus = (rate: number, target: number): 'healthy' | 'warning' | 'critical' => {
    if (rate >= target) return 'healthy'
    if (rate >= target * 0.8) return 'warning'
    return 'critical'
  }

  // Helper function to get health color
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getHealthColor = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100 border-green-300'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 border-yellow-300'
      case 'critical':
        return 'text-red-600 bg-red-100 border-red-300'
    }
  }

  const handleRefresh = () => {
    fetchMetrics()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">BI de Conversão</h1>
          <p className="text-gray-600 mt-2">Funil completo: SEO → Cadastro → Agendamento → Avaliação Inicial → Em Tratamento</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Atualizar
        </Button>
      </div>

      {/* Date Range Filter */}
      <div className="flex items-center gap-4">
        <DateRangePicker
          date={dateRange}
          onDateChange={setDateRange}
          disabled={loading}
        />
        <p className="text-sm text-gray-500">
          {metrics?.period.days || 0} dias selecionados
        </p>
      </div>

      {loading && !metrics ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Carregando métricas...</p>
          </div>
        </div>
      ) : metrics ? (
        <>
          {/* Funnel Flow Visualization with React Flow */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Funil de Conversão Interativo</span>
                <div className="flex items-center gap-2 text-sm font-normal text-gray-500">
                  <Eye className="h-4 w-4" />
                  <span>{metrics.seo.impressions.toLocaleString('pt-BR')} impressões</span>
                  <ArrowRight className="h-3 w-3" />
                  <Award className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 font-semibold">{metrics.crm.statusBreakdown.convertido} convertidos</span>
                </div>
              </CardTitle>
              <CardDescription>
                Visualização interativa com fluxos proporcionais e tooltips informativos.
                <span className="text-blue-600 font-semibold ml-1">Passe o mouse sobre as setas para ver as fórmulas!</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* React Flow Visualization */}
              <FunnelFlowVisualization metrics={metrics} />

              {/* Compact Horizontal Funnel - ALTERNATIVE VIEW (mantido como opção) */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Visualização Alternativa: Cards Compactos
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Mesmos dados em formato de cards horizontais
                  </p>
                </div>
                {/* Compact Horizontal Funnel */}
                <div className="space-y-6">
                {/* Stage Pills - Horizontal Layout */}
                <div className="relative">
                  <div className="grid grid-cols-9 gap-2 items-center">
                    {/* Stage 1: Impressões */}
                    <div className="relative group cursor-pointer">
                      <div className="bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-blue-300 rounded-lg p-3 hover:shadow-lg transition-all">
                        <div className="flex items-center gap-2 mb-1">
                          <Eye className="h-4 w-4 text-blue-600" />
                          <span className="text-[10px] font-medium text-gray-600 uppercase">Impressões</span>
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {(metrics.seo.impressions / 1000).toFixed(1)}k
                        </div>
                        <div className="text-[10px] text-gray-500">Pos: {metrics.seo.avgPosition}</div>
                      </div>
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                        <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                          {metrics.seo.impressions.toLocaleString('pt-BR')} impressões
                        </div>
                      </div>
                    </div>

                    {/* Conversion Arrow 1 */}
                    <div className="flex flex-col items-center -mx-1">
                      <ArrowRight className="h-5 w-5 text-gray-300" />
                      <div className={`text-[10px] font-bold mt-0.5 px-1.5 py-0.5 rounded ${getHealthColor(getHealthStatus(metrics.conversions.impressionToClick, 3))}`}>
                        {metrics.conversions.impressionToClick.toFixed(1)}%
                      </div>
                    </div>

                    {/* Stage 2: Cliques */}
                    <div className="relative group cursor-pointer">
                      <div className="bg-gradient-to-r from-green-100 to-green-50 border-2 border-green-300 rounded-lg p-3 hover:shadow-lg transition-all">
                        <div className="flex items-center gap-2 mb-1">
                          <MousePointerClick className="h-4 w-4 text-green-600" />
                          <span className="text-[10px] font-medium text-gray-600 uppercase">Cliques</span>
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {metrics.seo.clicks}
                        </div>
                        <div className="text-[10px] text-green-600 font-semibold">
                          CTR: {metrics.seo.ctr}%
                        </div>
                      </div>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                        <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                          {metrics.seo.clicks.toLocaleString('pt-BR')} cliques no Google
                        </div>
                      </div>
                    </div>

                    {/* Conversion Arrow 2 */}
                    <div className="flex flex-col items-center -mx-1">
                      <ArrowRight className="h-5 w-5 text-gray-300" />
                      <div className={`text-[10px] font-bold mt-0.5 px-1.5 py-0.5 rounded ${getHealthColor(getHealthStatus(metrics.conversions.clickToRegistration, 8))}`}>
                        {metrics.conversions.clickToRegistration.toFixed(1)}%
                      </div>
                    </div>

                    {/* Stage 3: Cadastros Totais */}
                    <div className="relative group cursor-pointer">
                      <div className="bg-gradient-to-r from-indigo-100 to-indigo-50 border-2 border-indigo-300 rounded-lg p-3 hover:shadow-lg transition-all">
                        <div className="flex items-center gap-2 mb-1">
                          <UserPlus className="h-4 w-4 text-indigo-600" />
                          <span className="text-[10px] font-medium text-gray-600 uppercase">Cadastros</span>
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {metrics.crm.registrations}
                        </div>
                        <div className="text-[10px] text-indigo-600 font-semibold">
                          Total
                        </div>
                      </div>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                        <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                          {metrics.crm.registrations} cadastros totais no período
                        </div>
                      </div>
                    </div>

                    {/* Conversion Arrow 3 */}
                    <div className="flex flex-col items-center -mx-1">
                      <ArrowRight className="h-5 w-5 text-gray-300" />
                      <div className="text-[10px] font-bold mt-0.5 px-1.5 py-0.5 rounded bg-green-100 text-green-600">
                        100%
                      </div>
                    </div>

                    {/* Stage 4: Novo */}
                    <div className="relative group cursor-pointer">
                      <div className="bg-gradient-to-r from-purple-100 to-purple-50 border-2 border-purple-300 rounded-lg p-3 hover:shadow-lg transition-all">
                        <div className="flex items-center gap-2 mb-1">
                          <UserPlus className="h-4 w-4 text-purple-600" />
                          <span className="text-[10px] font-medium text-gray-600 uppercase">Novo</span>
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {metrics.crm.statusBreakdown.novo}
                        </div>
                        <div className="text-[10px] text-purple-600 font-semibold">
                          Status inicial
                        </div>
                      </div>
                    </div>

                    {/* Conversion Arrow 4 */}
                    <div className="flex flex-col items-center -mx-1">
                      <ArrowRight className="h-5 w-5 text-gray-300" />
                      <div className={`text-[10px] font-bold mt-0.5 px-1.5 py-0.5 rounded ${getHealthColor(getHealthStatus(metrics.conversions.novoToContatado, 95))}`}>
                        {metrics.conversions.novoToContatado.toFixed(1)}%
                      </div>
                      {metrics.transitionTimes.novo_to_contatado && (
                        <div className="text-[9px] text-gray-400 mt-0.5 flex items-center gap-0.5">
                          <Clock className="h-2.5 w-2.5" />
                          {metrics.transitionTimes.novo_to_contatado.avgHours.toFixed(0)}h
                        </div>
                      )}
                    </div>

                    {/* Stage 5: Contatado */}
                    <div className="relative group cursor-pointer">
                      <div className="bg-gradient-to-r from-cyan-100 to-cyan-50 border-2 border-cyan-300 rounded-lg p-3 hover:shadow-lg transition-all">
                        <div className="flex items-center gap-2 mb-1">
                          <Phone className="h-4 w-4 text-cyan-600" />
                          <span className="text-[10px] font-medium text-gray-600 uppercase">Contatado</span>
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {metrics.crm.statusBreakdown.contatado}
                        </div>
                        <div className="text-[10px] text-cyan-600 font-semibold">
                          1º contato
                        </div>
                      </div>
                    </div>

                    {/* Conversion Arrow 5 */}
                    <div className="flex flex-col items-center -mx-1">
                      <ArrowRight className="h-5 w-5 text-gray-300" />
                      <div className={`text-[10px] font-bold mt-0.5 px-1.5 py-0.5 rounded ${getHealthColor(getHealthStatus(metrics.conversions.contatadoToAgendado, 60))}`}>
                        {metrics.conversions.contatadoToAgendado.toFixed(1)}%
                      </div>
                      {metrics.transitionTimes.contatado_to_agendado && (
                        <div className="text-[9px] text-gray-400 mt-0.5 flex items-center gap-0.5">
                          <Clock className="h-2.5 w-2.5" />
                          {metrics.transitionTimes.contatado_to_agendado.avgDays.toFixed(0)}d
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Second Row - Remaining Stages */}
                <div className="grid grid-cols-7 gap-2 items-center ml-auto" style={{ maxWidth: '78%' }}>
                  {/* Stage 6: Agendado */}
                  <div className="relative group cursor-pointer">
                    <div className="bg-gradient-to-r from-orange-100 to-orange-50 border-2 border-orange-300 rounded-lg p-3 hover:shadow-lg transition-all">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-orange-600" />
                        <span className="text-[10px] font-medium text-gray-600 uppercase">Agendado</span>
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {metrics.crm.statusBreakdown.agendado}
                      </div>
                      <div className="text-[10px] text-orange-600 font-semibold">
                        Consulta marcada
                      </div>
                    </div>
                  </div>

                  {/* Conversion Arrow 6 */}
                  <div className="flex flex-col items-center -mx-1">
                    <ArrowRight className="h-5 w-5 text-gray-300" />
                    <div className={`text-[10px] font-bold mt-0.5 px-1.5 py-0.5 rounded ${getHealthColor(getHealthStatus(metrics.conversions.agendadoToAvaliacaoInicial, 70))}`}>
                      {metrics.conversions.agendadoToAvaliacaoInicial.toFixed(1)}%
                    </div>
                    {metrics.transitionTimes.agendado_to_avaliacao_inicial && (
                      <div className="text-[9px] text-gray-400 mt-0.5 flex items-center gap-0.5">
                        <Clock className="h-2.5 w-2.5" />
                        {metrics.transitionTimes.agendado_to_avaliacao_inicial.avgDays.toFixed(0)}d
                      </div>
                    )}
                  </div>

                  {/* Stage 7: Avaliação Inicial */}
                  <div className="relative group cursor-pointer">
                    <div className="bg-gradient-to-r from-indigo-100 to-indigo-50 border-2 border-indigo-300 rounded-lg p-3 hover:shadow-lg transition-all">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                        <span className="text-[10px] font-medium text-gray-600 uppercase">Avaliação</span>
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {metrics.crm.statusBreakdown.avaliacao_inicial}
                      </div>
                      <div className="text-[10px] text-indigo-600 font-semibold">
                        1ª consulta
                      </div>
                    </div>
                  </div>

                  {/* Conversion Arrow 7 */}
                  <div className="flex flex-col items-center -mx-1">
                    <ArrowRight className="h-5 w-5 text-gray-300" />
                    <div className={`text-[10px] font-bold mt-0.5 px-1.5 py-0.5 rounded ${getHealthColor(getHealthStatus(metrics.conversions.avaliacaoInicialToAtribuido, 80))}`}>
                      {metrics.conversions.avaliacaoInicialToAtribuido.toFixed(1)}%
                    </div>
                    {metrics.transitionTimes.avaliacao_inicial_to_atribuido && (
                      <div className="text-[9px] text-gray-400 mt-0.5 flex items-center gap-0.5">
                        <Clock className="h-2.5 w-2.5" />
                        {metrics.transitionTimes.avaliacao_inicial_to_atribuido.avgDays.toFixed(0)}d
                      </div>
                    )}
                  </div>

                  {/* Stage 8: Atribuído */}
                  <div className="relative group cursor-pointer">
                    <div className="bg-gradient-to-r from-violet-100 to-violet-50 border-2 border-violet-300 rounded-lg p-3 hover:shadow-lg transition-all">
                      <div className="flex items-center gap-2 mb-1">
                        <UserCheck className="h-4 w-4 text-violet-600" />
                        <span className="text-[10px] font-medium text-gray-600 uppercase">Atribuído</span>
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {metrics.crm.statusBreakdown.atribuido}
                      </div>
                      <div className="text-[10px] text-violet-600 font-semibold">
                        Com ortodontista
                      </div>
                    </div>
                  </div>

                  {/* Conversion Arrow 8 */}
                  <div className="flex flex-col items-center -mx-1">
                    <ArrowRight className="h-5 w-5 text-gray-300" />
                    <div className={`text-[10px] font-bold mt-0.5 px-1.5 py-0.5 rounded ${getHealthColor(getHealthStatus(metrics.conversions.atribuidoToConvertido, 70))}`}>
                      {metrics.conversions.atribuidoToConvertido.toFixed(1)}%
                    </div>
                    {metrics.transitionTimes.atribuido_to_convertido && (
                      <div className="text-[9px] text-gray-400 mt-0.5 flex items-center gap-0.5">
                        <Clock className="h-2.5 w-2.5" />
                        {metrics.transitionTimes.atribuido_to_convertido.avgDays.toFixed(0)}d
                      </div>
                    )}
                  </div>

                  {/* Stage 9: Convertido */}
                  <div className="relative group cursor-pointer">
                    <div className="bg-gradient-to-r from-emerald-100 to-emerald-50 border-2 border-emerald-400 rounded-lg p-3 hover:shadow-lg transition-all ring-2 ring-emerald-300 ring-offset-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Award className="h-4 w-4 text-emerald-600" />
                        <span className="text-[10px] font-medium text-gray-600 uppercase">Convertido</span>
                      </div>
                      <div className="text-lg font-bold text-emerald-700">
                        {metrics.crm.statusBreakdown.convertido}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-semibold">
                        🎉 Tratamento
                      </div>
                    </div>
                  </div>
                </div>

                {/* Drop-off Summary */}
                <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <div>
                        <div className="text-sm font-medium text-gray-700">
                          {metrics.crm.statusBreakdown.cancelado} Cancelamentos
                        </div>
                        <div className="text-xs text-gray-500">
                          {metrics.conversions.cancellationRate.toFixed(1)}% dos cadastros
                        </div>
                      </div>
                    </div>
                    <div className="h-8 w-px bg-gray-300"></div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-700">
                          Taxa de Conversão Final
                        </div>
                        <div className="text-xs text-green-600 font-bold">
                          {((metrics.crm.statusBreakdown.convertido / metrics.crm.registrations) * 100).toFixed(2)}%
                          <span className="text-gray-500 ml-1">({metrics.crm.statusBreakdown.convertido}/{metrics.crm.registrations})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>Saudável</span>
                      <div className="w-3 h-3 rounded-full bg-yellow-500 ml-2"></div>
                      <span>Atenção</span>
                      <div className="w-3 h-3 rounded-full bg-red-500 ml-2"></div>
                      <span>Crítico</span>
                    </div>
                  </div>
                </div>
              </div>
              </div>

              {/* OLD VERTICAL LAYOUT - KEEPING FOR REFERENCE BUT HIDDEN */}
              <div className="space-y-4 hidden">
                {/* SEO Stage 1: Impressões → Cliques */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                    <div className="flex items-center gap-3">
                      <Eye className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="text-xs text-gray-600">Impressões (Google)</div>
                        <div className="text-xl font-bold text-gray-900">
                          {metrics.seo.impressions.toLocaleString('pt-BR')}
                        </div>
                        <div className="text-xs text-gray-500">Posição: {metrics.seo.avgPosition}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center px-3">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                    <div className={`text-sm font-bold ${getHealthColor(getHealthStatus(metrics.conversions.impressionToClick, 3))} px-2 py-1 rounded mt-1`}>
                      {metrics.conversions.impressionToClick.toFixed(1)}%
                    </div>
                  </div>

                  <div className="flex-1 bg-green-50 rounded-lg p-4 border-2 border-green-200">
                    <div className="flex items-center gap-3">
                      <MousePointerClick className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="text-xs text-gray-600">Cliques (Google)</div>
                        <div className="text-xl font-bold text-gray-900">
                          {metrics.seo.clicks.toLocaleString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* NEW Stage: Cliques → Cadastros Totais */}
                <div className="flex items-center gap-4">
                  <div className="flex-1" />
                  <div className="flex flex-col items-center justify-center px-3">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                    <div className={`text-sm font-bold ${getHealthColor(getHealthStatus(metrics.conversions.clickToRegistration, 8))} px-2 py-1 rounded mt-1`}>
                      {metrics.conversions.clickToRegistration.toFixed(1)}%
                    </div>
                  </div>

                  <div className="flex-1 bg-indigo-50 rounded-lg p-4 border-2 border-indigo-200">
                    <div className="flex items-center gap-3">
                      <UserPlus className="h-5 w-5 text-indigo-600" />
                      <div>
                        <div className="text-xs text-gray-600">Cadastros Totais</div>
                        <div className="text-xl font-bold text-gray-900">
                          {metrics.crm.registrations.toLocaleString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CRM Stage 1: Cadastros → Novo */}
                <div className="flex items-center gap-4">
                  <div className="flex-1" />
                  <div className="flex flex-col items-center justify-center px-3">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                    <div className={`text-sm font-bold ${getHealthColor(getHealthStatus(metrics.conversions.novoToContatado, 95))} px-2 py-1 rounded mt-1`}>
                      100%
                    </div>
                  </div>

                  <div className="flex-1 bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
                    <div className="flex items-center gap-3">
                      <UserPlus className="h-5 w-5 text-purple-600" />
                      <div>
                        <div className="text-xs text-gray-600">Novo (Cadastros)</div>
                        <div className="text-xl font-bold text-gray-900">
                          {metrics.crm.statusBreakdown.novo.toLocaleString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CRM Stage 2: Novo → Contatado */}
                <div className="flex items-center gap-4">
                  <div className="flex-1" />
                  <div className="flex flex-col items-center justify-center px-3">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                    <div className={`text-sm font-bold ${getHealthColor(getHealthStatus(metrics.conversions.novoToContatado, 95))} px-2 py-1 rounded mt-1`}>
                      {metrics.conversions.novoToContatado.toFixed(1)}%
                    </div>
                    {metrics.transitionTimes.novo_to_contatado && (
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {metrics.transitionTimes.novo_to_contatado.avgHours.toFixed(1)}h
                      </div>
                    )}
                  </div>

                  <div className="flex-1 bg-cyan-50 rounded-lg p-4 border-2 border-cyan-200">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-cyan-600" />
                      <div>
                        <div className="text-xs text-gray-600">Contatado</div>
                        <div className="text-xl font-bold text-gray-900">
                          {metrics.crm.statusBreakdown.contatado.toLocaleString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CRM Stage 3: Contatado → Agendado */}
                <div className="flex items-center gap-4">
                  <div className="flex-1" />
                  <div className="flex flex-col items-center justify-center px-3">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                    <div className={`text-sm font-bold ${getHealthColor(getHealthStatus(metrics.conversions.contatadoToAgendado, 60))} px-2 py-1 rounded mt-1`}>
                      {metrics.conversions.contatadoToAgendado.toFixed(1)}%
                    </div>
                    {metrics.transitionTimes.contatado_to_agendado && (
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {metrics.transitionTimes.contatado_to_agendado.avgDays.toFixed(1)}d
                      </div>
                    )}
                  </div>

                  <div className="flex-1 bg-orange-50 rounded-lg p-4 border-2 border-orange-200">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-orange-600" />
                      <div>
                        <div className="text-xs text-gray-600">Agendado</div>
                        <div className="text-xl font-bold text-gray-900">
                          {metrics.crm.statusBreakdown.agendado.toLocaleString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CRM Stage 4: Agendado → Avaliação Inicial */}
                <div className="flex items-center gap-4">
                  <div className="flex-1" />
                  <div className="flex flex-col items-center justify-center px-3">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                    <div className={`text-sm font-bold ${getHealthColor(getHealthStatus(metrics.conversions.agendadoToAvaliacaoInicial, 70))} px-2 py-1 rounded mt-1`}>
                      {metrics.conversions.agendadoToAvaliacaoInicial.toFixed(1)}%
                    </div>
                    {metrics.transitionTimes.agendado_to_avaliacao_inicial && (
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {metrics.transitionTimes.agendado_to_avaliacao_inicial.avgDays.toFixed(1)}d
                      </div>
                    )}
                  </div>

                  <div className="flex-1 bg-indigo-50 rounded-lg p-4 border-2 border-indigo-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                      <div>
                        <div className="text-xs text-gray-600">Avaliação Inicial</div>
                        <div className="text-xl font-bold text-gray-900">
                          {metrics.crm.statusBreakdown.avaliacao_inicial.toLocaleString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CRM Stage 5: Avaliação Inicial → Atribuído */}
                <div className="flex items-center gap-4">
                  <div className="flex-1" />
                  <div className="flex flex-col items-center justify-center px-3">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                    <div className={`text-sm font-bold ${getHealthColor(getHealthStatus(metrics.conversions.avaliacaoInicialToAtribuido, 80))} px-2 py-1 rounded mt-1`}>
                      {metrics.conversions.avaliacaoInicialToAtribuido.toFixed(1)}%
                    </div>
                    {metrics.transitionTimes.avaliacao_inicial_to_atribuido && (
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {metrics.transitionTimes.avaliacao_inicial_to_atribuido.avgDays.toFixed(1)}d
                      </div>
                    )}
                  </div>

                  <div className="flex-1 bg-violet-50 rounded-lg p-4 border-2 border-violet-200">
                    <div className="flex items-center gap-3">
                      <UserCheck className="h-5 w-5 text-violet-600" />
                      <div>
                        <div className="text-xs text-gray-600">Atribuído</div>
                        <div className="text-xl font-bold text-gray-900">
                          {metrics.crm.statusBreakdown.atribuido.toLocaleString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CRM Stage 6: Atribuído → Convertido */}
                <div className="flex items-center gap-4">
                  <div className="flex-1" />
                  <div className="flex flex-col items-center justify-center px-3">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                    <div className={`text-sm font-bold ${getHealthColor(getHealthStatus(metrics.conversions.atribuidoToConvertido, 70))} px-2 py-1 rounded mt-1`}>
                      {metrics.conversions.atribuidoToConvertido.toFixed(1)}%
                    </div>
                    {metrics.transitionTimes.atribuido_to_convertido && (
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {metrics.transitionTimes.atribuido_to_convertido.avgDays.toFixed(1)}d
                      </div>
                    )}
                  </div>

                  <div className="flex-1 bg-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-emerald-600" />
                      <div>
                        <div className="text-xs text-gray-600">Convertido (Tratamento)</div>
                        <div className="text-xl font-bold text-gray-900">
                          {metrics.crm.statusBreakdown.convertido.toLocaleString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cancellation Summary - OLD VERTICAL VERSION */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <span className="text-sm font-medium text-gray-700">
                        Total de Cancelamentos: {metrics.crm.statusBreakdown.cancelado}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Taxa de cancelamento: <span className={`font-bold ${getHealthColor(getHealthStatus(100 - metrics.conversions.cancellationRate, 85))}`}>
                        {metrics.conversions.cancellationRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cancellation Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Análise de Cancelamentos por Etapa</CardTitle>
              <CardDescription>
                Identificação de onde os pacientes cancelam no funil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Progress bars for each cancellation stage */}
                <div className="space-y-3">
                  {metrics.cancellationBreakdown.novoToCancelado > 0 && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Novo → Cancelado</span>
                        <span className="font-medium">{metrics.cancellationBreakdown.novoToCancelado}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${(metrics.cancellationBreakdown.novoToCancelado / metrics.cancellationBreakdown.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {metrics.cancellationBreakdown.contatadoToCancelado > 0 && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Contatado → Cancelado</span>
                        <span className="font-medium">{metrics.cancellationBreakdown.contatadoToCancelado}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${(metrics.cancellationBreakdown.contatadoToCancelado / metrics.cancellationBreakdown.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {metrics.cancellationBreakdown.agendadoToCancelado > 0 && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Agendado → Cancelado</span>
                        <span className="font-medium">{metrics.cancellationBreakdown.agendadoToCancelado}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${(metrics.cancellationBreakdown.agendadoToCancelado / metrics.cancellationBreakdown.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {metrics.cancellationBreakdown.avaliacaoInicialToCancelado > 0 && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Avaliação Inicial → Cancelado</span>
                        <span className="font-medium">{metrics.cancellationBreakdown.avaliacaoInicialToCancelado}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${(metrics.cancellationBreakdown.avaliacaoInicialToCancelado / metrics.cancellationBreakdown.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {metrics.cancellationBreakdown.atribuidoToCancelado > 0 && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Atribuído → Cancelado</span>
                        <span className="font-medium">{metrics.cancellationBreakdown.atribuidoToCancelado}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${(metrics.cancellationBreakdown.atribuidoToCancelado / metrics.cancellationBreakdown.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Total summary */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">Total de Cancelamentos</span>
                    <span className="text-xl font-bold text-red-600">{metrics.cancellationBreakdown.total}</span>
                  </div>
                </div>

                {/* Insight - Identify biggest dropout stage */}
                {(() => {
                  const stages = [
                    { name: 'Novo', count: metrics.cancellationBreakdown.novoToCancelado },
                    { name: 'Contatado', count: metrics.cancellationBreakdown.contatadoToCancelado },
                    { name: 'Agendado', count: metrics.cancellationBreakdown.agendadoToCancelado },
                    { name: 'Avaliação Inicial', count: metrics.cancellationBreakdown.avaliacaoInicialToCancelado },
                    { name: 'Atribuído', count: metrics.cancellationBreakdown.atribuidoToCancelado }
                  ]
                  const maxStage = stages.reduce((max, stage) => stage.count > max.count ? stage : max, stages[0])

                  if (maxStage.count > 0) {
                    return (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-yellow-800">Gargalo Identificado</p>
                            <p className="text-xs text-yellow-700 mt-1">
                              Maior número de cancelamentos na etapa <strong>{maxStage.name}</strong> ({maxStage.count} cancelamentos,
                              {' '}{((maxStage.count / metrics.cancellationBreakdown.total) * 100).toFixed(0)}% do total).
                              Ação recomendada: investigar motivos e implementar retenção nesta fase.
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                })()}
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversão Total</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {((metrics.conversions.clickToRegistration * metrics.conversions.agendadoToAvaliacaoInicial) / 100).toFixed(2)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Cliques → Avaliação Inicial
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Impressões → Cadastros</CardTitle>
                <MousePointerClick className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {((metrics.conversions.impressionToClick * metrics.conversions.clickToRegistration) / 100).toFixed(2)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  De {metrics.seo.impressions.toLocaleString('pt-BR')} impressões
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Agendamento</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.conversions.contatadoToAgendado.toFixed(2)}%</div>
                <p className="text-xs text-muted-foreground">
                  Dos contatados agendaram
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Cancelamento</CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{metrics.conversions.cancellationRate.toFixed(2)}%</div>
                <p className="text-xs text-muted-foreground">
                  {metrics.crm.statusBreakdown.cancelado} de {metrics.crm.registrations} cadastros
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Numbers */}
          <Card>
            <CardHeader>
              <CardTitle>Números Detalhados</CardTitle>
              <CardDescription>
                Período: {metrics.period.startDate} a {metrics.period.endDate} ({metrics.period.days} dias)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-gray-700">SEO (Google Search Console)</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Impressões:</span>
                      <span className="font-medium">{metrics.seo.impressions.toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cliques:</span>
                      <span className="font-medium">{metrics.seo.clicks.toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">CTR:</span>
                      <span className="font-medium">{metrics.seo.ctr}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Posição Média:</span>
                      <span className="font-medium">{metrics.seo.avgPosition}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-gray-700">Comercial (CRM)</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cadastros:</span>
                      <span className="font-medium">{metrics.crm.registrations.toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Agendamentos:</span>
                      <span className="font-medium">{metrics.crm.appointments.toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avaliação Inicial:</span>
                      <span className="font-medium">{(metrics.crm.statusBreakdown?.avaliacao_inicial || metrics.crm.attendance).toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cancelamentos:</span>
                      <span className="font-medium text-red-600">{metrics.crm.cancellations.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  )
}
