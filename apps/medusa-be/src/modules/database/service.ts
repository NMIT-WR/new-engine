import {drizzle, MySql2Database} from "drizzle-orm/mysql2";
import type {SQL} from "drizzle-orm/sql/sql";
import mysql, {type FieldPacket} from "mysql2/promise"

class DatabaseModuleService {
    private db_: MySql2Database | undefined = undefined

    constructor(
        // todo, DB table with connections & admin widget for configuration, currently hardcoded for singular use
    ) {

    }

    private async initDatabase() {
        if (this.db_ !== undefined) {
            return this.db_
        }
        const connection = await mysql.createConnection('mysql://root:1234@engine-db:3306/n1shop');
        this.db_ = drizzle(connection);

        return this.db_
    }

    /**
     * Execute a raw SQL query and return the results
     */
    public async sqlRaw<T = object>(sql: SQL<T>) {
        const db = await this.initDatabase()
        const [rows] = (await db.execute(sql))

        const rowsTyped = rows as unknown as FieldPacket[]
        return  rowsTyped.map(
            (row) =>
            {
                return Object.fromEntries(
                    Object.entries(row).map(([key, value]) => [
                        key,
                        value,
                        // value && typeof value === 'string' && this.isDateString(value)
                        //     ? new Date(value)
                        //     : value,
                        // above commented code converted more values to dateTime objects than it should
                    ])
                ) as T
            }
        )
    }
}

export default DatabaseModuleService
