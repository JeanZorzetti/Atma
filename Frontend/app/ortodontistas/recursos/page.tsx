import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Monitor, Smartphone, BookOpen, Users, Headphones, Award, Download, Play } from "lucide-react"
import Link from "next/link"

export default function RecursosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-4 text-primary border-primary/20">
            Recursos Clínicos
          </Badge>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Recursos Completos para <span className="text-primary">Seu Sucesso</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Tenha acesso a todas as ferramentas, treinamentos e suporte técnico necessários para dominar a tecnologia de
            alinhadores ortodônticos.
          </p>
        </div>
      </section>

      {/* Recursos Tecnológicos */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Tecnologia de Ponta ao Seu Alcance</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Plataforma completa com todas as ferramentas necessárias para planejamento, acompanhamento e gestão de
              casos
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <Monitor className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="font-heading">Software de Planejamento</CardTitle>
                <CardDescription>Interface intuitiva para planejamento 3D</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span>Visualização 3D em tempo real</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span>Simulação do resultado final</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span>Aprovação digital do paciente</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span>Integração com scanners</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-secondary transition-colors">
              <CardHeader>
                <Smartphone className="h-8 w-8 text-secondary mb-2" />
                <CardTitle className="font-heading">App Mobile</CardTitle>
                <CardDescription>Acompanhamento em qualquer lugar</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                    <span>Acompanhamento de casos</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                    <span>Comunicação com pacientes</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                    <span>Notificações automáticas</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                    <span>Relatórios de progresso</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <Award className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="font-heading">Certificação Digital</CardTitle>
                <CardDescription>Validação de competências</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span>Certificado oficial Atma</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span>Validação de horas técnicas</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span>Reconhecimento profissional</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span>Educação continuada</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Treinamento e Capacitação */}
      <section className="py-16 px-4 bg-muted">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Treinamento e Capacitação Completa</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Programa estruturado para você e sua equipe dominarem completamente a tecnologia de alinhadores
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <BookOpen className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="font-heading">Curso Online Completo</CardTitle>
                <CardDescription>40 horas de conteúdo técnico especializado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Módulo 1: Fundamentos</span>
                    <Badge variant="secondary">8h</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Módulo 2: Planejamento Digital</span>
                    <Badge variant="secondary">12h</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Módulo 3: Casos Complexos</span>
                    <Badge variant="secondary">10h</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Módulo 4: Gestão Clínica</span>
                    <Badge variant="secondary">6h</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Módulo 5: Casos Práticos</span>
                    <Badge variant="secondary">4h</Badge>
                  </div>
                </div>
                <Button className="w-full mt-6 bg-transparent" variant="outline">
                  <Play className="mr-2 h-4 w-4" />
                  Acessar Plataforma
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="font-heading">Treinamento Presencial</CardTitle>
                <CardDescription>Workshops práticos em sua clínica</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Treinamento In-Loco</p>
                      <p className="text-sm text-muted-foreground">Nossa equipe vai até sua clínica</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Capacitação da Equipe</p>
                      <p className="text-sm text-muted-foreground">Treinamento para toda sua equipe</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Casos Práticos</p>
                      <p className="text-sm text-muted-foreground">Planejamento de casos reais</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Suporte Contínuo</p>
                      <p className="text-sm text-muted-foreground">Acompanhamento pós-treinamento</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-6 bg-transparent" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Agendar Treinamento
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Suporte Técnico */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Suporte Técnico Especializado</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Equipe dedicada para garantir que você tenha todo o suporte necessário em cada etapa
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-8">
                <Headphones className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-heading font-semibold mb-2">Suporte 24/7</h3>
                <p className="text-muted-foreground mb-4">Atendimento técnico disponível todos os dias da semana</p>
                <ul className="text-sm space-y-1">
                  <li>• Chat online em tempo real</li>
                  <li>• Suporte por telefone</li>
                  <li>• E-mail prioritário</li>
                  <li>• Acesso remoto quando necessário</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <Monitor className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-heading font-semibold mb-2">Consultoria Clínica</h3>
                <p className="text-muted-foreground mb-4">Especialistas para discussão de casos complexos</p>
                <ul className="text-sm space-y-1">
                  <li>• Análise de casos difíceis</li>
                  <li>• Sugestões de planejamento</li>
                  <li>• Videoconferências técnicas</li>
                  <li>• Revisão de tratamentos</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-heading font-semibold mb-2">Atualizações Contínuas</h3>
                <p className="text-muted-foreground mb-4">Sempre na vanguarda da tecnologia ortodôntica</p>
                <ul className="text-sm space-y-1">
                  <li>• Updates automáticos do software</li>
                  <li>• Novos recursos mensais</li>
                  <li>• Webinars educativos</li>
                  <li>• Acesso a pesquisas científicas</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Materiais de Apoio */}
      <section className="py-16 px-4 bg-muted">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Biblioteca de Recursos</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Acesso completo a materiais educativos, protocolos clínicos e ferramentas de comunicação
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Download className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-heading font-semibold mb-2">Protocolos Clínicos</h3>
                <p className="text-sm text-muted-foreground mb-4">Guias detalhados para cada tipo de caso</p>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  <Download className="mr-2 h-3 w-3" />
                  Download
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <BookOpen className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-heading font-semibold mb-2">Artigos Científicos</h3>
                <p className="text-sm text-muted-foreground mb-4">Pesquisas e estudos de caso atualizados</p>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  <BookOpen className="mr-2 h-3 w-3" />
                  Acessar
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-heading font-semibold mb-2">Material Paciente</h3>
                <p className="text-sm text-muted-foreground mb-4">Folders e apresentações personalizáveis</p>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  <Users className="mr-2 h-3 w-3" />
                  Baixar
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Play className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-heading font-semibold mb-2">Vídeos Tutoriais</h3>
                <p className="text-sm text-muted-foreground mb-4">Biblioteca completa de videoaulas</p>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  <Play className="mr-2 h-3 w-3" />
                  Assistir
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Tenha Acesso a Todos os Recursos</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Torne-se um parceiro Atma Aligner e tenha acesso completo a nossa plataforma de recursos e suporte
            especializado
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/ortodontistas/seja-parceiro">Quero Ser Parceiro</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link href="/ortodontistas/vantagens">Ver Todas as Vantagens</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
