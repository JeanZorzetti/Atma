'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  HelpCircle,
  Search,
  Copy,
  Printer,
  CheckCircle2,
  MessageCircleQuestion,
  Lightbulb,
  FileQuestion,
  Clock,
  DollarSign,
  Zap,
} from 'lucide-react'

// Categorias de perguntas
type Categoria = 'tratamento' | 'uso' | 'custos' | 'tecnologia' | 'resultados' | 'todos'

interface Pergunta {
  id: number
  categoria: Categoria
  pergunta: string
  resposta: string
  tags: string[]
}

// Base de perguntas frequentes
const perguntas: Pergunta[] = [
  // Tratamento
  {
    id: 1,
    categoria: 'tratamento',
    pergunta: 'Quanto tempo dura o tratamento com Atma Aligner?',
    resposta:
      'A duração média do tratamento varia entre 6 e 18 meses, dependendo da complexidade do seu caso. Casos simples podem ser resolvidos em 6-9 meses, enquanto casos mais complexos podem levar até 18 meses. Seu ortodontista fornecerá uma estimativa precisa após a análise inicial do seu caso.',
    tags: ['duração', 'tempo', 'quanto tempo'],
  },
  {
    id: 2,
    categoria: 'tratamento',
    pergunta: 'O tratamento dói?',
    resposta:
      'É normal sentir uma leve pressão ou desconforto nos primeiros dias após trocar para um novo alinhador. Isso indica que os dentes estão se movendo. O desconforto é geralmente muito menor que com aparelhos tradicionais e desaparece em 1-2 dias. Analgésicos comuns podem ser usados se necessário.',
    tags: ['dor', 'desconforto', 'sensibilidade'],
  },
  {
    id: 3,
    categoria: 'tratamento',
    pergunta: 'Preciso usar contenção após o tratamento?',
    resposta:
      'Sim, o uso de contenção é essencial para manter os resultados alcançados. Recomendamos contenção fixa (fio colado atrás dos dentes) e contenção removível para uso noturno. Nos primeiros 6 meses, use todas as noites; depois, 3-4 noites por semana indefinidamente. Os dentes têm tendência natural de voltar à posição original sem contenção.',
    tags: ['contenção', 'manutenção', 'depois'],
  },
  {
    id: 4,
    categoria: 'tratamento',
    pergunta: 'Com que frequência preciso trocar os alinhadores?',
    resposta:
      'Você trocará de alinhador a cada 2 semanas (14 dias), conforme orientação do seu ortodontista. É importante seguir o cronograma rigorosamente para garantir o movimento dental adequado. Trocar antes ou depois do prazo pode comprometer os resultados.',
    tags: ['troca', 'frequência', 'cronograma'],
  },

  // Uso Diário
  {
    id: 5,
    categoria: 'uso',
    pergunta: 'Por quantas horas por dia devo usar os alinhadores?',
    resposta:
      'Os alinhadores devem ser usados por 22 horas por dia, removendo apenas para comer, beber (exceto água), escovar os dentes e usar fio dental. O uso inferior a 20 horas/dia pode comprometer significativamente os resultados e prolongar o tratamento.',
    tags: ['horas', 'uso diário', 'tempo de uso'],
  },
  {
    id: 6,
    categoria: 'uso',
    pergunta: 'Posso comer com os alinhadores?',
    resposta:
      'Não! Você deve SEMPRE remover os alinhadores antes de comer qualquer alimento. Comer com os alinhadores pode danificá-los, manchar o material e acumular restos de comida. Após as refeições, escove os dentes e os alinhadores antes de recolocá-los.',
    tags: ['comer', 'alimentação', 'refeições'],
  },
  {
    id: 7,
    categoria: 'uso',
    pergunta: 'Posso beber com os alinhadores?',
    resposta:
      'Água pode ser consumida normalmente com os alinhadores. Outras bebidas (café, chá, refrigerante, suco) devem ser consumidas sem os alinhadores, pois podem manchar o material transparente. Bebidas quentes podem deformar os alinhadores.',
    tags: ['beber', 'bebidas', 'café'],
  },
  {
    id: 8,
    categoria: 'uso',
    pergunta: 'Como limpar os alinhadores?',
    resposta:
      'Escove suavemente os alinhadores com escova de dentes macia e sabão neutro ou pasta de dente não abrasiva. Enxágue bem com água fria (nunca quente). Pode usar pastilhas efervescentes para limpeza profunda 2-3x por semana. Evite produtos coloridos que possam manchar.',
    tags: ['limpeza', 'higiene', 'cuidados'],
  },
  {
    id: 9,
    categoria: 'uso',
    pergunta: 'O que faço se perder ou quebrar um alinhador?',
    resposta:
      'Entre em contato imediatamente com seu ortodontista. Dependendo do estágio do tratamento, você pode: 1) Voltar ao alinhador anterior temporariamente, 2) Pular para o próximo alinhador (se estava no final do período), ou 3) Solicitar reposição. Nunca fique sem usar alinhador por mais de 1-2 dias.',
    tags: ['perder', 'quebrar', 'danificar'],
  },

  // Custos e Pagamento
  {
    id: 10,
    categoria: 'custos',
    pergunta: 'Qual o custo do tratamento com Atma Aligner?',
    resposta:
      'O investimento médio é de R$ 5.990, podendo variar de R$ 4.500 a R$ 8.000 dependendo da complexidade do caso. Oferecemos parcelamento em até 12x sem juros no cartão de crédito. Consulte seu ortodontista para um orçamento personalizado.',
    tags: ['preço', 'valor', 'custo'],
  },
  {
    id: 11,
    categoria: 'custos',
    pergunta: 'Quais formas de pagamento são aceitas?',
    resposta:
      'Aceitamos: 1) Cartão de crédito (até 12x sem juros), 2) PIX (5% de desconto à vista), 3) Boleto bancário (até 6x), 4) Transferência bancária (desconto à vista). Alguns ortodontistas parceiros também oferecem financiamento próprio.',
    tags: ['pagamento', 'parcelamento', 'cartão'],
  },
  {
    id: 12,
    categoria: 'custos',
    pergunta: 'O valor inclui todas as consultas e alinhadores?',
    resposta:
      'Sim! O valor do tratamento inclui: todos os alinhadores necessários, consultas de acompanhamento, moldagens digitais, planejamento 3D, refinamentos (se necessário) e contenções finais. Não há custos ocultos ou taxas extras durante o tratamento.',
    tags: ['o que está incluído', 'completo'],
  },

  // Tecnologia
  {
    id: 13,
    categoria: 'tecnologia',
    pergunta: 'Como funciona o escaneamento 3D?',
    resposta:
      'Utilizamos um scanner intraoral que captura imagens digitais precisas dos seus dentes em poucos minutos. É rápido, confortável e elimina a necessidade de moldes tradicionais de silicone. O scan 3D gera um modelo digital que é usado para planejar seu tratamento.',
    tags: ['escaneamento', '3D', 'moldagem'],
  },
  {
    id: 14,
    categoria: 'tecnologia',
    pergunta: 'Como são fabricados os alinhadores?',
    resposta:
      'Após o planejamento digital do seu tratamento, cada alinhador é fabricado individualmente usando impressão 3D de alta precisão. O material é poliuretano termoplástico de grau médico, biocompatível e transparente. Cada set é personalizado exclusivamente para você.',
    tags: ['fabricação', 'como são feitos', 'material'],
  },
  {
    id: 15,
    categoria: 'tecnologia',
    pergunta: 'Posso ver como ficará meu sorriso antes de começar?',
    resposta:
      'Sim! Após o escaneamento, nosso software cria uma simulação 3D mostrando exatamente como seus dentes se moverão a cada etapa até o resultado final. Você visualiza o sorriso final antes mesmo de começar o tratamento, garantindo total transparência.',
    tags: ['simulação', 'resultado', 'visualização'],
  },

  // Resultados
  {
    id: 16,
    categoria: 'resultados',
    pergunta: 'Os resultados são permanentes?',
    resposta:
      'Sim, desde que você use as contenções conforme orientado. Os dentes têm memória óssea e tendem a voltar à posição original sem contenção. Usar contenção fixa + removível noturna mantém os resultados indefinidamente. É um pequeno compromisso para preservar seu investimento!',
    tags: ['permanente', 'duradouro', 'para sempre'],
  },
  {
    id: 17,
    categoria: 'resultados',
    pergunta: 'Quando verei os primeiros resultados?',
    resposta:
      'A maioria dos pacientes começa a notar mudanças visíveis após 4-6 semanas de uso consistente. Casos simples podem mostrar melhorias significativas em 2-3 meses. Lembre-se: quanto mais você usar (22h/dia), mais rápidos serão os resultados.',
    tags: ['quando', 'primeiros resultados', 'mudanças'],
  },
  {
    id: 18,
    categoria: 'resultados',
    pergunta: 'Atma funciona tão bem quanto aparelho tradicional?',
    resposta:
      'Sim! Estudos científicos mostram que alinhadores transparentes são tão eficazes quanto aparelhos fixos para a maioria dos casos ortodônticos. As principais diferenças são: maior conforto, melhor estética, facilidade de higiene e menos emergências com alinhadores.',
    tags: ['eficácia', 'comparação', 'funciona'],
  },
]

