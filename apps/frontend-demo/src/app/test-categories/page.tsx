'use client'

import { useState } from 'react'
import { httpClient } from '@/lib/http-client'
import { useCategories, useDetailedCategories, useRootCategories, useCategoryTree } from '@/hooks/use-categories'

export default function TestCategoryPerformanceAll() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState<string | null>(null)
  const [hookResults, setHookResults] = useState<any>({})
  
  // Hooks must be called at the top level
  const { categories: allCats, isLoading: loading1 } = useCategories()
  const { categories: detailedCats, isLoading: loading2 } = useDetailedCategories()
  const { categories: rootCats, isLoading: loading3 } = useRootCategories()
  const { tree, isLoading: loading4 } = useCategoryTree()

  // Test configurations
  const tests = [
    {
      name: 'API: Default (50 items)',
      test: async () => {
        const start = performance.now()
        const data = await httpClient.get('/store/product-categories')
        const end = performance.now()
        return { data, time: end - start }
      },
    },
    {
      name: 'API: Limit 100',
      test: async () => {
        const start = performance.now()
        const data = await httpClient.get('/store/product-categories', {
          params: { limit: 100 }
        })
        const end = performance.now()
        return { data, time: end - start }
      },
    },
    {
      name: 'API: Limit 1000 (all)',
      test: async () => {
        const start = performance.now()
        const data = await httpClient.get('/store/product-categories', {
          params: { limit: 1000 }
        })
        const end = performance.now()
        return { data, time: end - start }
      },
    },
    {
      name: 'API: With fields=*products (old approach)',
      test: async () => {
        const start = performance.now()
        try {
          const data = await httpClient.get('/store/product-categories', {
            params: { 
              fields: '*products',
              include_descendants_tree: true,
              include_ancestors_tree: true,
              limit: 100
            }
          })
          const end = performance.now()
          return { data, time: end - start }
        } catch (error) {
          const end = performance.now()
          return { error: error instanceof Error ? error.message : String(error), time: end - start }
        }
      },
    },
    {
      name: 'API: Pagination (3x 200 items)',
      test: async () => {
        const start = performance.now()
        const allData: any[] = []
        
        for (let offset = 0; offset < 600; offset += 200) {
          const data = await httpClient.get('/store/product-categories', {
            params: { limit: 200, offset }
          })
          allData.push(...((data as any).product_categories || []))
        }
        
        const end = performance.now()
        return { 
          data: { product_categories: allData, count: allData.length },
          time: end - start 
        }
      },
    },
  ]

  const runTest = async (test: typeof tests[0]) => {
    setLoading(test.name)
    try {
      const result = await test.test()
      const categories = (result.data as any)?.product_categories || []
      const rootCategories = categories.filter((c: any) => !c.parent_category_id)
      
      setResults((prev: any) => ({
        ...prev,
        [test.name]: {
          success: !(result as any).error,
          time: result.time.toFixed(0),
          size: result.data ? (JSON.stringify(result.data).length / 1024).toFixed(2) : '0',
          totalCategories: categories.length,
          rootCategories: rootCategories.length,
          rootNames: rootCategories.map((c: any) => c.name),
          error: (result as any).error,
          avgTimePerCategory: categories.length > 0 ? (result.time / categories.length).toFixed(2) : 'N/A'
        },
      }))
    } catch (error) {
      setResults((prev: any) => ({
        ...prev,
        [test.name]: {
          success: false,
          error: error instanceof Error ? error.message : String(error),
        },
      }))
    } finally {
      setLoading(null)
    }
  }

  const runAll = async () => {
    setResults({})
    for (const test of tests) {
      await runTest(test)
    }
  }

  // Test individual hooks
  const testUseCategories = () => {
    setHookResults((prev: any) => ({
      ...prev,
      useCategories: {
        time: '0',
        count: allCats.length,
        loading: loading1,
        size: (JSON.stringify(allCats).length / 1024).toFixed(2),
      },
    }))
  }

  const testUseDetailedCategories = () => {
    setHookResults((prev: any) => ({
      ...prev,
      useDetailedCategories: {
        time: '0',
        count: detailedCats.length,
        loading: loading2,
        size: (JSON.stringify(detailedCats).length / 1024).toFixed(2),
      },
    }))
  }

  const testUseRootCategories = () => {
    setHookResults((prev: any) => ({
      ...prev,
      useRootCategories: {
        time: '0',
        count: rootCats.length,
        names: rootCats.map((c: any) => c.name),
        loading: loading3,
      },
    }))
  }

  const testUseCategoryTree = () => {
    setHookResults((prev: any) => ({
      ...prev,
      useCategoryTree: {
        time: '0',
        count: tree.length,
        loading: loading4,
      },
    }))
  }

  // Calculate statistics
  const stats = Object.entries(results).reduce((acc, [, result]: [string, any]) => {
    if (result.success && result.time) {
      acc.times.push(Number(result.time))
      acc.sizes.push(Number(result.size))
    }
    return acc
  }, { times: [] as number[], sizes: [] as number[] })

  const avgTime = stats.times.length > 0 
    ? (stats.times.reduce((a, b) => a + b, 0) / stats.times.length).toFixed(0)
    : 'N/A'
  
  const minTime = stats.times.length > 0 ? Math.min(...stats.times).toFixed(0) : 'N/A'
  const maxTime = stats.times.length > 0 ? Math.max(...stats.times).toFixed(0) : 'N/A'

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Category Performance Testing</h1>

      <div className="mb-6 space-x-4">
        <button
          onClick={runAll}
          disabled={loading !== null}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Run All API Tests
        </button>
        
        <button
          onClick={testUseCategories}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test useCategories
        </button>
        
        <button
          onClick={testUseDetailedCategories}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Test useDetailedCategories
        </button>
        
        <button
          onClick={testUseRootCategories}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Test useRootCategories
        </button>
        
        <button
          onClick={testUseCategoryTree}
          className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
        >
          Test useCategoryTree
        </button>
      </div>

      {loading && (
        <div className="mb-4 p-4 bg-yellow-100 rounded">
          Running: {loading}...
        </div>
      )}

      {/* Statistics */}
      {Object.keys(results).length > 0 && (
        <div className="mb-8 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-semibold mb-2">Statistics</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="font-medium">Average Time:</span> {avgTime}ms
            </div>
            <div>
              <span className="font-medium">Min Time:</span> {minTime}ms
            </div>
            <div>
              <span className="font-medium">Max Time:</span> {maxTime}ms
            </div>
          </div>
        </div>
      )}

      {/* API Test Results */}
      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold">API Test Results</h2>
        {Object.entries(results).map(([name, result]: [string, any]) => (
          <div key={name} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{name}</h3>
              <div className="flex items-center gap-4">
                <span className={`px-2 py-1 rounded text-sm ${
                  result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {result.success ? 'Success' : 'Failed'}
                </span>
                {result.time && (
                  <span className={`font-mono text-sm ${
                    Number(result.time) < 100 ? 'text-green-600' :
                    Number(result.time) < 500 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {result.time}ms
                  </span>
                )}
              </div>
            </div>
            
            {result.success ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Size:</span> {result.size} KB
                </div>
                <div>
                  <span className="text-gray-600">Total:</span> {result.totalCategories}
                </div>
                <div>
                  <span className="text-gray-600">Root:</span> {result.rootCategories}
                </div>
                <div>
                  <span className="text-gray-600">Avg/Cat:</span> {result.avgTimePerCategory}ms
                </div>
              </div>
            ) : (
              <div className="text-red-600 text-sm">
                Error: {result.error}
              </div>
            )}
            
            {result.rootNames && result.rootNames.length > 0 && (
              <div className="mt-2 text-sm">
                <span className="text-gray-600">Root categories:</span>{' '}
                <span className="font-mono">{result.rootNames.join(', ')}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Hook Test Results */}
      {Object.keys(hookResults).length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">React Hook Results</h2>
          {Object.entries(hookResults).map(([hookName, result]: [string, any]) => (
            <div key={hookName} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{hookName}()</h3>
                <span className="font-mono text-sm text-blue-600">
                  {result.loading ? 'Loading...' : 'Loaded'}
                </span>
              </div>
              <div className="text-sm">
                <p>Count: {result.count}</p>
                <p>Loading: {result.loading ? 'Yes' : 'No'}</p>
                {result.size && (
                  <p>Size: {result.size} KB</p>
                )}
                {result.names && (
                  <p>Categories: {result.names.join(', ')}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Performance Tips */}
      <div className="mt-8 p-4 bg-blue-50 rounded">
        <h3 className="font-medium mb-2">Performance Guidelines:</h3>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li><span className="text-green-600">Fast:</span> &lt; 100ms</li>
          <li><span className="text-yellow-600">Moderate:</span> 100-500ms</li>
          <li><span className="text-red-600">Slow:</span> &gt; 500ms</li>
          <li>React Query caches results, so subsequent calls should be instant</li>
          <li>First load includes network latency</li>
        </ul>
      </div>
    </div>
  )
}