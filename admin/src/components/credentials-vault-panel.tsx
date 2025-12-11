'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Key,
  RefreshCw,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
  TrendingUp,
} from 'lucide-react'
import type { Credential, CredentialAccessLog, CredentialType, CredentialStatus } from '@/lib/credentials-vault'

interface CredentialsVaultPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CredentialsVaultPanel({ open, onOpenChange }: CredentialsVaultPanelProps) {
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [expiringCredentials, setExpiringCredentials] = useState<Credential[]>([])
  const [needsRotation, setNeedsRotation] = useState<Credential[]>([])
  const [accessLogs, setAccessLogs] = useState<CredentialAccessLog[]>([])
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null)
  const [loading, setLoading] = useState(false)
  const [showData, setShowData] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState('credentials')
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Form state for creating/editing credentials
  const [formData, setFormData] = useState({
    name: '',
    type: 'api_key' as CredentialType,
    description: '',
    apiKey: '',
    username: '',
    password: '',
    expiresAt: '',
    rotationIntervalDays: 90,
    tags: '',
  })

  useEffect(() => {
    if (open) {
      loadCredentials()
      loadExpiringCredentials()
      loadNeedsRotation()
      loadAccessLogs()
    }
  }, [open])

  const loadCredentials = async () => {
    try {
      const response = await fetch('/api/credentials?action=list')
      if (response.ok) {
        const data = await response.json()
        setCredentials(data.credentials)
      }
    } catch (error) {
      console.error('Failed to load credentials:', error)
    }
  }

  const loadExpiringCredentials = async () => {
    try {
      const response = await fetch('/api/credentials?action=expiring&daysAhead=30')
      if (response.ok) {
        const data = await response.json()
        setExpiringCredentials(data.credentials)
      }
    } catch (error) {
      console.error('Failed to load expiring credentials:', error)
    }
  }

  const loadNeedsRotation = async () => {
    try {
      const response = await fetch('/api/credentials?action=needs-rotation')
      if (response.ok) {
        const data = await response.json()
        setNeedsRotation(data.credentials)
      }
    } catch (error) {
      console.error('Failed to load credentials needing rotation:', error)
    }
  }

  const loadAccessLogs = async () => {
    try {
      const response = await fetch('/api/credentials?action=access-logs&limit=50')
      if (response.ok) {
        const data = await response.json()
        setAccessLogs(data.logs)
      }
    } catch (error) {
      console.error('Failed to load access logs:', error)
    }
  }

  const createCredential = async () => {
    setLoading(true)
    try {
      const data: Record<string, unknown> = {}

      if (formData.type === 'api_key') {
        data.apiKey = formData.apiKey
      } else if (formData.type === 'basic_auth') {
        data.username = formData.username
        data.password = formData.password
      }

      const response = await fetch('/api/credentials?action=create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          type: formData.type,
          description: formData.description,
          data,
          expiresAt: formData.expiresAt || undefined,
          rotationIntervalDays: formData.rotationIntervalDays,
          tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : undefined,
        }),
      })

      if (response.ok) {
        setShowCreateModal(false)
        setFormData({
          name: '',
          type: 'api_key',
          description: '',
          apiKey: '',
          username: '',
          password: '',
          expiresAt: '',
          rotationIntervalDays: 90,
          tags: '',
        })
        await loadCredentials()
      } else {
        const error = await response.json()
        alert(`Erro: ${error.message || 'Falha ao criar credencial'}`)
      }
    } catch (error) {
      console.error('Failed to create credential:', error)
      alert('Erro ao criar credencial')
    } finally {
      setLoading(false)
    }
  }

  const deleteCredential = async (credentialId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta credencial?')) return

    setLoading(true)
    try {
      const response = await fetch('/api/credentials?action=delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credentialId }),
      })

      if (response.ok) {
        await loadCredentials()
      } else {
        const error = await response.json()
        alert(`Erro: ${error.message || 'Falha ao excluir credencial'}`)
      }
    } catch (error) {
      console.error('Failed to delete credential:', error)
      alert('Erro ao excluir credencial')
    } finally {
      setLoading(false)
    }
  }

  const rotateCredential = async (credentialId: string) => {
    const newApiKey = prompt('Digite a nova API key:')
    if (!newApiKey) return

    setLoading(true)
    try {
      const response = await fetch('/api/credentials?action=rotate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credentialId,
          newData: { apiKey: newApiKey },
        }),
      })

      if (response.ok) {
        await loadCredentials()
        await loadNeedsRotation()
        alert('Credencial rotacionada com sucesso!')
      } else {
        const error = await response.json()
        alert(`Erro: ${error.message || 'Falha ao rotacionar credencial'}`)
      }
    } catch (error) {
      console.error('Failed to rotate credential:', error)
      alert('Erro ao rotacionar credencial')
    } finally {
      setLoading(false)
    }
  }

  const toggleShowData = (credentialId: string) => {
    setShowData(prev => ({ ...prev, [credentialId]: !prev[credentialId] }))
  }

  const getStatusIcon = (status: CredentialStatus) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'expired':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'revoked':
        return <XCircle className="h-4 w-4 text-gray-500" />
      case 'pending_rotation':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: CredentialStatus) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-200',
      expired: 'bg-red-100 text-red-800 border-red-200',
      revoked: 'bg-gray-100 text-gray-800 border-gray-200',
      pending_rotation: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    }
    return (
      <Badge variant="outline" className={colors[status]}>
        {getStatusIcon(status)}
        <span className="ml-1 capitalize">{status.replace('_', ' ')}</span>
      </Badge>
    )
  }

  const getTypeBadge = (type: CredentialType) => {
    const colors = {
      api_key: 'bg-blue-100 text-blue-800',
      basic_auth: 'bg-purple-100 text-purple-800',
      oauth2: 'bg-pink-100 text-pink-800',
      ssh_key: 'bg-indigo-100 text-indigo-800',
      database: 'bg-orange-100 text-orange-800',
      custom: 'bg-gray-100 text-gray-800',
    }
    return (
      <Badge className={colors[type]}>
        {type.replace('_', ' ').toUpperCase()}
      </Badge>
    )
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getDaysUntilExpiration = (expiresAt: Date) => {
    const days = Math.floor((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Vault de Credenciais
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button onClick={() => setShowCreateModal(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Nova Credencial
              </Button>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Shield className="h-4 w-4" />
              {credentials.length} credencial(is) armazenada(s)
            </div>
          </div>

          {/* Alerts */}
          {(expiringCredentials.length > 0 || needsRotation.length > 0) && (
            <div className="grid grid-cols-2 gap-4">
              {expiringCredentials.length > 0 && (
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      Expirando em Breve
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-700">
                      {expiringCredentials.length}
                    </div>
                    <div className="text-xs text-yellow-600">
                      credenciais expiram nos próximos 30 dias
                    </div>
                  </CardContent>
                </Card>
              )}

              {needsRotation.length > 0 && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-orange-600" />
                      Precisam Rotação
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-700">
                      {needsRotation.length}
                    </div>
                    <div className="text-xs text-orange-600">
                      credenciais passaram do período de rotação
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="credentials">
                Credenciais ({credentials.length})
              </TabsTrigger>
              <TabsTrigger value="alerts">
                Alertas ({expiringCredentials.length + needsRotation.length})
              </TabsTrigger>
              <TabsTrigger value="audit">
                Auditoria ({accessLogs.length})
              </TabsTrigger>
            </TabsList>

            {/* Credentials Tab */}
            <TabsContent value="credentials" className="space-y-3">
              {credentials.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="pt-6 text-center text-slate-500">
                    <Shield className="h-12 w-12 mx-auto mb-2 text-slate-400" />
                    <div>Nenhuma credencial armazenada</div>
                    <div className="text-sm">Clique em &quot;Nova Credencial&quot; para começar</div>
                  </CardContent>
                </Card>
              ) : (
                credentials.map(cred => (
                  <Card key={cred.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Key className="h-4 w-4" />
                            {cred.name}
                          </CardTitle>
                          {cred.description && (
                            <CardDescription className="mt-1">{cred.description}</CardDescription>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(cred.status)}
                          {getTypeBadge(cred.type)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-slate-500">Criado em</div>
                            <div>{formatDate(cred.createdAt)}</div>
                          </div>
                          {cred.lastRotatedAt && (
                            <div>
                              <div className="text-slate-500">Última rotação</div>
                              <div>{formatDate(cred.lastRotatedAt)}</div>
                            </div>
                          )}
                          {cred.expiresAt && (
                            <div>
                              <div className="text-slate-500">Expira em</div>
                              <div className="flex items-center gap-2">
                                {formatDate(cred.expiresAt)}
                                {getDaysUntilExpiration(cred.expiresAt) < 30 && (
                                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                    {getDaysUntilExpiration(cred.expiresAt)} dias
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                          {cred.usedByWorkflows && cred.usedByWorkflows.length > 0 && (
                            <div>
                              <div className="text-slate-500">Usado por</div>
                              <div>{cred.usedByWorkflows.length} workflow(s)</div>
                            </div>
                          )}
                        </div>

                        {cred.tags && cred.tags.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap">
                            {cred.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-2 pt-2 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleShowData(cred.id)}
                            className="gap-2"
                          >
                            {showData[cred.id] ? (
                              <>
                                <EyeOff className="h-3 w-3" />
                                Ocultar
                              </>
                            ) : (
                              <>
                                <Eye className="h-3 w-3" />
                                Visualizar
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => rotateCredential(cred.id)}
                            className="gap-2"
                            disabled={loading}
                          >
                            <RefreshCw className="h-3 w-3" />
                            Rotacionar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteCredential(cred.id)}
                            className="gap-2 text-red-600 hover:text-red-700"
                            disabled={loading}
                          >
                            <Trash2 className="h-3 w-3" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Alerts Tab */}
            <TabsContent value="alerts" className="space-y-4">
              {expiringCredentials.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Expirando nos próximos 30 dias
                  </h3>
                  <div className="space-y-2">
                    {expiringCredentials.map(cred => (
                      <Card key={cred.id} className="border-yellow-200">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{cred.name}</div>
                              <div className="text-sm text-slate-600">
                                Expira em {cred.expiresAt && getDaysUntilExpiration(cred.expiresAt)} dias
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => rotateCredential(cred.id)}
                            >
                              Renovar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {needsRotation.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Precisam de Rotação
                  </h3>
                  <div className="space-y-2">
                    {needsRotation.map(cred => (
                      <Card key={cred.id} className="border-orange-200">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{cred.name}</div>
                              <div className="text-sm text-slate-600">
                                Última rotação: {cred.lastRotatedAt && formatDate(cred.lastRotatedAt)}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => rotateCredential(cred.id)}
                            >
                              Rotacionar Agora
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {expiringCredentials.length === 0 && needsRotation.length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="pt-6 text-center text-slate-500">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
                    <div>Tudo em ordem!</div>
                    <div className="text-sm">Nenhuma credencial precisa de atenção</div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Audit Tab */}
            <TabsContent value="audit" className="space-y-3">
              {accessLogs.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="pt-6 text-center text-slate-500">
                    <Activity className="h-12 w-12 mx-auto mb-2 text-slate-400" />
                    <div>Nenhum log de acesso</div>
                  </CardContent>
                </Card>
              ) : (
                accessLogs.map(log => (
                  <Card key={log.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={log.success ? 'default' : 'destructive'}>
                              {log.action}
                            </Badge>
                            <span className="font-medium">{log.credentialName}</span>
                          </div>
                          <div className="text-sm text-slate-600 mt-1">
                            Por {log.userName} • {formatDate(log.timestamp)}
                          </div>
                          {!log.success && log.reason && (
                            <div className="text-sm text-red-600 mt-1">
                              Falha: {log.reason}
                            </div>
                          )}
                        </div>
                        {log.success ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="w-full max-w-md my-8">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Nova Credencial</CardTitle>
                  <CardDescription>Armazene credenciais de forma segura e criptografada</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Nome</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border rounded"
                      placeholder="Ex: API Slack Produção"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Tipo</label>
                    <select
                      value={formData.type}
                      onChange={e => setFormData({ ...formData, type: e.target.value as CredentialType })}
                      className="w-full mt-1 px-3 py-2 border rounded"
                    >
                      <option value="api_key">API Key</option>
                      <option value="basic_auth">Basic Auth</option>
                      <option value="oauth2">OAuth2</option>
                      <option value="ssh_key">SSH Key</option>
                      <option value="database">Database</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  {formData.type === 'api_key' && (
                    <div>
                      <label className="text-sm font-medium">API Key</label>
                      <input
                        type="password"
                        value={formData.apiKey}
                        onChange={e => setFormData({ ...formData, apiKey: e.target.value })}
                        className="w-full mt-1 px-3 py-2 border rounded"
                        placeholder="sk_live_..."
                      />
                    </div>
                  )}

                  {formData.type === 'basic_auth' && (
                    <>
                      <div>
                        <label className="text-sm font-medium">Username</label>
                        <input
                          type="text"
                          value={formData.username}
                          onChange={e => setFormData({ ...formData, username: e.target.value })}
                          className="w-full mt-1 px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Password</label>
                        <input
                          type="password"
                          value={formData.password}
                          onChange={e => setFormData({ ...formData, password: e.target.value })}
                          className="w-full mt-1 px-3 py-2 border rounded"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="text-sm font-medium">Descrição (opcional)</label>
                    <textarea
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border rounded"
                      rows={2}
                      placeholder="Para que serve esta credencial..."
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Tags (opcional)</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={e => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border rounded"
                      placeholder="slack, produção, crítica"
                    />
                    <div className="text-xs text-slate-500 mt-1">Separe múltiplas tags com vírgula</div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t">
                    <Button onClick={createCredential} disabled={loading} className="flex-1">
                      {loading ? 'Criando...' : 'Criar Credencial'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateModal(false)}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
