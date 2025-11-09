"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Save, TrendingUp, RefreshCw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface Benchmark {
  id: number
  category: string
  metric_key: string
  metric_name: string
  metric_value: number
  metric_unit: string
  description: string | null
  source: string | null
  last_updated: string
  created_at: string
}

interface BenchmarksByCategory {
  SEO: Benchmark[]
  CONVERSAO: Benchmark[]
  GERAL: Benchmark[]
}

export function BenchmarkEditor() {
  const [benchmarks, setBenchmarks] = useState<BenchmarksByCategory>({
    SEO: [],
    CONVERSAO: [],
    GERAL: []
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editedValues, setEditedValues] = useState<{[key: number]: Partial<Benchmark>}>({})
  const { toast } = useToast()

  useEffect(() => {
    fetchBenchmarks()
  }, [])

  const fetchBenchmarks = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/market-benchmarks`)
      const data = await response.json()

      if (data.success) {
        // Group by category
        const grouped: BenchmarksByCategory = {
          SEO: [],
          CONVERSAO: [],
          GERAL: []
        }

        data.data.forEach((benchmark: Benchmark) => {
          if (benchmark.category in grouped) {
            grouped[benchmark.category as keyof BenchmarksByCategory].push(benchmark)
          }
        })

        setBenchmarks(grouped)
      }
    } catch (error) {
      console.error('Error fetching benchmarks:', error)
      toast({
        title: 'Erro',
        description: 'Falha ao carregar benchmarks',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleValueChange = (id: number, field: keyof Benchmark, value: string | number) => {
    setEditedValues(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }))
  }

  const handleSave = async (benchmark: Benchmark) => {
    const updates = editedValues[benchmark.id]
    if (!updates) return

    try {
      setSaving(true)
      const response = await fetch(`${API_URL}/api/market-benchmarks/${benchmark.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Sucesso',
          description: `${benchmark.metric_name} atualizado com sucesso`
        })

        // Remove from edited values
        setEditedValues(prev => {
          const newValues = { ...prev }
          delete newValues[benchmark.id]
          return newValues
        })

        // Refresh benchmarks
        await fetchBenchmarks()
      }
    } catch (error) {
      console.error('Error saving benchmark:', error)
      toast({
        title: 'Erro',
        description: 'Falha ao salvar benchmark',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveAll = async () => {
    if (Object.keys(editedValues).length === 0) {
      toast({
        title: 'Nenhuma alteração',
        description: 'Não há alterações para salvar',
        variant: 'default'
      })
      return
    }

    try {
      setSaving(true)

      const updates = Object.entries(editedValues).map(([id, values]) => ({
        id: parseInt(id),
        ...values
      }))

      const response = await fetch(`${API_URL}/api/market-benchmarks/bulk-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ benchmarks: updates })
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Sucesso',
          description: `${updates.length} benchmarks atualizados com sucesso`
        })

        setEditedValues({})
        await fetchBenchmarks()
      }
    } catch (error) {
      console.error('Error saving benchmarks:', error)
      toast({
        title: 'Erro',
        description: 'Falha ao salvar benchmarks',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const renderBenchmarkCard = (benchmark: Benchmark) => {
    const currentValue = editedValues[benchmark.id]?.metric_value ?? benchmark.metric_value
    const currentSource = editedValues[benchmark.id]?.source ?? benchmark.source
    const hasChanges = !!editedValues[benchmark.id]

    return (
      <Card key={benchmark.id} className={hasChanges ? 'border-blue-300 bg-blue-50/30' : ''}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{benchmark.metric_name}</CardTitle>
          <CardDescription className="text-xs">
            {benchmark.description || 'Sem descrição'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Valor</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  step="0.01"
                  value={currentValue}
                  onChange={(e) => handleValueChange(benchmark.id, 'metric_value', parseFloat(e.target.value))}
                  className="text-sm"
                />
                <span className="flex items-center text-sm text-gray-600 min-w-[50px]">
                  {benchmark.metric_unit}
                </span>
              </div>
            </div>
            <div>
              <Label className="text-xs">Última atualização</Label>
              <p className="text-xs text-gray-600 mt-2">
                {new Date(benchmark.last_updated).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          <div>
            <Label className="text-xs">Fonte do dado</Label>
            <Textarea
              value={currentSource || ''}
              onChange={(e) => handleValueChange(benchmark.id, 'source', e.target.value)}
              placeholder="Ex: Relatório XYZ 2024, Pesquisa ABC, etc."
              className="text-sm min-h-[60px]"
            />
          </div>

          {hasChanges && (
            <Button
              size="sm"
              onClick={() => handleSave(benchmark)}
              disabled={saving}
              className="w-full"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-3 w-3" />
                  Salvar alteração
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const hasAnyChanges = Object.keys(editedValues).length > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Benchmarks de Mercado</h3>
          <p className="text-sm text-gray-600">
            Edite os valores de referência do mercado de ortodontia digital
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchBenchmarks}
            disabled={loading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
          {hasAnyChanges && (
            <Button
              size="sm"
              onClick={handleSaveAll}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar tudo ({Object.keys(editedValues).length})
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* SEO Benchmarks */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h4 className="font-semibold">SEO</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {benchmarks.SEO.map(renderBenchmarkCard)}
        </div>
      </div>

      {/* Conversion Benchmarks */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-green-600" />
          <h4 className="font-semibold">Conversão</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {benchmarks.CONVERSAO.map(renderBenchmarkCard)}
        </div>
      </div>

      {/* General Benchmarks */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-purple-600" />
          <h4 className="font-semibold">Geral</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {benchmarks.GERAL.map(renderBenchmarkCard)}
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-900">
                Como usar os benchmarks?
              </p>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Execute a pesquisa no Gemini Deep Research com o prompt fornecido</li>
                <li>Atualize os valores com dados reais do mercado</li>
                <li>Inclua sempre a fonte do dado para referência futura</li>
                <li>Os benchmarks serão usados na página de comparação de desempenho</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
