import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { VatIdentificationNumberSchema } from "../../../../../companies/check/validators"

export const AdminCompaniesCheckCzTaxReliabilitySchema = z.object({
  vat_identification_number: VatIdentificationNumberSchema,
})

export type AdminCompaniesCheckCzTaxReliabilitySchemaType = z.infer<
  typeof AdminCompaniesCheckCzTaxReliabilitySchema
>

/**
 * GET /admin/companies/check/cz/tax-reliability
 */
export async function GET(
  req: MedusaRequest<unknown, AdminCompaniesCheckCzTaxReliabilitySchemaType>,
  res: MedusaResponse
): Promise<void> {
  res.status(501).json({
    error: "Not implemented",
  })
}
