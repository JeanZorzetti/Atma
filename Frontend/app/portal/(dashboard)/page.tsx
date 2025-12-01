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
  FileText,
  AlertCircle
} from 'lucide-react'
import { queryOne } from '@/lib/db'
import type { Relatorio } from '@/app/api/portal/relatorio/route'

export default async function PortalDashboard() {
  const user = await currentUser()

  if (!user) {
    redirect('/portal/entrar')
  }

  // Buscar usuário no banco
  const dbUser = await queryOne<{ id: number; nome: string }>(
    'SELECT id, nome FROM portal_users WHERE clerk_user_id = ?',
    [user.id]
  )

  // Se usuário não existe no banco ainda, criar (fallback - normalmente o webhook cria)
  if (!dbUser) {
    console.warn('⚠️ Usuário não encontrado no banco, webhook pode não ter processado ainda')
  }

  // Buscar relatório ativo do usuário
  let relatorio: Relatorio | null = null

  if (dbUser) {
    relatorio = await queryOne<Relatorio>(
      `SELECT * FROM portal_relatorios
       WHERE user_id = ?
         AND is_active = TRUE
         AND (expires_at IS NULL OR expires_at > NOW())
       ORDER BY created_at DESC
       LIMIT 1`,
      [dbUser.id]
    )
  }

  // Se não há relatório, mostrar mensagem
  if (!relatorio) {
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

        {/* Mensagem de "Sem Relatório" */}
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <AlertCircle className="h-12 w-12 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Nenhum relatório disponível
                </h3>
                <p className="text-gray-600 mb-4">
                  Você ainda não possui um relatório de viabilidade. Entre em contato conosco
                  para iniciar sua análise ortodôntica.
                </p>
                <a
                  href="/contato"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Calendar className="h-4 w-4" />
                  Agendar Consulta
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Parsear dados JSON do relatório
  const dadosJson = typeof relatorio.dados_json === 'string'
    ? JSON.parse(relatorio.dados_json)
    : relatorio.dados_json

  const dadosRelatorio = {
    score: relatorio.score,
    nomeCompleto: dbUser?.nome || user.firstName + ' ' + (user.lastName || ''),
    custoEstimado: relatorio.custo_estimado || 0,
    duracaoMeses: relatorio.duracao_meses || 0,
    complexidade: relatorio.complexidade || 'Não informada',
    status: relatorio.status || 'novo',
    dataGeracao: relatorio.created_at,
    dadosJson: dadosJson,
  }

  // Mapear status para exibição
  const statusDisplay: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    novo: { label: 'Novo', variant: 'default' },
    em_analise: { label: 'Em Análise', variant: 'secondary' },
    ativo: { label: 'Ativo', variant: 'default' },
    concluido: { label: 'Concluído', variant: 'outline' },
    cancelado: { label: 'Cancelado', variant: 'destructive' },
  }

  const statusInfo = statusDisplay[dadosRelatorio.status] || statusDisplay.novo

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

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Investimento */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Investimento Estimado
            </CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              R$ {dadosRelatorio.custoEstimado.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Parcelamento disponível
            </p>
          </CardContent>
        </Card>

        {/* Duração */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Duração Estimada
            </CardTitle>
            <Clock className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {dadosRelatorio.duracaoMeses} meses
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Pode variar conforme adesão
            </p>
          </CardContent>
        </Card>

        {/* Complexidade */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Complexidade
            </CardTitle>
            <Activity className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {dadosRelatorio.complexidade}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Nível de tratamento
            </p>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Status do Caso
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant={statusInfo.variant} className="text-sm">
                {statusInfo.label}
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {relatorio.payment_status === 'approved'
                ? 'Pagamento aprovado'
                : 'Aguardando pagamento'}
            </p>
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
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Revise seu Relatório</h4>
                <p className="text-sm text-gray-600">
                  Analise todos os detalhes do seu caso e tire suas dúvidas
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Agende sua Consulta</h4>
                <p className="text-sm text-gray-600">
                  Converse com um ortodontista para iniciar seu tratamento
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Inicie seu Tratamento</h4>
                <p className="text-sm text-gray-600">
                  Receba seus alinhadores e comece sua jornada para o sorriso perfeito
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Banner Informativo */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <FileText className="h-6 w-6 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Seu Relatório de Viabilidade
              </h3>
              <p className="text-sm text-gray-600">
                Este relatório foi gerado com base nas informações fornecidas e nas
                fotografias/moldagens analisadas. O tratamento final pode variar após
                avaliação presencial com um ortodontista.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
