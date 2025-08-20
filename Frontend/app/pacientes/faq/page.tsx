import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import Link from "next/link"

export default function FAQPage() {
  const faqs = [
    {
      categoria: "Tratamento",
      perguntas: [
        {
          pergunta: "Como funcionam os alinhadores ortodônticos?",
          resposta:
            "Os alinhadores são placas transparentes feitas sob medida que aplicam força controlada nos dentes, movimentando-os gradualmente para a posição ideal. Cada alinhador é usado por cerca de 2 semanas antes de trocar pelo próximo da sequência.",
        },
        {
          pergunta: "Quanto tempo dura o tratamento?",
          resposta:
            "O tempo varia de acordo com a complexidade do caso, mas a maioria dos tratamentos dura entre 6 a 18 meses. Casos mais simples podem ser resolvidos em 6-8 meses, enquanto casos complexos podem levar até 24 meses.",
        },
        {
          pergunta: "Os alinhadores são realmente invisíveis?",
          resposta:
            "Os alinhadores são praticamente invisíveis quando usados. Feitos de material transparente de alta qualidade, a maioria das pessoas não percebe que você está usando aparelho ortodôntico.",
        },
        {
          pergunta: "Posso comer normalmente durante o tratamento?",
          resposta:
            "Sim! Uma das grandes vantagens dos alinhadores é que você pode removê-los para comer. Recomendamos retirar os alinhadores durante as refeições e escová-los antes de recolocar.",
        },
      ],
    },
    {
      categoria: "Uso e Cuidados",
      perguntas: [
        {
          pergunta: "Quantas horas por dia devo usar os alinhadores?",
          resposta:
            "Para obter os melhores resultados, você deve usar os alinhadores por 20-22 horas por dia, removendo apenas para comer, beber (exceto água) e fazer higiene bucal.",
        },
        {
          pergunta: "Como limpar os alinhadores?",
          resposta:
            "Escove os alinhadores suavemente com escova de dente macia e água fria. Evite água quente que pode deformar o material. Você também pode usar pastilhas efervescentes específicas para limpeza.",
        },
        {
          pergunta: "E se eu perder ou quebrar um alinhador?",
          resposta:
            "Entre em contato imediatamente com seu ortodontista. Dependendo do estágio do tratamento, você pode voltar ao alinhador anterior ou pular para o próximo até que um substituto seja feito.",
        },
        {
          pergunta: "Os alinhadores causam dor?",
          resposta:
            "É normal sentir pressão e desconforto leve nos primeiros dias de cada novo alinhador. Isso indica que o tratamento está funcionando. A dor é muito menor comparada ao aparelho fixo tradicional.",
        },
      ],
    },
    {
      categoria: "Elegibilidade",
      perguntas: [
        {
          pergunta: "Qualquer pessoa pode usar alinhadores?",
          resposta:
            "Os alinhadores são eficazes para a maioria dos casos ortodônticos, incluindo apinhamento, espaçamento, sobremordida e mordida cruzada. Casos muito complexos podem requerer aparelho fixo tradicional.",
        },
        {
          pergunta: "Existe idade mínima ou máxima para o tratamento?",
          resposta:
            "Não há limite de idade! Desde que você tenha dentes e gengivas saudáveis, pode fazer o tratamento. Temos pacientes de 12 a 70 anos que obtiveram excelentes resultados.",
        },
        {
          pergunta: "Posso usar alinhadores se tenho restaurações ou implantes?",
          resposta:
            "Sim, na maioria dos casos. Restaurações, coroas e implantes não impedem o tratamento, mas seu ortodontista avaliará cada situação específica durante a consulta.",
        },
        {
          pergunta: "Preciso extrair dentes para usar alinhadores?",
          resposta:
            "Na maioria dos casos, não é necessário extrair dentes. Os alinhadores conseguem criar espaço através de técnicas como expansão e desgaste interproximal controlado.",
        },
      ],
    },
    {
      categoria: "Financeiro",
      perguntas: [
        {
          pergunta: "Quanto custa o tratamento com alinhadores?",
          resposta:
            "O investimento varia de acordo com a complexidade do caso. Oferecemos opções a partir de R$ 150/mês, com diferentes planos de financiamento para caber no seu orçamento.",
        },
        {
          pergunta: "Posso parcelar o tratamento?",
          resposta:
            "Sim! Oferecemos diversas opções de parcelamento, incluindo financiamento próprio em até 24x sem juros e parcerias com instituições financeiras para prazos maiores.",
        },
        {
          pergunta: "O plano de saúde cobre o tratamento?",
          resposta:
            "Alguns planos odontológicos cobrem parcialmente o tratamento ortodôntico. Consulte seu plano para verificar a cobertura disponível.",
        },
        {
          pergunta: "O que está incluído no valor do tratamento?",
          resposta:
            "O valor inclui: consulta inicial, planejamento digital 3D, todos os alinhadores necessários, consultas de acompanhamento e contenção pós-tratamento.",
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">Perguntas Frequentes</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Tire Suas Dúvidas</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Encontre respostas para as perguntas mais comuns sobre o tratamento com alinhadores ortodônticos.
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          {faqs.map((categoria, index) => (
            <div key={index}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{categoria.categoria}</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {categoria.perguntas.map((faq, faqIndex) => (
                  <AccordionItem
                    key={faqIndex}
                    value={`${index}-${faqIndex}`}
                    className="bg-white rounded-lg shadow-sm border"
                  >
                    <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                      <span className="font-medium text-gray-900">{faq.pergunta}</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <p className="text-gray-600 leading-relaxed">{faq.resposta}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Não Encontrou Sua Resposta?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Nossa equipe está pronta para esclarecer todas as suas dúvidas sobre o tratamento.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/pacientes/encontre-doutor">
                <MessageCircle className="w-5 h-5 mr-2" />
                Falar com Especialista
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contato">Entrar em Contato</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
