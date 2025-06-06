export type FilterType = 'checkbox' | 'color' | 'size' | 'range' | 'tree'

export interface FilterOption {
  value: string
  label: string
  count?: number
  colorHex?: string
  children?: FilterOption[]
}

export interface FilterConfig {
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
    id: 'categories',
    type: 'checkbox',
    title: 'Categories',
    field: 'collection.handle',
    showClearButton: false,
  },
  {
    id: 'price',
    type: 'range',
    title: 'Price Range',
    field: 'price',
    range: {
      min: 0,
      max: 300,
      step: 10,
      prefix: '€',
    },
  },
  {
    id: 'size',
    type: 'size',
    title: 'Size',
    field: 'variants.options.size',
    defaultItemsShown: 4,
    showClearButton: true,
  },
  {
    id: 'color',
    type: 'color',
    title: 'Color',
    field: 'variants.options.color',
    defaultItemsShown: 4,
    showClearButton: true,
  },
]

// Example configuration for automotive e-commerce
export const automotiveFilters: FilterConfig[] = [
  {
    id: 'categories',
    type: 'tree',
    title: 'Categories',
    field: 'categories',
    options: [
      {
        value: 'parts',
        label: 'Parts',
        children: [
          { value: 'engine', label: 'Engine Parts' },
          { value: 'brakes', label: 'Brake System' },
          { value: 'suspension', label: 'Suspension' },
        ],
      },
      {
        value: 'accessories',
        label: 'Accessories',
        children: [
          { value: 'interior', label: 'Interior' },
          { value: 'exterior', label: 'Exterior' },
        ],
      },
    ],
  },
  {
    id: 'brand',
    type: 'checkbox',
    title: 'Brand',
    field: 'brand',
    defaultItemsShown: 10,
  },
  {
    id: 'price',
    type: 'range',
    title: 'Price Range',
    field: 'price',
    range: {
      min: 0,
      max: 5000,
      step: 50,
      prefix: '€',
    },
  },
  {
    id: 'compatibility',
    type: 'checkbox',
    title: 'Vehicle Compatibility',
    field: 'compatibility',
    defaultItemsShown: 5,
  },
]

// Example configuration for electronics e-commerce
export const electronicsFilters: FilterConfig[] = [
  {
    id: 'categories',
    type: 'tree',
    title: 'Categories',
    field: 'categories',
    options: [
      {
        value: 'computers',
        label: 'Computers',
        children: [
          { value: 'laptops', label: 'Laptops' },
          { value: 'desktops', label: 'Desktop PCs' },
          { value: 'tablets', label: 'Tablets' },
        ],
      },
      {
        value: 'phones',
        label: 'Phones & Accessories',
        children: [
          { value: 'smartphones', label: 'Smartphones' },
          { value: 'cases', label: 'Cases & Covers' },
          { value: 'chargers', label: 'Chargers' },
        ],
      },
    ],
  },
  {
    id: 'brand',
    type: 'checkbox',
    title: 'Brand',
    field: 'brand',
    defaultItemsShown: 8,
  },
  {
    id: 'price',
    type: 'range',
    title: 'Price Range',
    field: 'price',
    range: {
      min: 0,
      max: 3000,
      step: 50,
      prefix: '€',
    },
  },
  {
    id: 'rating',
    type: 'checkbox',
    title: 'Customer Rating',
    field: 'rating',
    options: [
      { value: '4+', label: '4 Stars & Up' },
      { value: '3+', label: '3 Stars & Up' },
      { value: '2+', label: '2 Stars & Up' },
    ],
  },
  {
    id: 'features',
    type: 'checkbox',
    title: 'Features',
    field: 'features',
    defaultItemsShown: 5,
  },
]

// Default to fashion filters for the demo
export const activeFilterConfig = fashionFilters
