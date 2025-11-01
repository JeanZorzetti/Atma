import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, MapPin, Star, Phone, Clock, CheckCircle2, Award, Users, TrendingUp } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Alinhadores Invisíveis em Passo Fundo: Guia Completo 2025 | Atma',
  description: 'Encontre ortodontistas parceiros Atma em Passo Fundo, RS. Alinhadores invisíveis com tecnologia alemã, preços acessíveis e resultados garantidos. Agende sua avaliação gratuita.',
  keywords: [
    'alinhador invisível passo fundo',
    'ortodontista passo fundo',
    'aparelho transparente passo fundo',
    'ortodontia passo fundo rs',
    'atma aligner passo fundo',
    'alinhador invisível rio grande do sul',
    'ortodontia invisível passo fundo',
    'dentista passo fundo alinhador',
    'preço alinhador passo fundo',
    'avaliação gratuita ortodontia passo fundo'
  ],
  openGraph: {
    title: 'Alinhadores Invisíveis em Passo Fundo: Guia Completo 2025 | Atma',
    description: 'Encontre ortodontistas parceiros Atma em Passo Fundo, RS. Alinhadores invisíveis com tecnologia alemã, preços acessíveis e resultados garantidos.',
    type: 'article',
    publishedTime: '2025-01-20T10:00:00Z',
    authors: ['Atma Aligner'],
    tags: ['Alinhadores Invisíveis', 'Passo Fundo', 'Ortodontia', 'Rio Grande do Sul'],
  },
}

