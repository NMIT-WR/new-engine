import * as React from "react"

export const ArrowUpRight: React.FC<React.ComponentPropsWithoutRef<"svg">> = (
  props
) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <mask id="a" fill="#fff">
      <path
        fillRule="evenodd"
        d="M5.785 17.12 16.038 6.867l1.06 1.06L6.847 18.182l-1.06-1.06Z"
        clipRule="evenodd"
      />
      <path
        fillRule="evenodd"
        d="M6.096 6.47h11.4v11.4h-1.5v-9.9h-9.9v-1.5Z"
        clipRule="evenodd"
      />
    </mask>
    <path
      fill="currentColor"
      d="m5.785 17.12-.707-.707a1 1 0 0 0 0 1.414l.707-.707ZM16.038 6.867l.707-.707a1 1 0 0 0-1.414 0l.707.707Zm1.06 1.06.708.708a1 1 0 0 0 0-1.414l-.707.707ZM6.847 18.182l-.707.707a1 1 0 0 0 1.414 0l-.707-.707Zm-.75-11.71v-1h-1v1h1Zm11.4 0h1v-1h-1v1Zm0 11.4v1h1v-1h-1Zm-1.5 0h-1v1h1v-1Zm0-9.9h1v-1h-1v1Zm-9.9 0h-1v1h1v-1Zm11.71-.75-1.06-1.06-1.415 1.413 1.06 1.061 1.415-1.414ZM5.078 17.827l1.06 1.061 1.415-1.414-1.06-1.06-1.415 1.413ZM15.331 6.16 5.078 16.413l1.414 1.414L16.745 7.574 15.331 6.16ZM7.553 18.888 17.806 8.635l-1.414-1.414L6.139 17.474l1.414 1.414Zm8.442-.018h1.5v-2h-1.5v2Zm-10.9-12.4v1.5h2v-1.5h-2Zm12.4-1h-11.4v2h11.4v-2Zm1 12.4V6.47h-2v11.4h2Zm-3.5-9.9v9.9h2v-9.9h-2Zm-8.9 1h9.9v-2h-9.9v2Z"
      mask="url(#a)"
    />
  </svg>
)
