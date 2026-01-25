import { headersWithCors, type PayloadRequest } from 'payload'

type LocaleValue = PayloadRequest['locale']

const normalizeParam = (value: string | null): string | undefined => {
  if (!value || value === 'null' || value === 'undefined') {
    return undefined
  }
  return value
}

export const getQueryParam = (req: PayloadRequest, key: string): string | undefined => {
  const url = new URL(req.url ?? '', 'http://localhost')
  return normalizeParam(url.searchParams.get(key))
}

export const getLocaleFromRequest = (req: PayloadRequest): LocaleValue => {
  const localeParam = getQueryParam(req, 'locale')
  if (!localeParam) {
    return undefined
  }

  if (localeParam === 'all') {
    return 'all' as LocaleValue
  }

  const localization = req.payload.config.localization
  const localeCodes = localization ? localization.localeCodes : []
  return localeCodes.includes(localeParam) ? (localeParam as LocaleValue) : undefined
}

export const buildJsonResponse = (req: PayloadRequest, data: unknown): Response => {
  const headers = headersWithCors({
    headers: new Headers({ 'Content-Type': 'application/json' }),
    req,
  })

  return new Response(JSON.stringify(data), {
    status: 200,
    headers,
  })
}
