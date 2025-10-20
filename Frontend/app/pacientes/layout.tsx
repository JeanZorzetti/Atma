import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Alinhadores Invisíveis para Pacientes | Atma Aligner Brasil",
  description: "Transforme seu sorriso com alinhadores invisíveis a partir de R$ 3.990. Parcele em 12x sem juros. Consulta grátis. Tecnologia alemã premium. Ortodontistas em todo Brasil!",
  keywords: ["alinhadores invisíveis", "aparelho transparente", "ortodontia invisível", "preço acessível", "parcelas sem juros"],
  openGraph: {
    title: "Alinhadores Invisíveis para Pacientes | Atma Aligner",
    description: "Transforme seu sorriso com alinhadores invisíveis a partir de R$ 3.990. Parcele em 12x. Consulta grátis!",
  }
}

export default function PacientesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
