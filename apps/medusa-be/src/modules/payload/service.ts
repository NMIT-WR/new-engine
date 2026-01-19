import type {
  ICachingModuleService,
  Logger,
} from "@medusajs/framework/types"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { createHash } from "crypto"
import qs from "qs"
import type {
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

type InjectedDependencies = {
  logger: Logger
  [Modules.CACHING]?: ICachingModuleService
  [key: string]: unknown
}

const CACHE_TAGS = {
  ALL: "cms",
  PAGES: "cms:pages",
  ARTICLES: "cms:articles",
  ARTICLE_LISTS: "cms:articles:list",
  HERO_CAROUSELS: "cms:hero-carousels",
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

    const result = await response.json()

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
    if (!options) {
      return `${prefix}:default`
    }
    const hash = createHash("sha256")
      .update(JSON.stringify(options))
      .digest("hex")
    return `${prefix}:${hash}`
  }

  // ============================================
  // Public API: Store CMS
  // ============================================

  async getPublishedPage(
    slug: string,
    locale?: string,
    fallbackLocale?: string
  ): Promise<CmsPageDTO | null> {
    const cacheKey = `cms:pages:${slug}:${locale ?? "default"}:${fallbackLocale ?? "default"}`
    return this.getCached(
      cacheKey,
      async () => {
        const queryString = this.buildQuery({
          where: {
            slug: { equals: slug },
            status: { equals: "published" },
          },
          limit: 1,
          locale,
          fallbackLocale,
        })
        const result = await this.makeRequest<PayloadBulkResult<CmsPageDTO>>(
          "GET",
          `/pages${queryString}`
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

  async listPublishedPages(options?: CmsListOptions): Promise<CmsPageDTO[]> {
    const cacheKey = this.buildListCacheKey("cms:pages:list", options)
    return this.getCached(
      cacheKey,
      async () => {
        const queryString = this.buildQuery({
          limit: options?.limit,
          page: options?.page,
          sort: options?.sort,
          locale: options?.locale,
          fallbackLocale: options?.fallbackLocale,
          where: {
            status: { equals: "published" },
          },
        })
        const result = await this.makeRequest<PayloadBulkResult<CmsPageDTO>>(
          "GET",
          `/pages${queryString}`
        )
        return result.docs
      },
      this.listCacheTtl_,
      [CACHE_TAGS.ALL, CACHE_TAGS.PAGES]
    )
  }

  async getPublishedArticle(
    slug: string,
    locale?: string,
    fallbackLocale?: string
  ): Promise<CmsArticleDTO | null> {
    const cacheKey = `cms:articles:${slug}:${locale ?? "default"}:${fallbackLocale ?? "default"}`
    return this.getCached(
      cacheKey,
      async () => {
        const queryString = this.buildQuery({
          where: {
            slug: { equals: slug },
            status: { equals: "published" },
          },
          limit: 1,
          locale,
          fallbackLocale,
        })
        const result = await this.makeRequest<PayloadBulkResult<CmsArticleDTO>>(
          "GET",
          `/articles${queryString}`
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

  async listPublishedArticles(
    options: CmsListOptions = {}
  ): Promise<CmsArticleDTO[]> {
    const cacheKey = this.buildListCacheKey("cms:articles:list", options)

    return this.getCached(
      cacheKey,
      async () => {
        const where: Record<string, unknown> = {
          status: { equals: "published" },
        }

        const queryString = this.buildQuery({
          limit: options.limit,
          page: options.page,
          sort: options.sort,
          locale: options.locale,
          fallbackLocale: options.fallbackLocale,
          where,
        })
        const result = await this.makeRequest<PayloadBulkResult<CmsArticleDTO>>(
          "GET",
          `/articles${queryString}`
        )
        return result.docs
      },
      this.listCacheTtl_,
      [CACHE_TAGS.ALL, CACHE_TAGS.ARTICLES, CACHE_TAGS.ARTICLE_LISTS]
    )
  }

  async listHeroCarousels(options?: CmsListOptions): Promise<CmsHeroCarouselDTO[]> {
    const cacheKey = this.buildListCacheKey("cms:hero-carousels:list", options)
    return this.getCached(
      cacheKey,
      async () => {
        const queryString = this.buildQuery({
          limit: options?.limit,
          page: options?.page,
          sort: options?.sort,
          locale: options?.locale,
          fallbackLocale: options?.fallbackLocale,
        })
        const result = await this.makeRequest<PayloadBulkResult<CmsHeroCarouselDTO>>(
          "GET",
          `/hero-carousels${queryString}`
        )
        return result.docs
      },
      this.listCacheTtl_,
      [CACHE_TAGS.ALL, CACHE_TAGS.HERO_CAROUSELS]
    )
  }

  async invalidateCache(collection: string, slug?: string): Promise<void> {
    if (!this.cacheService_) {
      return
    }

    if (slug) {
      const key = `cms:${collection}:${slug}`
      await this.cacheService_.clear({ key })
    }

    const tags = [CACHE_TAGS.ALL]
    if (collection === "pages") {
      tags.push(CACHE_TAGS.PAGES)
    } else if (collection === "articles") {
      tags.push(CACHE_TAGS.ARTICLES, CACHE_TAGS.ARTICLE_LISTS)
    } else if (collection === "hero-carousels") {
      tags.push(CACHE_TAGS.HERO_CAROUSELS)
    }

    await this.cacheService_.clear({ tags })
    this.logger_.info(`CMS: Invalidated cache for ${collection}`)
  }

}
