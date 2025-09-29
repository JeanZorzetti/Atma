'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Star, CheckCircle } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href: string
}

export function Breadcrumbs() {
  const pathname = usePathname()

  // Don't show breadcrumbs on home page
  if (pathname === '/') return null

  const segments = pathname.split('/').filter(Boolean)

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Início', href: '/' }
  ]

  // Build breadcrumb path
  let currentPath = ''
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`

    // Convert segment to readable label
    const labels: { [key: string]: string } = {
      'ortodontistas': 'Ortodontistas',
      'seja-parceiro': 'Seja Parceiro',
      'vantagens': 'Vantagens',
      'vantagens-financeiras': 'Vantagens Financeiras',
      'tecnologia': 'Tecnologia',
      'modelos-parceria': 'Modelos de Parceria',
      'comparar-modelos': 'Comparar Modelos',
      'pacientes': 'Pacientes',
      'antes-depois': 'Antes e Depois',
      'encontre-doutor': 'Encontre um Doutor',
      'faq': 'Perguntas Frequentes',
      'precos': 'Preços',
      'tratamento': 'Tratamento',
      'blog': 'Blog',
      'futuro-ortodontia-ia': 'O Futuro da Ortodontia com IA',
      '1': 'Benefícios dos Alinhadores para Adultos',
      '2': 'Tecnologia 3D na Ortodontia',
      '3': 'Cuidados com seu Alinhador',
      'contato': 'Contato',
      'sobre': 'Sobre'
    }

    const label = labels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
    breadcrumbs.push({ label, href: currentPath })
  })

  // Generate schema.org structured data
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": `https://atma.roilabs.com.br${item.href}`
    }))
  }

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="py-4 px-4 bg-gray-50/50">
        <div className="container mx-auto">
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1

              return (
                <li key={item.href} className="flex items-center">
                  {index === 0 && <CheckCircle className="h-4 w-4 mr-1" />}

                  {isLast ? (
                    <span className="text-gray-500 font-medium" aria-current="page">
                      {item.label}
                    </span>
                  ) : (
                    <>
                      <Link
                        href={item.href}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {item.label}
                      </Link>
                      <Star className="h-4 w-4 mx-2 text-gray-400" />
                    </>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      </nav>
    </>
  )
}