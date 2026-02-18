"use client"

import { Button } from "@techsio/ui-kit/atoms/button"
import { Icon } from "@techsio/ui-kit/atoms/icon"
import { LinkButton } from "@techsio/ui-kit/atoms/link-button"
import { FormInput } from "@techsio/ui-kit/molecules/form-input"
import { Popover } from "@techsio/ui-kit/molecules/popover"
import { useToast } from "@techsio/ui-kit/molecules/toast"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { type FormEvent, useState } from "react"
import { authHooks } from "@/hooks/auth-hooks"
import {
  AUTH_MESSAGES,
  authFormFields,
  getAuthErrorMessage,
  withLoading,
} from "@/lib/auth"

export function AuthDropdown() {
  const { customer: user } = authHooks.useAuth()
  const router = useRouter()
  const toast = useToast()

  const logoutMutation = authHooks.useLogout({
    onSuccess: () => {
      toast.create({
        ...AUTH_MESSAGES.LOGOUT_SUCCESS,
        type: "success",
      })
      router.push("/")
    },
  })

  const signOut = () => {
    logoutMutation.mutate()
  }

  if (!user) {
    return (
      <Popover
        contentClassName="z-50"
        id="auth-dropdown"
        placement="bottom-end"
        size="sm"
        trigger={
          <span className="text-nowrap text-white text-xs">Přihlásit se</span>
        }
        triggerClassName="data-[state=open]:ring-0 data-[state=open]:ring-offset-0 rounded-sm bg-tertiary hover:bg-tertiary/60 mr-150"
      >
        <QuickLoginForm />
      </Popover>
    )
  }

  const menuItems = [
    {
      id: "menu-profile",
      type: "action" as const,
      value: "profile",
      label: "Můj profil",
      href: "/account/profile",
      icon: "icon-[mdi--account-outline]" as const,
    },
    {
      id: "menu-orders",
      type: "action" as const,
      value: "orders",
      label: "Moje objednávky",
      href: "/account/orders",
      icon: "icon-[mdi--package-variant-closed]" as const,
    },
    {
      type: "separator" as const,
      id: "menu-separator-1",
    },
    {
      id: "menu-logout",
      type: "action" as const,
      value: "logout",
      label: "Odhlásit se",
      href: "/",
      icon: "icon-[mdi--logout]" as const,
    },
  ]

  return (
    <Popover
      contentClassName="z-50"
      id="user-menu"
      trigger={
        <span className="flex h-full items-center gap-2 rounded-md px-2 py-1 text-sm text-tertiary hover:bg-surface">
          <Icon
            className="text-header-icon-size"
            icon="icon-[mdi--account-circle]"
          />
          <span className="hidden truncate xl:inline">
            {user.email.split("@")[0]}
          </span>
        </span>
      }
      triggerClassName="hover:bg-transparent active:bg-transparent data-[state=open]:ring-0 data-[state=open]:ring-offset-0"
    >
      <ul className="space-y-1">
        {menuItems.map((item) => (
          <li key={item.id}>
            {item.type === "action" ? (
              <LinkButton
                as={Link}
                className="w-full justify-start"
                href={item.href ?? ""}
                icon={item.icon}
                onClick={item.value === "logout" ? signOut : undefined}
                prefetch={true}
                size="sm"
                theme="borderless"
              >
                {item.label}
              </LinkButton>
            ) : (
              <div className="h-px w-full bg-highlight" />
            )}
          </li>
        ))}
      </ul>
    </Popover>
  )
}

function QuickLoginForm() {
  const router = useRouter()
  const toast = useToast()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const loginMutation = authHooks.useLogin({
    onSuccess: () => {
      toast.create({
        ...AUTH_MESSAGES.LOGIN_SUCCESS,
        type: "success",
      })
      router.push("/")
    },
    onError: (err) => {
      setError(getAuthErrorMessage(err))
    },
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError("")
    loginMutation.mutate({ email, password })
  }

  const isFormLoading = loginMutation.isPending

  return (
    <form
      className="w-auth-dropdown-form space-y-auth-dropdown-form-gap"
      onSubmit={handleSubmit}
    >
      <div className="space-y-auth-dropdown-header-gap">
        <h3 className="font-auth-dropdown-title text-auth-dropdown-title text-auth-dropdown-title-size">
          Přihlásit se
        </h3>
        <p className="text-auth-dropdown-subtitle text-auth-dropdown-subtitle-size">
          Zadejte své přihlašovací údaje
        </p>
      </div>

      <div className="space-y-auth-dropdown-input-gap">
        <FormInput
          {...withLoading(
            authFormFields.email({
              id: "quick-login-email",
              size: "sm",
              value: email,
              onChange: (e) => setEmail(e.target.value),
            }),
            isFormLoading
          )}
        />

        <FormInput
          {...withLoading(
            authFormFields.password({
              id: "quick-login-password",
              size: "sm",
              value: password,
              onChange: (e) => setPassword(e.target.value),
            }),
            isFormLoading
          )}
        />
      </div>

      {error && (
        <p className="text-auth-dropdown-error text-auth-dropdown-error-size">
          {error}
        </p>
      )}

      <div className="space-y-auth-dropdown-actions-gap">
        <Button
          className="w-full"
          disabled={isFormLoading}
          size="sm"
          type="submit"
          variant="primary"
        >
          {isFormLoading ? "Přihlašování..." : "Přihlásit se"}
        </Button>

        <div className="flex items-center gap-auth-dropdown-signup-gap text-auth-dropdown-signup-size">
          <span className="text-auth-dropdown-signup-text">Jste tu noví?</span>
          <LinkButton
            as={Link}
            className="h-auto p-0 font-normal text-auth-dropdown-signup-link hover:text-auth-dropdown-signup-link-hover"
            href="/auth/register"
            size="sm"
            theme="borderless"
            variant="tertiary"
          >
            Vytvořit účet
          </LinkButton>
        </div>
      </div>
    </form>
  )
}
