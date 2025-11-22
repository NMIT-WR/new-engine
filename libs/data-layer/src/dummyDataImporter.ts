import { sql } from 'drizzle-orm';
import { sqlRaw } from './drizzle';

type ProductRecord = {
  product_slug: string;
  product_name: string;
  product_description: string;
  product_price: number;
  product_image_url: string;
  subcategory_slug: string;
  subcategory_name: string;
  subcategory_image_url: string;
  subcollection_name: string;
  category_slug: string;
  category_name: string;
  category_image_url: string;
  collection_slug: string;
  collection_name: string;
};

type ProcessedItemsCount = number;

export async function dummyDataImporter() {
  console.log('Start importing products...');
  for (let page = 0; page < 1; page++) {
    const processedItems = await importProductPage(page);
    if (!processedItems) break;
  }
  console.log('Import has been completed.');
}

async function importProductPage(
  page: number,
  step = 20,
): Promise<ProcessedItemsCount> {
  console.log(`Importing page ${page}`);
  const productList = await sqlRaw<ProductRecord>(sql`
      SELECT
        p.slug AS product_slug,
        p.name AS product_name,
        p.description AS product_description,
        p.price AS product_price,
        p.image_url AS product_image_url,
        sca.slug AS subcategory_slug,
        sca.name AS subcategory_name,
        sca.image_url AS subcategory_image_url,
        sco.name AS subcollection_name,
        ca.slug AS category_slug,
        ca.name AS category_name,
        ca.image_url AS category_image_url,
        cl.slug AS collection_slug,
        cl.name AS collection_name
      FROM products p
      JOIN subcategories sca ON sca.slug = p.subcategory_slug
      JOIN subcollections sco ON sco.id = sca.subcollection_id
      JOIN categories ca ON ca.slug = sco.category_slug
      JOIN collections cl ON cl.id = ca.collection_id
      LIMIT ${step}
      OFFSET ${page * step}`);

  console.log('Loaded product list', productList);

  return productList.length;
}
