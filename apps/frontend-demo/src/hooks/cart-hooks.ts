import type { HttpTypes } from "@medusajs/types"
import {
  type AddLineItemInputBase,
  type CartCreateInputBase,
  createCacheConfig,
  createCartHooks,
  createMedusaCartService,
  type MedusaCompleteCartResult,
  type UpdateCartInputBase,
  type UpdateLineItemInputBase,
} from "@techsio/storefront-data"
import { useToast } from "@techsio/ui-kit/molecules/toast"
import { cacheConfig as appCacheConfig } from "@/lib/cache-config"
import { STORAGE_KEYS } from "@/lib/constants"
import { sdk } from "@/lib/medusa-client"
import { queryKeys } from "@/lib/query-keys"

const cacheConfig = createCacheConfig({
  realtime: appCacheConfig.realtime,
})

const cartStorage = {
  getCartId(): string | null {
    if (typeof window === "undefined") {
      return null
    }
    return localStorage.getItem(STORAGE_KEYS.CART_ID)
  },

  setCartId(cartId: string): void {
    if (typeof window === "undefined") {
      return
    }
    localStorage.setItem(STORAGE_KEYS.CART_ID, cartId)
  },

  clearCartId(): void {
    if (typeof window === "undefined") {
      return
    }
    localStorage.removeItem(STORAGE_KEYS.CART_ID)
  },
}

export const isNotFoundError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") {
    return false
  }
  const err = error as { status?: number; response?: { status?: number } }
  return err.status === 404 || err.response?.status === 404
}

export type Cart = HttpTypes.StoreCart

export const cartHooks = createCartHooks<
  HttpTypes.StoreCart,
  CartCreateInputBase,
  HttpTypes.StoreCreateCart,
  UpdateCartInputBase,
  HttpTypes.StoreUpdateCart,
  AddLineItemInputBase,
  HttpTypes.StoreAddCartLineItem,
  UpdateLineItemInputBase,
  HttpTypes.StoreUpdateCartLineItem,
  MedusaCompleteCartResult
>({
  service: createMedusaCartService(sdk),
  buildCreateParams: (input) => ({
    region_id: input.region_id,
    email: input.email,
    ...(input.salesChannelId ? { sales_channel_id: input.salesChannelId } : {}),
  }),
  buildAddParams: (input) => ({
    variant_id: input.variantId,
    quantity: input.quantity ?? 1,
  }),
  buildUpdateItemParams: (input) => ({
    quantity: input.quantity,
  }),
  queryKeys: queryKeys.cart,
  cacheConfig,
  cartStorage,
  isNotFoundError,
  invalidateOnSuccess: true,
})

export function useAddLineItemWithToast() {
  const toast = useToast()
  return cartHooks.useAddLineItem({
    onSuccess: () => {
      toast.create({
        title: "Přidáno do košíku",
        description: "Položka byla přidána do vašeho košíku",
        type: "success",
      })
    },
    onError: (err: unknown) => {
      const errorMessage = err instanceof Error ? err.message : "Neznámá chyba"
      if (errorMessage.toLowerCase().includes("inventory")) {
        toast.create({
          title: "Vyprodáno",
          description:
            "Tato varianta produktu není dostupná v požadovaném množství.",
          type: "error",
        })
      } else {
        toast.create({
          title: "Nepodařilo se přidat položku",
          description: errorMessage,
          type: "error",
        })
      }
    },
  })
}

export function useRemoveLineItemWithToast() {
  const toast = useToast()
  return cartHooks.useRemoveLineItem({
    onSuccess: () => {
      toast.create({
        title: "Odebráno z košíku",
        description: "Položka byla odebrána z vašeho košíku",
        type: "success",
      })
    },
    onError: (err: unknown) => {
      toast.create({
        title: "Nepodařilo se odebrat položku",
        description: err instanceof Error ? err.message : "Neznámá chyba",
        type: "error",
      })
    },
  })
}

export function useUpdateLineItemWithToast() {
  const toast = useToast()
  return cartHooks.useUpdateLineItem({
    onError: (err: unknown) => {
      toast.create({
        title: "Nepodařilo se aktualizovat množství",
        description: err instanceof Error ? err.message : "Neznámá chyba",
        type: "error",
      })
    },
  })
}
