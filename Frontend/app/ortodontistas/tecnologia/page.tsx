import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import {
  Zap,
  Shield,
  CheckCircle,
  Cpu,
  Eye,
  Gauge,
  ArrowRight,
  Play,
  Award,
  Target,
  Clock,
  Users
} from "lucide-react"

export default function TecnologiaPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 to-secondary/5 py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground mb-6">
              Tecnologia de <span className="text-primary">Classe Mundial</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Descubra como nossa tecnologia de ponta está revolucionando a ortodontia no Brasil,
              oferecendo precisão, eficiência e resultados previsíveis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/ortodontistas/seja-parceiro">
                  Quero ser parceiro
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#video-demo">
                  <Play className="mr-2 h-4 w-4" />
                  Ver demonstração
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Overview */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold mb-4">NOSSA STACK TECNOLÓGICA</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Combinamos as melhores tecnologias disponíveis no mercado para criar alinhadores
              de qualidade superior com eficiência máxima
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-4">IMPRESSÃO 3D FORMLABS</h3>
                <p className="text-muted-foreground mb-4">
                  Equipamentos Formlabs Form 3B+ de última geração para máxima precisão
                  e acabamento profissional
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Resolução de 25 micrômetros</li>
                  <li>• Biocompatibilidade certificada</li>
                  <li>• Velocidade de produção otimizada</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Cpu className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-4">SOFTWARE INTELIGENTE</h3>
                <p className="text-muted-foreground mb-4">
                  Planejamento digital com inteligência artificial para resultados
                  previsíveis e otimizados
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• IA para análise facial</li>
                  <li>• Simulação 3D em tempo real</li>
                  <li>• Algoritmos de otimização</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-4">MATERIAIS PREMIUM</h3>
                <p className="text-muted-foreground mb-4">
                  Termoplásticos de alta qualidade, seguros, confortáveis e
                  praticamente invisíveis
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Polyurethane medical grade</li>
                  <li>• Resistência superior</li>
                  <li>• Transparência excepcional</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Flow */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold mb-4">PROCESSO DIGITAL COMPLETO</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Do escaneamento digital à entrega dos alinhadores, todo o processo
              é automatizado e controlado por qualidade
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-primary-foreground font-bold">
                1
              </div>
              <h3 className="font-heading font-semibold mb-2">ESCANEAMENTO</h3>
              <p className="text-sm text-muted-foreground">
                Scanner intraoral de alta precisão captura a arcada dentária
                em detalhes submilimétricos
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-primary-foreground font-bold">
                2
              </div>
              <h3 className="font-heading font-semibold mb-2">PLANEJAMENTO</h3>
              <p className="text-sm text-muted-foreground">
                IA analisa o caso e cria plano de tratamento otimizado
                com simulação 3D do resultado final
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-primary-foreground font-bold">
                3
              </div>
              <h3 className="font-heading font-semibold mb-2">PRODUÇÃO</h3>
              <p className="text-sm text-muted-foreground">
                Impressão 3D Formlabs cria modelos precisos
                para termoformação dos alinhadores
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-primary-foreground font-bold">
                4
              </div>
              <h3 className="font-heading font-semibold mb-2">ENTREGA</h3>
              <p className="text-sm text-muted-foreground">
                Controle de qualidade rigoroso e entrega
                expressa para sua clínica
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold mb-4">DIFERENCIAIS TECNOLÓGICOS</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Recursos avançados que garantem a qualidade e eficiência
              dos nossos alinhadores
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <Eye className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-heading font-semibold mb-2">TRANSPARÊNCIA SUPERIOR</h3>
                <p className="text-muted-foreground text-sm">
                  Material ultra-transparente que se torna praticamente invisível
                  na boca, mantendo a estética durante todo o tratamento.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Gauge className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-heading font-semibold mb-2">PRECISÃO MICROMÉTRICA</h3>
                <p className="text-muted-foreground text-sm">
                  Tolerâncias de produção de até 0,1mm garantem encaixe
                  perfeito e movimentação dentária controlada.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Clock className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-heading font-semibold mb-2">TEMPO OTIMIZADO</h3>
                <p className="text-muted-foreground text-sm">
                  Processo automatizado reduz tempo de produção
                  para 7-10 dias úteis da aprovação à entrega.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Target className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-heading font-semibold mb-2">RESULTADOS PREVISÍVEIS</h3>
                <p className="text-muted-foreground text-sm">
                  Simulação 3D permite visualizar resultado final
                  antes mesmo de iniciar o tratamento.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Award className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-heading font-semibold mb-2">CERTIFICAÇÃO INTERNACIONAL</h3>
                <p className="text-muted-foreground text-sm">
                  Todos os materiais possuem certificação FDA e ISO
                  para uso em dispositivos médicos.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Users className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-heading font-semibold mb-2">SUPORTE TÉCNICO 24/7</h3>
                <p className="text-muted-foreground text-sm">
                  Equipe especializada disponível para suporte
                  técnico e clínico durante todo o tratamento.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section id="video-demo" className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold mb-4">VEJA NOSSA TECNOLOGIA EM AÇÃO</h2>
              <p className="text-muted-foreground">
                Conheça todo o processo de produção dos alinhadores Atma
              </p>
            </div>

            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="h-8 w-8 text-primary-foreground ml-1" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Demonstração Tecnológica</h3>
                  <p className="text-muted-foreground">
                    Clique para assistir como produzimos alinhadores de qualidade mundial
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            PRONTO PARA REVOLUCIONAR SUA CLÍNICA?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Junte-se aos mais de 500 ortodontistas que já transformaram seus consultórios
            com nossa tecnologia de ponta
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/ortodontistas/seja-parceiro">Quero ser parceiro Atma</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link href="/contato">Falar com especialista</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}