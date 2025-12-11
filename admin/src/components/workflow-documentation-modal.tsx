"use client"

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import {
  FileText,
  Settings,
  GitBranch,
  Tag,
  Save,
  Loader2,
  BookOpen,
  Code,
  AlertCircle,
  Link as LinkIcon
} from 'lucide-react'

interface WorkflowMetadata {
  workflowId: string
  workflowName: string
  description?: string
  purpose?: string
  category?: string
  tags?: string[]
  author?: string
  authorEmail?: string
  team?: string
  version?: string
  versionNotes?: string
  status?: string
  isPublic?: boolean
  isTemplate?: boolean
  complexity?: string
  estimatedDuration?: number
  dependencies?: string[]
  requiredServices?: string[]
  documentation?: WorkflowDocumentation
}

interface WorkflowDocumentation {
  overview?: string
  setupInstructions?: string
  usageExamples?: string
  troubleshooting?: string
  notes?: string
  configExamples?: Record<string, unknown>
  environmentVars?: Record<string, string>
  inputSchema?: Record<string, unknown>
  outputSchema?: Record<string, unknown>
  webhookUrl?: string
  faqItems?: Array<{ question: string; answer: string }>
  knownIssues?: Array<{ title: string; description: string }>
  externalDocs?: Array<{ title: string; url: string }>
  relatedWorkflows?: string[]
}

interface WorkflowDocumentationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workflowId: string
  workflowName: string
}

