"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Mail } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implementar autenticação
    console.log("Login attempt:", { email, password })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white py-20">
      <div className="container mx-auto px-4 max-w-md">
        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-heading font-bold text-gray-900">
              Portal do Ortodontista
            </CardTitle>
            <p className="text-gray-600 mt-2">Acesse sua conta Atma</p>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-gray-600">Lembrar-me</span>
                </label>
                <Link href="/ortodontistas/recuperar-senha" className="text-emerald-600 hover:text-emerald-700">
                  Esqueci minha senha
                </Link>
              </div>

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" size="lg">
                Entrar
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">Ainda não é parceiro?</p>
              <Button variant="outline" className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50" asChild>
                <Link href="/ortodontistas/parceria">
                  Cadastre-se Agora
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6">
          Em caso de dúvidas, entre em contato:<br />
          <a href="mailto:suporte@atma.com.br" className="text-emerald-600 hover:underline">suporte@atma.com.br</a>
        </p>
      </div>
    </div>
  )
}
