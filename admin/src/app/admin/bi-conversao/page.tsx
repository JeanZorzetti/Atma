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
          {/* Funnel Visualization - Complete 8-Stage Journey */}
          <Card>
            <CardHeader>
              <CardTitle>Funil de Conversão Completo</CardTitle>
              <CardDescription>
                Jornada completa: Impressões → Cliques → Cadastros → Novo → Contatado → Agendado → Avaliação Inicial → Atribuído → Convertido
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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

                {/* Cancellation Summary */}
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
