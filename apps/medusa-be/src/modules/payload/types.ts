/** Configuration options for connecting to the Payload CMS instance. */
export interface PayloadModuleOptions {
  serverUrl: string
  apiKey: string
  userCollection?: string
  contentCacheTtl?: number
  listCacheTtl?: number
}

/** Base shape for items returned by the Payload REST API. */
export interface PayloadCollectionItem {
  id: string
  createdAt: string
  updatedAt: string
  medusa_id?: string
  [key: string]: unknown
}

/** Query options supported by the Payload REST API list endpoint. */
export interface PayloadQueryOptions {
  limit?: number
  page?: number
  where?: Record<string, unknown>
  sort?: string
  select?: Record<string, boolean>
  populate?: Record<string, boolean>
  locale?: string
  depth?: number
}

/** Response wrapper for single-document Payload API results. */
export interface PayloadItemResult<T> {
  doc: T
  message: string
}

/** Response wrapper for list-based Payload API results. */
export interface PayloadBulkResult<T> {
  docs: T[]
  totalDocs: number
  limit: number
  page: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  nextPage: number | null
  prevPage: number | null
  pagingCounter: number
}

/** Generic error envelope for API responses. */
export interface PayloadApiResponse<T> {
  data?: T
  errors?: Array<{ message: string; field?: string }>
  message?: string
}
