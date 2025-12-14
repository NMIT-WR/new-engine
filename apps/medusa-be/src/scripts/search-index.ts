import type {
  ExecArgs,
  IProductModuleService,
  Logger,
} from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import type { MeiliSearchService } from "@rokmohar/medusa-plugin-meilisearch"

const BATCH_SIZE = 1000

export default async function searchIndexScript({ container }: ExecArgs) {
  const logger = container.resolve<Logger>(ContainerRegistrationKeys.LOGGER)
  const productModuleService: IProductModuleService = container.resolve(
    Modules.PRODUCT
  )

  const meilisearchIndexService: MeiliSearchService =
    container.resolve("meilisearch")

  let skip = 0
  let totalIndexed = 0

  while (true) {
    const products = await productModuleService.listProducts(
      {},
      { skip, take: BATCH_SIZE, order: { id: "ASC" } }
    )

    if (products.length === 0) {
      break
    }

    await meilisearchIndexService.addDocuments("products", products)
    totalIndexed += products.length
    skip += products.length

    if (products.length < BATCH_SIZE) {
      break
    }
  }

  logger.info(`Indexed ${totalIndexed} products to MeiliSearch`)
}
