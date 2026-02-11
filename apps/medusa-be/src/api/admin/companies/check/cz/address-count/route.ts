import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"

export const AdminCompaniesCheckCzAddressCountSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  postal_code: z.string().min(1).optional(),
})

export type AdminCompaniesCheckCzAddressCountSchemaType = z.infer<
  typeof AdminCompaniesCheckCzAddressCountSchema
>

/**
 * GET /admin/companies/check/cz/address-count
 */
export async function GET(
  req: MedusaRequest<unknown, AdminCompaniesCheckCzAddressCountSchemaType>,
  res: MedusaResponse
): Promise<void> {
  // TODO(MED-31): Implement address count check via ARES workflow.
  res.status(501).json({
    error: "Not implemented — see MED-31",
  })
}
