import { Input } from '@ui/atoms/input'
import { Label } from '@ui/atoms/label'
import { PaymentMethodIcon } from './payment-method-icon'

export function PaymentFormSection() {
  return (
    <section className="rounded border border-border-primary bg-surface p-400">
      <h2 className="mb-400 font-semibold text-fg-primary text-lg">
        Payment Information
      </h2>

      {/* Payment method icons */}
      <div className="mb-400 flex gap-200">
        <PaymentMethodIcon method="mastercard" />
        <PaymentMethodIcon method="paypal" />
        <PaymentMethodIcon method="klarna" />
      </div>

      {/* Payment form */}
      <div className="[&>*+*]:mt-400">
        <div>
          <Label htmlFor="cardName">Name on card</Label>
          <Input
            id="cardName"
            type="text"
            placeholder="John Doe"
            className="mt-100"
          />
        </div>

        <div>
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input
            id="cardNumber"
            type="text"
            placeholder="1234 5678 9012 3456"
            className="mt-100"
          />
        </div>

        <div className="grid grid-cols-2 gap-400">
          <div>
            <Label htmlFor="expiration">Expiration</Label>
            <Input
              id="expiration"
              type="text"
              placeholder="MM/YY"
              className="mt-100"
            />
          </div>
          <div>
            <Label htmlFor="cvv">CVV</Label>
            <Input id="cvv" type="text" placeholder="123" className="mt-100" />
          </div>
        </div>
      </div>
    </section>
  )
}
