import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Users, Award, Zap, Shield, Star, CheckCircle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 to-secondary/5 py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground mb-6">
              A transformação do seu sorriso, <span className="text-primary">agora ao seu alcance</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Democratizamos o acesso à ortodontia digital de ponta no Brasil. Tecnologia de classe mundial com
              acessibilidade financeira para a nova classe média brasileira.
            </p>

            {/* Audience Segmentation */}
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary">
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-heading font-semibold mb-2">SOU PACIENTE</h3>
                  <p className="text-muted-foreground mb-4">
                    Descubra como conquistar o sorriso dos seus sonhos com parcelas que cabem no seu orçamento
                  </p>
                  <Button asChild className="w-full group-hover:bg-primary/90">
                    <Link href="/pacientes">
                      Quero transformar meu sorriso
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-secondary">
                <CardContent className="p-8 text-center">
                  <Award className="h-12 w-12 text-secondary mx-auto mb-4" />
                  <h3 className="text-xl font-heading font-semibold mb-2">SOU ORTODONTISTA</h3>
                  <p className="text-muted-foreground mb-4">
                    Seja nosso parceiro estratégico e revolucione sua clínica com tecnologia de ponta
                  </p>
                  <Button asChild variant="secondary" className="w-full group-hover:bg-secondary/90">
                    <Link href="/ortodontistas">
                      Quero ser parceiro Atma
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">TRANSFORMANDO SORRISOS EM TODO O BRASIL</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Milhares de brasileiros já conquistaram o sorriso dos sonhos com a tecnologia Atma Aligner
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl font-heading font-bold text-primary mb-2">15.000+</div>
              <p className="text-muted-foreground">Sorrisos transformados</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-heading font-bold text-primary mb-2">500+</div>
              <p className="text-muted-foreground">Ortodontistas parceiros</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-heading font-bold text-primary mb-2">98%</div>
              <p className="text-muted-foreground">Satisfação dos pacientes</p>
            </div>
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Sempre sonhei em ter dentes alinhados, mas achava que seria impossível financeiramente. Com a Atma
                  Align consegui parcelar em 24x sem juros e hoje tenho a autoestima que sempre quis!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary font-semibold">M</span>
                  </div>
                  <div>
                    <p className="font-semibold">Mariana Santos</p>
                    <p className="text-sm text-muted-foreground">Professora - São Paulo, SP</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "A parceria com a Atma Aligner transformou minha clínica. Aumentei minha receita em 60% e posso oferecer
                  tratamentos de alta qualidade com preços acessíveis aos meus pacientes."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary font-semibold">Dr</span>
                  </div>
                  <div>
                    <p className="font-semibold">Dr. Lucas Mendes</p>
                    <p className="text-sm text-muted-foreground">Ortodontista Empreendedor - Campinas, SP</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Credibility */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">TECNOLOGIA DE CLASSE MUNDIAL</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Combinamos conhecimento técnico e capacidade de inovação para criar soluções que transformam sorrisos e
              revolucionam negócios
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">IMPRESSÃO 3D AVANÇADA</h3>
              <p className="text-muted-foreground">Equipamentos Formlabs de última geração para máxima precisão</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">MATERIAIS BIOCOMPATÍVEIS</h3>
              <p className="text-muted-foreground">Termoplásticos de alta qualidade, seguros e confortáveis</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">SOFTWARE INTELIGENTE</h3>
              <p className="text-muted-foreground">Planejamento digital com IA para resultados previsíveis</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/ortodontistas/tecnologia">
                Conheça nossa tecnologia
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">PRONTO PARA TRANSFORMAR SEU SORRISO?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Junte-se a milhares de brasileiros que já conquistaram o sorriso dos sonhos com parcelas que cabem no
            orçamento
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/pacientes/encontre-doutor">Encontre um doutor perto de você</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link href="/pacientes/precos">Ver preços e financiamento</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
