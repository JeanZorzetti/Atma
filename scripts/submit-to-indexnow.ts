/**
 * Script to manually submit URLs to IndexNow
 *
 * Usage:
 *   npm run indexnow              # Submit entire sitemap
 *   npm run indexnow -- --url https://atma.roilabs.com.br/pacientes
 *   npm run indexnow -- --urls url1 url2 url3
 */

const INDEXNOW_KEY = 'e53ec1808701e6b8af6a265d09c3df019cf21cb234b2d33a1d7054290d3064fb'
const HOST = 'atma.roilabs.com.br'
const BASE_URL = `https://${HOST}`

const SEARCH_ENGINES = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow',
]

interface IndexNowPayload {
  host: string
  key: string
  urlList: string[]
}

async function fetchSitemapUrls(): Promise<string[]> {
  console.log('📥 Fetching sitemap...')
  const response = await fetch(`${BASE_URL}/sitemap.xml`)
  const text = await response.text()

  const urlMatches = text.matchAll(/<loc>(.*?)<\/loc>/g)
  const urls = Array.from(urlMatches).map(match => match[1])

  console.log(`✅ Found ${urls.length} URLs in sitemap`)
  return urls
}

async function submitToIndexNow(urls: string[]) {
  console.log(`\n🚀 Submitting ${urls.length} URLs to IndexNow...`)

  const payload: IndexNowPayload = {
    host: HOST,
    key: INDEXNOW_KEY,
    urlList: urls,
  }

  const results = await Promise.allSettled(
    SEARCH_ENGINES.map(async (endpoint) => {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify(payload),
        })

        const engineName = new URL(endpoint).hostname

        if (response.ok) {
          console.log(`✅ ${engineName}: Success (${response.status})`)
          return { engine: engineName, success: true, status: response.status }
        } else {
          console.log(`⚠️  ${engineName}: ${response.status} ${response.statusText}`)
          return { engine: engineName, success: false, status: response.status }
        }
      } catch (error) {
        const engineName = new URL(endpoint).hostname
        console.log(`❌ ${engineName}: ${error instanceof Error ? error.message : 'Failed'}`)
        return { engine: engineName, success: false, error }
      }
    })
  )

  const successful = results.filter(
    (r) => r.status === 'fulfilled' && r.value.success
  ).length

  console.log(`\n📊 Results: ${successful}/${SEARCH_ENGINES.length} engines notified successfully`)

  return results
}

async function main() {
  const args = process.argv.slice(2)

  let urlsToSubmit: string[] = []

  // Parse command line arguments
  if (args.includes('--url')) {
    const urlIndex = args.indexOf('--url')
    const url = args[urlIndex + 1]
    if (url) {
      urlsToSubmit = [url]
      console.log(`📝 Submitting single URL: ${url}`)
    }
  } else if (args.includes('--urls')) {
    const urlsIndex = args.indexOf('--urls')
    urlsToSubmit = args.slice(urlsIndex + 1)
    console.log(`📝 Submitting ${urlsToSubmit.length} URLs`)
  } else {
    // Default: submit entire sitemap
    console.log('📝 No specific URLs provided, submitting entire sitemap...')
    urlsToSubmit = await fetchSitemapUrls()
  }

  if (urlsToSubmit.length === 0) {
    console.error('❌ No URLs to submit')
    process.exit(1)
  }

  // Validate URLs
  const validUrls = urlsToSubmit.filter(url => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname === HOST || urlObj.hostname === `www.${HOST}`
    } catch {
      console.warn(`⚠️  Invalid URL skipped: ${url}`)
      return false
    }
  })

  if (validUrls.length === 0) {
    console.error('❌ No valid URLs to submit')
    process.exit(1)
  }

  if (validUrls.length < urlsToSubmit.length) {
    console.warn(`⚠️  ${urlsToSubmit.length - validUrls.length} invalid URLs were skipped`)
  }

  // Submit to IndexNow
  await submitToIndexNow(validUrls)

  console.log('\n✨ Done!')
}

main().catch((error) => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})
