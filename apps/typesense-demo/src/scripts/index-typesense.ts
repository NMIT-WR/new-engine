import fs from 'fs';
import path from 'path';
import { collectionName } from '@/lib/constants';
import { eshopItemSchema, type typesenseSchema } from '@/lib/schema';
import { typesenseConfig } from '@/lib/typesense';
import ora from 'ora';
import { Client, Errors } from 'typesense';
import type { z } from 'zod';

// Instantiate the Typesense client
const client = new Client(typesenseConfig);

function parseItems(): z.infer<typeof typesenseSchema>[] {
  // Read through the asp_full.jsonl file
  const cwd = process.cwd();
  const jsonFilePath = path.join(cwd, 'data', 'asp_full.jsonl');
  try {
    const result = fs
      .readFileSync(jsonFilePath, 'utf-8')
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const parsed = eshopItemSchema.safeParse(JSON.parse(line));

        // If the item doesn't match the schema, skip it
        if (!parsed.success) {
          return;
        }
        return parsed.data;
      })
      .filter((item) => item !== undefined);

    return result;
  } catch (error) {
    throw error;
  }
}

async function createCollection() {
  const spinner = ora('Creating collection');
  await client.collections().create({
    name: collectionName,
    fields: [
      { name: 'name', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'brand', type: 'string', facet: true, optional: true },
      { name: 'categories', type: 'string[]', facet: true, optional: true },
      { name: 'price', type: 'float', facet: true },
      { name: 'image', type: 'string', optional: true },
      { name: 'popularity', type: 'int32', facet: true },
    ],
    default_sorting_field: 'popularity',
  });
  spinner.succeed('Collection created');
}

async function handleCollection(items: z.infer<typeof typesenseSchema>[]) {
  const spinner = ora('Checking collection');
  try {
    const collection = await client.collections(collectionName).retrieve();
    spinner.text = 'Collection already exists';
    if (collection.num_documents === items.length) {
      spinner.succeed('Collection already has the same number of documents');
      return;
    }

    spinner.warn('Collection has a different number of documents');
    await client.collections(collectionName).delete();
    await createCollection();
  } catch (e: unknown) {
    if (!(e instanceof Errors.ObjectNotFound)) {
      throw e;
    }
    spinner.warn('Collection does not exist');
    await createCollection();
  }
}

// Index the items into Typesense
async function indexItems(items: z.infer<typeof typesenseSchema>[]) {
  await handleCollection(items);
  await client.collections(collectionName).documents().import(items);
}

async function main() {
  const spinner = ora();
  try {
    const items = parseItems();
    await indexItems(items);
    spinner.succeed('Script completed successfully.');
  } catch (error) {
    spinner.fail(`An error occurred: ${JSON.stringify(error)}`);
    process.exit(1);
  }
}

// Run the script
main();
