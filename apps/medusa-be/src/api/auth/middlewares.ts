import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework"
import type { MiddlewareRoute } from "@medusajs/framework/http"
import type { Logger } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const authRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: /^\/auth\/.*/,
    middlewares: [
      (req: MedusaRequest, res: MedusaResponse, next: MedusaNextFunction) => {
        const logger = req.scope.resolve<Logger>(
          ContainerRegistrationKeys.LOGGER
        )
        const origin = req.headers.origin as string
        const allowedOrigins =
          process.env.AUTH_CORS?.split(",").map((o) => o.trim()) || []

        logger.debug(
          `[CORS Middleware] Request: ${req.method} ${req.url}, Origin: ${origin}`
        )

        // Always set CORS headers for allowed origins
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
          logger.debug(`[CORS Middleware] Headers set for origin: ${origin}`)
        } else if (origin) {
          logger.debug(`[CORS Middleware] Origin not allowed: ${origin}`)
        }

        // Handle preflight requests
        if (req.method === "OPTIONS") {
          res.status(200).end()
          return
        }

        next()
      },
    ],
  },
]
