import { NextRequest, NextResponse } from 'next/server'
import {
  dataAnonymizer,
  AnonymizationLevel,
  SensitiveDataType,
} from '@/lib/data-anonymization'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'config': {
        const config = dataAnonymizer.getConfig()
        return NextResponse.json({ config })
      }

      case 'stats': {
        const stats = dataAnonymizer.getAnonymizationStats()
        return NextResponse.json({ stats })
      }

      case 'test-anonymize': {
        const testData = searchParams.get('data')
        if (!testData) {
          return NextResponse.json({ error: 'Data is required' }, { status: 400 })
        }

        const parsed = JSON.parse(testData)
        const result = dataAnonymizer.anonymizeObject(parsed)

        return NextResponse.json({ result })
      }

      case 'check-sensitive': {
        const data = searchParams.get('data')
        if (!data) {
          return NextResponse.json({ error: 'Data is required' }, { status: 400 })
        }

        const hasSensitiveData = dataAnonymizer.containsSensitiveData(data)

        return NextResponse.json({ hasSensitiveData })
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error in Compliance GET:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const body = await request.json()

    switch (action) {
      case 'update-config': {
        const { level, fieldsToAnonymize, preserveFormat, hashSalt } = body as {
          level?: AnonymizationLevel
          fieldsToAnonymize?: SensitiveDataType[]
          preserveFormat?: boolean
          hashSalt?: string
        }

        dataAnonymizer.updateConfig({
          ...(level && { level }),
          ...(fieldsToAnonymize && { fieldsToAnonymize }),
          ...(preserveFormat !== undefined && { preserveFormat }),
          ...(hashSalt && { hashSalt }),
        })

        return NextResponse.json({ success: true, config: dataAnonymizer.getConfig() })
      }

      case 'anonymize-data': {
        const { data, level } = body as {
          data: unknown
          level?: AnonymizationLevel
        }

        if (!data) {
          return NextResponse.json({ error: 'Data is required' }, { status: 400 })
        }

        const result = dataAnonymizer.anonymizeObject(data, level)

        return NextResponse.json({ result })
      }

      case 'anonymize-execution': {
        const { execution } = body as {
          execution: unknown
        }

        if (!execution) {
          return NextResponse.json({ error: 'Execution is required' }, { status: 400 })
        }

        const anonymized = dataAnonymizer.anonymizeExecution(execution)

        return NextResponse.json({ anonymized })
      }

      case 'anonymize-log': {
        const { log } = body as {
          log: unknown
        }

        if (!log) {
          return NextResponse.json({ error: 'Log is required' }, { status: 400 })
        }

        const anonymized = dataAnonymizer.anonymizeLog(log)

        return NextResponse.json({ anonymized })
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error in Compliance POST:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
