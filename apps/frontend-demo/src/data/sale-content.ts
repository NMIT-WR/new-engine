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
    text: "Sezonní výprodej - Až 50% SLEVA! Pouze omezený čas",
    icon: "🔥",
  },
  hero: {
    title: "Výprodej",
    subtitle:
      "Nakupujte naše největší slevy sezony. Nové slevy přidáváme denně!",
  },
  breadcrumbs: [
    { label: "Domů", href: "/" },
    { label: "Výprodej", href: "/sale" },
  ],
}
