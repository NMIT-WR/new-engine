export type CmsVisibility = "public" | "customers-only"

export type CmsStatus = "draft" | "published"

export type CmsSeo = {
  title?: string | null
  description?: string | null
  image?: unknown | null
}

export type CmsListOptions = {
  limit?: number
  page?: number
  sort?: string
  locale?: string
}

export type CmsCategoryListOptions = {
  locale?: string
  categorySlug?: string
}

export type CmsPageDTO = {
  id: string
  slug: string
  title: string
  content?: unknown
  seo?: CmsSeo
  status?: CmsStatus
  visibility?: CmsVisibility
  publishedAt?: string | null
}

export type CmsPageCategoryDTO = {
  id: number
  title: string
  slug: string
  pages: Array<{
    title: string
    slug?: string | null
  }>
}

export type CmsArticleDTO = {
  id: string
  slug: string
  title: string
  excerpt?: string | null
  content?: unknown
  featuredImage?: unknown
  category?: unknown
  author?: string | unknown
  status?: CmsStatus
  publishedAt?: string | null
}

export type CmsArticleCategoryDTO = {
  id: number
  title: string
  slug: string
  articles: Array<{
    title: string
    slug?: string | null
    excerpt?: string | null
    featuredImage?: string | null
  }>
}

export type CmsHeroCarouselDTO = {
  id: string
  image: unknown
  heading?: string | null
  subheading?: string | null
  button?: string | null
  buttonHref?: string | null
  createdAt?: string
  updatedAt?: string
}
