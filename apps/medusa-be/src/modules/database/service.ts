import { MedusaError } from "@medusajs/framework/utils"
import { drizzle, type MySql2Database } from "drizzle-orm/mysql2"
import type { SQL } from "drizzle-orm/sql/sql"
import mysql, { type FieldPacket } from "mysql2/promise"

class DatabaseModuleService {
  // todo, DB table with connections & admin widget for configuration, currently hardcoded for singular use
  private db_: MySql2Database | undefined = undefined

  private async initDatabase() {
    if (this.db_ !== undefined) {
      return this.db_
    }

    const connectionString = process.env.LEGACY_DATABASE_URL
    if (!connectionString) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "LEGACY_DATABASE_URL environment variable is required for legacy database connection"
      )
    }

    const connection = await mysql.createConnection(connectionString)
    this.db_ = drizzle(connection)

    return this.db_
  }

  /**
   * Execute a raw SQL query and return the results
   */
  async sqlRaw<T = object>(sql: SQL<T>) {
    const db = await this.initDatabase()
    const [rows] = await db.execute(sql)

    const rowsTyped = rows as unknown as FieldPacket[]
    return rowsTyped.map(
      (row) =>
        Object.fromEntries(
          Object.entries(row).map(([key, value]) => [key, value])
        ) as T
    )
  }
}

export default DatabaseModuleService
