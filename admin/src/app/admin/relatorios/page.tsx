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
  Award
} from 'lucide-react'

const monthlyData = [
  { month: 'Jan', patients: 45, revenue: 67500, consultations: 180 },
  { month: 'Fev', patients: 52, revenue: 78000, consultations: 208 },
  { month: 'Mar', patients: 61, revenue: 91500, consultations: 244 },
  { month: 'Abr', patients: 58, revenue: 87000, consultations: 232 },
  { month: 'Mai', patients: 67, revenue: 100500, consultations: 268 },
  { month: 'Jun', patients: 72, revenue: 108000, consultations: 288 }
]

const topOrthodontists = [
  { name: 'Dr. João Santos', patients: 45, revenue: 67500, rating: 4.9 },
  { name: 'Dra. Ana Costa', patients: 38, revenue: 57000, rating: 4.8 },
  { name: 'Dr. Carlos Lima', patients: 32, revenue: 48000, rating: 4.7 },
  { name: 'Dra. Maria Oliveira', patients: 29, revenue: 43500, rating: 4.8 },
  { name: 'Dr. Pedro Silva', patients: 25, revenue: 37500, rating: 4.6 }
]

export default function RelatoriosPage() {
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 532.500</div>
            <p className="text-xs text-green-600">+12.5% vs período anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Pacientes</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">335</div>
            <p className="text-xs text-blue-600">+8.2% este semestre</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68.5%</div>
            <p className="text-xs text-purple-600">+3.1% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfação Média</CardTitle>
            <Award className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-yellow-600">⭐ Excelente avaliação</p>
          </CardContent>
        </Card>
      </div>

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
                <CardDescription>Evolução de pacientes e receita</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2 p-4">
                  {monthlyData.map((data) => (
                    <div key={data.month} className="flex flex-col items-center gap-2">
                      <div 
                        className="w-8 bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                        style={{ height: `${(data.patients / 80) * 200}px` }}
                        title={`${data.patients} pacientes`}
                      />
                      <span className="text-xs font-medium">{data.month}</span>
                    </div>
                  ))}
                </div>
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
                <CardDescription>Faturamento mensal em R$</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2 p-4">
                  {monthlyData.map((data) => (
                    <div key={data.month} className="flex flex-col items-center gap-2">
                      <div 
                        className="w-8 bg-green-500 rounded-t transition-all hover:bg-green-600"
                        style={{ height: `${(data.revenue / 120000) * 200}px` }}
                        title={`R$ ${data.revenue.toLocaleString()}`}
                      />
                      <span className="text-xs font-medium">{data.month}</span>
                    </div>
                  ))}
                </div>
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
              <div className="space-y-4">
                {topOrthodontists.map((orthodontist, idx) => (
                  <div key={orthodontist.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
                    <span className="text-sm font-medium">185/200</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded">
                    <div className="w-11/12 h-full bg-blue-500 rounded"></div>
                  </div>
                  <Badge className="mt-2 bg-blue-100 text-blue-800">92.5%</Badge>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span>Receita</span>
                    <span className="text-sm font-medium">R$ 532k/600k</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded">
                    <div className="w-5/6 h-full bg-green-500 rounded"></div>
                  </div>
                  <Badge className="mt-2 bg-green-100 text-green-800">88.7%</Badge>
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
                <div className="text-2xl font-bold">1,420</div>
                <p className="text-sm text-gray-600">+15% vs mês anterior</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Taxa de No-show</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2%</div>
                <p className="text-sm text-green-600">-1.1% melhoria</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tempo Médio Tratamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18 meses</div>
                <p className="text-sm text-gray-600">Dentro do esperado</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}