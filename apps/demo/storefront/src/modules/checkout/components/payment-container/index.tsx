import * as React from "react"

import { isManual } from "@lib/constants"
import { UiRadio, UiRadioBox, UiRadioLabel } from "@/components/ui/Radio"
import PaymentTest from "@modules/checkout/components/payment-test"

type PaymentContainerProps = {
  paymentProviderId: string
  disabled?: boolean
  paymentInfoMap: Record<string, { title: string; icon: React.ReactNode }>
}

const PaymentContainer: React.FC<PaymentContainerProps> = ({
  paymentProviderId,
  paymentInfoMap,
  disabled = false,
}) => {
  const isDevelopment = process.env.NODE_ENV === "development"

  return (
    <UiRadio
      key={paymentProviderId}
      variant="outline"
      value={paymentProviderId}
      isDisabled={disabled}
      className="gap-4"
    >
      <UiRadioBox />
      <UiRadioLabel>
        {paymentInfoMap[paymentProviderId]?.title || paymentProviderId}

        {isManual(paymentProviderId) && isDevelopment && <PaymentTest />}
      </UiRadioLabel>
      <span className="ml-auto group-data-[selected=true]:font-normal">
        {paymentInfoMap[paymentProviderId]?.icon}
      </span>
    </UiRadio>
  )
}

export default PaymentContainer
