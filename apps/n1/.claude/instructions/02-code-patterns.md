# Code Patterns

## React 19 Patterns

### Ref as Prop (NO forwardRef)

```typescript
// ✅ CORRECT - React 19
interface ButtonProps {
  ref?: React.RefObject<HTMLButtonElement>
  onClick?: () => void
  children: React.ReactNode
}

function Button({ ref, onClick, children }: ButtonProps) {
  return (
    <button ref={ref} onClick={onClick}>
      {children}
    </button>
  )
}

// ❌ WRONG - Outdated
const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  // NO! Don't use forwardRef in React 19
})
```

### No useCallback (React 19 optimizes automatically)

```typescript
// ✅ CORRECT - React 19
function Component() {
  const handleClick = () => {
    console.log('clicked')
  }

  return <Button onClick={handleClick} />
}

// ❌ WRONG - Unnecessary in React 19
function Component() {
  const handleClick = useCallback(() => {
    console.log('clicked')
  }, [])  // NO! React 19 handles this
}
```

---

## Import Patterns

### UI Library (Atomic Design)

```typescript
// Atoms - Basic elements
import { Button } from '@libs/ui/atoms/button'
import { Input } from '@libs/ui/atoms/input'
import { Badge } from '@libs/ui/atoms/badge'
import { Skeleton } from '@libs/ui/atoms/skeleton'

// Molecules - Composite components
import { Dialog } from '@libs/ui/molecules/dialog'
import { Accordion } from '@libs/ui/molecules/accordion'
import { Combobox } from '@libs/ui/molecules/combobox'
import { Tabs } from '@libs/ui/molecules/tabs'

// Organisms - Complex sections
import { ProductGrid } from '@libs/ui/organisms/product-grid'
import { Header } from '@libs/ui/organisms/header'
```

### Hooks

```typescript
// User data hooks
import { useAuth } from '@/hooks/use-auth'
import { useCart, useAddToCart } from '@/hooks/use-cart'
import { useOrders, useOrder } from '@/hooks/use-orders'
import { useAddresses } from '@/hooks/use-addresses'
import { useCheckout } from '@/hooks/use-checkout'

// Product hooks
import { useProducts } from '@/hooks/use-products'
import { useRegion } from '@/hooks/use-region'
import { usePrefetchProducts } from '@/hooks/use-prefetch-products'
```

### Services

```typescript
import { getProducts, getProductByHandle } from '@/services/product-service'
import { login, register, logout, getCustomer } from '@/services/auth-service'
import { getCart, addToCart, createCart } from '@/services/cart-service'
import { getOrders, getOrderById } from '@/services/order-service'
import { getAddresses, createAddress } from '@/services/customer-service'
```

### Utilities

```typescript
import { queryKeys } from '@/lib/query-keys'
import { cacheConfig } from '@/lib/cache-config'
import { CartServiceError } from '@/lib/errors'
import { sdk } from '@/lib/medusa-client'
```

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `product-grid.tsx`, `use-cart.ts` |
| Components | PascalCase | `ProductGrid`, `CartItem` |
| Hooks | camelCase with `use` | `useCart`, `useProducts` |
| Types/Interfaces | PascalCase | `UseCartReturn`, `ProductListParams` |
| Constants | SCREAMING_SNAKE | `CART_ID_KEY`, `DEFAULT_LIMIT` |
| Functions | camelCase | `getProducts`, `handleSubmit` |

---

## Component Styling with tv()

```typescript
import { tv } from '@libs/ui/utils'

const button = tv({
  base: 'inline-flex items-center justify-center transition-colors',
  variants: {
    variant: {
      primary: 'bg-primary text-fg-primary hover:bg-primary-hover',
      secondary: 'bg-secondary text-fg-reverse hover:bg-secondary-hover',
      ghost: 'bg-transparent hover:bg-fill-hover'
    },
    size: {
      sm: 'h-8 px-300 text-sm',
      md: 'h-10 px-400 text-base',
      lg: 'h-12 px-500 text-lg'
    }
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md'
  }
})

function Button({ variant, size, className, ...props }) {
  return <button className={button({ variant, size, className })} {...props} />
}
```

---

## Query Patterns

### Always use queryKeys

```typescript
import { queryKeys } from '@/lib/query-keys'
import { cacheConfig } from '@/lib/cache-config'

// ✅ CORRECT
useQuery({
  queryKey: queryKeys.cart.active(),
  queryFn: getCart,
  ...cacheConfig.realtime
})

// ❌ WRONG - Hardcoded keys
useQuery({
  queryKey: ['cart', 'active'],  // NO!
  queryFn: getCart
})
```

### Cache strategies

```typescript
// User data - realtime (30s fresh)
useQuery({
  queryKey: queryKeys.orders.list(),
  queryFn: getOrders,
  ...cacheConfig.realtime
})

// Catalog data - semiStatic (1h fresh)
useQuery({
  queryKey: queryKeys.products.list(params),
  queryFn: () => getProducts(params),
  ...cacheConfig.semiStatic
})
```

---

## Error Handling

```typescript
import { CartServiceError } from '@/lib/errors'

try {
  await addToCart(cartId, variantId, quantity)
} catch (error) {
  if (CartServiceError.isCartServiceError(error)) {
    switch (error.code) {
      case 'ITEM_ADD_FAILED':
        toast.error('Nepodařilo se přidat položku')
        break
      case 'CART_NOT_FOUND':
        toast.error('Košík nebyl nalezen')
        break
      case 'NETWORK_ERROR':
        toast.error('Problém se sítí')
        break
      default:
        toast.error(error.message)
    }
  }
}
```

---

## Tailwind v4 Notes

- **NO tailwind.config.js** - Tailwind v4 uses CSS-based config
- **Token files in** `src/tokens/*.css`
- **@theme directive** for custom values
- **Use semantic tokens** not arbitrary values
