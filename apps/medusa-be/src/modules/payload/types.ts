export interface PayloadModuleOptions {
  serverUrl: string
  apiKey: string
  userCollection?: string
  contentCacheTtl?: number
  listCacheTtl?: number
}

export interface PayloadCollectionItem {
  id: string
  createdAt: string
  updatedAt: string
  medusa_id?: string
  [key: string]: unknown
}

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

export interface PayloadItemResult<T> {
  doc: T
  message: string
}

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

export interface PayloadApiResponse<T> {
  data?: T
  errors?: Array<{ message: string; field?: string }>
  message?: string
}
