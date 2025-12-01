import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, CheckCircle, Circle } from 'lucide-react'

export default function TimelinePage() {
  const etapas = [
    {
      mes: 'Mês 1-3',
      titulo: 'Fase Inicial',
      descricao: 'Adaptação aos alinhadores e primeiros movimentos',
      status: 'pendente' as const,
    },
    {
      mes: 'Mês 4-6',
      titulo: 'Alinhamento Principal',
      descricao: 'Correção dos principais desalinhamentos',
      status: 'pendente' as const,
    },
    {
      mes: 'Mês 7-9',
      titulo: 'Refinamento',
      descricao: 'Ajustes finos e otimização da mordida',
      status: 'pendente' as const,
    },
    {
      mes: 'Mês 10-12',
      titulo: 'Finalização',
      descricao: 'Últimos ajustes e preparação para contenção',
      status: 'pendente' as const,
    },
  ]

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Timeline do Tratamento</h1>
        <p className="text-gray-600 mt-2">
          Acompanhe as etapas do seu tratamento ortodôntico
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Duração Estimada: 12 meses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              O tempo de tratamento pode variar de acordo com a resposta individual e adesão ao uso dos alinhadores.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {etapas.map((etapa, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {etapa.status === 'completo' ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <Circle className="h-6 w-6 text-gray-400" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {etapa.mes}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {etapa.titulo}
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    {etapa.descricao}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pós-Tratamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Contenção (Lifetime)</h4>
            <p className="text-sm text-gray-600">
              Após concluir o tratamento, você receberá contenções para manter seus dentes na posição ideal.
              O uso regular das contenções é essencial para preservar os resultados alcançados.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
