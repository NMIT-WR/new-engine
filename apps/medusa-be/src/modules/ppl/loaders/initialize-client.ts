import type { Logger, ProviderLoaderOptions } from "@medusajs/framework/types"
import { PplClient } from "../client"
import type { PplOptions } from "../types"

export default async function initializeClientLoader({
  options,
  logger,
}: ProviderLoaderOptions): Promise<void> {
  if (process.env.PPL_ENABLED !== "1") {
    logger?.debug("PPL: PPL_ENABLED != 1, skipping client initialization")
    return
  }

  const pplOptions = options as PplOptions | undefined
  if (!(pplOptions?.client_id && pplOptions?.client_secret)) {
    logger?.warn("PPL: Missing credentials, client not initialized")
    return
  }

  PplClient.initialize(pplOptions, logger as Logger)
}
