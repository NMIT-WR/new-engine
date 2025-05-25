import { MeiliSearch } from 'meilisearch'

const endpoint =
  process.env.NEXT_PUBLIC_SEARCH_ENDPOINT || 'http://localhost:7700'

const apiKey = process.env.NEXT_PUBLIC_SEARCH_API_KEY || 'test_key'

console.log(
  `[SearchClient] Initializing MeiliSearch. Endpoint: ${endpoint}, API Key Set: ${!!apiKey}`
)

export interface MeiliSearchProductHit {
  id: string
  handle: string
  title: string
  thumbnail: string
  variants: string[]
}

export const searchClient = new MeiliSearch({
  host: endpoint,
  apiKey: apiKey,
})
