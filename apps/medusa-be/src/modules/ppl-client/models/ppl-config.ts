import { model } from "@medusajs/framework/utils"

const PplConfig = model
  .define("ppl_config", {
    id: model.id().primaryKey(),

    // Environment scope (from env var at creation, used for filtering)
    // Each environment has its own config row
    environment: model.text(), // "testing" | "production"

    // Runtime toggle (default: false - admin must enable)
    is_enabled: model.boolean().default(false),

    // Credentials (encrypted before storage)
    client_id: model.text().nullable(),
    client_secret: model.text().nullable(),

    // Label format
    default_label_format: model.text().default("Png"),

    // COD Banking (encrypted)
    cod_bank_account: model.text().nullable(),
    cod_bank_code: model.text().nullable(),
    cod_iban: model.text().nullable(),
    cod_swift: model.text().nullable(),

    // Fallback sender address (not encrypted)
    sender_name: model.text().nullable(),
    sender_street: model.text().nullable(),
    sender_city: model.text().nullable(),
    sender_zip_code: model.text().nullable(),
    sender_country: model.text().nullable(),
    sender_phone: model.text().nullable(),
    sender_email: model.text().nullable(),
  })
  .indexes([
    // One config per environment (exclude soft-deleted records)
    { on: ["environment"], unique: true, where: { deleted_at: null } },
  ])

export default PplConfig
