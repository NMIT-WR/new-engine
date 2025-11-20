# Shrnutí změn - Checkout Page Implementation

Datum: 2025-11-20
Branch: `checkout-second`

---

## 📦 Dependencies

### package.json
Přidány nové dependencies pro React Hook Form a Zod validaci: `react-hook-form@^7.66.1`, `zod@^4.1.12`, `@hookform/resolvers@^5.2.2`. Odstraněn `sonner` (nahrazen existujícím toast systémem z `@new-engine/ui`). Dev script změněn na port 3002.

---

## ✨ Nové soubory

### src/app/checkout/page.tsx
Hlavní checkout stránka s dvousloupcovým layoutem (formulář vlevo, order summary vpravo). Používá hooks `useCheckout`, `useCart`, `useAuth` pro načtení dat. Zobrazuje delivery badges, shipping address section, shipping method section, payment form a order summary. Automaticky vybírá první shipping option a inicializuje platbu.

### src/app/checkout/_components/address-form-dialog.tsx
Dialog komponenta pro přidání/editaci dodací adresy s React Hook Form a Zod validací. Obsahuje pole pro jméno, příjmení, adresu, město, PSČ, zemi (CZ/SK) a telefon. Automaticky formátuje PSČ na formát "XXX XX" při psaní. Používá `useUpdateCartAddress` hook pro uložení adresy do košíku.

### src/app/checkout/_components/shipping-address-section.tsx
Sekce pro zobrazení a editaci dodací adresy v checkoutu. Zobrazuje existující adresu nebo placeholder s výzvou k přidání adresy. Obsahuje badge "Added" pokud je adresa vyplněna. Tlačítko "Edit Address" / "Add Address" otevírá AddressFormDialog.

### src/app/checkout/_components/shipping-method-section.tsx
Sekce pro výběr způsobu dopravy s radio buttony. Zobrazuje všechny dostupné shipping options s názvem, popisem a cenou. Automaticky je vybrána první možnost. Používá `useCheckoutShipping` hook pro update shipping metody.

### src/app/checkout/_components/payment-form-section.tsx
Sekce pro výběr platební metody s radio buttony. Zobrazuje všechny dostupné payment providers s ikonami a názvy. Používá `useCheckoutPayment` hook pro inicializaci platby.

### src/app/checkout/_components/order-summary.tsx
Pravý sloupec s přehledem objednávky. Obsahuje seznam položek v košíku (CartItemRow), cenové řádky (subtotal, shipping, tax, discount) a celkovou cenu. Zobrazuje badge s počtem položek v košíku.

### src/app/checkout/_components/cart-item-row.tsx
Komponenta pro zobrazení jedné položky v košíku v order summary. Zobrazuje thumbnail obrázek (Next Image), název produktu, variantu, množství a cenu. Používá utils pro formátování ceny (`formatAmount`).

### src/app/checkout/_components/price-summary-row.tsx
Univerzální komponenta pro zobrazení cenového řádku (label + hodnota). Podporuje zvýraznění (highlight), sémantické barvy (success, danger) a bold styl. Používá se pro subtotal, shipping, tax, discount a total.

### src/app/checkout/_components/payment-method-icon.tsx
Komponenta pro zobrazení ikony platební metody podle provider ID. Podporuje Stripe, manual (dobírka), faktura, bankovní převod a PayPal. Fallback ikona "credit-card" pro neznámé providery.

### src/app/checkout/_components/delivery-badges.tsx
Komponenta s badges informujícími o dodacích podmínkách. Zobrazuje "Free shipping over 2000 Kč" a "Express delivery available". Používá Iconify ikony pro vizuální vylepšení.

### src/hooks/use-update-cart-address.ts
React Query mutation hook pro update shipping address v košíku. Validuje required fields (first_name, last_name, address_1, city, postal_code, country_code). Používá optimistic updates s rollback při chybě. Zobrazuje toast notifikace při úspěchu/chybě pomocí `checkoutToasts`.

### src/schemas/address.schema.ts
Zod schema pro validaci adresního formuláře. Obsahuje validaci pro všechna pole včetně custom validace PSČ pro CZ/SK (formát XXX XX). Exportuje TypeScript typy `AddressFormData` a `AddressSchema`.

