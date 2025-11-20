import { Migration } from '@mikro-orm/migrations'

export class Migration20251120120000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table if not exists "ceska_posta_shipment" ("id" text not null, "fulfillment_id" text not null, "order_id" text not null, "service" text not null, "status" text not null, "tracking_number" text not null, "label_url" text null, "environment" text not null, "pickup_point" jsonb null, "address" jsonb null, "contact" jsonb null, "cash_on_delivery" jsonb null, "provider_payload" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "ceska_posta_shipment_pkey" primary key ("id"));`
    )
    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_ceska_posta_shipment_fulfillment_id" ON "ceska_posta_shipment" (fulfillment_id) WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_ceska_posta_shipment_order_id" ON "ceska_posta_shipment" (order_id) WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_ceska_posta_shipment_status" ON "ceska_posta_shipment" (status) WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_ceska_posta_shipment_deleted_at" ON "ceska_posta_shipment" (deleted_at) WHERE deleted_at IS NULL;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "ceska_posta_shipment" cascade;`)
  }
}
