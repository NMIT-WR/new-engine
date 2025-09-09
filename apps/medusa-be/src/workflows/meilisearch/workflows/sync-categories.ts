import {createWorkflow, WorkflowResponse} from '@medusajs/framework/workflows-sdk'
import {syncMeilisearchCategoriesStep} from '../steps/sync-categories'

export type SyncMeilisearchCategoriesWorkflowInput = {
    filters?: Record<string, unknown>
    limit?: number
    offset?: number
}

export const syncMeilisearchCategoriesWorkflow = createWorkflow(
    'sync-meilisearch-categories-workflow',
    (input: SyncMeilisearchCategoriesWorkflowInput) => {
        const result = syncMeilisearchCategoriesStep(input)
        return new WorkflowResponse(result)
    })
