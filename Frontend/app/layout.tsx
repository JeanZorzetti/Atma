import type React from "react"
import type { Metadata } from "next"
import { Roboto, Montserrat } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { StructuredData } from "@/components/structured-data"

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
    default: "Atma Aligner - Alinhadores Invisíveis Premium | Ortodontia Digital",
    template: "%s | Atma Aligner"
  },
  description: "Democratize seu sorriso com alinhadores invisíveis premium e acessíveis. Tecnologia 3D avançada, IA para planejamento e ortodontistas especializados. Transforme seu sorriso em Passo Fundo, RS.",
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
  alternates: {
    canonical: "https://atma.roilabs.com.br"
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://atma.roilabs.com.br',
    siteName: 'Atma Aligner',
    title: 'Atma Aligner - Alinhadores Invisíveis Premium',
    description: 'Democratize seu sorriso com alinhadores invisíveis premium e acessíveis. Tecnologia 3D avançada e ortodontistas especializados.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Atma Aligner - Alinhadores Invisíveis Premium'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@atma_aligner',
    creator: '@atma_aligner',
    title: 'Atma Aligner - Alinhadores Invisíveis Premium',
    description: 'Democratize seu sorriso com alinhadores invisíveis premium e acessíveis.',
    images: ['/og-image.jpg']
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
    <html lang="pt-BR" className={`${roboto.variable} ${montserrat.variable}`}>
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-EMCS41DMSP"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-EMCS41DMSP');
            `,
          }}
        />
        <StructuredData />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
