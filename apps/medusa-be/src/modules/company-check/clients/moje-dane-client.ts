import { MedusaError } from "@medusajs/framework/utils"
import {
  callSoapOperation,
  createSoapClient,
  extractSoapFaultMessage,
  type SoapClient,
} from "../../../utils/soap/create-soap-client"
import { MojeDaneStatusResponseSchema } from "../schema"
import type { MojeDaneClientOptions, MojeDaneStatusResponse } from "../types"
import { TimeoutError } from "../../../utils/http"
import {
  extractMojeDaneStatusPayload,
  normalizeDicDigits,
} from "../utils"

const MOJE_DANE_OPERATION = "getStatusNespolehlivySubjektRozsirenyV2"
const MOJE_DANE_TIMEOUT_MS = 12_000

export class MojeDaneClient {
  private readonly wsdlUrl_: string
  private clientPromise_: Promise<SoapClient> | null = null

  constructor(options: MojeDaneClientOptions) {
    const wsdlUrl = options.wsdlUrl?.trim()
    if (!wsdlUrl) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Moje Dane WSDL URL is required"
      )
    }

    this.wsdlUrl_ = wsdlUrl
  }

  async getStatusNespolehlivySubjektRozsirenyV2(
    dicDigits: string
  ): Promise<MojeDaneStatusResponse> {
    const normalizedDic = normalizeDicDigits(dicDigits)
    const client = await this.getClient()

    try {
      const raw = await callSoapOperation<unknown>(
        client,
        MOJE_DANE_OPERATION,
        { dic: normalizedDic },
        MOJE_DANE_TIMEOUT_MS
      )

      const payload = extractMojeDaneStatusPayload(raw)
      if (!payload) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          "Moje Dane response did not include status payload"
        )
      }

      const parsed = MojeDaneStatusResponseSchema.safeParse(payload)
      if (!parsed.success) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          `Moje Dane response validation failed: ${parsed.error.message}`
        )
      }

      return parsed.data
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw error
      }
      if (error instanceof MedusaError) {
        throw error
      }

      const faultMessage = extractSoapFaultMessage(error)
      const message = faultMessage
        ? `Moje Dane SOAP fault: ${faultMessage}`
        : `Moje Dane request failed: ${
            error instanceof Error ? error.message : String(error)
          }`

      throw new MedusaError(MedusaError.Types.INVALID_DATA, message)
    }
  }

  private async getClient(): Promise<SoapClient> {
    if (!this.clientPromise_) {
      this.clientPromise_ = createSoapClient({
        wsdlUrl: this.wsdlUrl_,
      })
    }

    try {
      return await this.clientPromise_
    } catch (error) {
      this.clientPromise_ = null
      throw error
    }
  }
}
