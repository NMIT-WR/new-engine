# `@libs/analytics`

Unified e-commerce analytics tracking with a single hook and pluggable adapters.

If your app uses a strict Content Security Policy, pass a `nonce` prop to the pixel/script components.

## Usage

```tsx
import { useAnalytics } from '@libs/analytics'
import { useGoogleAdapter } from '@libs/analytics/google'
import { useMetaAdapter } from '@libs/analytics/meta'

function CheckoutThankYou({ order }) {
  const analytics = useAnalytics({
    adapters: [useMetaAdapter(), useGoogleAdapter()],
    debug: process.env.NODE_ENV === 'development',
  })

  useEffect(() => {
    analytics.trackPurchase({
      orderId: order.id,
      value: order.total,
      currency: 'CZK',
      numItems: order.items.length,
      products: order.items,
    })
  }, [])

  return <div>Thank you for your order!</div>
}
```

## Adding an adapter

- Create a module under `libs/analytics/src/<provider>/`.
- Implement `AnalyticsAdapter` and map the core events to the provider API.
- Prefer `createWindowGetter(...)` + `createTracker(...)` for consistent runtime-guards and debug logging.
