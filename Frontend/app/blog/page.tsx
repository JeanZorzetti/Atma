"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Calendar, Users, Star, CheckCircle } from "lucide-react"
import { useState, useMemo } from "react"

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("todos")

  const posts = [
    {
      id: "bruxismo-causas-sintomas-tratamento",
      title: "Bruxismo: Causas, Sintomas e Tratamento Completo 2025",
      excerpt: "Guia completo sobre bruxismo: o que é, causas, sintomas e tratamentos modernos. Descubra como alinhadores invisíveis podem tratar bruxismo.",
      date: "2025-10-24",
      author: "Dr. Rafael Martins",
      category: "Saúde Bucal"
    },
    {
      id: "alinhadores-vs-aparelho-fixo",
      title: "Alinhadores Invisíveis vs Aparelho Fixo: Qual Escolher em 2025?",
      excerpt: "Comparação completa entre alinhadores invisíveis e aparelho fixo tradicional. Descubra qual é a melhor opção para o seu caso.",
      date: "2025-01-15",
      author: "Dr. Rafael Martins",
      category: "Tratamento"
    },
    {
      id: "quanto-custa-alinhador-invisivel",
      title: "Quanto Custa Alinhador Invisível no Brasil? Guia Completo 2025",
      excerpt: "Preços atualizados de alinhadores invisíveis no Brasil. Compare marcas, formas de pagamento e descubra como economizar.",
      date: "2025-01-14",
      author: "Dra. Ana Silva",
      category: "Custos"
    },
    {
      id: "invisalign-vs-alinhadores-nacionais",
      title: "Invisalign vs Alinhadores Nacionais: Vale a Pena Pagar Mais?",
      excerpt: "Análise técnica completa comparando Invisalign e alinhadores nacionais. Tecnologia, preço e resultados lado a lado.",
      date: "2025-01-13",
      author: "Dr. Carlos Santos",
      category: "Comparações"
    },
    {
      id: "alinhador-invisivel-funciona",
      title: "Alinhador Invisível Funciona? Ciência, Resultados e Limitações",
      excerpt: "Estudos científicos, taxa de sucesso e casos reais. Descubra quando o alinhador invisível funciona e quando não funciona.",
      date: "2025-01-12",
      author: "Dr. Rafael Martins",
      category: "Eficácia"
    },
    {
      id: "10-mitos-aparelho-invisivel",
      title: "10 Mitos Sobre Aparelho Invisível Que Você Precisa Conhecer",
      excerpt: "Descubra a verdade por trás dos principais mitos sobre alinhadores invisíveis. Informações baseadas em evidências científicas.",
      date: "2025-01-11",
      author: "Dra. Maria Oliveira",
      category: "Dúvidas"
    },
    {
      id: "ortodontia-invisivel-adultos",
      title: "Ortodontia Invisível para Adultos: Tudo Que Você Precisa Saber",
      excerpt: "Guia completo de ortodontia invisível para adultos. Idade ideal, tempo de tratamento, custos e benefícios profissionais.",
      date: "2025-01-10",
      author: "Dr. Paulo Mendes",
      category: "Tratamento"
    },
    {
      id: "alinhadores-tecnologia-alema",
      title: "Alinhadores com Tecnologia Alemã: Diferença na Qualidade",
      excerpt: "Descubra por que a tecnologia alemã PETG faz toda diferença: certificações ISO 13485, CE, precisão de ±0.2mm e durabilidade 40% superior.",
      date: "2025-01-09",
      author: "Dr. Carlos Santos",
      category: "Tecnologia"
    },
    {
      id: "como-e-feito-molde-alinhador",
      title: "Passo a Passo: Como é Feito o Molde para Alinhador Invisível",
      excerpt: "Do escaneamento 3D digital até a entrega: veja todas as 8 etapas tecnológicas da fabricação de alinhadores invisíveis.",
      date: "2025-01-08",
      author: "Dra. Ana Silva",
      category: "Tecnologia"
    },
    {
      id: "roi-ortodontia-alinhadores",
      title: "ROI em Ortodontia: Como Alinhadores Aumentam Receita em 35%",
      excerpt: "Análise completa de ROI para ortodontistas. Casos reais mostram aumento de 35% na receita e retorno do investimento em 4-6 meses.",
      date: "2025-01-07",
      author: "Dr. Fernando Costa",
      category: "Parceria"
    },
    {
      id: "alinhadores-passo-fundo",
      title: "Alinhadores Invisíveis em Passo Fundo: Guia Completo 2025",
      excerpt: "Encontre ortodontistas parceiros Atma em Passo Fundo. Tecnologia alemã, preços acessíveis e acompanhamento 100% local.",
      date: "2025-01-06",
      author: "Dra. Mariana Silva",
      category: "Local"
    },
    {
      id: "futuro-ortodontia-ia",
      title: "O Futuro da Ortodontia: Como a IA está Transformando Tratamentos",
      excerpt: "Explore como a inteligência artificial está revolucionando o planejamento ortodôntico, tornando os tratamentos mais precisos e previsíveis.",
      date: "2024-01-15",
      author: "Dr. Rafael Martins",
      category: "Tecnologia"
    }
  ]

  const categories = ["todos", "Saúde Bucal", "Tratamento", "Comparações", "Custos", "Eficácia", "Dúvidas", "Tecnologia", "Parceria", "Local"]

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.author.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === "todos" || post.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory, posts])

  const featuredPost = posts.find(post => post.id === "bruxismo-causas-sintomas-tratamento")

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Blog Atma Aligner
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Conteúdo especializado sobre ortodontia, alinhadores invisíveis e saúde bucal
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <Card className="overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 bg-gradient-to-br from-primary/10 to-secondary/10 p-8 flex items-center justify-center">
                <div className="text-6xl font-bold text-primary opacity-20">BLOG</div>
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">Destaque</span>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{featuredPost?.date ? new Date(featuredPost.date).toLocaleDateString('pt-BR') : ''}</span>
                  </div>
                </div>
                <h2 className="text-2xl font-heading font-bold mb-4">
                  {featuredPost?.title}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {featuredPost?.excerpt}
                </p>
                <Button asChild>
                  <Link href={`/blog/${featuredPost?.id}`}>
                    Ler artigo completo
                    <Star className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-12">
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-6">
              <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Pesquisar artigos por título, conteúdo ou autor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>

            {/* Category Filters */}
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Filtrar por categoria:</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className="transition-all duration-200"
                  >
                    {category === "todos" ? "Todos os artigos" : category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground text-center">
            {filteredPosts.length === 0
              ? "Nenhum artigo encontrado para sua busca."
              : `${filteredPosts.length} ${filteredPosts.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}`
            }
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredPosts
            .filter(post => post.id !== featuredPost?.id) // Exclude featured post from grid
            .map((post) => (
            <Card key={post.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                  <span className="bg-secondary/10 text-secondary px-2 py-1 rounded text-xs">
                    {post.category}
                  </span>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{new Date(post.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{post.author}</span>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/blog/${post.id}`}>
                      Ler mais
                      <Star className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results Message */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Nenhum artigo encontrado</h3>
            <p className="text-muted-foreground mb-6">
              Tente ajustar sua busca ou escolher uma categoria diferente.
            </p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("todos")
              }}
              variant="outline"
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}