import type { Country, PaymentMethod, ShippingMethod } from "@/types/checkout"

const getDeliveryDate = (daysToAdd: number) => {
  const date = new Date()
  date.setDate(date.getDate() + daysToAdd)
  return date.toLocaleDateString("cs-CZ", {
    weekday: "short",
    day: "numeric",
    month: "numeric",
  })
}

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: "ppl",
    name: "PPL",
    description: "Doručení na adresu",
    price: 89,
    priceFormatted: "89 Kč",
    delivery: "Doručení za 2-3 pracovní dny",
    deliveryDate: `Doručení ${getDeliveryDate(2)} - ${getDeliveryDate(3)}`,
    image: "/assets/ppl.webp",
  },
  {
    id: "dhl",
    name: "DHL",
    description: "Expresní doručení",
    price: 129,
    priceFormatted: "129 Kč",
    delivery: "Doručení za 1-2 pracovní dny",
    deliveryDate: `Doručení ${getDeliveryDate(1)} - ${getDeliveryDate(2)}`,
    image: "/assets/dhl.webp",
  },
  {
    id: "zasilkovna",
    name: "Zásilkovna",
    description: "Výdejní místa po celé ČR",
    price: 65,
    priceFormatted: "65 Kč",
    delivery: "Doručení za 2-3 pracovní dny",
    deliveryDate: `Doručení ${getDeliveryDate(2)} - ${getDeliveryDate(3)}`,
    image: "/assets/zasilkovna.webp",
  },
  {
    id: "balikovna",
    name: "Balíkovna",
    description: "Široká síť výdejních míst",
    price: 59,
    priceFormatted: "59 Kč",
    delivery: "Doručení za 2-3 pracovní dny",
    deliveryDate: `Doručení ${getDeliveryDate(2)} - ${getDeliveryDate(3)}`,
    image: "/assets/balikovna.webp",
  },
  {
    id: "personal",
    name: "Osobní odběr",
    description: "Vyzvednutí na prodejně",
    price: 0,
    priceFormatted: "Zdarma",
    delivery: "Připraveno ihned",
    deliveryDate: "Vyzvednutí dnes",
    image: "/assets/instore.webp",
  },
]

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "comgate", name: "Comgate", fee: 0, image: "/assets/comgate.webp" },
  { id: "gopay", name: "GoPay", fee: 0, image: "/assets/gpay.webp" },
  { id: "paypal", name: "PayPal", fee: 50, image: "/assets/paypal.webp" },
  { id: "cash", name: "Dobírkou", fee: 30, image: "/assets/cash.webp" },
  { id: "skippay", name: "SkipPay", fee: 0, image: "/assets/skippay.webp" },
  { id: "stripe", name: "Stripe", fee: 0, image: "/assets/stripe.webp" },
  { id: "card", name: "Platební kartou", fee: 0, image: "/assets/card.webp" },
  { id: "qr", name: "QR platba", fee: 0, image: "/assets/qr.webp" },
]

export const COUNTRIES: Country[] = [
  { label: "Česká republika", value: "cz" },
  { label: "Slovensko", value: "sk" },
  { label: "Polsko", value: "pl" },
  { label: "Německo", value: "de" },
  { label: "Rakousko", value: "at" },
]
