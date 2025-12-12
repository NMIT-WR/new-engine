import type {
  ICacheService,
  ProviderLoaderOptions,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { PplClient } from "../client"
import type { PplOptions } from "../types"

export default async function initializeClientLoader({
  options,
  logger,
  container,
}: ProviderLoaderOptions): Promise<void> {
  if (process.env.PPL_ENABLED !== "1") {
    logger?.debug("PPL: PPL_ENABLED != 1, skipping client initialization")
    return
  }

  if (!logger) {
    console.warn("PPL: Logger not provided, skipping client initialization")
    return
  }

  const pplOptions = options as Partial<PplOptions> | undefined
  if (
    !(
      pplOptions?.client_id &&
      pplOptions?.client_secret &&
      pplOptions?.environment &&
      pplOptions?.default_label_format
    )
  ) {
    logger.warn(
      "PPL: Missing required configuration (client_id, client_secret, environment, default_label_format), client not initialized"
    )
    return
  }

  // Resolve cache service for codelist caching
  let cacheService: ICacheService | undefined
  try {
    cacheService = container.resolve<ICacheService>(Modules.CACHING)
  } catch {
    logger.debug(
      "PPL: Cache service not available, codelists will not be cached"
    )
  }

  PplClient.initialize(pplOptions as PplOptions, logger, cacheService)
}
