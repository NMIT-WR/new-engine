import type { Logger } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import {
  COMPANY_CHECK_MODULE,
  type CompanyCheckModuleService,
} from "../../../../modules/company-check"
import type { ViesCheckVatRequest } from "../../../../modules/company-check/types"
import { hashValueForLogs, logCompanyInfoDebug } from "../../helpers/debug"

/**
 * Resolves company name in VIES for VAT-origin lookup.
 * Returns `null` when VAT is invalid or VIES doesn't return a usable name.
 */
export const resolveVatCompanyNameStep = createStep(
  "company-check-resolve-vat-company-name-step",
  async (
    vatIdentificationNumber: ViesCheckVatRequest,
    { container }
  ): Promise<StepResponse<string | null>> => {
    const logger = container.resolve<Logger>(ContainerRegistrationKeys.LOGGER)
    const companyCheckService =
      container.resolve<CompanyCheckModuleService>(COMPANY_CHECK_MODULE)
    const vatHash = hashValueForLogs(
      `${vatIdentificationNumber.countryCode}${vatIdentificationNumber.vatNumber}`
    )

    logCompanyInfoDebug(logger, "step_resolve_vat_company_name_start", {
      vat_hash: vatHash,
    })

    const viesResult =
      await companyCheckService.checkVatNumber(vatIdentificationNumber)

    if (!viesResult.valid || !viesResult.name?.trim()) {
      logCompanyInfoDebug(logger, "step_resolve_vat_company_name_empty", {
        vat_hash: vatHash,
        valid: viesResult.valid,
        has_name: Boolean(viesResult.name?.trim()),
      })

      return new StepResponse(null)
    }

    logCompanyInfoDebug(logger, "step_resolve_vat_company_name_success", {
      vat_hash: vatHash,
    })

    return new StepResponse(viesResult.name.trim())
  }
)
