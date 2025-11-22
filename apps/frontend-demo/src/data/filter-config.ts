export type FilterType =
  | "checkbox"
  | "color"
  | "size"
  | "range"
  | "tree"
  | "sale"

export type FilterOption = {
  value: string
  label: string
  count?: number
  colorHex?: string
  children?: FilterOption[]
}

export type FilterConfig = {
  id: string
  type: FilterType
  title: string
  field: string // Field name in the product data
  options?: FilterOption[]
  range?: {
    min: number
    max: number
    step: number
    prefix?: string
    suffix?: string
  }
  defaultItemsShown?: number
  showClearButton?: boolean
}

// Configuration for clothing/fashion e-commerce
export const fashionFilters: FilterConfig[] = [
  {
    id: "categories",
    type: "checkbox",
    title: "Kategorie",
    field: "collection.handle",
    showClearButton: false,
  },
  {
    id: "price",
    type: "range",
    title: "Cenové rozpětí",
    field: "price",
    range: {
      min: 0,
      max: 300,
      step: 10,
      prefix: "Kč",
    },
  },
  {
    id: "sale",
    type: "sale",
    title: "Výprodej a slevy",
    field: "sale",
  },
  {
    id: "size",
    type: "size",
    title: "Velikost",
    field: "variants.options.size",
    defaultItemsShown: 4,
    showClearButton: true,
  },
  {
    id: "color",
    type: "color",
    title: "Barva",
    field: "variants.options.color",
    defaultItemsShown: 4,
    showClearButton: true,
  },
]

// Example configuration for automotive e-commerce
export const automotiveFilters: FilterConfig[] = [
  {
    id: "categories",
    type: "tree",
    title: "Kategorie",
    field: "categories",
    options: [
      {
        value: "parts",
        label: "Díly",
        children: [
          { value: "engine", label: "Motorové díly" },
          { value: "brakes", label: "Brzdový systém" },
          { value: "suspension", label: "Odpružení" },
        ],
      },
      {
        value: "accessories",
        label: "Příslušenství",
        children: [
          { value: "interior", label: "Interiér" },
          { value: "exterior", label: "Exteriér" },
        ],
      },
    ],
  },
  {
    id: "brand",
    type: "checkbox",
    title: "Značka",
    field: "brand",
    defaultItemsShown: 10,
  },
  {
    id: "price",
    type: "range",
    title: "Cenové rozpětí",
    field: "price",
    range: {
      min: 0,
      max: 5000,
      step: 50,
      prefix: "Kč",
    },
  },
  {
    id: "compatibility",
    type: "checkbox",
    title: "Kompatibilita s vozidlem",
    field: "compatibility",
    defaultItemsShown: 5,
  },
]

// Example configuration for electronics e-commerce
export const electronicsFilters: FilterConfig[] = [
  {
    id: "categories",
    type: "tree",
    title: "Kategorie",
    field: "categories",
    options: [
      {
        value: "computers",
        label: "Počítače",
        children: [
          { value: "laptops", label: "Notebooky" },
          { value: "desktops", label: "Stolní počítače" },
          { value: "tablets", label: "Tablety" },
        ],
      },
      {
        value: "phones",
        label: "Telefony a příslušenství",
        children: [
          { value: "smartphones", label: "Chytré telefony" },
          { value: "cases", label: "Pouzdra a obaly" },
          { value: "chargers", label: "Nabíječky" },
        ],
      },
    ],
  },
  {
    id: "brand",
    type: "checkbox",
    title: "Značka",
    field: "brand",
    defaultItemsShown: 8,
  },
  {
    id: "price",
    type: "range",
    title: "Cenové rozpětí",
    field: "price",
    range: {
      min: 0,
      max: 3000,
      step: 50,
      prefix: "Kč",
    },
  },
  {
    id: "rating",
    type: "checkbox",
    title: "Hodnocení zákazníků",
    field: "rating",
    options: [
      { value: "4+", label: "4 hvězdičky a více" },
      { value: "3+", label: "3 hvězdičky a více" },
      { value: "2+", label: "2 hvězdičky a více" },
    ],
  },
  {
    id: "features",
    type: "checkbox",
    title: "Funkce",
    field: "features",
    defaultItemsShown: 5,
  },
]

// Default to fashion filters for the demo
export const activeFilterConfig = fashionFilters
