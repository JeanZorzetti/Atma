import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Atma Aligner - Ortodontia Digital Premium',
    short_name: 'Atma',
    description: 'Alinhadores invisíveis premium com tecnologia 3D. Ortodontistas especializados e preços acessíveis.',
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

    // Basic icon set (using SVG for now)
    icons: [
      {
        src: '/icons/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any'
      },
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon'
      }
    ]
  }
}