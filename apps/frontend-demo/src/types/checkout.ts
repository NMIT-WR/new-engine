// Centrální typy pro checkout flow

import type { HttpTypes } from '@medusajs/types'

// Základní adresní data
export interface AddressData {
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

// Adresní data pro zobrazení (bez některých povinných polí)
export interface AddressDisplayData {
  firstName: string
  lastName: string
  street: string
  city: string
  postalCode: string
  email?: string
  phone?: string
  company?: string
}

// Kompletní adresní informace včetně billing/shipping
export interface CheckoutAddressData {
  shipping: AddressData
  billing: AddressData
  useSameAddress: boolean
}

// Dopravní metoda
export interface ShippingMethod {
  id: string
  name: string
  description: string
  price: number
  priceFormatted: string
  delivery: string
  deliveryDate: string
  image: string
}

// Platební metoda
export interface PaymentMethod {
  id: string
  name: string
  fee: number
  image: string
}

// Země (kompatibilní s SelectOption z @ui)
export interface Country {
  label: string
  value: string
  [key: string]: unknown
}

// Props pro komponenty
export interface ShippingSelectionProps {
  selected: string
  onSelect: (method: string) => void
}

export interface PaymentSelectionProps {
  selected: string
  onSelect: (method: string) => void
}

export interface AddressFormProps {
  onComplete: (data: CheckoutAddressData) => void | Promise<void>
  initialData?: {
    shipping?: Partial<AddressData>
    billing?: Partial<AddressData>
    useSameAddress?: boolean
  }
  isLoading?: boolean
}

export interface OrderSummaryProps {
  addressData?: CheckoutAddressData
  selectedShipping: ShippingMethod | undefined
  selectedPayment: PaymentMethod | undefined
  onCompleteClick: () => void
  onEditClick: () => void
  isOrderComplete?: boolean
  orderNumber?: string
  isLoading?: boolean
}

// UseCheckout hook return type
export interface UseCheckoutReturn {
  // State
  currentStep: number
  selectedPayment: string
  selectedShipping: string
  addressData: CheckoutAddressData | null
  isProcessingPayment: boolean

  // Actions
  setCurrentStep: (step: number) => void
  setSelectedPayment: (payment: string) => void
  setSelectedShipping: (shipping: string) => void
  setAddressData: (data: CheckoutAddressData) => void
  updateAddresses: (data: CheckoutAddressData) => Promise<void>
  addShippingMethod: (methodId: string) => Promise<void>
  processOrder: () => Promise<HttpTypes.StoreOrder | undefined>
  canProceedToStep: (step: number) => boolean
}

// Mapování shipping metod na backend ID
export type ShippingOptionMap = Record<string, string>
