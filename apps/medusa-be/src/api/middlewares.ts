import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework"
import { errorHandler } from "@medusajs/framework/http"
import type { MedusaError } from "@medusajs/framework/utils"
import { defineMiddlewares } from "@medusajs/medusa"
import { captureException } from "@sentry/node"
import { authRoutesMiddlewares } from "./auth/middlewares"
import { storeRoutesMiddlewares } from "./store/middlewares"
import { storeProducersRoutesMiddlewares } from "./store/producers/middlewares"

const originalErrorHandler = errorHandler()

export default defineMiddlewares({
  errorHandler: (
    error: MedusaError | Error,
    req: MedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction
  ) => {
    captureException(error)
    return originalErrorHandler(error, req, res, next)
  },
  routes: [
    ...authRoutesMiddlewares,
    ...storeRoutesMiddlewares,
    ...storeProducersRoutesMiddlewares,
  ],
})
