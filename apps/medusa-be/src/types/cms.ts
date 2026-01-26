/** Visibility options supported by CMS pages. */
export type CmsVisibility = "public" | "customers-only"

/** Publishing status for CMS documents. */
export type CmsStatus = "draft" | "published"

/** Basic SEO metadata shared across CMS content. */
export type CmsSeo = {
  title?: string | null
  description?: string | null
  image?: unknown | null
}

/** Common list query options for CMS endpoints. */
export type CmsListOptions = {
  limit?: number
  page?: number
  sort?: string
  locale?: string
}

/** Options for category list endpoints with optional slug filtering. */
export type CmsCategoryListOptions = {
  locale?: string
  categorySlug?: string
}

/** DTO for a published page response. */
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

/** DTO for a page category with embedded pages. */
export type CmsPageCategoryDTO = {
  id: number
  title: string
  slug: string
  pages: Array<{
    title: string
    slug?: string | null
  }>
}

/** DTO for a published article response. */
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

/** DTO for an article category with embedded articles. */
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

/** DTO for hero carousel entries. */
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
