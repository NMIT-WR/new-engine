import { drizzle } from "drizzle-orm/neon-http"
import type { SQL } from "drizzle-orm/sql/sql"

// Import the schema from our local file
import * as schema from "./schema"

const getDatabaseUrl = (): string => {
  const url = process.env.DATABASE_URL || process.env.DC_DATABASE_URL
  if (!url) {
    throw new Error(
      "DATABASE_URL (or DC_DATABASE_URL) environment variable is required"
    )
  }
  return url
}

// Create a simplified drizzle client
export const db = drizzle(getDatabaseUrl(), { schema })
// Helper function to check if a string is a date (ISO format YYYY-MM-DD)
// Uses strict regex to avoid false positives from new Date() coercion
// Matches: YYYY-MM-DD, YYYY-MM-DD HH:MM:SS.sss, YYYY-MM-DDTHH:MM:SS.sssZ
// Anchored to prevent matching strings like "2024-01-15-INVALID"
const ISO_DATE_REGEX =
  /^(\d{4})-(\d{2})-(\d{2})(?:[ T][\d:.]*(Z|[+-]\d{2}:\d{2})?)?$/

function isDateString(value: string): boolean {
  return ISO_DATE_REGEX.test(value)
}

/**
 * Execute a raw SQL query and return the results
 */
export async function sqlRaw<T = object>(sql: SQL<T>): Promise<T[]> {
  const rows = (await db.execute(sql)).rows as T[]

  return (rows as object[]).map(
    (row): T =>
      Object.fromEntries(
        Object.entries(row).map(([key, value]) => [
          key,
          value && typeof value === "string" && isDateString(value)
            ? new Date(value)
            : value,
        ])
      ) as T
  )
}
