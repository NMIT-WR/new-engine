"use client"

import { Button } from "@techsio/ui-kit/atoms/button"
import { ErrorText } from "@techsio/ui-kit/atoms/error-text"
import { Dialog } from "@techsio/ui-kit/molecules/dialog"
import { FormInputRaw as FormInput } from "@techsio/ui-kit/molecules/form-input"
import Image from "next/image"
import { useEffect, useState } from "react"
import "../../tokens/app-components/molecules/_credit-card-dialog.css"
import { Icon } from "@techsio/ui-kit/atoms/icon"

interface CreditCardDialogProps {
  open: boolean
  onOpenChange: (details: { open: boolean }) => void
  onSubmit: (cardData: CardData) => void
  isLoading?: boolean
}

interface CardData {
  cardNumber: string
  cardHolder: string
  expiryDate: string
  cvv: string
}

// Luhn algorithm for card validation
function cardCheck(cardNumber: string): boolean {
  const numberWithoutWhitespace = cardNumber.replaceAll(" ", "").length
  return numberWithoutWhitespace === 16
}

// Detect card type
function detectCardType(cardNumber: string): "visa" | "mastercard" | "unknown" {
  const cleanNumber = cardNumber.replace(/\s/g, "")

  if (/^4/.test(cleanNumber)) return "visa"
  if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber))
    return "mastercard"

  return "unknown"
}

// Format card number with spaces
function formatCardNumber(value: string): string {
  const cleanValue = value.replace(/\s/g, "")
  const groups = cleanValue.match(/.{1,4}/g) || []
  return groups.join(" ")
}

// Format expiry date
function formatExpiryDate(value: string): string {
  const cleanValue = value.replace(/\D/g, "")
  if (cleanValue.length >= 2) {
    return cleanValue.slice(0, 2) + "/" + cleanValue.slice(2, 4)
  }
  return cleanValue
}

export function CreditCardDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: CreditCardDialogProps) {
  const [cardData, setCardData] = useState<CardData>({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [cardType, setCardType] = useState<"visa" | "mastercard" | "unknown">(
    "unknown"
  )

  useEffect(() => {
    setCardType(detectCardType(cardData.cardNumber))
  }, [cardData.cardNumber])

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(
      e.target.value.replace(/\s/g, "").slice(0, 16)
    )
    setCardData({ ...cardData, cardNumber: formatted })

    // Clear error when user starts typing
    if (errors.cardNumber) {
      setErrors({ ...errors, cardNumber: "" })
    }
  }

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value)
    setCardData({ ...cardData, expiryDate: formatted })

    if (errors.expiryDate) {
      setErrors({ ...errors, expiryDate: "" })
    }
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4)
    setCardData({ ...cardData, cvv: value })

    if (errors.cvv) {
      setErrors({ ...errors, cvv: "" })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Card number validation
    if (!cardData.cardNumber) {
      newErrors.cardNumber = "Číslo karty je povinné"
    } else if (!cardCheck(cardData.cardNumber)) {
      newErrors.cardNumber = "Neplatné číslo karty"
    }

    // Card holder validation
    if (!cardData.cardHolder) {
      newErrors.cardHolder = "Jméno držitele karty je povinné"
    }

    // Expiry date validation
    if (cardData.expiryDate) {
      const [month, year] = cardData.expiryDate.split("/")
      const currentYear = new Date().getFullYear() % 100
      const currentMonth = new Date().getMonth() + 1

      if (Number.parseInt(month) < 1 || Number.parseInt(month) > 12) {
        newErrors.expiryDate = "Neplatný měsíc"
      } else if (
        Number.parseInt(year) < currentYear ||
        (Number.parseInt(year) === currentYear &&
          Number.parseInt(month) < currentMonth)
      ) {
        newErrors.expiryDate = "Karta je expirovaná"
      }
    } else {
      newErrors.expiryDate = "Datum expirace je povinné"
    }

    // CVV validation
    if (!cardData.cvv) {
      newErrors.cvv = "CVV je povinné"
    } else if (cardData.cvv.length < 3) {
      newErrors.cvv = "CVV musí mít alespoň 3 číslice"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(cardData)
    }
  }

  return (
    <Dialog
      customTrigger
      description="Zadejte údaje z vaší platební karty"
      onOpenChange={onOpenChange}
      open={open}
      title="Platba kartou"
    >
      <div className="flex flex-col gap-cc-dialog-root">
        <div className="mb-cc-dialog-logos-margin flex items-center gap-cc-dialog-logos">
          <Image
            alt="Visa"
            className={`h-cc-dialog-logo-height ${cardType === "visa" ? "opacity-1" : "opacity-50"}`}
            height={25}
            src="/assets/visa.webp"
            width={40}
          />
          <Image
            alt="Mastercard"
            className={`h-cc-dialog-logo-height ${cardType === "mastercard" ? "opacity-100" : "opacity-50"}`}
            height={25}
            src="/assets/mastercard.webp"
            width={40}
          />
        </div>

        <form
          className="flex flex-col gap-cc-dialog-form"
          onSubmit={handleSubmit}
        >
          <div className="relative">
            <FormInput
              helpText={
                errors.cardNumber && <ErrorText>{errors.cardNumber}</ErrorText>
              }
              id="card-number"
              label="Číslo karty"
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              required
              validateStatus={errors.cardNumber ? "error" : "default"}
              value={cardData.cardNumber}
            />
          </div>

          <FormInput
            helpText={
              errors.cardHolder && <ErrorText>{errors.cardHolder}</ErrorText>
            }
            id="card-holder"
            label="Jméno držitele karty"
            onChange={(e) =>
              setCardData({ ...cardData, cardHolder: e.target.value })
            }
            placeholder="Jan Novák"
            required
            validateStatus={errors.cardHolder ? "error" : "default"}
            value={cardData.cardHolder}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              helpText={
                errors.expiryDate && <ErrorText>{errors.expiryDate}</ErrorText>
              }
              id="expiry-date"
              label="Datum expirace"
              onChange={handleExpiryDateChange}
              placeholder="MM/RR"
              required
              validateStatus={errors.expiryDate ? "error" : "default"}
              value={cardData.expiryDate}
            />

            <div className="relative">
              <FormInput
                helpText={errors.cvv && <ErrorText>{errors.cvv}</ErrorText>}
                id="cvv"
                label="CVV"
                onChange={handleCvvChange}
                placeholder="123"
                required
                type="password"
                validateStatus={errors.cvv ? "error" : "default"}
                value={cardData.cvv}
              />
              <div className="absolute top-cc-dialog-tooltip-top right-cc-dialog-tooltip-right cursor-help text-cc-dialog-tooltip-fg" />
            </div>
          </div>

          <div className="mt-cc-dialog-security-margin flex items-center gap-cc-dialog-security-gap text-cc-dialog-security-fg text-cc-dialog-security-size">
            <Icon icon="token-icon-lock" />
            <span>Vaše platební údaje jsou bezpečně šifrovány</span>
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              disabled={isLoading}
              onClick={() => onOpenChange({ open: false })}
              type="button"
              variant="secondary"
            >
              Zrušit
            </Button>
            <Button
              className="flex-1"
              icon="icon-[mdi--credit-card-check]"
              isLoading={isLoading}
              type="submit"
              variant="primary"
            >
              Zaplatit
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  )
}
