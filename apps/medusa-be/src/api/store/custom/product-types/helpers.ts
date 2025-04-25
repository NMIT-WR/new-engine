import { MedusaContainer, ProductTypeDTO } from "@medusajs/framework/types"

export const refetchProductType = async (
  productTypeId: string,
  scope: MedusaContainer,
  fields: (keyof ProductTypeDTO)[]
) => {
  const query = scope.resolve("query")
  const { data: [ productType ] } = await query.graph({
    entity: "product_type",
    filters: { id: productTypeId },
    fields,
  })

  return productType 
}
