"use client"

import { useState, useEffect } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import {
  ChevronDown,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react'
import { getEnvironmentManager, type Environment, type EnvironmentType } from '@/lib/workflow-environment'

export function WorkflowEnvironmentSelector() {
  const { toast } = useToast()
  const [currentEnv, setCurrentEnv] = useState<Environment | null>(null)
  const [environments, setEnvironments] = useState<Environment[]>([])
  const [testing, setTesting] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; latency?: number }>>({})

  useEffect(() => {
    loadEnvironments()
  }, [])

  const loadEnvironments = () => {
    const manager = getEnvironmentManager()
    setCurrentEnv(manager.getCurrentEnvironment())
    setEnvironments(manager.getAllEnvironments())
  }

  const handleSwitch = async (envType: EnvironmentType) => {
    if (envType === 'production') {
      const confirmed = confirm(
        '⚠️ ATENÇÃO: Você está alternando para o ambiente de PRODUÇÃO.\n\n' +
        'Todas as ações afetarão workflows em produção.\n\n' +
        'Deseja continuar?'
      )

      if (!confirmed) {
        return
      }
    }

    try {
      const manager = getEnvironmentManager()
      manager.switchEnvironment(envType)
      loadEnvironments()

      const env = manager.getCurrentEnvironment()

      toast({
        title: 'Ambiente alterado',
        description: `Você está agora em: ${env.name} ${env.icon}`
      })

      // Recarregar página para aplicar mudanças
      window.location.reload()
    } catch (error) {
      toast({
        title: 'Erro ao alternar ambiente',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive'
      })
    }
  }

  const handleTest = async (envType: EnvironmentType) => {
    setTesting(envType)

    try {
      const manager = getEnvironmentManager()
      const result = await manager.testConnection(envType)

      setTestResults({
        ...testResults,
        [envType]: result
      })

      toast({
        title: result.success ? 'Conexão bem-sucedida' : 'Falha na conexão',
        description: result.message + (result.latency ? ` (${result.latency}ms)` : ''),
        variant: result.success ? 'default' : 'destructive'
      })
    } catch (error) {
      toast({
        title: 'Erro ao testar conexão',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive'
      })
    } finally {
      setTesting(null)
    }
  }

  const getEnvironmentBadgeColor = (type: EnvironmentType) => {
    switch (type) {
      case 'development':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200'
      case 'staging':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
      case 'production':
        return 'bg-red-100 text-red-800 hover:bg-red-200'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    }
  }

  const getStatusIcon = (envType: EnvironmentType) => {
    const result = testResults[envType]
    if (!result) return null

    if (result.success) {
      return <CheckCircle2 className="h-3 w-3 text-green-600" />
    }
    return <XCircle className="h-3 w-3 text-red-600" />
  }

  if (!currentEnv) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`${getEnvironmentBadgeColor(currentEnv.type)} border-0`}
        >
          <span className="mr-2">{currentEnv.icon}</span>
          {currentEnv.name}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center gap-2">
          <span>Ambientes</span>
          {currentEnv.type === 'production' && (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {environments.map((env) => (
          <DropdownMenuItem
            key={env.id}
            onClick={() => handleSwitch(env.type)}
            className="flex flex-col items-start gap-2 p-3 cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="text-lg">{env.icon}</span>
                <div>
                  <p className="font-medium">{env.name}</p>
                  {env.description && (
                    <p className="text-xs text-muted-foreground">{env.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getStatusIcon(env.type)}
                {env.isActive && (
                  <Badge variant="default" className="text-xs">
                    Ativo
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 w-full mt-1">
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-6"
                onClick={(e) => {
                  e.stopPropagation()
                  handleTest(env.type)
                }}
                disabled={testing === env.type}
              >
                {testing === env.type ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Testando...
                  </>
                ) : (
                  'Testar Conexão'
                )}
              </Button>

              {testResults[env.type]?.latency && (
                <span className="text-xs text-muted-foreground">
                  {testResults[env.type].latency}ms
                </span>
              )}
            </div>

            {env.type === 'production' && (
              <div className="flex items-start gap-2 mt-2 p-2 bg-red-50 rounded text-xs text-red-800 w-full">
                <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>Cuidado: Este é o ambiente de produção!</span>
              </div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
