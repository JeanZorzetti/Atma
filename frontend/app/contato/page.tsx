import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Clock, Star, Users } from "lucide-react"

export default function ContatoPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Fale Conosco
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Estamos aqui para esclarecer suas dúvidas e ajudar você a conquistar o sorriso dos seus sonhos
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Envie sua Mensagem
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input id="nome" placeholder="Seu nome completo" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" placeholder="seu@email.com" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input id="telefone" placeholder="(11) 99999-9999" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input id="cidade" placeholder="Sua cidade" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assunto">Assunto</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o assunto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paciente">Sou paciente interessado</SelectItem>
                      <SelectItem value="ortodontista">Sou ortodontista</SelectItem>
                      <SelectItem value="parceria">Quero ser parceiro</SelectItem>
                      <SelectItem value="suporte">Suporte técnico</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mensagem">Mensagem</Label>
                  <Textarea
                    id="mensagem"
                    placeholder="Conte-nos como podemos ajudar você..."
                    rows={5}
                  />
                </div>

                <Button className="w-full" size="lg">
                  Enviar Mensagem
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  Respondemos todas as mensagens em até 24 horas úteis
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Cards */}
            <div className="grid gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold mb-2">E-mail</h3>
                      <p className="text-muted-foreground">atma.aligner@gmail.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold mb-2">Telefone</h3>
                      <p className="text-muted-foreground">(47) 9200-0924</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold mb-2">Endereço</h3>
                      <p className="text-muted-foreground">Passo Fundo, RS</p>
                      <p className="text-muted-foreground">Brasil</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold mb-2">Horário de Atendimento</h3>
                      <p className="text-muted-foreground">Segunda a Sexta: 8h às 18h</p>
                      <p className="text-muted-foreground">Sábado: 8h às 12h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Precisa de Ajuda Imediata?
                </h3>
                <div className="space-y-3">
                  <Button asChild className="w-full" variant="outline">
                    <a href="https://wa.me/554792000924" target="_blank" rel="noopener noreferrer">
                      Falar no WhatsApp
                    </a>
                  </Button>
                  <Button asChild className="w-full">
                    <a href="/pacientes/encontre-doutor">
                      Encontrar Ortodontista
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Perguntas Frequentes</h2>
            <p className="text-muted-foreground">
              Encontre respostas rápidas para as dúvidas mais comuns
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Como funciona o processo de avaliação?</h3>
                <p className="text-muted-foreground text-sm">
                  Primeiro você agenda uma consulta com um ortodontista parceiro. Ele fará uma avaliação
                  completa e criará seu plano de tratamento personalizado.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Qual é o tempo médio de tratamento?</h3>
                <p className="text-muted-foreground text-sm">
                  O tempo varia de acordo com cada caso, mas a maioria dos tratamentos leva entre
                  6 a 18 meses para serem concluídos.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Posso parcelar o tratamento?</h3>
                <p className="text-muted-foreground text-sm">
                  Sim! Oferecemos diversas opções de parcelamento, incluindo parcelamento
                  sem juros em até 24 vezes.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">O alinhador é realmente invisível?</h3>
                <p className="text-muted-foreground text-sm">
                  Nossos alinhadores são feitos com material transparente de alta qualidade,
                  sendo praticamente imperceptíveis no dia a dia.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <a href="/pacientes/faq">
                Ver todas as perguntas frequentes
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}