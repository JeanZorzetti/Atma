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
  Target,
  DollarSign,
  Globe,
  Smartphone,
  Monitor,
  RefreshCw,
  Download,
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
import { useMarketingMetrics } from '@/hooks/useApi'
import { useToast } from '@/hooks/use-toast'

export default function MarketingDashboard() {
  const [dateRange, setDateRange] = useState("30d")
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  // Hook principal para métricas de marketing
  const { data: marketingData, loading: marketingLoading, error: marketingError, refetch: refetchMarketing } = useMarketingMetrics(dateRange)

  // Hooks para dados específicos (serão integrados quando APIs estiverem disponíveis)
  // const { data: googleAnalytics } = useGoogleAnalytics(['sessions', 'users', 'bounceRate'], dateRange)
  // const { data: facebookAds } = useFacebookAds(dateRange)
  // const { data: instagramInsights } = useInstagramInsights(dateRange)
  // const { data: emailMarketing } = useEmailMarketing(dateRange)
  // const { data: whatsappMetrics } = useWhatsAppMetrics(dateRange)
  // const { data: campaignPerformance } = useCampaignPerformance()
  // const { data: leadSourceAnalysis } = useLeadSourceAnalysis(dateRange)

  // Usar apenas dados reais da API
  const metrics = marketingData?.data

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await refetchMarketing()
      toast({
        title: "Dados atualizados!",
        description: "As métricas de marketing foram atualizadas com sucesso.",
      })
    } catch {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar os dados. Verifique a conexão com a API.",
        variant: "destructive"
      })
    } finally {
      setRefreshing(false)
    }
  }

  // Loading state
  if (marketingLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando métricas de marketing...</p>
        </div>
      </div>
    )
  }

  // No data state
  if (!metrics) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Marketing Dashboard</h1>
            <p className="text-gray-600 mt-2">Análise completa de performance de marketing digital</p>
          </div>
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Tentando...' : 'Tentar Novamente'}
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum dado disponível</h3>
          <p className="text-gray-600 text-center max-w-md mb-4">
            Não foi possível carregar as métricas de marketing. Verifique se as APIs estão configuradas corretamente.
          </p>
          <Button onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Carregando...' : 'Recarregar Dados'}
          </Button>
        </div>
      </div>
    )
  }

  const MetricCard = ({ title, value, change, icon: Icon, prefix = '', suffix = '' }: {
    title: string
    value: number | string
    change?: number
    icon: React.ComponentType<{ className?: string }>
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
            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Erro ao carregar dados</span>
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
                  {metrics.traffic.sources.length > 0 ? (
                    metrics.traffic.sources.map((source, index) => (
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
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Globe className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">Google Analytics não configurado</p>
                      <p className="text-xs">Configure as integrações para ver dados de tráfego</p>
                    </div>
                  )}
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
                  {metrics.traffic.devices.length > 0 ? (
                    metrics.traffic.devices.map((device, index) => (
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
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Monitor className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">Dados de dispositivos não disponíveis</p>
                      <p className="text-xs">Configure Google Analytics para ver dados de dispositivos</p>
                    </div>
                  )}
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
                {metrics.campaigns.length > 0 ? (
                  metrics.campaigns.map((campaign, index) => (
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
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhuma campanha ativa</h3>
                    <p className="text-sm mb-2">Configure suas integrações para ver campanhas:</p>
                    <div className="text-xs space-y-1">
                      <p>• Google Ads</p>
                      <p>• Facebook Ads</p>
                      <p>• LinkedIn Ads</p>
                    </div>
                  </div>
                )}
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
                  {metrics.analytics.avgSessionDuration || metrics.analytics.pagesPerSession || metrics.analytics.bounceRate ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{metrics.analytics.avgSessionDuration || '0:00'}</div>
                          <div className="text-sm text-gray-600">Tempo Médio</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{metrics.analytics.pagesPerSession || '0'}</div>
                          <div className="text-sm text-gray-600">Páginas/Sessão</div>
                        </div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{metrics.analytics.bounceRate || '0'}%</div>
                        <div className="text-sm text-gray-600">Taxa de Rejeição</div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Eye className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">Google Analytics não configurado</p>
                      <p className="text-xs">Configure Google Analytics para ver métricas de comportamento</p>
                    </div>
                  )}
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
                  {metrics.analytics.socialMedia.length > 0 ? (
                    metrics.analytics.socialMedia.map((social, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <div className="font-semibold">{social.platform}</div>
                          <div className="text-sm text-gray-600">{social.followers?.toLocaleString()} seguidores</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">{social.engagement}%</div>
                          <div className="text-xs text-gray-500">Engagement</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Share2 className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">Redes sociais não configuradas</p>
                      <p className="text-xs">Configure as integrações para ver métricas sociais:</p>
                      <div className="text-xs mt-2 space-y-1">
                        <p>• Facebook Business</p>
                        <p>• Instagram Business</p>
                        <p>• LinkedIn Company</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}