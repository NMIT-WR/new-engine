/** Convert a string into a URL-friendly slug. */
export const generateSlug = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

/** Generate a slug from a title or return the fallback value. */
export const generateSlugFromTitle = (
  title: unknown,
  fallback = ''
): string => {
  if (typeof title === 'string') {
    return generateSlug(title)
  }

  return fallback
}
