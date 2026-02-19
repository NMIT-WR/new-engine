import { z } from "zod"
import { VatIdentificationNumberSchema } from "../../../../companies/check/validators"

export const StoreCompaniesCheckViesSchema = z.object({
  vat_identification_number: VatIdentificationNumberSchema,
})

export type StoreCompaniesCheckViesSchemaType = z.infer<
  typeof StoreCompaniesCheckViesSchema
>
