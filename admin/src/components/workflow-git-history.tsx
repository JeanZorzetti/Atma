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
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import {
  GitBranch,
  GitCommit,
  GitMerge,
  Clock,
  User,
  RotateCcw,
  FileText,
  ChevronRight,
  Loader2,
  GitCompare,
  Tag
} from 'lucide-react'

interface GitCommitInfo {
  hash: string
  shortHash: string
  author: string
  email: string
  date: string
  message: string
  branch: string
}

interface GitDiff {
  additions: number
  deletions: number
  changes: Array<{
    type: 'add' | 'remove' | 'modify'
    path: string
    content?: string
  }>
}

interface WorkflowGitHistoryProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workflowId: string
  workflowName: string
}

export function WorkflowGitHistory({
  open,
  onOpenChange,
  workflowId,
  workflowName
}: WorkflowGitHistoryProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<GitCommitInfo[]>([])
  const [branches, setBranches] = useState<string[]>([])
  const [currentBranch, setCurrentBranch] = useState<string>('')
  const [tags, setTags] = useState<string[]>([])
  const [selectedCommit1, setSelectedCommit1] = useState<string | null>(null)
  const [selectedCommit2, setSelectedCommit2] = useState<string | null>(null)
  const [diff, setDiff] = useState<GitDiff | null>(null)
  const [showDiff, setShowDiff] = useState(false)
  const [loadingDiff, setLoadingDiff] = useState(false)
  const [rollingBack, setRollingBack] = useState(false)

  useEffect(() => {
    if (open && workflowId) {
      loadGitData()
    }
  }, [open, workflowId])

  const loadGitData = async () => {
    setLoading(true)
    try {
      // Carregar histórico
      const historyResponse = await fetch(
        `/api/n8n/git?action=history&workflowId=${workflowId}&limit=50`
      )
      if (historyResponse.ok) {
        const data = await historyResponse.json()
        setHistory(data.history || [])
      }

      // Carregar branches
      const branchesResponse = await fetch('/api/n8n/git?action=branches')
      if (branchesResponse.ok) {
        const data = await branchesResponse.json()
        setBranches(data.branches || [])
        setCurrentBranch(data.currentBranch || '')
      }

      // Carregar tags
      const tagsResponse = await fetch('/api/n8n/git?action=tags')
      if (tagsResponse.ok) {
        const data = await tagsResponse.json()
        setTags(data.tags || [])
      }
    } catch (error) {
      console.error('Error loading Git data:', error)
      toast({
        title: 'Erro ao carregar histórico',
        description: 'Não foi possível carregar o histórico Git',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCompare = async () => {
    if (!selectedCommit1 || !selectedCommit2) {
      toast({
        title: 'Selecione dois commits',
        description: 'Você precisa selecionar dois commits para comparar',
        variant: 'destructive'
      })
      return
    }

    setLoadingDiff(true)
    try {
      const response = await fetch(
        `/api/n8n/git?action=diff&workflowId=${workflowId}&commit1=${selectedCommit1}&commit2=${selectedCommit2}`
      )

      if (!response.ok) {
        throw new Error('Failed to get diff')
      }

      const data = await response.json()
      setDiff(data.diff)
      setShowDiff(true)
    } catch (error) {
      toast({
        title: 'Erro ao comparar',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive'
      })
    } finally {
      setLoadingDiff(false)
    }
  }

  const handleRollback = async (commitHash: string) => {
    if (!confirm(`Tem certeza que deseja fazer rollback para o commit ${commitHash.substring(0, 7)}?`)) {
      return
    }

    setRollingBack(true)
    try {
      const response = await fetch('/api/n8n/git', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'rollback',
          workflowId,
          commitHash
        })
      })

      if (!response.ok) {
        throw new Error('Failed to rollback')
      }

      toast({
        title: 'Rollback realizado',
        description: 'O workflow foi restaurado para a versão selecionada'
      })

      // Recarregar histórico
      await loadGitData()
    } catch (error) {
      toast({
        title: 'Erro ao fazer rollback',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive'
      })
    } finally {
      setRollingBack(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const selectCommit = (commitHash: string) => {
    if (!selectedCommit1) {
      setSelectedCommit1(commitHash)
    } else if (!selectedCommit2 && commitHash !== selectedCommit1) {
      setSelectedCommit2(commitHash)
    } else {
      // Reset seleção
      setSelectedCommit1(commitHash)
      setSelectedCommit2(null)
      setShowDiff(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Histórico Git: {workflowName}
          </DialogTitle>
          <DialogDescription>
            Visualize o histórico de commits, compare versões e faça rollback
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Info da branch atual */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Branch Atual:</span>
                      <Badge variant="secondary">{currentBranch || 'main'}</Badge>
                    </div>
                    {tags.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Tags:</span>
                        {tags.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                        {tags.length > 3 && (
                          <span className="text-sm text-muted-foreground">+{tags.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                  {selectedCommit1 && selectedCommit2 && (
                    <Button
                      onClick={handleCompare}
                      disabled={loadingDiff}
                      size="sm"
                    >
                      {loadingDiff ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <GitCompare className="mr-2 h-4 w-4" />
                      )}
                      Comparar Selecionados
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Diff viewer */}
            {showDiff && diff && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Diferenças</h3>
                      <div className="flex gap-2">
                        <Badge variant="default" className="bg-green-600">
                          +{diff.additions} adições
                        </Badge>
                        <Badge variant="default" className="bg-red-600">
                          -{diff.deletions} remoções
                        </Badge>
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto border rounded-lg p-3 bg-slate-950 text-slate-50 font-mono text-xs">
                      {diff.changes.map((change, idx) => (
                        <div
                          key={idx}
                          className={`${
                            change.type === 'add'
                              ? 'bg-green-950/50 text-green-400'
                              : change.type === 'remove'
                              ? 'bg-red-950/50 text-red-400'
                              : 'text-slate-300'
                          } px-1`}
                        >
                          {change.type === 'add' && '+ '}
                          {change.type === 'remove' && '- '}
                          {change.content}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lista de commits */}
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <GitCommit className="h-4 w-4" />
                Histórico de Commits
                {(selectedCommit1 || selectedCommit2) && (
                  <span className="text-sm text-muted-foreground">
                    (Clique para selecionar/desselecionar)
                  </span>
                )}
              </h3>

              {history.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <GitCommit className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Nenhum commit encontrado para este workflow</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {history.map((commit) => {
                    const isSelected =
                      commit.hash === selectedCommit1 || commit.hash === selectedCommit2

                    return (
                      <Card
                        key={commit.hash}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                        }`}
                        onClick={() => selectCommit(commit.hash)}
                      >
                        <CardContent className="py-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="font-mono text-xs">
                                  {commit.shortHash}
                                </Badge>
                                {commit.branch && (
                                  <Badge variant="secondary" className="text-xs">
                                    <GitBranch className="h-3 w-3 mr-1" />
                                    {commit.branch}
                                  </Badge>
                                )}
                                {isSelected && (
                                  <Badge variant="default" className="text-xs">
                                    Selecionado
                                  </Badge>
                                )}
                              </div>
                              <p className="font-medium text-sm mb-1">{commit.message}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {commit.author}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDate(commit.date)}
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRollback(commit.hash)
                                }}
                                disabled={rollingBack}
                              >
                                <RotateCcw className="h-3 w-3 mr-1" />
                                Rollback
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
