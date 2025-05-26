import { createTV } from 'tailwind-variants'
import type { TV } from 'tailwind-variants'

const TEXT_SIZE_REGEX = /-(size|sm|md|lg|\d?x?[sml])$/
const WHITESPACE_REGEX = /\s+/g
const NON_WORD_REGEX = /[^\w-]+/g
const MULTIPLE_DASHES_REGEX = /--+/g
const LEADING_DASHES_REGEX = /^-+/
const TRAILING_DASHES_REGEX = /-+$/

export const tv: TV = createTV({
  twMergeConfig: {
    theme: {
      text: [(value: string) => TEXT_SIZE_REGEX.test(value)],
    },
  },
})

export function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .replace(WHITESPACE_REGEX, '-')
    .replace(NON_WORD_REGEX, '')
    .replace(MULTIPLE_DASHES_REGEX, '-')
    .replace(LEADING_DASHES_REGEX, '')
    .replace(TRAILING_DASHES_REGEX, '')
}
