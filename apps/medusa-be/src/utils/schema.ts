import {
  pgTable,
  serial,
  text,
  integer,
  varchar,
  numeric,
  timestamp,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: serial().primaryKey().notNull(),
    username: varchar({ length: 100 }).notNull(),
    passwordHash: text().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [uniqueIndex('users_username_unique').on(table.username)],
);

export const collections = pgTable('collections', {
  id: serial().primaryKey().notNull(),
  name: text().notNull(),
  slug: text().notNull(),
});

export const categories = pgTable(
  'categories',
  {
    slug: text().primaryKey().notNull(),
    name: text().notNull(),
    collectionId: integer('collection_id')
      .notNull()
      .references(() => collections.id),
    imageUrl: text('image_url'),
  },
  (table) => [index('categories_collection_id_idx').on(table.collectionId)],
);

export const subcollections = pgTable(
  'subcollections',
  {
    id: serial().primaryKey().notNull(),
    name: text().notNull(),
    categorySlug: text('category_slug')
      .notNull()
      .references(() => categories.slug),
  },
  (table) => [index('subcollections_category_slug_idx').on(table.categorySlug)],
);

export const subcategories = pgTable(
  'subcategories',
  {
    slug: text().primaryKey().notNull(),
    name: text().notNull(),
    subcollectionId: integer('subcollection_id')
      .notNull()
      .references(() => subcollections.id),
    imageUrl: text('image_url'),
  },
  (table) => [
    index('subcategories_subcollection_id_idx').on(table.subcollectionId),
  ],
);

export const products = pgTable(
  'products',
  {
    slug: text().primaryKey().notNull(),
    name: text().notNull(),
    description: text().notNull(),
    price: numeric().notNull(),
    subcategorySlug: text('subcategory_slug')
      .notNull()
      .references(() => subcategories.slug),
    imageUrl: text('image_url'),
  },
  () => [],
);
