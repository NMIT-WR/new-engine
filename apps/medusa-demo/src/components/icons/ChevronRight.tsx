import * as React from "react"

export const ChevronRight: React.FC<React.ComponentPropsWithoutRef<"svg">> = (
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
      d="M9.06 18.06 8 17l5.47-5.47L8 6.06 9.06 5l6.531 6.53-6.53 6.53Z"
      clipRule="evenodd"
    />
  </svg>
)
