import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import type { AdminCompaniesCheckCzAddressCountSchemaType } from "./validators"

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
