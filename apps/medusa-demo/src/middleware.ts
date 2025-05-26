import type { HttpTypes } from '@medusajs/types'
import { type NextRequest, NextResponse } from 'next/server'

const BACKEND_URL =
  process.env.MEDUSA_BACKEND_URL || // Intended for server-side contexts
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || // Fallback or for contexts where only NEXT_PUBLIC_ is available
  'http://medusa-be:9000' // Default fallback

// Log initial backend URL determination
console.log(
  `[Middleware Init] BACKEND_URL determined as: ${BACKEND_URL}. ` +
    `(process.env.MEDUSA_BACKEND_URL: ${process.env.MEDUSA_BACKEND_URL}, ` +
    `process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL: ${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL})`
)

const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || 'us'

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(), // Initialize with current time
}

async function getRegionMap() {
  const { regionMap, regionMapUpdated } = regionMapCache

  console.log(
    `[Middleware getRegionMap] Called. Current NODE_ENV: ${process.env.NODE_ENV}`
  )

  // Logic for development environment (mock regions)
  if (process.env.NODE_ENV === 'development') {
    console.log(
      '[Middleware getRegionMap] In development mode, attempting to use mock regions.'
    )
    if (!regionMap.size) {
      // Only populate if empty
      const defaultRegion: HttpTypes.StoreRegion = {
        id: 'mock-region-id',
        name: 'Development Region',
        countries: [
          { id: 'gb-id', iso_2: 'gb' },
          { id: 'us-id', iso_2: 'us' },
        ],
        currency_code: 'gbp',
      }
      defaultRegion.countries?.forEach((c) => {
        regionMapCache.regionMap.set(c.iso_2 ?? '', defaultRegion)
      })
      console.log(
        '[Middleware getRegionMap] Mock regions populated for development.'
      )
    }
    return regionMapCache.regionMap
  }

  // Logic for non-development environments (fetch from API)
  // Condition to refresh: map is empty OR cache is older than 1 hour (3600 * 1000 ms)
  if (
    !regionMap.keys().next().value || // Check if map is empty
    regionMapUpdated < Date.now() - 3600 * 1000
  ) {
    console.log(
      `[Middleware getRegionMap] Cache stale or empty. Fetching regions from: ${BACKEND_URL}/store/regions`
    )
    try {
      const res = await fetch(`${BACKEND_URL}/store/regions`, {
        headers: {
          'x-publishable-api-key': PUBLISHABLE_API_KEY!,
        },
        next: {
          revalidate: 3600, // Revalidate time in seconds
          tags: ['regions'],
        },
      })
      console.log(
        `[Middleware getRegionMap] Fetch response status: ${res.status}`
      )

      if (!res.ok) {
        const errorText = await res.text() // Attempt to get error body
        console.error(
          `[Middleware getRegionMap] Failed to fetch regions. Status: ${res.status}. Response: ${errorText}`
        )
        // Return current cache (even if stale/empty) to prevent full app crash
        return regionMapCache.regionMap
      }

      const { regions } = await res.json()

      if (!regions || !regions.length) {
        console.warn(
          '[Middleware getRegionMap] No regions data returned from API or regions array is empty.'
        )
        // Return current cache; calling notFound() here might be too disruptive
        return regionMapCache.regionMap
      }

      console.log(
        `[Middleware getRegionMap] Successfully fetched ${regions.length} regions.`
      )
      regionMapCache.regionMap.clear() // Clear old entries before populating
      regions.forEach((region: HttpTypes.StoreRegion) => {
        region.countries?.forEach((c) => {
          regionMapCache.regionMap.set(c.iso_2 ?? '', region)
        })
      })
      regionMapCache.regionMapUpdated = Date.now() // Update timestamp
      console.log('[Middleware getRegionMap] Region map updated from API.')
    } catch (error) {
      console.error(
        `[Middleware getRegionMap] CRITICAL ERROR during region fetch: ${error instanceof Error ? error.message : String(error)}`
      )
      // In case of a critical fetch error, return current cache to allow app to try to continue
      return regionMapCache.regionMap
    }
  } else {
    console.log('[Middleware getRegionMap] Using cached region map.')
  }
  return regionMapCache.regionMap
}

async function getCountryCode(
  request: NextRequest,
  regionMap: Map<string, HttpTypes.StoreRegion | number> // Type from original code
) {
  try {
    let countryCode
    const vercelCountryCode = request.headers
      .get('x-vercel-ip-country')
      ?.toLowerCase()
    const urlCountryCode = request.nextUrl.pathname.split('/')[1]?.toLowerCase()

    console.log(
      `[Middleware getCountryCode] Vercel IP: ${vercelCountryCode}, URL path segment: ${urlCountryCode}, Default region: ${DEFAULT_REGION}`
    )

    if (urlCountryCode && regionMap.has(urlCountryCode)) {
      countryCode = urlCountryCode
    } else if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
      countryCode = vercelCountryCode
    } else if (regionMap.has(DEFAULT_REGION)) {
      countryCode = DEFAULT_REGION
    } else if (regionMap.keys().next().value) {
      // Fallback to the first available region's country
      countryCode = regionMap.keys().next().value
    }
    console.log(
      `[Middleware getCountryCode] Determined countryCode: ${countryCode}`
    )
    return countryCode
  } catch (error) {
    console.error(
      `[Middleware getCountryCode] Error determining country code: ${error instanceof Error ? error.message : String(error)}`
    )
    return undefined // Return undefined on error
  }
}

export async function middleware(request: NextRequest) {
  console.log(
    `[Middleware] Handling request for: ${request.nextUrl.pathname}${request.nextUrl.search}. NODE_ENV: ${process.env.NODE_ENV}`
  )
  const regionMap = await getRegionMap()

  if (!regionMap || regionMap.size === 0) {
    console.warn(
      '[Middleware] Region map is empty or undefined after getRegionMap. Proceeding without region-based redirection.'
    )
    // If region map is not available, skip region-specific logic
    return NextResponse.next()
  }

  const countryCode = await getCountryCode(request, regionMap)

  const urlHasCountryCode =
    countryCode && request.nextUrl.pathname.split('/')[1].includes(countryCode)

  if (urlHasCountryCode) {
    console.log(
      `[Middleware] URL '${request.nextUrl.pathname}' already contains country code '${countryCode}'. Passing through.`
    )
    return NextResponse.next()
  }

  const redirectPath =
    request.nextUrl.pathname === '/' ? '' : request.nextUrl.pathname
  const queryString = request.nextUrl.search ? request.nextUrl.search : ''

  if (!urlHasCountryCode && countryCode) {
    const redirectUrl = `${request.nextUrl.origin}/${countryCode}${redirectPath}${queryString}`
    console.log(`[Middleware] Redirecting to: ${redirectUrl}`)
    return NextResponse.redirect(redirectUrl, 307) // Use 307 for temporary redirect, preserving method
  } else {
    console.log(
      '[Middleware] No country code determined for redirection or no redirect needed. Passing through.'
    )
  }

  return NextResponse.next() // Default pass-through if no other action taken
}

export const config = {
  matcher: [
    // Match all paths except for API routes, static files, images, etc.
    '/((?!api/|_next/|favicon.ico|images/|robots.txt).*)',
  ],
}
