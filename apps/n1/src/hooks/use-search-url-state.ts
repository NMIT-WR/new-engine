"use client"

import { useQueryStates } from "nuqs"
import { useCallback } from "react"
import {
  normalizeCategoryId,
  normalizeSearchPage,
  normalizeSearchQuery,
  searchUrlParsers,
  toCategoryIdQueryParam,
  toPageQueryParam,
} from "@/lib/url-state/search"

const NAVIGATION_OPTIONS = {
  history: "push" as const,
  scroll: true,
}

export function useSearchUrlState() {
  const [state, setSearchState] = useQueryStates(searchUrlParsers)

  const query = normalizeSearchQuery(state.q)
  const page = normalizeSearchPage(state.page)
  const categoryId = normalizeCategoryId(state.category_id)

  const setPage = useCallback(
    (nextPage: number) => {
      void setSearchState(
        {
          page: toPageQueryParam(nextPage),
        },
        NAVIGATION_OPTIONS
      )
    },
    [setSearchState]
  )

  const setCategory = useCallback(
    (nextCategoryId: string) => {
      void setSearchState(
        {
          category_id: toCategoryIdQueryParam(nextCategoryId),
          page: null,
        },
        NAVIGATION_OPTIONS
      )
    },
    [setSearchState]
  )

  const clearCategory = useCallback(() => {
    void setSearchState(
      {
        category_id: null,
        page: null,
      },
      NAVIGATION_OPTIONS
    )
  }, [setSearchState])

  return {
    query,
    page,
    categoryId,
    setPage,
    setCategory,
    clearCategory,
  }
}
