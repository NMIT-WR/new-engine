import { categoryMap } from '@/lib/static-data/categories'

export function getCategoryIdByHandle(handle: string): string | undefined {
  return Object.values(categoryMap).find(cat => cat.handle === handle)?.id
}

export function getCategoryIdsByHandles(handles: string[]): string[] {
  return handles
    .map(handle => getCategoryIdByHandle(handle))
    .filter(id => id !== undefined)
}