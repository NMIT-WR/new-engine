import {defineMiddlewares} from "@medusajs/medusa"
import type {MedusaNextFunction, MedusaRequest, MedusaResponse,} from "@medusajs/framework"
import {errorHandler,} from "@medusajs/framework/http"
import {MedusaError} from "@medusajs/framework/utils"
import * as Sentry from "@sentry/node"

const originalErrorHandler = errorHandler()

export default defineMiddlewares({
    errorHandler: (
        error: MedusaError | any,
        req: MedusaRequest,
        res: MedusaResponse,
        next: MedusaNextFunction
    ) => {
        Sentry.captureException(error)
        return originalErrorHandler(error, req, res, next)
    },
    routes: [
    {
      matcher: /^\/auth\/.*/,
      middlewares: [
        async (
          req: MedusaRequest,
          res: MedusaResponse,
          next: MedusaNextFunction
        ) => {
          const origin = req.headers.origin as string
          const allowedOrigins = process.env.AUTH_CORS?.split(',').map(o => o.trim()) || []

          console.log('[CORS Middleware] Request:', req.method, req.url)
          console.log('[CORS Middleware] Origin:', origin)
          console.log('[CORS Middleware] Allowed origins:', allowedOrigins)

          // Always set CORS headers for allowed origins
          if (origin && allowedOrigins.includes(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin)
            res.setHeader('Access-Control-Allow-Credentials', 'true')
            res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS')
            res.setHeader('Access-Control-Allow-Headers', 'content-type,x-publishable-api-key,authorization')
            res.setHeader('Vary', 'Origin')
            console.log('[CORS Middleware] Headers set for origin:', origin)
          } else {
            console.log('[CORS Middleware] Origin not allowed:', origin)
          }

          // Handle preflight requests
          if (req.method === 'OPTIONS') {
            res.status(200).end()
            return
          }

          next()
        },
      ],
    },
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
          const allowedOrigins = process.env.STORE_CORS?.split(',').map(o => o.trim()) || []

          if (origin && allowedOrigins.includes(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin)
            res.setHeader('Access-Control-Allow-Credentials', 'true')
            res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS')
            res.setHeader('Access-Control-Allow-Headers', 'content-type,x-publishable-api-key,authorization')
            res.setHeader('Vary', 'Origin')
          }

          if (req.method === 'OPTIONS') {
            res.status(200).end()
            return
          }

          next()
        },
      ],
    },
  ],
})