import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star, Users, TrendingUp, Shield, Zap } from "lucide-react"
import Link from "next/link"

export default function ModelosParceriaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">Modelos de Parceria</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Escolha o Modelo Ideal para Sua Clínica</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Oferecemos duas opções de parceria para atender diferentes perfis de ortodontistas. Descubra qual modelo se
            adapta melhor ao seu negócio.
          </p>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Atma Aligner */}
            <Card id="atma-align" className="relative border-2 border-blue-200 shadow-lg">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white px-4 py-2">
                  <Star className="w-4 h-4 mr-1" />
                  Mais Popular
                </Badge>
              </div>
              <CardHeader className="text-center pt-8">
                <CardTitle className="text-3xl font-bold text-blue-900 mb-2">Atma Aligner</CardTitle>
                <CardDescription className="text-lg">Marca própria com suporte completo</CardDescription>
                <div className="mt-4">
                  <div className="text-4xl font-bold text-blue-600">Turnkey</div>
                  <div className="text-gray-600">Solução completa</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Marca Atma Aligner consolidada</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Marketing digital completo</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Suporte técnico 24/7</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Treinamento completo da equipe</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Materiais de comunicação</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Gestão de leads qualificados</span>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Ideal para:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Ortodontistas que querem focar na clínica</li>
                    <li>• Profissionais que buscam crescimento rápido</li>
                    <li>• Clínicas que valorizam suporte completo</li>
                  </ul>
                </div>

                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link href="/ortodontistas/seja-parceiro">Quero ser Atma Aligner</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Atma Labs */}
            <Card id="atma-labs" className="border-2 border-gray-200 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-gray-900 mb-2">Atma Labs</CardTitle>
                <CardDescription className="text-lg">White-label para empreendedores</CardDescription>
                <div className="mt-4">
                  <div className="text-4xl font-bold text-gray-700">White-Label</div>
                  <div className="text-gray-600">Sua marca, nossa tecnologia</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Sua própria marca</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Tecnologia Atma completa</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Suporte técnico especializado</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Treinamento em planejamento</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Flexibilidade de preços</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Controle total do negócio</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Ideal para:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Ortodontistas empreendedores</li>
                    <li>• Profissionais com marca estabelecida</li>
                    <li>• Clínicas que querem autonomia total</li>
                  </ul>
                </div>

                <Button asChild variant="outline" className="w-full border-gray-300 hover:bg-gray-50 bg-transparent">
                  <Link href="/ortodontistas/seja-parceiro">Quero ser Atma Labs</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Benefícios Exclusivos para Parceiros</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Suporte Dedicado</h3>
              <p className="text-gray-600">Equipe especializada para apoiar seu crescimento e sucesso.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Crescimento Garantido</h3>
              <p className="text-gray-600">Metodologia comprovada para aumentar sua receita com alinhadores.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tecnologia Segura</h3>
              <p className="text-gray-600">Plataforma confiável com resultados clínicos comprovados.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Como Funciona a Parceria</h2>
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Análise do Perfil</h3>
                <p className="text-gray-600">
                  Avaliamos seu perfil e objetivos para recomendar o modelo ideal de parceria.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Treinamento Completo</h3>
                <p className="text-gray-600">
                  Capacitação técnica e comercial para você e sua equipe dominarem a tecnologia.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Lançamento</h3>
                <p className="text-gray-600">
                  Implementação da solução na sua clínica com suporte total da nossa equipe.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Crescimento Contínuo</h3>
                <p className="text-gray-600">Acompanhamento constante e otimizações para maximizar seus resultados.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para Transformar Sua Clínica?</h2>
          <p className="text-xl mb-8 opacity-90">
            Escolha o modelo de parceria ideal e comece sua jornada de sucesso com a Atma.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/ortodontistas/seja-parceiro">
                <Zap className="w-5 h-5 mr-2" />
                Quero Ser Parceiro Atma
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
              <Link href="/ortodontistas/comparar-modelos">
                Ver Análise Financeira Detalhada
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
