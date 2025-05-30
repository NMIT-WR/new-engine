import type { BadgeProps } from 'ui/src/atoms/badge'
import type { Product } from '../types/product'

// Mock products that match Medusa data structure
export const mockProducts: Product[] = [
  {
    id: 'prod_01',
    title: 'White Cotton T-Shirt with Extra Long Name That Should Be Truncated',
    handle: 'white-cotton-t-shirt',
    description: 'Comfortable cotton t-shirt perfect for everyday wear',
    thumbnail:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
    images: [
      {
        id: 'img_01',
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
      },
    ],
    status: 'published',
    collection: {
      id: 'col_01',
      title: 'Summer Collection',
      handle: 'summer-collection',
    },
    categories: [{ id: 'cat_01', name: 'T-Shirts', handle: 't-shirts' }],
    variants: [
      {
        id: 'var_01',
        title: 'S',
        sku: 'WT-001-S',
        inventory_quantity: 10,
        prices: [
          {
            id: 'price_01',
            currency_code: 'EUR',
            amount: 2900, // €29.00 in cents
            calculated_price: '€29.00',
            original_price: '€39.00',
          },
        ],
        options: { size: 'S' },
      },
      {
        id: 'var_02',
        title: 'M',
        sku: 'WT-001-M',
        inventory_quantity: 15,
        prices: [
          {
            id: 'price_02',
            currency_code: 'EUR',
            amount: 2900,
            calculated_price: '€29.00',
            original_price: '€39.00',
          },
        ],
        options: { size: 'M' },
      },
    ],
    options: [{ id: 'opt_01', title: 'Size', values: ['S', 'M', 'L', 'XL'] }],
  },
  {
    id: 'prod_02',
    title: 'Blue Denim Jeans',
    handle: 'blue-denim-jeans',
    description: 'Classic blue denim jeans with modern fit',
    thumbnail:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop',
    images: [
      {
        id: 'img_02',
        url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop',
      },
    ],
    status: 'published',
    categories: [{ id: 'cat_02', name: 'Jeans', handle: 'jeans' }],
    variants: [
      {
        id: 'var_03',
        title: '30',
        sku: 'BDJ-001-30',
        inventory_quantity: 8,
        prices: [
          {
            id: 'price_03',
            currency_code: 'EUR',
            amount: 7900,
            calculated_price: '€79.00',
          },
        ],
        options: { size: '30' },
      },
    ],
    options: [
      { id: 'opt_02', title: 'Size', values: ['28', '30', '32', '34'] },
    ],
  },
  {
    id: 'prod_03',
    title: 'Sport Running Shoes',
    handle: 'sport-running-shoes',
    description: 'High-performance running shoes for athletes',
    thumbnail:
      'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&h=800&fit=crop',
    images: [
      {
        id: 'img_03',
        url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&h=800&fit=crop',
      },
    ],
    status: 'published',
    categories: [{ id: 'cat_03', name: 'Shoes', handle: 'shoes' }],
    variants: [
      {
        id: 'var_04',
        title: '42',
        sku: 'SRS-001-42',
        inventory_quantity: 3,
        prices: [
          {
            id: 'price_04',
            currency_code: 'EUR',
            amount: 12900,
            calculated_price: '€129.00',
            original_price: '€159.00',
          },
        ],
        options: { size: '42' },
      },
    ],
    options: [
      { id: 'opt_03', title: 'Size', values: ['40', '41', '42', '43', '44'] },
    ],
  },
  {
    id: 'prod_04',
    title: 'Black Leather Jacket',
    handle: 'black-leather-jacket',
    description: 'Premium leather jacket with modern design',
    thumbnail:
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop',
    images: [
      {
        id: 'img_04',
        url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop',
      },
    ],
    status: 'published',
    categories: [{ id: 'cat_04', name: 'Jackets', handle: 'jackets' }],
    variants: [
      {
        id: 'var_05',
        title: 'L',
        sku: 'BLJ-001-L',
        inventory_quantity: 5,
        prices: [
          {
            id: 'price_05',
            currency_code: 'EUR',
            amount: 19900,
            calculated_price: '€199.00',
          },
        ],
        options: { size: 'L' },
      },
    ],
    options: [{ id: 'opt_04', title: 'Size', values: ['S', 'M', 'L', 'XL'] }],
  },
  {
    id: 'prod_05',
    title: 'Striped Summer Dress',
    handle: 'striped-summer-dress',
    description: 'Light and breezy summer dress with elegant stripes',
    thumbnail:
      'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=600&h=800&fit=crop',
    images: [
      {
        id: 'img_05',
        url: 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=600&h=800&fit=crop',
      },
    ],
    status: 'published',
    collection: {
      id: 'col_01',
      title: 'Summer Collection',
      handle: 'summer-collection',
    },
    categories: [{ id: 'cat_05', name: 'Dresses', handle: 'dresses' }],
    variants: [
      {
        id: 'var_06',
        title: 'M',
        sku: 'SSD-001-M',
        inventory_quantity: 12,
        prices: [
          {
            id: 'price_06',
            currency_code: 'EUR',
            amount: 4900,
            calculated_price: '€49.00',
            original_price: '€69.00',
          },
        ],
        options: { size: 'M' },
      },
    ],
    options: [{ id: 'opt_05', title: 'Size', values: ['XS', 'S', 'M', 'L'] }],
  },
  {
    id: 'prod_06',
    title: 'Casual Canvas Backpack',
    handle: 'casual-canvas-backpack',
    description: 'Durable canvas backpack perfect for daily use',
    thumbnail:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop',
    images: [
      {
        id: 'img_06',
        url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop',
      },
    ],
    status: 'published',
    categories: [{ id: 'cat_06', name: 'Accessories', handle: 'accessories' }],
    variants: [
      {
        id: 'var_07',
        title: 'One Size',
        sku: 'CCB-001',
        inventory_quantity: 20,
        prices: [
          {
            id: 'price_07',
            currency_code: 'EUR',
            amount: 3900,
            calculated_price: '€39.00',
          },
        ],
        options: { size: 'One Size' },
      },
    ],
    options: [{ id: 'opt_06', title: 'Size', values: ['One Size'] }],
  },
  {
    id: 'prod_07',
    title: 'Wool Winter Scarf',
    handle: 'wool-winter-scarf',
    description: 'Warm and cozy wool scarf for cold winter days',
    thumbnail:
      'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&h=800&fit=crop',
    images: [
      {
        id: 'img_07',
        url: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&h=800&fit=crop',
      },
    ],
    status: 'published',
    collection: {
      id: 'col_02',
      title: 'Winter Collection',
      handle: 'winter-collection',
    },
    categories: [{ id: 'cat_06', name: 'Accessories', handle: 'accessories' }],
    variants: [
      {
        id: 'var_08',
        title: 'Grey',
        sku: 'WWS-001-GR',
        inventory_quantity: 2,
        prices: [
          {
            id: 'price_08',
            currency_code: 'EUR',
            amount: 2900,
            calculated_price: '€29.00',
          },
        ],
        options: { color: 'Grey' },
      },
    ],
    options: [
      { id: 'opt_07', title: 'Color', values: ['Grey', 'Black', 'Navy'] },
    ],
  },
  {
    id: 'prod_08',
    title: 'High-top Canvas Sneakers',
    handle: 'high-top-canvas-sneakers',
    description: 'Classic high-top sneakers with timeless style',
    thumbnail:
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&h=800&fit=crop',
    images: [
      {
        id: 'img_08',
        url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&h=800&fit=crop',
      },
    ],
    status: 'published',
    categories: [{ id: 'cat_03', name: 'Shoes', handle: 'shoes' }],
    variants: [
      {
        id: 'var_09',
        title: '41',
        sku: 'HCS-001-41',
        inventory_quantity: 6,
        prices: [
          {
            id: 'price_09',
            currency_code: 'EUR',
            amount: 5900,
            calculated_price: '€59.00',
          },
        ],
        options: { size: '41' },
      },
    ],
    options: [
      { id: 'opt_08', title: 'Size', values: ['39', '40', '41', '42', '43'] },
    ],
  },
  {
    id: 'prod_09',
    title: 'Linen Button-up Shirt',
    handle: 'linen-button-up-shirt',
    description: 'Breathable linen shirt perfect for summer days',
    thumbnail:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop',
    images: [
      {
        id: 'img_09',
        url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop',
      },
    ],
    status: 'published',
    collection: {
      id: 'col_01',
      title: 'Summer Collection',
      handle: 'summer-collection',
    },
    categories: [{ id: 'cat_01', name: 'T-Shirts', handle: 't-shirts' }],
    variants: [
      {
        id: 'var_10',
        title: 'L',
        sku: 'LBS-001-L',
        inventory_quantity: 15,
        prices: [
          {
            id: 'price_10',
            currency_code: 'EUR',
            amount: 4500,
            calculated_price: '€45.00',
          },
        ],
        options: { size: 'L' },
      },
    ],
    options: [{ id: 'opt_09', title: 'Size', values: ['S', 'M', 'L', 'XL'] }],
  },
  {
    id: 'prod_10',
    title: 'Leather Crossbody Bag',
    handle: 'leather-crossbody-bag',
    description: 'Elegant leather crossbody bag with adjustable strap',
    thumbnail:
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop',
    images: [
      {
        id: 'img_10',
        url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop',
      },
    ],
    status: 'published',
    categories: [{ id: 'cat_06', name: 'Accessories', handle: 'accessories' }],
    variants: [
      {
        id: 'var_11',
        title: 'Brown',
        sku: 'LCB-001-BR',
        inventory_quantity: 8,
        prices: [
          {
            id: 'price_11',
            currency_code: 'EUR',
            amount: 8900,
            calculated_price: '€89.00',
            original_price: '€119.00',
          },
        ],
        options: { color: 'Brown' },
      },
    ],
    options: [
      { id: 'opt_10', title: 'Color', values: ['Brown', 'Black', 'Tan'] },
    ],
  },
]

