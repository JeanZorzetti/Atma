'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Info, Server, Clock, Cpu } from 'lucide-react'
import { apiService } from '@/lib/api'
import packageInfo from '../../package.json'

interface SystemVersionInfo {
  version: string
  name: string
  description: string
  node_version: string
  environment: string
  uptime: number
  timestamp: string
  api_status: string
  features: string[]
}

export function VersionInfo() {
  const [systemInfo, setSystemInfo] = useState<SystemVersionInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const fetchSystemInfo = async () => {
    try {
      setLoading(true)
      const response = await apiService.getSystemVersion()
      if (response.success) {
        setSystemInfo(response.data)
      }
    } catch (error) {
      console.error('Erro ao buscar informações do sistema:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && !systemInfo) {
      fetchSystemInfo()
    }
  }, [isOpen, systemInfo])

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="fixed bottom-4 right-4 text-xs text-muted-foreground hover:text-foreground z-50"
        >
          <Info className="h-3 w-3 mr-1" />
          v{packageInfo.version}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Informações do Sistema
          </DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">
            Carregando informações...
          </div>
        ) : (
          <div className="space-y-4">
            {/* Frontend Info */}
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">Admin Frontend</h4>
                  <Badge variant="outline">v{packageInfo.version}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Next.js Admin Panel
                </p>
              </CardContent>
            </Card>

            {/* Backend Info */}
            {systemInfo && (
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">API Backend</h4>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={systemInfo.api_status === 'online' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {systemInfo.api_status}
                      </Badge>
                      <Badge variant="outline">v{systemInfo.version}</Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {systemInfo.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <Cpu className="h-3 w-3" />
                      <span>{systemInfo.node_version}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Uptime: {formatUptime(systemInfo.uptime)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <Badge variant="secondary" className="mr-1 mb-1 text-xs">
                      {systemInfo.environment}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            {systemInfo && (
              <Card>
                <CardContent className="pt-4">
                  <h4 className="font-medium text-sm mb-2">Funcionalidades</h4>
                  <div className="flex flex-wrap gap-1">
                    {systemInfo.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <p className="text-xs text-center text-muted-foreground">
              Última atualização: {systemInfo ? 
                new Date(systemInfo.timestamp).toLocaleString('pt-BR') : 
                new Date().toLocaleString('pt-BR')
              }
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}