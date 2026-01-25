import { z } from "zod"

const trimOrUndefined = (value: unknown): unknown => {
  if (typeof value !== "string") {
    return value
  }
  const trimmed = value.trim()
  return trimmed ? trimmed : undefined
}

const toOptionalNumber = (value: unknown): unknown => {
  if (typeof value !== "string") {
    return value
  }
  const trimmed = value.trim()
  if (!trimmed) {
    return undefined
  }
  const numberValue = Number(trimmed)
  return Number.isNaN(numberValue) ? value : numberValue
}

export const optionalStringParam = z.preprocess(
  trimOrUndefined,
  z.string().optional()
)

export const optionalPositiveIntParam = z.preprocess(
  toOptionalNumber,
  z.number().int().positive().optional()
)
