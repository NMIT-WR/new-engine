import { z } from "zod"
import {
  VAT_ID_REGEX,
  VAT_ID_REGEX_MESSAGE,
} from "../../../modules/company-check/constants"

export const VatIdentificationNumberSchema = z
  .string()
  .regex(VAT_ID_REGEX, VAT_ID_REGEX_MESSAGE)

export const CompanyIdentificationNumberSchema = z
  .string()
  .regex(/^\d{8}$/, "Company identification number must be 8 digits")
