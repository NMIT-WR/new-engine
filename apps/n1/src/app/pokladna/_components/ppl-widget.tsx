'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'

export interface PplAccessPointData {
  /** Unique access point code (external number) */
  code: string
  /** Access point name */
  name: string
  /** Type: ParcelShop, ParcelBox, AlzaBox */
  type: string
  /** Full address object */
  address?: {
    street?: string
    city?: string
    zipCode?: string
    country?: string
  }
}

interface PplWidgetProps {
  /** Callback when access point is selected */
  onSelect: (data: PplAccessPointData) => void
  /** Initial latitude for map center (default: Prague) */
  lat?: number
  /** Initial longitude for map center (default: Prague) */
  lng?: number
  /** Country code (default: CZ) */
  country?: string
  /** Initial address for search */
  address?: string
  /** Pre-selected access point code */
  selectedCode?: string
  /** Display mode: 'default' or 'modal' */
  mode?: 'default' | 'modal'
  /** Initial filters (e.g., "ParcelShop,CardPayment") */
  initialFilters?: string
}

/**
 * PPL Widget for selecting pickup points (ParcelShop/ParcelBox)
 *
 * Official documentation:
 * https://www.ppl.cz/documents/20122/1893929/PPL_CZ_integration_PPL_widget_pick_up_points_v1.5.0.pdf
 *
 * @example
 * ```tsx
 * <PplWidget
 *   onSelect={(data) => console.log('Selected:', data)}
 *   address="Praha"
 *   country="CZ"
 * />
 * ```
 */
export function PplWidget({
  onSelect,
  lat = 50.0755,
  lng = 14.4378,
  country = 'CZ',
  address,
  selectedCode,
  mode = 'default',
  initialFilters,
}: PplWidgetProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const widgetRef = useRef<HTMLDivElement>(null)
  const listenerAttached = useRef(false)
  // PPL widget expects exact ID 'ppl-parcelshop-map'
  const widgetId = 'ppl-parcelshop-map'

  console.log('[PplWidget] Rendering widget with ID:', widgetId)

  useEffect(() => {
    if (!isScriptLoaded || listenerAttached.current) return

    console.log('[PplWidget] Script loaded, attaching event listener')

    const handleSelection = (event: MessageEvent) => {
      // PPL widget sends message event with pplPickupPointSelected
      if (event.data && event.data.event === 'pplPickupPointSelected') {
        const point = event.data.point

        console.log('[PplWidget] Access point selected:', point)

        if (point && point.code) {
          onSelect({
            code: point.code,
            name: point.name || '',
            type: point.type || 'ParcelShop',
            address: point.address,
          })
        }
      }
    }

    // Attach window message event listener for PPL widget selection
    window.addEventListener('message', handleSelection)
    listenerAttached.current = true

    // Debug: Check if widget element exists and log its attributes
    const widgetElement = document.getElementById(widgetId)
    if (widgetElement) {
      console.log('[PplWidget] Widget element found:', {
        id: widgetElement.id,
        attributes: Array.from(widgetElement.attributes).map(attr => ({
          name: attr.name,
          value: attr.value
        }))
      })
    } else {
      console.error('[PplWidget] Widget element NOT found with ID:', widgetId)
    }

    // Debug: Check if PPL global object exists
    const win = window as any
    console.log('[PplWidget] Checking for PPL global object:', {
      hasPPL: !!win.PPL,
      hasPpl: !!win.ppl,
      hasParcelshop: !!win.parcelshop,
      windowKeys: Object.keys(win).filter(k => k.toLowerCase().includes('ppl'))
    })

    // Try to trigger initialization if PPL object exists
    if (win.PPL && typeof win.PPL.init === 'function') {
      console.log('[PplWidget] Calling PPL.init()')
      try {
        win.PPL.init()
      } catch (error) {
        console.error('[PplWidget] PPL.init() failed:', error)
      }
    } else if (win.ppl && typeof win.ppl.init === 'function') {
      console.log('[PplWidget] Calling ppl.init()')
      try {
        win.ppl.init()
      } catch (error) {
        console.error('[PplWidget] ppl.init() failed:', error)
      }
    }

    return () => {
      window.removeEventListener('message', handleSelection)
      listenerAttached.current = false
    }
  }, [isScriptLoaded, onSelect])

  // Load CSS stylesheet
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://www.ppl.cz/sources/map/main.css'
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [])

  return (
    <>
      <Script
        src="https://www.ppl.cz/sources/map/main.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('[PplWidget] Script loaded successfully')
          setIsScriptLoaded(true)
        }}
        onError={(e) => {
          console.error('[PplWidget] Failed to load script:', e)
        }}
      />

      <div
        ref={widgetRef}
        id={widgetId}
        data-lat={lat}
        data-lng={lng}
        data-mode={mode}
        data-country={country.toLowerCase()}
        data-countries={country.toLowerCase()}
        data-language="cs"
        {...(address && { 'data-address': address })}
        {...(selectedCode && { 'data-code': selectedCode })}
        {...(initialFilters && { 'data-initialfilters': initialFilters })}
        className="min-h-96 w-full rounded border border-border-secondary bg-surface"
        style={{ minHeight: '400px' }}
      />
    </>
  )
}
