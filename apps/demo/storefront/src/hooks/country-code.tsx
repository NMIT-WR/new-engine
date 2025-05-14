import { useParams, usePathname } from "next/navigation"

export const useCountryCode = (
  countryOptions?: {
    country: string | undefined
    region: string
    label: string | undefined
  }[]
) => {
  const pathName = usePathname()
  const params = useParams()

  if (typeof params.countryCode === "string") {
    return params.countryCode
  }

  if (countryOptions) {
    // Check if the path contains a country code and update the current path
    const pathParts = pathName.replace(/^\//, "").split("/")

    if (pathParts.length > 1) {
      const firstPathPart = pathParts[0]
      const country = countryOptions.find(
        (country) => country.country === firstPathPart
      )

      if (country) {
        return country.country
      }
    }
  } else {
    const pathParts = pathName.replace(/^\//, "").split("/")

    if (pathParts.length > 1 && pathParts[0].length === 2) {
      return pathParts[0]
    }
  }
}
