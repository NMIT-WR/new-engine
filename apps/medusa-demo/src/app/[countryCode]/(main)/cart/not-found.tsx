import { Metadata } from "next"

import NotFoundPage from "app/not-found"

export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

export default function NotFound() {
  return <NotFoundPage />
}
