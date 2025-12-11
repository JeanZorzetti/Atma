"use client"

import { useState } from 'react'
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
  Save,
  Loader2,
  Tag,
  Link as LinkIcon,
  Sparkles
} from 'lucide-react'

interface WorkflowTemplateCreatorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workflowId?: string
  workflowName?: string
  workflowData?: unknown
  onTemplateCreated?: () => void
}

export function WorkflowTemplateCreator({
  open,
  onOpenChange,
  workflowId,
  workflowName,
  workflowData,
  onTemplateCreated
}: WorkflowTemplateCreatorProps) {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState(workflowName || '')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('automation')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [requiredServices, setRequiredServices] = useState<string[]>([])
  const [serviceInput, setServiceInput] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [isOfficial, setIsOfficial] = useState(false)

  const handleSave = async () => {
    if (!name || !description) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Nome e descrição são obrigatórios',
        variant: 'destructive'
      })
      return
    }

    if (!workflowData) {
      toast({
        title: 'Dados do workflow necessários',
        description: 'Os dados do workflow são necessários para criar o template',
        variant: 'destructive'
      })
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/n8n/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          category,
          tags,
          templateData: workflowData,
          requiredServices,
          isPublic,
          isOfficial,
          createdBy: 'Sistema' // TODO: pegar do usuário logado
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create template')
      }

      toast({
        title: 'Template criado',
        description: 'O template foi criado com sucesso'
      })

      if (onTemplateCreated) {
        onTemplateCreated()
      }

      onOpenChange(false)
      resetForm()
    } catch (error) {
      toast({
        title: 'Erro ao criar template',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setName('')
    setDescription('')
    setCategory('automation')
    setTags([])
    setTagInput('')
    setRequiredServices([])
    setServiceInput('')
    setIsPublic(true)
    setIsOfficial(false)
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const addService = () => {
    if (serviceInput.trim() && !requiredServices.includes(serviceInput.trim())) {
      setRequiredServices([...requiredServices, serviceInput.trim()])
      setServiceInput('')
    }
  }

  const removeService = (service: string) => {
    setRequiredServices(requiredServices.filter((s) => s !== service))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Criar Template de Workflow
          </DialogTitle>
          <DialogDescription>
            Transforme este workflow em um template reutilizável
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Template *</Label>
            <Input
              id="name"
              placeholder="Ex: Integração Slack + CRM"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              placeholder="Descreva o que este template faz e quando deve ser usado..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="integration">🔗 Integração</SelectItem>
                <SelectItem value="automation">⚙️ Automação</SelectItem>
                <SelectItem value="analytics">📊 Analytics</SelectItem>
                <SelectItem value="notification">🔔 Notificação</SelectItem>
                <SelectItem value="data-processing">🔄 Processamento de Dados</SelectItem>
                <SelectItem value="other">📦 Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
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
              {tags.map((tag) => (
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

          {/* Serviços Necessários */}
          <div className="space-y-2">
            <Label>Serviços Externos Necessários</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Ex: Slack, MySQL, Mailgun..."
                value={serviceInput}
                onChange={(e) => setServiceInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addService()}
              />
              <Button type="button" onClick={addService} size="sm">
                <LinkIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {requiredServices.map((service) => (
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

          {/* Opções */}
          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Público (visível para todos)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isOfficial}
                onChange={(e) => setIsOfficial(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Template Oficial</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Criar Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
