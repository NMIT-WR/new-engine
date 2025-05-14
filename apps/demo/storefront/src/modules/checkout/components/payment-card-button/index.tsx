"use client"

import { useElements, useStripe } from "@stripe/react-stripe-js"
import * as React from "react"
import { HttpTypes } from "@medusajs/types"

import { isStripe } from "@lib/constants"
import { Button } from "@/components/Button"
import { usePathname, useRouter } from "next/navigation"
import { useInitiatePaymentSession, useSetPaymentMethod } from "hooks/cart"
import { withReactQueryProvider } from "@lib/util/react-query"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  isLoading: boolean
  setIsLoading: (value: boolean) => void
  cardComplete?: boolean
  createQueryString: (name: string, value: string) => string
  selectedPaymentMethod: string
  setError: (value: string | null) => void
}

const PaymentCardButton: React.FC<PaymentButtonProps> = ({
  cart,
  isLoading,
  setIsLoading,
  cardComplete,
  createQueryString,
  selectedPaymentMethod,
  setError,
}) => {
  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )
  if (isStripe(session?.provider_id) && isStripe(selectedPaymentMethod)) {
    return (
      <StripeCardPaymentButton
        setError={setError}
        cart={cart}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        cardComplete={cardComplete}
        createQueryString={createQueryString}
      />
    )
  }

  return (
    <PaymentMethodButton
      setError={setError}
      cart={cart}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      createQueryString={createQueryString}
      selectedPaymentMethod={selectedPaymentMethod}
    />
  )
}

const StripeCardPaymentButton = ({
  cart,
  isLoading,
  setIsLoading,
  cardComplete,
  createQueryString,
  setError,
}: {
  cart: HttpTypes.StoreCart
  isLoading: boolean
  setIsLoading: (value: boolean) => void
  cardComplete?: boolean
  createQueryString: (name: string, value: string) => string
  setError: (value: string | null) => void
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("card")

  const router = useRouter()

  const setPaymentMethod = useSetPaymentMethod()

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )
  const pathname = usePathname()

  const initiatePaymentSession = useInitiatePaymentSession()

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const shouldInputCard = !session

      if (!isStripe(session?.provider_id)) {
        await initiatePaymentSession.mutateAsync({ providerId: "stripe" })
      }
      if (!shouldInputCard) {
        if (card) {
          const token = await stripe?.createToken(card, {
            name:
              cart.billing_address?.first_name +
              " " +
              cart.billing_address?.last_name,
            address_line1: cart.billing_address?.address_1 ?? undefined,
            address_line2: cart.billing_address?.address_2 ?? undefined,
            address_city: cart.billing_address?.city ?? undefined,
            address_country: cart.billing_address?.country_code ?? undefined,
            address_zip: cart.billing_address?.postal_code ?? undefined,
            address_state: cart.billing_address?.province ?? undefined,
          })
          if (token) {
            await setPaymentMethod.mutateAsync({
              sessionId: session.id,
              token: token.token?.id,
            })
          }
        }
        return router.push(
          pathname + "?" + createQueryString("step", "review"),
          {
            scroll: false,
          }
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `${err}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      className="mt-6"
      onPress={handleSubmit}
      isLoading={isLoading}
      isDisabled={!cardComplete}
      data-testid="submit-payment-button"
    >
      {!session ? "Enter card details" : "Continue to review"}
    </Button>
  )
}

const PaymentMethodButton = ({
  isLoading,
  setIsLoading,
  createQueryString,
  selectedPaymentMethod,
  setError,
}: {
  cart: HttpTypes.StoreCart
  isLoading: boolean
  setIsLoading: (value: boolean) => void
  createQueryString: (name: string, value: string) => string
  selectedPaymentMethod: string
  setError: (value: string | null) => void
}) => {
  const router = useRouter()
  const pathname = usePathname()

  const initiatePaymentSession = useInitiatePaymentSession()

  const handleSubmit = () => {
    setIsLoading(true)
    initiatePaymentSession.mutate(
      {
        providerId: selectedPaymentMethod,
      },
      {
        onSuccess: () => {
          if (!isStripe(selectedPaymentMethod)) {
            return router.push(
              pathname + "?" + createQueryString("step", "review"),
              {
                scroll: false,
              }
            )
          }
          setIsLoading(false)
        },
        onError: (err) => {
          setError(err instanceof Error ? err.message : `${err}`)
          setIsLoading(false)
        },
      }
    )
  }

  return (
    <Button
      className="mt-6"
      onPress={handleSubmit}
      isLoading={isLoading}
      data-testid="submit-payment-button"
      isDisabled={!selectedPaymentMethod}
    >
      {isStripe(selectedPaymentMethod)
        ? "Enter card details"
        : "Continue to review"}
    </Button>
  )
}

export default withReactQueryProvider(PaymentCardButton)
