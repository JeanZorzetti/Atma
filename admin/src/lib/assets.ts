// Configuração centralizada de assets visuais
export const ASSETS = {
  logos: {
    atma: {
      horizontal: '/assets/logos/atma/atma-logo-horizontal.svg',
      horizontalDark: '/assets/logos/atma/atma-logo-horizontal-dark.svg',
      horizontalLight: '/assets/logos/atma/atma-logo-horizontal-light.svg',
      vertical: '/assets/logos/atma/atma-logo-vertical.svg',
      verticalDark: '/assets/logos/atma/atma-logo-vertical-dark.svg',
      verticalLight: '/assets/logos/atma/atma-logo-vertical-light.svg',
      marca: '/assets/logos/atma/atma-marca.svg',
      marcaDark: '/assets/logos/atma/atma-marca-dark.svg',
    },
    roiLabs: {
      horizontal: '/assets/logos/roi-labs/roi-labs-logo-horizontal.svg',
      horizontalDark: '/assets/logos/roi-labs/roi-labs-logo-horizontal-dark.svg',
      horizontalLight: '/assets/logos/roi-labs/roi-labs-logo-horizontal-light.svg',
      vertical: '/assets/logos/roi-labs/roi-labs-logo-vertical.svg',
      marca: '/assets/logos/roi-labs/roi-labs-marca.svg',
    }
  },
  icons: {
    favicon: '/assets/icons/favicon.ico',
    favicon16: '/assets/icons/favicon-16x16.png',
    favicon32: '/assets/icons/favicon-32x32.png',
    appleTouchIcon: '/assets/icons/apple-touch-icon.png',
    androidChrome192: '/assets/icons/android-chrome-192x192.png',
  }
} as const

// Types para TypeScript
export type AtmaLogoVariant = keyof typeof ASSETS.logos.atma
export type RoiLabsLogoVariant = keyof typeof ASSETS.logos.roiLabs
export type IconVariant = keyof typeof ASSETS.icons

// Helper functions
export const getAtmaLogo = (variant: AtmaLogoVariant = 'horizontal') => {
  return ASSETS.logos.atma[variant]
}

export const getRoiLabsLogo = (variant: RoiLabsLogoVariant = 'horizontal') => {
  return ASSETS.logos.roiLabs[variant]
}

export const getIcon = (variant: IconVariant) => {
  return ASSETS.icons[variant]
}

// Componentes de exemplo para uso fácil
export const LogoProps = {
  atma: {
    horizontal: { width: 200, height: 50, alt: 'Atma Aligner' },
    vertical: { width: 100, height: 120, alt: 'Atma Aligner' },
    marca: { width: 64, height: 64, alt: 'Atma' },
  },
  roiLabs: {
    horizontal: { width: 180, height: 45, alt: 'ROI Labs' },
    vertical: { width: 90, height: 110, alt: 'ROI Labs' },
    marca: { width: 64, height: 64, alt: 'ROI Labs' },
  }
} as const