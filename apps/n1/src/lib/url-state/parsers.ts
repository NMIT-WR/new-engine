import { createParser, parseAsString, parseAsStringLiteral } from "nuqs"
import { ACCOUNT_TABS } from "../account-tabs"

function normalizePositiveInt(value: number): number {
  if (!(Number.isFinite(value) && value > 0)) {
    return 1
  }
  return Math.floor(value)
}

export const parseAsPositivePage = createParser<number>({
  parse: (value) => {
    const parsed = Number.parseInt(value, 10)
    if (!(Number.isFinite(parsed) && parsed > 0)) {
      return null
    }
    return Math.floor(parsed)
  },
  serialize: (value) => String(normalizePositiveInt(value)),
  eq: (a, b) => a === b,
})

export const parseAsSearchQuery = parseAsString
export const parseAsAccountTab = parseAsStringLiteral(ACCOUNT_TABS)
