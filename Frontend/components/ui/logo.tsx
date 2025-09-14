import Image from 'next/image'
import { cn } from '@/lib/utils'
import { getAtmaLogo, AtmaLogoVariant, LogoConfig } from '@/lib/assets'

interface AtmaLogoProps {
  variant?: AtmaLogoVariant
  className?: string
  width?: number
  height?: number
  priority?: boolean
  onClick?: () => void
}

// Componente principal para logo da Atma
export function AtmaLogo({ 
  variant = 'horizontal', 
  className, 
  width, 
  height, 
  priority = false,
  onClick 
}: AtmaLogoProps) {
  const src = getAtmaLogo(variant)
  const config = LogoConfig.atma[variant === 'principal' ? 'principal' : 
                                  variant === 'vertical' ? 'vertical' : 
                                  variant === 'marca' ? 'marca' : 'horizontal']
  
  return (
    <Image
      src={src}
      alt={config.alt}
      width={width || config.width}
      height={height || config.height}
      priority={priority}
      className={cn(
        'object-contain',
        onClick && 'cursor-pointer hover:opacity-80 transition-opacity',
        className || config.className
      )}
      onClick={onClick}
    />
  )
}

// Variações específicas para diferentes contextos

// Logo para header/navbar
export function HeaderLogo({ onClick }: { onClick?: () => void }) {
  return (
    <AtmaLogo
      variant="principal"
      className="h-16 w-auto"
      onClick={onClick}
      priority
    />
  )
}

// Logo para hero section
export function HeroLogo() {
  return (
    <AtmaLogo
      variant="principal"
      className="h-20 w-auto mx-auto"
      priority
    />
  )
}

// Logo compacta para footer
export function FooterLogo() {
  return (
    <AtmaLogo
      variant="horizontal"
      className="h-10 w-auto opacity-75"
    />
  )
}

// Logo marca para ícones/favicons
export function LogoMarca({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12', 
    lg: 'h-16 w-16'
  }
  
  return (
    <AtmaLogo 
      variant="marca" 
      className={sizeClasses[size]}
    />
  )
}

// Logo para loading/splash screens
export function LoadingLogo() {
  return (
    <div className="flex items-center justify-center">
      <AtmaLogo 
        variant="vertical" 
        className="h-20 w-auto animate-pulse"
        priority
      />
    </div>
  )
}

// Logo com tema automático
export function ThemedLogo({ 
  isDark = false, 
  variant = 'principal', 
  ...props 
}: AtmaLogoProps & { isDark?: boolean }) {
  const logoVariant = isDark ? 'principalLight' : 'principalDark'
  
  return (
    <AtmaLogo 
      variant={logoVariant}
      {...props}
    />
  )
}