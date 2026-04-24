import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Alinhadores Invisíveis para Pacientes | Atma Aligner",
  description: "Transforme seu sorriso com alinhadores invisíveis a partir de R$ 3.990. Parcele em 12x. Consulta grátis! Encontre um ortodontista parceiro perto de você.",
  keywords: ["alinhador invisível", "ortodontista", "aparelho transparente", "preço alinhador", "ortodontia invisível"],
  openGraph: {
    title: "Alinhadores Invisíveis para Pacientes | Atma Aligner",
    description: "Transforme seu sorriso com alinhadores invisíveis a partir de R$ 3.990. Parcele em 12x. Consulta grátis!",
    type: "website",
    url: "https://atma.roilabs.com.br/pacientes/encontre-doutor",
    images: [
      {
        url: "https://atma.roilabs.com.br/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Encontre um ortodontista parceiro Atma perto de você"
      }
    ]
  }
}

export default function EncontreDoutorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
