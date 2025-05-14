import * as React from "react"

export const Check: React.FC<React.ComponentPropsWithoutRef<"svg">> = (
  props
) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="currentColor"
      strokeLinecap="square"
      strokeLinejoin="round"
      strokeWidth="2px"
      d="M9.354 16.948 20 6.302l.354.353L9.177 17.832a.25.25 0 0 1-.354 0l-5.176-5.177.353-.353 4.647 4.646a.5.5 0 0 0 .707 0Z"
    />
  </svg>
)
