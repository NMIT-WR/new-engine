import { Metadata } from "next"
import { notFound } from "next/navigation"

import { ChangePasswordForm } from "@modules/auth/components/ResetPasswordForm"
import { Layout, LayoutColumn } from "@/components/Layout"

export const metadata: Metadata = {
  title: "Reset password",
  description: "Reset your password",
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { email, token } = await searchParams

  if (
    typeof email !== "string" ||
    typeof token !== "string" ||
    !email ||
    !token
  ) {
    notFound()
  }

  return (
    <Layout className="py-26 md:pt-45 md:pb-36">
      <LayoutColumn
        start={{ base: 1, sm: 3, lg: 4, xl: 5 }}
        end={{ base: 13, sm: 11, lg: 10, xl: 9 }}
      >
        <ChangePasswordForm email={email} token={token} customer={true} />
      </LayoutColumn>
    </Layout>
  )
}
