import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Calculator, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function FinanceiroPage() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Informações Financeiras</h1>
        <p className="text-gray-600 mt-2">
          Custo estimado e opções de pagamento para seu tratamento
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Investimento Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">R$ 5.990</div>
            <p className="text-sm text-gray-500 mt-2">Valor estimado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Parcelamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">12x</div>
            <p className="text-sm text-gray-500 mt-2">R$ 499/mês sem juros</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Economia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">30%</div>
            <p className="text-sm text-gray-500 mt-2">vs. aparelho tradicional</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            Calculadora de Parcelas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-600 mb-4">
              Calcule diferentes opções de parcelamento para seu orçamento.
            </p>
            <Button className="w-full md:w-auto">
              <Calculator className="mr-2 h-4 w-4" />
              Calcular Parcelas
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            Formas de Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <div>
                <div className="font-medium text-gray-900">Cartão de Crédito</div>
                <div className="text-sm text-gray-600">Parcelamento em até 12x sem juros</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <div>
                <div className="font-medium text-gray-900">PIX</div>
                <div className="text-sm text-gray-600">Desconto de 5% no pagamento à vista</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <div>
                <div className="font-medium text-gray-900">Boleto Bancário</div>
                <div className="text-sm text-gray-600">Parcelamento em até 6x</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
