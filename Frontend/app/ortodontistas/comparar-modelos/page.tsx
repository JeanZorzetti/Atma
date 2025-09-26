import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  XCircle,
  TrendingUp,
  DollarSign,
  Calendar,
  PieChart,
  Shield,
  BarChart3,
  Users,
  Settings,
  CreditCard,
  Target,
  ArrowRight,
  Calculator
} from "lucide-react"
import Link from "next/link"

export default function CompararModelos() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-4 text-blue-600 border-blue-200">
            Análise Financeira Comparativa
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-montserrat">
            Comparativo Técnico <br />
            <span className="text-blue-600">de Modelos de Negócio</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Análise detalhada dos modelos Atma Aligner vs Atma Labs com dados financeiros,
            projeções de ROI e estruturas de investimento.
          </p>
        </div>
      </section>

      {/* Comparativo Principal */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-montserrat">
              Análise Comparativa Detalhada
            </h2>
            <p className="text-lg text-gray-600">
              Escolha o modelo ideal baseado em dados técnicos e projeções financeiras
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Atma Aligner */}
            <Card className="border-2 border-blue-200 relative">
              <div className="absolute top-4 right-4">
                <Badge className="bg-blue-600">Recomendado</Badge>
              </div>
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                <CardTitle className="text-2xl text-blue-700 font-montserrat">
                  Atma Aligner
                </CardTitle>
                <CardDescription className="text-lg">
                  Marca Própria com Suporte Completo
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Investimento Inicial */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                    Estrutura de Investimento
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Investimento Inicial:</span>
                      <span className="font-semibold text-green-600">R$ 0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pagamento por Caso:</span>
                      <span className="font-semibold">Faseado</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa de Adesão:</span>
                      <span className="font-semibold">Isenta</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Material de Marketing:</span>
                      <span className="font-semibold text-green-600">Incluído</span>
                    </div>
                  </div>
                </div>

                {/* Margem de Lucro */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Margem de Lucratividade
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Margem Média:</span>
                      <span className="font-bold text-2xl text-blue-600">35-45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ticket Médio:</span>
                      <span className="font-semibold">R$ 8.000 - R$ 12.000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lucro por Caso:</span>
                      <span className="font-semibold text-green-600">R$ 2.800 - R$ 5.400</span>
                    </div>
                  </div>
                </div>

                {/* ROI e Payback */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-blue-600" />
                    Retorno do Investimento
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Payback:</span>
                      <span className="font-bold text-2xl text-purple-600">4-6 meses</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ROI Anual:</span>
                      <span className="font-semibold text-green-600">180-250%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Capital Imobilizado:</span>
                      <span className="font-semibold text-green-600">60% menor</span>
                    </div>
                  </div>
                </div>

                {/* Vantagens */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Vantagens Incluídas</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Geração de leads qualificados
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Material de marketing completo
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Suporte comercial dedicado
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Treinamento técnico incluído
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Marca reconhecida no mercado
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Integração com fintechs parceiras
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600 mb-2">Ideal para:</p>
                    <p className="text-sm text-gray-600">Ortodontistas que buscam crescimento rápido com suporte completo</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Atma Labs */}
            <Card className="border-2 border-green-200">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
                <CardTitle className="text-2xl text-green-700 font-montserrat">
                  Atma Labs
                </CardTitle>
                <CardDescription className="text-lg">
                  White-Label para Empreendedores
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Investimento Inicial */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Estrutura de Investimento
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Investimento Inicial:</span>
                      <span className="font-semibold text-green-600">R$ 0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pagamento por Caso:</span>
                      <span className="font-semibold">Faseado</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa de Setup:</span>
                      <span className="font-semibold">Personalizada</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Branding Próprio:</span>
                      <span className="font-semibold text-green-600">Completo</span>
                    </div>
                  </div>
                </div>

                {/* Margem de Lucro */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Margem de Lucratividade
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Margem Média:</span>
                      <span className="font-bold text-2xl text-green-600">45-60%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ticket Médio:</span>
                      <span className="font-semibold">Definido por você</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lucro por Caso:</span>
                      <span className="font-semibold text-green-600">R$ 3.600 - R$ 7.200</span>
                    </div>
                  </div>
                </div>

                {/* ROI e Payback */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-green-600" />
                    Retorno do Investimento
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Payback:</span>
                      <span className="font-bold text-2xl text-purple-600">3-5 meses</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ROI Anual:</span>
                      <span className="font-semibold text-green-600">220-300%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Capital Imobilizado:</span>
                      <span className="font-semibold text-green-600">60% menor</span>
                    </div>
                  </div>
                </div>

                {/* Vantagens */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Vantagens Incluídas</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      100% sua marca e identidade
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Precificação totalmente livre
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Relacionamento direto com paciente
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Controle total do negócio
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Base de dados proprietária
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Estratégias de marketing personalizadas
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600 mb-2">Ideal para:</p>
                    <p className="text-sm text-gray-600">Empreendedores que querem construir sua própria marca</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Análise de Fluxo de Caixa */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-montserrat">
              Análise de Fluxo de Caixa
            </h2>
            <p className="text-lg text-gray-600">
              Compare o impacto financeiro vs modelo tradicional
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Modelo Tradicional */}
            <Card className="border-red-200">
              <CardHeader className="bg-red-50">
                <CardTitle className="text-red-700 text-center">Modelo Tradicional</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span>Investimento Inicial:</span>
                    <span className="font-semibold text-red-600">R$ 15.000+</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lab Fee Antecipado:</span>
                    <span className="font-semibold text-red-600">100%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payback:</span>
                    <span className="font-semibold text-red-600">12-18 meses</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Capital Imobilizado:</span>
                    <span className="font-semibold text-red-600">Alto</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Risco Financeiro:</span>
                    <span className="font-semibold text-red-600">100% Clínica</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Margem Média:</span>
                    <span className="font-semibold text-red-600">25-35%</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-red-200">
                  <div className="text-center">
                    <p className="text-lg font-bold text-red-600">ROI Anual</p>
                    <p className="text-2xl font-bold text-red-600">120-160%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Atma Aligner */}
            <Card className="border-blue-200 border-2">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-blue-700 text-center">Atma Aligner</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span>Investimento Inicial:</span>
                    <span className="font-semibold text-green-600">R$ 0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lab Fee Antecipado:</span>
                    <span className="font-semibold text-green-600">0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payback:</span>
                    <span className="font-semibold text-green-600">4-6 meses</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Capital Imobilizado:</span>
                    <span className="font-semibold text-green-600">60% menor</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Risco Financeiro:</span>
                    <span className="font-semibold text-green-600">Compartilhado</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Margem Média:</span>
                    <span className="font-semibold text-green-600">35-45%</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-blue-200">
                  <div className="text-center">
                    <p className="text-lg font-bold text-blue-600">ROI Anual</p>
                    <p className="text-2xl font-bold text-blue-600">180-250%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Atma Labs */}
            <Card className="border-green-200 border-2">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-green-700 text-center">Atma Labs</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span>Investimento Inicial:</span>
                    <span className="font-semibold text-green-600">R$ 0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lab Fee Antecipado:</span>
                    <span className="font-semibold text-green-600">0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payback:</span>
                    <span className="font-semibold text-green-600">3-5 meses</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Capital Imobilizado:</span>
                    <span className="font-semibold text-green-600">60% menor</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Risco Financeiro:</span>
                    <span className="font-semibold text-green-600">Compartilhado</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Margem Média:</span>
                    <span className="font-semibold text-green-600">45-60%</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-green-200">
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">ROI Anual</p>
                    <p className="text-2xl font-bold text-green-600">220-300%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Simulador de Faturamento */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-montserrat">
              Simulação de Faturamento Anual
            </h2>
            <p className="text-lg text-gray-600">
              Baseado em 20 casos por mês (240 casos/ano)
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-blue-200">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-blue-700 text-center text-xl font-montserrat">
                  Atma Aligner - Projeção Anual
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-lg">
                    <span>Faturamento Bruto:</span>
                    <span className="font-bold">R$ 2.400.000</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span>Margem (40%):</span>
                    <span className="font-bold text-blue-600">R$ 960.000</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span>Custos Operacionais:</span>
                    <span className="font-bold text-red-600">R$ 240.000</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Lucro Líquido Anual:</span>
                      <span className="text-green-600">R$ 720.000</span>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg mt-4">
                    <p className="text-sm text-center text-blue-700 font-medium">
                      Inclui: Leads, Marketing, Suporte Técnico e Comercial
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-green-700 text-center text-xl font-montserrat">
                  Atma Labs - Projeção Anual
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-lg">
                    <span>Faturamento Bruto:</span>
                    <span className="font-bold">R$ 2.400.000</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span>Margem (52%):</span>
                    <span className="font-bold text-green-600">R$ 1.248.000</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span>Custos Operacionais:</span>
                    <span className="font-bold text-red-600">R$ 360.000</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Lucro Líquido Anual:</span>
                      <span className="text-green-600">R$ 888.000</span>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg mt-4">
                    <p className="text-sm text-center text-green-700 font-medium">
                      Você assume: Marketing, Captação de Leads e Gestão Comercial
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-yellow-800 mb-2">
                Diferencial Atma Labs: +R$ 168.000/ano
              </h3>
              <p className="text-yellow-700">
                Para ortodontistas com perfil empreendedor que desejam construir sua própria marca
                e assumir a gestão comercial completa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Financiamento para Pacientes */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-montserrat">
              Estrutura de Financiamento para Pacientes
            </h2>
            <p className="text-lg text-gray-600">
              Parceiros financeiros para facilitar o acesso ao tratamento
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-montserrat">
                  <Shield className="h-5 w-5 text-green-600" />
                  Para Sua Clínica
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                    <span><strong>Recebimento à vista:</strong> 100% garantido em 24h</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                    <span><strong>Zero risco:</strong> Sem inadimplência para sua clínica</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                    <span><strong>Taxa competitiva:</strong> 2,5% a 4% ao mês</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                    <span><strong>Aprovação rápida:</strong> Até 24 horas úteis</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-montserrat">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  Para Seus Pacientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                    <span><strong>Parcelas baixas:</strong> A partir de R$ 399/mês</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                    <span><strong>Sem consulta SPC:</strong> Análise diferenciada</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                    <span><strong>Prazo flexível:</strong> Até 60x para pagar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                    <span><strong>100% digital:</strong> Assinatura eletrônica</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 font-montserrat">
              Nossos Parceiros Financeiros
            </h3>
            <div className="flex justify-center items-center gap-6 flex-wrap">
              <div className="bg-white px-8 py-4 rounded-lg shadow-sm border-2">
                <span className="font-bold text-gray-800 text-lg">DentalCred</span>
                <p className="text-xs text-gray-600">Especializada em ortodontia</p>
              </div>
              <div className="bg-white px-8 py-4 rounded-lg shadow-sm border-2">
                <span className="font-bold text-gray-800 text-lg">KonsigaPay</span>
                <p className="text-xs text-gray-600">Crédito consignado</p>
              </div>
              <div className="bg-white px-8 py-4 rounded-lg shadow-sm border-2">
                <span className="font-bold text-gray-800 text-lg">+ Outras Fintechs</span>
                <p className="text-xs text-gray-600">Rede em expansão</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 font-montserrat">
            Escolha Seu Modelo de Sucesso
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Análise técnica concluída? Escolha o modelo que mais se adequa ao seu perfil de negócio
            e comece a revolucionar sua clínica hoje mesmo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/ortodontistas/seja-parceiro">
                Quero Ser Parceiro Atma Aligner
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-green-600 text-green-600 hover:bg-green-50">
              <Link href="/ortodontistas/seja-parceiro">
                Interessado no Atma Labs
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
          <div className="mt-6">
            <p className="text-sm text-gray-500">
              Tem dúvidas? <Link href="/ortodontistas/seja-parceiro" className="text-blue-600 hover:underline">Fale com nosso time</Link> para uma análise personalizada.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}