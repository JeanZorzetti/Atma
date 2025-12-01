'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href: string
}

const routeLabels: Record<string, string> = {
  portal: 'Dashboard',
  analise: 'Análise do Caso',
  financeiro: 'Financeiro',
  timeline: 'Timeline',
  tecnologia: 'Tecnologia',
  depoimentos: 'Depoimentos',
  perguntas: 'Perguntas Frequentes',
  downloads: 'Downloads',
  agendar: 'Agendar Consulta',
}

export function Breadcrumbs() {
  const pathname = usePathname()

  // Gerar breadcrumbs baseado no pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []

    let currentPath = ''

    for (let i = 0; i < paths.length; i++) {
      const segment = paths[i]
      currentPath += `/${segment}`

      // Pular segmentos de autenticação
      if (segment === 'entrar' || segment === 'cadastro') continue

      const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)

      breadcrumbs.push({
        label,
        href: currentPath,
      })
    }

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  // Não mostrar breadcrumbs se estiver na raiz do portal ou em páginas de auth
  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      {/* Home / Portal */}
      <Link
        href="/portal"
        className="flex items-center hover:text-blue-600 transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>

      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1

        return (
          <div key={crumb.href} className="flex items-center space-x-2">
            <ChevronRight className="h-4 w-4 text-gray-400" />

            {isLast ? (
              <span className="font-medium text-gray-900">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="hover:text-blue-600 transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
