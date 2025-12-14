import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework"
import { errorHandler } from "@medusajs/framework/http"
import { defineMiddlewares } from "@medusajs/medusa"
import { captureException } from "@sentry/node"
import { normalizeError } from "../utils/errors"
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
    return originalErrorHandler(error, req, res, next)
  },
  routes: [...storeProducersRoutesMiddlewares],
})
