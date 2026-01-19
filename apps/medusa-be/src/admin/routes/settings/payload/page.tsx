import { defineRouteConfig } from "@medusajs/admin-sdk"
import { useEffect } from "react"

const PayloadRedirectPage = () => {
  useEffect(() => {
    const baseUrl = import.meta.env.VITE_PAYLOAD_BASE_URL
    if (baseUrl) {
      window.open(`${baseUrl}/admin`, "_blank")
    }
    window.history.back()
  }, [])

  return null
}

export const config = defineRouteConfig({
  label: "Payload",
})

export default PayloadRedirectPage
