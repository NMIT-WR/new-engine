import type { MedusaRequest } from "@medusajs/framework/http"

/**
 * Read a query string value from a Medusa request, returning the first value.
 */
export function getQueryParam(
  req: MedusaRequest,
  key: string
): string | undefined {
  const query = req.query as Record<string, unknown> | undefined
  const value = query?.[key]
  if (typeof value === "string") {
    return value
  }
  if (Array.isArray(value)) {
    const first = value[0]
    return typeof first === "string" ? first : undefined
  }

  const url = req.url ?? ""
  try {
    const parsed = new URL(url, "http://localhost")
    const fallback = parsed.searchParams.get(key)
    return fallback ?? undefined
  } catch {
    return undefined
  }
}
