import { z } from "zod"
import { VatIdentificationNumberSchema } from "../../../../../companies/check/validators"

export const AdminCompaniesCheckCzTaxReliabilitySchema = z.object({
  vat_identification_number: VatIdentificationNumberSchema,
})

export type AdminCompaniesCheckCzTaxReliabilitySchemaType = z.infer<
  typeof AdminCompaniesCheckCzTaxReliabilitySchema
>
