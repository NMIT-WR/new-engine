import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework"
import type { MiddlewareRoute } from "@medusajs/framework/http"

export const storeRoutesMiddlewares: MiddlewareRoute[] = [
  {
    // Also handle /store routes for authenticated requests
    matcher: /^\/store\/.*/,
    middlewares: [
      async (
        req: MedusaRequest,
        res: MedusaResponse,
        next: MedusaNextFunction
      ) => {
        const origin = req.headers.origin as string
        const allowedOrigins =
          process.env.STORE_CORS?.split(",").map((o) => o.trim()) || []

        if (origin && allowedOrigins.includes(origin)) {
          res.setHeader("Access-Control-Allow-Origin", origin)
          res.setHeader("Access-Control-Allow-Credentials", "true")
          res.setHeader(
            "Access-Control-Allow-Methods",
            "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
          )
          res.setHeader(
            "Access-Control-Allow-Headers",
            "content-type,x-publishable-api-key,authorization"
          )
          res.setHeader("Vary", "Origin")
        }

        if (req.method === "OPTIONS") {
          res.status(200).end()
          return
        }

        next()
      },
    ],
  },
]
