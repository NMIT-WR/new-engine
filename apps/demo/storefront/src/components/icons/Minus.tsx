import * as React from "react"

export const Minus: React.FC<React.ComponentPropsWithoutRef<"svg">> = (
  props
) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M19 12.75H5v-1.5h14v1.5Z"
      clipRule="evenodd"
    />
  </svg>
)
