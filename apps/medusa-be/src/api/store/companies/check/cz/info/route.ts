import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { VatIdentificationNumberSchema } from "../../../../../companies/check/validators"
import { CzCompanyIdentificationNumberSchema } from "./validators"

export const StoreCompaniesCheckCzInfoSchema = z
  .object({
    vat_identification_number: VatIdentificationNumberSchema.optional(),
    company_identification_number: CzCompanyIdentificationNumberSchema.optional(),
    company_name: z.string().min(1).optional(),
  })
  .superRefine((data, ctx) => {
    const provided = [
      data.vat_identification_number,
      data.company_identification_number,
      data.company_name,
    ].filter((value) => typeof value === "string")

    if (provided.length !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Exactly one of vat_identification_number, company_identification_number, or company_name is required",
      })
    }
  })

export type StoreCompaniesCheckCzInfoSchemaType = z.infer<
  typeof StoreCompaniesCheckCzInfoSchema
>

/**
 * GET /store/companies/check/cz/info
 */
export async function GET(
  req: MedusaRequest<unknown, StoreCompaniesCheckCzInfoSchemaType>,
  res: MedusaResponse
): Promise<void> {
  // TODO(MED-31): Implement company info check via ARES + VIES workflow.
  res.status(501).json({
    error: "Not implemented — see MED-31",
  })
}
