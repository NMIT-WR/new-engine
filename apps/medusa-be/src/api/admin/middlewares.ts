import type { MiddlewareRoute } from "@medusajs/framework/http"
import { adminCompaniesMiddlewares } from "./companies/middlewares"
import { adminQuotesMiddlewares } from "./quotes/middlewares"
import { adminApprovalsMiddlewares } from "./approvals/middlewares"

export const adminMiddlewares: MiddlewareRoute[] = [
  ...adminCompaniesMiddlewares,
  ...adminQuotesMiddlewares,
  ...adminApprovalsMiddlewares,
]
