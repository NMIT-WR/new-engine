'use client'

import { useCallback } from 'react'
import type {
	IdentifyParams,
	LeadhubFunction,
	PurchaseParams,
	SetCartParams,
	ViewCategoryParams,
	ViewContentParams,
} from './types'

/**
 * Get the Leadhub function from window
 * Returns null if not available (SSR or SDK not loaded)
 */
function getLhi(): LeadhubFunction | null {
	if (typeof window === 'undefined') return null
	return window.lhi ?? window.LHInsights ?? null
}

/**
 * Hook for Leadhub event tracking
 *
 * @example
 * ```tsx
 * const { trackViewContent, trackPurchase } = useLeadhub()
 *
 * // Track product view
 * trackViewContent({ products: [{ product_id: 'prod_123' }] })
 *
 * // Track purchase
 * trackPurchase({
 *   email: 'customer@example.com',
 *   value: 1500,
 *   currency: 'CZK',
 *   products: [{ product_id: 'prod_123', quantity: 1, value: 1500 }],
 *   order_id: 'order_456'
 * })
 * ```
 */
export function useLeadhub() {
	/**
	 * Track product detail view
	 */
	const trackViewContent = useCallback((params: ViewContentParams) => {
		const lhi = getLhi()
		if (!lhi) return

		lhi('ViewContent', params)
	}, [])

	/**
	 * Track category page view
	 */
	const trackViewCategory = useCallback((params: ViewCategoryParams) => {
		const lhi = getLhi()
		if (!lhi) return

		lhi('ViewCategory', params)
	}, [])

	/**
	 * Track cart state (call on every cart change)
	 */
	const trackSetCart = useCallback((params: SetCartParams) => {
		const lhi = getLhi()
		if (!lhi) return

		lhi('SetCart', params)
	}, [])

	/**
	 * Identify user (call on login/registration)
	 */
	const trackIdentify = useCallback((params: IdentifyParams) => {
		const lhi = getLhi()
		if (!lhi) return

		lhi('Identify', params)
	}, [])

	/**
	 * Track completed purchase
	 */
	const trackPurchase = useCallback((params: PurchaseParams) => {
		const lhi = getLhi()
		if (!lhi) return

		lhi('Purchase', params)
	}, [])

	/**
	 * Track pageview (usually called automatically by init script)
	 */
	const trackPageview = useCallback(() => {
		const lhi = getLhi()
		if (!lhi) return

		lhi('pageview')
	}, [])

	return {
		trackViewContent,
		trackViewCategory,
		trackSetCart,
		trackIdentify,
		trackPurchase,
		trackPageview,
	}
}
