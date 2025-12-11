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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  Search,
  Star,
  TrendingUp,
  Download,
  Eye,
  Loader2,
  Sparkles,
  Filter,
  SortAsc
} from 'lucide-react'

interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  templateData: unknown
  thumbnailUrl?: string
  configSchema?: unknown
  requiredServices?: string[]
  useCount: number
  rating?: number
  createdBy?: string
  isOfficial: boolean
  isPublic: boolean
  status: string
  createdAt: string
  updatedAt: string
}

interface WorkflowTemplateGalleryProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectTemplate?: (template: WorkflowTemplate) => void
}

export function WorkflowTemplateGallery({
  open,
  onOpenChange,
  onSelectTemplate
}: WorkflowTemplateGalleryProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState<WorkflowTemplate[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'useCount' | 'rating' | 'createdAt'>('useCount')
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (open) {
      loadTemplates()
    }
  }, [open, sortBy])

  useEffect(() => {
    filterTemplates()
  }, [templates, searchQuery, categoryFilter])

  const loadTemplates = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/n8n/templates?sortBy=${sortBy}&isPublic=true`)
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates || [])
      }
    } catch (error) {
      console.error('Error loading templates:', error)
      toast({
        title: 'Erro ao carregar templates',
        description: 'Não foi possível carregar os templates disponíveis',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const filterTemplates = () => {
    let filtered = [...templates]

    // Filtrar por categoria
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((t: WorkflowTemplate) => t.category === categoryFilter)
    }

    // Filtrar por busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((t: WorkflowTemplate) =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.tags.some((tag: string) => tag.toLowerCase().includes(query))
      )
    }

    setFilteredTemplates(filtered)
  }

  const handlePreview = (template: WorkflowTemplate) => {
    setSelectedTemplate(template)
    setShowPreview(true)
  }

  const handleUseTemplate = async (template: WorkflowTemplate) => {
    try {
      // Incrementar contador de uso
      await fetch('/api/n8n/templates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: template.id
        })
      })

      toast({
        title: 'Template selecionado',
        description: `Template "${template.name}" pronto para uso`
      })

      if (onSelectTemplate) {
        onSelectTemplate(template)
      }

      onOpenChange(false)
    } catch (error) {
      toast({
        title: 'Erro ao usar template',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive'
      })
    }
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      integration: '🔗',
      automation: '⚙️',
      analytics: '📊',
      notification: '🔔',
      'data-processing': '🔄',
      other: '📦'
    }
    return icons[category] || '📦'
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      integration: 'Integração',
      automation: 'Automação',
      analytics: 'Analytics',
      notification: 'Notificação',
      'data-processing': 'Processamento',
      other: 'Outro'
    }
    return labels[category] || category
  }

  const categories = ['all', 'integration', 'automation', 'analytics', 'notification', 'data-processing', 'other']

  return (
    <>
      <Dialog open={open && !showPreview} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Galeria de Templates
            </DialogTitle>
            <DialogDescription>
              Escolha um template para começar rapidamente
            </DialogDescription>
          </DialogHeader>

          {/* Filtros e Busca */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Categorias</SelectItem>
                  {categories.slice(1).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {getCategoryIcon(cat)} {getCategoryLabel(cat)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                <SelectTrigger className="w-[180px]">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="useCount">Mais Usados</SelectItem>
                  <SelectItem value="rating">Melhor Avaliados</SelectItem>
                  <SelectItem value="createdAt">Mais Recentes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Grid de Templates */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">Nenhum template encontrado</p>
                <p className="text-sm text-gray-500">
                  {searchQuery || categoryFilter !== 'all'
                    ? 'Tente ajustar os filtros de busca'
                    : 'Crie o primeiro template para sua equipe'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                {filteredTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer group"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getCategoryIcon(template.category)}</span>
                          {template.isOfficial && (
                            <Badge variant="default" className="text-xs bg-purple-600">
                              Oficial
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          {template.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{template.rating.toFixed(1)}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>{template.useCount}</span>
                          </div>
                        </div>
                      </div>

                      <CardTitle className="text-base line-clamp-1">{template.name}</CardTitle>
                      <CardDescription className="line-clamp-2 text-xs">
                        {template.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {template.tags.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {template.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{template.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Serviços necessários */}
                      {template.requiredServices && template.requiredServices.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Requer:</span>{' '}
                          {template.requiredServices.join(', ')}
                        </div>
                      )}

                      {/* Ações */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handlePreview(template)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-purple-600 hover:bg-purple-700"
                          onClick={() => handleUseTemplate(template)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Usar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-3 border-t">
            <p className="text-sm text-muted-foreground">
              {filteredTemplates.length} template(s) encontrado(s)
            </p>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Preview */}
      {selectedTemplate && (
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="text-2xl">{getCategoryIcon(selectedTemplate.category)}</span>
                {selectedTemplate.name}
              </DialogTitle>
              <DialogDescription>
                {getCategoryLabel(selectedTemplate.category)}
                {selectedTemplate.isOfficial && (
                  <Badge variant="default" className="ml-2 bg-purple-600">
                    Oficial
                  </Badge>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Descrição */}
              <div>
                <h3 className="font-semibold mb-2">Descrição</h3>
                <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
              </div>

              {/* Estatísticas */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="text-2xl font-bold">{selectedTemplate.useCount}</p>
                        <p className="text-xs text-muted-foreground">Usos</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {selectedTemplate.rating && (
                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <div>
                          <p className="text-2xl font-bold">{selectedTemplate.rating.toFixed(1)}</p>
                          <p className="text-xs text-muted-foreground">Avaliação</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="text-sm font-bold">{selectedTemplate.category}</p>
                        <p className="text-xs text-muted-foreground">Categoria</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tags */}
              <div>
                <h3 className="font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Serviços Necessários */}
              {selectedTemplate.requiredServices && selectedTemplate.requiredServices.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Serviços Necessários</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.requiredServices.map((service: string) => (
                      <Badge key={service} variant="outline">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Autor */}
              {selectedTemplate.createdBy && (
                <div>
                  <h3 className="font-semibold mb-2">Criado por</h3>
                  <p className="text-sm text-muted-foreground">{selectedTemplate.createdBy}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Voltar
              </Button>
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => {
                  setShowPreview(false)
                  handleUseTemplate(selectedTemplate)
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Usar Template
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
