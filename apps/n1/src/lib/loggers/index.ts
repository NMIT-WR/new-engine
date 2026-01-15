/**
 * Centralized logger exports
 * Import all loggers from single location: import { prefetchLogger, fetchLogger } from '@/lib/loggers'
 */

export { logQuery } from './cache'
export { prefetchLogger } from './prefetch'
export { fetchLogger } from './fetch'
