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
        src: '/atma-logo-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/atma-logo-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      }
    ]
  }
}