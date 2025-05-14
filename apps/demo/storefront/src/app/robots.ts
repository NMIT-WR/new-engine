import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  if (process.env.DISALLOW_ROBOTS) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    }
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/private/",
    },
  }
}
