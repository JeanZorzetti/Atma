import type React from "react"
import type { Metadata } from "next"
import { Roboto, Montserrat } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { StructuredData } from "@/components/structured-data"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ClientOnlyFABs } from "@/components/client-only-fabs"
import { GoogleAnalytics } from "@/components/GoogleAnalytics"
import { ClerkProvider } from '@clerk/nextjs'

// TEMPORARY: Force dynamic rendering to fix Google indexation issue (Nov 3, 2025)
// This will force Vercel to bust cache and allow Google to recrawl fresh pages
// Plan: Keep for 7-14 days until Google re-indexes, then remove again
export const dynamic = 'force-dynamic'


const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
  weight: ["400", "500"],
})

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["600", "700"],
})

export const metadata: Metadata = {
  title: {
    default: "Alinhadores Invisíveis | Preço 50% Menor | Atma Aligner Brasil",
    template: "%s | Atma Aligner"
  },
  description: "Alinhadores invisíveis com tecnologia alemã a partir de R$ 3.990. Parcele em até 12x sem juros. Ortodontistas especializados em todo Brasil. Agende consulta grátis!",
  keywords: [
    "alinhadores invisíveis",
    "ortodontia digital",
    "aparelho transparente",
    "tratamento ortodôntico",
    "alinhador dental",
    "ortodontista Passo Fundo",
    "sorriso perfeito",
    "dentição alinhada",
    "ortodontia RS",
    "Atma Aligner",
    "aparelho removível",
    "tecnologia 3D ortodontia"
  ],
  authors: [{ name: "Atma Aligner" }],
  creator: "Atma Aligner",
  publisher: "Atma Aligner",
  metadataBase: new URL('https://atma.roilabs.com.br'),

  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://atma.roilabs.com.br',
    siteName: 'Atma Aligner',
    title: 'Alinhadores Invisíveis | Preço 50% Menor | Atma Aligner Brasil',
    description: 'Alinhadores invisíveis com tecnologia alemã a partir de R$ 3.990. Parcele em até 12x sem juros. Ortodontistas especializados.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Atma Aligner - Alinhadores Invisíveis Premium',
        type: 'image/png'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@atma_aligner',
    creator: '@atma_aligner',
    title: 'Alinhadores Invisíveis | Preço 50% Menor | Atma Aligner',
    description: 'Alinhadores invisíveis a partir de R$ 3.990. Parcele em 12x. Tecnologia alemã premium.',
    images: ['/og-image.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code'
  },
  category: 'healthcare'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="pt-BR" className={`${roboto.variable} ${montserrat.variable}`}>
        <head>
          {/* Advanced Resource Hints for Core Web Vitals */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="preconnect" href="https://www.googletagmanager.com" />
          <link rel="dns-prefetch" href="https://atmaapi.roilabs.com.br" />

          {/* PWA Icons */}
          <meta name="theme-color" content="#7c3aed" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="mobile-web-app-capable" content="yes" />

          {/* Geographic Targeting - Força Google a entender que é Brasil */}
          <meta name="geo.region" content="BR" />
          <meta name="geo.placename" content="Brasil" />
          <meta name="geo.position" content="-28.2620;-52.4080" />
          <meta name="ICBM" content="-28.2620, -52.4080" />

          {/* Facebook Open Graph */}
          <meta property="fb:app_id" content="2108479793316007" />

          <StructuredData />
          <GoogleAnalytics />
        </head>
        <body className="min-h-screen flex flex-col">
          {/* WCAG 2.2 Skip Navigation */}
          <a href="#main-content" className="skip-nav">
            Pular para o conteúdo principal
          </a>
          <a href="#footer" className="skip-nav">
            Pular para o rodapé
          </a>

          <Header />
          <Breadcrumbs />
          <main id="main-content" className="flex-1 mobile-viewport" role="main" aria-label="Conteúdo principal">
            {children}
          </main>
          <Footer />

          {/* Mobile FABs - Client-side only */}
          <ClientOnlyFABs />
        </body>
      </html>
    </ClerkProvider>
  )
}
