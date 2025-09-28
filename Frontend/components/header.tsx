"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HeaderLogo } from "@/components/ui/logo"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" role="banner">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center touch-target focus-enhanced" aria-label="Ir para página inicial da Atma Aligner">
            <HeaderLogo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Navegação principal">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors touch-target focus-enhanced" aria-label="Menu para pacientes" aria-expanded={false}>
                <span>Para Pacientes</span>
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/pacientes">Visão Geral</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/pacientes/tratamento">O Tratamento</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/pacientes/antes-depois">Antes e Depois</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/pacientes/precos">Preços e Financiamento</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/pacientes/faq">Perguntas Frequentes</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors touch-target focus-enhanced" aria-label="Menu para ortodontistas" aria-expanded={false}>
                <span>Para Ortodontistas</span>
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/ortodontistas">Visão Geral</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/ortodontistas/modelos-parceria">Modelos de Parceria</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/ortodontistas/tecnologia">Nossa Tecnologia</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/ortodontistas/vantagens">Vantagens Financeiras</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/sobre" className="text-foreground hover:text-primary transition-colors touch-target focus-enhanced">
              Sobre Nós
            </Link>
            <Link href="/blog" className="text-foreground hover:text-primary transition-colors touch-target focus-enhanced">
              Blog
            </Link>
            <Link href="/contato" className="text-foreground hover:text-primary transition-colors touch-target focus-enhanced">
              Contato
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button asChild variant="outline">
              <Link href="/pacientes/encontre-doutor">Encontre um Doutor</Link>
            </Button>
            <Button asChild>
              <Link href="/ortodontistas/seja-parceiro">Seja Parceiro</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden touch-target focus-enhanced"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div id="mobile-menu" className="md:hidden py-4 border-t" role="navigation" aria-label="Menu móvel">
            <nav className="flex flex-col space-y-4">
              <Link href="/pacientes" className="text-foreground hover:text-primary transition-colors">
                Para Pacientes
              </Link>
              <Link href="/ortodontistas" className="text-foreground hover:text-primary transition-colors">
                Para Ortodontistas
              </Link>
              <Link href="/sobre" className="text-foreground hover:text-primary transition-colors">
                Sobre Nós
              </Link>
              <Link href="/blog" className="text-foreground hover:text-primary transition-colors">
                Blog
              </Link>
              <Link href="/contato" className="text-foreground hover:text-primary transition-colors">
                Contato
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/pacientes/encontre-doutor">Encontre um Doutor</Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/ortodontistas/seja-parceiro">Seja Parceiro</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