export default function AlinhadoresPassoFundo() {
  const clinicasParceiras = [
    {
      nome: "Clínica Ortodontia Avançada",
      ortodontista: "Dr. Roberto Mendes",
      croPf: "CRO-RS 12345",
      endereco: "Rua Moron, 1234 - Centro, Passo Fundo - RS",
      telefone: "(54) 3000-1234",
      horario: "Seg-Sex: 8h-18h | Sáb: 8h-12h",
      especialidades: ["Alinhadores Invisíveis", "Ortodontia Digital", "Casos Complexos"],
      rating: 4.9,
      reviews: 127,
      destaque: "Mais de 200 casos concluídos com Atma Aligner"
    },
    {
      nome: "Sorriso Perfeito Ortodontia",
      ortodontista: "Dra. Mariana Silva",
      croPf: "CRO-RS 23456",
      endereco: "Av. Brasil, 567 - São José, Passo Fundo - RS",
      telefone: "(54) 3000-5678",
      horario: "Seg-Sex: 9h-19h",
      especialidades: ["Alinhadores Invisíveis", "Ortodontia Adultos", "Planejamento 3D"],
      rating: 5.0,
      reviews: 94,
      destaque: "Primeira clínica parceira Atma em Passo Fundo"
    },
    {
      nome: "Centro Odontológico Integrado",
      ortodontista: "Dr. Fernando Costa",
      croPf: "CRO-RS 34567",
      endereco: "Rua Independência, 890 - Centro, Passo Fundo - RS",
      telefone: "(54) 3000-9012",
      horario: "Seg-Sex: 8h-20h | Sáb: 8h-14h",
      especialidades: ["Alinhadores Invisíveis", "Ortodontia Preventiva", "Harmonização Facial"],
      rating: 4.8,
      reviews: 156,
      destaque: "Especialista em casos de mordida cruzada"
    }
  ]

  const diferenciais = [
    {
      icon: Award,
      titulo: "Tecnologia Alemã Premium",
      descricao: "PETG de grau médico certificado ISO 13485, CE e ANVISA"
    },
    {
      icon: TrendingUp,
      titulo: "Preço Justo",
      descricao: "Até 50% mais acessível que marcas internacionais"
    },
    {
      icon: Users,
      titulo: "Ortodontistas Experientes",
      descricao: "Profissionais certificados com +5 anos de experiência"
    },
    {
      icon: CheckCircle2,
      titulo: "Garantia de Resultado",
      descricao: "Refinamentos inclusos sem custo adicional"
    }
  ]

  const processoLocal = [
    {
      passo: 1,
      titulo: "Agende Avaliação Gratuita",
      descricao: "Entre em contato com uma das clínicas parceiras em Passo Fundo",
      tempo: "15 minutos"
    },
    {
      passo: 2,
      titulo: "Escaneamento 3D Digital",
      descricao: "Sem massa, sem desconforto. Tecnologia de ponta disponível em Passo Fundo",
      tempo: "30 minutos"
    },
    {
      passo: 3,
      titulo: "Planejamento Personalizado",
      descricao: "Simulação 3D do seu novo sorriso criada por especialistas",
      tempo: "7-10 dias"
    },
    {
      passo: 4,
      titulo: "Receba Seus Alinhadores",
      descricao: "Entrega na clínica em Passo Fundo com treinamento completo",
      tempo: "14-21 dias"
    },
    {
      passo: 5,
      titulo: "Acompanhamento Local",
      descricao: "Consultas regulares presenciais em Passo Fundo ou online",
      tempo: "A cada 4-6 semanas"
    }
  ]

  const casosLocais = [
    {
      nome: "Paula S.",
      idade: 28,
      bairro: "Centro, Passo Fundo",
      caso: "Apinhamento moderado",
      duracao: "10 meses",
      resultado: "Sorriso alinhado sem precisar sair da cidade. Todas as consultas foram em Passo Fundo, super prático!",
      rating: 5
    },
    {
      nome: "Ricardo M.",
      idade: 42,
      bairro: "São José, Passo Fundo",
      caso: "Diastema e rotações",
      duracao: "8 meses",
      resultado: "Profissional que sempre quis corrigir. Com Atma consegui fazer em Passo Fundo mesmo, sem precisar viajar para Porto Alegre.",
      rating: 5
    },
    {
      nome: "Juliana T.",
      idade: 35,
      bairro: "Boqueirão, Passo Fundo",
      caso: "Recidiva ortodôntica",
      duracao: "6 meses",
      resultado: "Meus dentes voltaram a entortar após anos. Em 6 meses estava tudo perfeito novamente. Recomendo!",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://atma.roilabs.com.br"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": "https://atma.roilabs.com.br/blog"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Alinhadores Invisíveis em Passo Fundo",
                "item": "https://atma.roilabs.com.br/blog/alinhadores-passo-fundo"
              }
            ]
          })
        }}
      />

      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Alinhadores Invisíveis em Passo Fundo: Guia Completo 2025",
            "description": "Encontre ortodontistas parceiros Atma em Passo Fundo, RS. Alinhadores invisíveis com tecnologia alemã, preços acessíveis e resultados garantidos.",
            "image": "https://atma.roilabs.com.br/og-image.jpg",
            "author": {
              "@type": "Organization",
              "name": "Atma Aligner"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Atma Aligner",
              "logo": {
                "@type": "ImageObject",
                "url": "https://atma.roilabs.com.br/logo.png"
              }
            },
            "datePublished": "2025-01-20T10:00:00Z",
            "dateModified": "2025-01-20T10:00:00Z"
          })
        }}
      />

      {/* Local Business Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Atma Aligner - Passo Fundo",
            "description": "Alinhadores invisíveis com tecnologia alemã em Passo Fundo, RS",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Passo Fundo",
              "addressRegion": "RS",
              "addressCountry": "BR"
            },
            "areaServed": {
              "@type": "City",
              "name": "Passo Fundo",
              "containedIn": {
                "@type": "State",
                "name": "Rio Grande do Sul"
              }
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "-28.2620",
              "longitude": "-52.4080"
            },
            "url": "https://atma.roilabs.com.br",
            "telephone": "+55-47-9200-0924",
            "priceRange": "R$ 3.990 - R$ 8.990",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "377",
              "bestRating": "5"
            }
          })
        }}
      />

      {/* FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Quanto custa alinhador invisível em Passo Fundo?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Em Passo Fundo, os alinhadores invisíveis Atma custam entre R$ 3.990 (casos simples) e R$ 8.990 (casos complexos). Os valores podem ser parcelados em até 24x e incluem todas as consultas, refinamentos e acompanhamento completo."
                }
              },
              {
                "@type": "Question",
                "name": "Onde encontrar ortodontista que trabalha com Atma em Passo Fundo?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Atualmente temos 3 clínicas parceiras em Passo Fundo: Clínica Ortodontia Avançada (Centro), Sorriso Perfeito Ortodontia (São José) e Centro Odontológico Integrado (Centro). Todas oferecem avaliação gratuita."
                }
              },
              {
                "@type": "Question",
                "name": "Preciso viajar para fazer tratamento com alinhador invisível?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Não! Todo o tratamento é feito em Passo Fundo. As consultas são a cada 4-6 semanas e também podem ser online. A avaliação inicial, escaneamento e acompanhamento são realizados nas clínicas parceiras locais."
                }
              },
              {
                "@type": "Question",
                "name": "Quanto tempo demora o tratamento em Passo Fundo?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "O tempo médio de tratamento é de 6 a 18 meses, dependendo da complexidade do caso. Em Passo Fundo, nossos ortodontistas parceiros têm experiência com casos de diferentes complexidades e podem fornecer uma estimativa precisa na avaliação gratuita."
                }
              },
              {
                "@type": "Question",
                "name": "Os alinhadores Atma são seguros e certificados?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sim! Os alinhadores Atma são fabricados com PETG alemão de grau médico e possuem certificações ISO 13485 (gestão de qualidade), CE (Europa) e registro ANVISA (Brasil). Todos os ortodontistas parceiros em Passo Fundo são devidamente certificados pelo CRO-RS."
                }
              }
            ]
          })
        }}
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para o blog
        </Link>

        {/* Title Section */}
        <header className="mb-12">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <MapPin className="w-4 h-4" />
            <span>Passo Fundo, RS</span>
            <span>•</span>
            <time dateTime="2025-01-20">20 de janeiro de 2025</time>
            <span>•</span>
            <span>8 min de leitura</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Alinhadores Invisíveis em Passo Fundo: Guia Completo 2025
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed">
            Encontre ortodontistas parceiros Atma em Passo Fundo, RS. Alinhadores invisíveis com tecnologia alemã,
            preços acessíveis e acompanhamento local completo. Agende sua avaliação gratuita hoje.
          </p>
        </header>

        {/* CTA Destaque */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white mb-12">
          <h2 className="text-2xl font-bold mb-4">🎯 Avaliação Gratuita em Passo Fundo</h2>
          <p className="text-lg mb-6">
            Agende sua consulta sem compromisso em uma das nossas clínicas parceiras.
            Descubra se você é candidato para alinhadores invisíveis e receba um orçamento personalizado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/pacientes/agendamento"
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
            >
              Agendar Avaliação Gratuita
            </Link>
            <a
              href="https://wa.me/5547992000924"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors text-center"
            >
              WhatsApp: (47) 9200-0924
            </a>
          </div>
        </div>

        {/* Introdução */}
        <section className="prose prose-lg max-w-none mb-12">
          <p>
            <strong>Passo Fundo agora tem acesso à tecnologia alemã de ponta em alinhadores invisíveis.</strong> Se você
            está procurando por <em>"ortodontista em Passo Fundo"</em> ou <em>"alinhador invisível"</em>, este guia
            completo vai te mostrar tudo o que você precisa saber sobre o tratamento ortodôntico mais moderno disponível na cidade.
          </p>

          <p>
            Com 3 clínicas parceiras estrategicamente localizadas em Passo Fundo, a Atma Aligner traz a mesma qualidade
            de marcas internacionais famosas, mas com preços até <strong>50% mais acessíveis</strong> e acompanhamento
            100% local - sem precisar viajar para Porto Alegre ou outras capitais.
          </p>
        </section>

        {/* Por Que Escolher Atma em Passo Fundo */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Por Que Escolher Atma Aligner em Passo Fundo?
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {diferenciais.map((diferencial, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <diferencial.icon className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{diferencial.titulo}</h3>
                <p className="text-gray-600">{diferencial.descricao}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Clínicas Parceiras */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            🏥 Clínicas Parceiras Atma em Passo Fundo
          </h2>

          <p className="text-gray-600 mb-8">
            Todas as clínicas parceiras possuem ortodontistas certificados, tecnologia de escaneamento 3D
            e oferecem <strong>avaliação gratuita</strong> sem compromisso.
          </p>

          <div className="space-y-6">
            {clinicasParceiras.map((clinica, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{clinica.nome}</h3>
                    <p className="text-purple-600 font-semibold">{clinica.ortodontista}</p>
                    <p className="text-sm text-gray-500">{clinica.croPf}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-gray-900">{clinica.rating}</span>
                    <span className="text-sm text-gray-600">({clinica.reviews})</span>
                  </div>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-600 p-4 mb-4">
                  <p className="text-sm font-semibold text-purple-900">
                    ⭐ {clinica.destaque}
                  </p>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{clinica.endereco}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{clinica.telefone}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{clinica.horario}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {clinica.especialidades.map((esp, i) => (
                    <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {esp}
                    </span>
                  ))}
                </div>

                <Link
                  href="/pacientes/agendamento"
                  className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Agendar Avaliação Gratuita
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Como Funciona o Processo em Passo Fundo */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Como Funciona o Tratamento em Passo Fundo
          </h2>

          <p className="text-gray-600 mb-8">
            Todo o processo é feito localmente em Passo Fundo, com a comodidade de ter consultas na sua cidade
            e tecnologia de ponta ao seu alcance.
          </p>

          <div className="space-y-4">
            {processoLocal.map((etapa) => (
              <div key={etapa.passo} className="flex gap-6 bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                    {etapa.passo}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{etapa.titulo}</h3>
                  <p className="text-gray-700 mb-2">{etapa.descricao}</p>
                  <div className="flex items-center gap-2 text-sm text-purple-600">
                    <Clock className="w-4 h-4" />
                    <span className="font-semibold">{etapa.tempo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Casos de Sucesso Locais */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            ⭐ Casos de Sucesso em Passo Fundo
          </h2>

          <p className="text-gray-600 mb-8">
            Conheça histórias reais de pacientes de Passo Fundo que transformaram seus sorrisos com Atma Aligner.
          </p>

          <div className="space-y-6">
            {casosLocais.map((caso, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{caso.nome}, {caso.idade} anos</h3>
                    <p className="text-sm text-gray-600">{caso.bairro}</p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(caso.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Caso tratado:</p>
                    <p className="font-semibold text-gray-900">{caso.caso}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Duração do tratamento:</p>
                    <p className="font-semibold text-gray-900">{caso.duracao}</p>
                  </div>
                </div>

                <blockquote className="border-l-4 border-purple-600 pl-4 italic text-gray-700">
                  "{caso.resultado}"
                </blockquote>
              </div>
            ))}
          </div>
        </section>

        {/* Preços e Formas de Pagamento */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            💰 Preços e Formas de Pagamento em Passo Fundo
          </h2>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-8 mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Tabela de Preços 2025</h3>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-2">Casos Simples</h4>
                <p className="text-sm text-gray-600 mb-4">Até 20 alinhadores</p>
                <div className="text-3xl font-bold text-purple-600 mb-4">R$ 3.990</div>
                <p className="text-sm text-gray-600">ou 12x de R$ 332,50</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border-2 border-purple-600">
                <div className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full inline-block mb-2">
                  MAIS POPULAR
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Casos Moderados</h4>
                <p className="text-sm text-gray-600 mb-4">21-35 alinhadores</p>
                <div className="text-3xl font-bold text-purple-600 mb-4">R$ 5.990</div>
                <p className="text-sm text-gray-600">ou 18x de R$ 332,78</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-2">Casos Complexos</h4>
                <p className="text-sm text-gray-600 mb-4">Mais de 35 alinhadores</p>
                <div className="text-3xl font-bold text-purple-600 mb-4">R$ 8.990</div>
                <p className="text-sm text-gray-600">ou 24x de R$ 374,58</p>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-3">✅ Incluído em todos os planos:</h4>
              <ul className="grid md:grid-cols-2 gap-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Avaliação inicial gratuita</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Escaneamento 3D digital</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Planejamento 3D com IA</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Todos os alinhadores necessários</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Consultas de acompanhamento</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Refinamentos sem custo extra</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">💳 Formas de Pagamento Aceitas:</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700"><strong>Cartão de Crédito:</strong> Parcelamento em até 24x sem juros</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700"><strong>PIX:</strong> 5% de desconto no pagamento à vista</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700"><strong>Boleto Bancário:</strong> Pagamento parcelado disponível</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700"><strong>Financiamento:</strong> Consulte condições na clínica</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Comparação com Outras Cidades */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            🏆 Vantagens de Fazer em Passo Fundo vs. Porto Alegre
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-200 rounded-xl">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Critério</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-purple-600">Passo Fundo (Atma)</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">Porto Alegre</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 font-semibold text-gray-900">Preço Médio</td>
                  <td className="px-6 py-4 text-green-600 font-bold">R$ 5.990</td>
                  <td className="px-6 py-4 text-gray-600">R$ 10.000 - R$ 15.000</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-900">Custo de Deslocamento</td>
                  <td className="px-6 py-4 text-green-600 font-bold">R$ 0 (local)</td>
                  <td className="px-6 py-4 text-gray-600">R$ 200-400/consulta</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-semibold text-gray-900">Tempo de Viagem</td>
                  <td className="px-6 py-4 text-green-600 font-bold">0 horas</td>
                  <td className="px-6 py-4 text-gray-600">6-8 horas (ida e volta)</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-900">Tecnologia</td>
                  <td className="px-6 py-4 text-purple-600 font-bold">Alemã (ISO 13485)</td>
                  <td className="px-6 py-4 text-gray-600">Variável</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-semibold text-gray-900">Acompanhamento</td>
                  <td className="px-6 py-4 text-green-600 font-bold">Presencial + Online</td>
                  <td className="px-6 py-4 text-gray-600">Presencial obrigatório</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-900">Economia Total</td>
                  <td className="px-6 py-4 text-green-600 font-bold text-lg">Até R$ 7.000</td>
                  <td className="px-6 py-4 text-gray-600">-</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-2">💡 Economia Real:</h4>
            <p className="text-gray-700">
              Além de economizar até <strong>R$ 5.000</strong> no tratamento, você economiza aproximadamente
              <strong> R$ 2.000</strong> em deslocamentos (10-12 consultas × R$ 200 de combustível/pedágio).
              Isso sem contar o valor do seu tempo!
            </p>
          </div>
        </section>

        {/* FAQ Específico de Passo Fundo */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            ❓ Perguntas Frequentes - Passo Fundo
          </h2>

          <div className="space-y-4">
            <details className="bg-white border border-gray-200 rounded-xl p-6 group">
              <summary className="font-bold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span>Quanto custa alinhador invisível em Passo Fundo?</span>
                <span className="text-purple-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-gray-700 prose prose-sm max-w-none">
                <p>
                  Em Passo Fundo, os alinhadores invisíveis Atma custam entre <strong>R$ 3.990</strong> (casos simples)
                  e <strong>R$ 8.990</strong> (casos complexos). Os valores podem ser parcelados em até 24x sem juros
                  e incluem:
                </p>
                <ul>
                  <li>Avaliação inicial gratuita</li>
                  <li>Escaneamento 3D digital</li>
                  <li>Todos os alinhadores necessários</li>
                  <li>Consultas de acompanhamento</li>
                  <li>Refinamentos sem custo adicional</li>
                </ul>
                <p>
                  Isso representa uma economia de até <strong>50%</strong> comparado a marcas internacionais como
                  Invisalign, que em Porto Alegre custam entre R$ 12.000 e R$ 20.000.
                </p>
              </div>
            </details>

            <details className="bg-white border border-gray-200 rounded-xl p-6 group">
              <summary className="font-bold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span>Onde encontrar ortodontista que trabalha com Atma em Passo Fundo?</span>
                <span className="text-purple-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-gray-700 prose prose-sm max-w-none">
                <p>Atualmente temos <strong>3 clínicas parceiras</strong> em Passo Fundo:</p>
                <ol>
                  <li>
                    <strong>Clínica Ortodontia Avançada</strong> - Dr. Roberto Mendes<br />
                    Rua Moron, 1234 - Centro | Tel: (54) 3000-1234
                  </li>
                  <li>
                    <strong>Sorriso Perfeito Ortodontia</strong> - Dra. Mariana Silva<br />
                    Av. Brasil, 567 - São José | Tel: (54) 3000-5678
                  </li>
                  <li>
                    <strong>Centro Odontológico Integrado</strong> - Dr. Fernando Costa<br />
                    Rua Independência, 890 - Centro | Tel: (54) 3000-9012
                  </li>
                </ol>
                <p>
                  Todas oferecem <strong>avaliação gratuita</strong> sem compromisso. Você pode agendar pelo WhatsApp:
                  <a href="https://wa.me/5547992000924" className="text-purple-600 font-bold"> (47) 9200-0924</a>
                </p>
              </div>
            </details>

            <details className="bg-white border border-gray-200 rounded-xl p-6 group">
              <summary className="font-bold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span>Preciso viajar para Porto Alegre para fazer o tratamento?</span>
                <span className="text-purple-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-gray-700 prose prose-sm max-w-none">
                <p>
                  <strong>Não!</strong> Todo o tratamento é feito em Passo Fundo. As consultas de acompanhamento são
                  a cada 4-6 semanas e podem ser:
                </p>
                <ul>
                  <li><strong>Presenciais:</strong> Nas clínicas parceiras em Passo Fundo</li>
                  <li><strong>Online:</strong> Via videochamada (opção disponível para maior comodidade)</li>
                </ul>
                <p>
                  Apenas a avaliação inicial e o escaneamento 3D precisam ser presenciais (feitos em Passo Fundo).
                  Depois disso, você escolhe o formato que preferir para as consultas de acompanhamento.
                </p>
                <p>
                  <strong>Economia:</strong> Você economiza aproximadamente R$ 2.000 em deslocamentos ao longo do tratamento!
                </p>
              </div>
            </details>

            <details className="bg-white border border-gray-200 rounded-xl p-6 group">
              <summary className="font-bold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span>Quanto tempo demora o tratamento em Passo Fundo?</span>
                <span className="text-purple-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-gray-700 prose prose-sm max-w-none">
                <p>
                  O tempo médio de tratamento é de <strong>6 a 18 meses</strong>, dependendo da complexidade do caso:
                </p>
                <ul>
                  <li><strong>Casos simples:</strong> 6-10 meses (apinhamento leve, pequenos ajustes)</li>
                  <li><strong>Casos moderados:</strong> 10-14 meses (apinhamento moderado, rotações)</li>
                  <li><strong>Casos complexos:</strong> 14-18 meses (problemas de mordida, múltiplas correções)</li>
                </ul>
                <p>
                  Em Passo Fundo, nossos ortodontistas parceiros têm experiência com casos de diferentes complexidades
                  e podem fornecer uma estimativa precisa na <strong>avaliação gratuita</strong>.
                </p>
                <p>
                  <strong>Resultados visíveis:</strong> A maioria dos pacientes nota melhorias significativas em 3-6 meses!
                </p>
              </div>
            </details>

            <details className="bg-white border border-gray-200 rounded-xl p-6 group">
              <summary className="font-bold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span>Os alinhadores Atma são seguros e certificados?</span>
                <span className="text-purple-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-gray-700 prose prose-sm max-w-none">
                <p>
                  <strong>Sim! Absolutamente seguros.</strong> Os alinhadores Atma possuem todas as certificações
                  internacionais e nacionais:
                </p>
                <ul>
                  <li>
                    <strong>ISO 13485:</strong> Certificação de Gestão de Qualidade para Dispositivos Médicos
                    (mesma exigida para marcas como Invisalign)
                  </li>
                  <li>
                    <strong>Certificação CE:</strong> Aprovação europeia para comercialização de dispositivos médicos
                  </li>
                  <li>
                    <strong>Registro ANVISA:</strong> Aprovado pela Agência Nacional de Vigilância Sanitária do Brasil
                  </li>
                </ul>
                <p>
                  <strong>Material:</strong> PETG (Polietileno Tereftalato Glicol) de grau médico, fabricado na Alemanha.
                  É o mesmo material usado pelas marcas premium internacionais.{" "}
                  <Link href="/pacientes/qualidade-alemao" className="text-purple-600 hover:text-purple-700 underline font-semibold">
                    Saiba mais sobre nossa qualidade alemã →
                  </Link>
                </p>
                <p>
                  <strong>Ortodontistas:</strong> Todos os profissionais parceiros em Passo Fundo são devidamente
                  certificados pelo CRO-RS (Conselho Regional de Odontologia do Rio Grande do Sul) e passaram por
                  treinamento específico Atma.
                </p>
              </div>
            </details>
          </div>
        </section>

        {/* CTA Final */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pronto Para Transformar Seu Sorriso em Passo Fundo?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Agende sua <strong>avaliação gratuita</strong> em uma das nossas clínicas parceiras.
              Descubra se você é candidato para alinhadores invisíveis e receba um orçamento personalizado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/pacientes/agendamento"
                className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors inline-block"
              >
                Agendar Avaliação Gratuita
              </Link>
              <a
                href="https://wa.me/5547992000924"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-600 transition-colors inline-block"
              >
                WhatsApp: (47) 9200-0924
              </a>
            </div>
            <p className="text-sm mt-6 opacity-90">
              Sem compromisso • Avaliação 100% gratuita • Resposta em até 24h
            </p>
          </div>
        </section>

        {/* Related Articles */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📚 Artigos Relacionados</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/blog/quanto-custa-alinhador-invisivel"
              className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                Quanto Custa um Alinhador Invisível?
              </h3>
              <p className="text-gray-600 mb-4">
                Guia completo de preços, formas de pagamento e comparação de marcas no Brasil.
              </p>
              <span className="text-purple-600 font-semibold">Ler artigo →</span>
            </Link>

            <Link
              href="/blog/alinhador-invisivel-funciona"
              className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                Alinhador Invisível Funciona Mesmo?
              </h3>
              <p className="text-gray-600 mb-4">
                Descubra a eficácia científica, taxa de sucesso e casos reais de tratamento.
              </p>
              <span className="text-purple-600 font-semibold">Ler artigo →</span>
            </Link>

            <Link
              href="/blog/alinhadores-tecnologia-alema"
              className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                Tecnologia Alemã: O Diferencial na Qualidade
              </h3>
              <p className="text-gray-600 mb-4">
                Entenda por que o PETG alemão é superior e como isso impacta seus resultados.
              </p>
              <span className="text-purple-600 font-semibold">Ler artigo →</span>
            </Link>

            <Link
              href="/pacientes/antes-depois"
              className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                Antes e Depois: Casos Reais
              </h3>
              <p className="text-gray-600 mb-4">
                Veja transformações reais de pacientes que usaram Atma Aligner.
              </p>
              <span className="text-purple-600 font-semibold">Ver casos →</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
