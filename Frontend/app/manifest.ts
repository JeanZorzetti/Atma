import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Atma Aligner - Alinhadores Invisíveis Premium',
    short_name: 'Atma Aligner',
    description: 'Democratize seu sorriso com alinhadores invisíveis premium e acessíveis. Tecnologia 3D avançada e ortodontistas especializados.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#7c3aed',
    orientation: 'portrait',
    scope: '/',
    lang: 'pt-BR',
    categories: ['health', 'medical', 'lifestyle'],
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png'
      }
    ]
  }
}