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
          {
            id: 'price_11_usd',
            currency_code: 'USD',
            amount: 9900,
            calculated_price: '$99.00',
            original_price: '$129.00',
          },
        ],
        options: { color: 'Brown' },
      },
    ],
    options: [
      { id: 'opt_10', title: 'Color', values: ['Brown', 'Black', 'Tan'] },
    ],
  },
  // Additional 20 products
  {
    id: 'prod_11',
    title: 'Classic Oxford Shirt',
    handle: 'classic-oxford-shirt',
    description: 'Timeless oxford shirt for formal and casual occasions',
    thumbnail:
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop',
    images: [
      {
        id: 'img_11',
        url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop',
      },
    ],
    status: 'published',
    categories: [{ id: 'cat_01', name: 'T-Shirts', handle: 't-shirts' }],
    variants: [
      {
        id: 'var_12',
        title: 'M / Light Blue',
        sku: 'OXF-001-M-LB',
        inventory_quantity: 25,
        prices: [
          {
            id: 'price_12',
            currency_code: 'EUR',
            amount: 5500,
            calculated_price: '€55.00',
          },
          {
            id: 'price_12_usd',
            currency_code: 'USD',
            amount: 6500,
            calculated_price: '$65.00',
          },
        ],
        options: { size: 'M', color: 'Light Blue' },
      },
      {
        id: 'var_13',
        title: 'L / White',
        sku: 'OXF-001-L-W',
        inventory_quantity: 18,
        prices: [
          {
            id: 'price_13',
            currency_code: 'EUR',
            amount: 5500,
            calculated_price: '€55.00',
          },
          {
            id: 'price_13_usd',
            currency_code: 'USD',
            amount: 6500,
            calculated_price: '$65.00',
          },
        ],
        options: { size: 'L', color: 'White' },
      },
    ],
    options: [
      { id: 'opt_11', title: 'Size', values: ['S', 'M', 'L', 'XL'] },
      { id: 'opt_12', title: 'Color', values: ['White', 'Light Blue', 'Pink'] },
    ],
  },
  {
    id: 'prod_12',
    title: 'Wool Blend Coat',
    handle: 'wool-blend-coat',
    description: 'Sophisticated wool blend coat for winter elegance',
    thumbnail:
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=800&fit=crop',
    images: [
      {
        id: 'img_12',
        url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=800&fit=crop',
      },
    ],
    status: 'published',
    collection: {
      id: 'col_02',
      title: 'Winter Collection',
      handle: 'winter-collection',
    },
    categories: [{ id: 'cat_04', name: 'Jackets', handle: 'jackets' }],
    variants: [
      {
        id: 'var_14',
        title: 'M / Camel',
        sku: 'WBC-001-M-C',
        inventory_quantity: 7,
        prices: [
          {
            id: 'price_14',
            currency_code: 'EUR',
            amount: 24900,
            calculated_price: '€249.00',
          },
          {
            id: 'price_14_usd',
            currency_code: 'USD',
            amount: 28900,
            calculated_price: '$289.00',
          },
        ],
        options: { size: 'M', color: 'Camel' },
      },
    ],
    options: [
      { id: 'opt_13', title: 'Size', values: ['XS', 'S', 'M', 'L'] },
      { id: 'opt_14', title: 'Color', values: ['Camel', 'Black', 'Grey'] },
    ],
  },
  {
    id: 'prod_13',
    title: 'Slim Fit Chinos',
    handle: 'slim-fit-chinos',
    description: 'Modern slim fit chinos for versatile styling',
    thumbnail:
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop',
    images: [
      {
        id: 'img_13',
        url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop',
      },
    ],
    status: 'published',
    categories: [{ id: 'cat_02', name: 'Jeans', handle: 'jeans' }],
    variants: [
      {
        id: 'var_15',
        title: '32 / Navy',
        sku: 'CHI-001-32-N',
        inventory_quantity: 22,
        prices: [
          {
            id: 'price_15',
            currency_code: 'EUR',
            amount: 6900,
            calculated_price: '€69.00',
          },
          {
            id: 'price_15_usd',
            currency_code: 'USD',
            amount: 7900,
            calculated_price: '$79.00',
          },
        ],
        options: { size: '32', color: 'Navy' },
      },
    ],
    options: [
      { id: 'opt_15', title: 'Size', values: ['30', '32', '34', '36'] },
      { id: 'opt_16', title: 'Color', values: ['Navy', 'Khaki', 'Black'] },
    ],
  },
  {
    id: 'prod_14',
    title: 'Cashmere V-Neck Sweater',
    handle: 'cashmere-v-neck-sweater',
    description: 'Luxurious cashmere sweater for ultimate comfort',
    thumbnail:
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&h=800&fit=crop',
    images: [
      {
        id: 'img_14',
        url: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&h=800&fit=crop',
      },
    ],
    status: 'published',
    categories: [{ id: 'cat_07', name: 'Knitwear', handle: 'knitwear' }],
    variants: [
      {
        id: 'var_16',
        title: 'L / Burgundy',
        sku: 'CAS-001-L-B',
        inventory_quantity: 5,
        prices: [
          {
            id: 'price_16',
            currency_code: 'EUR',
            amount: 15900,
            calculated_price: '€159.00',
            original_price: '€199.00',
          },
          {
            id: 'price_16_usd',
            currency_code: 'USD',
            amount: 17900,
            calculated_price: '$179.00',
            original_price: '$229.00',
          },
        ],
        options: { size: 'L', color: 'Burgundy' },
      },
    ],
    options: [
      { id: 'opt_17', title: 'Size', values: ['S', 'M', 'L', 'XL'] },
      { id: 'opt_18', title: 'Color', values: ['Burgundy', 'Navy', 'Grey'] },
    ],
  },
  {
    id: 'prod_15',
    title: 'Athletic Performance Leggings',
    handle: 'athletic-performance-leggings',
    description: 'High-performance leggings for active lifestyle',
    thumbnail:
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=800&fit=crop',
    images: [
      {
        id: 'img_15',
        url: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=800&fit=crop',
      },
    ],
    status: 'published',
    categories: [{ id: 'cat_08', name: 'Activewear', handle: 'activewear' }],
    variants: [
      {
        id: 'var_17',
        title: 'M / Black',
        sku: 'LEG-001-M-B',
        inventory_quantity: 30,
        prices: [
          {
            id: 'price_17',
            currency_code: 'EUR',
            amount: 4900,
            calculated_price: '€49.00',
          },
          {
            id: 'price_17_usd',
            currency_code: 'USD',
            amount: 5900,
            calculated_price: '$59.00',
          },
        ],
        options: { size: 'M', color: 'Black' },
      },
    ],
    options: [
      { id: 'opt_19', title: 'Size', values: ['XS', 'S', 'M', 'L', 'XL'] },
      { id: 'opt_20', title: 'Color', values: ['Black', 'Navy', 'Charcoal'] },
    ],
  },
  {
    id: 'prod_16',
    title: 'Silk Blend Scarf',
    handle: 'silk-blend-scarf',
    description: 'Elegant silk blend scarf with intricate patterns',
    thumbnail:
      'https://images.unsplash.com/photo-1601924357840-3e50ad4dd9fd?w=600&h=800&fit=crop',
    images: [
      {
        id: 'img_16',
        url: 'https://images.unsplash.com/photo-1601924357840-3e50ad4dd9fd?w=600&h=800&fit=crop',
      },
    ],
    status: 'published',
    categories: [{ id: 'cat_06', name: 'Accessories', handle: 'accessories' }],
    variants: [
      {
        id: 'var_18',
        title: 'Paisley Blue',
        sku: 'SCF-001-PB',
        inventory_quantity: 15,
        prices: [
          {
            id: 'price_18',
            currency_code: 'EUR',
            amount: 3900,
            calculated_price: '€39.00',
          },
          {
            id: 'price_18_usd',
            currency_code: 'USD',
            amount: 4500,
            calculated_price: '$45.00',
          },
        ],
        options: { pattern: 'Paisley Blue' },
      },
    ],
    options: [
      { id: 'opt_21', title: 'Pattern', values: ['Paisley Blue', 'Floral Red', 'Geometric'] },
    ],
  },
  {
    id: 'prod_17',
    title: 'Bomber Jacket',
    handle: 'bomber-jacket',
    description: 'Classic bomber jacket with modern details',
    thumbnail:
      'https://images.unsplash.com/photo-1552327359-d86398116072?w=600&h=800&fit=crop',
    images: [
      {
        id: 'img_17',
        url: 'https://images.unsplash.com/photo-1552327359-d86398116072?w=600&h=800&fit=crop',
      },
    ],
    status: 'published',
    categories: [{ id: 'cat_04', name: 'Jackets', handle: 'jackets' }],
    variants: [
      {
        id: 'var_19',
        title: 'L / Olive',
        sku: 'BMB-001-L-O',
        inventory_quantity: 12,
        prices: [
          {
            id: 'price_19',
            currency_code: 'EUR',
            amount: 8900,
            calculated_price: '€89.00',
          },
          {
            id: 'price_19_usd',
            currency_code: 'USD',
            amount: 9900,
            calculated_price: '$99.00',
          },
        ],
        options: { size: 'L', color: 'Olive' },
      },
    ],
    options: [
      { id: 'opt_22', title: 'Size', values: ['S', 'M', 'L', 'XL'] },
      { id: 'opt_23', title: 'Color', values: ['Black', 'Navy', 'Olive'] },
    ],
  },
  {
    id: 'prod_18',
    title: 'Pleated Midi Skirt',
    handle: 'pleated-midi-skirt',
    description: 'Elegant pleated midi skirt for sophisticated looks',
    thumbnail:
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=800&fit=crop',
    images: [
      {
        id: 'img_18',
        url: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=800&fit=crop',
      },
    ],
    status: 'published',
    categories: [{ id: 'cat_09', name: 'Skirts', handle: 'skirts' }],
    variants: [
      {
        id: 'var_20',
        title: 'S / Blush',
        sku: 'SKT-001-S-B',
        inventory_quantity: 20,
        prices: [
          {
            id: 'price_20',
            currency_code: 'EUR',
            amount: 5900,
            calculated_price: '€59.00',
          },
          {
            id: 'price_20_usd',
            currency_code: 'USD',
            amount: 6900,
            calculated_price: '$69.00',
          },
        ],
        options: { size: 'S', color: 'Blush' },
      },
    ],
    options: [
      { id: 'opt_24', title: 'Size', values: ['XS', 'S', 'M', 'L'] },
      { id: 'opt_25', title: 'Color', values: ['Black', 'Blush', 'Navy'] },
    ],
  },
  {
    id: 'prod_19',
    title: 'Chelsea Boots',
    handle: 'chelsea-boots',
    description: 'Classic leather Chelsea boots with elastic side panels',
    thumbnail:
      'https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=600&h=800&fit=crop',
    images: [
      {
        id: 'img_19',
        url: 'https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=600&h=800&fit=crop',
      },
    ],
    status: 'published',
    categories: [{ id: 'cat_03', name: 'Shoes', handle: 'shoes' }],
    variants: [
      {
        id: 'var_21',
        title: '42 / Brown',
        sku: 'CHB-001-42-BR',
        inventory_quantity: 10,
        prices: [
          {
            id: 'price_21',
            currency_code: 'EUR',
            amount: 16900,
            calculated_price: '€169.00',
          },
          {
            id: 'price_21_usd',
            currency_code: 'USD',
            amount: 18900,
            calculated_price: '$189.00',
          },
        ],
        options: { size: '42', color: 'Brown' },
      },
    ],
    options: [
      { id: 'opt_26', title: 'Size', values: ['40', '41', '42', '43', '44'] },
      { id: 'opt_27', title: 'Color', values: ['Black', 'Brown'] },
    ],
  },
  {
    id: 'prod_20',
    title: 'Turtleneck Sweater',
    handle: 'turtleneck-sweater',
    description: 'Cozy turtleneck sweater in merino wool blend',
    thumbnail:
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop',
    images: [
      {
        id: 'img_20',
        url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop',
      },
    ],
    status: 'published',
    collection: {
      id: 'col_02',
      title: 'Winter Collection',
      handle: 'winter-collection',
    },
    categories: [{ id: 'cat_07', name: 'Knitwear', handle: 'knitwear' }],
    variants: [
      {
        id: 'var_22',
        title: 'M / Cream',
        sku: 'TRT-001-M-C',
        inventory_quantity: 18,
        prices: [
          {
            id: 'price_22',
            currency_code: 'EUR',
            amount: 7900,
            calculated_price: '€79.00',
          },
          {
            id: 'price_22_usd',
            currency_code: 'USD',
            amount: 8900,
            calculated_price: '$89.00',
          },
        ],
        options: { size: 'M', color: 'Cream' },
      },
    ],
    options: [
      { id: 'opt_28', title: 'Size', values: ['XS', 'S', 'M', 'L', 'XL'] },
      { id: 'opt_29', title: 'Color', values: ['Black', 'Cream', 'Grey', 'Camel'] },
    ],
  },
  {
    id: 'prod_21',
    title: 'Cargo Pants',
    handle: 'cargo-pants',
    description: 'Utility-inspired cargo pants with multiple pockets',
    thumbnail:
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=800&fit=crop',
    images: [
      {
        id: 'img_21',
        url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=800&fit=crop',
      },
    ],
    status: 'published',
    categories: [{ id: 'cat_02', name: 'Jeans', handle: 'jeans' }],
    variants: [
      {
        id: 'var_23',
        title: '34 / Khaki',
        sku: 'CRG-001-34-K',
        inventory_quantity: 14,
        prices: [
          {
            id: 'price_23',
            currency_code: 'EUR',
            amount: 7500,
            calculated_price: '€75.00',
            original_price: '€95.00',
          },
          {
            id: 'price_23_usd',
            currency_code: 'USD',
            amount: 8500,
            calculated_price: '$85.00',
            original_price: '$105.00',
          },
        ],
        options: { size: '34', color: 'Khaki' },
      },
    ],
    options: [
      { id: 'opt_30', title: 'Size', values: ['30', '32', '34', '36'] },
      { id: 'opt_31', title: 'Color', values: ['Black', 'Khaki', 'Olive'] },
    ],
  },
  {
    id: 'prod_22',
    title: 'Maxi Dress',
    handle: 'maxi-dress',
    description: 'Flowing maxi dress perfect for summer evenings',
    thumbnail:
      'https://images.unsplash.com/photo-1496217590455-aa63a8350eea?w=600&h=800&fit=crop',
    images: [
      {
        id: 'img_22',
        url: 'https://images.unsplash.com/photo-1496217590455-aa63a8350eea?w=600&h=800&fit=crop',
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
        id: 'var_24',
        title: 'M / Coral',
        sku: 'MAX-001-M-C',
        inventory_quantity: 9,
        prices: [
          {
            id: 'price_24',
            currency_code: 'EUR',
            amount: 8900,
            calculated_price: '€89.00',
          },
          {
            id: 'price_24_usd',
            currency_code: 'USD',
            amount: 9900,
            calculated_price: '$99.00',
          },
        ],
        options: { size: 'M', color: 'Coral' },
      },
    ],
    options: [
      { id: 'opt_32', title: 'Size', values: ['XS', 'S', 'M', 'L'] },
      { id: 'opt_33', title: 'Color', values: ['Coral', 'Navy', 'Sage'] },
    ],
  },
  {
    id: 'prod_23',
    title: 'Baseball Cap',
    handle: 'baseball-cap',
    description: 'Classic cotton baseball cap with adjustable strap',
    thumbnail:
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=800&fit=crop',
    images: [
      {
        id: 'img_23',
        url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=800&fit=crop',
      },
    ],
    status: 'published',
    categories: [{ id: 'cat_06', name: 'Accessories', handle: 'accessories' }],
    variants: [
      {
        id: 'var_25',
        title: 'Navy',
        sku: 'CAP-001-N',
        inventory_quantity: 35,
        prices: [
          {
            id: 'price_25',
            currency_code: 'EUR',
            amount: 2500,
            calculated_price: '€25.00',
          },
          {
            id: 'price_25_usd',
            currency_code: 'USD',
            amount: 2900,
            calculated_price: '$29.00',
          },
        ],
        options: { color: 'Navy' },
      },
    ],
    options: [
      { id: 'opt_34', title: 'Color', values: ['Black', 'Navy', 'Beige', 'White'] },
    ],
  },
  {
    id: 'prod_24',
    title: 'Denim Jacket',
    handle: 'denim-jacket',
    description: 'Classic denim jacket with vintage wash',
    thumbnail:
      'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=600&h=800&fit=crop',
    images: [
      {
        id: 'img_24',
        url: 'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=600&h=800&fit=crop',
      },
    ],
    status: 'published',
    categories: [{ id: 'cat_04', name: 'Jackets', handle: 'jackets' }],
    variants: [
      {
        id: 'var_26',
        title: 'M / Light Wash',
        sku: 'DNM-001-M-LW',
        inventory_quantity: 16,
        prices: [
          {
            id: 'price_26',
            currency_code: 'EUR',
            amount: 8500,
            calculated_price: '€85.00',
          },
          {
            id: 'price_26_usd',
            currency_code: 'USD',
            amount: 9500,
            calculated_price: '$95.00',
          },
        ],
        options: { size: 'M', wash: 'Light Wash' },
      },
    ],
    options: [
      { id: 'opt_35', title: 'Size', values: ['XS', 'S', 'M', 'L', 'XL'] },
      { id: 'opt_36', title: 'Wash', values: ['Light Wash', 'Dark Wash', 'Black'] },
    ],
  },
  {
    id: 'prod_25',
    title: 'Loafers',
    handle: 'loafers',
    description: 'Leather penny loafers for timeless style',
    thumbnail:
      'https://images.unsplash.com/photo-1582897085656-c636d006a246?w=600&h=800&fit=crop',
    images: [
      {
        id: 'img_25',
        url: 'https://images.unsplash.com/photo-1582897085656-c636d006a246?w=600&h=800&fit=crop',
      },
    ],
    status: 'published',
    categories: [{ id: 'cat_03', name: 'Shoes', handle: 'shoes' }],
    variants: [
      {
        id: 'var_27',
        title: '41 / Burgundy',
        sku: 'LOF-001-41-B',
        inventory_quantity: 8,
        prices: [
          {
            id: 'price_27',
            currency_code: 'EUR',
            amount: 13900,
            calculated_price: '€139.00',
          },
          {
            id: 'price_27_usd',
            currency_code: 'USD',
            amount: 15900,
            calculated_price: '$159.00',
          },
        ],
        options: { size: '41', color: 'Burgundy' },
      },
    ],
    options: [
      { id: 'opt_37', title: 'Size', values: ['39', '40', '41', '42', '43'] },
      { id: 'opt_38', title: 'Color', values: ['Black', 'Brown', 'Burgundy'] },
    ],
  },
  {
    id: 'prod_26',
    title: 'Wrap Blouse',
    handle: 'wrap-blouse',
    description: 'Elegant wrap blouse in flowing fabric',
    thumbnail:
      'https://images.unsplash.com/photo-1485231183945-fffde7cc051e?w=600&h=800&fit=crop',
    images: [
      {
        id: 'img_26',
        url: 'https://images.unsplash.com/photo-1485231183945-fffde7cc051e?w=600&h=800&fit=crop',
      },
    ],
    status: 'published',
    categories: [{ id: 'cat_01', name: 'T-Shirts', handle: 't-shirts' }],
    variants: [
      {
        id: 'var_28',
        title: 'S / Emerald',
        sku: 'WRP-001-S-E',
        inventory_quantity: 12,
        prices: [
          {
            id: 'price_28',
            currency_code: 'EUR',
            amount: 4900,
            calculated_price: '€49.00',
          },
          {
            id: 'price_28_usd',
            currency_code: 'USD',
            amount: 5900,
            calculated_price: '$59.00',
          },
        ],
        options: { size: 'S', color: 'Emerald' },
      },
    ],
    options: [
      { id: 'opt_39', title: 'Size', values: ['XS', 'S', 'M', 'L'] },
      { id: 'opt_40', title: 'Color', values: ['Black', 'Emerald', 'Ivory'] },
    ],
  },
  {
    id: 'prod_27',
    title: 'Track Jacket',
    handle: 'track-jacket',
    description: 'Retro-inspired track jacket with contrast stripes',
    thumbnail:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop',
    images: [
      {
        id: 'img_27',
        url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop',
      },
    ],
    status: 'published',
    categories: [{ id: 'cat_08', name: 'Activewear', handle: 'activewear' }],
    variants: [
      {
        id: 'var_29',
        title: 'L / Red',
        sku: 'TRK-001-L-R',
        inventory_quantity: 20,
        prices: [
          {
            id: 'price_29',
            currency_code: 'EUR',
            amount: 6500,
            calculated_price: '€65.00',
          },
          {
            id: 'price_29_usd',
            currency_code: 'USD',
            amount: 7500,
            calculated_price: '$75.00',
          },
        ],
        options: { size: 'L', color: 'Red' },
      },
    ],
    options: [
      { id: 'opt_41', title: 'Size', values: ['S', 'M', 'L', 'XL'] },
      { id: 'opt_42', title: 'Color', values: ['Black', 'Navy', 'Red'] },
    ],
  },
  {
    id: 'prod_28',
    title: 'Wide Leg Trousers',
    handle: 'wide-leg-trousers',
    description: 'Contemporary wide leg trousers in premium fabric',
    thumbnail:
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop',
    images: [
      {
        id: 'img_28',
        url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop',
      },
    ],
    status: 'published',
    categories: [{ id: 'cat_02', name: 'Jeans', handle: 'jeans' }],
    variants: [
      {
        id: 'var_30',
        title: '32 / Charcoal',
        sku: 'WLT-001-32-C',
        inventory_quantity: 11,
        prices: [
          {
            id: 'price_30',
            currency_code: 'EUR',
            amount: 9500,
            calculated_price: '€95.00',
            original_price: '€115.00',
          },
          {
            id: 'price_30_usd',
            currency_code: 'USD',
            amount: 10900,
            calculated_price: '$109.00',
            original_price: '$129.00',
          },
        ],
        options: { size: '32', color: 'Charcoal' },
      },
    ],
    options: [
      { id: 'opt_43', title: 'Size', values: ['28', '30', '32', '34', '36'] },
      { id: 'opt_44', title: 'Color', values: ['Black', 'Charcoal', 'Cream'] },
    ],
  },
  {
    id: 'prod_29',
    title: 'Bucket Hat',
    handle: 'bucket-hat',
    description: 'Trendy bucket hat for sun protection and style',
    thumbnail:
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&h=800&fit=crop',
    images: [
      {
        id: 'img_29',
        url: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&h=800&fit=crop',
      },
    ],
    status: 'published',
    collection: {
      id: 'col_01',
      title: 'Summer Collection',
      handle: 'summer-collection',
    },
    categories: [{ id: 'cat_06', name: 'Accessories', handle: 'accessories' }],
    variants: [
      {
        id: 'var_31',
        title: 'Denim',
        sku: 'BKT-001-D',
        inventory_quantity: 25,
        prices: [
          {
            id: 'price_31',
            currency_code: 'EUR',
            amount: 3200,
            calculated_price: '€32.00',
          },
          {
            id: 'price_31_usd',
            currency_code: 'USD',
            amount: 3800,
            calculated_price: '$38.00',
          },
        ],
        options: { material: 'Denim' },
      },
    ],
    options: [
      { id: 'opt_45', title: 'Material', values: ['Cotton', 'Denim', 'Canvas'] },
    ],
  },
  {
    id: 'prod_30',
    title: 'Cardigan',
    handle: 'cardigan',
    description: 'Soft knit cardigan with button closure',
    thumbnail:
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop',
    images: [
      {
        id: 'img_30',
        url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop',
      },
    ],
    status: 'published',
    categories: [{ id: 'cat_07', name: 'Knitwear', handle: 'knitwear' }],
    variants: [
      {
        id: 'var_32',
        title: 'M / Oatmeal',
        sku: 'CRD-001-M-O',
        inventory_quantity: 13,
        prices: [
          {
            id: 'price_32',
            currency_code: 'EUR',
            amount: 8900,
            calculated_price: '€89.00',
          },
          {
            id: 'price_32_usd',
            currency_code: 'USD',
            amount: 9900,
            calculated_price: '$99.00',
          },
        ],
        options: { size: 'M', color: 'Oatmeal' },
      },
    ],
    options: [
      { id: 'opt_46', title: 'Size', values: ['XS', 'S', 'M', 'L', 'XL'] },
      { id: 'opt_47', title: 'Color', values: ['Black', 'Oatmeal', 'Forest Green'] },
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
  {
    id: 'cat_05',
    name: 'Dresses',
    handle: 'dresses',
    imageUrl:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=400&fit=crop',
    count: 45,
  },
  {
    id: 'cat_06',
    name: 'Accessories',
    handle: 'accessories',
    imageUrl:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop',
    count: 98,
  },
  {
    id: 'cat_07',
    name: 'Knitwear',
    handle: 'knitwear',
    imageUrl:
      'https://images.unsplash.com/photo-1581497396202-5645e76a3a8e?w=600&h=400&fit=crop',
    count: 72,
  },
  {
    id: 'cat_08',
    name: 'Activewear',
    handle: 'activewear',
    imageUrl:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop',
    count: 53,
  },
  {
    id: 'cat_09',
    name: 'Skirts',
    handle: 'skirts',
    imageUrl:
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=400&fit=crop',
    count: 31,
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
