import { z } from "zod"
import { ViesCheckVatResponseSchema } from "./schema"

export type CompanyInfo = {
  company_name: string
  company_identification_number: string
  vat_identification_number?: string | null
  street: string
  city: string
  country: string
  postal_code: string
}

export type ViesCheckVatRequest = {
  countryCode: string
  vatNumber: string
}

export type ViesCheckVatResponse = z.infer<typeof ViesCheckVatResponseSchema>

export type ViesClientOptions = {
  baseUrl: string
}

export type ViesCheckVatResult = {
  valid: boolean
  name: string | null
  address: string | null
  request_date: string | null
  request_identifier: string | null
  trader_name_match: string | null
  trader_address_match: string | null
  trader_company_type_match: string | null
  trader_street_match: string | null
  trader_postal_code_match: string | null
  trader_city_match: string | null
}
