import type { Logger } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import {
  RedisClient,
  type RedisClientDependencies,
} from "../../utils/redis-client"
import { AresClient } from "./clients/ares-client"
import { MojeDaneClient } from "./clients/moje-dane-client"
import { ViesClient } from "./clients/vies-client"
import type {
  AresEconomicSubject,
  AresEconomicSubjectSearchRequest,
  AresEconomicSubjectSearchResponse,
  AresStandardizedAddressSearchRequest,
  AresStandardizedAddressSearchResponse,
  TaxReliabilityResult,
  ViesCheckVatRequest,
  ViesCheckVatResponse,
} from "./types"
import { mapMojeDaneStatus, normalizeDicDigits } from "./utils"

const CACHE_KEYS = {
  vies: (countryCode: string, vatNumber: string) =>
    `company-check:vies:${countryCode}:${vatNumber}`,
  mojeDane: (dicDigits: string) => `company-check:mojedane:${dicDigits}`,
} as const

const LOCK_KEYS = {
  vies: (countryCode: string, vatNumber: string) =>
    `company-check:lock:vies:${countryCode}:${vatNumber}`,
  mojeDane: (dicDigits: string) => `company-check:lock:mojedane:${dicDigits}`,
} as const

const CACHE_TTL = {
  VIES: 6 * 60 * 60, // 6 hours
  VIES_NEGATIVE: 30 * 60, // 30 minutes
  MOJE_DANE: 24 * 60 * 60, // 24 hours
  MOJE_DANE_NEGATIVE: 30 * 60, // 30 minutes
} as const

type InjectedDependencies = RedisClientDependencies & {
  logger: Logger
}

export class CompanyCheckModuleService {
  private readonly logger_: Logger
  private readonly redis_: RedisClient
  private readonly aresClient_: AresClient
  private readonly viesClient_: ViesClient
  private readonly mojeDaneClient_: MojeDaneClient

  constructor(container: InjectedDependencies) {
    this.logger_ = container.logger
    this.redis_ = new RedisClient(container, { name: "Company Check" })

    const aresBaseUrl = process.env.ARES_BASE_URL?.trim()
    if (!aresBaseUrl) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "ARES base URL is not configured"
      )
    }

    const viesBaseUrl = process.env.VIES_BASE_URL?.trim()
    if (!viesBaseUrl) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "VIES base URL is not configured"
      )
    }

    const mojeDaneWsdlUrl = process.env.MOJE_DANE_WSDL_URL?.trim()
    if (!mojeDaneWsdlUrl) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Moje Dane WSDL URL is not configured"
      )
    }

    this.aresClient_ = new AresClient({ baseUrl: aresBaseUrl })
    this.viesClient_ = new ViesClient({ baseUrl: viesBaseUrl })
    this.mojeDaneClient_ = new MojeDaneClient({ wsdlUrl: mojeDaneWsdlUrl })
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

      const result = await this.viesClient_.checkVatNumber(input)
      const ttl = result.valid ? CACHE_TTL.VIES : CACHE_TTL.VIES_NEGATIVE
      await this.redis_.set(cacheKey, result, { ttl })
      return result
    })
  }

  async checkTaxReliability(
    dicDigits: string
  ): Promise<TaxReliabilityResult> {
    const normalizedDic = normalizeDicDigits(dicDigits)
    const cacheKey = CACHE_KEYS.mojeDane(normalizedDic)
    const lockKey = LOCK_KEYS.mojeDane(normalizedDic)

    return this.redis_.getOrSet(
      cacheKey,
      async () => {
        const response =
          await this.mojeDaneClient_.getStatusNespolehlivySubjektRozsirenyV2(
            normalizedDic
          )
        return mapMojeDaneStatus(response)
      },
      {
        lockKey,
        ttl: (value) =>
          value.reliable === null
            ? CACHE_TTL.MOJE_DANE_NEGATIVE
            : CACHE_TTL.MOJE_DANE,
      }
    )
  }

  async getAresEconomicSubjectByIco(ico: string): Promise<AresEconomicSubject> {
    return this.aresClient_.getEconomicSubjectByIco(ico)
  }

  async searchAresEconomicSubjects(
    payload: AresEconomicSubjectSearchRequest
  ): Promise<AresEconomicSubjectSearchResponse> {
    return this.aresClient_.searchEconomicSubjects(payload)
  }

  async searchAresStandardizedAddresses(
    payload: AresStandardizedAddressSearchRequest
  ): Promise<AresStandardizedAddressSearchResponse> {
    return this.aresClient_.searchStandardizedAddresses(payload)
  }
}
