import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type { Logger } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"
import { z } from "zod"
import { VatIdentificationNumberSchema } from "../../../../../companies/check/validators"
import { TimeoutError } from "../../../../../../utils/http"
import { companyCheckCzInfoWorkflow } from "../../../../../../workflows/company-check/workflows/company-info"
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
  try {
    const { result } = await companyCheckCzInfoWorkflow(req.scope).run({
      input: req.validatedQuery,
    })

    res.json(result)
  } catch (error) {
    const logger = req.scope.resolve<Logger>(ContainerRegistrationKeys.LOGGER)
    logger.error(
      "Company info check failed",
      error instanceof Error ? error : new Error(String(error))
    )

    if (error instanceof TimeoutError) {
      res.status(504).json({
        error: "Company info request timed out",
      })
      return
    }

    if (
      error instanceof MedusaError &&
      error.type === MedusaError.Types.INVALID_DATA
    ) {
      res.status(400).json({
        error: error.message || "Invalid company info query",
      })
      return
    }

    res.status(502).json({
      error: "Company info request failed",
    })
  }
}
