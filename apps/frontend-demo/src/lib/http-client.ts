import { storage } from './local-storage'

export class HttpError extends Error {
  status: number
  data?: unknown

  constructor(status: number, message: string, data?: unknown) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.data = data
  }
}

export interface HttpClientConfig {
  baseUrl?: string
  headers?: HeadersInit
  retry?: {
    count: number
    delay: number
  }
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>
  retry?: boolean
}

class HttpClient {
  private config: Required<HttpClientConfig>

  constructor(config: HttpClientConfig = {}) {
    this.config = {
      baseUrl:
        config.baseUrl ||
        process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
        'http://localhost:9000',
      headers: config.headers || {},
      retry: config.retry || { count: 3, delay: 1000 },
    }
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {}
    const token = storage.get<string>('medusa_auth_token')

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return headers
  }

  private buildUrl(
    path: string,
    params?: Record<string, string | number | boolean>
  ): string {
    const url = new URL(path, this.config.baseUrl)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value))
      })
    }

    return url.toString()
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type')
    const isJson = contentType?.includes('application/json')

    if (!response.ok) {
      const errorData = isJson ? await response.json() : await response.text()
      const errorMessage =
        typeof errorData === 'object' && errorData.message
          ? errorData.message
          : `Request failed with status ${response.status}`

      throw new HttpError(response.status, errorMessage, errorData)
    }

    if (response.status === 204) {
      return {} as T
    }

    return isJson ? response.json() : (response.text() as Promise<T>)
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { params, retry = true, ...fetchOptions } = options
    const url = this.buildUrl(path, params)

    const headers = {
      'Content-Type': 'application/json',
      'x-publishable-api-key':
        process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
      ...this.config.headers,
      ...this.getAuthHeaders(),
      ...fetchOptions.headers,
    }

    const finalOptions: RequestInit = {
      ...fetchOptions,
      headers,
    }

    let lastError: Error | null = null
    const maxRetries = retry ? this.config.retry.count : 1

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, finalOptions)
        return await this.handleResponse<T>(response)
      } catch (error) {
        lastError = error as Error

        // Don't retry on client errors (4xx)
        if (
          error instanceof HttpError &&
          error.status >= 400 &&
          error.status < 500
        ) {
          throw error
        }

        // Don't retry if this was the last attempt
        if (attempt === maxRetries) {
          throw error
        }

        // Wait before retrying
        await this.sleep(this.config.retry.delay * attempt)
      }
    }

    throw lastError || new Error('Request failed')
  }

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' })
  }

  async post<T>(
    path: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(
    path: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(
    path: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' })
  }
}

// Export singleton instance
export const httpClient = new HttpClient()

// Export for testing or custom instances
export { HttpClient }
