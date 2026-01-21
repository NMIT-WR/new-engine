import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  PayloadRequest,
} from 'payload'

type MedusaInvalidatePayload = {
  collection: string
  doc?: {
    id?: string
    slug?: string
    locale?: string
  }
}

type CmsDoc = {
  id?: string | number
  slug?: string | Record<string, unknown>
}

let loggedMissingBaseUrl = false

const getMedusaBaseUrl = (): string | null => {
  const baseUrl = process.env.MEDUSA_BACKEND_URL

  if (!baseUrl || baseUrl === 'null' || baseUrl === 'undefined') {
    return null
  }

  return baseUrl.replace(/\/$/, '')
}

const resolveSlug = (doc: CmsDoc | undefined, locale?: string): string | undefined => {
  if (!doc) {
    return undefined
  }

  if (typeof doc.slug === 'string') {
    return doc.slug
  }

  if (doc.slug && typeof doc.slug === 'object' && locale) {
    const localized = (doc.slug as Record<string, unknown>)[locale]
    return typeof localized === 'string' ? localized : undefined
  }

  return undefined
}

const notifyMedusa = async (
  payload: MedusaInvalidatePayload,
  req?: PayloadRequest | null
): Promise<void> => {
  const baseUrl = getMedusaBaseUrl()
  if (!baseUrl) {
    if (!loggedMissingBaseUrl) {
      loggedMissingBaseUrl = true
      req?.payload?.logger?.warn?.(
        'MEDUSA_BACKEND_URL is not set; skipping CMS cache invalidation.'
      )
    }
    return
  }

  try {
    const response = await fetch(`${baseUrl}/hooks/cms/invalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const message = await response.text().catch(() => '')
      req?.payload?.logger?.error?.(
        `CMS cache invalidation failed (${response.status}): ${message}`
      )
    }
  } catch (error) {
    req?.payload?.logger?.error?.(
      `CMS cache invalidation request failed: ${
        error instanceof Error ? error.message : String(error)
      }`
    )
  }
}

export const createMedusaCacheHook = (
  collection: string
): CollectionAfterChangeHook & CollectionAfterDeleteHook => {
  const invalidateCache = async ({
    doc,
    req,
    operation,
  }: {
    doc?: CmsDoc
    req?: PayloadRequest | null
    operation?: string
  }) => {
    if (operation && operation !== 'create' && operation !== 'update') {
      return doc
    }

    const isDelete = !operation
    const locale = isDelete ? undefined : req?.locale
    const cmsDoc = doc as CmsDoc | undefined
    const payload: MedusaInvalidatePayload = {
      collection,
      doc: {
        id: cmsDoc?.id ? String(cmsDoc.id) : undefined,
        slug: resolveSlug(cmsDoc, locale),
        locale,
      },
    }

    req?.payload?.logger?.info?.(
      `CMS invalidate hook: ${operation ?? 'delete'} -> ${JSON.stringify(payload)}`
    )

    await notifyMedusa(payload, req)

    return doc
  }

  return invalidateCache as CollectionAfterChangeHook & CollectionAfterDeleteHook
}
