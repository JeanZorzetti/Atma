import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Clock, Heart, Smile, DollarSign, CheckCircle, Star } from "lucide-react"

export default function PacientesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
              Seu novo sorriso começa hoje
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Descubra como conquistar o sorriso dos seus sonhos com parcelas que cabem no seu bolso. Tratamento
              discreto, confortável e com resultados garantidos.
            </p>
            <Button asChild size="lg">
              <Link href="/pacientes/encontre-doutor">
                Descubra se o tratamento é para você
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Como funciona o tratamento</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Um processo simples e transparente para transformar seu sorriso
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">Avaliação</h3>
              <p className="text-muted-foreground">Consulta inicial com ortodontista parceiro para avaliar seu caso</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">Planejamento Digital</h3>
              <p className="text-muted-foreground">
                Escaneamento 3D e criação do seu plano de tratamento personalizado
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">Receba seus Alinhadores</h3>
              <p className="text-muted-foreground">
                Alinhadores personalizados entregues na clínica do seu ortodontista
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">4</span>
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">Conquiste seu Sorriso</h3>
              <p className="text-muted-foreground">Acompanhamento regular até alcançar o sorriso dos seus sonhos</p>
            </div>
          </div>
        </div>
      </section>

      {/* A Diferença Atma Aligner */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">A diferença Atma Aligner</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Por que milhares de brasileiros escolhem nossos alinhadores
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Smile className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-heading font-semibold mb-2">Discrição Total</h3>
                <p className="text-muted-foreground text-sm">
                  Praticamente invisíveis, ninguém vai notar que você está usando
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-heading font-semibold mb-2">Máximo Conforto</h3>
                <p className="text-muted-foreground text-sm">
                  Material biocompatível que se adapta perfeitamente aos seus dentes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-heading font-semibold mb-2">Conveniência</h3>
                <p className="text-muted-foreground text-sm">
                  Removível para comer, escovar os dentes e ocasiões especiais
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-heading font-semibold mb-2">Previsibilidade</h3>
                <p className="text-muted-foreground text-sm">
                  Veja o resultado final antes mesmo de começar o tratamento
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Financiamento Destacado */}
      <section className="py-16 bg-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <DollarSign className="h-16 w-16 text-secondary mx-auto mb-6" />
            <h2 className="text-3xl font-heading font-bold mb-4">Tratamento acessível é a nossa prioridade</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Parceria com as principais fintechs do país para oferecer as melhores condições de pagamento
            </p>

            <div className="bg-background rounded-lg p-8 shadow-lg mb-8">
              <div className="text-4xl font-heading font-bold text-primary mb-2">A partir de R$ 399/mês*</div>
              <p className="text-muted-foreground mb-4">*Condições especiais de financiamento em até 24x sem juros</p>
              <div className="flex justify-center items-center space-x-8 mb-6">
                <div className="text-center">
                  <div className="w-12 h-8 bg-primary/10 rounded flex items-center justify-center mb-2">
                    <span className="text-xs font-semibold text-primary">DC</span>
                  </div>
                  <p className="text-xs text-muted-foreground">DentalCred</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-8 bg-primary/10 rounded flex items-center justify-center mb-2">
                    <span className="text-xs font-semibold text-primary">KP</span>
                  </div>
                  <p className="text-xs text-muted-foreground">KonsigaPay</p>
                </div>
              </div>
            </div>

            <Button asChild size="lg">
              <Link href="/pacientes/precos">
                Ver todas as opções de financiamento
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Galeria de Resultados */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Resultados que falam por si</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Veja as transformações reais de quem já conquistou o sorriso dos sonhos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <div className="text-center">
                    <Smile className="h-12 w-12 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Antes e Depois #{i}</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-secondary text-secondary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    "Resultado incrível em apenas 8 meses. Recomendo para todos!"
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">- Paciente Atma Aligner</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/pacientes/antes-depois">
                Ver mais transformações
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Seu novo sorriso está a um clique de distância
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Encontre um ortodontista parceiro perto de você e comece sua transformação hoje mesmo
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/pacientes/encontre-doutor">
              Encontre um doutor perto de você
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
