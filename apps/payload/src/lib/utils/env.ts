const getEnv = (envVar: string): string | undefined => process.env[envVar]

const normalize = (value: string): string => value.toLowerCase().trim()

export const isEnabled = (envVar: string, defaultValue = true): boolean => {
  const raw = getEnv(envVar)
  if (raw === undefined) {
    return defaultValue
  }

  return !['0', 'false', 'no', 'off'].includes(normalize(raw))
}

export const parseEnvList = (envVar: string): string[] => {
  const raw = getEnv(envVar)
  return raw ? raw.split(',').map((item) => item.trim()).filter(Boolean) : []
}

type SeoCollectionFlags = {
  isArticlesEnabled: boolean
  isPagesEnabled: boolean
}

export const getSeoCollections = (flags: SeoCollectionFlags): string[] =>
  [flags.isArticlesEnabled ? 'articles' : null, flags.isPagesEnabled ? 'pages' : null].filter(
    (collection): collection is string => Boolean(collection)
  )

export const getDocString = (value: unknown): string =>
  typeof value === 'string' ? value : ''
