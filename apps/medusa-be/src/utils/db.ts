import { drizzle } from 'drizzle-orm/neon-http'
import type { SQL } from 'drizzle-orm/sql/sql'

// Import the schema from our local file
import * as schema from './schema'

// Create a simplified drizzle client
export const db = drizzle(
  'postgresql://neondb_owner:npg_Ozy4jRvtHDG5@ep-nameless-river-a2qn6c6z-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require',
  { schema }
)

// Helper function to check if a string is a date
function isDateString(value: string): boolean {
  const date = new Date(value)
  return !isNaN(date.getTime())
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
          value && typeof value === 'string' && isDateString(value)
            ? new Date(value)
            : value,
        ])
      ) as T
  )
}
