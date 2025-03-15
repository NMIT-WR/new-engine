import { sqlRaw } from './drizzle';
import { sql } from 'drizzle-orm';

type ProductRecord = {
  product_slug: string;
};

type ProcessedItemsCount = number;

export async function dummyDataImporter() {
  console.log(`Start importing products...`);
  for (let page = 0; true; page++) {
    const processedItems = await importProductPage(page);
    if (!processedItems) break;
  }
  console.log(`Import has been completed.`);
}

async function importProductPage(
  page: number,
  step = 20,
): Promise<ProcessedItemsCount> {
  console.log(`Importing page ${page}`);
  const productList = await sqlRaw<ProductRecord>(sql`
      SELECT p.slug AS product_slug, p.*, sca.*, sco.*, ca.*, cl.*
      FROM products p
      JOIN subcategories sca ON sca.slug = p.subcategory_slug
      JOIN subcollections sco ON sco.id = sca.subcollection_id
      JOIN categories ca ON ca.slug = sco.category_slug
      JOIN collections cl ON cl.id = ca.collection_id
      LIMIT ${step}
      OFFSET ${page * step}`);

  console.log(`Loaded product list`, productList);

  return productList.length;
}
