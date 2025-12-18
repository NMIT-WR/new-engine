import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20251216231615 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "ppl_config" drop constraint if exists "ppl_config_environment_unique";`);
    this.addSql(`create table if not exists "ppl_config" ("id" text not null, "environment" text not null, "is_enabled" boolean not null default false, "client_id" text null, "client_secret" text null, "default_label_format" text not null default 'Png', "cod_bank_account" text null, "cod_bank_code" text null, "cod_iban" text null, "cod_swift" text null, "sender_name" text null, "sender_street" text null, "sender_city" text null, "sender_zip_code" text null, "sender_country" text null, "sender_phone" text null, "sender_email" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "ppl_config_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_ppl_config_deleted_at" ON "ppl_config" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_ppl_config_environment_unique" ON "ppl_config" ("environment") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "ppl_config" cascade;`);
  }

}
