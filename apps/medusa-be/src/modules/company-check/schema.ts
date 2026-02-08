import { z } from "zod"

export const ViesCheckVatResponseSchema = z
  .object({
    valid: z.boolean(),
    name: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    requestDate: z.string().nullable().optional(),
    requestIdentifier: z.string().nullable().optional(),
    traderNameMatch: z.string().nullable().optional(),
    traderAddressMatch: z.string().nullable().optional(),
    traderCompanyTypeMatch: z.string().nullable().optional(),
    traderStreetMatch: z.string().nullable().optional(),
    traderPostalCodeMatch: z.string().nullable().optional(),
    traderCityMatch: z.string().nullable().optional(),
  })
  .passthrough()
