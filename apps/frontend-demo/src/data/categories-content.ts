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
    name: 'Trička a topy',
    handle: 't-shirts-tops',
    imageUrl:
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=400&fit=crop',
    heroImage:
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1920&h=600&fit=crop',
    count: 156,
    description:
      'Prozkoumejte naši kolekci pohodlných a stylových triček a topů. Od základních nezbyností po trendy designy, najděte dokonalý kousek do svého šatníku.',
    seoTitle: 'Kolekce triček a topů | Prémiová bavlněná trička',
    seoDescription:
      'Nakupujte naši kolekci kvalitních triček a topů. K dispozici v různých barvách a velikostech. Doprava zdarma při objednávce nad 50 €.',
    subcategories: [],
  },
  {
    id: 'cat_02',
    name: 'Džíny a kalhoty',
    handle: 'jeans-pants',
    imageUrl:
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=400&fit=crop',
    heroImage:
      'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=1920&h=600&fit=crop',
    count: 89,
    description:
      'Objevte dokonalý pár z naší rozsáhlé kolekce džín a kalhot. Prémiový denim a pohodlné chinos pro každou příležitost.',
    seoTitle: 'Džíny a kalhoty | Prémiová denimová kolekce',
    seoDescription:
      'Najděte svůj dokonalý střih v naší kolekci džín a kalhot. Od slim fit po volnější styly. Všechny velikosti k dispozici.',
    subcategories: [],
  },
  {
    id: 'cat_03',
    name: 'Boty a tenisky',
    handle: 'shoes-sneakers',
    imageUrl:
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=400&fit=crop',
    heroImage:
      'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1920&h=600&fit=crop',
    count: 124,
    description:
      'Pozdvihni svůj styl s naším vybraným sortimentem bot a tenisek. Od klasických designů po nejnovější trendy.',
    seoTitle: 'Boty a tenisky | Nejnovější kolekce obuvi',
    seoDescription:
      'Nakupujte nejnovější boty a tenisky. Prémiová kvalitní obuv pro muže a ženy. Vracení zdarma u všech objednávek.',
    subcategories: [],
  },
  {
    id: 'cat_04',
    name: 'Bundy a kabáty',
    handle: 'jackets-coats',
    imageUrl:
      'https://images.unsplash.com/photo-1557418669-db3f781a58c0?w=600&h=400&fit=crop',
    heroImage:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1920&h=600&fit=crop',
    count: 67,
    description:
      'Zůstaňte v teple a stylu s naší kolekcí bund a kabátů. Od lehkých bomberů po zimní parky.',
    seoTitle: 'Bundy a kabáty | Zimní a jarní kolekce',
    seoDescription:
      'Prohlížejte naši kolekci bund a kabátů. Dokonalé pro každé počasí. Prémiové materiály a moderní designy.',
    subcategories: [],
  },
  {
    id: 'cat_05',
    name: 'Šaty',
    handle: 'dresses',
    imageUrl:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=400&fit=crop',
    heroImage:
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=1920&h=600&fit=crop',
    count: 45,
    description:
      'Najděte své dokonalé šaty z naší elegantní kolekce. Od běžných denních šatů po sofistikované večerní modely.',
    seoTitle: 'Kolekce šatů | Elegantní a běžné styly',
    seoDescription:
      'Nakupujte krásné šaty pro každou příležitost. Od běžných po formální oblečení. K dispozici ve všech velikostech.',
    subcategories: [],
  },
  {
    id: 'cat_06',
    name: 'Doplňky',
    handle: 'accessories',
    imageUrl:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop',
    heroImage:
      'https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=1920&h=600&fit=crop',
    count: 98,
    description:
      'Doplňte svůj vzhled naším výběrem doplňků. Od tašek a pásků po klobouky a šály.',
    seoTitle: 'Módní doplňky | Tašky, pásky a další',
    seoDescription:
      'Objevte naši nabídku módních doplňků. Prémiové kvalitní tašky, pásky, klobouky a další.',
    subcategories: [],
  },
  {
    id: 'cat_07',
    name: 'Pletiva',
    handle: 'knitwear',
    imageUrl:
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&h=400&fit=crop',
    heroImage:
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&h=600&fit=crop',
    count: 52,
    description:
      'Zahalte se do naší luxusní kolekce pletiva. Prémiové vlněné a kašmírové svetry pro největší pohodlí.',
    seoTitle: 'Kolekce pletiva | Kašmírové a vlněné svetry',
    seoDescription:
      'Nakupujte naši prémiovou kolekci pletiva. Luxusní kašmírové a vlněné svetry. Dokonalé pro vrstvení.',
    subcategories: [],
  },
  {
    id: 'cat_08',
    name: 'Sportovní oblečení',
    handle: 'activewear',
    imageUrl:
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=400&fit=crop',
    heroImage:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1920&h=600&fit=crop',
    count: 73,
    description:
      'Výkon se setkává se stylem v naší kolekci sportovního oblečení. Kvalitní sportovní oblečení pro váš aktivní životní styl.',
    seoTitle: 'Sportovní oblečení | Výkonné sportovní oblečení',
    seoDescription:
      'Nakupujte vysoce výkonné sportovní oblečení pro muže a ženy. Oblečení do posilovny, běžecké výstroje a jógové oblečení.',
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