export function WorkflowDocumentationModal({
  open,
  onOpenChange,
  workflowId,
  workflowName
}: WorkflowDocumentationModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [metadata, setMetadata] = useState<WorkflowMetadata>({
    workflowId,
    workflowName,
    description: '',
    purpose: '',
    category: 'automation',
    tags: [],
    author: '',
    authorEmail: '',
    team: '',
    version: '1.0.0',
    status: 'active',
    isPublic: false,
    isTemplate: false,
    complexity: 'medium',
    estimatedDuration: 0,
    dependencies: [],
    requiredServices: []
  })

  const [documentation, setDocumentation] = useState<WorkflowDocumentation>({
    overview: '',
    setupInstructions: '',
    usageExamples: '',
    troubleshooting: '',
    notes: '',
    webhookUrl: ''
  })

  const [tagInput, setTagInput] = useState('')
  const [dependencyInput, setDependencyInput] = useState('')
  const [serviceInput, setServiceInput] = useState('')

  useEffect(() => {
    if (open && workflowId) {
      loadMetadata()
    }
  }, [open, workflowId])

  const loadMetadata = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/n8n/metadata?workflowId=${workflowId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.metadata) {
          setMetadata(data.metadata)
          if (data.metadata.documentation) {
            setDocumentation(data.metadata.documentation)
          }
        }
      }
    } catch (error) {
      console.error('Error loading metadata:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Salvar metadados
      const metadataResponse = await fetch('/api/n8n/metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metadata)
      })

      if (!metadataResponse.ok) {
        throw new Error('Failed to save metadata')
      }

      // Salvar documentação
      const docResponse = await fetch('/api/n8n/documentation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowId,
          ...documentation,
          lastEditedBy: metadata.author || 'Unknown'
        })
      })

      if (!docResponse.ok) {
        throw new Error('Failed to save documentation')
      }

      toast({
        title: 'Documentação salva',
        description: 'As informações do workflow foram atualizadas com sucesso.'
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: 'Erro ao salvar',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !metadata.tags?.includes(tagInput.trim())) {
      setMetadata({
        ...metadata,
        tags: [...(metadata.tags || []), tagInput.trim()]
      })
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setMetadata({
      ...metadata,
      tags: metadata.tags?.filter((t: string) => t !== tag)
    })
  }

  const addDependency = () => {
    if (dependencyInput.trim() && !metadata.dependencies?.includes(dependencyInput.trim())) {
      setMetadata({
        ...metadata,
        dependencies: [...(metadata.dependencies || []), dependencyInput.trim()]
      })
      setDependencyInput('')
    }
  }

  const removeDependency = (dep: string) => {
    setMetadata({
      ...metadata,
      dependencies: metadata.dependencies?.filter((d: string) => d !== dep)
    })
  }

  const addService = () => {
    if (serviceInput.trim() && !metadata.requiredServices?.includes(serviceInput.trim())) {
      setMetadata({
        ...metadata,
        requiredServices: [...(metadata.requiredServices || []), serviceInput.trim()]
      })
      setServiceInput('')
    }
  }

  const removeService = (service: string) => {
    setMetadata({
      ...metadata,
      requiredServices: metadata.requiredServices?.filter((s: string) => s !== service)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documentação: {workflowName}
          </DialogTitle>
          <DialogDescription>
            Adicione metadados e documentação completa para este workflow
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Tabs defaultValue="metadata" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="metadata">
                <Settings className="h-4 w-4 mr-2" />
                Metadados
              </TabsTrigger>
              <TabsTrigger value="documentation">
                <BookOpen className="h-4 w-4 mr-2" />
                Documentação
              </TabsTrigger>
              <TabsTrigger value="config">
                <Code className="h-4 w-4 mr-2" />
                Configuração
              </TabsTrigger>
            </TabsList>

            {/* ABA METADADOS */}
            <TabsContent value="metadata" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Breve descrição do workflow..."
                    value={metadata.description || ''}
                    onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose">Propósito</Label>
                  <Textarea
                    id="purpose"
                    placeholder="Qual problema este workflow resolve?"
                    value={metadata.purpose || ''}
                    onChange={(e) => setMetadata({ ...metadata, purpose: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={metadata.category}
                    onValueChange={(value) => setMetadata({ ...metadata, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="integration">Integração</SelectItem>
                      <SelectItem value="automation">Automação</SelectItem>
                      <SelectItem value="analytics">Analytics</SelectItem>
                      <SelectItem value="notification">Notificação</SelectItem>
                      <SelectItem value="data-processing">Processamento de Dados</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={metadata.status}
                    onValueChange={(value) => setMetadata({ ...metadata, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="deprecated">Depreciado</SelectItem>
                      <SelectItem value="archived">Arquivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="complexity">Complexidade</Label>
                  <Select
                    value={metadata.complexity}
                    onValueChange={(value) => setMetadata({ ...metadata, complexity: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Autor</Label>
                  <Input
                    id="author"
                    placeholder="Nome do autor"
                    value={metadata.author || ''}
                    onChange={(e) => setMetadata({ ...metadata, author: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="authorEmail">Email do Autor</Label>
                  <Input
                    id="authorEmail"
                    type="email"
                    placeholder="email@exemplo.com"
                    value={metadata.authorEmail || ''}
                    onChange={(e) => setMetadata({ ...metadata, authorEmail: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="team">Time</Label>
                  <Input
                    id="team"
                    placeholder="Nome do time"
                    value={metadata.team || ''}
                    onChange={(e) => setMetadata({ ...metadata, team: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="version">Versão</Label>
                  <Input
                    id="version"
                    placeholder="1.0.0"
                    value={metadata.version || ''}
                    onChange={(e) => setMetadata({ ...metadata, version: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedDuration">Duração Estimada (min)</Label>
                  <Input
                    id="estimatedDuration"
                    type="number"
                    placeholder="5"
                    value={metadata.estimatedDuration || ''}
                    onChange={(e) => setMetadata({ ...metadata, estimatedDuration: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Adicionar tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    <Tag className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {metadata.tags?.map((tag: string) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-2 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Dependências (Workflow IDs)</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="ID do workflow dependente..."
                    value={dependencyInput}
                    onChange={(e) => setDependencyInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addDependency()}
                  />
                  <Button type="button" onClick={addDependency} size="sm">
                    <GitBranch className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {metadata.dependencies?.map((dep: string) => (
                    <Badge key={dep} variant="outline">
                      {dep}
                      <button
                        onClick={() => removeDependency(dep)}
                        className="ml-2 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Serviços Externos Necessários</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nome do serviço (ex: Slack, MySQL)..."
                    value={serviceInput}
                    onChange={(e) => setServiceInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addService()}
                  />
                  <Button type="button" onClick={addService} size="sm">
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {metadata.requiredServices?.map((service: string) => (
                    <Badge key={service} variant="outline">
                      {service}
                      <button
                        onClick={() => removeService(service)}
                        className="ml-2 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={metadata.isPublic || false}
                    onChange={(e) => setMetadata({ ...metadata, isPublic: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Público</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={metadata.isTemplate || false}
                    onChange={(e) => setMetadata({ ...metadata, isTemplate: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">É Template</span>
                </label>
              </div>
            </TabsContent>

            {/* ABA DOCUMENTAÇÃO */}
            <TabsContent value="documentation" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="overview">Visão Geral</Label>
                <Textarea
                  id="overview"
                  placeholder="Descreva o que este workflow faz, como funciona e quando deve ser usado..."
                  value={documentation.overview || ''}
                  onChange={(e) => setDocumentation({ ...documentation, overview: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="setupInstructions">Instruções de Setup</Label>
                <Textarea
                  id="setupInstructions"
                  placeholder="Passo a passo para configurar o workflow..."
                  value={documentation.setupInstructions || ''}
                  onChange={(e) => setDocumentation({ ...documentation, setupInstructions: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="usageExamples">Exemplos de Uso</Label>
                <Textarea
                  id="usageExamples"
                  placeholder="Exemplos práticos de como usar o workflow..."
                  value={documentation.usageExamples || ''}
                  onChange={(e) => setDocumentation({ ...documentation, usageExamples: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="troubleshooting">Troubleshooting</Label>
                <Textarea
                  id="troubleshooting"
                  placeholder="Problemas comuns e suas soluções..."
                  value={documentation.troubleshooting || ''}
                  onChange={(e) => setDocumentation({ ...documentation, troubleshooting: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas Adicionais</Label>
                <Textarea
                  id="notes"
                  placeholder="Informações adicionais, avisos, etc..."
                  value={documentation.notes || ''}
                  onChange={(e) => setDocumentation({ ...documentation, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </TabsContent>

            {/* ABA CONFIGURAÇÃO */}
            <TabsContent value="config" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  placeholder="https://..."
                  value={documentation.webhookUrl || ''}
                  onChange={(e) => setDocumentation({ ...documentation, webhookUrl: e.target.value })}
                />
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium mb-1">Recursos Avançados</p>
                    <p>
                      As configurações de schemas JSON, variáveis de ambiente e FAQ podem ser gerenciadas
                      através da API REST.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Salvar Documentação
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
