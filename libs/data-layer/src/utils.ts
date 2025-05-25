export function formatSQL(query: string, colorize = true): string {
  return [
    'SELECT',
    'FROM',
    'WHERE',
    'JOIN',
    'INNER JOIN',
    'LEFT JOIN',
    'RIGHT JOIN',
    'ON',
    'GROUP BY',
    'ORDER BY',
    'HAVING',
    'LIMIT',
    'OFFSET',
    'UNION',
    'UPDATE',
    'DELETE',
    'INSERT INTO',
    'VALUES',
    'SET',
    'RETURNING',
  ]
    .reduce(
      (formattedQuery, keyword) =>
        formattedQuery.replace(
          new RegExp(`\\b${keyword}\\b`, 'gi'),
          `\n${colorize ? `\x1b[92m${keyword}\x1b[33m` : keyword}${keyword === 'SELECT' ? '\n' : ''}`
        ),
      query
    )
    .trim()
    .split('\n')
    .map((line) => `   ${line}`)
    .join('\n')
    .trim()
}

export function isDateString(
  value: string | Date | null | undefined | unknown
): boolean {
  if (!value) { return false }
  if (
    value instanceof Date ||
    (typeof value === 'object' && isPureDateObject(value))
  ) {
    return true
  }
  if (typeof value !== 'string') { return false }

  // Ex. '2023-12-29 14:19:05.264'
  // Ex. '2023-10-28T12:54:07.311Z'

  return /^(\d{4})-(\d{2})-(\d{2})/.test(value)
}

export function safeEscapeSqlValue(value: unknown): string {
  if (typeof value === 'string') { return `"${value}"` }
  if (typeof value === 'object') { return JSON.stringify(value) }
  return String(value)
}

type DrizzleResult = {
  sql: string
  params: unknown[]
}

export function parseDrizzleMessage(
  message: string | undefined
): DrizzleResult {
  const m = String(message || '')
    .replace(/\n/g, ' ')
    .trim()
    .replace(/^Query:\s+/, '')

  if (!m) { return { sql: '', params: [] } }
  if (m.length > 1_000_000) {
    return { sql: m.slice(0, 10_000).trim(), params: [] }
  }

  const [, sql, paramsString] =
    m.match(/^(.+?)(?:\s+--\sparams:\s+(.+))?$/) || []

  return {
    sql: String(sql || '').trim(),
    params: (paramsString ? JSON.parse(paramsString) : []) as unknown[],
  }
}

export function normalizeString(haystack: string): string {
  return String(haystack || '')
    .replace(/\n{2,}/g, '\n')
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .join('\n')
    .trim()
}

function isPureDateObject(o: object): boolean {
  try {
    // @ts-ignore
    return typeof o.getMonth === 'function'
  } catch (_e) {
    return false
  }
}
