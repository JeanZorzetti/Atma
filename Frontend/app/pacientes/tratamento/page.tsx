"use client"

import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Clock, Shield, Zap, CheckCircle, Play, Star, Heart } from "lucide-react"
import { TreatmentTimeline } from "@/components/animations/treatment-timeline"
import { BeforeAfterMorph } from "@/components/animations/before-after-morph"
import { MedicalTerm, GlossaryButton } from "@/components/cognitive/medical-glossary"
import { ContextHelp } from "@/components/cognitive/context-help"

// Dynamic import for Lottie animations (client-only)
const TreatmentProcessAnimation = dynamic(
  () => import("@/components/animations/treatment-process").then(mod => ({ default: mod.TreatmentProcessAnimation })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] bg-slate-100 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando animações...</p>
        </div>
      </div>
    )
  }
)

export default function TratamentoPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
              Tratamento <MedicalTerm term="ortodôntico">ortodôntico</MedicalTerm>{" "}
              <span className="text-primary">invisível e inteligente</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Descubra como nossos <MedicalTerm term="alinhadores">alinhadores</MedicalTerm> transparentes transformam sorrisos de forma discreta, confortável e
              previsível
            </p>
            <GlossaryButton />
            <Button asChild size="lg">
              <Link href="/pacientes/encontre-doutor">
                Comece seu tratamento hoje
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* O que são Alinhadores */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-6">O que são os alinhadores transparentes?</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Os alinhadores Atma Aligner são placas transparentes feitas sob medida para seus dentes, utilizando
                tecnologia 3D de última geração. Cada alinhador move seus dentes gradualmente até a posição ideal.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Praticamente invisíveis</h3>
                    <p className="text-muted-foreground">Ninguém vai notar que você está em tratamento</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Removíveis</h3>
                    <p className="text-muted-foreground">Retire para comer, escovar os dentes e ocasiões especiais</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Confortáveis</h3>
                    <p className="text-muted-foreground">Sem fios ou brackets que machucam a boca</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8 text-center">
              <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="h-16 w-16 text-primary" />
              </div>
              <p className="text-muted-foreground">Vídeo: Como funcionam os alinhadores</p>
            </div>
          </div>
        </div>
      </section>

      {/* Visualização 3D e Before/After */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Veja como funciona</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Visualize a transformação do seu sorriso
            </p>
          </div>
          <BeforeAfterMorph />
          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link href="/pacientes/visualizacao-3d">
                Ver visualização 3D completa
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Processo de Tratamento Animado */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Seu tratamento passo a passo</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Um processo transparente e previsível do primeiro dia até o sorriso dos seus sonhos
            </p>
          </div>

          <TreatmentProcessAnimation />
        </div>
      </section>

      {/* Timeline Interativo */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Acompanhe sua evolução</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Timeline interativo mostrando cada fase do seu tratamento
            </p>
          </div>

          <TreatmentTimeline />
        </div>
      </section>

      {/* Processo de Tratamento Detalhado */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Detalhes do processo</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Entenda cada etapa em profundidade
            </p>
          </div>

          <div className="space-y-8">
            {/* Passo 1 */}
            <Card>
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl mr-4">
                        1
                      </div>
                      <h3 className="text-2xl font-heading font-bold">Consulta e Avaliação</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Seu ortodontista parceiro fará uma avaliação completa do seu caso, incluindo exames clínicos e
                      radiográficos quando necessário.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-primary mr-2" />
                        <span>Análise da mordida e alinhamento</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-primary mr-2" />
                        <span>Verificação da saúde bucal</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-primary mr-2" />
                        <span>Definição de objetivos do tratamento</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-6 text-center">
                    <Clock className="h-16 w-16 text-primary mx-auto mb-4" />
                    <p className="font-semibold">Duração: 60-90 minutos</p>
                    <p className="text-sm text-muted-foreground">Consulta gratuita</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Passo 2 */}
            <Card>
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className="bg-primary/5 rounded-lg p-6 text-center lg:order-1">
                    <Zap className="h-16 w-16 text-primary mx-auto mb-4" />
                    <p className="font-semibold">Tecnologia 3D</p>
                    <p className="text-sm text-muted-foreground">Scanner intraoral de precisão</p>
                  </div>
                  <div className="lg:order-2">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl mr-4">
                        2
                      </div>
                      <h3 className="text-2xl font-heading font-bold">Escaneamento Digital</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Utilizamos scanners 3D de última geração para criar um modelo digital preciso dos seus dentes,
                      eliminando a necessidade de moldes desconfortáveis.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-primary mr-2" />
                        <span>Processo rápido e confortável</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-primary mr-2" />
                        <span>Precisão milimétrica</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-primary mr-2" />
                        <span>Sem moldes tradicionais</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Passo 3 */}
            <Card>
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl mr-4">
                        3
                      </div>
                      <h3 className="text-2xl font-heading font-bold">Planejamento Personalizado</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Nossa equipe de especialistas cria um plano de tratamento único para você, mostrando exatamente
                      como seus dentes se moverão a cada etapa.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-primary mr-2" />
                        <span>Simulação 3D do resultado final</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-primary mr-2" />
                        <span>Cronograma detalhado do tratamento</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-primary mr-2" />
                        <span>Aprovação antes da produção</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-secondary/5 rounded-lg p-6 text-center">
                    <Shield className="h-16 w-16 text-secondary mx-auto mb-4" />
                    <p className="font-semibold">Previsibilidade Total</p>
                    <p className="text-sm text-muted-foreground">Veja o resultado antes de começar</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Passo 4 */}
            <Card>
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className="bg-primary/5 rounded-lg p-6 text-center lg:order-1">
                    <Heart className="h-16 w-16 text-primary mx-auto mb-4" />
                    <p className="font-semibold">Acompanhamento</p>
                    <p className="text-sm text-muted-foreground">Suporte durante todo o tratamento</p>
                  </div>
                  <div className="lg:order-2">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl mr-4">
                        4
                      </div>
                      <h3 className="text-2xl font-heading font-bold">Tratamento Ativo</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Você receberá todos os seus alinhadores e trocará a cada 1-2 semanas, com consultas regulares para
                      acompanhar o progresso.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-primary mr-2" />
                        <span>Consultas de acompanhamento regulares</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-primary mr-2" />
                        <span>Suporte via WhatsApp</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-primary mr-2" />
                        <span>Ajustes quando necessário</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Casos Tratáveis */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Casos que tratamos</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Os alinhadores Atma Aligner são eficazes para uma ampla variedade de problemas ortodônticos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: <MedicalTerm term="apinhamento">Dentes Apinhados</MedicalTerm>,
                description: "Quando não há espaço suficiente para todos os dentes se alinharem corretamente",
              },
              {
                title: <MedicalTerm term="diastema">Diastemas</MedicalTerm>,
                description: "Espaços indesejados entre os dentes que afetam a estética do sorriso",
              },
              {
                title: <MedicalTerm term="sobremordida">Sobremordida</MedicalTerm>,
                description: "Quando os dentes superiores cobrem excessivamente os inferiores",
              },
              {
                title: <MedicalTerm term="mordida cruzada">Mordida Cruzada</MedicalTerm>,
                description: "Desalinhamento entre os dentes superiores e inferiores",
              },
              {
                title: <MedicalTerm term="overjet">Protrusão</MedicalTerm>,
                description: "Dentes anteriores muito projetados para frente",
              },
              {
                title: "Rotações",
                description: "Dentes girados que precisam ser reposicionados",
              },
            ].map((caso, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-heading font-semibold mb-2">{caso.title}</h3>
                  <p className="text-muted-foreground text-sm">{caso.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-6">Não tem certeza se seu caso pode ser tratado com alinhadores?</p>
            <Button asChild size="lg">
              <Link href="/pacientes/encontre-doutor">
                Faça uma avaliação gratuita
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">O que nossos pacientes dizem</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Histórias reais de transformação com os alinhadores Atma Aligner
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Sempre tive vergonha do meu sorriso por causa dos dentes tortos. Com os alinhadores Atma Aligner,
                  consegui corrigir tudo em 10 meses sem ninguém perceber que eu estava fazendo tratamento. Hoje sorrio
                  sem medo!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary font-semibold">A</span>
                  </div>
                  <div>
                    <p className="font-semibold">Ana Carolina</p>
                    <p className="text-sm text-muted-foreground">Marketing - São Paulo, SP</p>
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
                  "Como executivo, não podia usar aparelho tradicional. Os alinhadores foram perfeitos - discretos,
                  confortáveis e com resultados incríveis. Recomendo para qualquer adulto que queira melhorar o
                  sorriso."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary font-semibold">R</span>
                  </div>
                  <div>
                    <p className="font-semibold">Roberto Silva</p>
                    <p className="text-sm text-muted-foreground">Executivo - Rio de Janeiro, RJ</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Pronto para começar sua transformação?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Milhares de brasileiros já conquistaram o sorriso dos sonhos. Agora é a sua vez!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/pacientes/encontre-doutor">Encontre um ortodontista</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link href="/pacientes/antes-depois">Ver casos de sucesso</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
