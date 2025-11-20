import type { BalikovnaServiceType } from './constants'

export type BalikovnaProviderMode = 'test' | 'production'

export type BalikovnaProviderOptions = {
  mode?: BalikovnaProviderMode
  apiKey?: string
  customerId?: string
  testBaseUrl?: string
  productionBaseUrl?: string
  labelUrlTemplate?: string
}

export type BalikovnaPickupPoint = {
  id: string
  name: string
  city: string
  postal_code: string
  street?: string
  region?: string
  type?: string
  country?: string
  latitude?: number
  longitude?: number
  phone?: string
}

export type BalikovnaAddress = {
  first_name?: string
  last_name?: string
  address_1?: string
  address_2?: string | null
  address_3?: string | null
  city?: string
  postal_code?: string
  country_code?: string
  phone?: string
}

export type BalikovnaCashOnDelivery = {
  amount: number
  currency: string
}

export type BalikovnaFulfillmentData = {
  service: BalikovnaServiceType
  pickup_point?: BalikovnaPickupPoint
  address?: BalikovnaAddress
  contact?: {
    phone?: string
    email?: string
  }
  cash_on_delivery?: BalikovnaCashOnDelivery
  environment?: BalikovnaProviderMode
  tracking_number?: string
  tracking_url?: string
  label_url?: string
  status?: string
  errors?: string[]
  [key: string]: unknown
}
