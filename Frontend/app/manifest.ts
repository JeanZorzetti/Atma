import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Atma Aligner - Ortodontia Digital Premium',
    short_name: 'Atma',
    description: 'Revolucione seu sorriso com alinhadores invisíveis premium. Tecnologia 3D, ortodontistas especializados e parcelas acessíveis.',
    start_url: '/?utm_source=pwa',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1e40af', // Medical blue from design system
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'pt-BR',
    categories: ['health', 'medical', 'lifestyle', 'business'],

    // PWA Advanced Features
    display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],

    // Shortcuts for common actions
    shortcuts: [
      {
        name: 'Encontrar Ortodontista',
        short_name: 'Encontrar Dr.',
        description: 'Encontre um ortodontista parceiro perto de você',
        url: '/pacientes/encontre-doutor?utm_source=pwa_shortcut',
        icons: [
          {
            src: '/icons/doctor-shortcut.png',
            sizes: '96x96'
          }
        ]
      },
      {
        name: 'Ver Preços',
        short_name: 'Preços',
        description: 'Consulte preços e opções de financiamento',
        url: '/pacientes/precos?utm_source=pwa_shortcut',
        icons: [
          {
            src: '/icons/price-shortcut.png',
            sizes: '96x96'
          }
        ]
      },
      {
        name: 'Seja Parceiro',
        short_name: 'Parceria',
        description: 'Torne-se um ortodontista parceiro Atma',
        url: '/ortodontistas/seja-parceiro?utm_source=pwa_shortcut',
        icons: [
          {
            src: '/icons/partner-shortcut.png',
            sizes: '96x96'
          }
        ]
      }
    ],

    // Comprehensive icon set
    icons: [
      {
        src: '/icons/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/maskable-icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/maskable-icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png'
      }
    ]
  }
}