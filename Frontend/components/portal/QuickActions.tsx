'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Download,
  Calendar,
  Share2,
  FileText,
  ExternalLink,
  ChevronRight
} from 'lucide-react'

export function QuickActions() {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Ações Rápidas</h3>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Baixar PDF */}
          <Button
            size="lg"
            className="w-full h-auto py-4 px-4 bg-blue-600 hover:bg-blue-700 flex flex-col items-start gap-2"
            asChild
          >
            <Link href="/portal/downloads">
              <div className="flex items-center gap-3 w-full">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Download className="h-5 w-5" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold">Baixar PDF</div>
                  <div className="text-xs text-blue-100 font-normal">
                    Relatório completo
                  </div>
                </div>
                <ChevronRight className="h-5 w-5" />
              </div>
            </Link>
          </Button>

          {/* Agendar Consulta */}
          <Button
            size="lg"
            variant="outline"
            className="w-full h-auto py-4 px-4 border-2 flex flex-col items-start gap-2"
            asChild
          >
            <Link href="/portal/agendar">
              <div className="flex items-center gap-3 w-full">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold">Agendar Consulta</div>
                  <div className="text-xs text-gray-500 font-normal">
                    Escolha data e horário
                  </div>
                </div>
                <ChevronRight className="h-5 w-5" />
              </div>
            </Link>
          </Button>

          {/* Compartilhar */}
          <Button
            size="lg"
            variant="outline"
            className="w-full h-auto py-4 px-4 border-2 flex flex-col items-start gap-2"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Meu Relatório Atma',
                  text: 'Confira meu relatório de viabilidade para alinhadores invisíveis!',
                  url: window.location.origin + '/portal',
                })
              } else {
                // Fallback: copiar link
                navigator.clipboard.writeText(window.location.href)
                alert('Link copiado para área de transferência!')
              }
            }}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                <Share2 className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-left flex-1">
                <div className="font-semibold">Compartilhar</div>
                <div className="text-xs text-gray-500 font-normal">
                  Enviar para dentista
                </div>
              </div>
            </div>
          </Button>
        </div>

        {/* Ação Secundária - Explorar Seções */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Explore Seu Relatório
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Análise', href: '/portal/analise', icon: FileText },
              { label: 'Financeiro', href: '/portal/financeiro', icon: Download },
              { label: 'Timeline', href: '/portal/timeline', icon: Calendar },
              { label: 'Perguntas', href: '/portal/perguntas', icon: FileText },
            ].map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                >
                  <Icon className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
