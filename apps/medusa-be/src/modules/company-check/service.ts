import type { Logger } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import {
  RedisClient,
  type RedisClientDependencies,
} from "../../utils/redis-client"
import { ViesClient } from "./clients/vies-client"
import type { ViesCheckVatRequest, ViesCheckVatResponse } from "./types"

const CACHE_KEYS = {
  vies: (countryCode: string, vatNumber: string) =>
    `company-check:vies:${countryCode}:${vatNumber}`,
} as const

const LOCK_KEYS = {
  vies: (countryCode: string, vatNumber: string) =>
    `company-check:lock:vies:${countryCode}:${vatNumber}`,
} as const

const CACHE_TTL = {
  VIES: 6 * 60 * 60, // 6 hours
  VIES_NEGATIVE: 30 * 60, // 30 minutes
} as const

type InjectedDependencies = RedisClientDependencies & {
  logger: Logger
}

export class CompanyCheckModuleService {
  private readonly logger_: Logger
  private readonly redis_: RedisClient
  private viesClient_: ViesClient | null = null

  constructor(container: InjectedDependencies) {
    this.logger_ = container.logger
    this.redis_ = new RedisClient(container, { name: "Company Check" })
  }

  async checkVatNumber(
    input: ViesCheckVatRequest
  ): Promise<ViesCheckVatResponse> {
    const cacheKey = CACHE_KEYS.vies(input.countryCode, input.vatNumber)
    const lockKey = LOCK_KEYS.vies(input.countryCode, input.vatNumber)

    const cached = await this.redis_.get<ViesCheckVatResponse>(cacheKey)
    if (cached) {
      this.logger_.debug("Company Check: VIES cache hit")
      return cached
    }

    return this.redis_.withLock(lockKey, async () => {
      const cachedAfterLock =
        await this.redis_.get<ViesCheckVatResponse>(cacheKey)
      if (cachedAfterLock) {
        this.logger_.debug("Company Check: VIES cache hit (after lock)")
        return cachedAfterLock
      }

      const client = this.getViesClient()
      const result = await client.checkVatNumber(input)
      const ttl = result.valid ? CACHE_TTL.VIES : CACHE_TTL.VIES_NEGATIVE
      await this.redis_.set(cacheKey, result, { ttl })
      return result
    })
  }

  private getViesClient(): ViesClient {
    if (this.viesClient_) {
      return this.viesClient_
    }

    const baseUrl = process.env.VIES_BASE_URL?.trim()
    if (!baseUrl) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "VIES base URL is not configured"
      )
    }

    this.viesClient_ = new ViesClient({ baseUrl })
    return this.viesClient_
  }
}
