import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, FileText, AlertCircle, TrendingUp, Shield, Clock, ChevronRight, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Relatório de Viabilidade Ortodôntica Personalizado | Atma Aligner",
  description: "Descubra se alinhadores invisíveis são indicados para o seu caso. Relatório completo e personalizado por apenas R$ 47.",
  keywords: "relatório ortodôntico, viabilidade alinhadores, diagnóstico ortodôntico, análise personalizada",
}

export default function RelatorioViabilidadePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Coluna Esquerda - Copy */}
            <div className="space-y-8">
              <div>
                <Badge className="mb-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2">
                  🔥 OFERTA LIMITADA: R$ 47 (valor normal R$ 197)
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 leading-tight mb-6">
                  Descubra Se Alinhadores Invisíveis São Para Você
                  <span className="block text-blue-600 mt-2">Antes de Gastar Milhares</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Relatório completo e personalizado que analisa seu caso, estima custos reais e
                  revela se você está sendo cobrado demais. <strong>100% automatizado, entrega imediata.</strong>
                </p>
              </div>

              {/* Problema/Dor */}
              <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-lg">
                <div className="flex gap-3">
                  <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Você Está Cometendo Estes Erros?</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>❌ Recebeu orçamentos de R$ 8.000 a R$ 20.000 e não sabe se é justo</li>
                      <li>❌ Tem dúvidas se seu caso é viável para alinhadores invisíveis</li>
                      <li>❌ Não sabe quanto tempo de tratamento esperar</li>
                      <li>❌ Medo de gastar dinheiro e não ver resultados</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Solução */}
              <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg">
                <div className="flex gap-3">
                  <Check className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Com Este Relatório Você Vai:</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>✅ Saber se alinhadores são indicados para o SEU caso específico</li>
                      <li>✅ Receber estimativa real de custos (casos simples, moderados ou complexos)</li>
                      <li>✅ Descobrir se está sendo superestimado (ou subestimado)</li>
                      <li>✅ Ter um plano de ação personalizado para seguir</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* CTA Principal */}
              <Button
                size="lg"
                className="w-full text-xl px-8 py-8 bg-blue-600 hover:bg-blue-700 shadow-xl hover:shadow-2xl transition-all"
                asChild
              >
                <Link href="/infoproduto/relatorio-viabilidade/formulario">
                  Quero Meu Relatório Agora - R$ 47
                  <ChevronRight className="ml-2 h-6 w-6" />
                </Link>
              </Button>

              <p className="text-center text-sm text-gray-500">
                ⚡ Entrega imediata • 🔒 Pagamento 100% seguro • ✅ Satisfação garantida
              </p>
            </div>

            {/* Coluna Direita - Mockup do Relatório */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white p-8">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-bold text-gray-900">Relatório de Viabilidade</h3>
                    <p className="text-sm text-gray-600">Análise Personalizada Completa</p>
                  </div>
                </div>

                {/* Preview do conteúdo */}
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">📊 Seu Perfil</h4>
                    <p className="text-sm text-gray-600">Análise completa do seu caso</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">✅ Viabilidade</h4>
                    <p className="text-sm text-gray-600">Score de adequação: 0-100</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">💰 Estimativa de Custos</h4>
                    <p className="text-sm text-gray-600">Valores reais para seu caso</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">📅 Timeline</h4>
                    <p className="text-sm text-gray-600">Duração estimada do tratamento</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">🎯 Plano de Ação</h4>
                    <p className="text-sm text-gray-600">Próximos passos personalizados</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t text-center">
                  <p className="text-sm text-gray-500">+ Bônus: Lista de ortodontistas certificados na sua região</p>
                </div>
              </div>

              {/* Badge de Garantia */}
              <div className="absolute -bottom-6 -right-6 bg-green-600 text-white rounded-full p-6 shadow-xl">
                <div className="text-center">
                  <Shield className="h-8 w-8 mx-auto mb-1" />
                  <p className="text-xs font-bold">Garantia</p>
                  <p className="text-xs">7 dias</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* O Que Você Vai Receber */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center text-gray-900 mb-12">
            O Que Está Incluído no Relatório
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: FileText,
                title: "Análise Personalizada",
                description: "Baseada nas suas respostas, geramos um relatório único com análise profunda do seu caso específico."
              },
              {
                icon: TrendingUp,
                title: "Score de Viabilidade",
                description: "Pontuação de 0-100 que indica o quão adequado são alinhadores invisíveis para você."
              },
              {
                icon: Clock,
                title: "Estimativa de Tempo",
                description: "Duração prevista do tratamento baseada na complexidade do seu caso (6-18 meses)."
              },
              {
                icon: Check,
                title: "Comparativo de Preços",
                description: "Tabela comparativa: Atma vs. Concorrentes vs. Aparelho Fixo. Descubra a melhor relação custo-benefício."
              },
              {
                icon: Shield,
                title: "Análise de Riscos",
                description: "Identificamos possíveis complicações e limitações para o seu caso específico."
              },
              {
                icon: Star,
                title: "Plano de Ação",
                description: "Passo a passo personalizado: o que fazer agora, perguntas para o ortodontista, documentos necessários."
              }
            ].map((item, i) => (
              <Card key={i} className="border-2 hover:border-blue-600 transition-all">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                        <item.icon className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              size="lg"
              className="text-xl px-12 py-8 bg-blue-600 hover:bg-blue-700 shadow-xl"
              asChild
            >
              <Link href="/infoproduto/relatorio-viabilidade/formulario">
                Começar Agora - R$ 47
                <ChevronRight className="ml-2 h-6 w-6" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-heading font-bold text-center text-gray-900 mb-12">
            Quem Já Usou, Recomenda
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Mariana Costa",
                role: "Consultora, 32 anos",
                text: "Economizei R$ 4.000! O relatório me mostrou que meu caso era simples, não precisava pagar R$ 12.000 como me ofereceram."
              },
              {
                name: "Ricardo Almeida",
                role: "Empresário, 41 anos",
                text: "Descobri que alinhadores não eram indicados para mim. Melhor gastar R$ 47 agora do que R$ 8.000 depois sem resultado."
              },
              {
                name: "Juliana Martins",
                role: "Dentista, 29 anos",
                text: "Mesmo sendo da área, o relatório me ajudou a entender melhor as opções e fazer perguntas certas aos ortodontistas."
              }
            ].map((testimonial, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  <div className="border-t pt-4">
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Rápido */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-heading font-bold text-center text-gray-900 mb-12">
            Perguntas Frequentes
          </h2>

          <div className="space-y-6">
            {[
              {
                q: "Como funciona a entrega?",
                a: "Após o pagamento, você preenche um formulário (5 minutos). O relatório é gerado automaticamente e enviado no seu email em até 10 minutos."
              },
              {
                q: "Por que custa apenas R$ 47?",
                a: "Porque é 100% automatizado. Consultórias presenciais cobram R$ 300-500 pela mesma análise. Automatizamos o processo para democratizar o acesso."
              },
              {
                q: "Tem garantia?",
                a: "Sim! 7 dias de garantia incondicional. Se não gostar, devolvemos 100% do valor, sem perguntas."
              },
              {
                q: "Substitui a consulta com ortodontista?",
                a: "Não. O relatório é uma ANÁLISE PRELIMINAR para você tomar decisões mais informadas. A consulta presencial continua sendo necessária."
              },
              {
                q: "Qual a diferença para o quiz gratuito?",
                a: "O quiz dá uma resposta básica (sim/não). O relatório é profundo: score detalhado, estimativas de custo e tempo, análise de riscos, plano de ação e comparativos."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Pronto Para Tomar a Decisão Certa?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Evite gastar milhares de reais sem saber se é realmente para você.
            <br />
            <strong>Invista R$ 47 hoje, economize até R$ 10.000 amanhã.</strong>
          </p>

          <Button
            size="lg"
            variant="secondary"
            className="text-xl px-12 py-8 shadow-2xl hover:shadow-3xl transition-all"
            asChild
          >
            <Link href="/infoproduto/relatorio-viabilidade/formulario">
              Gerar Meu Relatório Agora - R$ 47
              <ChevronRight className="ml-2 h-6 w-6" />
            </Link>
          </Button>

          <p className="text-sm text-blue-200 mt-6">
            🔒 Pagamento 100% seguro via Mercado Pago • ⚡ Entrega em até 10 minutos
          </p>
        </div>
      </section>
    </div>
  )
}
