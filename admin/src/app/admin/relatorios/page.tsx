"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Download,
  Target,
  Award,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { useReports } from '@/hooks/useApi'

export default function RelatoriosPage() {
  const { data: reportsData, loading, error } = useReports()
  
  // Use API data or fallback to defaults
  const monthlyData = reportsData?.data?.monthlyData || []
  const topOrthodontists = reportsData?.data?.topOrthodontists || []
  const kpis = reportsData?.data || {
    totalRevenue: 0,
    revenueGrowth: '+0%',
    newPatients: 0,
    patientsGrowth: '+0%',
    conversionRate: 0,
    conversionGrowth: '+0%',
    averageRating: 4.8,
    ratingLabel: 'Carregando...'
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600 mt-2">Acompanhe o desempenho e métricas do negócio</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download className="mr-2 h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>

      {/* Connection Status */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800">Erro ao carregar relatórios: {error}</span>
            <span className="text-sm text-red-600 ml-auto">Usando dados locais</span>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Carregando relatórios...</span>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {kpis.totalRevenue ? kpis.totalRevenue.toLocaleString() : '0'}
                </div>
                <p className="text-xs text-green-600">{kpis.revenueGrowth} vs período anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Novos Pacientes</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpis.newPatients || 0}</div>
                <p className="text-xs text-blue-600">{kpis.patientsGrowth} este mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                <Target className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpis.conversionRate || 0}%</div>
                <p className="text-xs text-purple-600">{kpis.conversionGrowth} vs mês anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Satisfação Média</CardTitle>
                <Award className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpis.averageRating || 4.8}</div>
                <p className="text-xs text-yellow-600">⭐ {kpis.ratingLabel || 'Excelente avaliação'}</p>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {!loading && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
            <TabsTrigger value="operational">Operacional</TabsTrigger>
            <TabsTrigger value="orthodontists">Ortodontistas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Growth Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Crescimento Mensal
                  </CardTitle>
                  <CardDescription>Evolução de pacientes nos últimos 6 meses</CardDescription>
                </CardHeader>
                <CardContent>
                  {monthlyData.length > 0 ? (
                    <div className="h-64 flex items-end justify-between gap-2 p-4">
                      {monthlyData.map((data) => {
                        const maxPatients = Math.max(...monthlyData.map(d => d.patients)) || 1;
                        return (
                          <div key={data.month} className="flex flex-col items-center gap-2">
                            <div 
                              className="w-8 bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                              style={{ height: `${Math.max(8, (data.patients / maxPatients) * 200)}px` }}
                              title={`${data.patients} pacientes`}
                            />
                            <span className="text-xs font-medium">{data.month}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center">
                      <p className="text-gray-500">Sem dados disponíveis</p>
                    </div>
                  )}
                  <div className="flex justify-center gap-4 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>Novos Pacientes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Receita por Mês
                  </CardTitle>
                  <CardDescription>Faturamento mensal estimado (R$1500/paciente)</CardDescription>
                </CardHeader>
                <CardContent>
                  {monthlyData.length > 0 ? (
                    <div className="h-64 flex items-end justify-between gap-2 p-4">
                      {monthlyData.map((data) => {
                        const maxRevenue = Math.max(...monthlyData.map(d => d.revenue)) || 1;
                        return (
                          <div key={data.month} className="flex flex-col items-center gap-2">
                            <div 
                              className="w-8 bg-green-500 rounded-t transition-all hover:bg-green-600"
                              style={{ height: `${Math.max(8, (data.revenue / maxRevenue) * 200)}px` }}
                              title={`R$ ${data.revenue.toLocaleString()}`}
                            />
                            <span className="text-xs font-medium">{data.month}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center">
                      <p className="text-gray-500">Sem dados disponíveis</p>
                    </div>
                  )}
                  <div className="flex justify-center gap-4 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>Receita (R$)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orthodontists" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top 5 Ortodontistas</CardTitle>
                <CardDescription>Ranking por número de pacientes e receita gerada</CardDescription>
              </CardHeader>
              <CardContent>
                {topOrthodontists.length > 0 ? (
                  <div className="space-y-4">
                    {topOrthodontists.map((orthodontist, idx) => (
                      <div key={`${orthodontist.name}-${idx}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 font-bold rounded-full">
                            {idx + 1}
                          </div>
                          <div>
                            <h3 className="font-medium">{orthodontist.name}</h3>
                            <p className="text-sm text-gray-600">{orthodontist.patients} pacientes</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">R$ {orthodontist.revenue.toLocaleString()}</p>
                          <div className="flex items-center gap-1">
                            <span className="text-sm">⭐ {orthodontist.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-gray-500">Nenhum ortodontista ativo encontrado</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Receita por Categoria</CardTitle>
                <CardDescription>Distribuição do faturamento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Tratamentos Ativos</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded">
                      <div className="w-3/4 h-full bg-blue-500 rounded"></div>
                    </div>
                    <span className="font-medium">75%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Consultas</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded">
                      <div className="w-1/5 h-full bg-green-500 rounded"></div>
                    </div>
                    <span className="font-medium">20%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Outros</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded">
                      <div className="w-1/20 h-full bg-purple-500 rounded"></div>
                    </div>
                    <span className="font-medium">5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Metas do Trimestre</CardTitle>
                <CardDescription>Progresso das metas estabelecidas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span>Novos Pacientes</span>
                    <span className="text-sm font-medium">
                      {reportsData?.data?.quarterGoals?.newPatients?.current || 0}/
                      {reportsData?.data?.quarterGoals?.newPatients?.target || 200}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded">
                    <div 
                      className="h-full bg-blue-500 rounded" 
                      style={{ 
                        width: `${Math.min(100, reportsData?.data?.quarterGoals?.newPatients?.percentage || 0)}%` 
                      }}
                    ></div>
                  </div>
                  <Badge className="mt-2 bg-blue-100 text-blue-800">
                    {reportsData?.data?.quarterGoals?.newPatients?.percentage || 0}%
                  </Badge>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span>Receita</span>
                    <span className="text-sm font-medium">
                      R$ {Math.round((reportsData?.data?.quarterGoals?.revenue?.current || 0) / 1000)}k/
                      {Math.round((reportsData?.data?.quarterGoals?.revenue?.target || 600000) / 1000)}k
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded">
                    <div 
                      className="h-full bg-green-500 rounded" 
                      style={{ 
                        width: `${Math.min(100, reportsData?.data?.quarterGoals?.revenue?.percentage || 0)}%` 
                      }}
                    ></div>
                  </div>
                  <Badge className="mt-2 bg-green-100 text-green-800">
                    {reportsData?.data?.quarterGoals?.revenue?.percentage || 0}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operational" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Consultas Mensais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportsData?.data?.monthlyConsultations || 0}</div>
                <p className="text-sm text-gray-600">Estimativa baseada em leads</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Taxa de No-show</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportsData?.data?.noShowRate || 0}%</div>
                <p className="text-sm text-green-600">Métrica padrão do setor</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tempo Médio Tratamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportsData?.data?.averageTreatmentTime || 0} meses</div>
                <p className="text-sm text-gray-600">Estimativa padrão</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}