import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from '@medusajs/framework'
import type { MiddlewareRoute } from '@medusajs/framework/http'

export const authRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: /^\/auth\/.*/,
    middlewares: [
      async (
        req: MedusaRequest,
        res: MedusaResponse,
        next: MedusaNextFunction
      ) => {
        const origin = req.headers.origin as string
        const allowedOrigins =
          process.env.AUTH_CORS?.split(',').map((o) => o.trim()) || []

        console.log('[CORS Middleware] Request:', req.method, req.url)
        console.log('[CORS Middleware] Origin:', origin)
        console.log('[CORS Middleware] Allowed origins:', allowedOrigins)

        // Always set CORS headers for allowed origins
        if (origin && allowedOrigins.includes(origin)) {
          res.setHeader('Access-Control-Allow-Origin', origin)
          res.setHeader('Access-Control-Allow-Credentials', 'true')
          res.setHeader(
            'Access-Control-Allow-Methods',
            'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
          )
          res.setHeader(
            'Access-Control-Allow-Headers',
            'content-type,x-publishable-api-key,authorization'
          )
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
]
