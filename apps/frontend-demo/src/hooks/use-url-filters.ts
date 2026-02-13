"use client"

import {
  createParser,
  parseAsArrayOf,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs"
import { useCallback, useMemo } from "react"
import type { FilterState } from "@/components/organisms/product-filters"
import type { SortOption } from "@/utils/product-filters"

export type ExtendedSortOption = SortOption | "relevance"

export interface PageRange {
  start: number
  end: number
  isRange: boolean
}

const SORT_VALUES = ["newest", "name-asc", "name-desc", "relevance"] as const
const DEFAULT_PAGE_RANGE: PageRange = { start: 1, end: 1, isRange: false }

function toPositiveInt(value: string): number | null {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed < 1) {
    return null
  }
  return Math.floor(parsed)
}

const parseAsPageRange = createParser<PageRange>({
  parse: (value) => {
    if (!value) {
      return null
    }

    if (value.includes("-")) {
      const [startRaw, endRaw] = value.split("-")
      const start = toPositiveInt(startRaw)
      const end = toPositiveInt(endRaw)

      if (!start || !end || start > end) {
        return null
      }

      return {
        start,
        end,
        isRange: true,
      }
    }

    const page = toPositiveInt(value)
    if (!page) {
      return null
    }

    return {
      start: page,
      end: page,
      isRange: false,
    }
  },
  serialize: (value) => {
    const start = Math.max(1, Math.floor(value.start))
    const end = Math.max(start, Math.floor(value.end))

    if (value.isRange || start !== end) {
      return `${start}-${end}`
    }

    return String(start)
  },
  eq: (a, b) =>
    a.start === b.start && a.end === b.end && a.isRange === b.isRange,
})

const urlFilterParsers = {
  page: parseAsPageRange,
  q: parseAsString,
  categories: parseAsArrayOf(parseAsString),
  sizes: parseAsArrayOf(parseAsString),
  sort: parseAsStringLiteral(SORT_VALUES),
}

export function useUrlFilters() {
  const [queryState, setQueryState] = useQueryStates(urlFilterParsers)

  const pageRange = queryState.page ?? DEFAULT_PAGE_RANGE
  const page = pageRange.start
  const searchQuery = queryState.q ?? ""
  const sortBy: ExtendedSortOption = queryState.sort ?? "newest"

  const filters: FilterState = useMemo(
    () => ({
      categories: new Set(queryState.categories ?? []),
      sizes: new Set(queryState.sizes ?? []),
    }),
    [queryState.categories, queryState.sizes]
  )

  const setFilters = useCallback(
    (newFilters: FilterState) => {
      const categories = Array.from(newFilters.categories)
      const sizes = Array.from(newFilters.sizes)

      void setQueryState(
        {
          categories: categories.length > 0 ? categories : null,
          sizes: sizes.length > 0 ? sizes : null,
          page: null,
        },
        {
          history: "push",
          scroll: false,
        }
      )
    },
    [setQueryState]
  )

  const setSortBy = useCallback(
    (sort: ExtendedSortOption) => {
      void setQueryState(
        {
          sort,
          page: null,
        },
        {
          history: "push",
          scroll: false,
        }
      )
    },
    [setQueryState]
  )

  const setPage = useCallback(
    (newPage: number) => {
      if (!Number.isFinite(newPage)) {
        return
      }

      const normalizedPage = Math.max(1, Math.floor(newPage))

      void setQueryState(
        {
          page:
            normalizedPage > 1
              ? { start: normalizedPage, end: normalizedPage, isRange: false }
              : null,
        },
        {
          history: "push",
          scroll: true,
        }
      )
    },
    [setQueryState]
  )

  const setPageRange = useCallback(
    (startPage: number, endPage: number) => {
      if (!(Number.isFinite(startPage) && Number.isFinite(endPage))) {
        return
      }

      const normalizedStart = Math.max(1, Math.floor(startPage))
      const normalizedEnd = Math.max(normalizedStart, Math.floor(endPage))

      void setQueryState(
        {
          page:
            normalizedStart === 1 && normalizedEnd === 1
              ? null
              : {
                  start: normalizedStart,
                  end: normalizedEnd,
                  isRange: normalizedStart !== normalizedEnd,
                },
        },
        {
          history: "push",
          scroll: false,
        }
      )
    },
    [setQueryState]
  )

  const extendPageRange = useCallback(() => {
    const nextEnd = pageRange.end + 1

    void setQueryState(
      {
        page: {
          start: pageRange.start,
          end: nextEnd,
          isRange: true,
        },
      },
      {
        history: "replace",
        scroll: false,
      }
    )
  }, [pageRange.end, pageRange.start, setQueryState])

  const setSearchQuery = useCallback(
    (query: string) => {
      void setQueryState(
        {
          q: query ? query : null,
          page: {
            start: 1,
            end: 1,
            isRange: false,
          },
        },
        {
          history: "push",
          scroll: false,
        }
      )
    },
    [setQueryState]
  )

  return {
    filters,
    setFilters,
    sortBy,
    setSortBy,
    page,
    setPage,
    pageRange,
    setPageRange,
    extendPageRange,
    searchQuery,
    setSearchQuery,
  }
}
