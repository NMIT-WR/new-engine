import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { PPL_CLIENT_MODULE } from "../../../modules/ppl-client"
import type { PplClientModuleService } from "../../../modules/ppl-client/service"
import type {
  PplConfigResponse,
  UpdatePplConfigInput,
} from "../../../modules/ppl-client/types"

/**
 * GET /admin/ppl-config
 *
 * Returns the current PPL configuration with sensitive fields masked.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const pplService = req.scope.resolve<PplClientModuleService>(PPL_CLIENT_MODULE)

  const config = await pplService.getConfig()
  if (!config) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "PPL configuration not found. Please restart the server to initialize."
    )
  }

  // Mask sensitive fields
  const response: PplConfigResponse = {
    id: config.id,
    environment: config.environment,
    is_enabled: config.is_enabled,
    client_id: config.client_id,
    client_secret_set: !!config.client_secret,
    default_label_format: config.default_label_format,
    cod_bank_account_set: !!config.cod_bank_account,
    cod_bank_code_set: !!config.cod_bank_code,
    cod_iban_set: !!config.cod_iban,
    cod_swift_set: !!config.cod_swift,
    sender_name: config.sender_name,
    sender_street: config.sender_street,
    sender_city: config.sender_city,
    sender_zip_code: config.sender_zip_code,
    sender_country: config.sender_country,
    sender_phone: config.sender_phone,
    sender_email: config.sender_email,
  }

  res.json({ config: response })
}

/**
 * POST /admin/ppl-config
 *
 * Updates the PPL configuration.
 * Empty string for sensitive fields = keep existing value.
 */
export async function POST(
  req: MedusaRequest<UpdatePplConfigInput>,
  res: MedusaResponse
) {
  const pplService = req.scope.resolve<PplClientModuleService>(PPL_CLIENT_MODULE)

  const updated = await pplService.updateConfig(req.body)

  // Mask sensitive fields in response
  const response: PplConfigResponse = {
    id: updated.id,
    environment: updated.environment,
    is_enabled: updated.is_enabled,
    client_id: updated.client_id,
    client_secret_set: !!updated.client_secret,
    default_label_format: updated.default_label_format,
    cod_bank_account_set: !!updated.cod_bank_account,
    cod_bank_code_set: !!updated.cod_bank_code,
    cod_iban_set: !!updated.cod_iban,
    cod_swift_set: !!updated.cod_swift,
    sender_name: updated.sender_name,
    sender_street: updated.sender_street,
    sender_city: updated.sender_city,
    sender_zip_code: updated.sender_zip_code,
    sender_country: updated.sender_country,
    sender_phone: updated.sender_phone,
    sender_email: updated.sender_email,
  }

  res.json({ config: response })
}
