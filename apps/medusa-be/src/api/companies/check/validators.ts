import { z } from "zod"

export const VatIdentificationNumberSchema = z
  .string()
  .regex(/^[A-Z]{2}\d+$/, "VAT identification number must match ^[A-Z]{2}\\d+$")

export const CompanyIdentificationNumberSchema = z
  .string()
  .regex(/^\d{8}$/, "Company identification number must be 8 digits")
