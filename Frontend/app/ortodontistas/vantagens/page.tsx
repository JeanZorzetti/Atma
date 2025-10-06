import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, TrendingUp, DollarSign, Zap, Users, BarChart3, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function VantagensPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-4 text-primary border-primary/20">
            Vantagens Exclusivas
          </Badge>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Por que escolher a <span className="text-primary">Atma Aligner</span>?
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Descubra as vantagens exclusivas que fazem da Atma Aligner a parceira ideal para ortodontistas empreendedores.
          </p>
        </div>
      </section>

      {/* Principais Vantagens */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
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
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span>Suporte de marketing completo</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span>Geração de leads qualificados</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
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
                    <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                    <span>Pagamento em etapas do tratamento</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                    <span>Sem investimento inicial alto</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secondary mr-2" />
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
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span>Interface intuitiva e fácil de usar</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span>Suporte técnico especializado</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span>Treinamento completo da equipe</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Vantagens Financeiras Detalhadas */}
      <section className="py-16 px-4 bg-muted">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Vantagens Financeiras Comprovadas</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Números reais que transformam a lucratividade da sua clínica
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center">
              <CardContent className="p-6">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-heading font-semibold mb-2">Aumento de Lucratividade</h3>
                <p className="text-4xl font-heading font-bold text-primary mb-2">+35%</p>
                <p className="text-muted-foreground text-sm">
                  Margem média superior aos métodos tradicionais, com custos operacionais reduzidos
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <DollarSign className="h-12 w-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-heading font-semibold mb-2">Fluxo de Caixa Otimizado</h3>
                <p className="text-4xl font-heading font-bold text-secondary mb-2">60%</p>
                <p className="text-muted-foreground text-sm">
                  Redução no capital imobilizado, liberando recursos para crescimento
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-heading font-semibold mb-2">ROI Acelerado</h3>
                <p className="text-4xl font-heading font-bold text-primary mb-2">4-6</p>
                <p className="text-muted-foreground text-sm">
                  Meses para retorno do investimento, versus 12-18 meses do modelo tradicional
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-destructive/20 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <span>✗</span> Modelo Tradicional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">✗</span>
                    Lab fee alto pago antecipadamente
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">✗</span>
                    Risco total do investimento na clínica
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">✗</span>
                    Fluxo de caixa comprometido
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">✗</span>
                    Sem flexibilidade para ajustes
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary bg-primary/5">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Modelo Atma Aligner
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-1" />
                    <span>Pagamento faseado conforme entrega</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-1" />
                    <span>Risco compartilhado e mitigado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-1" />
                    <span>Capital de giro preservado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-1" />
                    <span>Flexibilidade total para mudanças</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Resultados Comprovados */}
      <section className="py-16 px-4 bg-muted">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Resultados que Nossos Parceiros Alcançaram</h2>
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
                meus pacientes."
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

      {/* Links para Páginas Detalhadas */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Próximos Passos</h2>
            <p className="text-muted-foreground">Escolha como deseja aprofundar seu conhecimento</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Users className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-heading font-semibold mb-2">Comparar Modelos</h3>
                <p className="text-muted-foreground mb-4">
                  Veja lado a lado as diferenças entre Atma Aligner e Atma Labs para escolher o modelo ideal.
                </p>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/ortodontistas/modelos-parceria">
                    Ver Comparação
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <BarChart3 className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-heading font-semibold mb-2">Análise Financeira Detalhada</h3>
                <p className="text-muted-foreground mb-4">
                  Veja números detalhados, projeções de ROI e simulações de faturamento para sua clínica.
                </p>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/ortodontistas/comparar-modelos">
                    Ver Análise Completa
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Pronto para Revolucionar sua Clínica?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Junte-se a mais de 200 ortodontistas que já escolheram a Atma Aligner como parceira para impulsionar seus
            negócios
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/ortodontistas/seja-parceiro">
              Quero Ser Parceiro Agora
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
