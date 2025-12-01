'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Trophy,
  Star,
  CheckCircle2,
  Circle,
  Sparkles,
  Target,
} from 'lucide-react'

interface SecaoVisitada {
  id: string
  nome: string
  visitada: boolean
  icone: string
}

const secoesPortal: SecaoVisitada[] = [
  { id: 'dashboard', nome: 'Dashboard', visitada: false, icone: '🏠' },
  { id: 'analise', nome: 'Análise do Caso', visitada: false, icone: '📊' },
  { id: 'financeiro', nome: 'Plano Financeiro', visitada: false, icone: '💰' },
  { id: 'timeline', nome: 'Timeline', visitada: false, icone: '⏱️' },
  { id: 'tecnologia', nome: 'Tecnologia', visitada: false, icone: '🔬' },
  { id: 'depoimentos', nome: 'Depoimentos', visitada: false, icone: '💬' },
  { id: 'perguntas', nome: 'Perguntas', visitada: false, icone: '❓' },
  { id: 'downloads', nome: 'Downloads', visitada: false, icone: '📥' },
]

const acoesRecomendadas = [
  { id: 'ver-score', nome: 'Ver seu score de viabilidade', secao: 'dashboard' },
  { id: 'ver-analise', nome: 'Analisar radar de viabilidade', secao: 'analise' },
  { id: 'calcular-parcelas', nome: 'Calcular parcelas', secao: 'financeiro' },
  { id: 'ver-timeline', nome: 'Ver timeline do tratamento', secao: 'timeline' },
  { id: 'assistir-video', nome: 'Assistir vídeo sobre tecnologia', secao: 'tecnologia' },
  { id: 'ler-depoimento', nome: 'Ler depoimentos de pacientes', secao: 'depoimentos' },
  { id: 'fazer-perguntas', nome: 'Ver perguntas frequentes', secao: 'perguntas' },
  { id: 'baixar-pdf', nome: 'Baixar relatório em PDF', secao: 'downloads' },
]

export function ProgressTracker() {
  const [secoes, setSecoes] = useState<SecaoVisitada[]>(secoesPortal)
  const [acoes, setAcoes] = useState<typeof acoesRecomendadas>(acoesRecomendadas)
  const [mostrarTodos, setMostrarTodos] = useState(false)

  // Carregar dados do localStorage
  useEffect(() => {
    const secoesVisitadas = localStorage.getItem('portal_secoes_visitadas')
    const acoesCompletadas = localStorage.getItem('portal_acoes_completadas')

    if (secoesVisitadas) {
      const visitadas = JSON.parse(secoesVisitadas)
      setSecoes(secoesPortal.map(s => ({
        ...s,
        visitada: visitadas.includes(s.id)
      })))
    }

    if (acoesCompletadas) {
      const completadas = JSON.parse(acoesCompletadas)
      setAcoes(acoesRecomendadas.map(a => ({
        ...a,
        concluida: completadas.includes(a.id)
      })))
    }

    // Marcar dashboard como visitado
    marcarSecaoVisitada('dashboard')
  }, [])

  const marcarSecaoVisitada = (secaoId: string) => {
    const secoesVisitadas = JSON.parse(localStorage.getItem('portal_secoes_visitadas') || '[]')
    if (!secoesVisitadas.includes(secaoId)) {
      secoesVisitadas.push(secaoId)
      localStorage.setItem('portal_secoes_visitadas', JSON.stringify(secoesVisitadas))
      setSecoes(prev => prev.map(s => s.id === secaoId ? { ...s, visitada: true } : s))
    }
  }

  const secoesVisitadas = secoes.filter(s => s.visitada).length
  const totalSecoes = secoes.length
  const percentual = Math.round((secoesVisitadas / totalSecoes) * 100)
  const explorador = percentual === 100

  // Determinar nível
  let nivel = 'Iniciante'
  let corNivel = 'gray'
  if (percentual >= 100) {
    nivel = 'Explorador'
    corNivel = 'yellow'
  } else if (percentual >= 75) {
    nivel = 'Avançado'
    corNivel = 'purple'
  } else if (percentual >= 50) {
    nivel = 'Intermediário'
    corNivel = 'blue'
  } else if (percentual >= 25) {
    nivel = 'Iniciado'
    corNivel = 'green'
  }

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-purple-600" />
            Seu Progresso no Portal
          </div>
          <Badge className={`bg-${corNivel}-100 text-${corNivel}-700`}>
            {explorador && <Sparkles className="h-3 w-3 mr-1" />}
            {nivel}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Barra de Progresso */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Seções Exploradas
            </span>
            <span className="text-sm font-bold text-purple-600">
              {secoesVisitadas}/{totalSecoes}
            </span>
          </div>
          <Progress value={percentual} className="h-3" />
          <p className="text-xs text-gray-600 mt-1">{percentual}% concluído</p>
        </div>

        {/* Conquista Explorador */}
        {explorador && (
          <div className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg animate-in fade-in duration-500">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                <Trophy className="h-6 w-6 text-yellow-900" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-yellow-900">🎉 Parabéns, Explorador!</h4>
                <p className="text-sm text-yellow-800">
                  Você visitou todas as seções do portal!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Seções */}
        <div>
          <button
            onClick={() => setMostrarTodos(!mostrarTodos)}
            className="text-sm font-medium text-purple-600 hover:text-purple-700 mb-2"
          >
            {mostrarTodos ? '▼' : '▶'} Ver todas as seções
          </button>

          {mostrarTodos && (
            <div className="space-y-2 animate-in fade-in duration-300">
              {secoes.map((secao) => (
                <div
                  key={secao.id}
                  className="flex items-center gap-3 p-2 bg-white rounded-lg border border-purple-200"
                >
                  <div className="text-2xl">{secao.icone}</div>
                  <span className="flex-1 text-sm text-gray-700">{secao.nome}</span>
                  {secao.visitada ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-300" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Próximas Ações Sugeridas */}
        {!explorador && (
          <div className="pt-4 border-t border-purple-200">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-purple-600" />
              <h4 className="font-semibold text-gray-900 text-sm">
                Continue Explorando
              </h4>
            </div>
            <div className="space-y-2">
              {secoes
                .filter(s => !s.visitada)
                .slice(0, 3)
                .map((secao) => (
                  <a
                    key={secao.id}
                    href={`/portal/${secao.id === 'dashboard' ? '' : secao.id}`}
                    className="flex items-center gap-2 p-2 bg-white rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors text-sm"
                  >
                    <span>{secao.icone}</span>
                    <span className="flex-1 text-gray-700">{secao.nome}</span>
                    <Star className="h-4 w-4 text-purple-400" />
                  </a>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
