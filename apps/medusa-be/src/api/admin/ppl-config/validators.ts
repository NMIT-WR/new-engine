import { z } from "zod"

/** Zod schema for validating PPL config update requests */
export const PostAdminPplConfigSchema = z.object({
  is_enabled: z.boolean().optional(),
  client_id: z.string().optional(),
  client_secret: z.string().nullable().optional(),
  default_label_format: z.enum(["Png", "Jpeg", "Svg", "Pdf", "Zpl"]).optional(),
  cod_bank_account: z.string().nullable().optional(),
  cod_bank_code: z.string().nullable().optional(),
  cod_iban: z.string().nullable().optional(),
  cod_swift: z.string().nullable().optional(),
  sender_name: z.string().optional(),
  sender_street: z.string().optional(),
  sender_city: z.string().optional(),
  sender_zip_code: z.string().optional(),
  sender_country: z.string().optional(),
  sender_phone: z.string().optional(),
  sender_email: z.string().email().nullish(),
})

export type PostAdminPplConfigSchemaType = z.infer<
  typeof PostAdminPplConfigSchema
>
