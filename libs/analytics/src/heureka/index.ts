// Heureka Conversion Tracking
// Documentation: https://sluzby.heureka.cz/napoveda/mereni-konverzi/

// Components
export { HeurekaProduct } from "./heureka-product"
export type { HeurekaProductProps } from "./heureka-product"

export { HeurekaOrder } from "./heureka-order"
export type { HeurekaOrderProps } from "./heureka-order"

// Adapter for unified analytics
export { useHeurekaAdapter } from "./heureka-adapter"
export type { UseHeurekaAdapterConfig } from "./heureka-adapter"

// Types
export type {
  HeurekaConfig,
  HeurekaCountry,
  HeurekaFunction,
  HeurekaOrderParams,
  HeurekaProductItem,
} from "./types"
