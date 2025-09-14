import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Calendar, User, ArrowRight } from "lucide-react"

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: "Os Benefícios do Alinhador Invisível para Adultos",
      excerpt: "Descubra por que cada vez mais adultos estão escolhendo alinhadores invisíveis para corrigir seus sorrisos.",
      date: "2024-01-15",
      author: "Dr. Ana Silva",
      category: "Tratamento"
    },
    {
      id: 2,
      title: "Como Funciona a Tecnologia 3D na Ortodontia",
      excerpt: "Entenda como a impressão 3D revolucionou os tratamentos ortodônticos e tornou os alinhadores mais precisos.",
      date: "2024-01-10",
      author: "Dr. Carlos Santos",
      category: "Tecnologia"
    },
    {
      id: 3,
      title: "Cuidados Essenciais com seu Alinhador",
      excerpt: "Dicas importantes para manter seu alinhador limpo e garantir a eficácia do tratamento.",
      date: "2024-01-05",
      author: "Dra. Maria Oliveira",
      category: "Cuidados"
    }
  ]

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
                    <span>15 Jan 2024</span>
                  </div>
                </div>
                <h2 className="text-2xl font-heading font-bold mb-4">
                  O Futuro da Ortodontia: Como a IA está Transformando Tratamentos
                </h2>
                <p className="text-muted-foreground mb-6">
                  Explore como a inteligência artificial está revolucionando o planejamento ortodôntico,
                  tornando os tratamentos mais precisos e previsíveis.
                </p>
                <Button asChild>
                  <Link href="/blog/futuro-ortodontia-ia">
                    Ler artigo completo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {posts.map((post) => (
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
                    <User className="h-4 w-4 mr-1" />
                    <span>{post.author}</span>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/blog/${post.id}`}>
                      Ler mais
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Categories */}
        <div className="text-center">
          <h2 className="text-2xl font-heading font-bold mb-8">Explore por Categoria</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {["Tratamento", "Tecnologia", "Cuidados", "Resultados", "Dicas"].map((category) => (
              <Button key={category} asChild variant="outline">
                <Link href={`/blog/categoria/${category.toLowerCase()}`}>
                  {category}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}