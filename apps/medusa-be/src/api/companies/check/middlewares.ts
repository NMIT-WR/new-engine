import { validateAndTransformQuery } from "@medusajs/framework"
import type { MiddlewareRoute } from "@medusajs/framework/http"
import { AdminCompaniesCheckCzAddressCountSchema } from "../../admin/companies/check/cz/address-count/route"
import { AdminCompaniesCheckCzTaxReliabilitySchema } from "../../admin/companies/check/cz/tax-reliability/route"
import { StoreCompaniesCheckCzInfoSchema } from "../../store/companies/check/cz/info/route"
import { StoreCompaniesCheckViesSchema } from "../../store/companies/check/vies/route"

export const companiesCheckRoutesMiddlewares: MiddlewareRoute[] = [
  {
    methods: ["GET"],
    matcher: "/store/companies/check/cz/info",
    middlewares: [
      validateAndTransformQuery(StoreCompaniesCheckCzInfoSchema, {
        isList: false,
      }),
    ],
  },
  {
    methods: ["GET"],
    matcher: "/store/companies/check/vies",
    middlewares: [
      validateAndTransformQuery(StoreCompaniesCheckViesSchema, {
        isList: false,
      }),
    ],
  },
  {
    methods: ["GET"],
    matcher: "/admin/companies/check/cz/tax-reliability",
    middlewares: [
      validateAndTransformQuery(AdminCompaniesCheckCzTaxReliabilitySchema, {
        isList: false,
      }),
    ],
  },
  {
    methods: ["GET"],
    matcher: "/admin/companies/check/cz/address-count",
    middlewares: [
      validateAndTransformQuery(AdminCompaniesCheckCzAddressCountSchema, {
        isList: false,
      }),
    ],
  },
]
