import {defineMiddlewares} from "@medusajs/medusa"
import {storeProducersRoutesMiddlewares} from "./store/producers/middlewares";
import {storeRoutesMiddlewares} from "./store/middlewares";
import {authRoutesMiddlewares} from "./auth/middlewares";
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
        ...authRoutesMiddlewares,
        ...storeRoutesMiddlewares,
        ...storeProducersRoutesMiddlewares,
    ],
})