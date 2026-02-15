import { z } from "zod"

export const AdminCompaniesCheckCzAddressCountSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  postal_code: z.string().min(1).optional(),
})

export type AdminCompaniesCheckCzAddressCountSchemaType = z.infer<
  typeof AdminCompaniesCheckCzAddressCountSchema
>
