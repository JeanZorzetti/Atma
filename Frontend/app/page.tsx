import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TickerTape } from "@/components/ui/ticker-tape"
import { StepCarousel } from "@/components/ui/step-carousel"
import { DoctorLocator } from "@/components/ui/doctor-locator"
import { Check, Star, Clock, DollarSign, Award, Users, Sparkles, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { StructuredData } from "@/components/structured-data"

export const metadata: Metadata = {
  title: "Atma Aligner - Alinhadores Invisíveis com Tecnologia Alemã | 50% Mais Barato",
  description: "Transforme seu sorriso com alinhadores invisíveis premium. Tecnologia PETG Duran® alemã, certificado ISO 13485. A partir de R$ 3.990. Consulta gratuita.",
  keywords: "alinhador invisível, aparelho invisível, ortodontia invisível, atma aligner, alinhadores transparentes, preço alinhador",
}

const tickerMessages = [
  "✨ Consulta de Avaliação 100% GRATUITA - Agende Agora!",
  "🎯 15.000+ Sorrisos Transformados em Todo Brasil",
  "💰 Até 50% Mais Barato que Concorrentes Internacionais",
  "🇩🇪 Tecnologia Alemã Certificada ISO 13485 + CE + ANVISA"
]

const treatmentSteps = [
  {
    step: 1,
    title: "Consulta Gratuita",
    description: "Agende sua avaliação sem compromisso. Escaneamento 3D indolor e simulação do resultado final.",
    image: "/images/products/alinhador-invisivel-mitos-e-verdades.jpg",
    details: [
      "Sem necessidade de massa (escaneamento digital)",
      "Simulação 3D do resultado em minutos",
      "Avaliação ortodôntica completa",
      "Plano de tratamento personalizado"
    ]
  },
  {
    step: 2,
    title: "Receba Seus Alinhadores",
    description: "Fabricados sob medida com PETG alemão de grau médico. Entrega em 2-3 semanas.",
    image: "/images/products/Gemini_Generated_Image_ktkv4fktkv4fktkv.png",
    details: [
      "Produção 100% personalizada",
      "Material certificado para uso médico",
      "Kit completo com estojo e instruções",
      "Acompanhamento por aplicativo"
    ]
  },
  {
    step: 3,
    title: "Acompanhamento e Resultado",
    description: "Consultas a cada 4-6 semanas. Veja seu sorriso evoluir semana após semana.",
    image: "/images/patients/3G8XV52i8e0ieAwhSgisebS4Yvy0dTS3Bf80K0Aj.jpeg",
    details: [
      "Consultas presenciais ou online",
      "Troca de alinhadores a cada 7-14 dias",
      "Monitoramento com IA do progresso",
      "Garantia de satisfação"
    ]
  }
]

export default function HomePage() {
  return (
    <>
      <StructuredData />

      {/* Ticker Tape - Mensagens Rotativas */}
      <TickerTape messages={tickerMessages} />

      {/* SEÇÃO 1: HERO - Paciente Real + Benefícios */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Coluna Esquerda - Copy */}
            <div className="space-y-8">
              <div>
                <Badge className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">
                  🇩🇪 Tecnologia Alemã Certificada
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 leading-tight mb-6">
                  Transforme Seu Sorriso<br />
                  <span className="text-blue-600">Sem Que Ninguém Perceba</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Alinhadores invisíveis premium com tecnologia alemã PETG Duran®.
                  Resultados comprovados, preço justo brasileiro.
                </p>
              </div>

              {/* Lista de Benefícios */}
              <ul className="space-y-4">
                {[
                  "Invisível - ninguém vai notar que você está usando",
                  "Removível - coma o que quiser, sem restrições",
                  "Confortável - sem fios ou brackets que machucam",
                  "Rápido - resultados visíveis em 3-6 meses",
                  "Acessível - até 50% mais barato que Invisalign®"
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 shadow-xl hover:shadow-2xl transition-all"
                  asChild
                >
                  <Link href="/pacientes/encontre-doutor">
                    Agendar Consulta Gratuita
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                  asChild
                >
                  <Link href="/quiz">
                    Fazer Quiz de 2 Minutos
                  </Link>
                </Button>
              </div>

              {/* Social Proof Compacto */}
              <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white" />
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 font-medium">15.000+ pacientes felizes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna Direita - Imagem */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/patients/alinhadores-invisiveis-avaliacao-gratuita.jpg"
                  alt="Paciente feliz usando alinhador invisível Atma"
                  width={600}
                  height={700}
                  className="w-full h-auto"
                  priority
                />
                {/* Badge Flutuante */}
                <div className="absolute bottom-8 left-8 bg-white rounded-2xl shadow-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Tratamento Concluído</p>
                      <p className="text-sm text-gray-600">Em apenas 8 meses</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: QUANTO CUSTA - Preços Transparentes */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
              <DollarSign className="h-5 w-5" />
              <span className="font-semibold">Preços Transparentes</span>
            </div>
            <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">
              Quanto Custa o Tratamento?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Até <strong className="text-blue-600">50% mais barato</strong> que concorrentes internacionais.
              Parcelamento facilitado em até 24x.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: "Casos Simples", aligners: "Até 20", price: "3.990", monthly: "166", time: "6-12 meses" },
              { name: "Casos Moderados", aligners: "21-35", price: "5.990", monthly: "250", time: "9-15 meses", featured: true },
              { name: "Casos Complexos", aligners: "36+", price: "8.990", monthly: "375", time: "12-18 meses" }
            ].map((plan, i) => (
              <Card key={i} className={`relative ${plan.featured ? 'border-4 border-blue-600 shadow-2xl scale-105' : 'border-2'}`}>
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4 py-1">Mais Popular</Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.aligners} alinhadores</p>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-gray-600">R$</span>
                      <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      ou <strong>12x de R$ {plan.monthly}</strong> sem juros
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-gray-700 mb-6">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span>Duração: {plan.time}</span>
                  </div>

                  <Button className={`w-full ${plan.featured ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-gray-800'}`} asChild>
                    <Link href="/pacientes/encontre-doutor">Agendar Avaliação</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center text-gray-500 mt-8">
            💰 <strong>Compare:</strong> Invisalign® custa entre R$ 15.000 - R$ 20.000
          </p>
        </div>
      </section>

      {/* SEÇÃO 3: CARROSSEL DE 3 ETAPAS */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">
              Como Funciona o Tratamento
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Do escaneamento 3D ao sorriso dos sonhos em apenas 3 passos simples
            </p>
          </div>

          <StepCarousel steps={treatmentSteps} />
        </div>
      </section>

      {/* SEÇÃO 4: SOCIAL PROOF - Pacientes Reais */}
      <section className="py-16 md:py-24 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-4">
              <Users className="h-5 w-5" />
              <span className="font-semibold">Resultados Comprovados</span>
            </div>
            <h2 className="text-4xl font-heading font-bold mb-4">
              15.000+ Sorrisos Transformados
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Pacientes reais compartilham suas jornadas de transformação
            </p>
          </div>

          {/* TODO: Criar carrossel de antes/depois com fotos reais autorizadas */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { name: "Ana Carolina, 28", time: "8 meses", rating: 5, image: "/images/testimonials/como-ter-um-sorriso-bonito.jpg" },
              { name: "Pedro Silva, 34", time: "10 meses", rating: 5, image: "/images/testimonials/homem-bonito-posando-e-sorrindo_23-2149396133.avif" },
              { name: "Juliana Santos, 42", time: "12 meses", rating: 5, image: "/images/testimonials/SorrisosOdontologia-1643897220voce-gostaria-de-ter-um-sorriso-bonito-.webp" }
            ].map((patient, i) => (
              <Card key={i} className="bg-white/10 backdrop-blur border-white/20">
                <CardContent className="p-6">
                  <div className="aspect-square bg-white/20 rounded-lg mb-4 overflow-hidden">
                    <Image
                      src={patient.image}
                      alt={`Paciente ${patient.name} - Resultado do tratamento`}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(patient.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-white/90 mb-4 italic">
                    "Resultado incrível! Muito mais barato que Invisalign e qualidade impecável."
                  </p>
                  <p className="font-semibold">{patient.name}</p>
                  <p className="text-sm text-blue-200">Tratamento em {patient.time}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/pacientes/antes-depois">
                Ver Todos os Resultados
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* SEÇÃO 6: TECNOLOGIA ALEMÃ */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/patients/alinhadores-transparentes-1000x667.jpg_0.webp"
                  alt="Material PETG Duran alemão com certificações"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Badge className="mb-4 bg-blue-600 text-white">
                  <Award className="h-4 w-4 mr-2" />
                  Certificações Internacionais
                </Badge>
                <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">
                  Tecnologia PETG Duran® Alemã
                </h2>
                <p className="text-xl text-gray-600">
                  Material de grau médico certificado ISO 13485, CE e ANVISA.
                  A mesma qualidade premium internacional, com preço brasileiro.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: "🇩🇪", title: "Fabricado na Alemanha", desc: "Importado direto, sem intermediários" },
                  { icon: "🔬", title: "Grau Médico", desc: "Certificado para contato prolongado com tecidos bucais" },
                  { icon: "✅", title: "ISO 13485 + CE", desc: "Padrão ouro em dispositivos médicos" },
                  { icon: "🏆", title: "ANVISA Aprovado", desc: "Regulamentado e seguro para uso no Brasil" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-3xl">{item.icon}</div>
                    <div>
                      <h4 className="font-bold text-gray-900">{item.title}</h4>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/tecnologia">
                  Conheça Nossa Tecnologia
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 7: LOCALIZADOR DE ORTODONTISTAS */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <DoctorLocator />
        </div>
      </section>

      {/* SEÇÃO 9: CTA FINAL FORTE */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Pronto Para Transformar Seu Sorriso?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Agende sua <strong>consulta de avaliação 100% gratuita</strong> e descubra
            como os alinhadores Atma podem mudar sua vida.
          </p>

          <Button
            size="lg"
            variant="secondary"
            className="text-xl px-12 py-8 shadow-2xl hover:shadow-3xl transition-all"
            asChild
          >
            <Link href="/pacientes/agendar">
              Agendar Consulta Gratuita Agora
              <ChevronRight className="ml-2 h-6 w-6" />
            </Link>
          </Button>

          <p className="text-sm text-blue-200 mt-6">
            ✨ Sem compromisso • Avaliação completa • Simulação 3D incluída
          </p>
        </div>
      </section>
    </>
  )
}
