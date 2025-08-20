import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, TrendingUp, DollarSign, Zap, Users, BarChart3, Shield, Award } from "lucide-react"

export default function OrtodontistasPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
              Mais lucratividade, menos risco. <span className="text-primary">A parceria definitiva</span> para o
              ortodontista empreendedor.
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Seja nosso parceiro e impulsione a lucratividade da sua clínica com tecnologia de ponta, flexibilidade de
              negócio e suporte completo.
            </p>
            <Button asChild size="lg">
              <Link href="/ortodontistas/seja-parceiro">
                Quero ser parceiro Atma Aligner
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Proposta de Valor */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Por que escolher a Atma Aligner como parceira?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Três pilares fundamentais que fazem a diferença no seu negócio
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="p-8">
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-heading font-semibold mb-4">Flexibilidade Total</h3>
                <p className="text-muted-foreground mb-6">
                  Escolha entre nossos modelos Atma Aligner (marca própria) ou Atma Labs (white-label). Adapte a parceria
                  ao perfil da sua clínica.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <ArrowRight className="h-4 w-4 text-primary mr-2" />
                    <span>Suporte de marketing completo</span>
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="h-4 w-4 text-primary mr-2" />
                    <span>Geração de leads qualificados</span>
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="h-4 w-4 text-primary mr-2" />
                    <span>Controle total da sua marca</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-secondary transition-colors">
              <CardContent className="p-8">
                <DollarSign className="h-12 w-12 text-secondary mb-4" />
                <h3 className="text-xl font-heading font-semibold mb-4">Inteligência Financeira</h3>
                <p className="text-muted-foreground mb-6">
                  Modelo de pagamento faseado que protege seu fluxo de caixa e integração com fintechs para facilitar o
                  financiamento dos pacientes.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <ArrowRight className="h-4 w-4 text-secondary mr-2" />
                    <span>Pagamento em etapas do tratamento</span>
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="h-4 w-4 text-secondary mr-2" />
                    <span>Sem investimento inicial alto</span>
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="h-4 w-4 text-secondary mr-2" />
                    <span>Financiamento facilitado para pacientes</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="p-8">
                <Zap className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-heading font-semibold mb-4">Tecnologia Simplificada</h3>
                <p className="text-muted-foreground mb-6">
                  Software intuitivo, suporte técnico robusto e processo de trabalho otimizado para máxima eficiência na
                  sua clínica.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <ArrowRight className="h-4 w-4 text-primary mr-2" />
                    <span>Interface intuitiva e fácil de usar</span>
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="h-4 w-4 text-primary mr-2" />
                    <span>Suporte técnico especializado</span>
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="h-4 w-4 text-primary mr-2" />
                    <span>Treinamento completo da equipe</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Modelos de Parceria */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Escolha o modelo ideal para sua clínica</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Duas opções de parceria pensadas para diferentes perfis de ortodontistas empreendedores
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 border-primary">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Award className="h-8 w-8 text-primary mr-3" />
                  <h3 className="text-2xl font-heading font-bold">Atma Aligner</h3>
                </div>
                <p className="text-lg text-muted-foreground mb-6">Marca Própria - Solução Completa</p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Suporte de marketing e branding completo</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Geração de leads qualificados</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Material promocional personalizado</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Treinamento e capacitação contínua</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Suporte técnico prioritário</span>
                  </li>
                </ul>

                <Button asChild className="w-full">
                  <Link href="/ortodontistas/modelos-parceria#atma-align">Saiba mais sobre Atma Aligner</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-secondary">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Shield className="h-8 w-8 text-secondary mr-3" />
                  <h3 className="text-2xl font-heading font-bold">Atma Labs</h3>
                </div>
                <p className="text-lg text-muted-foreground mb-6">White-Label - Máxima Flexibilidade</p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-secondary mr-2 mt-0.5" />
                    <span>Construa sua própria marca local</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-secondary mr-2 mt-0.5" />
                    <span>Controle total sobre preços e margens</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-secondary mr-2 mt-0.5" />
                    <span>Serviço "à la carte" flexível</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-secondary mr-2 mt-0.5" />
                    <span>Tecnologia e produção de ponta</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-secondary mr-2 mt-0.5" />
                    <span>Suporte técnico especializado</span>
                  </li>
                </ul>

                <Button asChild variant="secondary" className="w-full">
                  <Link href="/ortodontistas/modelos-parceria#atma-labs">Saiba mais sobre Atma Labs</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Resultados de Parceiros */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Resultados que nossos parceiros alcançaram</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Números reais de ortodontistas que já fazem parte da família Atma Aligner
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-4xl font-heading font-bold text-primary mb-2">+40%</div>
              <p className="text-muted-foreground">Aumento médio na receita</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-4xl font-heading font-bold text-primary mb-2">+60%</div>
              <p className="text-muted-foreground">Mais pacientes ortodônticos</p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-4xl font-heading font-bold text-primary mb-2">30%</div>
              <p className="text-muted-foreground">Aumento na taxa de conversão</p>
            </div>
          </div>

          {/* Depoimento */}
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8 text-center">
              <p className="text-lg text-muted-foreground mb-6 italic">
                "A parceria com a Atma Aligner revolucionou minha clínica. Não só aumentei significativamente minha
                receita, como também posso oferecer um tratamento de qualidade internacional a preços acessíveis para
                meus pacientes. O suporte é excepcional e a tecnologia é impressionante."
              </p>
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary font-semibold">Dr</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold">Dr. Lucas Mendes</p>
                  <p className="text-sm text-muted-foreground">Ortodontista - Campinas, SP</p>
                  <p className="text-sm text-muted-foreground">Parceiro Atma Aligner há 2 anos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Pronto para revolucionar sua clínica?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Junte-se a mais de 200 ortodontistas que já escolheram a Atma Aligner como parceira para impulsionar seus
            negócios
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/ortodontistas/seja-parceiro">Quero ser parceiro agora</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link href="/ortodontistas/vantagens">Ver vantagens financeiras</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
