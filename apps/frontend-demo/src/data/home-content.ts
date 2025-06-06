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
    title: 'New Collection',
    subtitle: 'Discover the latest trends in fashion',
    backgroundImage:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=1080&fit=crop',
    primaryAction: {
      label: 'Shop Now',
      href: '/products',
    },
    secondaryAction: {
      label: 'View Collection',
      href: '/products',
    },
  },
  trending: {
    title: 'Trending Now',
    subtitle: 'Check out the most popular items',
    linkText: 'View all products',
    linkHref: '/products',
  },
  categories: {
    title: 'Shop by Category',
    subtitle: "Find what you're looking for",
  },
  saleBanner: {
    title: 'End of Season Sale',
    subtitle: 'Up to 50% off on selected items',
    backgroundImage:
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&h=600&fit=crop',
    linkText: 'Shop Sale',
    linkHref: '/sale',
  },
  newArrivals: {
    title: 'New Arrivals',
    subtitle: 'Fresh styles just dropped',
    linkHref: '/products',
  },
}

// Alternative hero content for different campaigns/seasons
export const alternativeHeroContent: HeroContent[] = [
  {
    title: 'Summer Collection',
    subtitle: 'Beat the heat with our light & breezy styles',
    backgroundImage:
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1920&h=1080&fit=crop',
    primaryAction: {
      label: 'Shop Summer',
      href: '/products?season=summer',
    },
    secondaryAction: {
      label: 'View Lookbook',
      href: '/inspiration',
    },
  },
  {
    title: 'Sustainable Fashion',
    subtitle: 'Eco-friendly materials, timeless design',
    backgroundImage:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&h=1080&fit=crop',
    primaryAction: {
      label: 'Shop Sustainable',
      href: '/products?collection=sustainable',
    },
    secondaryAction: {
      label: 'Learn More',
      href: '/about',
    },
  },
  {
    title: 'Holiday Specials',
    subtitle: 'Find the perfect gift for everyone on your list',
    backgroundImage:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1920&h=1080&fit=crop',
    primaryAction: {
      label: 'Shop Gifts',
      href: '/products?collection=gifts',
    },
    secondaryAction: {
      label: 'Gift Guide',
      href: '/inspiration',
    },
  },
]

// Alternative banner content for different promotions
export const alternativeBannerContent: BannerContent[] = [
  {
    title: 'Free Shipping Weekend',
    subtitle: 'No minimum purchase required',
    backgroundImage:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=600&fit=crop',
    linkText: 'Shop Now',
    linkHref: '/products',
  },
  {
    title: 'New Member Exclusive',
    subtitle: 'Get 20% off your first order',
    backgroundImage:
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&h=600&fit=crop',
    linkText: 'Sign Up',
    linkHref: '/auth/register',
  },
  {
    title: 'Flash Sale',
    subtitle: 'Today only - Extra 30% off sale items',
    backgroundImage:
      'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1920&h=600&fit=crop',
    linkText: 'Shop Flash Sale',
    linkHref: '/sale',
  },
]
