import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Visualização 3D do Tratamento | Alinhadores Invisíveis Atma",
  description: "Veja a simulação 3D do seu novo sorriso antes de iniciar o tratamento. Tecnologia avançada de planejamento ortodôntico digital.",
  keywords: ["visualização 3D", "simulação sorriso", "planejamento ortodôntico", "alinhador 3D", "antes e depois digital"],
  openGraph: {
    title: "Visualização 3D do Tratamento | Alinhadores Invisíveis Atma",
    description: "Veja a simulação 3D do seu novo sorriso antes de iniciar o tratamento com alinhadores invisíveis.",
    type: "website",
    url: "https://atma.roilabs.com.br/pacientes/visualizacao-3d",
    images: [
      {
        url: "https://atma.roilabs.com.br/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Visualização 3D do tratamento com alinhadores invisíveis"
      }
    ]
  }
}

export default function Visualizacao3DLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
