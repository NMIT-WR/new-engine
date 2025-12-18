"use client"

import Script from "next/script"
import { useEffect, useRef, useState } from "react"

export type PplAccessPointData = {
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

type PplWidgetProps = {
  /** Callback when access point is selected */
  onSelect: (data: PplAccessPointData) => void
  /** Initial latitude for map center */
  lat?: number
  /** Initial longitude for map center */
  lng?: number
  /** Country code (default: CZ) */
  country?: string
  /** Initial address for search */
  address?: string
  /** Pre-selected access point code */
  selectedCode?: string
  /** Display mode: 'default' or 'modal' */
  mode?: "default" | "modal"
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
  lat,
  lng,
  country = "CZ",
  address,
  selectedCode,
  mode = "default",
  initialFilters,
}: PplWidgetProps) {
  const hasLatLngProps = typeof lat === "number" && typeof lng === "number"
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [language, setLanguage] = useState("cs")
  const [languageResolved, setLanguageResolved] = useState(false)
  const [locationResolved, setLocationResolved] = useState(hasLatLngProps)
  const [geoLocation, setGeoLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)
  const widgetRef = useRef<HTMLDivElement>(null)
  const listenerAttached = useRef(false)
  // PPL widget expects exact ID 'ppl-parcelshop-map'
  const widgetId = "ppl-parcelshop-map"

  useEffect(() => {
    if (!isScriptLoaded || listenerAttached.current) {
      return
    }

    const handleSelection = (event: MessageEvent) => {
      // PPL widget sends message event with pplPickupPointSelected
      if (event.data && event.data.event === "pplPickupPointSelected") {
        const point = event.data.point

        if (point?.code) {
          onSelect({
            code: point.code,
            name: point.name || "",
            type: point.type || "ParcelShop",
            address: point.address,
          })
        }
      }
    }

    // Attach window message event listener for PPL widget selection
    window.addEventListener("message", handleSelection)
    listenerAttached.current = true

    return () => {
      window.removeEventListener("message", handleSelection)
      listenerAttached.current = false
    }
  }, [isScriptLoaded, onSelect])

  useEffect(() => {
    const normalizedLanguage =
      (document.documentElement.lang || navigator.language || "cs")
        .split("-")[0]
        ?.toLowerCase() || "cs"
    setLanguage(normalizedLanguage)
    setLanguageResolved(true)
  }, [])

  useEffect(() => {
    if (locationResolved || hasLatLngProps) {
      return
    }
    if (!navigator.geolocation) {
      setLocationResolved(true)
      return
    }

    let cancelled = false

    const markResolved = () => {
      if (cancelled) {
        return
      }
      setLocationResolved(true)
    }

    const requestLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (cancelled) {
            return
          }
          setGeoLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setLocationResolved(true)
        },
        () => {
          markResolved()
        },
        { enableHighAccuracy: false, maximumAge: 60_000, timeout: 2000 }
      )
    }

    if (!navigator.permissions?.query) {
      requestLocation()
      return () => {
        cancelled = true
      }
    }

    navigator.permissions
      .query({ name: "geolocation" as PermissionName })
      .then((status) => {
        if (status.state === "granted") {
          requestLocation()
          return
        }
        markResolved()
      })
      .catch(() => {
        markResolved()
      })

    return () => {
      cancelled = true
    }
  }, [hasLatLngProps, locationResolved])

  // Load CSS stylesheet
  useEffect(() => {
    const href = "https://www.ppl.cz/sources/map/main.css"
    const existingLink = document.head.querySelector<HTMLLinkElement>(
      `link[href="${href}"]`
    )
    if (existingLink) {
      return
    }

    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = href
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [])

  const shouldLoadScript = languageResolved && locationResolved

  return (
    <>
      {shouldLoadScript ? (
        <Script
          onLoad={() => {
            setIsScriptLoaded(true)
          }}
          src="https://www.ppl.cz/sources/map/main.js"
          strategy="afterInteractive"
        />
      ) : null}

      <div
        data-countries={country.toLowerCase()}
        data-country={country.toLowerCase()}
        data-language={language}
        data-lat={hasLatLngProps ? lat : geoLocation?.lat}
        data-lng={hasLatLngProps ? lng : geoLocation?.lng}
        data-mode={mode}
        id={widgetId}
        ref={widgetRef}
        {...(address && { "data-address": address })}
        {...(selectedCode && { "data-code": selectedCode })}
        {...(initialFilters && { "data-initialfilters": initialFilters })}
        className="min-h-96 w-full rounded border border-border-secondary bg-surface"
        style={{ minHeight: "400px" }}
      />
    </>
  )
}
