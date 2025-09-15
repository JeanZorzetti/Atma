"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  BarChart3,
  Users,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  Target,
  DollarSign,
  Calendar,
  Globe,
  Smartphone,
  Monitor,
  RefreshCw,
  Download,
  Filter,
  Share2,
  Activity,
  Loader2,
  AlertCircle
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMarketingMetrics, useGoogleAnalytics, useFacebookAds, useInstagramInsights, useEmailMarketing, useWhatsAppMetrics, useCampaignPerformance, useLeadSourceAnalysis } from '@/hooks/useApi'
import { useToast } from '@/hooks/use-toast'

// Fallback data para quando as APIs não estiverem disponíveis
const fallbackMetrics = {
  overview: {
    totalVisits: 12547,
    conversionRate: 3.2,
    leadGeneration: 401,
    revenue: 89420,
    growth: {
      visits: 12.5,
      conversion: -2.1,
      leads: 18.7,
      revenue: 25.3
    }
  },
  traffic: {
    sources: [
      { name: 'Google Ads', visits: 4521, percentage: 36, growth: 15.2 },
      { name: 'Facebook Ads', visits: 3012, percentage: 24, growth: -5.3 },
      { name: 'Orgânico', visits: 2876, percentage: 23, growth: 8.7 },
      { name: 'Instagram', visits: 1245, percentage: 10, growth: 22.1 },
      { name: 'Direto', visits: 893, percentage: 7, growth: 3.4 }
    ],
    devices: [
      { name: 'Mobile', visitors: 7528, percentage: 60 },
      { name: 'Desktop', visitors: 3762, percentage: 30 },
      { name: 'Tablet', visitors: 1257, percentage: 10 }
    ]
  },
  leads: {
    bySource: [
      { source: 'Landing Page', count: 156, conversion: 4.2 },
      { source: 'Google Ads', count: 134, conversion: 3.8 },
      { source: 'Facebook', count: 78, conversion: 2.9 },
      { source: 'Instagram', count: 33, conversion: 2.1 }
    ],
    byStatus: [
      { status: 'Novo', count: 201, percentage: 50.1 },
      { status: 'Contatado', count: 120, percentage: 29.9 },
      { status: 'Agendado', count: 52, percentage: 13.0 },
      { status: 'Convertido', count: 28, percentage: 7.0 }
    ]
  },
  campaigns: [
    {
      name: 'Campanha Invisalign Q1',
      status: 'Ativa',
      budget: 15000,
      spent: 8420,
      clicks: 2341,
      impressions: 89560,
      ctr: 2.61,
      cpc: 3.59,
      conversions: 87
    },
    {
      name: 'Retargeting Ortodontistas',
      status: 'Ativa',
      budget: 5000,
      spent: 3240,
      clicks: 892,
      impressions: 45230,
      ctr: 1.97,
      cpc: 3.63,
      conversions: 23
    },
    {
      name: 'Brand Awareness',
      status: 'Pausada',
      budget: 8000,
      spent: 8000,
      clicks: 1560,
      impressions: 125680,
      ctr: 1.24,
      cpc: 5.13,
      conversions: 41
    }
  ]
}

