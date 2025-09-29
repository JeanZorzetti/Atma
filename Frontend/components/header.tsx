"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { AnimatedButton } from "@/components/ui/animated-button"
import { Menu, X, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HeaderLogo } from "@/components/ui/logo"
import { VoiceSearchIcon } from "@/components/ui/voice-search-button"
import { useTouchGestures } from "@/hooks/use-touch-gestures"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSubMenuOpen, setIsSubMenuOpen] = useState<string | null>(null)

  // Touch gesture support for mobile navigation
  const { ref: mobileMenuRef } = useTouchGestures(
    {
      onSwipe: (gesture) => {
        if (gesture.direction === 'up' && isMenuOpen) {
          setIsMenuOpen(false)
        }
      },
      onTap: () => {
        // Close submenu when tapping outside
        if (isSubMenuOpen) {
          setIsSubMenuOpen(null)
        }
      }
    },
    { swipeThreshold: 50 }
  )

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
            <Link
              href="/pacientes/encontre-doutor"
              className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm"
            >
              Encontre um Doutor
            </Link>
            <Link
              href="/ortodontistas/seja-parceiro"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Seja Parceiro
            </Link>
          </motion.div>

          {/* Mobile menu button - Optimized for one-handed use */}
          <motion.button
            className="md:hidden touch-target focus-enhanced fixed right-4 top-4 z-50 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm shadow-lg border flex items-center justify-center sm:relative sm:right-auto sm:top-auto sm:w-auto sm:h-auto sm:rounded-none sm:bg-transparent sm:backdrop-blur-none sm:shadow-none sm:border-0"
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

        {/* Mobile Navigation - Redesigned for thumb accessibility */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              ref={mobileMenuRef}
              id="mobile-menu"
              className="md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-md overflow-y-auto"
              role="navigation"
              aria-label="Menu móvel"
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Safe area for one-handed use - content positioned in thumb reach */}
              <div className="pt-20 pb-8 px-4 min-h-full flex flex-col">
                <motion.nav
                  className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full"
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
                  {/* Main navigation items - Large touch targets */}
                  {[
                    {
                      href: "/pacientes",
                      label: "Para Pacientes",
                      submenu: [
                        { href: "/pacientes", label: "Visão Geral" },
                        { href: "/pacientes/encontre-doutor", label: "Encontre um Doutor" },
                        { href: "/pacientes/precos", label: "Preços" }
                      ]
                    },
                    {
                      href: "/ortodontistas",
                      label: "Para Ortodontistas",
                      submenu: [
                        { href: "/ortodontistas", label: "Visão Geral" },
                        { href: "/ortodontistas/seja-parceiro", label: "Seja Parceiro" },
                        { href: "/ortodontistas/tecnologia", label: "Tecnologia" }
                      ]
                    },
                    { href: "/sobre", label: "Sobre Nós" },
                    { href: "/blog", label: "Blog" },
                    { href: "/contato", label: "Contato" }
                  ].map((item) => (
                    <motion.div
                      key={item.href}
                      className="mb-4"
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0 }
                      }}
                    >
                      {item.submenu ? (
                        <div>
                          <motion.button
                            className="w-full text-left py-4 px-6 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors text-lg font-medium text-slate-900 flex items-center justify-between touch-target-large"
                            onClick={() => setIsSubMenuOpen(isSubMenuOpen === item.label ? null : item.label)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                          >
                            {item.label}
                            <motion.div
                              animate={{ rotate: isSubMenuOpen === item.label ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <ChevronDown className="h-5 w-5" />
                            </motion.div>
                          </motion.button>

                          <AnimatePresence>
                            {isSubMenuOpen === item.label && (
                              <motion.div
                                className="mt-2 ml-4 space-y-2"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                {item.submenu.map((subItem) => (
                                  <motion.div
                                    key={subItem.href}
                                    whileHover={{ x: 4 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <Link
                                      href={subItem.href}
                                      className="block py-3 px-4 rounded-xl hover:bg-blue-50 transition-colors text-slate-700 hover:text-blue-600 touch-target"
                                      onClick={() => setIsMenuOpen(false)}
                                    >
                                      {subItem.label}
                                    </Link>
                                  </motion.div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Link
                            href={item.href}
                            className="block w-full py-4 px-6 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors text-lg font-medium text-slate-900 touch-target-large"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {item.label}
                          </Link>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}

                  {/* CTA Buttons - Positioned for easy thumb access */}
                  <motion.div
                    className="mt-8 space-y-4"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link
                      href="/ortodontistas/seja-parceiro"
                      className="block w-full h-14 text-lg rounded-2xl touch-target-large bg-blue-600 text-white hover:bg-blue-700 transition-colors text-center flex items-center justify-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Seja Parceiro
                    </Link>
                    <Link
                      href="/pacientes/encontre-doutor"
                      className="block w-full h-14 text-lg rounded-2xl touch-target-large border border-slate-300 hover:bg-slate-50 transition-colors text-center flex items-center justify-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Encontre um Doutor
                    </Link>
                  </motion.div>
                </motion.nav>

                {/* Swipe indicator */}
                <div className="text-center pb-4">
                  <motion.div
                    className="inline-flex items-center text-xs text-slate-500 space-x-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="w-8 h-1 bg-slate-300 rounded-full" />
                    <span>Deslize para cima para fechar</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
