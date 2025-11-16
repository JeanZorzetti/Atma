import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Heart, Shield, Star, ChevronRight, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Alinhadores Invisíveis para Crianças (6-12 anos) | Atma Aligner",
  description: "Ortodontia invisível para crianças. Tratamento confortável, seguro e eficaz para guiar o crescimento dental. Consulta gratuita.",
  keywords: "alinhador criança, ortodontia infantil, aparelho invisível criança, tratamento ortodôntico precoce",
}

export default function CriancasPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-white pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <Badge className="mb-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2">
                  🧒 Para Crianças de 6-12 Anos
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 leading-tight mb-6">
                  Sorriso Saudável<br />
                  <span className="text-purple-600">Desde Cedo</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Alinhadores invisíveis desenvolvidos especialmente para crianças.
                  Confortável, seguro e eficaz para guiar o crescimento dental correto.
                </p>
              </div>

              <ul className="space-y-4">
                {[
                  "Confortável - sem dor ou desconforto",
                  "Seguro - material certificado para crianças",
                  "Eficaz - guia o crescimento correto dos dentes",
                  "Higiênico - removível para escovar e comer",
                  "Sem restrições - pode comer de tudo"
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-purple-600 hover:bg-purple-700"
                  asChild
                >
                  <Link href="/pacientes/agendar">
                    Agendar Avaliação Gratuita
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-2 border-purple-600 text-purple-600 hover:bg-purple-50"
                  asChild
                >
                  <Link href="/quiz">
                    Fazer Quiz Rápido
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/assets/images/patients/alinhadores-invisiveis-avaliacao-gratuita.jpg"
                  alt="Criança feliz com alinhador invisível"
                  width={600}
                  height={700}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Por Que Começar Cedo */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">
              Por Que Começar o Tratamento Cedo?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A ortodontia preventiva evita problemas maiores no futuro
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Heart className="h-12 w-12 text-purple-600" />,
                title: "Guia o Crescimento",
                description: "Aproveita o crescimento natural dos ossos da face para corrigir problemas antes que se tornem complexos"
              },
              {
                icon: <Shield className="h-12 w-12 text-purple-600" />,
                title: "Previne Problemas",
                description: "Evita que problemas leves se tornem graves, reduzindo a necessidade de tratamentos invasivos no futuro"
              },
              {
                icon: <Clock className="h-12 w-12 text-purple-600" />,
                title: "Tratamento Mais Rápido",
                description: "Em crianças, os dentes se movem mais rápido e respondem melhor ao tratamento ortodôntico"
              }
            ].map((item, i) => (
              <Card key={i} className="text-center hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-4">
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

      {/* Problemas que Tratamos */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-purple-50 to-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-heading font-bold text-gray-900 mb-12 text-center">
            Problemas que Tratamos em Crianças
          </h2>

          <div className="space-y-6">
            {[
              {
                title: "Dentes Apinhados",
                description: "Quando não há espaço suficiente e os dentes crescem tortos ou sobrepostos"
              },
              {
                title: "Mordida Cruzada",
                description: "Quando os dentes superiores não se encaixam corretamente com os inferiores"
              },
              {
                title: "Espaçamento Excessivo",
                description: "Dentes com espaços grandes entre eles que podem causar problemas de dicção"
              },
              {
                title: "Sobremordida",
                description: "Quando os dentes superiores cobrem muito os inferiores ao fechar a boca"
              },
              {
                title: "Mordida Aberta",
                description: "Quando há um espaço entre os dentes superiores e inferiores ao morder"
              }
            ].map((problem, i) => (
              <Card key={i} className="hover:border-purple-600 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{problem.title}</h3>
                      <p className="text-gray-600">{problem.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Segurança e Conforto */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-heading font-bold text-gray-900 mb-6">
                Segurança e Conforto em Primeiro Lugar
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Check className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Material Certificado</h3>
                    <p className="text-gray-600">
                      PETG Duran® alemão aprovado para uso em crianças, sem BPA ou substâncias tóxicas
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Check className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Sem Dor ou Desconforto</h3>
                    <p className="text-gray-600">
                      Pressão leve e gradual, sem os ferimentos causados por brackets metálicos
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Check className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Acompanhamento Constante</h3>
                    <p className="text-gray-600">
                      Consultas regulares com ortodontista especializado em tratamento infantil
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Check className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Higiene Facilitada</h3>
                    <p className="text-gray-600">
                      Alinhadores removíveis permitem escovação normal, mantendo a saúde bucal
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/assets/images/patients/3G8XV52i8e0ieAwhSgisebS4Yvy0dTS3Bf80K0Aj.jpeg"
                alt="Criança escovando dentes com alinhador"
                width={600}
                height={600}
                className="w-full h-auto rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Preços */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-purple-50 to-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">
            Investimento no Futuro do Seu Filho
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Planos acessíveis com parcelamento facilitado
          </p>

          <Card className="border-4 border-purple-600 shadow-2xl">
            <CardContent className="p-10">
              <div className="mb-8">
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  A partir de R$ 3.990
                </div>
                <p className="text-xl text-gray-600">
                  ou <strong>12x de R$ 166</strong> sem juros
                </p>
              </div>

              <ul className="text-left space-y-3 mb-8">
                {[
                  "Consulta de avaliação gratuita",
                  "Escaneamento 3D indolor (sem massa)",
                  "Todos os alinhadores incluídos",
                  "Acompanhamento profissional completo",
                  "Garantia de satisfação"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-purple-600 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                className="w-full text-lg py-6 bg-purple-600 hover:bg-purple-700"
                asChild
              >
                <Link href="/pacientes/agendar">
                  Agendar Consulta Gratuita
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-heading font-bold text-gray-900 mb-12 text-center">
            Perguntas Frequentes dos Pais
          </h2>

          <div className="space-y-6">
            {[
              {
                q: "Com que idade meu filho pode usar alinhadores invisíveis?",
                a: "Geralmente a partir dos 6-7 anos, quando os primeiros molares permanentes já nasceram. O ortodontista avaliará se a criança está pronta para o tratamento."
              },
              {
                q: "Meu filho vai conseguir usar corretamente?",
                a: "Sim! Os alinhadores são muito mais simples que aparelhos fixos. Com a orientação adequada e acompanhamento dos pais, a maioria das crianças se adapta muito bem."
              },
              {
                q: "É seguro para crianças?",
                a: "Totalmente seguro. Usamos material certificado PETG Duran® alemão, livre de BPA e aprovado para uso em crianças. Sem fios ou brackets que podem machucar."
              },
              {
                q: "Quanto tempo dura o tratamento?",
                a: "Varia de 6 a 18 meses dependendo do caso. Em crianças, os resultados costumam aparecer mais rápido devido ao crescimento ativo."
              },
              {
                q: "E se meu filho perder ou quebrar o alinhador?",
                a: "Temos reposição disponível. Entre em contato imediatamente com o ortodontista para receber orientações e, se necessário, um novo alinhador."
              }
            ].map((faq, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-3">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Dê ao Seu Filho o Presente de um Sorriso Saudável
          </h2>
          <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
            Agende uma consulta de avaliação gratuita e descubra como podemos ajudar
          </p>

          <Button
            size="lg"
            variant="secondary"
            className="text-xl px-12 py-8"
            asChild
          >
            <Link href="/pacientes/agendar">
              Agendar Avaliação Gratuita
              <ChevronRight className="ml-2 h-6 w-6" />
            </Link>
          </Button>

          <p className="text-sm text-purple-200 mt-6">
            ✨ Sem compromisso • Avaliação completa • Pais sempre acompanham
          </p>
        </div>
      </section>
    </div>
  )
}
