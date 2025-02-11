import { instantMeiliSearch } from "@meilisearch/instant-meilisearch"
import { SearchClient } from "instantsearch.js";

const endpoint =
  process.env.NEXT_PUBLIC_SEARCH_ENDPOINT || "http://127.0.0.1:7700"

const apiKey = process.env.NEXT_PUBLIC_SEARCH_API_KEY || "test_key"

const ms = instantMeiliSearch(endpoint, apiKey)
export const searchClient = (ms.searchClient as unknown) as SearchClient

export const SEARCH_INDEX_NAME =
  process.env.NEXT_PUBLIC_INDEX_NAME || "products"
