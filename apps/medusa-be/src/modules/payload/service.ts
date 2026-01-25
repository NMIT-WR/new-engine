import type {
  ICachingModuleService,
  Logger,
} from "@medusajs/framework/types"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { createHash } from "crypto"
import qs from "qs"
import type {
  CmsCategoryListOptions,
  CmsArticleCategoryDTO,
  CmsPageCategoryDTO,
  CmsListOptions,
  CmsHeroCarouselDTO,
  CmsPageDTO,
  CmsArticleDTO,
} from "../../types/cms"
import type {
  PayloadModuleOptions,
  PayloadBulkResult,
  PayloadQueryOptions,
} from "./types"

const CMS = "cms"
const DEFAULT_LOCALE = "default"
const STATUS_PUBLISHED = "published"
const PAGES = "pages"
const ARTICLES = "articles"
const HERO_CAROUSELS = "hero-carousels"
const PAGE_CATEGORIES = "page-categories"
const ARTICLE_CATEGORIES = "article-categories"
const PAGE_CATEGORY_GROUPS = "page-categories-with-pages"
const ARTICLE_CATEGORY_GROUPS = "article-categories-with-articles"

type InjectedDependencies = {
  logger: Logger
  [Modules.CACHING]?: ICachingModuleService
  [key: string]: unknown
}

const CACHE_TAGS = {
  ALL: CMS,
  PAGES: `${CMS}:${PAGES}`,
  ARTICLES: `${CMS}:${ARTICLES}`,
  PAGE_CATEGORIES: `${CMS}:${PAGE_CATEGORIES}`,
  ARTICLE_CATEGORIES: `${CMS}:${ARTICLE_CATEGORIES}`,
  HERO_CAROUSELS: `${CMS}:${HERO_CAROUSELS}`,
} as const

const DEFAULT_TTLS = {
  CONTENT: 3600,
  LIST: 600,
} as const

export default class PayloadModuleService {
  protected options_: PayloadModuleOptions
  protected baseUrl_: string
  protected headers_: Record<string, string>
  protected cacheService_: ICachingModuleService | null
  protected logger_: Logger
  protected contentCacheTtl_: number
  protected listCacheTtl_: number

  constructor(container: InjectedDependencies, options: PayloadModuleOptions) {
    this.options_ = options
    this.validateOptions()
    this.baseUrl_ = `${options.serverUrl.replace(/\/$/, "")}/api`
    this.headers_ = {
      "Content-Type": "application/json",
      Authorization: `users API-Key ${options.apiKey}`,
    }
    this.logger_ = container.logger
    this.cacheService_ = this.safeResolve<ICachingModuleService>(
      container,
      Modules.CACHING
    )

    this.contentCacheTtl_ =
      options.contentCacheTtl ?? DEFAULT_TTLS.CONTENT
    this.listCacheTtl_ = options.listCacheTtl ?? DEFAULT_TTLS.LIST
  }

