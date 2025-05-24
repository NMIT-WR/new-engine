import Medusa from "@medusajs/js-sdk"

const getBaseUrl = () => {
  let url
  if (typeof window === "undefined") {
    // Server-side
    url = process.env.MEDUSA_BACKEND_URL || "http://medusa-be:9000"
    console.log(
      `[SDK getBaseUrl SERVER] Using URL: ${url}. (process.env.MEDUSA_BACKEND_URL: ${process.env.MEDUSA_BACKEND_URL})`
    )
  } else {
    // Client-side
    url = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
    console.log(
      `[SDK getBaseUrl CLIENT] Using URL: ${url}. (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL: ${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL})`
    )
  }
  return url
}

const resolvedBaseUrl = getBaseUrl()

export const sdk = new Medusa({
  baseUrl: resolvedBaseUrl,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

console.log(`[SDK INIT] Initialized with baseUrl: ${resolvedBaseUrl}`)
