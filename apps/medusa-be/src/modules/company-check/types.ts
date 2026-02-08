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
