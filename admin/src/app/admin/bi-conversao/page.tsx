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
  TrendingDown,
  RefreshCw,
  Loader2,
  ArrowRight
} from 'lucide-react'
import { apiService } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

interface FunnelMetrics {
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
    statusBreakdown?: {
      novo: number
      contatado: number
      agendado: number
      avaliacao_inicial: number
      atribuido: number
      convertido: number
      cancelado: number
    }
  }
  funnel: {
    impressionToClick: number
    clickToRegistration: number
    registrationToAppointment: number
    appointmentToAttendance: number
    impressionToRegistration: number
    clickToAttendance: number
    cancellationRate: number
    // New B2C detailed funnel
    novoToContatado?: number
    contatadoToAgendado?: number
    agendadoToAvaliacaoInicial?: number
    avaliacaoInicialToAtribuido?: number
    atribuidoToConvertido?: number
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
  const [metrics, setMetrics] = useState<FunnelMetrics | null>(null)

  // Default date range: last 15 days (accounting for GSC delay)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 18),
    to: subDays(new Date(), 3),
  })

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      fetchMetrics()
    }
  }, [dateRange])

  const fetchMetrics = async () => {
    if (!dateRange?.from || !dateRange?.to) return

    setLoading(true)
    try {
      const startDate = dateRange.from.toISOString().split('T')[0]
      const endDate = dateRange.to.toISOString().split('T')[0]

      const response = await apiService.conversionFunnel.getFunnelMetrics(startDate, endDate) as FunnelMetrics

      setMetrics(response)
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
          {/* Funnel Visualization */}
          <Card>
            <CardHeader>
              <CardTitle>Funil de Conversão</CardTitle>
              <CardDescription>
                Jornada completa do usuário: da busca no Google até a avaliação inicial
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Step 1: Impressões → Cliques */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-blue-100 rounded-lg p-6 border-2 border-blue-300">
                    <div className="flex items-center gap-3 mb-2">
                      <Eye className="h-6 w-6 text-blue-600" />
                      <div>
                        <div className="text-sm text-gray-600">Impressões (Google)</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {metrics.seo.impressions.toLocaleString('pt-BR')}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Posição média: {metrics.seo.avgPosition}
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center px-4">
                    <ArrowRight className="h-8 w-8 text-gray-400 mb-2" />
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        {metrics.funnel.impressionToClick}%
                      </div>
                      <div className="text-xs text-gray-500">CTR</div>
                    </div>
                  </div>

                  <div className="flex-1 bg-green-100 rounded-lg p-6 border-2 border-green-300">
                    <div className="flex items-center gap-3 mb-2">
                      <MousePointerClick className="h-6 w-6 text-green-600" />
                      <div>
                        <div className="text-sm text-gray-600">Cliques (Google)</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {metrics.seo.clicks.toLocaleString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2: Cliques → Cadastros */}
                <div className="flex items-center gap-4">
                  <div className="flex-1" />

                  <div className="flex flex-col items-center justify-center px-4">
                    <ArrowRight className="h-8 w-8 text-gray-400 mb-2" />
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {metrics.funnel.clickToRegistration}%
                      </div>
                      <div className="text-xs text-gray-500">Taxa conversão</div>
                    </div>
                  </div>

                  <div className="flex-1 bg-purple-100 rounded-lg p-6 border-2 border-purple-300">
                    <div className="flex items-center gap-3">
                      <UserPlus className="h-6 w-6 text-purple-600" />
                      <div>
                        <div className="text-sm text-gray-600">Cadastros (CRM)</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {metrics.crm.registrations.toLocaleString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3: Cadastros → Agendamentos */}
                <div className="flex items-center gap-4">
                  <div className="flex-1" />

                  <div className="flex flex-col items-center justify-center px-4">
                    <ArrowRight className="h-8 w-8 text-gray-400 mb-2" />
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">
                        {metrics.funnel.registrationToAppointment}%
                      </div>
                      <div className="text-xs text-gray-500">Agendaram</div>
                    </div>
                  </div>

                  <div className="flex-1 bg-orange-100 rounded-lg p-6 border-2 border-orange-300">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-6 w-6 text-orange-600" />
                      <div>
                        <div className="text-sm text-gray-600">Agendamentos</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {metrics.crm.appointments.toLocaleString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 4: Agendamentos → Avaliação Inicial */}
                <div className="flex items-center gap-4">
                  <div className="flex-1" />

                  <div className="flex flex-col items-center justify-center px-4">
                    <ArrowRight className="h-8 w-8 text-gray-400 mb-2" />
                    <div className="text-center">
                      <div className="text-lg font-bold text-indigo-600">
                        {metrics.funnel.agendadoToAvaliacaoInicial || metrics.funnel.appointmentToAttendance}%
                      </div>
                      <div className="text-xs text-gray-500">Compareceram</div>
                    </div>
                  </div>

                  <div className="flex-1 bg-indigo-100 rounded-lg p-6 border-2 border-indigo-300">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle2 className="h-6 w-6 text-indigo-600" />
                      <div>
                        <div className="text-sm text-gray-600">Avaliação Inicial</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {metrics.crm.statusBreakdown?.avaliacao_inicial || metrics.crm.attendance}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <XCircle className="h-3 w-3" />
                      {metrics.crm.cancellations} cancelamentos ({metrics.funnel.cancellationRate}%)
                    </div>
                  </div>
                </div>
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
                <div className="text-2xl font-bold">{metrics.funnel.clickToAttendance}%</div>
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
                <div className="text-2xl font-bold">{metrics.funnel.impressionToRegistration}%</div>
                <p className="text-xs text-muted-foreground">
                  De {metrics.seo.impressions.toLocaleString()} impressões
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Agendamento</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.funnel.registrationToAppointment}%</div>
                <p className="text-xs text-muted-foreground">
                  Dos cadastrados agendaram
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Cancelamento</CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{metrics.funnel.cancellationRate}%</div>
                <p className="text-xs text-muted-foreground">
                  {metrics.crm.cancellations} de {metrics.crm.appointments} agendamentos
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
