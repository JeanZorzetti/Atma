"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">A</span>
            </div>
            <span className="font-heading text-xl font-bold text-primary">Atma Aligner</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors">
                <span>Para Pacientes</span>
                <ChevronDown className="h-4 w-4" />
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
              <DropdownMenuTrigger className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors">
                <span>Para Ortodontistas</span>
                <ChevronDown className="h-4 w-4" />
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
                <DropdownMenuItem asChild>
                  <Link href="/ortodontistas/recursos">Recursos Clínicos</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/sobre" className="text-foreground hover:text-primary transition-colors">
              Sobre Nós
            </Link>
            <Link href="/blog" className="text-foreground hover:text-primary transition-colors">
              Blog
            </Link>
            <Link href="/contato" className="text-foreground hover:text-primary transition-colors">
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
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
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
