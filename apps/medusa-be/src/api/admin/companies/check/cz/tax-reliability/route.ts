import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type { Logger } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"
import { z } from "zod"
import { VatIdentificationNumberSchema } from "../../../../../companies/check/validators"
import {
  COMPANY_CHECK_MODULE,
  type CompanyCheckModuleService,
} from "../../../../../../modules/company-check"
import { TimeoutError } from "../../../../../../utils/http"

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
  const { vat_identification_number } = req.validatedQuery

  const companyCheckService =
    req.scope.resolve<CompanyCheckModuleService>(COMPANY_CHECK_MODULE)

  try {
    const result = await companyCheckService.checkTaxReliability(
      vat_identification_number
    )
    res.json(result)
  } catch (error) {
    const logger = req.scope.resolve<Logger>(ContainerRegistrationKeys.LOGGER)
    logger.error(
      "Moje Dane tax reliability check failed",
      error instanceof Error ? error : new Error(String(error))
    )

    if (
      error instanceof MedusaError &&
      error.type === MedusaError.Types.INVALID_DATA
    ) {
      res.status(400).json({
        error: error.message || "Invalid DIC value",
      })
      return
    }

    if (error instanceof TimeoutError) {
      res.status(504).json({
        error: "Moje Dane request timed out",
      })
      return
    }

    res.status(502).json({
      error: "Moje Dane request failed",
    })
  }
}