### src/utils/formatters.ts
Utility funkce pro formátování formulářových inputů. `formatters.postalCode` - formátuje PSČ na "XXX XX" pro CZ/SK. `formatters.phone` - čistí telefonní čísla (pouze čísla, +, mezery, závorky, pomlčky). `formatters.name` - kapitalizuje první písmeno jména. `formatAddressForDisplay` - formátuje address objekt pro zobrazení (pole stringů).

---

## 🔧 Upravené soubory

### src/app/layout.tsx
Přidán import `HeaderProvider` a wrapper pro `N1Header` komponentu. Změněn title z "Create Next App" na "LOCAL HOST 3002". Odstraněn import a render `<Toaster />` (přesunut do `Providers` komponenty kvůli server/client component erroru).

### src/components/provider.tsx
Přidán import a render `<Toaster />` komponenty z `@new-engine/ui/molecules/toast`. Toaster je nyní součástí client komponenty `Providers`, což řeší "useMachine() from server" error. Toaster je renderován po React Query DevTools.

### src/hooks/use-checkout-shipping.ts
Exportován type `UseCheckoutShippingReturn` (před změnou byl pouze interní). Umožňuje jiným komponentám používat správné TypeScript typy pro return value hooku.

### src/hooks/use-toast.tsx
Přidány checkout-specific toast messages do objektu `checkoutToasts` (addressUpdated, addressError, shippingUpdated, paymentInitiated, orderSuccess, orderError). Přidán nový hook `useCheckoutToast()` s helper metodami pro snadné zobrazování checkout toastů. Všechny toasty používají existující `toaster.create()` z `@new-engine/ui`.

---

## 🎨 Biome formátování (pouze kosmetické změny)

Následující soubory byly upraveny pouze Biome formátovačem - žádné funkční změny:

- **src/utils/cart/index.ts** - přidán EOF newline
- **src/utils/cart/cart-helpers.ts** - line endings (LF → CRLF)
- **src/utils/debounce.ts** - line endings (LF → CRLF)
- **src/utils/format/format-product.ts** - line endings (LF → CRLF)
- **src/utils/helpers/array.ts** - line endings (LF → CRLF)
- **src/utils/helpers/async.ts** - line endings (LF → CRLF)
- **src/utils/helpers/build-breadcrumb.ts** - line endings (LF → CRLF)
- **src/utils/helpers/parse-producer-data.ts** - přeformátování chained method calls (multi-line → single-line)
- **src/utils/select-variant.ts** - line endings (LF → CRLF)
- **src/utils/transform/find-node-by-id.ts** - line endings (LF → CRLF)
- **src/utils/transform/get-category-path.ts** - line endings (LF → CRLF)
- **src/utils/transform/transform-product.ts** - line endings (LF → CRLF)
- **src/utils/transform/transform-to-tree.ts** - line endings (LF → CRLF)

---

## 📊 Statistika změn

- **Nové soubory**: 14
- **Upravené soubory**: 4 (funkční změny) + 13 (pouze formátování)
- **Přidané řádky**: ~1500 (včetně komponent, hooks, schemas)
- **Odebrané řádky**: ~50 (Sonner, duplicitní kód)

---

## 🔑 Klíčové technologie

- **React Hook Form 7.66.1** - form state management
- **Zod 4.1.12** - schema validation
- **@hookform/resolvers 5.2.2** - React Hook Form + Zod integrace
- **@new-engine/ui/molecules/toast** - toast notifikace (Zag.js)
- **@tanstack/react-query 5.90.2** - server state management
- **Next.js 16** - App Router, Server/Client Components

---

## ✅ Dodržené konvence

- ✅ Token-based styling (50-950 scale, ne sm/md/lg)
- ✅ React 19 patterns (ref jako prop, bez useCallback)
- ✅ Atomic design (atoms → molecules → organisms)
- ✅ Existující infrastruktura (@new-engine/ui toast místo Sonner)
- ✅ React Query cache management s optimistic updates
- ✅ TypeScript strict mode s plnou type safety
- ✅ Zod validace místo manuální validace
- ✅ Čisté funkční komponenty bez side effects
