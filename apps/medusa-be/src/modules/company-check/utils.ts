import { MedusaError } from "@medusajs/framework/utils"
import type { ViesCheckVatResponse, ViesCheckVatResult } from "./types"
import { VAT_ID_REGEX, VAT_ID_REGEX_MESSAGE } from "./constants"

export function parseVatIdentificationNumber(value: string): {
  countryCode: string
  vatNumber: string
} {
  const normalized = value?.trim().toUpperCase()

  if (!normalized || !VAT_ID_REGEX.test(normalized)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      VAT_ID_REGEX_MESSAGE
    )
  }

  return {
    countryCode: normalized.slice(0, 2),
    vatNumber: normalized.slice(2),
  }
}

export function mapViesResponse(
  response: ViesCheckVatResponse
): ViesCheckVatResult {
  return {
    valid: response.valid,
    name: response.name ?? null,
    address: response.address ?? null,
    request_date: response.requestDate ?? null,
    request_identifier: response.requestIdentifier ?? null,
    trader_name_match: response.traderNameMatch ?? null,
    trader_address_match: response.traderAddressMatch ?? null,
    trader_company_type_match: response.traderCompanyTypeMatch ?? null,
    trader_street_match: response.traderStreetMatch ?? null,
    trader_postal_code_match: response.traderPostalCodeMatch ?? null,
    trader_city_match: response.traderCityMatch ?? null,
  }
}
