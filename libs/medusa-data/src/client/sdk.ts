import Medusa from '@medusajs/js-sdk'

export interface MedusaClientConfig {
  baseUrl: string
  publishableKey: string
  debug?: boolean
}

/**
 * Create a Medusa SDK instance with the given configuration
 */
export function createMedusaClient(config: MedusaClientConfig): Medusa {
  const { baseUrl, publishableKey, debug = false } = config

  if (!publishableKey) {
    console.warn('[@libs/medusa-data] publishableKey is not set!')
  }

  return new Medusa({
    baseUrl,
    publishableKey,
    debug,
  })
}

/**
 * Simple client config for direct fetch calls
 */
export function getMedusaClientConfig(config: MedusaClientConfig) {
  return {
    baseUrl: config.baseUrl,
    publishableKey: config.publishableKey,
  }
}
