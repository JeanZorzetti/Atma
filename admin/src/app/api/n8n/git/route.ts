import { NextResponse } from 'next/server'
import { getWorkflowGit } from '@/lib/workflow-git'
import { prisma } from '@/lib/prisma'

// GET - Obter histórico Git de um workflow
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const workflowId = searchParams.get('workflowId')

    const git = getWorkflowGit()

    switch (action) {
      case 'history': {
        if (!workflowId) {
          return NextResponse.json(
            { error: 'workflowId is required' },
            { status: 400 }
          )
        }

        const limit = parseInt(searchParams.get('limit') || '20')
        const history = await git.getHistory(workflowId, limit)

        return NextResponse.json({ history })
      }

      case 'branches': {
        const branches = await git.listBranches()
        const currentBranch = await git.getCurrentBranch()

        return NextResponse.json({
          branches,
          currentBranch
        })
      }

      case 'tags': {
        const tags = await git.listTags()
        return NextResponse.json({ tags })
      }

      case 'diff': {
        if (!workflowId) {
          return NextResponse.json(
            { error: 'workflowId is required' },
            { status: 400 }
          )
        }

        const commit1 = searchParams.get('commit1')
        const commit2 = searchParams.get('commit2') || 'HEAD'

        if (!commit1) {
          return NextResponse.json(
            { error: 'commit1 is required' },
            { status: 400 }
          )
        }

        const diff = await git.diff(workflowId, commit1, commit2)
        return NextResponse.json({ diff })
      }

      case 'content': {
        if (!workflowId) {
          return NextResponse.json(
            { error: 'workflowId is required' },
            { status: 400 }
          )
        }

        const commitHash = searchParams.get('commit')
        if (!commitHash) {
          return NextResponse.json(
            { error: 'commit is required' },
            { status: 400 }
          )
        }

        const content = await git.getWorkflowAtCommit(workflowId, commitHash)
        return NextResponse.json({ content })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action. Valid actions: history, branches, tags, diff, content' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error in Git API:', error)
    return NextResponse.json(
      {
        error: 'Failed to execute Git operation',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST - Criar commit, branch, tag ou merge
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action } = body

    const git = getWorkflowGit()

    switch (action) {
      case 'commit': {
        const {
          workflowId,
          workflowName,
          workflowData,
          message,
          author,
          email,
          branch
        } = body

        if (!workflowId || !workflowName || !workflowData) {
          return NextResponse.json(
            { error: 'workflowId, workflowName, and workflowData are required' },
            { status: 400 }
          )
        }

        const commitInfo = await git.commit(workflowId, workflowName, workflowData, {
          message,
          author,
          email,
          branch
        })

        // Atualizar versão no banco de dados
        const metadata = await prisma.workflowMetadata.findUnique({
          where: { workflowId }
        })

        if (metadata) {
          // Criar nova versão
          await prisma.workflowVersion.create({
            data: {
              workflowId,
              version: `git-${commitInfo.shortHash}`,
              description: commitInfo.message,
              changeType: 'patch',
              workflowData: workflowData as object,
              gitCommitHash: commitInfo.hash,
              gitBranch: commitInfo.branch,
              createdBy: author,
              createdByEmail: email,
              changelog: commitInfo.message,
              isActive: false,
              isStable: true
            }
          })
        }

        return NextResponse.json({ commit: commitInfo })
      }

      case 'branch': {
        const { branchName } = body

        if (!branchName) {
          return NextResponse.json(
            { error: 'branchName is required' },
            { status: 400 }
          )
        }

        await git.createOrCheckoutBranch(branchName)
        const currentBranch = await git.getCurrentBranch()

        return NextResponse.json({
          success: true,
          currentBranch
        })
      }

      case 'merge': {
        const { sourceBranch, targetBranch } = body

        if (!sourceBranch) {
          return NextResponse.json(
            { error: 'sourceBranch is required' },
            { status: 400 }
          )
        }

        await git.merge(sourceBranch, targetBranch)

        return NextResponse.json({ success: true })
      }

      case 'tag': {
        const { tagName, message, commitHash } = body

        if (!tagName) {
          return NextResponse.json(
            { error: 'tagName is required' },
            { status: 400 }
          )
        }

        await git.createTag(tagName, message, commitHash)

        return NextResponse.json({ success: true })
      }

      case 'rollback': {
        const { workflowId, commitHash } = body

        if (!workflowId || !commitHash) {
          return NextResponse.json(
            { error: 'workflowId and commitHash are required' },
            { status: 400 }
          )
        }

        const workflowData = await git.rollback(workflowId, commitHash)

        // Criar nova versão no banco
        const metadata = await prisma.workflowMetadata.findUnique({
          where: { workflowId }
        })

        if (metadata) {
          const commitInfo = await git.getLatestCommit()

          await prisma.workflowVersion.create({
            data: {
              workflowId,
              version: `rollback-${commitInfo.shortHash}`,
              description: `Rollback to ${commitHash}`,
              changeType: 'hotfix',
              workflowData: workflowData as object,
              gitCommitHash: commitHash,
              gitBranch: commitInfo.branch,
              changelog: `Rolled back to commit ${commitHash}`,
              isActive: true,
              isStable: true
            }
          })

          // Desativar outras versões
          await prisma.workflowVersion.updateMany({
            where: {
              workflowId,
              isActive: true,
              version: { not: `rollback-${commitInfo.shortHash}` }
            },
            data: { isActive: false }
          })
        }

        return NextResponse.json({
          success: true,
          workflowData
        })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action. Valid actions: commit, branch, merge, tag, rollback' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error in Git API POST:', error)
    return NextResponse.json(
      {
        error: 'Failed to execute Git operation',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// DELETE - Deletar branch
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const branchName = searchParams.get('branch')
    const force = searchParams.get('force') === 'true'

    if (!branchName) {
      return NextResponse.json(
        { error: 'branch is required' },
        { status: 400 }
      )
    }

    const git = getWorkflowGit()
    await git.deleteBranch(branchName, force)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting branch:', error)
    return NextResponse.json(
      {
        error: 'Failed to delete branch',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
