import { NextRequest, NextResponse } from 'next/server'

const INDEXNOW_KEY = 'e53ec1808701e6b8af6a265d09c3df019cf21cb234b2d33a1d7054290d3064fb'
const HOST = 'atma.roilabs.com.br'

// Search engines that support IndexNow
const SEARCH_ENGINES = [
  'https://api.indexnow.org/indexnow', // Universal endpoint
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow',
  'https://api.naver.com/indexnow',
]

interface IndexNowRequest {
  urls?: string[]
  url?: string
}

/**
 * POST /api/indexnow
 * Submit URLs to IndexNow protocol for instant indexing
 *
 * Body: { urls: string[] } or { url: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body: IndexNowRequest = await request.json()

    // Extract URLs from request
    const urls = body.urls || (body.url ? [body.url] : [])

    if (urls.length === 0) {
      return NextResponse.json(
        { error: 'No URLs provided' },
        { status: 400 }
      )
    }

    // Validate URLs (max 10,000)
    if (urls.length > 10000) {
      return NextResponse.json(
        { error: 'Maximum 10,000 URLs per request' },
        { status: 400 }
      )
    }

    // Ensure all URLs belong to our host
    const validUrls = urls.filter(url => {
      try {
        const urlObj = new URL(url)
        return urlObj.hostname === HOST || urlObj.hostname === `www.${HOST}`
      } catch {
        return false
      }
    })

    if (validUrls.length === 0) {
      return NextResponse.json(
        { error: 'No valid URLs for this host' },
        { status: 422 }
      )
    }

    // Prepare IndexNow payload
    const payload = {
      host: HOST,
      key: INDEXNOW_KEY,
      urlList: validUrls
    }

    // Submit to search engines in parallel
    const results = await Promise.allSettled(
      SEARCH_ENGINES.map(async (endpoint) => {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify(payload),
        })

        return {
          engine: endpoint,
          status: response.status,
          ok: response.ok,
        }
      })
    )

    // Count successes
    const successful = results.filter(
      (result) => result.status === 'fulfilled' && result.value.ok
    ).length

    return NextResponse.json({
      success: true,
      submitted: validUrls.length,
      engines: results.map((result) =>
        result.status === 'fulfilled' ? result.value : { error: 'Failed' }
      ),
      successfulSubmissions: successful,
    })
  } catch (error) {
    console.error('IndexNow submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/indexnow?url=...
 * Submit a single URL via GET request
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter required' },
      { status: 400 }
    )
  }

  // Validate URL belongs to our host
  try {
    const urlObj = new URL(url)
    if (urlObj.hostname !== HOST && urlObj.hostname !== `www.${HOST}`) {
      return NextResponse.json(
        { error: 'URL must belong to atma.roilabs.com.br' },
        { status: 422 }
      )
    }
  } catch {
    return NextResponse.json(
      { error: 'Invalid URL format' },
      { status: 400 }
    )
  }

  // Submit to IndexNow
  try {
    const results = await Promise.allSettled(
      SEARCH_ENGINES.map(async (endpoint) => {
        const indexNowUrl = new URL(endpoint)
        indexNowUrl.searchParams.set('url', url)
        indexNowUrl.searchParams.set('key', INDEXNOW_KEY)

        const response = await fetch(indexNowUrl.toString())

        return {
          engine: endpoint,
          status: response.status,
          ok: response.ok,
        }
      })
    )

    const successful = results.filter(
      (result) => result.status === 'fulfilled' && result.value.ok
    ).length

    return NextResponse.json({
      success: true,
      url,
      engines: results.map((result) =>
        result.status === 'fulfilled' ? result.value : { error: 'Failed' }
      ),
      successfulSubmissions: successful,
    })
  } catch (error) {
    console.error('IndexNow submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
