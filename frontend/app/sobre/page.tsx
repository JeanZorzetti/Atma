import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Heart, Zap, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function SobrePage() {
  const valores = [
    {
      icon: Heart,
      titulo: "Paixão pelo Sorriso",
      descricao: "Acreditamos que um sorriso bonito transforma vidas e aumenta a autoestima.",
    },
    {
      icon: Zap,
      titulo: "Inovação Constante",
      descricao: "Investimos continuamente em tecnologia para oferecer os melhores resultados.",
    },
    {
      icon: Shield,
      titulo: "Qualidade Garantida",
      descricao: "Todos os nossos produtos passam por rigorosos controles de qualidade.",
    },
    {
      icon: Users,
      titulo: "Parceria Verdadeira",
      descricao: "Construímos relacionamentos duradouros com ortodontistas e pacientes.",
    },
  ]

  const equipe = [
    {
      nome: "Dr. Carlos Mendes",
      cargo: "CEO e Fundador",
      especialidade: "Ortodontista com 15 anos de experiência",
      foto: "/placeholder.svg?height=300&width=300",
    },
    {
      nome: "Dra. Ana Silva",
      cargo: "Diretora Clínica",
      especialidade: "Especialista em Alinhadores Ortodônticos",
      foto: "/placeholder.svg?height=300&width=300",
    },
    {
      nome: "Eng. Roberto Santos",
      cargo: "CTO",
      especialidade: "Engenheiro Biomédico e Tecnologia 3D",
      foto: "/placeholder.svg?height=300&width=300",
    },
    {
      nome: "Dra. Mariana Costa",
      cargo: "Gerente de Qualidade",
      especialidade: "Controle de Qualidade e Processos",
      foto: "/placeholder.svg?height=300&width=300",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">Nossa História</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Transformando Sorrisos com Tecnologia</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Somos uma empresa brasileira dedicada a democratizar o acesso aos alinhadores ortodônticos, oferecendo
            tecnologia de ponta com preços acessíveis.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Nossa Missão</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Democratizar o acesso aos alinhadores ortodônticos no Brasil, oferecendo tecnologia de ponta com preços
                justos para que mais pessoas possam ter o sorriso dos seus sonhos.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Acreditamos que um sorriso bonito não deve ser privilégio de poucos. Por isso, desenvolvemos soluções
                inovadoras que tornam o tratamento ortodôntico mais acessível, confortável e eficiente.
              </p>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="Tecnologia Atma"
                width={500}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Nossos Valores</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valores.map((valor, index) => (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <valor.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{valor.titulo}</h3>
                  <p className="text-gray-600">{valor.descricao}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Nossos Números</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">5.000+</div>
              <div className="opacity-90">Pacientes Atendidos</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">200+</div>
              <div className="opacity-90">Ortodontistas Parceiros</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="opacity-90">Cidades Atendidas</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="opacity-90">Satisfação dos Pacientes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Nossa Equipe</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {equipe.map((membro, index) => (
              <Card key={index} className="text-center overflow-hidden shadow-lg">
                <CardContent className="p-0">
                  <Image
                    src={membro.foto || "/placeholder.svg"}
                    alt={membro.nome}
                    width={300}
                    height={300}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-1">{membro.nome}</h3>
                    <p className="text-blue-600 font-medium mb-2">{membro.cargo}</p>
                    <p className="text-sm text-gray-600">{membro.especialidade}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Nossa Jornada</h2>
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2020
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Fundação da Atma</h3>
                <p className="text-gray-600">
                  Início da empresa com o objetivo de democratizar os alinhadores ortodônticos no Brasil.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2021
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Primeiros Parceiros</h3>
                <p className="text-gray-600">
                  Estabelecimento das primeiras parcerias com ortodontistas e início dos tratamentos.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2022
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Expansão Nacional</h3>
                <p className="text-gray-600">
                  Crescimento para mais de 20 estados brasileiros e 1.000 pacientes atendidos.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2023
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Inovação Tecnológica</h3>
                <p className="text-gray-600">
                  Lançamento da plataforma digital e aprimoramento dos processos de fabricação.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2024
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Liderança no Mercado</h3>
                <p className="text-gray-600">
                  Mais de 5.000 pacientes atendidos e reconhecimento como referência em alinhadores acessíveis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Faça Parte da Nossa História</h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhares de pessoas que já transformaram seus sorrisos conosco.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/pacientes/encontre-doutor">Transformar Meu Sorriso</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              <Link href="/ortodontistas/seja-parceiro">Ser Parceiro Atma</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
