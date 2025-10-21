/**
 * Centralized logger exports
 * Import all loggers from single location: import { prefetchLogger, cacheLogger } from '@/lib/loggers'
 */

export { cacheLogger, logCache, logQuery, logError } from './cache'
export { prefetchLogger } from './prefetch'
export { fetchLogger } from './fetch'
export { componentDebugLogger } from './component'
