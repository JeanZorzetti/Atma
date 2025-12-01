'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  MessageSquare,
  Star,
  Clock,
  TrendingUp,
  Eye,
  EyeOff,
  User,
  MapPin,
  CheckCircle2,
  Quote,
  Filter,
} from 'lucide-react'

// Tipos de casos ortodônticos
type TipoCaso = 'apinhamento' | 'diastema' | 'mordida_cruzada' | 'sobremordida' | 'todos'

// Interface de depoimento
interface Depoimento {
  id: number
  nome: string
  idade: number
  cidade: string
  estado: string
  tipoCaso: TipoCaso
  duracaoMeses: number
  rating: number
  dataInicio: string
  dataConclusao: string
  depoimento: string
  fotosAntes: string
  fotosDepois: string
  destaque: boolean
}

// Dados dos depoimentos (em produção, viriam do banco de dados)
const depoimentos: Depoimento[] = [
  {
    id: 1,
    nome: 'Marina Silva',
    idade: 28,
    cidade: 'São Paulo',
    estado: 'SP',
    tipoCaso: 'apinhamento',
    duracaoMeses: 10,
    rating: 5,
    dataInicio: '2023-01-15',
    dataConclusao: '2023-11-20',
    depoimento:
      'Estava com vergonha do meu sorriso há anos. O Atma Aligner mudou completamente minha autoestima! O tratamento foi super confortável, quase não sentia os alinhadores. Poder tirar para comer foi ótimo, e os resultados superaram minhas expectativas. Recomendo muito!',
    fotosAntes: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=300&fit=crop',
    fotosDepois: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400&h=300&fit=crop',
    destaque: true,
  },
  {
    id: 2,
    nome: 'Carlos Eduardo',
    idade: 35,
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    tipoCaso: 'diastema',
    duracaoMeses: 8,
    rating: 5,
    dataInicio: '2023-03-10',
    dataConclusao: '2023-11-15',
    depoimento:
      'Tinha um espaço entre os dentes da frente que sempre me incomodou. Com o Atma, fechei esse espaço em apenas 8 meses! O melhor foi poder continuar minha rotina normal, sem aquele sorriso metálico. Valeu cada centavo!',
    fotosAntes: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=300&fit=crop',
    fotosDepois: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400&h=300&fit=crop',
    destaque: true,
  },
  {
    id: 3,
    nome: 'Ana Paula Oliveira',
    idade: 24,
    cidade: 'Belo Horizonte',
    estado: 'MG',
    tipoCaso: 'mordida_cruzada',
    duracaoMeses: 14,
    rating: 4,
    dataInicio: '2022-09-01',
    dataConclusao: '2023-11-05',
    depoimento:
      'Minha mordida cruzada sempre me causou dores de cabeça. Depois do tratamento com Atma, não só melhorou esteticamente como também eliminei as dores! O acompanhamento online foi muito prático para minha rotina corrida.',
    fotosAntes: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=300&fit=crop',
    fotosDepois: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400&h=300&fit=crop',
    destaque: false,
  },
  {
    id: 4,
    nome: 'Roberto Santos',
    idade: 42,
    cidade: 'Curitiba',
    estado: 'PR',
    tipoCaso: 'apinhamento',
    duracaoMeses: 12,
    rating: 5,
    dataInicio: '2022-11-20',
    dataConclusao: '2023-11-25',
    depoimento:
      'Achei que já era tarde demais para corrigir meu sorriso aos 42 anos. O Atma provou que nunca é tarde! Tratamento discreto, sem ninguém perceber no trabalho. Minha esposa ficou impressionada com o resultado final!',
    fotosAntes: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=300&fit=crop',
    fotosDepois: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400&h=300&fit=crop',
    destaque: true,
  },
  {
    id: 5,
    nome: 'Juliana Costa',
    idade: 31,
    cidade: 'Brasília',
    estado: 'DF',
    tipoCaso: 'sobremordida',
    duracaoMeses: 11,
    rating: 5,
    dataInicio: '2023-01-05',
    dataConclusao: '2023-12-10',
    depoimento:
      'Tratamento perfeito! A sobremordida foi corrigida sem dor e sem complicações. O planejamento 3D me mostrou exatamente como ficaria, e o resultado foi idêntico. Equipe super atenciosa durante todo o processo!',
    fotosAntes: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=300&fit=crop',
    fotosDepois: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400&h=300&fit=crop',
    destaque: false,
  },
  {
    id: 6,
    nome: 'Pedro Henrique',
    idade: 19,
    cidade: 'Salvador',
    estado: 'BA',
    tipoCaso: 'apinhamento',
    duracaoMeses: 9,
    rating: 5,
    dataInicio: '2023-02-15',
    dataConclusao: '2023-11-20',
    depoimento:
      'Como estudante, o preço do Atma foi perfeito pra mim. Muito mais barato que outras marcas e com a mesma qualidade. Agora sorrio sem medo nas fotos da faculdade!',
    fotosAntes: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=300&fit=crop',
    fotosDepois: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400&h=300&fit=crop',
    destaque: false,
  },
]

