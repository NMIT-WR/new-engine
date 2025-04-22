import { createTV } from "tailwind-variants";
import type { TV } from "tailwind-variants";

export const tv: TV = createTV({
  twMergeConfig: {
    theme: {
      text: [(value: string) => /-(sm|md|lg|\d?x?[sml])$/.test(value)]
    }
  }
});