export const categories = [
  {
    id: 'cat_01',
    name: 'T-Shirts & Tops',
    handle: 't-shirts-tops',
    imageUrl:
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=400&fit=crop',
    count: 156,
  },
  {
    id: 'cat_02',
    name: 'Jeans & Pants',
    handle: 'jeans-pants',
    imageUrl:
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=400&fit=crop',
    count: 89,
  },
  {
    id: 'cat_03',
    name: 'Shoes & Sneakers',
    handle: 'shoes-sneakers',
    imageUrl:
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=400&fit=crop',
    count: 124,
  },
  {
    id: 'cat_04',
    name: 'Jackets & Coats',
    handle: 'jackets-coats',
    imageUrl:
      'https://images.unsplash.com/photo-1557418669-db3f781a58c0?w=600&h=400&fit=crop',
    count: 67,
  },
]

// Helper functions to get data from products
export function getProductPrice(product: Product, currencyCode = 'EUR') {
  const firstVariant = product.variants?.[0]
  if (!firstVariant) {
    return null
  }

  const price = firstVariant.prices?.find(
    (p) => p.currency_code === currencyCode
  )
  return price || null
}

export function getProductStock(
  product: Product
): 'in-stock' | 'low-stock' | 'out-of-stock' {
  const totalStock =
    product.variants?.reduce(
      (sum, variant) => sum + (variant.inventory_quantity || 0),
      0
    ) || 0

  if (totalStock === 0) {
    return 'out-of-stock'
  }
  if (totalStock < 5) {
    return 'low-stock'
  }
  return 'in-stock'
}

export function getProductBadges(product: Product) {
  const badges: BadgeProps[] = []
  const price = getProductPrice(product)

  // Sale badge
  if (
    price?.original_price &&
    price?.calculated_price &&
    price.calculated_price !== price.original_price
  ) {
    const discount = Math.round(
      ((Number.parseFloat(price.original_price.replace('€', '')) -
        Number.parseFloat(price.calculated_price.replace('€', ''))) /
        Number.parseFloat(price.original_price.replace('€', ''))) *
        100
    )
    badges.push({ variant: 'danger' as const, children: `-${discount}%` })
  }

  // New badge (you'd check created_at in real app)
  if (product.id === 'prod_01' || product.id === 'prod_04') {
    badges.push({ variant: 'success' as const, children: 'New' })
  }

  // Low stock badge
  const stock = getProductStock(product)
  if (stock === 'low-stock') {
    badges.push({ variant: 'warning' as const, children: 'Limited' })
  }

  return badges
}
