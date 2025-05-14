import * as React from "react"

export const ChevronDown: React.FC<React.ComponentPropsWithoutRef<"svg">> = (
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
      d="m5.47 9.265 1.06-1.06 5.47 5.47 5.47-5.47 1.06 1.06-6.53 6.53-6.53-6.53Z"
      clipRule="evenodd"
    />
  </svg>
)
