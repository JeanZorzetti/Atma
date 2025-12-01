import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { ScoreCard } from '@/components/portal/ScoreCard'
import { QuickActions } from '@/components/portal/QuickActions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DollarSign,
  Clock,
  Activity,
  TrendingUp,
  Calendar,
  FileText
} from 'lucide-react'

export default async function PortalDashboard() {
  const user = await currentUser()

  if (!user) {
    redirect('/portal/entrar')
  }

  // TODO: Buscar dados reais do relatório do usuário do banco de dados
  // Por enquanto, dados de exemplo
  const dadosRelatorio = {
    score: 8.5,
    nomeCompleto: user.firstName + ' ' + (user.lastName || ''),
    custoEstimado: 5990,
    duracaoMeses: 12,
    complexidade: 'Moderada',
    status: 'Em Análise',
    dataGeracao: new Date().toISOString(),
  }

  return (
    <div className="p-4 md:p-8 space-y-8 pb-24 md:pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Olá, {user.firstName}! 👋
        </h1>
        <p className="text-gray-600 text-lg">
          Bem-vindo ao seu Portal do Paciente Atma Aligner
        </p>
      </div>

      {/* Score Card - Destaque Principal */}
      <ScoreCard
        score={dadosRelatorio.score}
        nomeCompleto={dadosRelatorio.nomeCompleto}
      />

      {/* Cards de Resumo - Grid 2x2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Custo Estimado */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Investimento
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              R$ {dadosRelatorio.custoEstimado.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Ou 12x de R$ {Math.round(dadosRelatorio.custoEstimado / 12).toLocaleString('pt-BR')}
            </p>
          </CardContent>
        </Card>

        {/* Duração */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Duração Estimada
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {dadosRelatorio.duracaoMeses} meses
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Baseado na complexidade do caso
            </p>
          </CardContent>
        </Card>

        {/* Complexidade */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Complexidade
            </CardTitle>
            <Activity className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {dadosRelatorio.complexidade}
            </div>
            <div className="mt-1">
              <Badge variant="outline" className="border-amber-200 text-amber-700 bg-amber-50">
                Nível Intermediário
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Status do Caso
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {dadosRelatorio.status}
            </div>
            <div className="mt-1">
              <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                Aguardando Aprovação
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Próximos Passos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Próximos Passos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Explore Seu Relatório</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Navegue pelas seções para entender melhor sua análise e plano de tratamento
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Agende Sua Consulta</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Marque uma avaliação presencial com ortodontista credenciado
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Baixe Seu PDF</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Baixe a versão completa do relatório para compartilhar com seu dentista
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informativo sobre o Portal */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <FileText className="h-8 w-8 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold mb-2">Seu Relatório Completo de Viabilidade</h3>
              <p className="text-blue-100 mb-4">
                Este portal contém todas as informações sobre sua análise ortodôntica personalizada.
                Explore cada seção para entender melhor seu caso e os próximos passos.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  Análise Detalhada
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  Plano Financeiro
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  Timeline Estimada
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  Tecnologia Explicada
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
