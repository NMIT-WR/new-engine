/** Read an environment variable value if set. */
const getEnv = (envVar: string): string | undefined => process.env[envVar]

/** Normalize a boolean-ish environment string. */
const normalize = (value: string): string => value.toLowerCase().trim()

/** Check whether a feature flag environment variable is enabled. */
export const isEnabled = (envVar: string, defaultValue = true): boolean => {
  const raw = getEnv(envVar)
  if (raw === undefined) {
    return defaultValue
  }

  return !['0', 'false', 'no', 'off'].includes(normalize(raw))
}

/** Parse a comma-delimited environment variable into a list. */
export const parseEnvList = (envVar: string): string[] => {
  const raw = getEnv(envVar)
  return raw ? raw.split(',').map((item) => item.trim()).filter(Boolean) : []
}

/** Feature flags used to determine SEO-enabled collections. */
type SeoCollectionFlags = {
  isArticlesEnabled: boolean
  isPagesEnabled: boolean
}

/** Return the list of collection slugs that should be included for SEO. */
export const getSeoCollections = (flags: SeoCollectionFlags): string[] =>
  [flags.isArticlesEnabled ? 'articles' : null, flags.isPagesEnabled ? 'pages' : null].filter(
    (collection): collection is string => Boolean(collection)
  )

/** Normalize arbitrary values to a string for SEO field generation. */
export const getDocString = (value: unknown): string =>
  typeof value === 'string' ? value : ''
