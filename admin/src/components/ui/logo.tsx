import Image from 'next/image'
import { cn } from '@/lib/utils'
import { getAtmaLogo, getRoiLabsLogo, AtmaLogoVariant, RoiLabsLogoVariant, LogoProps } from '@/lib/assets'

interface LogoBaseProps {
  className?: string
  priority?: boolean
  onClick?: () => void
}

interface AtmaLogoProps extends LogoBaseProps {
  variant?: AtmaLogoVariant
  width?: number
  height?: number
}

interface RoiLabsLogoProps extends LogoBaseProps {
  variant?: RoiLabsLogoVariant
  width?: number
  height?: number
}

// Componente para logo da Atma
export function AtmaLogo({ 
  variant = 'horizontal', 
  className, 
  width, 
  height, 
  priority = false,
  onClick 
}: AtmaLogoProps) {
  const src = getAtmaLogo(variant)
  const defaultProps = LogoProps.atma[variant === 'horizontal' ? 'horizontal' : variant === 'vertical' ? 'vertical' : 'marca']
  
  return (
    <Image
      src={src}
      alt={defaultProps.alt}
      width={width || defaultProps.width}
      height={height || defaultProps.height}
      priority={priority}
      className={cn('object-contain', onClick && 'cursor-pointer', className)}
      onClick={onClick}
    />
  )
}

// Componente para logo da ROI Labs
export function RoiLabsLogo({ 
  variant = 'horizontal', 
  className, 
  width, 
  height, 
  priority = false,
  onClick 
}: RoiLabsLogoProps) {
  const src = getRoiLabsLogo(variant)
  const defaultProps = LogoProps.roiLabs[variant === 'horizontal' ? 'horizontal' : variant === 'vertical' ? 'vertical' : 'marca']
  
  return (
    <Image
      src={src}
      alt={defaultProps.alt}
      width={width || defaultProps.width}
      height={height || defaultProps.height}
      priority={priority}
      className={cn('object-contain', onClick && 'cursor-pointer', className)}
      onClick={onClick}
    />
  )
}

// Componente genérico para usar com img tag (para SVGs simples)
interface SimpleLogoProps extends LogoBaseProps {
  src: string
  alt: string
  width?: number | string
  height?: number | string
}

export function SimpleLogo({ src, alt, width, height, className, onClick }: SimpleLogoProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn('object-contain', onClick && 'cursor-pointer', className)}
      onClick={onClick}
    />
  )
}

// Hook para determinar qual logo usar baseado no tema
export function useThemeLogo(theme: 'light' | 'dark' = 'light') {
  return {
    atma: theme === 'dark' ? 'horizontalDark' as AtmaLogoVariant : 'horizontalLight' as AtmaLogoVariant,
    roiLabs: theme === 'dark' ? 'horizontalDark' as RoiLabsLogoVariant : 'horizontalLight' as RoiLabsLogoVariant,
  }
}