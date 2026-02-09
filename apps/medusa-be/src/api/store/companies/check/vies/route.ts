import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type { Logger } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { z } from "zod"
import { VatIdentificationNumberSchema } from "../../../../companies/check/validators"
import {
  COMPANY_CHECK_MODULE,
  type CompanyCheckModuleService,
} from "../../../../../modules/company-check"
import {
  mapViesResponse,
  parseVatIdentificationNumber,
} from "../../../../../modules/company-check/utils"
import { TimeoutError } from "../../../../../utils/http"

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
  const { vat_identification_number } = req.validatedQuery
  const { countryCode, vatNumber } =
    parseVatIdentificationNumber(vat_identification_number)

  const companyCheckService =
    req.scope.resolve<CompanyCheckModuleService>(COMPANY_CHECK_MODULE)

  try {
    const response = await companyCheckService.checkVatNumber({
      countryCode,
      vatNumber,
    })
    res.json(mapViesResponse(response))
  } catch (error) {
    const logger = req.scope.resolve<Logger>(ContainerRegistrationKeys.LOGGER)
    logger.error(
      "VIES check failed",
      error instanceof Error ? error : new Error(String(error))
    )

    if (error instanceof TimeoutError) {
      res.status(504).json({
        error: "VIES request timed out",
      })
      return
    }

    res.status(502).json({
      error: "VIES request failed",
    })
  }
}
