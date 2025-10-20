import type { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
  title: 'Antes e Depois: Resultados Reais com Alinhadores Invisíveis | Atma',
  description: 'Veja transformações reais de pacientes com alinhadores invisíveis Atma. 5.000+ sorrisos transformados, 98% satisfação. Casos de apinhamento, diastema, sobremordida e mais.',
  keywords: 'alinhador invisível antes e depois, resultado alinhador transparente, casos reais ortodontia, transformação sorriso, antes depois aparelho invisível',
  openGraph: {
    title: 'Antes e Depois: Transformações Reais com Alinhadores | Atma',
    description: '5.000+ sorrisos transformados. Veja resultados reais de tratamentos com alinhadores invisíveis: apinhamento, diastema, sobremordida e mais.',
    type: 'website',
    images: ['/straight-smile-results.png'],
  },
  alternates: {
    canonical: 'https://atmaaligner.com.br/pacientes/antes-depois'
  }
};

export default function AntesDepoisPage() {
  const casos = [
    {
      id: 1,
      nome: "Maria Silva",
      idade: 28,
      cidade: "São Paulo, SP",
      duracao: "8 meses",
      problema: "Apinhamento anterior",
      rating: 5,
      depoimento:
        "Não acreditava que seria possível ter um sorriso tão bonito. O tratamento foi muito mais fácil do que imaginava!",
      antes: "/teeth-before-crowding.png",
      depois: "/straight-smile-results.png",
    },
    {
      id: 2,
      nome: "João Santos",
      idade: 35,
      cidade: "Rio de Janeiro, RJ",
      duracao: "12 meses",
      problema: "Diastema central",
      rating: 5,
      depoimento: "Fechei o espaço entre os dentes sem ninguém perceber que estava fazendo tratamento. Incrível!",
      antes: "/teeth-gap-before.png",
      depois: "/teeth-closed-gap-after.png",
    },
    {
      id: 3,
      nome: "Ana Costa",
      idade: 24,
      cidade: "Belo Horizonte, MG",
      duracao: "10 meses",
      problema: "Sobremordida",
      rating: 5,
      depoimento: "Minha autoestima mudou completamente. Agora sorrio sem vergonha e me sinto muito mais confiante!",
      antes: "/overbite-teeth-before.png",
      depois: "/perfect-bite-teeth-after.png",
    },
    {
      id: 4,
      nome: "Carlos Oliveira",
      idade: 42,
      cidade: "Porto Alegre, RS",
      duracao: "14 meses",
      problema: "Apinhamento severo",
      rating: 5,
      depoimento:
        "Nunca pensei que aos 42 anos faria ortodontia. Com os alinhadores foi discreto e o resultado superou minhas expectativas.",
      antes: "/placeholder-9a44n.png",
      depois: "/straight-aligned-teeth-after.png",
    },
    {
      id: 5,
      nome: "Fernanda Lima",
      idade: 31,
      cidade: "Brasília, DF",
      duracao: "9 meses",
      problema: "Rotação dental",
      rating: 5,
      depoimento:
        "O tratamento foi muito confortável. Consegui manter minha rotina normal e ninguém notava os alinhadores.",
      antes: "/rotated-teeth-before.png",
      depois: "/aligned-teeth-after.png",
    },
    {
      id: 6,
      nome: "Roberto Mendes",
      idade: 29,
      cidade: "Salvador, BA",
      duracao: "11 meses",
      problema: "Mordida cruzada",
      rating: 5,
      depoimento: "Além do sorriso bonito, melhorou minha mastigação. Valeu cada centavo investido no meu sorriso!",
      antes: "/placeholder.svg?height=300&width=300",
      depois: "/placeholder.svg?height=300&width=300",
    },
  ]

  // Schema.org Review and AggregateRating
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Atma Aligner - Alinhadores Invisíveis",
    "description": "Alinhadores invisíveis com tecnologia alemã premium. Sistema completo de ortodontia digital.",
    "brand": {
      "@type": "Brand",
      "name": "Atma Aligner"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "5000",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": casos.map((caso) => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": caso.nome
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": caso.rating,
        "bestRating": "5",
        "worstRating": "1"
      },
      "reviewBody": caso.depoimento,
      "datePublished": "2025-01-15"
    }))
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">Casos de Sucesso</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Transformações Reais</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Veja como nossos pacientes transformaram seus sorrisos com os alinhadores Atma. Resultados reais de pessoas
            como você.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">5.000+</div>
              <div className="text-gray-600">Sorrisos transformados</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">Satisfação dos pacientes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10 meses</div>
              <div className="text-gray-600">Tempo médio de tratamento</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">4.9★</div>
              <div className="text-gray-600">Avaliação média</div>
            </div>
          </div>
        </div>
      </section>

      {/* Cases Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {casos.map((caso) => (
              <Card key={caso.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  {/* Before/After Images */}
                  <div className="grid grid-cols-2">
                    <div className="relative">
                      <Image
                        src={caso.antes || "/placeholder.svg"}
                        alt={`Dentes antes do tratamento com alinhador invisível - caso de ${caso.problema.toLowerCase()}`}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                        Antes
                      </div>
                    </div>
                    <div className="relative">
                      <Image
                        src={caso.depois || "/placeholder.svg"}
                        alt={`Resultado após tratamento com alinhador invisível Atma - ${caso.problema.toLowerCase()} corrigido em ${caso.duracao}`}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-sm font-medium">
                        Depois
                      </div>
                    </div>
                  </div>

                  {/* Case Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">
                        {caso.nome}, {caso.idade} anos
                      </h3>
                      <div className="flex items-center gap-1">
                        {[...Array(caso.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {caso.cidade}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {caso.duracao}
                      </div>
                    </div>

                    <div className="mb-3">
                      <Badge variant="outline" className="text-xs">
                        {caso.problema}
                      </Badge>
                    </div>

                    <blockquote className="text-sm text-gray-700 italic">"{caso.depoimento}"</blockquote>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Sua Transformação Começa Agora</h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhares de pessoas que já transformaram seus sorrisos com a Atma.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/pacientes/encontre-doutor">Encontre um Doutor</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              <Link href="/pacientes/precos">Ver Preços</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
