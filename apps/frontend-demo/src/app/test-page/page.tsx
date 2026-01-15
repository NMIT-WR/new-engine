import {
  dehydrate,
  HydrationBoundary,
  getQueryClient,
} from "@techsio/storefront-data/server"
import { TestPageClient } from "./test-page-client"
import { testQueryOptions } from "./test-query"

export default async function TestPage() {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(testQueryOptions)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TestPageClient />
    </HydrationBoundary>
  )
}