  private validateOptions(): void {
    if (!this.options_.serverUrl) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Payload serverUrl is required"
      )
    }
    if (!this.options_.apiKey) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Payload apiKey is required"
      )
    }
  }

  private safeResolve<T>(
    container: InjectedDependencies,
    key: string
  ): T | null {
    try {
      return ((container as Record<string, unknown>)[key] as T) ?? null
    } catch {
      return null
    }
  }

  private async makeRequest<T>(
    method: string,
    endpoint: string,
    data?: unknown
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl_}${endpoint}`, {
      method,
      headers: this.headers_,
      body: data ? JSON.stringify(data) : undefined,
    })

    const result = (await response.json()) as { message?: string }

    if (!response.ok) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        result.message || `Payload API error: ${response.status}`
      )
    }

    return result as T
  }

  private buildQuery(options?: PayloadQueryOptions): string {
    if (!options) {
      return ""
    }
    return `?${qs.stringify(options, { encodeValuesOnly: true })}`
  }

  private buildParamsQuery(params?: Record<string, unknown>): string {
    if (!params) {
      return ""
    }
    const query = qs.stringify(params, { encodeValuesOnly: true, skipNulls: true })
    return query ? `?${query}` : ""
  }

  private async getCached<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number,
    tags: string[]
  ): Promise<T> {
    if (this.cacheService_) {
      const cached = (await this.cacheService_.get({ key })) as T | null
      if (cached !== null) {
        return cached
      }
    }

    const data = await fetcher()

    if (this.cacheService_ && data !== null) {
      await this.cacheService_.set({ key, data: data as object, ttl, tags })
    }

    return data
  }

  private buildListCacheKey(prefix: string, options?: CmsListOptions): string {
    const locale = options?.locale ?? DEFAULT_LOCALE

    if (!options) {
      return `${prefix}:${locale}:default`
    }

    const { locale: _ignoredLocale, ...rest } = options
    const hasOptions =
      rest.limit !== undefined ||
      rest.page !== undefined ||
      rest.sort !== undefined
    const hash = hasOptions
      ? createHash("sha256").update(JSON.stringify(rest)).digest("hex")
      : "default"

    return `${prefix}:${locale}:${hash}`
  }

  private buildCategoryListCacheKey(
    prefix: string,
    options?: CmsCategoryListOptions
  ): string {
    const locale = options?.locale ?? DEFAULT_LOCALE
    const slug = options?.categorySlug ?? "all"
    return `${prefix}:${locale}:${slug}`
  }

  private buildLocaleTag(tag: string, locale?: string): string {
    return `${tag}:locale:${locale ?? DEFAULT_LOCALE}`
  }

  private normalizeLocale(locale?: string): string | undefined {
    if (!locale || locale === "null" || locale === "undefined") {
      return undefined
    }
    return locale
  }

  // ============================================
  // Public API: Store CMS
  // ============================================

  async getPublishedPage(
    slug: string,
    locale?: string,
  ): Promise<CmsPageDTO | null> {
    const cacheKey = `${CMS}:${PAGES}:${slug}:${locale ?? DEFAULT_LOCALE}`
    return this.getCached(
      cacheKey,
      async () => {
        const queryString = this.buildQuery({
          where: {
            slug: { equals: slug },
            status: { equals: STATUS_PUBLISHED },
          },
          limit: 1,
          locale,
        })
        const result = await this.makeRequest<PayloadBulkResult<CmsPageDTO>>(
          "GET",
          `/${PAGES}${queryString}`
        )

        const page = result.docs[0] || null
        if (!page) {
          return null
        }

        return page
      },
      this.contentCacheTtl_,
      [CACHE_TAGS.ALL, CACHE_TAGS.PAGES]
    )
  }

  async listPageCategoriesWithPages(
    options?: CmsCategoryListOptions
  ): Promise<CmsPageCategoryDTO[]> {
    const cacheKey = this.buildCategoryListCacheKey(
      CACHE_TAGS.PAGE_CATEGORIES,
      options
    )
    const localeTag = this.buildLocaleTag(
      CACHE_TAGS.PAGE_CATEGORIES,
      options?.locale
    )
    return this.getCached(
      cacheKey,
      async () => {
        const queryString = this.buildParamsQuery({
          locale: options?.locale,
          categorySlug: options?.categorySlug,
        })
        const result = await this.makeRequest<{
          categories: CmsPageCategoryDTO[]
        }>("GET", `/${PAGE_CATEGORY_GROUPS}${queryString}`)
        return result.categories ?? []
      },
      this.listCacheTtl_,
      [
        CACHE_TAGS.ALL,
        CACHE_TAGS.PAGE_CATEGORIES,
        localeTag,
      ]
    )
  }

  async getPublishedArticle(
    slug: string,
    locale?: string,
  ): Promise<CmsArticleDTO | null> {
    const cacheKey = `${CMS}:${ARTICLES}:${slug}:${locale ?? DEFAULT_LOCALE}`
    return this.getCached(
      cacheKey,
      async () => {
        const queryString = this.buildQuery({
          where: {
            slug: { equals: slug },
            status: { equals: STATUS_PUBLISHED },
          },
          limit: 1,
          locale,
        })
        const result = await this.makeRequest<PayloadBulkResult<CmsArticleDTO>>(
          "GET",
          `/${ARTICLES}${queryString}`
        )

        const post = result.docs[0] || null
        if (!post) {
          return null
        }
        return post
      },
      this.contentCacheTtl_,
      [CACHE_TAGS.ALL, CACHE_TAGS.ARTICLES]
    )
  }

  async listArticleCategoriesWithArticles(
    options?: CmsCategoryListOptions
  ): Promise<CmsArticleCategoryDTO[]> {
    const cacheKey = this.buildCategoryListCacheKey(
      CACHE_TAGS.ARTICLE_CATEGORIES,
      options
    )
    const localeTag = this.buildLocaleTag(
      CACHE_TAGS.ARTICLE_CATEGORIES,
      options?.locale
    )

    return this.getCached(
      cacheKey,
      async () => {
        const queryString = this.buildParamsQuery({
          locale: options?.locale,
          categorySlug: options?.categorySlug,
        })
        const result = await this.makeRequest<{
          categories: CmsArticleCategoryDTO[]
        }>("GET", `/${ARTICLE_CATEGORY_GROUPS}${queryString}`)
        return result.categories ?? []
      },
      this.listCacheTtl_,
      [
        CACHE_TAGS.ALL,
        CACHE_TAGS.ARTICLE_CATEGORIES,
        localeTag,
      ]
    )
  }

  async listHeroCarousels(options?: CmsListOptions): Promise<CmsHeroCarouselDTO[]> {
    const cacheKey = this.buildListCacheKey(
      CACHE_TAGS.HERO_CAROUSELS,
      options
    )
    const localeTag = this.buildLocaleTag(
      CACHE_TAGS.HERO_CAROUSELS,
      options?.locale
    )
    return this.getCached(
      cacheKey,
      async () => {
        const queryString = this.buildQuery({
          limit: options?.limit,
          page: options?.page,
          sort: options?.sort,
          locale: options?.locale,
        })
        const result = await this.makeRequest<PayloadBulkResult<CmsHeroCarouselDTO>>(
          "GET",
          `/${HERO_CAROUSELS}${queryString}`
        )
        return result.docs
      },
      this.listCacheTtl_,
      [
        CACHE_TAGS.ALL,
        CACHE_TAGS.HERO_CAROUSELS,
        localeTag,
      ]
    )
  }

  async invalidateCache(
    collection: string,
    slug?: string,
    locale?: string,
  ): Promise<void> {
    if (!this.cacheService_) {
      return
    }

    const normalizedLocale = this.normalizeLocale(locale)
    const clearAllLocales = !normalizedLocale
    if (slug && !clearAllLocales) {
      const key = `${CMS}:${collection}:${slug}:${normalizedLocale ?? DEFAULT_LOCALE}`
      this.logger_.info(`CMS: Clearing cache key ${key}`)
      await this.cacheService_.clear({ key })
    }

    const tags: string[] = []
    const addTags = (allTags: string[], localeTag: string) => {
      if (clearAllLocales) {
        tags.push(...allTags)
      } else {
        tags.push(this.buildLocaleTag(localeTag, normalizedLocale))
      }
    }

    switch (collection) {
      case PAGES:
        addTags(
          [CACHE_TAGS.PAGES, CACHE_TAGS.PAGE_CATEGORIES],
          CACHE_TAGS.PAGE_CATEGORIES
        )
        break
      case ARTICLES:
        addTags(
          [CACHE_TAGS.ARTICLES, CACHE_TAGS.ARTICLE_CATEGORIES],
          CACHE_TAGS.ARTICLE_CATEGORIES
        )
        break
      case PAGE_CATEGORIES:
        addTags([CACHE_TAGS.PAGE_CATEGORIES], CACHE_TAGS.PAGE_CATEGORIES)
        break
      case ARTICLE_CATEGORIES:
        addTags([CACHE_TAGS.ARTICLE_CATEGORIES], CACHE_TAGS.ARTICLE_CATEGORIES)
        break
      case HERO_CAROUSELS:
        addTags([CACHE_TAGS.HERO_CAROUSELS], CACHE_TAGS.HERO_CAROUSELS)
        break
      default:
        break
    }

    if (tags.length > 0) {
      this.logger_.info(`CMS: Clearing cache tags ${tags.join(", ")}`)
    }
    await this.cacheService_.clear({ tags })
    this.logger_.info(`CMS: Invalidated cache for ${collection}`)
  }

}
