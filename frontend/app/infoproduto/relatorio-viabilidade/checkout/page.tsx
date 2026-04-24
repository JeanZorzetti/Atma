"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Shield, Clock, FileText, Loader2, CreditCard } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<any>(null)

  useEffect(() => {
    // Recuperar dados do formulário
    const savedData = localStorage.getItem('relatorio_form_data')
    if (savedData) {
      setFormData(JSON.parse(savedData))
    } else {
      // Se não tiver dados, redirecionar para formulário
      router.push('/infoproduto/relatorio-viabilidade/formulario')
    }
  }, [router])

  const handleCheckout = async () => {
    setLoading(true)

    try {
      // TODO: Integrar com Mercado Pago
      // Por enquanto, vamos simular o pagamento

      const response = await fetch('/api/infoproduto/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          produto: 'relatorio-viabilidade',
          valor: 47.00
        }),
      })

      const data = await response.json()

      if (data.success && data.checkoutUrl) {
        // Redirecionar para Checkout Pro do Mercado Pago
        console.log('✅ Redirecionando para Mercado Pago:', data.preferenceId)
        window.location.href = data.checkoutUrl
      } else {
        console.error('❌ Erro:', data)
        alert('Erro ao processar pagamento. Tente novamente.')
      }
    } catch (error) {
      console.error('Erro no checkout:', error)
      alert('Erro ao processar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-green-600 text-white">
            <Check className="h-4 w-4 mr-2" />
            Formulário Completo
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Último Passo: Finalizar Pagamento
          </h1>
          <p className="text-gray-600">
            Garanta seu relatório personalizado agora
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Coluna Esquerda - Resumo do Pedido */}
          <div className="lg:col-span-2 space-y-6">
            {/* Seus Dados */}
            <Card>
              <CardHeader>
                <CardTitle>Seus Dados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nome:</span>
                  <span className="font-medium">{formData.nome}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Telefone:</span>
                  <span className="font-medium">{formData.telefone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Localização:</span>
                  <span className="font-medium">{formData.cidade}/{formData.estado}</span>
                </div>
              </CardContent>
            </Card>

            {/* O Que Você Vai Receber */}
            <Card className="border-2 border-blue-600">
              <CardHeader className="bg-blue-50">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  O Que Está Incluso
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {[
                    "Relatório Completo em PDF (20-25 páginas)",
                    "Análise personalizada do seu caso",
                    "Score de Viabilidade (0-100)",
                    "Estimativa de custos para seu caso",
                    "Timeline esperado de tratamento",
                    "Comparativo: Atma vs. Concorrentes",
                    "Análise de riscos e limitações",
                    "Plano de ação personalizado",
                    "Lista de ortodontistas certificados na sua região",
                    "Perguntas essenciais para fazer ao ortodontista"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Garantias */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Clock className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 mb-1">Entrega Imediata</h3>
                  <p className="text-sm text-gray-600">Receba em até 10 minutos no seu email</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <Shield className="h-10 w-10 text-green-600 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 mb-1">Garantia 7 Dias</h3>
                  <p className="text-sm text-gray-600">100% do dinheiro de volta se não gostar</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <CreditCard className="h-10 w-10 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 mb-1">Pagamento Seguro</h3>
                  <p className="text-sm text-gray-600">Processado por Mercado Pago</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Coluna Direita - Box de Pagamento */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 border-2 border-gray-200">
              <CardHeader className="bg-gray-50">
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Produto</span>
                    <span className="font-medium">Relatório de Viabilidade</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Valor normal</span>
                    <span className="line-through text-gray-400">R$ 197,00</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-green-600 font-medium">Desconto</span>
                    <span className="text-green-600 font-medium">- R$ 150,00</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Total</span>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">R$ 47</div>
                        <div className="text-xs text-gray-500">pagamento único</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 font-medium">
                    🔥 <strong>Oferta por tempo limitado!</strong>
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Após esta compra, o preço volta para R$ 197
                  </p>
                </div>

                <Button
                  size="lg"
                  className="w-full text-lg py-6 bg-green-600 hover:bg-green-700"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Pagar Agora - R$ 47
                    </>
                  )}
                </Button>

                <div className="space-y-2 text-center">
                  <p className="text-xs text-gray-500">
                    🔒 Pagamento 100% seguro via Mercado Pago
                  </p>
                  <p className="text-xs text-gray-500">
                    Aceitamos Pix, Cartão de Crédito e Boleto
                  </p>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-bold text-sm text-gray-900 mb-3">Por que R$ 47?</h4>
                  <ul className="space-y-2 text-xs text-gray-600">
                    <li className="flex items-start gap-2">
                      <Check className="h-3 w-3 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Consultórias presenciais custam R$ 300-500</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-3 w-3 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Automatizamos para democratizar o acesso</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-3 w-3 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Você pode economizar milhares no tratamento</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Depoimento */}
            <Card className="mt-4 bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <p className="text-sm text-gray-700 italic mb-3">
                  "Economizei R$ 4.000! O relatório me mostrou que meu caso era simples, não precisava pagar R$ 12.000."
                </p>
                <p className="text-xs text-gray-600 font-medium">
                  — Mariana Costa, 32 anos
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
