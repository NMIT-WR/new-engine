export interface NavLink {
  href: string
  label: string
}

export interface NavSection {
  title: string
  links: NavLink[]
}

export interface BreadcrumbItem {
  label: string
  href?: string
}