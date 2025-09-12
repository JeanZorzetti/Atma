// Exemplo de header com logo integrada
import { AtmaLogo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { User, LogOut } from 'lucide-react'

interface HeaderWithLogoProps {
  title?: string
  onLogoClick?: () => void
  userEmail?: string
  onLogout?: () => void
}

export function HeaderWithLogo({ 
  title = "Admin Dashboard", 
  onLogoClick,
  userEmail,
  onLogout 
}: HeaderWithLogoProps) {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="flex h-16 items-center px-6 justify-between">
        {/* Logo e título */}
        <div className="flex items-center gap-4">
          <AtmaLogo 
            variant="horizontal" 
            width={140} 
            height={35}
            className="h-8 w-auto"
            onClick={onLogoClick}
            priority
          />
          {title && (
            <div className="h-6 w-px bg-gray-300" />
          )}
          {title && (
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          )}
        </div>

        {/* User actions */}
        {userEmail && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{userEmail}</span>
            </div>
            {onLogout && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

// Versão simplificada só com logo
export function SimpleHeader({ onLogoClick }: { onLogoClick?: () => void }) {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="flex h-14 items-center px-6">
        <AtmaLogo 
          variant="horizontal" 
          width={120} 
          height={30}
          onClick={onLogoClick}
          priority
        />
      </div>
    </header>
  )
}

// Header para páginas de login/auth
export function AuthHeader() {
  return (
    <header className="py-8">
      <div className="text-center">
        <AtmaLogo 
          variant="principal" 
          width={200} 
          height={50}
          className="mx-auto"
          priority
        />
        <p className="mt-2 text-sm text-gray-600">Sistema de Gestão</p>
      </div>
    </header>
  )
}