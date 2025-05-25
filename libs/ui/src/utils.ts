import { createTV } from 'tailwind-variants'
import type { TV } from 'tailwind-variants'

export const tv: TV = createTV({
  twMergeConfig: {
    theme: {
      text: [(value: string) => /-(size|sm|md|lg|\d?x?[sml])$/.test(value)],
    },
  },
})

export function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}
