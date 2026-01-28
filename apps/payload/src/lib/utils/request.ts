import type { PayloadRequest } from 'payload'

const RETURN_HTML_HEADER = 'x-payload-return-html'

export const shouldReturnHtmlForRequest = (req?: PayloadRequest): boolean => {
  if (!req || req.method !== 'GET') {
    return false
  }

  const headerValue = req.headers?.get?.(RETURN_HTML_HEADER)
  return headerValue === 'true'
}
