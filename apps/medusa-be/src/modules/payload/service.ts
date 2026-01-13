import { MedusaError } from "@medusajs/framework/utils"
import qs from "qs"
import type {
  PayloadModuleOptions,
  PayloadQueryOptions,
  PayloadBulkResult,
  PayloadItemResult,
} from "./types"

type InjectedDependencies = Record<string, unknown>

export default class PayloadModuleService {
  protected options_: PayloadModuleOptions
  protected baseUrl_: string
  protected headers_: Record<string, string>

  constructor(_: InjectedDependencies, options: PayloadModuleOptions) {
    this.options_ = options
    this.validateOptions()
    this.baseUrl_ = `${options.serverUrl}/api`
    this.headers_ = {
      "Content-Type": "application/json",
      "x-publishable-api-key": options.apiKey,
    }
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

  async find<T>(
    collection: string,
    options?: PayloadQueryOptions
  ): Promise<PayloadBulkResult<T>> {
    const queryString = options ? `?${qs.stringify(options)}` : ""
    return this.makeRequest<PayloadBulkResult<T>>(
      "GET",
      `/${collection}${queryString}`
    )
  }

  async findOne<T>(
    collection: string,
    id: string,
    options?: Pick<PayloadQueryOptions, "depth" | "locale">
  ): Promise<T> {
    const queryString = options ? `?${qs.stringify(options)}` : ""
    return this.makeRequest<T>("GET", `/${collection}/${id}${queryString}`)
  }

  async findBySlug<T>(
    collection: string,
    slug: string,
    options?: Pick<PayloadQueryOptions, "depth" | "locale">
  ): Promise<T | null> {
    const result = await this.find<T>(collection, {
      ...options,
      where: { slug: { equals: slug } },
      limit: 1,
    })
    return result.docs[0] || null
  }

  async create<T>(
    collection: string,
    data: Record<string, unknown>
  ): Promise<PayloadItemResult<T>> {
    return this.makeRequest<PayloadItemResult<T>>(
      "POST",
      `/${collection}`,
      data
    )
  }

  async update<T>(
    collection: string,
    id: string,
    data: Record<string, unknown>
  ): Promise<PayloadItemResult<T>> {
    return this.makeRequest<PayloadItemResult<T>>(
      "PATCH",
      `/${collection}/${id}`,
      data
    )
  }

  async delete(collection: string, id: string): Promise<void> {
    await this.makeRequest<unknown>("DELETE", `/${collection}/${id}`)
  }
}
