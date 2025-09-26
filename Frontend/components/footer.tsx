import Link from "next/link"
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import { FooterLogo } from "@/components/ui/logo"

export function Footer() {
  return (
    <footer className="bg-muted border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <FooterLogo />
            <p className="text-muted-foreground text-sm">
              Tecnologia de ponta para o seu sorriso. Acessibilidade para o seu bolso.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://www.facebook.com/people/Atma-Aligner/61581147385394/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.instagram.com/atma.aligner/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/company/atma-aligner/?viewAsMember=true"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Para Pacientes */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold">Para Pacientes</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/pacientes/tratamento"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  O Tratamento
                </Link>
              </li>
              <li>
                <Link
                  href="/pacientes/antes-depois"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Antes e Depois
                </Link>
              </li>
              <li>
                <Link href="/pacientes/precos" className="text-muted-foreground hover:text-primary transition-colors">
                  Preços e Financiamento
                </Link>
              </li>
              <li>
                <Link href="/pacientes/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  Perguntas Frequentes
                </Link>
              </li>
              <li>
                <Link
                  href="/pacientes/encontre-doutor"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Encontre um Doutor
                </Link>
              </li>
            </ul>
          </div>

          {/* Para Ortodontistas */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold">Para Ortodontistas</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/ortodontistas/modelos-parceria"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Modelos de Parceria
                </Link>
              </li>
              <li>
                <Link
                  href="/ortodontistas/tecnologia"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Nossa Tecnologia
                </Link>
              </li>
              <li>
                <Link
                  href="/ortodontistas/vantagens"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Vantagens Financeiras
                </Link>
              </li>
              <li>
                <Link
                  href="/ortodontistas/recursos"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Recursos Clínicos
                </Link>
              </li>
              <li>
                <Link
                  href="/ortodontistas/seja-parceiro"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Seja Parceiro
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold">Contato</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">contato@atmaalign.com.br</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">(11) 9999-9999</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-muted-foreground">São Paulo, SP</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Atma Aligner. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
