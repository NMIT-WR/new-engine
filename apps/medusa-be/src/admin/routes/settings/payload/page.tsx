import { defineRouteConfig } from "@medusajs/admin-sdk"
import { useLayoutEffect, useRef, useState } from "react"

const PayloadRedirectPage = () => {
  const iframeUrl = import.meta.env.VITE_PAYLOAD_IFRAME_URL
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const ssoBase = backendUrl
    ? `${backendUrl.replace(/\/$/, "")}/admin/payload/sso`
    : "/admin/payload/sso"

  let returnTo = "/"
  if (iframeUrl) {
    try {
      const parsed = new URL(iframeUrl)
      const path =
        `${parsed.pathname}${parsed.search}${parsed.hash}` || "/"
      returnTo = path.startsWith("/") ? path : "/"
    } catch {
      returnTo = "/"
    }
  }

  const iframeSrc = `${ssoBase}?returnTo=${encodeURIComponent(returnTo)}`

  const containerRef = useRef<HTMLDivElement | null>(null)
  const [height, setHeight] = useState<number | null>(null)

  useLayoutEffect(() => {
    const updateHeight = () => {
      if (!containerRef.current) {
        return
      }
      const rect = containerRef.current.getBoundingClientRect()
      const parent = containerRef.current.parentElement
      const parentStyles = parent ? window.getComputedStyle(parent) : null
      const paddingBottom = parentStyles
        ? parseFloat(parentStyles.paddingBottom) || 0
        : 0
      const nextHeight = Math.max(
        0,
        window.innerHeight - rect.top - paddingBottom
      )
      setHeight(nextHeight)
    }

    updateHeight()
    window.addEventListener("resize", updateHeight)
    return () => {
      window.removeEventListener("resize", updateHeight)
    }
  }, [])

  if (!iframeUrl) {
    return (
      <div style={{ padding: "1.5rem" }}>
        Payload iframe URL is not configured.
      </div>
    )
  }

  const iframeHeight = "calc(100vh - 64px)"

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: height ? `${height}px` : iframeHeight,
        overflow: "hidden",
      }}
    >
      <iframe
        title="Payload Admin"
        src={iframeSrc}
        style={{
          width: "100%",
          height: "100%",
          border: "0",
        }}
      />
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Payload",
})

export default PayloadRedirectPage
