'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import {
  DollarSign,
  Calculator,
  CreditCard,
  TrendingDown,
  CheckCircle2,
  Info,
  Percent,
  Calendar,
} from 'lucide-react'

// Dados de comparação
const comparativoData = [
  { metodo: 'Atma Aligner', custo: 5990, economia: 0 },
  { metodo: 'Aparelho Tradicional', custo: 8500, economia: -2510 },
  { metodo: 'Alinhadores Importados', custo: 15000, economia: -9010 },
]

// Composição do investimento
const composicaoData = [
  { nome: 'Alinhadores', valor: 3500, cor: '#3b82f6' },
  { nome: 'Consultas', valor: 1200, cor: '#8b5cf6' },
  { nome: 'Moldagens', valor: 800, cor: '#06b6d4' },
  { nome: 'Contenções', valor: 490, cor: '#10b981' },
]

export default function FinanceiroPage() {
  const [numeroParcelas, setNumeroParcelas] = useState(12)
  const valorTotal = 5990

  // Cálculo das parcelas (juros aplicados após 12x)
  const calcularParcela = (parcelas: number) => {
    if (parcelas <= 12) {
      // Sem juros até 12x
      return valorTotal / parcelas
    } else {
      // Com juros após 12x (exemplo: 2.5% ao mês)
      const taxaJuros = 0.025
      const valorComJuros = valorTotal * Math.pow(1 + taxaJuros, parcelas - 12)
      return valorComJuros / parcelas
    }
  }

  const valorParcela = calcularParcela(numeroParcelas)
  const totalComJuros = valorParcela * numeroParcelas
  const jurosTotal = totalComJuros - valorTotal
  const temJuros = numeroParcelas > 12

  return (
    <div className="p-4 md:p-8 space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Plano Financeiro</h1>
        <p className="text-gray-600 mt-2">
          Custo estimado e opções de pagamento para seu tratamento
        </p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Investimento Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              R$ {valorTotal.toLocaleString('pt-BR')}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Valor à vista ou parcelado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Parcela Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {numeroParcelas}x de R$ {valorParcela.toFixed(2)}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {temJuros ? 'Com juros' : 'Sem juros'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Economia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">30%</div>
            <p className="text-sm text-gray-600 mt-2">
              vs. aparelho tradicional
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Calculadora Interativa */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            Calculadora de Parcelas
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Ajuste o número de parcelas para ver o valor mensal
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Slider */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium text-gray-700">
                Número de Parcelas
              </label>
              <Badge variant={temJuros ? 'destructive' : 'default'} className="text-lg px-3">
                {numeroParcelas}x
              </Badge>
            </div>

            <Slider
              value={[numeroParcelas]}
              onValueChange={(value) => setNumeroParcelas(value[0])}
              min={1}
              max={24}
              step={1}
              className="w-full"
            />

            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>1x</span>
              <span>12x (sem juros)</span>
              <span>24x</span>
            </div>
          </div>

          {/* Resultado */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-blue-200">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-600 mb-1">Valor da Parcela</div>
                <div className="text-4xl font-bold text-blue-600">
                  R$ {valorParcela.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600 mt-1">por mês</div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">Total a Pagar</div>
                <div className="text-3xl font-bold text-gray-900">
                  R$ {totalComJuros.toFixed(2)}
                </div>
                {temJuros && (
                  <div className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <Percent className="h-3 w-3" />
                    +R$ {jurosTotal.toFixed(2)} em juros
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Informação sobre juros */}
          <div className="flex items-start gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-700">
              <strong>Importante:</strong> Parcelamento sem juros disponível em até 12x.
              Acima de 12 parcelas, é aplicada taxa de juros de 2,5% ao mês.
            </div>
          </div>

          {/* Datas estimadas */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-sm text-gray-600">Primeira Parcela</div>
                <div className="font-semibold text-gray-900">
                  {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-sm text-gray-600">Última Parcela</div>
                <div className="font-semibold text-gray-900">
                  {new Date(Date.now() + (numeroParcelas + 1) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparativo de Custos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-green-600" />
            Comparativo de Custos
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Veja quanto você economiza escolhendo Atma Aligner
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparativoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="metodo" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`}
                />
                <Bar dataKey="custo" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <strong>Economize até R$ 9.010</strong> em comparação com alinhadores
                importados e <strong>R$ 2.510</strong> em relação ao aparelho tradicional.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Composição do Investimento */}
      <Card>
        <CardHeader>
          <CardTitle>Composição do Investimento</CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Veja o que está incluído no seu investimento
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Gráfico Donut */}
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={composicaoData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="valor"
                  >
                    {composicaoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.cor} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Detalhamento */}
            <div className="space-y-3">
              {composicaoData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.cor }}
                    />
                    <span className="font-medium text-gray-900">{item.nome}</span>
                  </div>
                  <span className="text-gray-700 font-semibold">
                    R$ {item.valor.toLocaleString('pt-BR')}
                  </span>
                </div>
              ))}

              <div className="pt-3 mt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-blue-600">
                    R$ {valorTotal.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* O que está incluído */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">O que está incluído:</h4>
            <div className="grid md:grid-cols-2 gap-2">
              {[
                'Moldagens digitais 3D',
                'Planejamento virtual completo',
                'Todos os alinhadores necessários',
                'Consultas de acompanhamento',
                'Refinamentos (se necessário)',
                'Contenções pós-tratamento',
                'Suporte online 24/7',
                'Garantia de satisfação',
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formas de Pagamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            Formas de Pagamento Aceitas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-gray-900">Cartão de Crédito</h4>
              </div>
              <p className="text-sm text-gray-600">
                Parcelamento em até 12x sem juros
              </p>
            </div>

            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-gray-900">PIX</h4>
              </div>
              <p className="text-sm text-gray-600">
                5% de desconto à vista
              </p>
            </div>

            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-gray-900">Boleto</h4>
              </div>
              <p className="text-sm text-gray-600">
                Parcelamento em até 6x
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
