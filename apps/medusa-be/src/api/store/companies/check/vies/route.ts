import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { VatIdentificationNumberSchema } from "../../../../companies/check/validators"

export const StoreCompaniesCheckViesSchema = z.object({
  vat_identification_number: VatIdentificationNumberSchema,
})

export type StoreCompaniesCheckViesSchemaType = z.infer<
  typeof StoreCompaniesCheckViesSchema
>

/**
 * GET /store/companies/check/vies
 */
export async function GET(
  req: MedusaRequest<unknown, StoreCompaniesCheckViesSchemaType>,
  res: MedusaResponse
): Promise<void> {
  res.status(501).json({
    error: "Not implemented",
  })
}
