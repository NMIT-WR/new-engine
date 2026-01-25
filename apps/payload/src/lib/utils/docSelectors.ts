export type CategoryDoc = {
  id: number
  title: unknown
  slug: unknown
}

export const getCategoryDoc = (category: unknown): CategoryDoc | null => {
  if (!category || typeof category !== 'object') {
    return null
  }

  const record = category as Record<string, unknown>
  const id = record.id
  if (typeof id !== 'number') {
    return null
  }

  return {
    id,
    title: record.title,
    slug: record.slug,
  }
}

export const getMediaUrl = (featuredImage: unknown): string | null => {
  if (!featuredImage || typeof featuredImage !== 'object') {
    return null
  }

  const record = featuredImage as Record<string, unknown>
  const url = record.url
  return typeof url === 'string' ? url : null
}
