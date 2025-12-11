/**
 * Serviço de Versionamento Git para Workflows
 *
 * Gerencia o versionamento de workflows do n8n usando Git,
 * permitindo commits, branches, diffs e rollbacks.
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs/promises'

const execAsync = promisify(exec)

export interface GitCommitInfo {
  hash: string
  shortHash: string
  author: string
  email: string
  date: string
  message: string
  branch: string
}

export interface GitDiffResult {
  additions: number
  deletions: number
  changes: Array<{
    type: 'add' | 'remove' | 'modify'
    path: string
    content?: string
  }>
}

export interface WorkflowGitOptions {
  workflowsDir?: string
  repoPath?: string
  defaultBranch?: string
}

export class WorkflowGit {
  private workflowsDir: string
  private repoPath: string
  private defaultBranch: string

  constructor(options: WorkflowGitOptions = {}) {
    this.workflowsDir = options.workflowsDir || 'workflows'
    this.repoPath = options.repoPath || process.cwd()
    this.defaultBranch = options.defaultBranch || 'main'
  }

  /**
   * Inicializa repositório Git se não existir
   */
  async init(): Promise<void> {
    try {
      await execAsync('git rev-parse --git-dir', { cwd: this.repoPath })
    } catch {
      // Repositório não existe, inicializar
      await execAsync('git init', { cwd: this.repoPath })
      await execAsync(`git checkout -b ${this.defaultBranch}`, { cwd: this.repoPath })
    }
  }

  /**
   * Salva um workflow como arquivo JSON no repositório
   */
  async saveWorkflow(workflowId: string, workflowName: string, workflowData: unknown): Promise<string> {
    const sanitizedName = workflowName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    const filename = `${sanitizedName}-${workflowId}.json`
    const filePath = path.join(this.repoPath, this.workflowsDir, filename)

    // Criar diretório se não existir
    await fs.mkdir(path.dirname(filePath), { recursive: true })

    // Salvar arquivo
    await fs.writeFile(filePath, JSON.stringify(workflowData, null, 2), 'utf-8')

    return filename
  }

  /**
   * Cria um commit para um workflow
   */
  async commit(
    workflowId: string,
    workflowName: string,
    workflowData: unknown,
    options: {
      message?: string
      author?: string
      email?: string
      branch?: string
    } = {}
  ): Promise<GitCommitInfo> {
    await this.init()

    // Mudar para branch se especificada
    if (options.branch && options.branch !== await this.getCurrentBranch()) {
      await this.createOrCheckoutBranch(options.branch)
    }

    // Salvar workflow
    const filename = await this.saveWorkflow(workflowId, workflowName, workflowData)
    const filePath = path.join(this.workflowsDir, filename)

    // Add arquivo
    await execAsync(`git add "${filePath}"`, { cwd: this.repoPath })

    // Criar commit
    const message = options.message || `chore: update workflow ${workflowName}`
    const authorInfo = options.author && options.email
      ? `--author="${options.author} <${options.email}>"`
      : ''

    await execAsync(`git commit -m "${message}" ${authorInfo}`, { cwd: this.repoPath })

    // Obter informações do commit
    const commitInfo = await this.getLatestCommit()
    return commitInfo
  }

  /**
   * Obtém o commit mais recente
   */
  async getLatestCommit(): Promise<GitCommitInfo> {
    const { stdout } = await execAsync(
      'git log -1 --format="%H|%h|%an|%ae|%ai|%s|%D"',
      { cwd: this.repoPath }
    )

    const [hash, shortHash, author, email, date, message, refs] = stdout.trim().split('|')
    const branch = refs.includes('HEAD ->')
      ? refs.split('HEAD -> ')[1].split(',')[0].trim()
      : await this.getCurrentBranch()

    return {
      hash,
      shortHash,
      author,
      email,
      date,
      message,
      branch
    }
  }

  /**
   * Obtém histórico de commits de um workflow
   */
  async getHistory(workflowId: string, limit: number = 20): Promise<GitCommitInfo[]> {
    try {
      // Buscar arquivo do workflow
      const { stdout: files } = await execAsync(
        `git ls-files "${this.workflowsDir}/*${workflowId}*.json"`,
        { cwd: this.repoPath }
      )

      if (!files.trim()) {
        return []
      }

      const filePath = files.trim().split('\n')[0]

      // Obter histórico
      const { stdout } = await execAsync(
        `git log -${limit} --format="%H|%h|%an|%ae|%ai|%s|%D" -- "${filePath}"`,
        { cwd: this.repoPath }
      )

      if (!stdout.trim()) {
        return []
      }

      return stdout.trim().split('\n').map((line: string) => {
        const [hash, shortHash, author, email, date, message, refs] = line.split('|')
        const branch = refs && refs.includes('HEAD ->')
          ? refs.split('HEAD -> ')[1].split(',')[0].trim()
          : ''

        return {
          hash,
          shortHash,
          author,
          email,
          date,
          message,
          branch
        }
      })
    } catch (error) {
      console.error('Error getting workflow history:', error)
      return []
    }
  }

  /**
   * Obtém diff entre duas versões
   */
  async diff(workflowId: string, commit1: string, commit2: string = 'HEAD'): Promise<GitDiffResult> {
    try {
      // Buscar arquivo do workflow
      const { stdout: files } = await execAsync(
        `git ls-files "${this.workflowsDir}/*${workflowId}*.json"`,
        { cwd: this.repoPath }
      )

      if (!files.trim()) {
        throw new Error('Workflow file not found')
      }

      const filePath = files.trim().split('\n')[0]

      // Obter estatísticas do diff
      const { stdout: stats } = await execAsync(
        `git diff --numstat ${commit1} ${commit2} -- "${filePath}"`,
        { cwd: this.repoPath }
      )

      const [additions = '0', deletions = '0'] = stats.trim().split('\t')

      // Obter diff detalhado
      const { stdout: diff } = await execAsync(
        `git diff ${commit1} ${commit2} -- "${filePath}"`,
        { cwd: this.repoPath }
      )

      // Parse diff para identificar mudanças
      const changes: GitDiffResult['changes'] = []
      const lines = diff.split('\n')

      for (const line of lines) {
        if (line.startsWith('+') && !line.startsWith('+++')) {
          changes.push({
            type: 'add',
            path: filePath,
            content: line.substring(1)
          })
        } else if (line.startsWith('-') && !line.startsWith('---')) {
          changes.push({
            type: 'remove',
            path: filePath,
            content: line.substring(1)
          })
        }
      }

      return {
        additions: parseInt(additions),
        deletions: parseInt(deletions),
        changes
      }
    } catch (error) {
      console.error('Error getting diff:', error)
      return {
        additions: 0,
        deletions: 0,
        changes: []
      }
    }
  }

  /**
   * Faz rollback para um commit específico
   */
  async rollback(workflowId: string, commitHash: string): Promise<unknown> {
    try {
      // Buscar arquivo do workflow
      const { stdout: files } = await execAsync(
        `git ls-files "${this.workflowsDir}/*${workflowId}*.json"`,
        { cwd: this.repoPath }
      )

      if (!files.trim()) {
        throw new Error('Workflow file not found')
      }

      const filePath = files.trim().split('\n')[0]

      // Obter conteúdo do commit
      const { stdout: content } = await execAsync(
        `git show ${commitHash}:"${filePath}"`,
        { cwd: this.repoPath }
      )

      // Parse JSON
      const workflowData = JSON.parse(content)

      // Salvar arquivo atual
      const fullPath = path.join(this.repoPath, filePath)
      await fs.writeFile(fullPath, content, 'utf-8')

      return workflowData
    } catch (error) {
      console.error('Error rolling back:', error)
      throw error
    }
  }

  /**
   * Lista todas as branches
   */
  async listBranches(): Promise<string[]> {
    try {
      const { stdout } = await execAsync('git branch --format="%(refname:short)"', { cwd: this.repoPath })
      return stdout.trim().split('\n').filter((b: string) => b)
    } catch (error) {
      console.error('Error listing branches:', error)
      return []
    }
  }

  /**
   * Obtém a branch atual
   */
  async getCurrentBranch(): Promise<string> {
    try {
      const { stdout } = await execAsync('git branch --show-current', { cwd: this.repoPath })
      return stdout.trim() || this.defaultBranch
    } catch (error) {
      console.error('Error getting current branch:', error)
      return this.defaultBranch
    }
  }

  /**
   * Cria ou faz checkout de uma branch
   */
  async createOrCheckoutBranch(branchName: string): Promise<void> {
    try {
      const branches = await this.listBranches()

      if (branches.includes(branchName)) {
        // Branch existe, fazer checkout
        await execAsync(`git checkout ${branchName}`, { cwd: this.repoPath })
      } else {
        // Branch não existe, criar
        await execAsync(`git checkout -b ${branchName}`, { cwd: this.repoPath })
      }
    } catch (error) {
      console.error('Error creating/checking out branch:', error)
      throw error
    }
  }

  /**
   * Faz merge de uma branch
   */
  async merge(sourceBranch: string, targetBranch?: string): Promise<void> {
    try {
      const currentBranch = await this.getCurrentBranch()
      const target = targetBranch || this.defaultBranch

      // Checkout da branch de destino
      if (currentBranch !== target) {
        await execAsync(`git checkout ${target}`, { cwd: this.repoPath })
      }

      // Fazer merge
      await execAsync(`git merge ${sourceBranch}`, { cwd: this.repoPath })

      // Voltar para branch original se necessário
      if (currentBranch !== target) {
        await execAsync(`git checkout ${currentBranch}`, { cwd: this.repoPath })
      }
    } catch (error) {
      console.error('Error merging branches:', error)
      throw error
    }
  }

  /**
   * Deleta uma branch
   */
  async deleteBranch(branchName: string, force: boolean = false): Promise<void> {
    try {
      const flag = force ? '-D' : '-d'
      await execAsync(`git branch ${flag} ${branchName}`, { cwd: this.repoPath })
    } catch (error) {
      console.error('Error deleting branch:', error)
      throw error
    }
  }

  /**
   * Cria uma tag
   */
  async createTag(tagName: string, message?: string, commitHash?: string): Promise<void> {
    try {
      const messageArg = message ? `-m "${message}"` : ''
      const commit = commitHash || 'HEAD'
      await execAsync(`git tag -a ${tagName} ${messageArg} ${commit}`, { cwd: this.repoPath })
    } catch (error) {
      console.error('Error creating tag:', error)
      throw error
    }
  }

  /**
   * Lista todas as tags
   */
  async listTags(): Promise<string[]> {
    try {
      const { stdout } = await execAsync('git tag', { cwd: this.repoPath })
      return stdout.trim().split('\n').filter((t: string) => t)
    } catch (error) {
      console.error('Error listing tags:', error)
      return []
    }
  }

  /**
   * Obtém o conteúdo de um workflow em um commit específico
   */
  async getWorkflowAtCommit(workflowId: string, commitHash: string): Promise<unknown> {
    try {
      // Buscar arquivo do workflow
      const { stdout: files } = await execAsync(
        `git ls-files "${this.workflowsDir}/*${workflowId}*.json"`,
        { cwd: this.repoPath }
      )

      if (!files.trim()) {
        throw new Error('Workflow file not found')
      }

      const filePath = files.trim().split('\n')[0]

      // Obter conteúdo
      const { stdout: content } = await execAsync(
        `git show ${commitHash}:"${filePath}"`,
        { cwd: this.repoPath }
      )

      return JSON.parse(content)
    } catch (error) {
      console.error('Error getting workflow at commit:', error)
      throw error
    }
  }
}

// Instância singleton
let workflowGit: WorkflowGit | null = null

export function getWorkflowGit(options?: WorkflowGitOptions): WorkflowGit {
  if (!workflowGit) {
    workflowGit = new WorkflowGit(options)
  }
  return workflowGit
}
