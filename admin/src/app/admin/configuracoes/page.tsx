"use client"

import { useState, useRef, useEffect } from 'react'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useSettings } from '@/hooks/useApi'
import { apiService } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

export default function ConfiguracoesPage() {
  const { data: settingsData, loading, error, refetch } = useSettings()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [autoBackup, setAutoBackup] = useState(true)
  const [notificationTypes, setNotificationTypes] = useState({
    newPatients: true,
    appointments: true,
    payments: true,
    weeklyReports: false,
    systemAlerts: true
  })
  const [saving, setSaving] = useState(false)
  const [integrations, setIntegrations] = useState({
    paymentGateway: true,
    emailMarketing: false, 
    whatsappBusiness: true,
    googleAnalytics: false
  })
  const [integrationModal, setIntegrationModal] = useState<string | null>(null)
  const [integrationSettings, setIntegrationSettings] = useState<{[key: string]: string}>({})
  const { toast } = useToast()
  
  // Form refs for general settings
  const generalFormRef = useRef<HTMLFormElement>(null)
  const systemFormRef = useRef<HTMLFormElement>(null)

  // Extract settings from API response
  const settings = settingsData?.data?.settings || {}

  // useEffect para sincronizar configurações de notificação com o backend
  useEffect(() => {
    if (settings) {
      // Mapear configurações de notificação do backend para o estado local
      const notificationTypeMapping = {
        'notification_type_new_patients': 'newPatients',
        'notification_type_appointments': 'appointments', 
        'notification_type_payments': 'payments',
        'notification_type_weekly_reports': 'weeklyReports',
        'notification_type_system_alerts': 'systemAlerts'
      }

      const updatedNotificationTypes = { ...notificationTypes }
      
      Object.entries(notificationTypeMapping).forEach(([backendKey, frontendKey]) => {
        if (settings[backendKey]) {
          updatedNotificationTypes[frontendKey as keyof typeof notificationTypes] = settings[backendKey].value === 'true'
        }
      })

      setNotificationTypes(updatedNotificationTypes)

      // Sincronizar integrações
      const integrationTypeMapping = {
        'integration_payment_gateway': 'paymentGateway',
        'integration_email_marketing': 'emailMarketing',
        'integration_whatsapp_business': 'whatsappBusiness',
        'integration_google_analytics': 'googleAnalytics'
      }

      const updatedIntegrations = { ...integrations }
      
      Object.entries(integrationTypeMapping).forEach(([backendKey, frontendKey]) => {
        if (settings[backendKey]) {
          updatedIntegrations[frontendKey as keyof typeof integrations] = settings[backendKey].value === 'true'
        }
      })

      setIntegrations(updatedIntegrations)

      // Sincronizar configurações de integração
      const gaSettings = {
        ga_tracking_id: settings.ga_tracking_id?.value || '',
        ga_measurement_id: settings.ga_measurement_id?.value || 'G-EMCS41DMSP',
        ga_api_secret: settings.ga_api_secret?.value || '',
        payment_gateway_provider: settings.payment_gateway_provider?.value || '',
        payment_gateway_key: settings.payment_gateway_key?.value || '',
        payment_gateway_secret: settings.payment_gateway_secret?.value || '',
        payment_gateway_webhook: settings.payment_gateway_webhook?.value || '',
        mailchimp_api_key: settings.mailchimp_api_key?.value || '',
        mailchimp_list_id: settings.mailchimp_list_id?.value || '',
        mailchimp_datacenter: settings.mailchimp_datacenter?.value || '',
        whatsapp_phone_id: settings.whatsapp_phone_id?.value || '',
        whatsapp_token: settings.whatsapp_token?.value || '',
        whatsapp_webhook_verify: settings.whatsapp_webhook_verify?.value || ''
      }
      setIntegrationSettings(gaSettings)

      // Sincronizar outros toggles
      if (settings.notification_email) {
        setEmailNotifications(settings.notification_email.value === 'true')
      }
      if (settings.notification_sms) {
        setSmsNotifications(settings.notification_sms.value === 'true')  
      }
      if (settings.auto_backup_enabled) {
        setAutoBackup(settings.auto_backup_enabled.value === 'true')
      }
    }
  }, [settings]) // eslint-disable-line react-hooks/exhaustive-deps
  const companyName = settings.email_from_name?.value || 'Atma Aligner'
  const companyEmail = settings.email_from_address?.value || 'contato@atma.com.br'
  const adminEmail = settings.admin_email?.value || 'admin@atma.com.br'
  const maxDistance = settings.max_distance_km?.value || '50'
  const autoAssignmentEnabled = settings.auto_assignment_enabled?.value === 'true'

  const handleSaveGeneralSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formData = new FormData(e.currentTarget)
      const companyNameValue = formData.get('company-name') as string
      const companyEmailValue = formData.get('company-email') as string
      const adminEmailValue = formData.get('admin-email') as string
      const companyPhoneValue = formData.get('company-phone') as string
      const companyAddressValue = formData.get('company-address') as string

      // Update multiple settings
      await Promise.all([
        apiService.updateSetting('email_from_name', companyNameValue, 'Nome da empresa usado nos emails'),
        apiService.updateSetting('email_from_address', companyEmailValue, 'Email principal da empresa'),
        apiService.updateSetting('admin_email', adminEmailValue, 'Email do administrador do sistema'),
        apiService.updateSetting('company_phone', companyPhoneValue, 'Telefone da empresa'),
        apiService.updateSetting('company_address', companyAddressValue, 'Endereço da empresa')
      ])

      toast({
        title: 'Configurações salvas!',
        description: 'As informações da empresa foram atualizadas com sucesso.',
      })

      refetch()
    } catch {
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar as configurações. Tente novamente.',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSystemSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formData = new FormData(e.currentTarget)
      const maxDistanceValue = formData.get('max-distance') as string
      const timezoneValue = formData.get('timezone') as string
      const currencyValue = formData.get('currency') as string

      await Promise.all([
        apiService.updateSetting('max_distance_km', maxDistanceValue, 'Distância máxima para busca de ortodontistas'),
        apiService.updateSetting('timezone', timezoneValue, 'Fuso horário do sistema'),
        apiService.updateSetting('currency', currencyValue, 'Moeda padrão do sistema')
      ])

      toast({
        title: 'Configurações salvas!',
        description: 'As configurações do sistema foram atualizadas com sucesso.',
      })

      refetch()
    } catch {
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar as configurações. Tente novamente.',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleToggleAutoAssignment = async (checked: boolean) => {
    try {
      await apiService.updateSetting('auto_assignment_enabled', checked.toString(), 'Habilitar atribuição automática de leads')
      toast({
        title: 'Configuração atualizada!',
        description: `Atribuição automática ${checked ? 'ativada' : 'desativada'}.`,
      })
      refetch()
    } catch {
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível alterar a configuração.',
        variant: 'destructive'
      })
    }
  }

  const handleNotificationToggle = async (type: string, checked: boolean) => {
    try {
      await apiService.updateSetting(`notification_${type}`, checked.toString(), `Notificações por ${type}`)
      
      if (type === 'email') setEmailNotifications(checked)
      if (type === 'sms') setSmsNotifications(checked)
      
      toast({
        title: 'Notificações atualizadas!',
        description: `Notificações por ${type} ${checked ? 'ativadas' : 'desativadas'}.`,
      })
      
      refetch()
    } catch {
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível alterar as notificações.',
        variant: 'destructive'
      })
    }
  }

  // Função para converter camelCase para snake_case
  const camelToSnakeCase = (str: string) => {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
  }

  const handleNotificationTypeToggle = async (type: string, checked: boolean) => {
    try {
      const snakeCaseType = camelToSnakeCase(type)
      await apiService.updateSetting(`notification_type_${snakeCaseType}`, checked.toString(), `Notificação de ${type}`)
      
      setNotificationTypes(prev => ({
        ...prev,
        [type]: checked
      }))
      
      toast({
        title: 'Preferência salva!',
        description: `Notificação de ${type} ${checked ? 'ativada' : 'desativada'}.`,
      })
      
      refetch()
    } catch {
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar a preferência.',
        variant: 'destructive'
      })
    }
  }

  const handleIntegrationToggle = async (type: string, checked: boolean) => {
    try {
      const snakeCaseType = camelToSnakeCase(type)
      await apiService.updateSetting(`integration_${snakeCaseType}`, checked.toString(), `Integração ${type}`)
      
      setIntegrations(prev => ({
        ...prev,
        [type]: checked
      }))
      
      toast({
        title: "Integração atualizada!",
        description: `${getIntegrationDisplayName(type)} ${checked ? 'ativada' : 'desativada'}.`
      })
      
      refetch()
    } catch {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível atualizar a integração.",
        variant: "destructive"
      })
    }
  }

  const getIntegrationDisplayName = (type: string) => {
    const names = {
      paymentGateway: 'Gateway de Pagamento',
      emailMarketing: 'Email Marketing',
      whatsappBusiness: 'WhatsApp Business', 
      googleAnalytics: 'Google Analytics'
    }
    return names[type as keyof typeof names] || type
  }

  const handleIntegrationConfig = (type: string) => {
    setIntegrationModal(type)
  }

  const isIntegrationConfigured = (type: string) => {
    const integrationConfigs: Record<string, { fields: { name: string }[] }> = {
      paymentGateway: {
        fields: [
          { name: 'payment_gateway_provider' },
          { name: 'payment_gateway_key' },
          { name: 'payment_gateway_secret' }
        ]
      },
      emailMarketing: {
        fields: [
          { name: 'mailchimp_api_key' },
          { name: 'mailchimp_list_id' }
        ]
      },
      whatsappBusiness: {
        fields: [
          { name: 'whatsapp_phone_id' },
          { name: 'whatsapp_token' }
        ]
      },
      googleAnalytics: {
        fields: [
          { name: 'ga_measurement_id' },
          { name: 'ga_tracking_id' }
        ]
      }
    }

    const config = integrationConfigs[type]
    if (!config) return false

    return config.fields.some(field => {
      const value = integrationSettings[field.name]
      return value && value.trim() !== ''
    })
  }

  const renderIntegrationModal = () => {
    if (!integrationModal) return null

    interface IntegrationField {
      name: string
      label: string
      type: string
      placeholder: string
      options?: string[]
    }

    const integrationConfigs: Record<string, { title: string, description: string, fields: IntegrationField[] }> = {
      paymentGateway: {
        title: 'Configurar Gateway de Pagamento',
        description: 'Configure as credenciais para Stripe ou PagSeguro',
        fields: [
          { name: 'payment_gateway_provider', label: 'Provedor', type: 'select', options: ['stripe', 'pagseguro'], placeholder: 'Selecione o provedor' },
          { name: 'payment_gateway_key', label: 'Chave Pública', type: 'text', placeholder: 'pk_test_...' },
          { name: 'payment_gateway_secret', label: 'Chave Secreta', type: 'password', placeholder: 'sk_test_...' },
          { name: 'payment_gateway_webhook', label: 'URL Webhook', type: 'text', placeholder: 'https://...' }
        ]
      },
      emailMarketing: {
        title: 'Configurar Email Marketing',
        description: 'Configure a integração com Mailchimp',
        fields: [
          { name: 'mailchimp_api_key', label: 'API Key Mailchimp', type: 'password', placeholder: 'Digite sua API Key' },
          { name: 'mailchimp_list_id', label: 'ID da Lista', type: 'text', placeholder: 'ID da lista padrão' },
          { name: 'mailchimp_datacenter', label: 'Datacenter', type: 'text', placeholder: 'us1, us2, etc.' }
        ]
      },
      whatsappBusiness: {
        title: 'Configurar WhatsApp Business',
        description: 'Configure a API do WhatsApp Business',
        fields: [
          { name: 'whatsapp_phone_id', label: 'Phone Number ID', type: 'text', placeholder: 'Seu Phone Number ID' },
          { name: 'whatsapp_token', label: 'Access Token', type: 'password', placeholder: 'Token de acesso' },
          { name: 'whatsapp_webhook_verify', label: 'Webhook Verify Token', type: 'password', placeholder: 'Token de verificação' }
        ]
      },
      googleAnalytics: {
        title: 'Configurar Google Analytics',
        description: 'Configure o tracking do Google Analytics',
        fields: [
          { name: 'ga_tracking_id', label: 'Tracking ID', type: 'text', placeholder: 'GA4-XXXXXXXXX-X' },
          { name: 'ga_measurement_id', label: 'Measurement ID', type: 'text', placeholder: 'G-XXXXXXXXXX' },
          { name: 'ga_api_secret', label: 'API Secret', type: 'password', placeholder: 'Chave secreta da API' }
        ]
      },
      googleAds: {
        title: 'Configurar Google Ads',
        description: 'Configure a API do Google Ads para importar dados de campanhas',
        fields: [
          { name: 'google_ads_customer_id', label: 'Customer ID', type: 'text', placeholder: '123-456-7890' },
          { name: 'google_ads_developer_token', label: 'Developer Token', type: 'password', placeholder: 'Token de desenvolvedor' },
          { name: 'google_ads_client_id', label: 'Client ID', type: 'text', placeholder: 'Client ID OAuth2' },
          { name: 'google_ads_client_secret', label: 'Client Secret', type: 'password', placeholder: 'Client Secret OAuth2' },
          { name: 'google_ads_refresh_token', label: 'Refresh Token', type: 'password', placeholder: 'Token de refresh' }
        ]
      },
      metaBusiness: {
        title: 'Configurar Meta Business',
        description: 'Configure a integração com Facebook e Instagram Ads',
        fields: [
          { name: 'meta_app_id', label: 'App ID', type: 'text', placeholder: 'ID da aplicação Meta' },
          { name: 'meta_app_secret', label: 'App Secret', type: 'password', placeholder: 'App Secret' },
          { name: 'meta_access_token', label: 'Access Token', type: 'password', placeholder: 'Token de acesso' },
          { name: 'meta_ad_account_id', label: 'Ad Account ID', type: 'text', placeholder: 'act_1234567890' },
          { name: 'meta_page_id', label: 'Page ID', type: 'text', placeholder: 'ID da página Facebook' }
        ]
      },
      hubspot: {
        title: 'Configurar HubSpot',
        description: 'Configure a integração com HubSpot CRM',
        fields: [
          { name: 'hubspot_api_key', label: 'API Key', type: 'password', placeholder: 'Chave de API do HubSpot' },
          { name: 'hubspot_portal_id', label: 'Portal ID', type: 'text', placeholder: 'ID do portal' },
          { name: 'hubspot_access_token', label: 'Access Token', type: 'password', placeholder: 'Token de acesso OAuth' }
        ]
      }
    }

    const config = integrationConfigs[integrationModal as keyof typeof integrationConfigs]
    
    return (
      <Dialog open={!!integrationModal} onOpenChange={() => setIntegrationModal(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{config.title}</DialogTitle>
            <DialogDescription>{config.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {config.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                {field.type === 'select' ? (
                  <select 
                    id={field.name}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={integrationSettings[field.name] || ''}
                    onChange={(e) => setIntegrationSettings(prev => ({
                      ...prev,
                      [field.name]: e.target.value
                    }))}
                  >
                    <option value="">{field.placeholder}</option>
                    {field.options?.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <Input
                    id={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={integrationSettings[field.name] || ''}
                    onChange={(e) => setIntegrationSettings(prev => ({
                      ...prev,
                      [field.name]: e.target.value
                    }))}
                  />
                )}
              </div>
            ))}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIntegrationModal(null)}>
                Cancelar
              </Button>
              <Button onClick={async () => {
                try {
                  setSaving(true)
                  
                  // Salvar todas as configurações da integração atual
                  const promises = config.fields.map(async (field) => {
                    const value = integrationSettings[field.name] || ''
                    if (value.trim()) {
                      return apiService.updateSetting(
                        field.name,
                        value,
                        `${config.title} - ${field.label}`
                      )
                    }
                    return Promise.resolve()
                  })
                  
                  await Promise.all(promises)
                  
                  toast({ 
                    title: "Configuração salva!", 
                    description: `${config.title} configurado com sucesso.` 
                  })
                  
                  refetch() // Recarregar dados
                  setIntegrationModal(null)
                } catch {
                  toast({
                    title: "Erro ao salvar configuração",
                    description: "Não foi possível salvar as configurações da integração.",
                    variant: "destructive"
                  })
                } finally {
                  setSaving(false)
                }
              }} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Configuração'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const handleAutoBackupToggle = async (checked: boolean) => {
    try {
      await apiService.updateSetting('auto_backup_enabled', checked.toString(), 'Backup automático habilitado')
      setAutoBackup(checked)
      
      toast({
        title: 'Backup configurado!',
        description: `Backup automático ${checked ? 'ativado' : 'desativado'}.`,
      })
      
      refetch()
    } catch {
      toast({
        title: 'Erro ao configurar',
        description: 'Não foi possível alterar a configuração de backup.',
        variant: 'destructive'
      })
    }
  }

  const handleRunBackup = async () => {
    try {
      setSaving(true)
      // Simular backup - em produção seria uma chamada real à API
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      toast({
        title: 'Backup realizado!',
        description: 'Backup manual executado com sucesso.',
      })
    } catch {
      toast({
        title: 'Erro no backup',
        description: 'Não foi possível realizar o backup.',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleRestoreBackup = async () => {
    try {
      setSaving(true)
      // Simular restore - em produção seria uma chamada real à API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: 'Restauração iniciada!',
        description: 'O processo de restauração foi iniciado.',
      })
    } catch {
      toast({
        title: 'Erro na restauração',
        description: 'Não foi possível restaurar o backup.',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

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
                  <form ref={generalFormRef} onSubmit={handleSaveGeneralSettings} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Nome da Empresa</Label>
                      <Input 
                        id="company-name" 
                        name="company-name"
                        defaultValue={companyName}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-email">Email Principal</Label>
                      <Input 
                        id="company-email" 
                        name="company-email"
                        type="email" 
                        defaultValue={companyEmail}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Email do Administrador</Label>
                      <Input 
                        id="admin-email" 
                        name="admin-email"
                        type="email" 
                        defaultValue={adminEmail}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-phone">Telefone</Label>
                      <Input 
                        id="company-phone" 
                        name="company-phone"
                        defaultValue={settings.company_phone?.value || "(11) 3000-0000"} 
                        placeholder="(11) 3000-0000" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-address">Endereço</Label>
                      <Input 
                        id="company-address" 
                        name="company-address"
                        defaultValue={settings.company_address?.value || "São Paulo, SP"} 
                        placeholder="São Paulo, SP" 
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={saving}
                    >
                      {saving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      {saving ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                  </form>
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
                    <form ref={systemFormRef} onSubmit={handleSaveSystemSettings} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="max-distance">Distância Máxima (km)</Label>
                        <Input 
                          id="max-distance" 
                          name="max-distance"
                          type="number" 
                          defaultValue={maxDistance}
                          min="1"
                          max="1000"
                          required
                        />
                        <p className="text-sm text-gray-500">Distância máxima para busca de ortodontistas</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Fuso Horário</Label>
                        <Input 
                          id="timezone" 
                          name="timezone"
                          defaultValue={settings.timezone?.value || "America/Sao_Paulo"}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency">Moeda</Label>
                        <Input 
                          id="currency" 
                          name="currency"
                          defaultValue={settings.currency?.value || "BRL (Real Brasileiro)"}
                          required
                        />
                      </div>
                      <Button 
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={saving}
                      >
                        {saving ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="mr-2 h-4 w-4" />
                        )}
                        {saving ? 'Salvando...' : 'Salvar Alterações'}
                      </Button>
                    </form>
                    
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Atribuição Automática</Label>
                          <p className="text-sm text-gray-500">Atribuir leads automaticamente aos ortodontistas</p>
                        </div>
                        <Switch 
                          checked={autoAssignmentEnabled} 
                          onCheckedChange={handleToggleAutoAssignment}
                          disabled={saving}
                        />
                      </div>
                    </div>
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
                    onCheckedChange={(checked) => handleNotificationToggle('email', checked)}
                    disabled={saving}
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
                    onCheckedChange={(checked) => handleNotificationToggle('sms', checked)}
                    disabled={saving}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Tipos de Notificação</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Novos pacientes cadastrados</Label>
                    <Switch 
                      checked={notificationTypes.newPatients}
                      onCheckedChange={(checked) => handleNotificationTypeToggle('newPatients', checked)}
                      disabled={saving}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Consultas agendadas/canceladas</Label>
                    <Switch 
                      checked={notificationTypes.appointments}
                      onCheckedChange={(checked) => handleNotificationTypeToggle('appointments', checked)}
                      disabled={saving}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Pagamentos recebidos</Label>
                    <Switch 
                      checked={notificationTypes.payments}
                      onCheckedChange={(checked) => handleNotificationTypeToggle('payments', checked)}
                      disabled={saving}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Relatórios semanais</Label>
                    <Switch 
                      checked={notificationTypes.weeklyReports}
                      onCheckedChange={(checked) => handleNotificationTypeToggle('weeklyReports', checked)}
                      disabled={saving}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Alertas de sistema</Label>
                    <Switch 
                      checked={notificationTypes.systemAlerts}
                      onCheckedChange={(checked) => handleNotificationTypeToggle('systemAlerts', checked)}
                      disabled={saving}
                    />
                  </div>
                </div>
              </div>

              <div className="text-center pt-4 text-sm text-gray-500">
                ✓ As alterações são salvas automaticamente
              </div>
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
                    <Switch 
                      checked={integrations.paymentGateway}
                      onCheckedChange={(checked) => handleIntegrationToggle('paymentGateway', checked)}
                      disabled={saving}
                    />
                  </div>
                  <p className="text-sm text-gray-500">Integração com Stripe/PagSeguro</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => handleIntegrationConfig('paymentGateway')}
                  >
                    Configurar
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Email Marketing</h3>
                    <Switch 
                      checked={integrations.emailMarketing}
                      onCheckedChange={(checked) => handleIntegrationToggle('emailMarketing', checked)}
                      disabled={saving}
                    />
                  </div>
                  <p className="text-sm text-gray-500">Integração com Mailchimp</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => handleIntegrationConfig('emailMarketing')}
                  >
                    Configurar
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">WhatsApp Business</h3>
                    <Switch 
                      checked={integrations.whatsappBusiness}
                      onCheckedChange={(checked) => handleIntegrationToggle('whatsappBusiness', checked)}
                      disabled={saving}
                    />
                  </div>
                  <p className="text-sm text-gray-500">Comunicação via WhatsApp</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => handleIntegrationConfig('whatsappBusiness')}
                  >
                    Configurar
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">Google Analytics</h3>
                      {isIntegrationConfigured('googleAnalytics') && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Configurado
                        </span>
                      )}
                    </div>
                    <Switch
                      checked={integrations.googleAnalytics}
                      onCheckedChange={(checked) => handleIntegrationToggle('googleAnalytics', checked)}
                      disabled={saving}
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Análise de dados
                    {isIntegrationConfigured('googleAnalytics') && (
                      <span className="ml-1 text-green-600">• ID: {integrationSettings.ga_measurement_id?.substring(0, 15)}...</span>
                    )}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleIntegrationConfig('googleAnalytics')}
                  >
                    {isIntegrationConfigured('googleAnalytics') ? 'Editar' : 'Configurar'}
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Google Ads</h3>
                    <Switch
                      checked={integrations.googleAds || false}
                      onCheckedChange={(checked) => handleIntegrationToggle('googleAds', checked)}
                      disabled={saving}
                    />
                  </div>
                  <p className="text-sm text-gray-500">Campanhas de publicidade no Google</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleIntegrationConfig('googleAds')}
                  >
                    Configurar
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Meta Business</h3>
                    <Switch
                      checked={integrations.metaBusiness || false}
                      onCheckedChange={(checked) => handleIntegrationToggle('metaBusiness', checked)}
                      disabled={saving}
                    />
                  </div>
                  <p className="text-sm text-gray-500">Facebook e Instagram Ads</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleIntegrationConfig('metaBusiness')}
                  >
                    Configurar
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">HubSpot</h3>
                    <Switch
                      checked={integrations.hubspot || false}
                      onCheckedChange={(checked) => handleIntegrationToggle('hubspot', checked)}
                      disabled={saving}
                    />
                  </div>
                  <p className="text-sm text-gray-500">CRM e automação de marketing</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleIntegrationConfig('hubspot')}
                  >
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
                <Switch 
                  checked={autoBackup} 
                  onCheckedChange={handleAutoBackupToggle}
                  disabled={saving}
                />
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
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={handleRunBackup}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Executando...
                    </>
                  ) : (
                    'Realizar Backup Agora'
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleRestoreBackup}
                  disabled={saving}
                >
                  {saving ? 'Aguarde...' : 'Restaurar Backup'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {renderIntegrationModal()}
    </div>
  )
}