// Perguntas para fazer ao ortodontista
const perguntasOrtodontista = [
  'Qual é a duração estimada do meu tratamento especificamente?',
  'Quantos alinhadores vou precisar ao total?',
  'Com que frequência preciso comparecer às consultas presenciais?',
  'Há alguma restrição ou cuidado especial para o meu caso?',
  'Vou precisar usar elásticos ou attachments (botões)?',
  'Posso ver a simulação 3D do resultado final do meu tratamento?',
  'O que acontece se eu não seguir o cronograma de troca dos alinhadores?',
  'Quais são os sinais de que o tratamento não está progredindo bem?',
  'Como funciona o processo de refinamento, se necessário?',
  'Qual tipo de contenção você recomenda para o meu caso?',
]

const categoriasLabels: Record<Categoria, { label: string; icone: any; cor: string }> = {
  todos: { label: 'Todas', icone: FileQuestion, cor: 'gray' },
  tratamento: { label: 'Tratamento', icone: Clock, cor: 'blue' },
  uso: { label: 'Uso Diário', icone: Zap, cor: 'purple' },
  custos: { label: 'Custos', icone: DollarSign, cor: 'green' },
  tecnologia: { label: 'Tecnologia', icone: Lightbulb, cor: 'cyan' },
  resultados: { label: 'Resultados', icone: CheckCircle2, cor: 'amber' },
}

