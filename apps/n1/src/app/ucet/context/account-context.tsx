"use client"

import type { StoreCustomer } from "@medusajs/types"
import { useQueryClient } from "@tanstack/react-query"
import { createContext, type ReactNode, useContext, useEffect } from "react"
import { authHooks } from "@/hooks/auth-hooks"
import {
  ACCOUNT_ORDERS_PAGE_SIZE,
  createOrdersListPrefetchQuery,
} from "@/hooks/order-hooks"

type AccountContextType = {
  customer: StoreCustomer | null
}

const AccountContext = createContext<AccountContextType | undefined>(undefined)

export const useAccountContext = () => {
  const context = useContext(AccountContext)
  if (!context) {
    throw new Error("useAccountContext must be used within AccountProvider")
  }
  return context
}

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const { customer } = authHooks.useAuth()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!customer) {
      return
    }

    // Prefetch first account orders page using the same query config as order hooks.
    void queryClient.prefetchQuery(
      createOrdersListPrefetchQuery({
        page: 1,
        limit: ACCOUNT_ORDERS_PAGE_SIZE,
      })
    )
  }, [customer, queryClient])

  const contextValue = {
    customer,
  }

  return <AccountContext value={contextValue}>{children}</AccountContext>
}
