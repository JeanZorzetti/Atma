import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, DollarSign, CheckCircle, CreditCard, Calendar, Shield } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Preço de Alinhadores Invisíveis 2025 | A partir de R$ 3.990",
  description: "Quanto custa alinhador invisível? Veja preços completos: R$ 3.990 (simples), R$ 5.990 (moderado), R$ 8.990 (complexo). Parcele em até 12x sem juros! Consulta grátis.",
  keywords: ["quanto custa alinhador invisível", "preço alinhadores", "alinhador invisível valor", "financiamento ortodontia", "parcelas sem juros"],
  openGraph: {
    title: "Preço de Alinhadores Invisíveis 2025 | A partir de R$ 3.990",
    description: "Quanto custa alinhador invisível? R$ 3.990 (simples), R$ 5.990 (moderado), R$ 8.990 (complexo). Parcele em 12x sem juros!",
    type: "website",
    url: "https://atma.roilabs.com.br/pacientes/precos",
    images: [
      {
        url: "https://atma.roilabs.com.br/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Preços de Alinhadores Invisíveis - A partir de R$ 3.990"
      }
    ]
  }
}

export default function PrecosPage() {
  const faqs = [
    {
      question: "O que está incluído no preço?",
      answer:
        "O valor inclui todos os alinhadores necessários, consultas de acompanhamento, refinamentos (quando aplicável) e contenção pós-tratamento. Não há custos ocultos.",
    },
    {
      question: "Posso parcelar sem juros?",
      answer:
        "Sim! Oferecemos parcelamento sem juros em até 12x no cartão de crédito e até 24x através de nossas parcerias com fintechs especializadas.",
    },
    {
      question: "Como é definido se meu caso é simples, moderado ou complexo?",
      answer:
        "A classificação é feita pelo ortodontista durante a avaliação inicial, baseada na quantidade de movimentação necessária e complexidade do caso.",
    },
    {
      question: "Há desconto para pagamento à vista?",
      answer: "Sim, oferecemos desconto de até 15% para pagamento à vista via PIX ou transferência bancária.",
    },
  ];

  // Schema.org Product with AggregateRating and Offers
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Atma Aligner - Alinhadores Invisíveis",
    "description": "Alinhadores invisíveis com tecnologia alemã. Tratamento ortodôntico completo, discreto e eficaz.",
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
    "offers": [
      {
        "@type": "Offer",
        "name": "Alinhador Invisível - Casos Simples",
        "price": "3990",
        "priceCurrency": "BRL",
        "availability": "https://schema.org/InStock",
        "priceValidUntil": "2025-12-31",
        "url": "https://atma.roilabs.com.br/pacientes/precos",
        "description": "Até 20 alinhadores. Ideal para pequenos apinhamentos ou diastemas."
      },
      {
        "@type": "Offer",
        "name": "Alinhador Invisível - Casos Moderados",
        "price": "5990",
        "priceCurrency": "BRL",
        "availability": "https://schema.org/InStock",
        "priceValidUntil": "2025-12-31",
        "url": "https://atma.roilabs.com.br/pacientes/precos",
        "description": "21-35 alinhadores. Para apinhamentos médios ou sobremordidas."
      },
      {
        "@type": "Offer",
        "name": "Alinhador Invisível - Casos Complexos",
        "price": "8990",
        "priceCurrency": "BRL",
        "availability": "https://schema.org/InStock",
        "priceValidUntil": "2025-12-31",
        "url": "https://atma.roilabs.com.br/pacientes/precos",
        "description": "Mais de 35 alinhadores. Casos ortodônticos complexos com refinamentos."
      }
    ]
  };

  // Schema.org FAQPage
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
              Preços transparentes, <span className="text-primary">financiamento facilitado</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Conheça nossas opções de pagamento e descubra como conquistar o sorriso dos seus sonhos cabendo no seu
              orçamento
            </p>
          </div>
        </div>
      </section>

      {/* Preços Principais */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Investimento no seu sorriso</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Valores justos para um tratamento de qualidade internacional
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Casos Simples */}
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-heading">Casos Simples</CardTitle>
                <p className="text-muted-foreground">Até 20 alinhadores</p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <div className="text-4xl font-heading font-bold text-primary mb-2">R$ 3.990</div>
                  <p className="text-muted-foreground">ou 12x de R$ 333/mês*</p>
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>6-12 meses de tratamento</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>Até 20 alinhadores</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>Consultas de acompanhamento</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>Contenção pós-tratamento</span>
                  </li>
                </ul>
                <Button asChild className="w-full">
                  <Link href="/pacientes/encontre-doutor">Avaliar meu caso</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Casos Moderados */}
            <Card className="border-2 border-secondary shadow-lg scale-105">
              <CardHeader className="text-center bg-secondary/5">
                <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-semibold mb-2 inline-block">
                  MAIS POPULAR
                </div>
                <CardTitle className="text-2xl font-heading">Casos Moderados</CardTitle>
                <p className="text-muted-foreground">20-30 alinhadores</p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <div className="text-4xl font-heading font-bold text-secondary mb-2">R$ 5.990</div>
                  <p className="text-muted-foreground">ou 18x de R$ 333/mês*</p>
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-secondary mr-2" />
                    <span>12-18 meses de tratamento</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-secondary mr-2" />
                    <span>20-30 alinhadores</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-secondary mr-2" />
                    <span>Refinamentos inclusos</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-secondary mr-2" />
                    <span>Suporte prioritário</span>
                  </li>
                </ul>
                <Button asChild variant="secondary" className="w-full">
                  <Link href="/pacientes/encontre-doutor">Avaliar meu caso</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Casos Complexos */}
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-heading">Casos Complexos</CardTitle>
                <p className="text-muted-foreground">30+ alinhadores</p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <div className="text-4xl font-heading font-bold text-primary mb-2">R$ 8.990</div>
                  <p className="text-muted-foreground">ou 24x de R$ 375/mês*</p>
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>18-24 meses de tratamento</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>30+ alinhadores</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>Refinamentos ilimitados</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>Acompanhamento VIP</span>
                  </li>
                </ul>
                <Button asChild className="w-full">
                  <Link href="/pacientes/encontre-doutor">Avaliar meu caso</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              *Valores sujeitos a aprovação de crédito. Consulte condições com seu ortodontista parceiro.
            </p>
          </div>
        </div>
      </section>

      {/* Opções de Financiamento */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Opções de pagamento flexíveis</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Parceria com as principais fintechs para facilitar seu acesso ao tratamento
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-heading font-semibold mb-2">Cartão de Crédito</h3>
                <p className="text-muted-foreground text-sm mb-4">Parcelamento em até 12x sem juros</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Todas as bandeiras</li>
                  <li>• Aprovação imediata</li>
                  <li>• Sem burocracia</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <DollarSign className="h-12 w-12 text-secondary mx-auto mb-4" />
                <h3 className="text-lg font-heading font-semibold mb-2">DentalCred</h3>
                <p className="text-muted-foreground text-sm mb-4">Financiamento especializado</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Até 24x sem juros</li>
                  <li>• Aprovação em 5 min</li>
                  <li>• Sem consulta SPC/Serasa</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-heading font-semibold mb-2">KonsigaPay</h3>
                <p className="text-muted-foreground text-sm mb-4">Crédito consignado</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Menores taxas do mercado</li>
                  <li>• Desconto em folha</li>
                  <li>• Para servidores públicos</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-secondary mx-auto mb-4" />
                <h3 className="text-lg font-heading font-semibold mb-2">À Vista</h3>
                <p className="text-muted-foreground text-sm mb-4">Desconto especial</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Até 15% de desconto</li>
                  <li>• PIX ou transferência</li>
                  <li>• Melhor custo-benefício</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparativo de Valor */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Por que vale a pena investir?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Compare o custo-benefício dos alinhadores com outras opções
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div>
                    <h3 className="text-xl font-heading font-semibold mb-4">Aparelho Tradicional</h3>
                    <div className="text-2xl font-bold text-muted-foreground mb-2">R$ 8.000 - R$ 15.000</div>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Visível e desconfortável</li>
                      <li>• Dificuldade na higiene</li>
                      <li>• Consultas frequentes</li>
                      <li>• Restrições alimentares</li>
                    </ul>
                  </div>

                  <div className="border-2 border-primary rounded-lg p-6 bg-primary/5">
                    <h3 className="text-xl font-heading font-semibold mb-4 text-primary">Alinhadores Atma Aligner</h3>
                    <div className="text-2xl font-bold text-primary mb-2">R$ 3.990 - R$ 8.990</div>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-primary mr-1" />
                        <span>Praticamente invisível</span>
                      </li>
                      <li className="flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-primary mr-1" />
                        <span>Removível e confortável</span>
                      </li>
                      <li className="flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-primary mr-1" />
                        <span>Menos consultas</span>
                      </li>
                      <li className="flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-primary mr-1" />
                        <span>Sem restrições</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-heading font-semibold mb-4">Outras Marcas</h3>
                    <div className="text-2xl font-bold text-muted-foreground mb-2">R$ 12.000 - R$ 25.000</div>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Preço elevado</li>
                      <li>• Menos acessível</li>
                      <li>• Financiamento limitado</li>
                      <li>• Foco em classes A/B</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Preços */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Dúvidas frequentes sobre preços</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Invista no seu sorriso hoje mesmo</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Descubra qual é o investimento para o seu caso específico e as melhores condições de pagamento
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/pacientes/encontre-doutor">
              Fazer avaliação gratuita
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
