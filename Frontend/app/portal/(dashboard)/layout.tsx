import { Metadata } from 'next'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import {
  LayoutDashboard,
  LineChart,
  DollarSign,
  Clock,
  Cpu,
  MessageSquare,
  HelpCircle,
  Download,
  Menu
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Portal do Paciente | Atma Aligner',
  description: 'Acesse seu relatório de viabilidade e acompanhe sua jornada ortodôntica',
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/portal' },
  { icon: LineChart, label: 'Análise do Caso', href: '/portal/analise' },
  { icon: DollarSign, label: 'Financeiro', href: '/portal/financeiro' },
  { icon: Clock, label: 'Timeline', href: '/portal/timeline' },
  { icon: Cpu, label: 'Tecnologia', href: '/portal/tecnologia' },
  { icon: MessageSquare, label: 'Depoimentos', href: '/portal/depoimentos' },
  { icon: HelpCircle, label: 'Perguntas', href: '/portal/perguntas' },
  { icon: Download, label: 'Downloads', href: '/portal/downloads' },
]

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 bg-white border-r border-gray-200 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-4 pb-4 border-b border-gray-200">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div>
                <div className="font-bold text-gray-900">Atma Aligner</div>
                <div className="text-xs text-gray-500">Portal do Paciente</div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* User Profile */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center w-full">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10"
                  }
                }}
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Meu Perfil</p>
                <p className="text-xs text-gray-500">Ver configurações</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="font-bold text-gray-900">Atma Portal</span>
          </Link>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-8 h-8"
              }
            }}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-inset-bottom">
        <div className="flex justify-around">
          {menuItems.slice(0, 5).map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label.split(' ')[0]}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
