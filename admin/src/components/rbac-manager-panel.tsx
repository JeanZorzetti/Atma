'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Users,
  Shield,
  Lock,
  Unlock,
  UserPlus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Activity,
  BarChart3,
} from 'lucide-react'
import type { User, RoleDefinition, AccessLog } from '@/lib/rbac'
import { Role } from '@/lib/rbac'

interface RBACManagerPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function RBACManagerPanel({ open, onOpenChange }: RBACManagerPanelProps) {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<RoleDefinition[]>([])
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([])
  const [stats, setStats] = useState<{
    totalAttempts: number
    granted: number
    denied: number
    uniqueUsers: number
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('users')
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Form state
  const [formData, setFormData] = useState<{
    id: string
    name: string
    email: string
    role: Role
  }>({
    id: '',
    name: '',
    email: '',
    role: Role.VIEWER,
  })

  useEffect(() => {
    if (open) {
      loadUsers()
      loadRoles()
      loadAccessLogs()
      loadStats()
    }
  }, [open])

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/rbac?action=users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Failed to load users:', error)
    }
  }

  const loadRoles = async () => {
    try {
      const response = await fetch('/api/rbac?action=roles')
      if (response.ok) {
        const data = await response.json()
        setRoles(data.roles)
      }
    } catch (error) {
      console.error('Failed to load roles:', error)
    }
  }

  const loadAccessLogs = async () => {
    try {
      const response = await fetch('/api/rbac?action=access-logs&limit=50')
      if (response.ok) {
        const data = await response.json()
        setAccessLogs(data.logs)
      }
    } catch (error) {
      console.error('Failed to load access logs:', error)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch('/api/rbac?action=access-stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const createUser = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/rbac?action=create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowCreateModal(false)
        setFormData({ id: '', name: '', email: '', role: Role.VIEWER })
        await loadUsers()
      } else {
        const error = await response.json()
        alert(`Erro: ${error.message || 'Falha ao criar usuário'}`)
      }
    } catch (error) {
      console.error('Failed to create user:', error)
      alert('Erro ao criar usuário')
    } finally {
      setLoading(false)
    }
  }

  const assignRole = async (userId: string, role: Role) => {
    if (!confirm(`Tem certeza que deseja alterar o role deste usuário para ${role}?`)) return

    setLoading(true)
    try {
      const response = await fetch('/api/rbac?action=assign-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role }),
      })

      if (response.ok) {
        await loadUsers()
      } else {
        const error = await response.json()
        alert(`Erro: ${error.message || 'Falha ao atribuir role'}`)
      }
    } catch (error) {
      console.error('Failed to assign role:', error)
      alert('Erro ao atribuir role')
    } finally {
      setLoading(false)
    }
  }

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    const action = isActive ? 'deactivate-user' : 'activate-user'
    const confirmMsg = isActive ? 'desativar' : 'ativar'

    if (!confirm(`Tem certeza que deseja ${confirmMsg} este usuário?`)) return

    setLoading(true)
    try {
      const response = await fetch(`/api/rbac?action=${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      if (response.ok) {
        await loadUsers()
      } else {
        const error = await response.json()
        alert(`Erro: ${error.message || 'Falha ao alterar status'}`)
      }
    } catch (error) {
      console.error('Failed to toggle user status:', error)
      alert('Erro ao alterar status')
    } finally {
      setLoading(false)
    }
  }

  const getRoleColor = (role: Role) => {
    const colors = {
      admin: 'bg-red-100 text-red-800 border-red-200',
      developer: 'bg-blue-100 text-blue-800 border-blue-200',
      operator: 'bg-green-100 text-green-800 border-green-200',
      viewer: 'bg-gray-100 text-gray-800 border-gray-200',
    }
    return colors[role]
  }

  const getRoleIcon = (role: Role) => {
    const icons = {
      admin: '👑',
      developer: '💻',
      operator: '⚙️',
      viewer: '👁️',
    }
    return icons[role]
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gerenciamento de Usuários e Permissões (RBAC)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button onClick={() => setShowCreateModal(true)} className="gap-2">
                <UserPlus className="h-4 w-4" />
                Novo Usuário
              </Button>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Users className="h-4 w-4" />
              {users.length} usuário(s) • {users.filter(u => u.isActive).length} ativo(s)
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-4 gap-4">
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Total de Acessos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-700">{stats.totalAttempts}</div>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Acessos Permitidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-700">{stats.granted}</div>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Acessos Negados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-700">{stats.denied}</div>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Usuários Únicos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-700">{stats.uniqueUsers}</div>
                </CardContent>
              </Card>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="users">Usuários ({users.length})</TabsTrigger>
              <TabsTrigger value="roles">Roles ({roles.length})</TabsTrigger>
              <TabsTrigger value="audit">Auditoria ({accessLogs.length})</TabsTrigger>
            </TabsList>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-3">
              {users.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="pt-6 text-center text-slate-500">
                    <Users className="h-12 w-12 mx-auto mb-2 text-slate-400" />
                    <div>Nenhum usuário cadastrado</div>
                  </CardContent>
                </Card>
              ) : (
                users.map(user => (
                  <Card key={user.id} className={!user.isActive ? 'opacity-60' : ''}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base flex items-center gap-2">
                            <span>{getRoleIcon(user.role)}</span>
                            {user.name}
                            {!user.isActive && (
                              <Badge variant="outline" className="bg-gray-100 text-gray-700">
                                Inativo
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="mt-1">{user.email}</CardDescription>
                        </div>
                        <Badge variant="outline" className={getRoleColor(user.role)}>
                          {user.role.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-slate-500">Criado em</div>
                            <div>{formatDate(user.createdAt)}</div>
                          </div>
                          {user.lastLoginAt && (
                            <div>
                              <div className="text-slate-500">Último acesso</div>
                              <div>{formatDate(user.lastLoginAt)}</div>
                            </div>
                          )}
                          {user.customPermissions && user.customPermissions.length > 0 && (
                            <div className="col-span-2">
                              <div className="text-slate-500 mb-1">Permissões customizadas</div>
                              <div className="flex flex-wrap gap-1">
                                {user.customPermissions.map(perm => (
                                  <Badge key={perm} variant="outline" className="text-xs">
                                    {perm}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t">
                          <select
                            value={user.role}
                            onChange={e => assignRole(user.id, e.target.value as Role)}
                            disabled={loading}
                            className="px-3 py-1 border rounded text-sm"
                          >
                            <option value="admin">Admin</option>
                            <option value="developer">Developer</option>
                            <option value="operator">Operator</option>
                            <option value="viewer">Viewer</option>
                          </select>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleUserStatus(user.id, user.isActive)}
                            disabled={loading}
                            className="gap-2"
                          >
                            {user.isActive ? (
                              <>
                                <Lock className="h-3 w-3" />
                                Desativar
                              </>
                            ) : (
                              <>
                                <Unlock className="h-3 w-3" />
                                Ativar
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Roles Tab */}
            <TabsContent value="roles" className="space-y-3">
              {roles.map(role => (
                <Card key={role.name}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          <span>{getRoleIcon(role.name)}</span>
                          {role.displayName}
                        </CardTitle>
                        <CardDescription>{role.description}</CardDescription>
                      </div>
                      <Badge className={`bg-${role.color}-100 text-${role.color}-800`}>
                        {role.permissions.length} permissões
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 10).map(perm => (
                        <Badge key={perm} variant="outline" className="text-xs">
                          {perm.split(':')[1]}
                        </Badge>
                      ))}
                      {role.permissions.length > 10 && (
                        <Badge variant="outline" className="text-xs">
                          +{role.permissions.length - 10} mais
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                            <Badge variant={log.granted ? 'default' : 'destructive'}>
                              {log.action}
                            </Badge>
                            <span className="text-sm font-medium">{log.resource}</span>
                            {log.resourceId && (
                              <span className="text-xs text-slate-500">({log.resourceId})</span>
                            )}
                          </div>
                          <div className="text-sm text-slate-600 mt-1">
                            Por {log.userName} • {formatDate(log.timestamp)}
                          </div>
                          {!log.granted && log.reason && (
                            <div className="text-sm text-red-600 mt-1">
                              ❌ {log.reason}
                            </div>
                          )}
                        </div>
                        {log.granted ? (
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

        {/* Create User Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Novo Usuário</CardTitle>
                <CardDescription>Cadastre um novo usuário no sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">ID do Usuário</label>
                    <input
                      type="text"
                      value={formData.id}
                      onChange={e => setFormData({ ...formData, id: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border rounded"
                      placeholder="user-123"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Nome</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border rounded"
                      placeholder="João Silva"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border rounded"
                      placeholder="joao@roilabs.com.br"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Role</label>
                    <select
                      value={formData.role}
                      onChange={e => setFormData({ ...formData, role: e.target.value as Role })}
                      className="w-full mt-1 px-3 py-2 border rounded"
                    >
                      <option value="viewer">Viewer (Visualização)</option>
                      <option value="operator">Operator (Execução)</option>
                      <option value="developer">Developer (Desenvolvimento)</option>
                      <option value="admin">Admin (Administrador)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t">
                    <Button onClick={createUser} disabled={loading} className="flex-1">
                      {loading ? 'Criando...' : 'Criar Usuário'}
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
        )}
      </DialogContent>
    </Dialog>
  )
}
