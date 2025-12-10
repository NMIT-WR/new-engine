import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'
import { createFindParams } from '@medusajs/medusa/api/utils/validators'
import type z from 'zod'

export const StoreProducersDetailSchema = createFindParams()

export type StoreProducersSchemaType = z.infer<
  typeof StoreProducersDetailSchema
>

export async function GET(
  req: MedusaRequest<unknown, StoreProducersSchemaType>,
  res: MedusaResponse
) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  console.log({ query: req.queryConfig })
  const { data: producers } = await query.graph({
    entity: 'producer',
    filters: {
      id: req.params.id ?? '-1',
    },
    ...req.queryConfig,
  })

  res.json(producers[0] ?? {})
}
