import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Heart, Smile, Zap, ChevronRight, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Alinhadores Invisíveis para Adolescentes (13-17 anos) | Atma Aligner",
  description: "Aparelho ortodôntico invisível para adolescentes. Discreto, confortável e eficaz. Mantenha sua autoestima alta durante o tratamento.",
  keywords: "alinhador adolescente, aparelho invisível teen, ortodontia discreta, alinhador transparente teenager",
}

export default function AdolescentesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-cyan-50 to-white pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <Badge className="mb-4 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2">
                  👦 Para Adolescentes de 13-17 Anos
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 leading-tight mb-6">
                  Seu Sorriso Perfeito<br />
                  <span className="text-cyan-600">Sem Chamar Atenção</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Alinhadores 100% invisíveis. Ninguém na escola vai perceber que você está usando.
                  Transforme seu sorriso sem comprometer sua autoestima.
                </p>
              </div>

              <ul className="space-y-4">
                {[
                  "Invisível - ninguém vai notar na escola ou nas fotos",
                  "Sem metal - nada de apelidos ou constrangimentos",
                  "Removível - tire para comer, escovar ou beijar",
                  "Rápido - veja resultados em poucos meses",
                  "Cool - tecnologia de ponta, não é coisa de criança"
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-cyan-600 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-cyan-600 hover:bg-cyan-700"
                  asChild
                >
                  <Link href="/pacientes/agendar">
                    Quero Transformar Meu Sorriso
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-50"
                  asChild
                >
                  <Link href="/pacientes/antes-depois">
                    Ver Transformações Reais
                  </Link>
                </Button>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 border-2 border-white" />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 font-medium">3.000+ adolescentes já transformaram o sorriso</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/patients/alinhadores-invisiveis-avaliacao-gratuita.jpg"
                  alt="Adolescente feliz com alinhador invisível"
                  width={600}
                  height={700}
                  className="w-full h-auto"
                />
                <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur rounded-2xl shadow-xl p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    "Ninguém percebeu que eu estava usando! 😄"
                  </p>
                  <p className="text-xs text-gray-600">Laura, 16 anos - 8 meses de tratamento</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Por Que Teens Escolhem Atma */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">
              Por Que Adolescentes Escolhem Atma
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Feito para quem se importa com aparência e quer resultados rápidos
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: <Smile className="h-10 w-10 text-cyan-600" />,
                title: "100% Invisível",
                description: "Ninguém vai perceber nas fotos, vídeos ou pessoalmente"
              },
              {
                icon: <Zap className="h-10 w-10 text-cyan-600" />,
                title: "Resultados Rápidos",
                description: "Veja mudanças visíveis em 2-3 meses, não em anos"
              },
              {
                icon: <Heart className="h-10 w-10 text-cyan-600" />,
                title: "Autoestima Preservada",
                description: "Sem apelidos, sem metal, sem constrangimento"
              },
              {
                icon: <Check className="h-10 w-10 text-cyan-600" />,
                title: "Vida Normal",
                description: "Coma o que quiser, pratique esportes, toque instrumentos"
              }
            ].map((item, i) => (
              <Card key={i} className="text-center hover:shadow-xl transition-shadow border-2 hover:border-cyan-600">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-100 rounded-full mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparação com Aparelho Fixo */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-cyan-50 to-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl font-heading font-bold text-gray-900 mb-12 text-center">
            Alinhadores vs Aparelho Fixo Tradicional
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-4 border-cyan-600 shadow-2xl relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-cyan-600 text-white px-6 py-2 text-sm">Melhor Escolha</Badge>
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="text-2xl font-bold text-cyan-600 mb-2">Alinhadores Atma</div>
                  <p className="text-sm text-gray-600">Tecnologia moderna</p>
                </div>

                <ul className="space-y-4">
                  {[
                    "✅ Invisível - ninguém percebe",
                    "✅ Removível - tire para comer e escovar",
                    "✅ Confortável - sem feridas ou dor",
                    "✅ Higiênico - escovação normal",
                    "✅ Sem restrições alimentares",
                    "✅ Resultados previsíveis (simulação 3D)",
                    "✅ Menos consultas ao ortodontista"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="text-2xl font-bold text-gray-700 mb-2">Aparelho Fixo</div>
                  <p className="text-sm text-gray-600">Método tradicional</p>
                </div>

                <ul className="space-y-4">
                  {[
                    "❌ Muito visível (metal na boca)",
                    "❌ Fixo - não pode remover",
                    "❌ Feridas e desconforto comuns",
                    "❌ Dificulta escovação (cáries)",
                    "❌ Não pode comer vários alimentos",
                    "❌ Resultado só vê no final",
                    "❌ Consultas frequentes para ajustes"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Situações do Dia a Dia */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-heading font-bold text-gray-900 mb-12 text-center">
            Situações do Dia a Dia
          </h2>

          <div className="space-y-6">
            {[
              {
                emoji: "📸",
                situation: "Tirar Fotos e Selfies",
                withAtma: "Sorria à vontade! Os alinhadores são transparentes e invisíveis nas fotos",
                withBraces: "Evita sorrir ou tenta esconder o sorriso metálico"
              },
              {
                emoji: "🍕",
                situation: "Sair com os Amigos",
                withAtma: "Come pizza, hambúrguer, pipoca - o que quiser! Só tira o alinhador antes",
                withBraces: "Evita vários alimentos, risco de quebrar o aparelho"
              },
              {
                emoji: "💋",
                situation: "Primeiro Beijo",
                withAtma: "Remove o alinhador discretamente. Ninguém precisa saber",
                withBraces: "Metal na boca pode ser constrangedor"
              },
              {
                emoji: "⚽",
                situation: "Praticar Esportes",
                withAtma: "Joga futebol, basquete, vôlei normalmente. Pode usar protetor bucal se quiser",
                withBraces: "Risco de machucar a boca em contato físico"
              },
              {
                emoji: "🎤",
                situation: "Tocar Instrumentos",
                withAtma: "Toca violão, flauta, trompete sem problemas",
                withBraces: "Pode dificultar tocar instrumentos de sopro"
              }
            ].map((scenario, i) => (
              <Card key={i} className="hover:border-cyan-600 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{scenario.emoji}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{scenario.situation}</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
                          <p className="text-sm font-semibold text-cyan-700 mb-2">✅ Com Alinhadores Atma</p>
                          <p className="text-sm text-gray-700">{scenario.withAtma}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-sm font-semibold text-gray-600 mb-2">❌ Com Aparelho Fixo</p>
                          <p className="text-sm text-gray-600">{scenario.withBraces}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Preços */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-cyan-50 to-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">
            Preços que Cabem no Seu Orçamento
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Seus pais vão adorar: até 50% mais barato que Invisalign®
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { plan: "Básico", price: "3.990", monthly: "166", time: "6-12 meses" },
              { plan: "Popular", price: "5.990", monthly: "250", time: "9-15 meses", featured: true },
              { plan: "Completo", price: "8.990", monthly: "375", time: "12-18 meses" }
            ].map((item, i) => (
              <Card key={i} className={item.featured ? "border-4 border-cyan-600 shadow-2xl" : "border-2"}>
                {item.featured && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-cyan-600">Mais Escolhido</Badge>
                  </div>
                )}
                <CardContent className="p-6 relative">
                  <h3 className="font-bold text-gray-900 mb-2">{item.plan}</h3>
                  <div className="text-3xl font-bold text-cyan-600 mb-1">R$ {item.price}</div>
                  <p className="text-sm text-gray-600 mb-2">ou {item.monthly}/mês</p>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            size="lg"
            className="text-lg py-6 px-10 bg-cyan-600 hover:bg-cyan-700"
            asChild
          >
            <Link href="/pacientes/agendar">
              Agendar Avaliação Gratuita
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Pronto Para Ter o Sorriso que Você Sempre Quis?
          </h2>
          <p className="text-xl text-cyan-100 mb-10 max-w-2xl mx-auto">
            Junte-se a milhares de adolescentes que já transformaram seus sorrisos com Atma
          </p>

          <Button
            size="lg"
            variant="secondary"
            className="text-xl px-12 py-8"
            asChild
          >
            <Link href="/pacientes/agendar">
              Começar Minha Transformação Agora
              <ChevronRight className="ml-2 h-6 w-6" />
            </Link>
          </Button>

          <p className="text-sm text-cyan-200 mt-6">
            ✨ Consulta gratuita • Simulação 3D • Sem compromisso
          </p>
        </div>
      </section>
    </div>
  )
}
