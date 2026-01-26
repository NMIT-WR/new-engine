import type { MedusaRequest } from "@medusajs/framework/http"
import { getQueryParam } from "../query"

const createRequest = (overrides: Partial<MedusaRequest> = {}) =>
  ({
    query: {},
    url: "http://localhost",
    ...overrides,
  }) as MedusaRequest

describe("getQueryParam", () => {
  it("returns string values from req.query", () => {
    const req = createRequest({ query: { slug: "home" } })
    expect(getQueryParam(req, "slug")).toBe("home")
  })

  it("returns the first string from array values", () => {
    const req = createRequest({ query: { slug: ["first", "second"] } })
    expect(getQueryParam(req, "slug")).toBe("first")
  })

  it("falls back to URL search params when query value is not a string", () => {
    const req = createRequest({
      query: { slug: 123 },
      url: "http://localhost?slug=fallback",
    })
    expect(getQueryParam(req, "slug")).toBe("fallback")
  })

  it("returns undefined for invalid URLs", () => {
    const req = createRequest({ query: { slug: {} }, url: "http://[" })
    expect(getQueryParam(req, "slug")).toBeUndefined()
  })

  it("returns undefined when the parameter is missing", () => {
    const req = createRequest({ url: "http://localhost" })
    expect(getQueryParam(req, "missing")).toBeUndefined()
  })
})
