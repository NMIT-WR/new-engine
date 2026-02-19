import type { HttpTypes } from "@medusajs/types"
import {
  type AddLineItemInputBase,
  type CartCreateInputBase,
  createCacheConfig,
  createCartHooks,
  type UpdateCartInputBase,
  type UpdateLineItemInputBase,
} from "@techsio/storefront-data"
import { cacheConfig as appCacheConfig } from "@/lib/cache-config"
import { isNotFoundError } from "@/lib/errors"
import { queryKeys } from "@/lib/query-keys"
import {
  addToCart,
  type Cart,
  type CompleteCartResult,
  cartStorage,
  completeCart,
  createCartFromParams,
  removeLineItem,
  retrieveCart,
  updateCart,
  updateLineItem,
} from "@/services/cart-service"
import {
  type AddressFormData,
  validateAddressForm,
} from "@/utils/address-validation"

const cartQueryKeys = {
  all: () => queryKeys.cart.all(),
  active: (params: { cartId?: string | null; regionId?: string | null }) =>
    queryKeys.cart.active(params),
  detail: (cartId: string) => queryKeys.cart.detail(cartId),
}

const cacheConfig = createCacheConfig({
  realtime: appCacheConfig.realtime,
  userData: appCacheConfig.userData,
})

const cleanAddress = (address: AddressFormData): HttpTypes.StoreAddAddress => {
  const cleaned: HttpTypes.StoreAddAddress = {
    first_name: address.first_name,
    last_name: address.last_name,
    address_1: address.address_1,
    city: address.city,
    postal_code: address.postal_code,
    country_code: address.country_code,
  }

  if (address.address_2?.trim()) {
    cleaned.address_2 = address.address_2
  }
  if (address.company?.trim()) {
    cleaned.company = address.company
  }
  if (address.province?.trim()) {
    cleaned.province = address.province
  }
  if (address.phone?.trim()) {
    cleaned.phone = address.phone
  }

  return cleaned
}

const validateAddressInput = (input: AddressFormData) => {
  const errors = validateAddressForm(input)
  const messages = Object.values(errors).filter(Boolean)
  return messages.length ? messages : null
}

const buildAddParams = (
  input: AddLineItemInputBase
): HttpTypes.StoreAddCartLineItem => ({
  variant_id: input.variantId,
  quantity: input.quantity ?? 1,
  metadata: input.metadata,
})

const buildCreateParams = (
  input: CartCreateInputBase
): HttpTypes.StoreCreateCart => {
  const { country_code: _countryCode, salesChannelId, ...rest } = input

  return {
    ...(rest as HttpTypes.StoreCreateCart),
    ...(salesChannelId ? { sales_channel_id: salesChannelId } : {}),
  }
}

const buildUpdateParams = (
  input: UpdateCartInputBase & Record<string, unknown>
): HttpTypes.StoreUpdateCart => {
  const {
    country_code: _countryCode,
    cartId: _cartId,
    salesChannelId,
    ...rest
  } = input

  return {
    ...(rest as HttpTypes.StoreUpdateCart),
    ...(salesChannelId ? { sales_channel_id: salesChannelId } : {}),
  }
}

export const cartHooks = createCartHooks<
  Cart,
  CartCreateInputBase,
  HttpTypes.StoreCreateCart,
  UpdateCartInputBase,
  HttpTypes.StoreUpdateCart,
  AddLineItemInputBase,
  HttpTypes.StoreAddCartLineItem,
  UpdateLineItemInputBase,
  HttpTypes.StoreUpdateCartLineItem,
  CompleteCartResult,
  AddressFormData,
  HttpTypes.StoreAddAddress
>({
  service: {
    retrieveCart,
    createCart: createCartFromParams,
    updateCart,
    addLineItem: (cartId, params) =>
      addToCart(cartId, params.variant_id, params.quantity, params.metadata),
    updateLineItem: (cartId, lineItemId, params) =>
      updateLineItem(cartId, lineItemId, params.quantity),
    removeLineItem,
    completeCart,
  },
  buildAddParams,
  buildCreateParams,
  buildUpdateParams,
  queryKeys: cartQueryKeys,
  cacheConfig,
  cartStorage,
  isNotFoundError,
  invalidateOnSuccess: true,
  validateShippingAddressInput: validateAddressInput,
  validateBillingAddressInput: validateAddressInput,
  buildShippingAddress: cleanAddress,
  buildBillingAddress: cleanAddress,
})