export default function PerguntasPage() {
  const [busca, setBusca] = useState('')
  const [categoriaAtiva, setCategoriaAtiva] = useState<Categoria>('todos')
  const [copiado, setCopiado] = useState(false)

  // Filtrar perguntas
  const perguntasFiltradas = perguntas.filter((p) => {
    const matchCategoria = categoriaAtiva === 'todos' || p.categoria === categoriaAtiva
    const matchBusca =
      busca === '' ||
      p.pergunta.toLowerCase().includes(busca.toLowerCase()) ||
      p.resposta.toLowerCase().includes(busca.toLowerCase()) ||
      p.tags.some((tag) => tag.toLowerCase().includes(busca.toLowerCase()))

    return matchCategoria && matchBusca
  })

  // Copiar perguntas para ortodontista
  const copiarPerguntas = async () => {
    const texto = perguntasOrtodontista.map((p, i) => `${i + 1}. ${p}`).join('\n')
    await navigator.clipboard.writeText(texto)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  // Imprimir perguntas
  const imprimirPerguntas = () => {
    const conteudo = `
      <html>
        <head>
          <title>Perguntas para o Ortodontista - Atma Aligner</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #2563eb; }
            h2 { color: #4b5563; margin-top: 30px; }
            ol { line-height: 2; }
            li { margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <h1>Perguntas para o Ortodontista</h1>
          <h2>Paciente: [Seu Nome]</h2>
          <h2>Data: ${new Date().toLocaleDateString('pt-BR')}</h2>
          <ol>
            ${perguntasOrtodontista.map((p) => `<li>${p}</li>`).join('')}
          </ol>
        </body>
      </html>
    `
    const janela = window.open('', '_blank')
    if (janela) {
      janela.document.write(conteudo)
      janela.document.close()
      janela.print()
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Perguntas Frequentes
        </h1>
        <p className="text-gray-600 mt-2">
          Encontre respostas para as dúvidas mais comuns sobre o tratamento Atma
        </p>
      </div>

      {/* Barra de Busca */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar perguntas... (ex: quanto custa, como limpar, dói)"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Filtros por Categoria */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Categorias</h3>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(categoriasLabels) as Categoria[]).map((cat) => {
            const { label, icone: Icone, cor } = categoriasLabels[cat]
            const ativo = categoriaAtiva === cat
            const count = cat === 'todos' ? perguntas.length : perguntas.filter((p) => p.categoria === cat).length

            return (
              <Button
                key={cat}
                variant={ativo ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategoriaAtiva(cat)}
                className={`${ativo ? `bg-${cor}-600 hover:bg-${cor}-700` : ''}`}
              >
                <Icone className="h-4 w-4 mr-2" />
                {label}
                <Badge variant="secondary" className="ml-2">
                  {count}
                </Badge>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Contador de Resultados */}
      {busca && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Search className="h-4 w-4" />
          Encontradas {perguntasFiltradas.length} perguntas para "{busca}"
        </div>
      )}

      {/* FAQ Accordion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            {categoriaAtiva === 'todos' ? 'Todas as Perguntas' : categoriasLabels[categoriaAtiva].label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {perguntasFiltradas.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {perguntasFiltradas.map((p) => (
                <AccordionItem key={p.id} value={`item-${p.id}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-start gap-2">
                      <MessageCircleQuestion className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>{p.pergunta}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-7 space-y-3">
                      <p className="text-gray-700 leading-relaxed">{p.resposta}</p>
                      {p.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {p.tags.map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhuma pergunta encontrada
              </h3>
              <p className="text-gray-600 mb-4">
                Tente usar outras palavras-chave ou selecione outra categoria
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setBusca('')
                  setCategoriaAtiva('todos')
                }}
              >
                Limpar Busca
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Perguntas para o Ortodontista */}
      <Card className="border-2 border-purple-200 bg-purple-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircleQuestion className="h-5 w-5 text-purple-600" />
            Perguntas para Fazer ao Seu Ortodontista
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Lista de perguntas importantes para sua primeira consulta
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4">
            {perguntasOrtodontista.map((pergunta, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-white rounded-lg border border-purple-200"
              >
                <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-sm">{index + 1}</span>
                </div>
                <p className="text-gray-700 flex-1">{pergunta}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={copiarPerguntas} className="flex items-center gap-2">
              <Copy className="h-4 w-4" />
              {copiado ? 'Copiado!' : 'Copiar Todas'}
            </Button>
            <Button variant="outline" onClick={imprimirPerguntas} className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* CTA - Ainda com Dúvidas? */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardContent className="p-8 text-center">
          <HelpCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Ainda tem dúvidas?
          </h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Nossa equipe está pronta para responder todas as suas perguntas. Agende uma
            consulta gratuita ou entre em contato conosco!
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Agendar Consulta Gratuita
            </Button>
            <Button size="lg" variant="outline">
              Falar com Especialista
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
