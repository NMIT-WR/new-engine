"use client"

import {
  type MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  type BrandSuggestion,
  type CategorySuggestion,
  getSearchSuggestions,
  type ProductSuggestion,
  type SearchSuggestions,
} from "@/services/search-suggestions-service"

type UseSearchSuggestionsOptions = {
  query: string
  enabled?: boolean
  debounceMs?: number
  minQueryLength?: number
  limitPerSection?: number
}

type UseSearchSuggestionsResult = {
  suggestions: SearchSuggestions
  isLoading: boolean
  isError: boolean
  hasAnySuggestions: boolean
}

type FetchSuggestionsResult = {
  suggestions: SearchSuggestions
  isError: boolean
}

const EMPTY_SUGGESTIONS: SearchSuggestions = {
  products: [],
  categories: [],
  brands: [],
}

const DEFAULT_DEBOUNCE_MS = 170
const DEFAULT_MIN_QUERY_LENGTH = 2
const DEFAULT_LIMIT_PER_SECTION = 5

function hasSuggestions(
  products: ProductSuggestion[],
  categories: CategorySuggestion[],
  brands: BrandSuggestion[]
): boolean {
  return products.length > 0 || categories.length > 0 || brands.length > 0
}

function isCurrentRequest(
  latestRequestIdRef: MutableRefObject<number>,
  requestId: number,
  signal: AbortSignal
): boolean {
  return latestRequestIdRef.current === requestId && !signal.aborted
}

async function fetchSuggestions(
  query: string,
  limitPerSection: number,
  signal: AbortSignal
): Promise<FetchSuggestionsResult> {
  try {
    const suggestions = await getSearchSuggestions(query, {
      signal,
      limitPerSection,
    })

    return {
      suggestions,
      isError: false,
    }
  } catch (error) {
    if (signal.aborted) {
      return {
        suggestions: EMPTY_SUGGESTIONS,
        isError: false,
      }
    }

    if (process.env.NODE_ENV === "development") {
      console.error(
        "[useSearchSuggestions] failed to fetch suggestions:",
        error
      )
    }

    return {
      suggestions: EMPTY_SUGGESTIONS,
      isError: true,
    }
  }
}

export function useSearchSuggestions({
  query,
  enabled = true,
  debounceMs = DEFAULT_DEBOUNCE_MS,
  minQueryLength = DEFAULT_MIN_QUERY_LENGTH,
  limitPerSection = DEFAULT_LIMIT_PER_SECTION,
}: UseSearchSuggestionsOptions): UseSearchSuggestionsResult {
  const [suggestions, setSuggestions] =
    useState<SearchSuggestions>(EMPTY_SUGGESTIONS)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const latestRequestIdRef = useRef(0)

  const trimmedQuery = query.trim()
  const shouldSearch = enabled && trimmedQuery.length >= minQueryLength

  useEffect(() => {
    if (!shouldSearch) {
      setSuggestions(EMPTY_SUGGESTIONS)
      setIsLoading(false)
      setIsError(false)
      return
    }

    const requestId = latestRequestIdRef.current + 1
    latestRequestIdRef.current = requestId

    const controller = new AbortController()
    setIsLoading(true)
    setIsError(false)

    const runFetch = async () => {
      const result = await fetchSuggestions(
        trimmedQuery,
        limitPerSection,
        controller.signal
      )

      if (!isCurrentRequest(latestRequestIdRef, requestId, controller.signal)) {
        return
      }

      setSuggestions(result.suggestions)
      setIsError(result.isError)
      setIsLoading(false)
    }

    const timeout = setTimeout(() => {
      runFetch().catch((error) => {
        if (process.env.NODE_ENV === "development") {
          console.error(
            "[useSearchSuggestions] unexpected runFetch failure:",
            error
          )
        }
      })
    }, debounceMs)

    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [debounceMs, limitPerSection, shouldSearch, trimmedQuery])

  const hasAnySuggestions = useMemo(
    () =>
      hasSuggestions(
        suggestions.products,
        suggestions.categories,
        suggestions.brands
      ),
    [suggestions.brands, suggestions.categories, suggestions.products]
  )

  return {
    suggestions,
    isLoading,
    isError,
    hasAnySuggestions,
  }
}
