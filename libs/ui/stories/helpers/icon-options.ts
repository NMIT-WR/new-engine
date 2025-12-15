import type { IconType } from "../../src/atoms/icon"

export const iconOptions: (IconType | undefined)[] = [
  undefined,
  "icon-[mdi--plus]",
  "icon-[mdi--pencil]",
  "icon-[mdi--delete]",
  "icon-[mdi--send]",
  "icon-[mdi--magnify]",
  "icon-[mdi--thumb-up]",
  "icon-[mdi--cart]",
  "icon-[mdi--check]",
  "icon-[mdi--close]",
]

export const iconLabels: Record<string, string> = {
  undefined: "None",
  "icon-[mdi--plus]": "Plus",
  "icon-[mdi--pencil]": "Pencil",
  "icon-[mdi--delete]": "Delete",
  "icon-[mdi--send]": "Send",
  "icon-[mdi--magnify]": "Search",
  "icon-[mdi--thumb-up]": "Thumb Up",
  "icon-[mdi--cart]": "Cart",
  "icon-[mdi--check]": "Check",
  "icon-[mdi--close]": "Close",
}
