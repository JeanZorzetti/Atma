"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, ChevronLeft, Check } from "lucide-react"
import { useRouter } from "next/navigation"

const questions = [
  {
    id: 1,
    question: "Qual das opções abaixo melhor descreve o seu sorriso atual?",
    type: "visual-selection",
    options: [
      { value: "Dentes Apinhados", label: "Dentes Apinhados", description: "Dentes amontoados ou sobrepostos", icon: "🦷" },
      { value: "Diastema", label: "Diastema", description: "Espaços entre os dentes", icon: "😬" },
      { value: "Sobremordida", label: "Sobremordida", description: "Dentes superiores cobrem os inferiores", icon: "😁" },
      { value: "Mordida Cruzada", label: "Mordida Cruzada", description: "Desalinhamento dos maxilares", icon: "😐" },
      { value: "Mordida Aberta", label: "Mordida Aberta", description: "Dentes não se tocam ao fechar", icon: "😮" },
      { value: "Prognatismo", label: "Prognatismo", description: "Mandíbula projetada para frente", icon: "🫤" },
      { value: "Alinhamento Geral", label: "Alinhamento Geral", description: "Problemas estéticos gerais", icon: "😊" },
      { value: "Não tenho certeza", label: "Não tenho certeza", description: "Preciso de avaliação profissional", icon: "🤔" }
    ]
  },
  {
    id: 2,
    question: "Qual é o seu principal objetivo com o tratamento ortodôntico?",
    options: [
      "Corrigir dentes tortos ou desalinhados",
      "Fechar espaços entre os dentes",
      "Corrigir mordida (sobremordida, mordida cruzada)",
      "Melhorar aparência do sorriso"
    ]
  },
  {
    id: 3,
    question: "Você já usou aparelho ortodôntico antes?",
    options: [
      "Não, nunca usei",
      "Sim, aparelho fixo metálico",
      "Sim, alinhadores invisíveis",
      "Sim, mas não concluí o tratamento"
    ]
  },
  {
    id: 4,
    question: "Qual é a sua faixa etária?",
    options: [
      "Até 17 anos",
      "18-25 anos",
      "26-40 anos",
      "41+ anos"
    ]
  },
  {
    id: 5,
    question: "Qual é o seu principal critério de escolha?",
    options: [
      "Preço acessível e parcelamento",
      "Rapidez no resultado",
      "Discrição (aparelho invisível)",
      "Qualidade e certificações"
    ]
  },
  {
    id: 6,
    question: "Em quanto tempo você gostaria de ver resultados?",
    options: [
      "Até 6 meses",
      "6-12 meses",
      "12-18 meses",
      "Acima de 18 meses"
    ]
  },
  {
    id: 7,
    question: "Qual valor você está disposto a investir mensalmente?",
    options: [
      "Até R$ 200/mês",
      "R$ 200-400/mês",
      "R$ 400-600/mês",
      "Acima de R$ 600/mês"
    ]
  }
]

