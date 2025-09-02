"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, X } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface CrmFiltersProps {
  onFiltersChange: (filters: {
    status?: string
    responsavel?: string
    origem?: string
    search?: string
  }) => void
  activeFilters: {
    status?: string
    responsavel?: string
    origem?: string
    search?: string
  }
}

export function CrmFilters({ onFiltersChange, activeFilters }: CrmFiltersProps) {
  const [localFilters, setLocalFilters] = useState(activeFilters)
  const [searchTerm, setSearchTerm] = useState(activeFilters.search || '')

  const statusOptions = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'prospeccao', label: 'Prospecção' },
    { value: 'contato_inicial', label: 'Contato Inicial' },
    { value: 'apresentacao', label: 'Apresentação' },
    { value: 'negociacao', label: 'Negociação' }
  ]

  const responsavelOptions = [
    { value: 'all', label: 'Todos os Responsáveis' },
    { value: 'Maria Santos', label: 'Maria Santos' },
    { value: 'João Oliveira', label: 'João Oliveira' },
    { value: 'Carlos Silva', label: 'Carlos Silva' }
  ]

  const origemOptions = [
    { value: 'all', label: 'Todas as Origens' },
    { value: 'inbound', label: 'Inbound' },
    { value: 'outbound', label: 'Outbound' },
    { value: 'indicacao', label: 'Indicação' },
    { value: 'evento', label: 'Evento' },
    { value: 'outro', label: 'Outro' }
  ]

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...localFilters, [key]: value === 'all' ? undefined : value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    const newFilters = { ...localFilters, search: value || undefined }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearAllFilters = () => {
    const emptyFilters = {}
    setLocalFilters(emptyFilters)
    setSearchTerm('')
    onFiltersChange(emptyFilters)
  }

  const activeFilterCount = Object.values(localFilters).filter(Boolean).length

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar leads..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="relative">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filtros</h4>
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Limpar
                </Button>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Select
                  value={localFilters.status || 'all'}
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Responsável</label>
                <Select
                  value={localFilters.responsavel || 'all'}
                  onValueChange={(value) => handleFilterChange('responsavel', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {responsavelOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Origem</label>
                <Select
                  value={localFilters.origem || 'all'}
                  onValueChange={(value) => handleFilterChange('origem', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {origemOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}