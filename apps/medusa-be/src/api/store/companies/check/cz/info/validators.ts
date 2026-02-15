import { z } from "zod"

export const CzCompanyIdentificationNumberSchema = z
  .string()
  .regex(/^\d{8}$/, "Company identification number must be 8 digits")

export type CzCompanyIdentificationNumberType = z.infer<
  typeof CzCompanyIdentificationNumberSchema
>
