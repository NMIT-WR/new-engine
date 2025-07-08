import type { Category } from '@/types/product'

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

const leavesIds = [
  [
    'pcat_01JYERRCMBCA6DTA9D2QK47365',
    'pcat_01JYERRCP6DE4WW4SBG3AXM3ZY',
    'pcat_01JYERRCR52228KG73ZTFJDFDH',
    'pcat_01JYERRCSD2K0XS2TBXGVZHP40',
  ],
  [
    'pcat_01JYERRF8KC497Q89YKG8AM070',
    'pcat_01JYERRFB0APW1Z05B4A2A4AKF',
    'pcat_01JYERRFCRRQYS9Q55P7JSNJHR',
    'pcat_01JYERRFDZZF1S1VFMQ3V58KSY',
    'pcat_01JYERRFF61KF8AETW3EPEFRJ7',
  ],
  [
    'pcat_01JYERRHRVVWF9VZ6Q7B59W6G7',
    'pcat_01JYERRHWSYBG6XCHN6XVS5RHK',
    'pcat_01JYERRJ25417E3TYAHKGBSRNA',
  ],
  [
    'pcat_01JYERRD7N18T77AQFSJ7EMVGC',
    'pcat_01JYERRD9ZB0MNZP706FQG453H',
    'pcat_01JYERRDBVCK53EDJV8YE7HXR7',
    'pcat_01JYERRDDMQZSJDR2MAGY0XS6K',
  ],
  [
    'pcat_01JYERRE42351JWPZ2YXE6NWDX',
    'pcat_01JYERRE4NBWBM76Q5JZMSVSA5',
    'pcat_01JYERRE721CXXPKAD0TCNSZCJ',
    'pcat_01JYERRE7PRKJC4PXQFXCJ581F',
  ],
  [
    'pcat_01JYERREJFEWQTJPKEA0YMHPCG',
    'pcat_01JYERREK5YAVKTW6R4G716KSP',
    'pcat_01JYERREMBWHZM6XNPH5T4YJTP',
  ],
]

export const homeCategories: Category[] = [
  {
    id: 'pcat_01JYERRCJGHMCBWSWD91X1DKC7',
    name: 'Pánské',
    handle: 'panske',
    imageUrl: '/assets/cat-images/cat-men.webp',
    leaves: leavesIds[0],
  },
  {
    id: 'pcat_01JYERRF472Y089AH84CR8G6JZ',
    name: 'Dámské',
    handle: 'damske',
    imageUrl: '/assets/cat-images/cat-women.webp',
    leaves: leavesIds[1],
  },
  {
    id: 'pcat_01JYERRHQ0RZVNG6385W59YR8D',
    name: 'Dětské',
    handle: 'detske',
    imageUrl: '/assets/cat-images/cat-kids.webp',
    leaves: leavesIds[2],
  },
  {
    id: 'pcat_01JYERRKZ0S59AM6S49PP1RMP6',
    name: 'Cyklo',
    handle: 'cyklo-category-378',
    imageUrl: '/assets/cat-images/cat-cyclo.webp',
    leaves: leavesIds[3],
  },
  {
    id: 'pcat_01JYERRMVRA45GBAS2E0MPAWQW',
    name: 'Moto',
    handle: 'moto-category-424',
    imageUrl: '/assets/cat-images/cat-moto.webp',
    leaves: leavesIds[4],
  },
  {
    id: 'pcat_01JYERRNAJJ776Y5QJ5WTEGR80',
    name: 'Snb-Skate',
    handle: 'snb-skate-category-448',
    imageUrl: '/assets/cat-images/cat-ski.webp',
    leaves: leavesIds[5],
  },
]
