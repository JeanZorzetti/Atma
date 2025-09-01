"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { 
  Settings, 
  Mail, 
  Bell, 
  Shield, 
  CreditCard,
  Users,
  Database,
  Save,
  Key,
  Globe,
  Smartphone,
  Loader2
} from 'lucide-react'
import { useSettings } from '@/hooks/useApi'

export default function ConfiguracoesPage() {
  const { data: settingsData, loading, error } = useSettings()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [autoBackup, setAutoBackup] = useState(true)

  // Extract settings from API response
  const settings = settingsData?.data?.settings || {}
  const companyName = settings.email_from_name?.value || 'Atma Aligner'
  const companyEmail = settings.email_from_address?.value || 'contato@atma.com.br'
  const adminEmail = settings.admin_email?.value || 'admin@atma.com.br'
  const maxDistance = settings.max_distance_km?.value || '50'
  const autoAssignmentEnabled = settings.auto_assignment_enabled?.value === 'true'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-2">Gerencie as configurações do sistema e preferências administrativas</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Informações da Empresa
                </CardTitle>
                <CardDescription>Configurações básicas da Atma Aligner</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Carregando configurações...</span>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Nome da Empresa</Label>
                      <Input id="company-name" defaultValue={companyName} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-email">Email Principal</Label>
                      <Input id="company-email" type="email" defaultValue={companyEmail} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Email do Administrador</Label>
                      <Input id="admin-email" type="email" defaultValue={adminEmail} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-phone">Telefone</Label>
                      <Input id="company-phone" defaultValue="(11) 3000-0000" placeholder="Ainda não configurado" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-address">Endereço</Label>
                      <Input id="company-address" defaultValue="São Paulo, SP" placeholder="Ainda não configurado" />
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Alterações
                    </Button>
                  </>
                )}
                {error && (
                  <p className="text-sm text-red-600">Erro ao carregar configurações: {error}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Configurações do Sistema
                </CardTitle>
                <CardDescription>Preferências gerais do sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Carregando...</span>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="max-distance">Distância Máxima (km)</Label>
                      <Input id="max-distance" type="number" defaultValue={maxDistance} />
                      <p className="text-sm text-gray-500">Distância máxima para busca de ortodontistas</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Atribuição Automática</Label>
                        <p className="text-sm text-gray-500">Atribuir leads automaticamente aos ortodontistas</p>
                      </div>
                      <Switch defaultChecked={autoAssignmentEnabled} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Fuso Horário</Label>
                      <Input id="timezone" defaultValue="America/Sao_Paulo" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Moeda</Label>
                      <Input id="currency" defaultValue="BRL (Real Brasileiro)" />
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Alterações
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Configurações de Notificação
              </CardTitle>
              <CardDescription>Configure como você deseja receber notificações do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <Label className="text-base font-medium">Notificações por Email</Label>
                    </div>
                    <p className="text-sm text-gray-500">Receba alertas importantes por email</p>
                  </div>
                  <Switch 
                    checked={emailNotifications} 
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      <Label className="text-base font-medium">Notificações por SMS</Label>
                    </div>
                    <p className="text-sm text-gray-500">Receba alertas críticos por SMS</p>
                  </div>
                  <Switch 
                    checked={smsNotifications} 
                    onCheckedChange={setSmsNotifications}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Tipos de Notificação</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Novos pacientes cadastrados</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Consultas agendadas/canceladas</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Pagamentos recebidos</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Relatórios semanais</Label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Alertas de sistema</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Save className="mr-2 h-4 w-4" />
                Salvar Preferências
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Segurança da Conta
                </CardTitle>
                <CardDescription>Configurações de segurança e acesso</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  <Key className="mr-2 h-4 w-4" />
                  Alterar Senha
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Controle de Acesso
                </CardTitle>
                <CardDescription>Gerencie permissões de usuários</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Autenticação em duas etapas</Label>
                    <p className="text-sm text-gray-500">Adicione uma camada extra de segurança</p>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Sessões múltiplas</Label>
                    <p className="text-sm text-gray-500">Permitir login em múltiplos dispositivos</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Tempo limite de sessão (minutos)</Label>
                  <Input defaultValue="120" type="number" />
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Configurações
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Integrações Ativas
              </CardTitle>
              <CardDescription>Conecte com serviços externos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Gateway de Pagamento</h3>
                    <Switch defaultChecked />
                  </div>
                  <p className="text-sm text-gray-500">Integração com Stripe/PagSeguro</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Configurar
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Email Marketing</h3>
                    <Switch />
                  </div>
                  <p className="text-sm text-gray-500">Integração com Mailchimp</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Configurar
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">WhatsApp Business</h3>
                    <Switch defaultChecked />
                  </div>
                  <p className="text-sm text-gray-500">Comunicação via WhatsApp</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Configurar
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Google Analytics</h3>
                    <Switch />
                  </div>
                  <p className="text-sm text-gray-500">Análise de dados</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Configurar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Backup e Recuperação
              </CardTitle>
              <CardDescription>Configure backups automáticos dos dados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Backup Automático</Label>
                  <p className="text-sm text-gray-500">Realize backups automáticos diariamente</p>
                </div>
                <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
              </div>

              {autoBackup && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                  <div className="space-y-2">
                    <Label>Horário do Backup</Label>
                    <Input type="time" defaultValue="02:00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Retenção (dias)</Label>
                    <Input type="number" defaultValue="30" />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="font-medium">Último Backup</h3>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-green-800 font-medium">Backup realizado com sucesso</p>
                  <p className="text-green-600 text-sm">20 de Janeiro de 2024 às 02:00</p>
                  <p className="text-green-600 text-sm">Tamanho: 2.3 GB</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Realizar Backup Agora
                </Button>
                <Button variant="outline" className="flex-1">
                  Restaurar Backup
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}