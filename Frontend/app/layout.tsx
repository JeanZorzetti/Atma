import type React from "react"
import type { Metadata } from "next"
import { Roboto, Montserrat } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

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
  title: "Atma Aligner - Alinhadores Premium Acessíveis",
  description:
    "Democratizando o acesso à ortodontia digital de ponta no Brasil. Tecnologia de classe mundial com acessibilidade financeira.",
  keywords: "alinhadores, ortodontia, invisível, transparente, sorriso, dentes, tratamento ortodôntico, atma aligner",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${roboto.variable} ${montserrat.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
