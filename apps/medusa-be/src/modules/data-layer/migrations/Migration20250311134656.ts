import { Migration } from '@mikro-orm/migrations';

export class Migration20250311134656 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table if not exists "data_layer" ("id" text not null, "hash" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "data_layer_pkey" primary key ("id"));`
    );
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_data_layer_deleted_at" ON "data_layer" (deleted_at) WHERE deleted_at IS NULL;`
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "data_layer" cascade;`);
  }
}
