import * as React from "react"

export const Menu: React.FC<React.ComponentPropsWithoutRef<"svg">> = (
  props
) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M2.25 5.095h19.5v1.5H2.25v-1.5Zm0 6h19.5v1.5H2.25v-1.5Zm0 6h19.5v1.5H2.25v-1.5Z"
      clipRule="evenodd"
    />
  </svg>
)
