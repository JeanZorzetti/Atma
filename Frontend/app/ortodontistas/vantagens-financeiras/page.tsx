import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, TrendingUp, DollarSign, Calendar, PieChart, Shield } from "lucide-react"
import Link from "next/link"

export default function VantagensFinanceiras() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-4 text-blue-600 border-blue-200">
            Inteligência Financeira
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-montserrat">
            Mais Lucratividade, <br />
            <span className="text-blue-600">Menos Risco</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Revolucione o fluxo de caixa da sua clínica com nosso modelo de pagamento inteligente e parcerias
            financeiras estratégicas.
          </p>
        </div>
      </section>

      {/* Modelo de Pagamento Faseado */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-montserrat">
              Pagamento Faseado: Seu Fluxo de Caixa Protegido
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Diferente dos concorrentes que exigem alto investimento inicial, nosso modelo protege seu capital de giro.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-700 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Modelo Tradicional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-red-600">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    Lab fee alto pago antecipadamente
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    Risco total do investimento na clínica
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    Fluxo de caixa comprometido
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    Sem flexibilidade para ajustes
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-700 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Modelo Atma Aligner
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-green-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-1" />
                    Pagamento faseado conforme entrega
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-1" />
                    Risco compartilhado e mitigado
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-1" />
                    Capital de giro preservado
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-1" />
                    Flexibilidade total para mudanças
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Vantagens Financeiras Principais */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 font-montserrat">
            Vantagens Financeiras Comprovadas
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="font-montserrat">Aumento de Lucratividade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600 mb-2">+35%</p>
                <p className="text-gray-600">
                  Margem média superior aos métodos tradicionais, com custos operacionais reduzidos.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="font-montserrat">Fluxo de Caixa Otimizado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600 mb-2">60%</p>
                <p className="text-gray-600">Redução no capital imobilizado, liberando recursos para crescimento.</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="font-montserrat">ROI Acelerado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-600 mb-2">4-6</p>
                <p className="text-gray-600">
                  Meses para retorno do investimento, versus 12-18 meses do modelo tradicional.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Integração com Fintechs */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-montserrat">
              Parcerias Financeiras Estratégicas
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Facilitamos o financiamento para seus pacientes através de parcerias com as principais fintechs do mercado
              odontológico.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-montserrat">
                  <PieChart className="h-5 w-5 text-blue-600" />
                  Para Sua Clínica
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                    <span>Recebimento à vista garantido</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                    <span>Zero risco de inadimplência</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                    <span>Processo de aprovação simplificado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                    <span>Integração digital completa</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-montserrat">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Para Seus Pacientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                    <span>Parcelas a partir de R$ 399/mês</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                    <span>Aprovação em até 24 horas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                    <span>Sem consulta ao SPC/Serasa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                    <span>Processo 100% digital</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 font-montserrat">Nossos Parceiros Financeiros</h3>
            <div className="flex justify-center items-center gap-8 flex-wrap">
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm border">
                <span className="font-semibold text-gray-700">DentalCred</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm border">
                <span className="font-semibold text-gray-700">KonsigaPay</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm border">
                <span className="font-semibold text-gray-700">+ Outras Fintechs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparativo de Modelos */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-montserrat">
              Escolha o Modelo Ideal para Seu Negócio
            </h2>
            <p className="text-lg text-gray-600">Flexibilidade total para maximizar sua lucratividade</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-blue-200">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-blue-700 font-montserrat">Atma Aligner</CardTitle>
                <CardDescription>Marca Própria com Suporte Completo</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <span className="text-2xl font-bold text-blue-600">Maior Margem</span>
                  <p className="text-sm text-gray-600">+ Suporte de Marketing</p>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Geração de leads incluída
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Material de marketing fornecido
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Suporte comercial dedicado
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-green-700 font-montserrat">Atma Labs</CardTitle>
                <CardDescription>White-Label para Empreendedores</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <span className="text-2xl font-bold text-green-600">Máxima Margem</span>
                  <p className="text-sm text-gray-600">+ Controle Total</p>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Sua marca, suas regras
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Precificação livre
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Relacionamento direto com paciente
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 font-montserrat">
            Pronto para Revolucionar suas Finanças?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Descubra como nossa parceria pode aumentar sua lucratividade e otimizar o fluxo de caixa da sua clínica.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/ortodontistas/seja-parceiro">Quero Ser Parceiro</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/ortodontistas/comparar-modelos">Comparar Modelos</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