// Mapeamento de tipos de caso
const tiposCasoLabels: Record<TipoCaso, string> = {
  todos: 'Todos os Casos',
  apinhamento: 'Apinhamento Dentário',
  diastema: 'Diastema (Espaços)',
  mordida_cruzada: 'Mordida Cruzada',
  sobremordida: 'Sobremordida',
}

export default function DepoimentosPage() {
  const [filtroTipoCaso, setFiltroTipoCaso] = useState<TipoCaso>('todos')
  const [filtroDuracao, setFiltroDuracao] = useState<string>('todas')
  const [fotosReveladas, setFotosReveladas] = useState<Record<number, boolean>>({})

  // Filtrar depoimentos
  const depoimentosFiltrados = depoimentos.filter((dep) => {
    // Filtro por tipo de caso
    const matchTipo = filtroTipoCaso === 'todos' || dep.tipoCaso === filtroTipoCaso

    // Filtro por duração
    let matchDuracao = true
    if (filtroDuracao === 'rapido') {
      matchDuracao = dep.duracaoMeses <= 9
    } else if (filtroDuracao === 'medio') {
      matchDuracao = dep.duracaoMeses >= 10 && dep.duracaoMeses <= 12
    } else if (filtroDuracao === 'longo') {
      matchDuracao = dep.duracaoMeses > 12
    }

    return matchTipo && matchDuracao
  })

  // Separar depoimentos em destaque e outros
  const destaques = depoimentosFiltrados.filter((d) => d.destaque)
  const outros = depoimentosFiltrados.filter((d) => !d.destaque)

  // Toggle revelar fotos
  const toggleFotos = (id: number) => {
    setFotosReveladas((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Renderizar estrelas
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    )
  }

  // Card de depoimento
  const DepoimentoCard = ({ depoimento, isDestaque }: { depoimento: Depoimento; isDestaque?: boolean }) => {
    const revelado = fotosReveladas[depoimento.id] || false

    return (
      <Card className={`${isDestaque ? 'border-2 border-blue-200 bg-blue-50/30' : ''} hover:shadow-lg transition-shadow`}>
        <CardContent className="p-6">
          {/* Header com foto e info */}
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{depoimento.nome}</h3>
                  <p className="text-sm text-gray-600">
                    {depoimento.idade} anos • {depoimento.cidade}/{depoimento.estado}
                  </p>
                </div>
                {isDestaque && (
                  <Badge className="bg-yellow-100 text-yellow-700">
                    ⭐ Destaque
                  </Badge>
                )}
              </div>
              <div className="mt-2 flex items-center gap-2">
                {renderStars(depoimento.rating)}
                <span className="text-sm text-gray-600">
                  {depoimento.rating}/5
                </span>
              </div>
            </div>
          </div>

          {/* Badges de informação */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="text-xs">
              {tiposCasoLabels[depoimento.tipoCaso]}
            </Badge>
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {depoimento.duracaoMeses} meses
            </Badge>
          </div>

          {/* Depoimento */}
          <div className="mb-4">
            <Quote className="h-8 w-8 text-blue-200 mb-2" />
            <p className="text-gray-700 leading-relaxed italic">
              "{depoimento.depoimento}"
            </p>
          </div>

          {/* Fotos Antes/Depois */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-900">
                Resultado do Tratamento
              </h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleFotos(depoimento.id)}
                className="text-xs"
              >
                {revelado ? (
                  <>
                    <EyeOff className="h-3 w-3 mr-1" />
                    Ocultar
                  </>
                ) : (
                  <>
                    <Eye className="h-3 w-3 mr-1" />
                    Ver Fotos
                  </>
                )}
              </Button>
            </div>

            {revelado && (
              <div className="grid grid-cols-2 gap-3 animate-in fade-in duration-300">
                <div>
                  <div className="text-xs font-medium text-gray-600 mb-1">Antes</div>
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={depoimento.fotosAntes}
                      alt="Antes do tratamento"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                    Depois
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                  </div>
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 border-2 border-green-200">
                    <img
                      src={depoimento.fotosDepois}
                      alt="Depois do tratamento"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Data de conclusão */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Tratamento concluído em{' '}
              {new Date(depoimento.dataConclusao).toLocaleDateString('pt-BR', {
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Depoimentos de Pacientes</h1>
        <p className="text-gray-600 mt-2">
          Histórias reais de transformação com Atma Aligner
        </p>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-600">Total</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{depoimentos.length}</div>
            <p className="text-xs text-gray-500">Depoimentos</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-gray-600">Avaliação</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">4.9</div>
            <p className="text-xs text-gray-500">de 5 estrelas</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-gray-600">Média</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">10.5</div>
            <p className="text-xs text-gray-500">meses</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-600">Satisfação</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">98%</div>
            <p className="text-xs text-gray-500">dos pacientes</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600" />
            Filtrar Depoimentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Tipo de Caso
              </label>
              <Select
                value={filtroTipoCaso}
                onValueChange={(value) => setFiltroTipoCaso(value as TipoCaso)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Casos</SelectItem>
                  <SelectItem value="apinhamento">Apinhamento Dentário</SelectItem>
                  <SelectItem value="diastema">Diastema (Espaços)</SelectItem>
                  <SelectItem value="mordida_cruzada">Mordida Cruzada</SelectItem>
                  <SelectItem value="sobremordida">Sobremordida</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Duração do Tratamento
              </label>
              <Select value={filtroDuracao} onValueChange={setFiltroDuracao}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as durações</SelectItem>
                  <SelectItem value="rapido">Rápido (até 9 meses)</SelectItem>
                  <SelectItem value="medio">Médio (10-12 meses)</SelectItem>
                  <SelectItem value="longo">Longo (12+ meses)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            Mostrando {depoimentosFiltrados.length} de {depoimentos.length} depoimentos
          </div>
        </CardContent>
      </Card>

      {/* Depoimentos em Destaque */}
      {destaques.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ⭐ Depoimentos em Destaque
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {destaques.map((dep) => (
              <DepoimentoCard key={dep.id} depoimento={dep} isDestaque />
            ))}
          </div>
        </div>
      )}

      {/* Outros Depoimentos */}
      {outros.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Mais Depoimentos
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {outros.map((dep) => (
              <DepoimentoCard key={dep.id} depoimento={dep} />
            ))}
          </div>
        </div>
      )}

      {/* Mensagem se não houver resultados */}
      {depoimentosFiltrados.length === 0 && (
        <Card className="p-8">
          <div className="text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum depoimento encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              Tente ajustar os filtros para ver mais resultados
            </p>
            <Button
              onClick={() => {
                setFiltroTipoCaso('todos')
                setFiltroDuracao('todas')
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </Card>
      )}

      {/* CTA Final */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Pronto para Transformar Seu Sorriso?
          </h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Junte-se a centenas de pacientes satisfeitos que alcançaram o sorriso dos sonhos
            com Atma Aligner. Agende sua consulta e comece sua jornada hoje!
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Agendar Consulta
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
