import { z } from "zod";

const eshopItemSchema = z.object({
  name: z.string(),
  description: z.string(),
  brand: z.string().nullable(),
  categories: z.array(z.string()).nullable(),
  price: z.number(),
  image: z.string().nullable(),
  popularity: z.number(),
});

const typesenseSchema = eshopItemSchema;

const attributeLabelMap: { [K in keyof z.infer<typeof typesenseSchema>]: string } = {
  name: "Jméno",
  description: "Popisek",
  brand: "Značka",
  categories: "Kategorie",
  price: "Cena",
  image: "Obrázek",
  popularity: "Oblíbenost",
} as const;

export { attributeLabelMap, eshopItemSchema, typesenseSchema };
