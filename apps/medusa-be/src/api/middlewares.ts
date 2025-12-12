import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework"
import { errorHandler } from "@medusajs/framework/http"
import { defineMiddlewares } from "@medusajs/medusa"
import { captureException } from "@sentry/node"
import { normalizeError } from "../utils/errors"
import { authRoutesMiddlewares } from "./auth/middlewares"
import { storeRoutesMiddlewares } from "./store/middlewares"
import { storeProducersRoutesMiddlewares } from "./store/producers/middlewares"

const originalErrorHandler = errorHandler()

export default defineMiddlewares({
  errorHandler: (
    error: unknown,
    req: MedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction
  ) => {
    const normalizedError = normalizeError(error)
    captureException(normalizedError)
    return originalErrorHandler(normalizedError, req, res, next)
  },
  routes: [
    ...authRoutesMiddlewares,
    ...storeRoutesMiddlewares,
    ...storeProducersRoutesMiddlewares,
  ],
})
