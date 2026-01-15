import { queryOptions } from "@tanstack/react-query"
import {
  createCacheConfig,
  createQueryKey,
} from "@techsio/storefront-data/shared"

export type TestQueryData = {
  status: "ok"
  source: "server" | "client"
  timestamp: string
}

const cacheConfig = createCacheConfig()

export const testQueryOptions = queryOptions({
  queryKey: createQueryKey("storefront-data", "test"),
  queryFn: async (): Promise<TestQueryData> => ({
    status: "ok",
    source: typeof window === "undefined" ? "server" : "client",
    timestamp: new Date().toISOString(),
  }),
  ...cacheConfig.semiStatic,
})