export default function MarketingDashboard() {
  const [dateRange, setDateRange] = useState("30d")
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  // Hook principal para métricas de marketing
  const { data: marketingData, loading: marketingLoading, error: marketingError, refetch: refetchMarketing } = useMarketingMetrics(dateRange)

  // Hooks para dados específicos (podem ser null se API não disponível)
  const { data: googleAnalytics, loading: gaLoading } = useGoogleAnalytics(['sessions', 'users', 'bounceRate'], dateRange)
  const { data: facebookAds, loading: fbLoading } = useFacebookAds(dateRange)
  const { data: instagramInsights, loading: igLoading } = useInstagramInsights(dateRange)
  const { data: emailMarketing, loading: emailLoading } = useEmailMarketing(dateRange)
  const { data: whatsappMetrics, loading: waLoading } = useWhatsAppMetrics(dateRange)
  const { data: campaignPerformance, loading: campaignLoading } = useCampaignPerformance()
  const { data: leadSourceAnalysis, loading: leadLoading } = useLeadSourceAnalysis(dateRange)

  // Usar dados reais se disponíveis, senão usar fallback
  const metrics = marketingData?.data || fallbackMetrics

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await refetchMarketing()
      toast({
        title: "Dados atualizados!",
        description: "As métricas de marketing foram atualizadas com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar os dados. Usando dados de exemplo.",
        variant: "destructive"
      })
    } finally {
      setRefreshing(false)
    }
  }

  // Loading state
  if (marketingLoading && !metrics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando métricas de marketing...</p>
        </div>
      </div>
    )
  }

  const MetricCard = ({ title, value, change, icon: Icon, prefix = '', suffix = '' }: {
    title: string
    value: number | string
    change?: number
    icon: any
    prefix?: string
    suffix?: string
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">
              {prefix}{typeof value === 'number' ? value.toLocaleString('pt-BR') : value}{suffix}
            </p>
            {change !== undefined && (
              <p className={`text-xs flex items-center mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {Math.abs(change)}% vs período anterior
              </p>
            )}
          </div>
          <Icon className="h-8 w-8 text-blue-600" />
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketing Dashboard</h1>
          <p className="text-gray-600 mt-2">Análise completa de performance de marketing digital</p>
        </div>
        <div className="flex gap-3">
          {marketingError && (
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Usando dados simulados</span>
            </div>
          )}
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
              <SelectItem value="1y">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing || marketingLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing || marketingLoading ? 'animate-spin' : ''}`} />
            {refreshing || marketingLoading ? 'Atualizando...' : 'Atualizar'}
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Visitantes Únicos"
          value={metrics.overview.totalVisits}
          change={metrics.overview.growth.visits}
          icon={Users}
        />
        <MetricCard
          title="Taxa de Conversão"
          value={metrics.overview.conversionRate}
          change={metrics.overview.growth.conversion}
          icon={Target}
          suffix="%"
        />
        <MetricCard
          title="Leads Gerados"
          value={metrics.overview.leadGeneration}
          change={metrics.overview.growth.leads}
          icon={TrendingUp}
        />
        <MetricCard
          title="Receita Atribuída"
          value={metrics.overview.revenue}
          change={metrics.overview.growth.revenue}
          icon={DollarSign}
          prefix="R$ "
        />
      </div>

      <Tabs defaultValue="traffic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="traffic">Tráfego</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="traffic" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Fontes de Tráfego
                </CardTitle>
                <CardDescription>Últimos {dateRange === '30d' ? '30 dias' : dateRange}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.traffic.sources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{source.name}</span>
                          <span className="text-sm text-gray-500">{source.visits.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${source.percentage}%` }}
                          />
                        </div>
                      </div>
                      <span className={`text-xs ml-3 ${source.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {source.growth >= 0 ? '+' : ''}{source.growth}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Dispositivos
                </CardTitle>
                <CardDescription>Distribuição por tipo de dispositivo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.traffic.devices.map((device, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {device.name === 'Mobile' && <Smartphone className="h-4 w-4 text-blue-600" />}
                        {device.name === 'Desktop' && <Monitor className="h-4 w-4 text-blue-600" />}
                        {device.name === 'Tablet' && <Monitor className="h-4 w-4 text-blue-600" />}
                        <span className="text-sm font-medium">{device.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{device.visitors.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{device.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leads" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Leads por Fonte
                </CardTitle>
                <CardDescription>Performance de conversão por canal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.leads.bySource.map((lead, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{lead.source}</div>
                        <div className="text-sm text-gray-500">Taxa: {lead.conversion}%</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">{lead.count}</div>
                        <div className="text-xs text-gray-500">leads</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Status dos Leads
                </CardTitle>
                <CardDescription>Distribuição por estágio do funil</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.leads.byStatus.map((status, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{status.status}</span>
                          <span className="text-sm text-gray-500">{status.count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${status.percentage}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs ml-3 text-gray-600">
                        {status.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Campanhas Ativas
              </CardTitle>
              <CardDescription>Performance das campanhas publicitárias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.campaigns.map((campaign, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{campaign.name}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          campaign.status === 'Ativa' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {campaign.status}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">R$ {campaign.spent.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">de R$ {campaign.budget.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold">{campaign.impressions.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Impressões</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold">{campaign.clicks.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Cliques</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold">{campaign.ctr}%</div>
                        <div className="text-xs text-gray-500">CTR</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold">R$ {campaign.cpc}</div>
                        <div className="text-xs text-gray-500">CPC</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-green-600">{campaign.conversions}</div>
                        <div className="text-xs text-gray-500">Conversões</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Google Analytics
                </CardTitle>
                <CardDescription>Métricas de comportamento do usuário</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">2:34</div>
                      <div className="text-sm text-gray-600">Tempo Médio</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">3.2</div>
                      <div className="text-sm text-gray-600">Páginas/Sessão</div>
                    </div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">42%</div>
                    <div className="text-sm text-gray-600">Taxa de Rejeição</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Redes Sociais
                </CardTitle>
                <CardDescription>Engagement e alcance social</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-semibold">Facebook</div>
                      <div className="text-sm text-gray-600">12.5K seguidores</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">3.2%</div>
                      <div className="text-xs text-gray-500">Engagement</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                    <div>
                      <div className="font-semibold">Instagram</div>
                      <div className="text-sm text-gray-600">8.9K seguidores</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-pink-600">5.7%</div>
                      <div className="text-xs text-gray-500">Engagement</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}