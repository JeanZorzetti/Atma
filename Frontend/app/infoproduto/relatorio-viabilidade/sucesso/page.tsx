"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Mail, Download, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function SucessoPage() {
  const [email, setEmail] = useState("")
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    // Recuperar email do localStorage
    const savedData = localStorage.getItem('relatorio_form_data')
    if (savedData) {
      const data = JSON.parse(savedData)
      setEmail(data.email)
    }

    // Countdown para gerar PDF
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          // Aqui você pode chamar a API para gerar o PDF
          gerarRelatorio()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const gerarRelatorio = async () => {
    try {
      const savedData = localStorage.getItem('relatorio_form_data')
      if (!savedData) return

      const formData = JSON.parse(savedData)

      const response = await fetch('/api/infoproduto/gerar-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        console.log('Relatório gerado e enviado com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Pagamento Confirmado! 🎉
          </h1>
          <p className="text-xl text-gray-600">
            Seu relatório personalizado está sendo gerado agora
          </p>
        </div>

        {/* Status Card */}
        <Card className="mb-8 border-2 border-green-200">
          <CardContent className="pt-6">
            {countdown > 0 ? (
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                  <Clock className="h-8 w-8 text-blue-600 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Gerando seu relatório...
                  </h3>
                  <p className="text-gray-600">
                    Estamos processando suas respostas e criando uma análise personalizada.
                  </p>
                  <div className="mt-4">
                    <div className="text-4xl font-bold text-blue-600">{countdown}s</div>
                    <div className="text-sm text-gray-500">tempo estimado</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Relatório Enviado! ✅
                  </h3>
                  <p className="text-gray-600">
                    Seu relatório foi enviado para:
                  </p>
                  <p className="text-xl font-bold text-blue-600 mt-2">{email}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Verifique seu Email</h3>
                  <p className="text-sm text-gray-600">
                    Procure por um email da Atma Aligner. Verifique também a caixa de spam/promoções.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Baixe o PDF</h3>
                  <p className="text-sm text-gray-600">
                    Clique no link do email para baixar seu relatório completo em PDF (20-25 páginas).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Leia com Atenção</h3>
                  <p className="text-sm text-gray-600">
                    Analise todas as seções: viabilidade, custos, timeline e plano de ação personalizado.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Tome Ação</h3>
                  <p className="text-sm text-gray-600">
                    Use o plano de ação e a lista de ortodontistas para dar o próximo passo.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="bg-blue-50 border-2 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Próximos Passos Recomendados</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">
                  Baixe e leia seu relatório completo
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">
                  Anote as perguntas sugeridas para fazer ao ortodontista
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">
                  Agende consultas com os ortodontistas certificados listados
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">
                  Compare os orçamentos usando a tabela de referência do relatório
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="mt-8 text-center space-y-4">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/pacientes/encontre-doutor">
              Encontrar Ortodontista Certificado Atma
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          <p className="text-sm text-gray-500">
            Ou retorne para a <Link href="/" className="text-blue-600 hover:underline">página inicial</Link>
          </p>
        </div>

        {/* Support */}
        <div className="mt-12 pt-8 border-t text-center">
          <h4 className="font-bold text-gray-900 mb-2">Precisa de Ajuda?</h4>
          <p className="text-gray-600 mb-4">
            Se não receber o email em 15 minutos ou tiver qualquer dúvida:
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link href="mailto:suporte@atma.com.br">
                <Mail className="mr-2 h-4 w-4" />
                suporte@atma.com.br
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="https://wa.me/5511999999999">
                WhatsApp: (11) 99999-9999
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
