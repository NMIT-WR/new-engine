import type { ExecArgs, IProductModuleService } from '@medusajs/framework/types'
import { Modules } from '@medusajs/framework/utils'
import type { MeiliSearchService } from '@rokmohar/medusa-plugin-meilisearch'

export default async function searchIndexScript({ container }: ExecArgs) {
  const productModuleService: IProductModuleService = container.resolve(
    Modules.PRODUCT
  )

  const meilisearchIndexService: MeiliSearchService =
    container.resolve('meilisearch')

  const products = await productModuleService.listProducts()

  await meilisearchIndexService.addDocuments('products', products)
}
