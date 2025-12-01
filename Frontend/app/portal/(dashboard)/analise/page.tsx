import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, TrendingUp, AlertCircle } from 'lucide-react'

export default function AnalisePage() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Análise do Caso</h1>
        <p className="text-gray-600 mt-2">
          Detalhes completos sobre a viabilidade do seu tratamento ortodôntico
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-blue-600" />
            Radar de Viabilidade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Em Desenvolvimento
            </h3>
            <p className="text-gray-600">
              A análise completa do seu caso estará disponível em breve.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Complexidade</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Análise detalhada da complexidade do caso...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Previsões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Estimativas de resultados e progressão...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
