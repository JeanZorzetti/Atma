'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import {
  LineChart,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Info,
  Activity,
} from 'lucide-react'

// Dados do radar (exemplo - virá do banco de dados)
const radarData = [
  { fator: 'Alinhamento', valor: 85, maximo: 100 },
  { fator: 'Mordida', valor: 70, maximo: 100 },
  { fator: 'Espaçamento', valor: 90, maximo: 100 },
  { fator: 'Inclinação', valor: 75, maximo: 100 },
  { fator: 'Rotação', valor: 80, maximo: 100 },
  { fator: 'Linha Média', valor: 95, maximo: 100 },
]

// Componentes do score
const scoreComponents = [
  {
    fator: 'Alinhamento Dentário',
    score: 8.5,
    descricao: 'Alinhamento geral dos dentes está bom, com leve apinhamento anterior',
    status: 'bom',
  },
  {
    fator: 'Oclusão (Mordida)',
    score: 7.0,
    descricao: 'Mordida cruzada posterior leve, facilmente corrigível',
    status: 'medio',
  },
  {
    fator: 'Espaçamento',
    score: 9.0,
    descricao: 'Excelente distribuição de espaços, sem diastemas significativos',
    status: 'excelente',
  },
  {
    fator: 'Inclinação Dental',
    score: 7.5,
    descricao: 'Inclinação vestibular dos incisivos superiores requer atenção',
    status: 'medio',
  },
  {
    fator: 'Rotação Dental',
    score: 8.0,
    descricao: 'Rotações leves em pré-molares, facilmente tratáveis',
    status: 'bom',
  },
  {
    fator: 'Linha Média',
    score: 9.5,
    descricao: 'Linha média superior e inferior praticamente coincidentes',
    status: 'excelente',
  },
]

// Problemas identificados
const problemasIdentificados = [
  {
    problema: 'Apinhamento Anterior Leve',
    gravidade: 'baixa',
    tratavel: true,
    descricao: 'Leve sobreposição dos incisivos centrais inferiores',
  },
  {
    problema: 'Mordida Cruzada Posterior',
    gravidade: 'media',
    tratavel: true,
    descricao: 'Mordida cruzada unilateral no lado direito',
  },
  {
    problema: 'Inclinação Vestibular',
    gravidade: 'baixa',
    tratavel: true,
    descricao: 'Leve protrusão dos incisivos superiores',
  },
]

export default function AnalisePage() {
  // Função para determinar cor baseada no status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excelente':
        return 'text-green-600 bg-green-50'
      case 'bom':
        return 'text-blue-600 bg-blue-50'
      case 'medio':
        return 'text-amber-600 bg-amber-50'
      case 'ruim':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getGravidadeBadge = (gravidade: string) => {
    switch (gravidade) {
      case 'baixa':
        return <Badge className="bg-green-100 text-green-700">Baixa</Badge>
      case 'media':
        return <Badge className="bg-amber-100 text-amber-700">Média</Badge>
      case 'alta':
        return <Badge className="bg-red-100 text-red-700">Alta</Badge>
      default:
        return <Badge>{gravidade}</Badge>
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Análise do Caso</h1>
        <p className="text-gray-600 mt-2">
          Análise detalhada da viabilidade do seu tratamento ortodôntico
        </p>
      </div>

      {/* Score Global */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-white">8.5</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                Score de Viabilidade: Muito Bom
              </h3>
              <p className="text-gray-600">
                Seu caso apresenta excelente viabilidade para tratamento com alinhadores
                Atma. A maioria dos fatores analisados está em níveis ótimos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico Radar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-blue-600" />
            Radar de Viabilidade
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Visualização dos diferentes fatores que compõem seu score de viabilidade
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis
                  dataKey="fator"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280' }} />
                <Radar
                  name="Viabilidade"
                  dataKey="valor"
                  stroke="#2563eb"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <strong>Como interpretar:</strong> Quanto maior a área preenchida, melhor a
                viabilidade para tratamento com alinhadores. Valores acima de 70% em todos
                os fatores indicam excelente prognóstico.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Breakdown do Score */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Detalhamento por Fator
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {scoreComponents.map((component, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{component.fator}</h3>
                  <Badge
                    className={getStatusColor(component.status)}
                    variant="secondary"
                  >
                    {component.score.toFixed(1)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{component.descricao}</p>

                {/* Barra de progresso */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${component.score * 10}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Problemas Identificados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            Problemas Identificados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {problemasIdentificados.map((problema, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-shrink-0 mt-1">
                  {problema.tratavel ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">{problema.problema}</h4>
                    {getGravidadeBadge(problema.gravidade)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{problema.descricao}</p>
                  {problema.tratavel && (
                    <p className="text-xs text-green-600 font-medium">
                      ✓ Tratável com alinhadores Atma
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <strong>Boa notícia!</strong> Todos os problemas identificados são
                tratáveis com alinhadores ortodônticos invisíveis. O tratamento com Atma
                Aligner pode corrigir efetivamente estas condições.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recomendações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Recomendações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">
                  Consulta com Ortodontista
                </h4>
                <p className="text-sm text-gray-600">
                  Recomendamos agendar uma consulta presencial para confirmar o plano de
                  tratamento e tirar moldagens precisas.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Tempo de Tratamento</h4>
                <p className="text-sm text-gray-600">
                  Com base na análise, estimamos 12 meses de tratamento com uso consistente
                  dos alinhadores (22h/dia).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Acompanhamento Regular</h4>
                <p className="text-sm text-gray-600">
                  Check-ups a cada 6-8 semanas garantirão que o tratamento está progredindo
                  conforme planejado.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complexidade Visual */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Activity className="h-8 w-8 text-purple-600 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Nível de Complexidade: Moderado
              </h3>
              <p className="text-gray-600 mb-3">
                Seu caso se enquadra como moderado em complexidade. Isso significa que o
                tratamento é perfeitamente viável com alinhadores, mas requer planejamento
                cuidadoso e acompanhamento regular.
              </p>
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="text-center p-2 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-green-600">Simples</div>
                  <div className="text-xs text-gray-500 mt-1">0-6 meses</div>
                </div>
                <div className="text-center p-2 bg-blue-100 border-2 border-blue-600 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">Moderado</div>
                  <div className="text-xs text-gray-600 mt-1 font-medium">
                    6-18 meses ← Seu caso
                  </div>
                </div>
                <div className="text-center p-2 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-amber-600">Complexo</div>
                  <div className="text-xs text-gray-500 mt-1">18+ meses</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
