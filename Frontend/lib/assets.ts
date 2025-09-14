// Configuração centralizada de assets visuais - Frontend Principal
export const ASSETS = {
  logos: {
    atma: {
      horizontal: '/assets/logos/atma/logo-horizontal.svg',
      principal: '/assets/logos/atma/logo-principal.svg',
      principalDark: '/assets/logos/atma/logo-principal-dark.svg',
      principalLight: '/assets/logos/atma/logo-principal-light.svg',
      vertical: '/assets/logos/atma/logo-vertical.svg',
      marca: '/assets/logos/atma/logo-marca.svg',
    }
  },
  icons: {
    favicon: '/assets/icons/favicon.ico',
    favicon16: '/assets/icons/favicon-16x16.png',
    favicon32: '/assets/icons/favicon-32x32.png',
    appleTouchIcon: '/assets/icons/apple-touch-icon.png',
  }
} as const

// Types para TypeScript
export type AtmaLogoVariant = keyof typeof ASSETS.logos.atma
export type IconVariant = keyof typeof ASSETS.icons

// Helper functions
export const getAtmaLogo = (variant: AtmaLogoVariant = 'horizontal') => {
  return ASSETS.logos.atma[variant]
}

export const getIcon = (variant: IconVariant) => {
  return ASSETS.icons[variant]
}

// Configurações padrão para cada variante de logo
export const LogoConfig = {
  atma: {
    horizontal: { 
      width: 200, 
      height: 50, 
      alt: 'Atma Aligner - Sistema de Alinhadores Transparentes',
      className: 'h-8 w-auto'
    },
    principal: { 
      width: 220, 
      height: 55, 
      alt: 'Atma Aligner - Sistema de Alinhadores Transparentes',
      className: 'h-10 w-auto'
    },
    vertical: { 
      width: 100, 
      height: 120, 
      alt: 'Atma Aligner - Sistema de Alinhadores Transparentes',
      className: 'h-24 w-auto'
    },
    marca: { 
      width: 64, 
      height: 64, 
      alt: 'Atma',
      className: 'h-12 w-12'
    },
  }
} as const