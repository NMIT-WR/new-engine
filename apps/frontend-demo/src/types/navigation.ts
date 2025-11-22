export type NavLink = {
  href: string
  label: string
}

export type NavSection = {
  title: string
  links: NavLink[]
}

export type BreadcrumbItem = {
  label: string
  href?: string
}
