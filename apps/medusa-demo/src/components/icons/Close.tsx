import * as React from "react"

export const Close: React.FC<React.ComponentPropsWithoutRef<"svg">> = (
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
      d="m18.354 6-5.293 5.293-.354-.354L18 5.646l.354.354ZM6 5.646l5.293 5.293-.353.354L5.647 6 6 5.646Zm6 6 .354.354-.354.354-.353-.354.353-.354Zm.707 1.415.354-.354L18.354 18l-.354.354-5.293-5.293Zm-1.768-.354.354.354L6 18.354 5.647 18l5.293-5.293Z"
    />
  </svg>
)
