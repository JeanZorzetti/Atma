"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { apiService } from '@/lib/api'

interface ImportLeadsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

interface ImportResult {
  imported: number
  skipped: number
  errors: string[]
}

export function ImportLeadsModal({ open, onOpenChange, onSuccess }: ImportLeadsModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const { toast } = useToast()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      // Validar tipo de arquivo
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ]
      
      if (!allowedTypes.includes(selectedFile.type)) {
        toast({
          title: 'Arquivo inválido',
          description: 'Por favor, selecione um arquivo Excel (.xlsx, .xls) ou CSV.',
          variant: 'destructive'
        })
        return
      }

      // Validar tamanho (5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: 'Arquivo muito grande',
          description: 'O arquivo deve ter no máximo 5MB.',
          variant: 'destructive'
        })
        return
      }

      setFile(selectedFile)
      setResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: 'Nenhum arquivo selecionado',
        description: 'Por favor, selecione um arquivo para importar.',
        variant: 'destructive'
      })
      return
    }

    setUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/crm/leads/import`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.results)
        toast({
          title: 'Importação concluída!',
          description: data.message,
        })
        
        if (data.results.imported > 0) {
          onSuccess()
        }
      } else {
        toast({
          title: 'Erro na importação',
          description: data.error?.message || 'Erro desconhecido',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Erro ao importar leads:', error)
      toast({
        title: 'Erro na importação',
        description: 'Erro de conexão com o servidor',
        variant: 'destructive'
      })
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    setFile(null)
    setResult(null)
    onOpenChange(false)
  }

  const getFileIcon = (file: File) => {
    if (file.type.includes('csv')) {
      return <FileSpreadsheet className="h-6 w-6 text-green-500" />
    }
    return <FileSpreadsheet className="h-6 w-6 text-blue-500" />
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importar Leads via Planilha</DialogTitle>
          <DialogDescription>
            Importe múltiplos leads de uma vez usando arquivos Excel ou CSV
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Instrucões */}
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <p className="font-medium mb-2">Formato esperado:</p>
            <ul className="text-xs space-y-1">
              <li>• <strong>Obrigatórios:</strong> nome, clinica, cro, email, telefone</li>
              <li>• <strong>Opcionais:</strong> cidade, estado, consultorios, scanner, interesse, etc.</li>
              <li>• Primeira linha deve conter os cabeçalhos</li>
              <li>• Máximo 5MB por arquivo</li>
            </ul>
          </div>

          {/* Upload de arquivo */}
          <div className="space-y-2">
            <Label htmlFor="file">Selecionar Arquivo</Label>
            <Input
              id="file"
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
              disabled={uploading}
            />
          </div>

          {/* Arquivo selecionado */}
          {file && (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              {getFileIcon(file)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFile(null)}
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Resultado da importação */}
          {result && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="font-medium">Importação concluída</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{result.imported}</div>
                  <div className="text-gray-600">Importados</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{result.skipped}</div>
                  <div className="text-gray-600">Ignorados</div>
                </div>
              </div>

              {result.errors.length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center space-x-2 text-orange-600 mb-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Erros encontrados:</span>
                  </div>
                  <div className="max-h-32 overflow-y-auto text-xs text-gray-600 space-y-1">
                    {result.errors.slice(0, 10).map((error, index) => (
                      <div key={index} className="p-2 bg-white rounded">
                        {error}
                      </div>
                    ))}
                    {result.errors.length > 10 && (
                      <div className="text-gray-500 italic">
                        ... e mais {result.errors.length - 10} erros
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={handleClose} disabled={uploading}>
            {result ? 'Fechar' : 'Cancelar'}
          </Button>
          {!result && (
            <Button 
              onClick={handleUpload} 
              disabled={!file || uploading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {uploading ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  Importando...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Importar Leads
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}