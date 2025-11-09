"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
  RefreshCw,
  ArrowRight,
  BarChart3
} from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

interface Benchmark {
  id: number
  category: string
  metric_key: string
  metric_name: string
  metric_value: number
  metric_unit: string
  description: string | null
  source: string | null
}

interface AtmaMetrics {
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
    clickToAttendance: number
    novoToContatado?: number
    contatadoToAgendado?: number
    agendadoToAvaliacaoInicial?: number
    avaliacaoInicialToAtribuido?: number
    atribuidoToConvertido?: number
    cancellationRate: number
  }
}

interface ComparisonRow {
  metric: string
  atmaValue: number
  benchmarkValue: number
  unit: string
  difference: number
  percentDiff: number
  status: 'above' | 'average' | 'below'
  category: string
}

export default function BenchmarkMercadoPage() {
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([])
  const [atmaMetrics, setAtmaMetrics] = useState<AtmaMetrics | null>(null)
  const [comparisons, setComparisons] = useState<ComparisonRow[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('15') // days
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  useEffect(() => {
    fetchData()
  }, [period])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Calculate date range
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - parseInt(period))

      const startDateStr = startDate.toISOString().split('T')[0]
      const endDateStr = endDate.toISOString().split('T')[0]

      // Fetch benchmarks and Atma metrics in parallel
      const [benchmarksRes, metricsRes] = await Promise.all([
        fetch(`${API_URL}/market-benchmarks`),
        fetch(`${API_URL}/conversion-funnel/metrics?startDate=${startDateStr}&endDate=${endDateStr}`)
      ])

      const benchmarksData = await benchmarksRes.json()
      const metricsData = await metricsRes.json()

      if (benchmarksData.success) {
        setBenchmarks(benchmarksData.data)
      }

      if (metricsData.success) {
        setAtmaMetrics(metricsData.data)
        generateComparisons(benchmarksData.data, metricsData.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateComparisons = (benchmarksList: Benchmark[], metrics: AtmaMetrics) => {
    const rows: ComparisonRow[] = []

    // Map benchmarks to Atma metrics
    const mappings: {[key: string]: {value: number, unit: string}} = {
      'ctr_medio': { value: metrics.seo.ctr, unit: '%' },
      'posicao_media': { value: metrics.seo.avgPosition, unit: 'posição' },
      'impressao_to_click': { value: metrics.seo.ctr, unit: '%' },
      'click_to_cadastro': { value: metrics.funnel.clickToRegistration, unit: '%' },
      'cadastro_to_agendamento': { value: metrics.funnel.contatadoToAgendado || 0, unit: '%' },
      'agendamento_to_comparecimento': { value: metrics.funnel.agendadoToAvaliacaoInicial || 0, unit: '%' },
      'comparecimento_to_conversao': { value: metrics.funnel.avaliacaoInicialToAtribuido || 0, unit: '%' },
      'taxa_cancelamento': { value: metrics.funnel.cancellationRate, unit: '%' },
      'click_to_conversao': { value: metrics.funnel.clickToAttendance, unit: '%' },
    }

    benchmarksList.forEach(benchmark => {
      const mapping = mappings[benchmark.metric_key]
      if (!mapping) return

      const atmaValue = mapping.value
      const benchmarkValue = benchmark.metric_value
      const difference = atmaValue - benchmarkValue
      const percentDiff = benchmarkValue !== 0
        ? ((atmaValue - benchmarkValue) / benchmarkValue) * 100
        : 0

      // Determine status (for inverted metrics like position and cancellation)
      let status: 'above' | 'average' | 'below'
      const threshold = 5 // 5% threshold for "average"

      // Inverted metrics (lower is better)
      const isInverted = benchmark.metric_key === 'posicao_media' ||
                         benchmark.metric_key === 'taxa_cancelamento'

      if (isInverted) {
        if (percentDiff <= -threshold) status = 'above' // Lower is better
        else if (percentDiff >= threshold) status = 'below'
        else status = 'average'
      } else {
        if (percentDiff >= threshold) status = 'above'
        else if (percentDiff <= -threshold) status = 'below'
        else status = 'average'
      }

      rows.push({
        metric: benchmark.metric_name,
        atmaValue,
        benchmarkValue,
        unit: mapping.unit,
        difference,
        percentDiff,
        status,
        category: benchmark.category
      })
    })

    setComparisons(rows)
  }

  const getStatusBadge = (status: 'above' | 'average' | 'below') => {
    switch (status) {
      case 'above':
        return <Badge className="bg-green-500">Acima da média</Badge>
      case 'average':
        return <Badge className="bg-yellow-500">Na média</Badge>
      case 'below':
        return <Badge className="bg-red-500">Abaixo da média</Badge>
    }
  }

  const getStatusIcon = (status: 'above' | 'average' | 'below', percentDiff: number) => {
    if (status === 'above') {
      return <TrendingUp className="h-4 w-4 text-green-600" />
    } else if (status === 'below') {
      return <TrendingDown className="h-4 w-4 text-red-600" />
    } else {
      return <Minus className="h-4 w-4 text-yellow-600" />
    }
  }

  const filteredComparisons = categoryFilter === 'all'
    ? comparisons
    : comparisons.filter(c => c.category === categoryFilter)

  // Calculate summary stats
  const aboveCount = comparisons.filter(c => c.status === 'above').length
  const averageCount = comparisons.filter(c => c.status === 'average').length
  const belowCount = comparisons.filter(c => c.status === 'below').length
  const totalMetrics = comparisons.length

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Carregando comparações...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Benchmark de Mercado</h1>
          <p className="text-gray-600 mt-2">
            Compare a performance da Atma com os padrões do mercado de ortodontia digital
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="15">Últimos 15 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="60">Últimos 60 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Métricas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalMetrics}</div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-700">
              Acima da Média
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <div className="text-3xl font-bold text-green-600">{aboveCount}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-700">
              Na Média
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Minus className="h-6 w-6 text-yellow-600" />
              <div className="text-3xl font-bold text-yellow-600">{averageCount}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-700">
              Abaixo da Média
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-6 w-6 text-red-600" />
              <div className="text-3xl font-bold text-red-600">{belowCount}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Comparação Detalhada
              </CardTitle>
              <CardDescription>
                Performance da Atma vs. benchmarks do mercado de ortodontia digital
              </CardDescription>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                <SelectItem value="SEO">SEO</SelectItem>
                <SelectItem value="CONVERSAO">Conversão</SelectItem>
                <SelectItem value="GERAL">Geral</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Métrica</TableHead>
                <TableHead className="text-center">Atma</TableHead>
                <TableHead className="text-center">
                  <ArrowRight className="h-4 w-4 inline" />
                </TableHead>
                <TableHead className="text-center">Mercado</TableHead>
                <TableHead className="text-center">Diferença</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComparisons.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{row.metric}</div>
                      <div className="text-xs text-gray-500">{row.category}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="font-semibold text-blue-600">
                      {row.atmaValue.toFixed(2)}{row.unit}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusIcon(row.status, row.percentDiff)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="font-semibold text-gray-600">
                      {row.benchmarkValue.toFixed(2)}{row.unit}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="space-y-1">
                      <div className={`font-semibold ${
                        row.difference > 0 ? 'text-green-600' : row.difference < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {row.difference > 0 ? '+' : ''}{row.difference.toFixed(2)}{row.unit}
                      </div>
                      <div className="text-xs text-gray-500">
                        ({row.percentDiff > 0 ? '+' : ''}{row.percentDiff.toFixed(1)}%)
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(row.status)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredComparisons.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma comparação disponível para o período selecionado
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-900">
                Como interpretar os resultados?
              </p>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li><strong>Acima da média:</strong> Performance superior ao mercado (diferença {'>'} 5%)</li>
                <li><strong>Na média:</strong> Performance alinhada com o mercado (± 5%)</li>
                <li><strong>Abaixo da média:</strong> Performance inferior ao mercado (diferença {'<'} -5%)</li>
                <li>Para métricas como <em>Posição Média</em> e <em>Taxa de Cancelamento</em>, valores menores são melhores</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
