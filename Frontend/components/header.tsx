"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { AnimatedButton } from "@/components/ui/animated-button"
import { Menu, X, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HeaderLogo } from "@/components/ui/logo"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      role="banner"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="flex items-center touch-target focus-enhanced" aria-label="Ir para página inicial da Atma Aligner">
              <HeaderLogo />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav
            className="hidden md:flex items-center space-x-8"
            role="navigation"
            aria-label="Navegação principal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <DropdownMenu>
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <DropdownMenuTrigger className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors touch-target focus-enhanced" aria-label="Menu para pacientes" aria-expanded={false}>
                  <span>Para Pacientes</span>
                  <motion.div
                    animate={{ rotate: 0 }}
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  </motion.div>
                </DropdownMenuTrigger>
              </motion.div>
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
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <DropdownMenuTrigger className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors touch-target focus-enhanced" aria-label="Menu para ortodontistas" aria-expanded={false}>
                  <span>Para Ortodontistas</span>
                  <motion.div
                    animate={{ rotate: 0 }}
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  </motion.div>
                </DropdownMenuTrigger>
              </motion.div>
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

            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <Link href="/sobre" className="text-foreground hover:text-primary transition-colors touch-target focus-enhanced">
                Sobre Nós
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <Link href="/blog" className="text-foreground hover:text-primary transition-colors touch-target focus-enhanced">
                Blog
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <Link href="/contato" className="text-foreground hover:text-primary transition-colors touch-target focus-enhanced">
                Contato
              </Link>
            </motion.div>
          </motion.nav>

          <motion.div
            className="hidden md:flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <AnimatedButton variant="outline" onClick={() => window.location.href = '/pacientes/encontre-doutor'}>
              Encontre um Doutor
            </AnimatedButton>
            <AnimatedButton medical onClick={() => window.location.href = '/ortodontistas/seja-parceiro'}>
              Seja Parceiro
            </AnimatedButton>
          </motion.div>

          {/* Mobile menu button */}
          <motion.button
            className="md:hidden touch-target focus-enhanced"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-6 w-6" aria-hidden="true" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              id="mobile-menu"
              className="md:hidden py-4 border-t"
              role="navigation"
              aria-label="Menu móvel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <motion.nav
                className="flex flex-col space-y-4"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
                  }
                }}
                initial="hidden"
                animate="visible"
              >
                {[
                  { href: "/pacientes", label: "Para Pacientes" },
                  { href: "/ortodontistas", label: "Para Ortodontistas" },
                  { href: "/sobre", label: "Sobre Nós" },
                  { href: "/blog", label: "Blog" },
                  { href: "/contato", label: "Contato" }
                ].map((item, index) => (
                  <motion.div
                    key={item.href}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    whileHover={{ x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link href={item.href} className="text-foreground hover:text-primary transition-colors">
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  className="flex flex-col space-y-2 pt-4"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  transition={{ delay: 0.3 }}
                >
                  <AnimatedButton
                    variant="outline"
                    className="w-full"
                    onClick={() => window.location.href = '/pacientes/encontre-doutor'}
                  >
                    Encontre um Doutor
                  </AnimatedButton>
                  <AnimatedButton
                    medical
                    className="w-full"
                    onClick={() => window.location.href = '/ortodontistas/seja-parceiro'}
                  >
                    Seja Parceiro
                  </AnimatedButton>
                </motion.div>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
