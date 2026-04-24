// Configuração centralizada de assets visuais - Frontend Principal
export const ASSETS = {
  logos: {
    atma: {
      horizontal: '/assets/logos/atma/Atma.png',
      principal: '/assets/logos/atma/Atma.png',
      principalDark: '/assets/logos/atma/Atma.png',
      principalLight: '/assets/logos/atma/Atma.png',
      vertical: '/assets/logos/atma/Atma.png',
      marca: '/assets/logos/atma/Atma.png',
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
      width: 250,
      height: 60,
      alt: 'Atma Aligner - Sistema de Alinhadores Transparentes',
      className: 'h-12 w-auto'
    },
    principal: {
      width: 280,
      height: 70,
      alt: 'Atma Aligner - Sistema de Alinhadores Transparentes',
      className: 'h-16 w-auto'
    },
    vertical: {
      width: 120,
      height: 150,
      alt: 'Atma Aligner - Sistema de Alinhadores Transparentes',
      className: 'h-32 w-auto'
    },
    marca: {
      width: 80,
      height: 80,
      alt: 'Atma',
      className: 'h-16 w-16'
    },
  }
} as const