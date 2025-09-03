"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { apiService } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

interface NewLeadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function NewLeadModal({ open, onOpenChange, onSuccess }: NewLeadModalProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    nome: '',
    clinica: '',
    cro: '',
    email: '',
    telefone: '',
    cep: '',
    cidade: '',
    estado: '',
    consultórios: '',
    scanner: '',
    scanner_marca: '',
    casos_mes: '',
    interesse: '',
    responsavel_comercial: '',
    origem_lead: 'outbound',
    observacoes_internas: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validação básica
    if (!formData.nome || !formData.clinica || !formData.cro || !formData.email || !formData.telefone) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha nome, clínica, CRO, email e telefone.',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await apiService.createCrmLead(formData as any)
      toast({
        title: 'Lead criado com sucesso!',
        description: `${formData.nome} foi adicionado ao pipeline de vendas.`,
        duration: 3000, // 3 segundos para sucesso
      })
      setFormData({
        nome: '',
        clinica: '',
        cro: '',
        email: '',
        telefone: '',
        cep: '',
        cidade: '',
        estado: '',
        consultórios: '',
        scanner: '',
        scanner_marca: '',
        casos_mes: '',
        interesse: '',
        responsavel_comercial: '',
        origem_lead: 'outbound',
        observacoes_internas: ''
      })
      onOpenChange(false)
      onSuccess()
    } catch (error: unknown) {
      // Debug: log do erro para entender a estrutura
      console.log('Erro capturado:', error);
      
      // Extrair mensagem do backend se disponível
      let errorMessage = 'Erro desconhecido';
      
      if (error && typeof error === 'object' && 'errorData' in error) {
        const errorWithData = error as { errorData?: { error?: { message?: string }, message?: string } };
        const errorData = errorWithData.errorData;
        
        console.log('ErrorData encontrado:', errorData);
        
        if (errorData?.error?.message) {
          // Mensagem específica do backend (ex: "Já existe um lead com este CRO")
          errorMessage = errorData.error.message;
        } else if (errorData?.message) {
          // Mensagem direta do backend
          errorMessage = errorData.message;
        }
      } else if (error instanceof Error && error.message.includes('HTTP error! status: 400')) {
        errorMessage = 'Erro de validação. Verifique os dados informados.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.log('Mensagem final do toast:', errorMessage);

      toast({
        title: 'Erro ao criar lead',
        description: errorMessage,
        variant: 'destructive', // Auto 5s por ser destructive
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Lead CRM</DialogTitle>
          <DialogDescription>
            Adicione um novo ortodontista ao pipeline de vendas.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome do Ortodontista *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                placeholder="Dr. João Silva"
                required
              />
            </div>

            <div>
              <Label htmlFor="clinica">Clínica *</Label>
              <Input
                id="clinica"
                value={formData.clinica}
                onChange={(e) => handleInputChange('clinica', e.target.value)}
                placeholder="Clínica OrthoSmile"
                required
              />
            </div>

            <div>
              <Label htmlFor="cro">CRO *</Label>
              <Input
                id="cro"
                value={formData.cro}
                onChange={(e) => handleInputChange('cro', e.target.value)}
                placeholder="CRO-SP 12345"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="contato@clinica.com.br"
                required
              />
            </div>

            <div>
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                placeholder="(11) 9999-8888"
                required
              />
            </div>

            <div>
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                value={formData.cep}
                onChange={(e) => handleInputChange('cep', e.target.value)}
                placeholder="01234-567"
              />
            </div>

            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                value={formData.cidade}
                onChange={(e) => handleInputChange('cidade', e.target.value)}
                placeholder="São Paulo"
              />
            </div>

            <div>
              <Label htmlFor="estado">Estado</Label>
              <Select onValueChange={(value) => handleInputChange('estado', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SP">São Paulo</SelectItem>
                  <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                  <SelectItem value="MG">Minas Gerais</SelectItem>
                  <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                  {/* Adicionar mais estados conforme necessário */}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="consultorios">Consultórios</Label>
              <Select onValueChange={(value) => handleInputChange('consultórios', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2-3">2-3</SelectItem>
                  <SelectItem value="4-5">4-5</SelectItem>
                  <SelectItem value="6+">6+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="scanner">Possui Scanner?</Label>
              <Select onValueChange={(value) => handleInputChange('scanner', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sim">Sim</SelectItem>
                  <SelectItem value="nao">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="scanner_marca">Marca do Scanner</Label>
              <Input
                id="scanner_marca"
                value={formData.scanner_marca}
                onChange={(e) => handleInputChange('scanner_marca', e.target.value)}
                placeholder="iTero, 3Shape, etc."
              />
            </div>

            <div>
              <Label htmlFor="casos_mes">Casos por Mês</Label>
              <Select onValueChange={(value) => handleInputChange('casos_mes', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-5">1-5</SelectItem>
                  <SelectItem value="6-10">6-10</SelectItem>
                  <SelectItem value="11-20">11-20</SelectItem>
                  <SelectItem value="21+">21+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="interesse">Interesse</Label>
              <Select onValueChange={(value) => handleInputChange('interesse', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="atma-aligner">Atma Aligner</SelectItem>
                  <SelectItem value="atma-labs">Atma Labs</SelectItem>
                  <SelectItem value="ambos">Ambos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="responsavel">Responsável Comercial</Label>
              <Select onValueChange={(value) => handleInputChange('responsavel_comercial', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Maria Santos">Maria Santos</SelectItem>
                  <SelectItem value="João Oliveira">João Oliveira</SelectItem>
                  <SelectItem value="Carlos Silva">Carlos Silva</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="origem">Origem do Lead</Label>
              <Select 
                value={formData.origem_lead}
                onValueChange={(value) => handleInputChange('origem_lead', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inbound">Inbound</SelectItem>
                  <SelectItem value="outbound">Outbound</SelectItem>
                  <SelectItem value="indicacao">Indicação</SelectItem>
                  <SelectItem value="evento">Evento</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="observacoes">Observações Internas</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes_internas}
              onChange={(e) => handleInputChange('observacoes_internas', e.target.value)}
              placeholder="Notas sobre o lead..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Lead'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}