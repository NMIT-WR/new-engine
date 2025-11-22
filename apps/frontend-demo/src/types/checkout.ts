import type { HttpTypes } from "@medusajs/types"

export type AddressData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  street: string
  city: string
  postalCode: string
  country: string
  company?: string
}

export interface UserData extends HttpTypes.StoreCustomer {}

export type AddressDisplayData = {
  firstName: string
  lastName: string
  street: string
  city: string
  postalCode: string
  email?: string
  phone?: string
  company?: string
}

export type CheckoutAddressData = {
  shipping: AddressData
  billing: AddressData
  useSameAddress: boolean
}

export type ShippingMethod = {
  id: string
  name: string
  description: string
  price: number
  priceFormatted: string
  delivery: string
  deliveryDate: string
  image: string
}

export type PaymentMethod = {
  id: string
  name: string
  fee: number
  image: string
}

export type Country = {
  label: string
  value: string
  [key: string]: unknown
}

export type AddressFormProps = {
  onComplete: (data: CheckoutAddressData) => void | Promise<void>
  sameData?: boolean
  isLoading?: boolean
}

export type ReducedShippingMethod = {
  id: string
  name: string
  calculated_price: HttpTypes.StoreCalculatedPrice
}

// UseCheckout hook return type
export type UseCheckoutReturn = {
  // State
  currentStep: number
  selectedPayment: string
  selectedShipping: string
  addressData: CheckoutAddressData | null
  isProcessingPayment: boolean
  shippingMethods: ReducedShippingMethod[] | undefined
  isLoadingShipping: boolean
  shippingError: Error | null

  // Actions
  setCurrentStep: (step: number) => void
  setSelectedPayment: (payment: string) => void
  setSelectedShipping: (shipping: string) => void
  setAddressData: (data: CheckoutAddressData) => void
  updateAddresses: (data: CheckoutAddressData) => Promise<void>
  addShippingMethod: (methodId: string) => Promise<void>
  processOrder: () => Promise<HttpTypes.StoreOrder | undefined>
  canProceedToStep: (step: number) => boolean
  // getShippingMethod: () => void
}

export type FormUserData = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  company_name: string
}

export type FormAddressData = {
  street: string
  city: string
  postalCode: string
  country: string
}

export type ShippingOptionMap = Record<string, string>
