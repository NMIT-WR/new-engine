import {
  WorkflowResponse,
  createWorkflow,
  transform,
} from '@medusajs/framework/workflows-sdk'
import * as Steps from '../steps'

export type CategoryRaw = {
  title: string
  description?: string
  handle: string
  isActive: boolean
  parentHandle?: string
}

const seedCategoriesWorkflowId = 'seed-categories-workflow'
const seedCategoriesWorkflow = createWorkflow(
  seedCategoriesWorkflowId,
  (input: CategoryRaw[]) => {
    const productCategories: Steps.CreateProductCategoriesStepInput = transform(
      {
        input,
      },
      (data) => {
        return data.input.map((i) => ({
          name: i.title,
          description: i.description,
          handle: i.handle,
          isActive: Boolean(Number(i.isActive)),
          parentHandle: i.parentHandle,
        }))
      }
    )

    Steps.createProductCategoriesStep(productCategories)

    return new WorkflowResponse({
      result: {
        message: 'Categories seeded successfully',
      },
    })
  }
)

export default seedCategoriesWorkflow
