"use client"

import { AnimatedButton } from "@/components/ui/animated-button"
import { AnimatedCard } from "@/components/ui/animated-card"
import { Card, CardContent } from "@/components/ui/card"
import { AnimatedCounter, StaggeredCards } from "@/components/ui/scroll-animations"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Users, Award, Star } from "lucide-react"
import { GlossaryButton, MedicalTerm } from "@/components/cognitive/medical-glossary"

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen">
      {/* Hero Section with Video Background */}
      <motion.section
        className="relative py-20 lg:py-32 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          >
            <source src="/videos/hero-background.mp4" type="video/mp4" />
          </video>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-purple-900/40 to-blue-800/50" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              className="text-4xl md:text-6xl font-heading font-bold text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              A transformação do seu sorriso, <span className="text-yellow-300">agora ao seu alcance</span>
            </motion.h1>
            <motion.p
              className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Democratizamos o acesso à{" "}
              <span className="text-yellow-300 font-semibold">ortodontia</span> digital de ponta no Brasil. Tecnologia de classe mundial com
              acessibilidade financeira para a nova classe média brasileira.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <GlossaryButton />
            </motion.div>

            {/* Audience Segmentation */}
            <motion.h2
              className="text-2xl font-heading font-semibold mb-8 text-center text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Escolha seu caminho para o sorriso perfeito
            </motion.h2>

            <StaggeredCards className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto" staggerDelay={0.2}>
              {/* Card Paciente - Redesign Premium */}
              <AnimatedCard
                variant="medical"
                className="group cursor-pointer relative overflow-hidden backdrop-blur-md bg-white/30"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-blue-100/10 to-white/30" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-600/10" />

                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-blue-400/0"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />

                <div className="relative p-10 text-center">
                  {/* Ícone Premium */}
                  <motion.div
                    className="relative inline-flex items-center justify-center w-20 h-20 mb-6"
                    whileHover={{ scale: 1.1 }}
                    animate={{
                      y: [0, -8, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg" />
                    <div className="absolute inset-1 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl" />
                    <Users className="relative h-10 w-10 text-white" />
                  </motion.div>

                  <h3 className="text-2xl font-heading font-bold mb-3 text-slate-900">
                    SOU PACIENTE
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Descubra como conquistar o sorriso dos seus sonhos com parcelas que cabem no seu orçamento
                  </p>

                  {/* Benefícios */}
                  <div className="mb-6 space-y-2 text-left">
                    <div className="flex items-center text-sm text-slate-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                      <MedicalTerm term="alinhadores">Alinhadores</MedicalTerm> a partir de R$ 99/mês
                    </div>
                    <div className="flex items-center text-sm text-slate-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                      Consulta online gratuita
                    </div>
                    <div className="flex items-center text-sm text-slate-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                      Aprovação em 24h
                    </div>
                  </div>

                  <AnimatedButton
                    medical
                    size="lg"
                    className="w-full shadow-lg hover:shadow-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    onClick={() => router.push('/pacientes')}
                  >
                    Quero transformar meu sorriso
                  </AnimatedButton>
                </div>
              </AnimatedCard>

              {/* Card Ortodontista - Redesign Premium */}
              <AnimatedCard
                variant="service"
                className="group cursor-pointer relative overflow-hidden backdrop-blur-md bg-white/30"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/20 via-teal-100/10 to-white/30" />
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-emerald-600/10" />

                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-teal-400/0 via-teal-400/5 to-teal-400/0"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: 1.5,
                  }}
                />

                <div className="relative p-10 text-center">
                  {/* Ícone Premium */}
                  <motion.div
                    className="relative inline-flex items-center justify-center w-20 h-20 mb-6"
                    whileHover={{ scale: 1.1 }}
                    animate={{
                      y: [0, -8, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 2,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl shadow-lg" />
                    <div className="absolute inset-1 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl" />
                    <Award className="relative h-10 w-10 text-white" />
                  </motion.div>

                  <h3 className="text-2xl font-heading font-bold mb-3 text-slate-900">
                    SOU ORTODONTISTA
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Seja nosso parceiro estratégico e revolucione sua clínica com tecnologia de ponta
                  </p>

                  {/* Benefícios */}
                  <div className="mb-6 space-y-2 text-left">
                    <div className="flex items-center text-sm text-slate-700">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mr-3" />
                      Aumento de 60% na receita
                    </div>
                    <div className="flex items-center text-sm text-slate-700">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mr-3" />
                      Tecnologia de ponta incluída
                    </div>
                    <div className="flex items-center text-sm text-slate-700">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mr-3" />
                      Suporte técnico completo
                    </div>
                  </div>

                  <AnimatedButton
                    size="lg"
                    className="w-full shadow-lg hover:shadow-xl bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-700 hover:to-emerald-800 text-white"
                    onClick={() => router.push('/ortodontistas')}
                  >
                    Quero ser parceiro Atma
                  </AnimatedButton>
                </div>
              </AnimatedCard>
            </StaggeredCards>
          </div>
        </div>
      </motion.section>

      {/* Social Proof Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">TRANSFORMANDO SORRISOS EM TODO O BRASIL</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Milhares de brasileiros já conquistaram o sorriso dos sonhos com a tecnologia Atma Aligner
            </p>
          </div>

          <StaggeredCards className="grid md:grid-cols-3 gap-8 mb-12" staggerDelay={0.3}>
            <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
              <div className="text-4xl font-heading font-bold text-primary mb-2">
                <AnimatedCounter from={0} to={15000} suffix="+" />
              </div>
              <p className="text-muted-foreground">Sorrisos transformados</p>
            </motion.div>
            <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
              <div className="text-4xl font-heading font-bold text-primary mb-2">
                <AnimatedCounter from={0} to={500} suffix="+" />
              </div>
              <p className="text-muted-foreground">Ortodontistas parceiros</p>
            </motion.div>
            <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
              <div className="text-4xl font-heading font-bold text-primary mb-2">
                <AnimatedCounter from={0} to={98} suffix="%" />
              </div>
              <p className="text-muted-foreground">Satisfação dos pacientes</p>
            </motion.div>
          </StaggeredCards>

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

      {/* SEO Content Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold mb-6 text-center">
              Por Que Escolher Alinhadores Invisíveis Atma?
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-heading font-semibold mb-3">Tecnologia Alemã Premium</h3>
                <p className="text-muted-foreground mb-4">
                  Nossos alinhadores invisíveis são fabricados com <strong>PETG Duran® alemão</strong>, material de
                  grau médico certificado ISO 10993. A mesma tecnologia usada pelas marcas premium internacionais,
                  mas com preços até 50% menores. Cada alinhador é produzido sob medida usando escaneamento 3D de
                  alta precisão e inteligência artificial para planejamento ortodôntico.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-heading font-semibold mb-3">Preços Acessíveis, Qualidade Mundial</h3>
                <p className="text-muted-foreground mb-4">
                  Democratizamos o acesso à ortodontia digital no Brasil. Enquanto tratamentos similares custam
                  R$ 15.000 a R$ 20.000, oferecemos desde <strong>R$ 3.990</strong> com parcelamento em até 12x
                  sem juros. Não abrimos mão da qualidade: mesma tecnologia 3D, mesmos padrões internacionais,
                  acompanhamento profissional completo.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-heading font-semibold mb-3">Como Funciona o Tratamento</h3>
                <p className="text-muted-foreground mb-4">
                  O tratamento com alinhadores transparentes dura em média de 6 a 24 meses, dependendo da complexidade
                  do caso. Você usará os alinhadores por 22 horas por dia, trocando para o próximo conjunto a cada
                  duas semanas. Consultas de acompanhamento acontecem a cada 4-6 semanas com ortodontistas parceiros
                  em todo Brasil. <strong>Processo 100% indolor e discreto.</strong>
                </p>
              </div>

              <div>
                <h3 className="text-xl font-heading font-semibold mb-3">Rede Nacional de Ortodontistas</h3>
                <p className="text-muted-foreground mb-4">
                  Mais de 500 ortodontistas parceiros capacitados em todo o Brasil. Nossa plataforma conecta você
                  ao profissional mais próximo, garantindo acompanhamento presencial de qualidade. Cada ortodontista
                  passa por treinamento especializado no sistema Atma e tem acesso a suporte técnico completo durante
                  todo o tratamento.
                </p>
              </div>
            </div>

            <div className="bg-background p-6 rounded-lg border">
              <h3 className="text-xl font-heading font-semibold mb-3">Perguntas Frequentes</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold mb-2">Quanto tempo dura o tratamento com alinhadores invisíveis?</p>
                  <p className="text-muted-foreground text-sm">
                    O tratamento varia de 6 a 24 meses dependendo da complexidade do caso. Casos simples podem
                    ser resolvidos em 6-12 meses, enquanto casos mais complexos levam 18-24 meses.
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-2">Qual a diferença entre Atma e marcas internacionais?</p>
                  <p className="text-muted-foreground text-sm">
                    Usamos a mesma tecnologia e materiais (PETG alemão, impressão 3D, IA), mas com preços 50%
                    menores por eliminarmos intermediários e produzirmos localmente com padrões internacionais.
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-2">Posso financiar o tratamento?</p>
                  <p className="text-muted-foreground text-sm">
                    Sim! Oferecemos parcelamento em até 12x sem juros. Para casos simples, as parcelas começam
                    em apenas R$ 333/mês, cabendo no orçamento da maioria das famílias brasileiras.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-white">
            PRONTO PARA <span className="text-gradient-secondary">TRANSFORMAR</span> SEU SORRISO?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto text-white">
            Junte-se a milhares de brasileiros que já conquistaram o sorriso dos sonhos com parcelas que cabem no
            orçamento
          </p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <AnimatedButton
              size="lg"
              className="bg-white text-primary hover:bg-white/90 shadow-lg"
              onClick={() => router.push('/pacientes/encontre-doutor')}
              medical
            >
              Encontre um doutor perto de você
            </AnimatedButton>
            <AnimatedButton
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-primary"
              onClick={() => router.push('/pacientes/precos')}
            >
              Ver preços e financiamento
            </AnimatedButton>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
