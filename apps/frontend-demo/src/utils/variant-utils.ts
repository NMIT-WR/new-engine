import { ProductVariant } from "@/types/product";

const SIZE_ORDER = ['xs', 's', 'm', 'l', 'xl', '2x', '3x', '4x'];

export function sortVariantsBySize(variants: ProductVariant[]): ProductVariant[] {
  return [...variants].sort((a, b) => {
    const aIndex = SIZE_ORDER.indexOf(a.title.toLowerCase());
    const bIndex = SIZE_ORDER.indexOf(b.title.toLowerCase());

    // Pokud není v seznamu velikostí, dát na konec a řadit alfabeticky
    if (aIndex === -1 && bIndex === -1) {
      return a.title.localeCompare(b.title);
    }
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;

    return aIndex - bIndex;
  });
}