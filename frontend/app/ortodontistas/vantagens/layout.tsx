import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Parceria Ortodontista | +35% Receita em 4 Meses | Atma",
  description: "Aumente 35% sua receita com alinhadores invisíveis. Sistema turnkey completo, ROI em 4-6 meses. Tecnologia alemã premium. Marketing incluso. Seja parceiro Atma!",
  keywords: ["parceria ortodontista", "aumentar receita ortodontia", "alinhadores para ortodontistas", "roi ortodontia", "tecnologia ortodôntica"],
  openGraph: {
    title: "Parceria Ortodontista | +35% Receita | Atma Aligner",
    description: "Aumente 35% sua receita com alinhadores invisíveis. Sistema turnkey, ROI em 4-6 meses. Tecnologia alemã premium.",
  }
}

export default function VantagensLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
