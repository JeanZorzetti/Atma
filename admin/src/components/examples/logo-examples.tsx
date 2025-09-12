// Exemplos de como usar os componentes de logo
// Este arquivo pode ser removido após a implementação

import { AtmaLogo, RoiLabsLogo, SimpleLogo, useThemeLogo } from '@/components/ui/logo'
import { getAtmaLogo, getRoiLabsLogo } from '@/lib/assets'

export function LogoExamples() {
  const themeLogos = useThemeLogo('light') // ou 'dark'

  return (
    <div className="space-y-8 p-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Logos da Atma</h2>
        
        {/* Uso básico com variantes */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Logo Horizontal</h3>
            <AtmaLogo variant="horizontal" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Logo Vertical</h3>
            <AtmaLogo variant="vertical" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Marca (Ícone)</h3>
            <AtmaLogo variant="marca" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Com tamanho customizado</h3>
            <AtmaLogo variant="horizontal" width={150} height={38} />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Com classe CSS customizada</h3>
            <AtmaLogo 
              variant="horizontal" 
              className="opacity-75 hover:opacity-100 transition-opacity" 
            />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Clicável</h3>
            <AtmaLogo 
              variant="horizontal" 
              onClick={() => alert('Logo clicada!')}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Logos da ROI Labs</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Logo Horizontal</h3>
            <RoiLabsLogo variant="horizontal" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Logo Vertical</h3>
            <RoiLabsLogo variant="vertical" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Marca</h3>
            <RoiLabsLogo variant="marca" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Uso com img tag simples</h2>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">SVG direto</h3>
          <SimpleLogo 
            src={getAtmaLogo('horizontal')}
            alt="Atma Logo"
            width="200"
            height="50"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Uso com tema automático</h2>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Logo baseada no tema</h3>
          <AtmaLogo variant={themeLogos.atma} />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Em layouts típicos</h2>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Header</h3>
          <div className="flex items-center justify-between">
            <AtmaLogo variant="horizontal" width={120} height={30} />
            <nav className="text-sm text-gray-600">Menu items...</nav>
          </div>
        </div>
        
        <div className="bg-gray-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-white">Footer Dark</h3>
          <div className="flex items-center space-x-8">
            <AtmaLogo variant="horizontalLight" width={100} height={25} />
            <RoiLabsLogo variant="horizontalLight" width={80} height={20} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Componentes específicos para layouts comuns
export function HeaderLogo({ onClick }: { onClick?: () => void }) {
  return (
    <AtmaLogo 
      variant="horizontal" 
      width={140} 
      height={35}
      className="h-8 w-auto"
      onClick={onClick}
      priority
    />
  )
}

export function FooterLogo() {
  return (
    <div className="flex items-center space-x-6 opacity-75">
      <AtmaLogo variant="horizontal" width={120} height={30} />
      <span className="text-xs text-gray-500">by</span>
      <RoiLabsLogo variant="horizontal" width={80} height={20} />
    </div>
  )
}

export function LoginLogo() {
  return (
    <div className="text-center mb-8">
      <AtmaLogo variant="vertical" width={120} height={140} priority />
    </div>
  )
}