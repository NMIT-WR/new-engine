import * as React from "react"

export const ChevronUp: React.FC<React.ComponentPropsWithoutRef<"svg">> = (
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
      d="m18.53 14.735-1.06 1.06-5.47-5.47-5.47 5.47-1.06-1.06L12 8.205l6.53 6.53Z"
      clipRule="evenodd"
    />
  </svg>
)
