# Souhrn API a práce s daty

## Centralizovaná architektura

### Service Layer
Všechna API komunikace probíhá přes centralizované service třídy:

- **ProductService** (`src/services/product-service.ts`) - správa produktů
- **CategoryService** (`src/services/category-service.ts`) - správa kategorií

### HTTP Client
- **httpClient** (`src/lib/http-client.ts`) - axios instance s globální konfigurací
- **medusaClient** (`src/lib/medusa-client.ts`) - Medusa.js SDK wrapper

## Hooky pro práci s daty

### Products
- **useProducts** (`src/hooks/use-products-v2.ts`) - seznam produktů s paginací a filtrováním
- **useProduct** - detail produktu podle handle
- **useHomeProducts** - produkty pro homepage (featured, new arrivals, trending)
- **useProductSearch** - vyhledávání produktů
- **useRelatedProducts** - související produkty

### Categories
- **useCategories** (`src/hooks/use-categories-v2.ts`) - seznam kategorií
- **useCategoryTree** - hierarchická struktura kategorií

### URL State Management
- **useUrlFilters** (`src/hooks/use-url-filters.ts`) - synchronizace filtrů s URL parametry

## Caching strategie

### React Query konfigurace
Cachování přes **cacheConfig** (`src/lib/cache-config.ts`):

- **static** - dlouhodobě stabilní data (24h)
- **semiStatic** - občas se měnící data (1h) - používáme pro produkty
- **dynamic** - často se měnící data (5min)
- **realtime** - real-time data (30s)

### Query Keys
Centralizované klíče v **queryKeys** (`src/lib/query-keys.ts`):
```typescript
queryKeys.products.list({ page, limit, filters, sort })
queryKeys.product(handle)
queryKeys.categories.all()
```

## API Endpoints

### Medusa v2 API
- **Products**: `/store/products`
- **Categories**: `/store/product-categories`

### Použité fields
ProductService používá optimalizovaný fields string:
```typescript
DEFAULT_FIELDS = [
  'id', 'title', 'handle', 'description', 'thumbnail',
  'images.id', 'images.url',
  'categories.id', 'categories.name', 'categories.handle',
  'variants.id', 'variants.prices.amount', 'variants.prices.currency_code'
]
```

## Filtrování a řazení

### Server-side filtering
- Kategorie: `category_id` parameter
- Vyhledávání: `q` parameter  
- Řazení: `order` parameter

### Client-side filtering
- Ceny (Medusa v2 nepodporuje price filtering)
- Velikosti a barvy (nejsou v Medusa core)

### Sort mapping
```typescript
const sortMap = {
  'newest': '-created_at',
  'price-asc': 'variants.prices.amount',
  'price-desc': '-variants.prices.amount',
  'name-asc': 'title',
  'name-desc': '-title'
}
```

## Stránky a komponenty

### Unifikovaný přístup
Všechny stránky používají stejný pattern:
1. **URL state** - useUrlFilters pro synchronizaci s URL
2. **Data fetching** - příslušný hook (useProducts, useCategories)
3. **Service layer** - ProductService/CategoryService
4. **Caching** - React Query s vhodnou cache strategií

### Aktuální stránky
- **/** - homepage s CategoryTreeSection + AllProductsSection
- **/products** - ProductsPageContent s filtry a paginací
- **/categories** - CategoryGrid s shared komponentou
- **/products/[handle]** - detail produktu

## Výhody současné architektury

✅ **Centralizovaná logika** - vše v service třídách  
✅ **Optimalizované cachování** - různé strategie podle typu dat  
✅ **URL synchronizace** - filtry a stránkování v URL  
✅ **Server-side filtering** - lepší performance  
✅ **Typová bezpečnost** - plně typovaný TypeScript  
✅ **Reusable komponenty** - žádná duplicita kódu  
✅ **Error handling** - konzistentní error states  

## Nevyřešené limitace

⚠️ **Price filtering** - Medusa v2 nepodporuje přes API  
⚠️ **Variant options** - velikosti/barvy nejsou v core  
⚠️ **Stock filtering** - není implementováno  
⚠️ **Advanced search** - pouze basic text search  