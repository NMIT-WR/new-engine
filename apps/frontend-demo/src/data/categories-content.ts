export interface CategoryData {
  id: string
  name: string
  handle: string
  imageUrl: string
  count: number
  description?: string
  heroImage?: string
  seoTitle?: string
  seoDescription?: string
  subcategories?: string[] // ID of subcategories
}

export const categoriesData: CategoryData[] = [
  {
    id: 'cat_01',
    name: 'T-Shirts & Tops',
    handle: 't-shirts-tops',
    imageUrl:
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=400&fit=crop',
    heroImage:
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1920&h=600&fit=crop',
    count: 156,
    description:
      'Explore our collection of comfortable and stylish t-shirts and tops. From basic essentials to trendy designs, find the perfect piece for your wardrobe.',
    seoTitle: 'T-Shirts & Tops Collection | Premium Cotton Tees',
    seoDescription:
      'Shop our collection of high-quality t-shirts and tops. Available in various colors and sizes. Free shipping on orders over €50.',
    subcategories: [],
  },
  {
    id: 'cat_02',
    name: 'Jeans & Pants',
    handle: 'jeans-pants',
    imageUrl:
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=400&fit=crop',
    heroImage:
      'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=1920&h=600&fit=crop',
    count: 89,
    description:
      'Discover the perfect pair from our extensive collection of jeans and pants. Premium denim and comfortable chinos for every occasion.',
    seoTitle: 'Jeans & Pants | Premium Denim Collection',
    seoDescription:
      'Find your perfect fit with our collection of jeans and pants. From slim fit to relaxed styles. All sizes available.',
    subcategories: [],
  },
  {
    id: 'cat_03',
    name: 'Shoes & Sneakers',
    handle: 'shoes-sneakers',
    imageUrl:
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=400&fit=crop',
    heroImage:
      'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1920&h=600&fit=crop',
    count: 124,
    description:
      'Step up your style with our curated selection of shoes and sneakers. From classic designs to the latest trends.',
    seoTitle: 'Shoes & Sneakers | Latest Footwear Collection',
    seoDescription:
      'Shop the latest shoes and sneakers. Premium quality footwear for men and women. Free returns on all orders.',
    subcategories: [],
  },
  {
    id: 'cat_04',
    name: 'Jackets & Coats',
    handle: 'jackets-coats',
    imageUrl:
      'https://images.unsplash.com/photo-1557418669-db3f781a58c0?w=600&h=400&fit=crop',
    heroImage:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1920&h=600&fit=crop',
    count: 67,
    description:
      'Stay warm and stylish with our collection of jackets and coats. From lightweight bombers to winter parkas.',
    seoTitle: 'Jackets & Coats | Winter & Spring Collection',
    seoDescription:
      'Browse our collection of jackets and coats. Perfect for any weather. Premium materials and modern designs.',
    subcategories: [],
  },
  {
    id: 'cat_05',
    name: 'Dresses',
    handle: 'dresses',
    imageUrl:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=400&fit=crop',
    heroImage:
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=1920&h=600&fit=crop',
    count: 45,
    description:
      'Find your perfect dress from our elegant collection. From casual day dresses to sophisticated evening wear.',
    seoTitle: 'Dresses Collection | Elegant & Casual Styles',
    seoDescription:
      'Shop beautiful dresses for every occasion. From casual to formal wear. Available in all sizes.',
    subcategories: [],
  },
  {
    id: 'cat_06',
    name: 'Accessories',
    handle: 'accessories',
    imageUrl:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop',
    heroImage:
      'https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=1920&h=600&fit=crop',
    count: 98,
    description:
      'Complete your look with our selection of accessories. From bags and belts to hats and scarves.',
    seoTitle: 'Fashion Accessories | Bags, Belts & More',
    seoDescription:
      'Discover our range of fashion accessories. Premium quality bags, belts, hats and more.',
    subcategories: [],
  },
  {
    id: 'cat_07',
    name: 'Knitwear',
    handle: 'knitwear',
    imageUrl:
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&h=400&fit=crop',
    heroImage:
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&h=600&fit=crop',
    count: 52,
    description:
      'Cozy up in our luxurious knitwear collection. Premium wool and cashmere sweaters for ultimate comfort.',
    seoTitle: 'Knitwear Collection | Cashmere & Wool Sweaters',
    seoDescription:
      'Shop our premium knitwear collection. Luxurious cashmere and wool sweaters. Perfect for layering.',
    subcategories: [],
  },
  {
    id: 'cat_08',
    name: 'Activewear',
    handle: 'activewear',
    imageUrl:
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=400&fit=crop',
    heroImage:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1920&h=600&fit=crop',
    count: 73,
    description:
      'Performance meets style in our activewear collection. High-quality sportswear for your active lifestyle.',
    seoTitle: 'Activewear | Performance Sports Clothing',
    seoDescription:
      'Shop high-performance activewear for men and women. Gym clothes, running gear and yoga wear.',
    subcategories: [],
  },
]

// Helper function to get category by handle
export function getCategoryByHandle(handle: string): CategoryData | undefined {
  return categoriesData.find((cat) => cat.handle === handle)
}

// Helper function to get categories with calculated product counts
export function getCategoriesWithStats() {
  // In a real app, this would calculate from actual product data
  return categoriesData
}
