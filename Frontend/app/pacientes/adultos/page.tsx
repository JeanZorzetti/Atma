import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Briefcase, Heart, TrendingUp, ChevronRight, DollarSign } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Alinhadores Invisíveis para Adultos (18+ anos) | Atma Aligner",
  description: "Ortodontia invisível para adultos. Transforme seu sorriso sem impactar sua vida profissional. Nunca é tarde para ter o sorriso dos sonhos.",
  keywords: "alinhador adulto, ortodontia adulto, aparelho invisível profissional, alinhador transparente adulto",
}

export default function AdultosPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-white pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <Badge className="mb-4 bg-slate-700 hover:bg-slate-800 text-white px-4 py-2">
                  👨‍💼 Para Adultos 18+ anos
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 leading-tight mb-6">
                  Nunca é Tarde<br />
                  <span className="text-blue-600">Para o Sorriso Perfeito</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Alinhadores invisíveis desenvolvidos para adultos que valorizam discrição,
                  profissionalismo e resultados comprovados. Transforme seu sorriso sem impactar
                  sua carreira ou vida social.
                </p>
              </div>

              <ul className="space-y-4">
                {[
                  "Invisível no trabalho e reuniões",
                  "Não interfere na fala ou apresentações",
                  "Removível para eventos importantes",
                  "Previsível - veja o resultado antes de começar",
                  "Investimento que retorna em autoestima"
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700" asChild>
                  <Link href="/pacientes/agendar">
                    Agendar Avaliação Gratuita
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-blue-600 text-blue-600 hover:bg-blue-50" asChild>
                  <Link href="/pacientes/precos">
                    Ver Preços e Opções
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/placeholder-adult-professional.jpg"
                  alt="Adulto profissional com sorriso confiante"
                  width={600}
                  height={700}
                  className="w-full h-auto"
                />
                <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur rounded-2xl shadow-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Check className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Transformação Completa</p>
                      <p className="text-sm text-gray-600">42 anos • Executivo • 10 meses</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Por Que Adultos Escolhem Alinhadores */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">
              Por Que Mais Adultos Estão Escolhendo Alinhadores
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tecnologia moderna para profissionais modernos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Briefcase className="h-12 w-12 text-blue-600" />,
                title: "Profissionalismo",
                description: "Mantenha sua imagem profissional intacta. Ninguém no trabalho vai perceber que você está em tratamento ortodôntico."
              },
              {
                icon: <Heart className="h-12 w-12 text-blue-600" />,
                title: "Autoestima",
                description: "Um sorriso bonito aumenta sua confiança em reuniões, apresentações e na vida pessoal."
              },
              {
                icon: <TrendingUp className="h-12 w-12 text-blue-600" />,
                title: "ROI Comprovado",
                description: "Estudos mostram que pessoas com sorrisos alinhados ganham até 20% mais e têm mais oportunidades profissionais."
              }
            ].map((item, i) => (
              <Card key={i} className="hover:shadow-xl transition-shadow border-2 hover:border-blue-600">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Faixas Etárias */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl font-heading font-bold text-gray-900 mb-12 text-center">
            Tratamento Para Cada Fase da Vida Adulta
          </h2>

          <div className="space-y-8">
            {[
              {
                age: "25-35 anos",
                title: "Jovens Profissionais",
                description: "Construindo carreira e networking. Um sorriso bonito abre portas em entrevistas, reuniões e eventos sociais.",
                benefits: ["Vantagem competitiva no mercado", "Melhor primeira impressão", "Autoconfiança em reuniões"]
              },
              {
                age: "35-45 anos",
                title: "Executivos e Líderes",
                description: "No auge da carreira. Sua imagem reflete sua posição. Invista em você sem comprometer sua agenda.",
                benefits: ["Imagem de liderança consolidada", "Tratamento rápido (6-12 meses)", "Flexibilidade para viagens"]
              },
              {
                age: "45-55 anos",
                title: "Profissionais Experientes",
                description: "Realizações profissionais conquistadas. Agora é a hora de investir no seu bem-estar e aparência.",
                benefits: ["Nunca é tarde para melhorar", "Saúde bucal a longo prazo", "Qualidade de vida aumentada"]
              },
              {
                age: "55+ anos",
                title: "Maturidade Plena",
                description: "Aproveite a vida com confiança. Tratamento ortodôntico melhora mastigação, dicção e autoestima.",
                benefits: ["Melhora funcional da mordida", "Saúde bucal preservada", "Dignidade e bem-estar"]
              }
            ].map((segment, i) => (
              <Card key={i} className="hover:border-blue-600 transition-colors">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <Badge className="mb-3 bg-blue-600 text-white">{segment.age}</Badge>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{segment.title}</h3>
                      <p className="text-gray-600">{segment.description}</p>
                    </div>
                    <div className="md:col-span-2">
                      <h4 className="font-semibold text-gray-900 mb-3">Benefícios nesta fase:</h4>
                      <ul className="space-y-2">
                        {segment.benefits.map((benefit, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Casos Comuns em Adultos */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-heading font-bold text-gray-900 mb-12 text-center">
            Casos Mais Comuns em Adultos
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Recaída Pós-Aparelho",
                description: "Usou aparelho na adolescência mas os dentes voltaram a entortar? Corrigimos isso de forma rápida e discreta."
              },
              {
                title: "Dentes que Entortaram com a Idade",
                description: "É natural que dentes se movam ao longo dos anos. Alinhadores corrigem esse desalinhamento gradual."
              },
              {
                title: "Espaços Entre os Dentes",
                description: "Diastemas (espaços) podem aparecer ou aumentar com o tempo. Fechamos com precisão milimétrica."
              },
              {
                title: "Desgaste Irregular",
                description: "Má oclusão causa desgaste desigual dos dentes. Corrigir alinha e preserva sua saúde bucal."
              },
              {
                title: "Problemas de ATM",
                description: "Dores na articulação podem ser causadas por má oclusão. O alinhamento correto alivia sintomas."
              },
              {
                title: "Preparação para Implantes",
                description: "Antes de implantes ou próteses, o alinhamento correto garante melhor resultado estético e funcional."
              }
            ].map((caso, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2">{caso.title}</h3>
                  <p className="text-gray-600 text-sm">{caso.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Análise de Investimento */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-heading font-bold text-gray-900 mb-6 text-center">
            Investimento vs. Retorno
          </h2>
          <p className="text-xl text-gray-600 mb-12 text-center max-w-2xl mx-auto">
            Veja como um sorriso alinhado impacta sua vida profissional e pessoal
          </p>

          <Card className="border-4 border-blue-600 shadow-2xl mb-8">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="h-8 w-8 text-blue-600" />
                    <h3 className="text-2xl font-bold text-gray-900">Investimento</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-4xl font-bold text-blue-600">R$ 5.990</p>
                      <p className="text-gray-600">valor médio do tratamento</p>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>• Parcelamento em até 24x</p>
                      <p>• R$ 250/mês sem juros</p>
                      <p>• Menos que uma academia</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <h3 className="text-2xl font-bold text-gray-900">Retorno</h3>
                  </div>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Aumento de 20% no salário médio (estudos Harvard)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>58% mais chances em entrevistas de emprego</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Confiança aumentada em 90% dos pacientes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Benefício para a vida toda</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button size="lg" className="text-lg px-10 py-6 bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/pacientes/agendar">
                Fazer Avaliação Gratuita
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl font-heading font-bold text-gray-900 mb-12 text-center">
            Histórias de Transformação
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Carlos, 31 anos",
                job: "Gerente de Vendas",
                quote: "Fechei 40% mais negócios depois que corrigi meu sorriso. A confiança faz toda a diferença.",
                time: "10 meses"
              },
              {
                name: "Ana, 42 anos",
                job: "Diretora de RH",
                quote: "Ninguém no trabalho percebeu. Apenas notaram que eu estava mais confiante e sorrindo mais.",
                time: "8 meses"
              },
              {
                name: "Roberto, 55 anos",
                job: "Empresário",
                quote: "Achava que era tarde demais. Melhor decisão que tomei. Minha qualidade de vida mudou completamente.",
                time: "12 meses"
              }
            ].map((testimonial, i) => (
              <Card key={i} className="hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                  <div className="border-t pt-4">
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.job}</p>
                    <p className="text-sm text-blue-600 mt-1">Tratamento: {testimonial.time}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Invista no Seu Maior Ativo: Você Mesmo
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Milhares de adultos já transformaram seus sorrisos e suas vidas. Você é o próximo.
          </p>

          <Button size="lg" variant="secondary" className="text-xl px-12 py-8" asChild>
            <Link href="/pacientes/agendar">
              Começar Minha Transformação
              <ChevronRight className="ml-2 h-6 w-6" />
            </Link>
          </Button>

          <p className="text-sm text-slate-400 mt-6">
            ✨ Avaliação 100% gratuita • Simulação 3D do resultado • Sem compromisso
          </p>
        </div>
      </section>
    </div>
  )
}