export default function QuizPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: answer })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const getRecommendation = () => {
    const ageAnswer = answers[4]
    const budgetAnswer = answers[7]

    if (budgetAnswer === "Até R$ 200/mês") {
      return {
        plan: "Casos Simples",
        price: "R$ 3.990",
        monthly: "R$ 166/mês",
        duration: "6-12 meses",
        description: "Ideal para correções leves e orçamento mais restrito"
      }
    } else if (budgetAnswer === "R$ 200-400/mês") {
      return {
        plan: "Casos Moderados",
        price: "R$ 5.990",
        monthly: "R$ 250/mês",
        duration: "9-15 meses",
        description: "Perfeito para a maioria dos casos ortodônticos"
      }
    } else {
      return {
        plan: "Casos Complexos",
        price: "R$ 8.990",
        monthly: "R$ 375/mês",
        duration: "12-18 meses",
        description: "Tratamento completo para casos mais desafiadores"
      }
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (showResults) {
    const recommendation = getRecommendation()

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="border-2 border-blue-600 shadow-2xl">
            <CardContent className="p-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                  <Check className="h-10 w-10 text-green-600" />
                </div>
                <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">
                  Seu Plano Recomendado
                </h1>
                <p className="text-xl text-gray-600">
                  Baseado nas suas respostas, encontramos a melhor opção para você
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border-2 border-blue-200 mb-8">
                <Badge className="mb-4 bg-blue-600 text-white">Recomendado para você</Badge>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{recommendation.plan}</h2>
                <p className="text-gray-600 mb-6">{recommendation.description}</p>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Investimento Total</p>
                    <p className="text-3xl font-bold text-blue-600">{recommendation.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Parcela Mensal</p>
                    <p className="text-3xl font-bold text-blue-600">{recommendation.monthly}</p>
                    <p className="text-sm text-gray-500">em até 24x sem juros</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-sm">Duração estimada:</span>
                  <span className="font-bold">{recommendation.duration}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <h3 className="font-bold text-gray-900">O que está incluído:</h3>
                <ul className="space-y-3">
                  {[
                    "Consulta de avaliação gratuita",
                    "Escaneamento 3D digital indolor",
                    "Simulação do resultado final",
                    "Alinhadores personalizados (PETG alemão)",
                    "Acompanhamento profissional completo",
                    "Aplicativo de monitoramento",
                    "Garantia de satisfação"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                  onClick={() => router.push('/pacientes/encontre-doutor')}
                >
                  Encontrar Ortodontista Perto de Mim
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <p className="text-center text-sm text-gray-500 mt-6">
                ✨ Sem compromisso • Avaliação completa • Simulação 3D incluída
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const hasAnswer = answers[currentQ.id] !== undefined

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-heading font-bold text-gray-900">
              Quiz de Avaliação Rápida
            </h1>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              {currentQuestion + 1} de {questions.length}
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-blue-700 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <Card className="shadow-xl border-2">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {currentQ.question}
            </h2>

            {/* Visual Selection for Question 1 */}
            {currentQ.type === 'visual-selection' ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option.value)}
                    className={`p-4 rounded-xl border-2 transition-all hover:border-blue-600 hover:bg-blue-50 ${
                      answers[currentQ.id] === option.value
                        ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600 ring-opacity-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center gap-3">
                      <div className="text-5xl mb-2">{option.icon}</div>
                      <div className="font-semibold text-sm text-gray-900">{option.label}</div>
                      <div className="text-xs text-gray-600 leading-tight">{option.description}</div>
                      {answers[currentQ.id] === option.value && (
                        <div className="mt-2 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              /* Text Options for Questions 2-7 */
              <div className="space-y-4 mb-10">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all hover:border-blue-600 hover:bg-blue-50 ${
                      answers[currentQ.id] === option
                        ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600 ring-opacity-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        answers[currentQ.id] === option
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-gray-300'
                      }`}>
                        {answers[currentQ.id] === option && (
                          <Check className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <span className={`text-lg ${
                        answers[currentQ.id] === option
                          ? 'text-blue-600 font-semibold'
                          : 'text-gray-700'
                      }`}>
                        {option}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-4">
              {currentQuestion > 0 && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handlePrevious}
                  className="flex-1"
                >
                  <ChevronLeft className="mr-2 h-5 w-5" />
                  Anterior
                </Button>
              )}
              <Button
                size="lg"
                onClick={handleNext}
                disabled={!hasAnswer}
                className={`${currentQuestion === 0 ? 'w-full' : 'flex-1'} bg-blue-600 hover:bg-blue-700`}
              >
                {currentQuestion === questions.length - 1 ? 'Ver Resultado' : 'Próxima'}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6">
          ⏱️ Leva apenas 2 minutos • 100% gratuito e sem compromisso
        </p>
      </div>
    </div>
  )
}
