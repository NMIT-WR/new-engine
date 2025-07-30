import type { HomeCategory } from '@/types/product'
import { getCategoryIdsByHandles } from '@/utils/category-helpers'

export interface HeroContent {
  title: string
  subtitle: string
  backgroundImage: string
  primaryAction: {
    label: string
    href: string
  }
  secondaryAction: {
    label: string
    href: string
  }
}

export interface FeaturedSection {
  title: string
  subtitle: string
  linkText?: string
  linkHref: string
}

export interface BannerContent {
  title: string
  subtitle: string
  backgroundImage: string
  linkText: string
  linkHref: string
}

export interface HomeContent {
  hero: HeroContent
  trending: FeaturedSection
  categories: {
    title: string
    subtitle: string
  }
  saleBanner: BannerContent
  newArrivals: FeaturedSection
}

export const homeContent: HomeContent = {
  hero: {
    title: 'Nová kolekce',
    subtitle: 'Objevte nejnovější módní trendy',
    backgroundImage:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=1080&fit=crop',
    primaryAction: {
      label: 'Nakupovat',
      href: '/products',
    },
    secondaryAction: {
      label: 'Zobrazit kolekci',
      href: '/products',
    },
  },
  trending: {
    title: 'Aktuální trendy',
    subtitle: 'Podívejte se na nejpopulárnější položky',
    linkText: 'Zobrazit všechny produkty',
    linkHref: '/products',
  },
  categories: {
    title: 'Nakupovat podle kategorie',
    subtitle: 'Najděte, co hledáte',
  },
  saleBanner: {
    title: 'Sezónní výprodej',
    subtitle: 'Až 50% sleva na vybrané položky',
    backgroundImage:
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&h=600&fit=crop',
    linkText: 'Nakupovat ve výprodeji',
    linkHref: '/products?onSale=true',
  },
  newArrivals: {
    title: 'Nové přírůstky',
    subtitle: 'Čerstvé styly právě dorazily',
    linkHref: '/products',
  },
}

// Alternative hero content for different campaigns/seasons
export const alternativeHeroContent: HeroContent[] = [
  {
    title: 'Letní kolekce',
    subtitle: 'Překonejte horko s našimi lehkými a vzdušnými styly',
    backgroundImage:
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1920&h=1080&fit=crop',
    primaryAction: {
      label: 'Nakupovat letní',
      href: '/products?season=summer',
    },
    secondaryAction: {
      label: 'Zobrazit lookbook',
      href: '/inspiration',
    },
  },
  {
    title: 'Udržitelná móda',
    subtitle: 'Ekologické materiály, nadčasový design',
    backgroundImage:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&h=1080&fit=crop',
    primaryAction: {
      label: 'Nakupovat udržitelně',
      href: '/products?collection=sustainable',
    },
    secondaryAction: {
      label: 'Zjistit více',
      href: '/about',
    },
  },
  {
    title: 'Svateční nabídky',
    subtitle: 'Najděte dokonalý dárek pro všechny na vašem seznamu',
    backgroundImage:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1920&h=1080&fit=crop',
    primaryAction: {
      label: 'Nakupovat dárky',
      href: '/products?collection=gifts',
    },
    secondaryAction: {
      label: 'Průvodce dárky',
      href: '/inspiration',
    },
  },
]

// Alternative banner content for different promotions
export const alternativeBannerContent: BannerContent[] = [
  {
    title: 'Víkend s dopravou zdarma',
    subtitle: 'Bez minimální objednávky',
    backgroundImage:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=600&fit=crop',
    linkText: 'Shop Now',
    linkHref: '/products',
  },
  {
    title: 'Exkluzivně pro nové členy',
    subtitle: 'Získejte 20% slevu na první objednávku',
    backgroundImage:
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&h=600&fit=crop',
    linkText: 'Registrovat se',
    linkHref: '/auth/register',
  },
  {
    title: 'Bleskový výprodej',
    subtitle: 'Pouze dnes - Extra 30% sleva na výprodejové položky',
    backgroundImage:
      'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1920&h=600&fit=crop',
    linkText: 'Nakupovat v blesckovém výprodeji',
    linkHref: '/sale',
  },
]

const categoryHandles = {
  panske: ['kratke-rukavy', 'na-zip', 'street', 'svetry'],
  damske: [
    'pres-hlavu-category-140',
    'svetry-category-144',
    'street-category-147',
    'kratasy-category-149',
    'saty-a-sukne',
  ],
  detske: [
    'kratke-rukavy-category-268',
    'street-category-274',
    'boty-category-282',
  ],
  cyklo: ['dlouhy-rukav', 'xc-dh-volne', 'xc-dh-volne-category-43', 'dlouhe'],
  moto: ['bundy-category-81', 'kalhoty-category-82', 'mx-offroad', 'otevrene'],
  snowboard: ['snowboardy', 'vazani', 'prilby-category-107'],
}

type CategoryKey = keyof typeof categoryHandles
const categoryConfig: {
  key: CategoryKey
  name: string
  image: string
  description: string
}[] = [
  {
    key: 'panske',
    name: 'Pánské',
    image: 'cat-men.webp',
    description: 'Od formálního po sportovní - vše pro pány',
  },
  {
    key: 'damske',
    name: 'Dámské',
    image: 'cat-women.webp',
    description: 'Elegance a trendy pro každou příležitost',
  },
  {
    key: 'detske',
    name: 'Dětské',
    image: 'cat-kids.webp',
    description: 'Pohodlné a odolné pro každodenní radosti',
  },
  {
    key: 'cyklo',
    name: 'Cyklo',
    image: 'cat-cyclo.webp',
    description: 'Vybavení pro vášnivé cyklisty',
  },
  {
    key: 'moto',
    name: 'Moto',
    image: 'cat-moto.webp',
    description: 'Bezpečnost a styl pro motorkáře',
  },
  {
    key: 'snowboard',
    name: 'Snowboard',
    image: 'cat-ski.webp',
    description: 'Pro ty, co milují adrenalin na sněhu',
  },
]

export const homeCategories: HomeCategory[] = categoryConfig.map((cat) => ({
  name: cat.name,
  imageUrl: `/assets/cat-images/${cat.image}`,
  leaves: getCategoryIdsByHandles(categoryHandles[cat.key]),
  description: cat.description,
}))
