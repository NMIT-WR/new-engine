"use client"

import type { HttpTypes } from "@medusajs/types"
import {
  createCacheConfig,
  createCustomerHooks,
  createMedusaCustomerService,
  type MedusaCustomerAddressCreateInput,
  type MedusaCustomerAddressUpdateInput,
  type MedusaCustomerListInput,
  type MedusaCustomerProfileUpdateInput,
} from "@techsio/storefront-data"
import { useToast } from "@techsio/ui-kit/molecules/toast"
import { cacheConfig as appCacheConfig } from "@/lib/cache-config"
import { sdk } from "@/lib/medusa-client"
import { queryKeys } from "@/lib/query-keys"

const cacheConfig = createCacheConfig({
  userData: appCacheConfig.userData,
})

export const customerHooks = createCustomerHooks<
  HttpTypes.StoreCustomer,
  HttpTypes.StoreCustomerAddress,
  MedusaCustomerListInput,
  MedusaCustomerListInput,
  MedusaCustomerAddressCreateInput,
  MedusaCustomerAddressCreateInput,
  MedusaCustomerAddressUpdateInput & { addressId?: string },
  MedusaCustomerAddressUpdateInput,
  MedusaCustomerProfileUpdateInput,
  MedusaCustomerProfileUpdateInput
>({
  service: createMedusaCustomerService(sdk),
  queryKeys: queryKeys.customer,
  cacheConfig,
})

// Re-export hooks
export const {
  useCustomerAddresses,
  useSuspenseCustomerAddresses,
  useCreateCustomerAddress,
  useUpdateCustomerAddress,
  useDeleteCustomerAddress,
  useUpdateCustomer,
} = customerHooks

// Toast wrappers for better UX

export function useCreateAddressWithToast() {
  const toast = useToast()
  return customerHooks.useCreateCustomerAddress({
    onSuccess: () => {
      toast.create({
        title: "Adresa byla uložena",
        type: "success",
      })
    },
    onError: (err) => {
      toast.create({
        title: "Chyba při ukládání adresy",
        description: err instanceof Error ? err.message : "Zkuste to znovu",
        type: "error",
      })
    },
  })
}

export function useUpdateAddressWithToast() {
  const toast = useToast()
  return customerHooks.useUpdateCustomerAddress({
    onSuccess: () => {
      toast.create({
        title: "Adresa byla aktualizována",
        type: "success",
      })
    },
    onError: (err) => {
      toast.create({
        title: "Chyba při aktualizaci adresy",
        description: err instanceof Error ? err.message : "Zkuste to znovu",
        type: "error",
      })
    },
  })
}

export function useDeleteAddressWithToast() {
  const toast = useToast()
  return customerHooks.useDeleteCustomerAddress({
    onSuccess: () => {
      toast.create({
        title: "Adresa byla smazána",
        type: "success",
      })
    },
    onError: (err) => {
      toast.create({
        title: "Chyba při mazání adresy",
        description: err instanceof Error ? err.message : "Zkuste to znovu",
        type: "error",
      })
    },
  })
}

export function useUpdateProfileWithToast() {
  const toast = useToast()
  return customerHooks.useUpdateCustomer({
    onSuccess: () => {
      toast.create({
        title: "Profil byl aktualizován",
        type: "success",
      })
    },
    onError: (err) => {
      toast.create({
        title: "Chyba při aktualizaci profilu",
        description: err instanceof Error ? err.message : "Zkuste to znovu",
        type: "error",
      })
    },
  })
}
