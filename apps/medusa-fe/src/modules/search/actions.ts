'use server'

import { SEARCH_INDEX_NAME, searchClient } from '@lib/search-client'

interface Hits {
  readonly objectID?: string
  id?: string
  [x: string | number | symbol]: unknown
}

/**
 * Uses MeiliSearch to search for a query
 * @param {string} query - search query
 */
export async function search(query: string) {
  // MeiliSearch
  const queries = [{ params: { query }, indexName: SEARCH_INDEX_NAME }]
  const { results } = (await searchClient.search(queries)) as Record<
    string,
    any
  >
  const { hits } = results[0] as { hits: Hits[] }

  return hits
}
