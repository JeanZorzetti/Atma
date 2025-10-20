import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Como Funciona o Alinhador Invisível | Guia Completo 2025",
  description: "Descubra como o aparelho invisível funciona: duração 6-24 meses, consultas a cada 6 semanas, 22h/dia de uso. Veja o passo a passo completo do tratamento ortodôntico!",
  keywords: ["como funciona alinhador invisível", "tratamento ortodôntico", "passo a passo alinhador", "duração tratamento", "aparelho transparente"],
  openGraph: {
    title: "Como Funciona o Alinhador Invisível | Guia Completo",
    description: "Duração 6-24 meses, consultas a cada 6 semanas, 22h/dia de uso. Veja o passo a passo completo!",
  }
}

export default function TratamentoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
