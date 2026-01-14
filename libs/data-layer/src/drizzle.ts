import { DefaultLogger, type LogWriter } from 'drizzle-orm/logger';
import { drizzle } from 'drizzle-orm/neon-http';
import type { SQL } from 'drizzle-orm/sql/sql';
import * as schema from './schema';
import {
  formatSQL,
  isDateString,
  normalizeString,
  parseDrizzleMessage,
  safeEscapeSqlValue,
} from './utils';

export let DRIZZLE_QUERY_COUNT = 0;

class MyLogWriter implements LogWriter {
  write(message: string) {
    DRIZZLE_QUERY_COUNT++;
    const { sql, params } = parseDrizzleMessage(message);

    const paramsMessage =
      `[${DRIZZLE_QUERY_COUNT}] ⚡ \x1b[38;5;226m\x1b[44mDrizzle Query\x1b[0m` +
      ` with ${params.length > 0 ? 'params:' : 'no params.'}`;

    if (params.length > 0) console.log(paramsMessage, params);
    if (!params.length) console.log(paramsMessage);

    const q = sql ? formatQuery(sql, params) : '';
    console.log(
      isProduction()
        ? `\x1b[33m${normalizeString(q)}\x1b[0m`
        : `\x1b[33m${normalizeString(formatSQL(q))}\x1b[0m`,
    );
  }
}

function isProduction(): boolean {
  return Boolean(process?.env?.VERCEL_GIT_COMMIT_SHA);
}

function formatQuery(query: string, params: unknown[]): string {
  return params.length > 0
    ? params
        .map((value, i) => ({
          pattern: new RegExp(`\\s\\$${i + 1}`, 'i'),
          value: ` ${safeEscapeSqlValue(value)}`,
        }))
        .reduce(
          (currentQuery, { pattern, value }) =>
            currentQuery.replace(pattern, value),
          query,
        )
    : query;
}

const logger = new DefaultLogger({ writer: new MyLogWriter() });

const getDatabaseUrl = (): string => {
  const url = process.env.DATABASE_URL || process.env.DC_DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL (or DC_DATABASE_URL) environment variable is required',
    );
  }
  return url;
};

// @ts-expect-error
export const db = drizzle(
  getDatabaseUrl(),
  { logger, schema },
);

export async function sqlRaw<T = object>(sql: SQL<T>): Promise<T[]> {
  const rows = (await db.execute(sql)).rows as T[];

  return (rows as object[]).map(
    (row): T =>
      Object.fromEntries(
        Object.entries(row).map(([key, value]) => [
          key,
          value && typeof value === 'string' && isDateString(value)
            ? new Date(value)
            : value,
        ]),
      ) as T,
  );
}

export async function sqlRawSingle<T = object>(
  sql: SQL<T>,
): Promise<T | undefined> {
  return (await sqlRaw(sql))[0];
}

export async function sqlRawSingleForce<T = object>(
  sql: SQL<T>,
  errorMessage?: string,
): Promise<T> {
  const result = (await sqlRaw(sql))[0];
  if (!result) {
    throw new Error(errorMessage || 'No record found.');
  }
  return result;
}

export async function sqlRawCount(sql: SQL<unknown>): Promise<number> {
  return Number(
    (await sqlRaw<{ count?: number }>(sql as SQL<{ count?: number }>))[0]
      ?.count || 0,
  );
}
