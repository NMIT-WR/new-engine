export interface SaleContent {
  banner: {
    text: string
    icon?: string
  }
  hero: {
    title: string
    subtitle: string
  }
  breadcrumbs: Array<{
    label: string
    href: string
  }>
}

export const saleContent: SaleContent = {
  banner: {
    text: 'End of Season Sale - Up to 50% OFF! Limited time only',
    icon: '🔥',
  },
  hero: {
    title: 'Sale',
    subtitle:
      'Shop our biggest discounts of the season. New markdowns added daily!',
  },
  breadcrumbs: [
    { label: 'Home', href: '/' },
    { label: 'Sale', href: '/sale' },
  ],
}
