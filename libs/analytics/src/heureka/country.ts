import type { HeurekaCountry } from "./types"

export function isHeurekaCountry(country: unknown): country is HeurekaCountry {
  return country === "cz" || country === "sk"
}

export function normalizeHeurekaCountry(country: unknown): HeurekaCountry {
  return country === "sk" ? "sk" : "cz"
}
