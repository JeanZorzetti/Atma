import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/_next/',
        '/ortodontistas/recursos-disabled/', // Página desabilitada
      ],
    },
    sitemap: 'https://atma.roilabs.com.br/sitemap.xml',
  }
}