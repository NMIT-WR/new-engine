# Frontend - Práce s daty

## Přehled

Frontend-demo aplikace používá kombinaci React Query (TanStack Query) pro data fetching a caching, společně s TanStack Store pro lokální state management. 

## Hlavní hooky pro práci s daty

### 1. Produkty

#### `use-products.ts`
- **Účel**: Hlavní hook pro načítání seznamu produktů
- **API**: Používá Medusa JS SDK
- **Funkce**:
  - `useProducts()` - načítá seznam produktů s filtrací a stránkováním
  - `useProduct(handle)` - načítá detail jednoho produktu
- **Transformace**: Komplexní `transformProduct()` funkce, která:
  - Opravuje URL obrázků (MinIO problém)
  - Přiřazuje fallback kategorii pokud produkt nemá žádnou
  - Zpracovává varianty a ceny podle regionu

#### `use-home-products.ts` 
- **Účel**: Speciální hook pro homepage
- **API**: Používá httpClient (custom wrapper)
- **Problém**: Duplikuje logiku načítání produktů
- **Funkce**: Rozděluje produkty na featured, newArrivals a trending

### 2. Kategorie

#### `use-categories.ts`
- **Účel**: Hlavní hook pro práci s kategoriemi
- **API**: Používá httpClient
- **Funkce**:
  - `useCategories()` - seznam kategorií s počty produktů
  - `useCategory(handle)` - detail jedné kategorie

#### `use-all-categories.ts`
- **Účel**: Alternativní hook pro všechny kategorie
- **API**: Používá přímý fetch (ne httpClient)
- **Problém**: Duplikuje logiku, nekonzistentní přístup

### 3. Další důležité hooky

- **`use-region.ts`** - Správa regionu (měna, jazyk)
- **`use-cart.ts`** - Nákupní košík s localStorage persistencí
- **`use-auth.ts`** - Autentizace uživatele
- **`use-product-listing.ts`** - Správa filtrů a řazení (ne data fetching)

## Utility funkce

### `product-utils.ts`
- `extractProductData()` - Centralizuje extrakci dat pro zobrazení produktu
- `getRelatedProducts()` - Jednoduché doporučení souvisejících produktů

### `product-filters.ts`
- `filterProducts()` - Komplexní filtrování produktů
- `sortProducts()` - Řazení produktů
- `calculateProductCounts()` - Agregace pro filtry

### `category-tree.ts`
- Transformace plochého seznamu kategorií na stromovou strukturu
- Utility pro práci s hierarchií kategorií

## State Management

### React Query
- **Query Keys**: Centralizované v `query-keys.ts`
- **Cache Config**: Různé strategie v `cache-config.ts`:
  - `static` - 24h stale, 7d gc (kategorie)
  - `semiStatic` - 1h stale, 24h gc (produkty)
  - `dynamic` - 5m stale, 30m gc (košík)
  - `realtime` - 10s stale, 5m gc

### TanStack Store
- `cart-store.ts` - Lokální state košíku s persistencí
- `region-store.ts` - Vybraný region
- `auth-store.ts` - Autentizační state

## Problémy a doporučení

### 🔴 Hlavní problémy

1. **Duplikace logiky**
   - 2 různé hooky pro kategorie
   - 2 různé způsoby načítání produktů
   - Nekonzistentní použití API klientů

2. **Nejednotné API klienty**
   - Některé hooky používají SDK
   - Jiné používají httpClient
   - `use-all-categories` používá přímo fetch

3. **Chybí centralizace**
   - Transformace produktů je v hooku, ne v utility
   - Není jednotný "ProductService" nebo repository pattern

### ✅ Dobré praktiky

1. **TypeScript** - Důsledné typování
2. **React Query** - Dobrá cache strategie
3. **Separace** - Utils vs hooks vs store

### 💡 Doporučení

1. **Sjednotit API klienty**
   ```typescript
   // Použít buď SDK všude, nebo vytvořit jednotnou API vrstvu
   class ProductAPI {
     static async getProducts(params) { ... }
     static async getProduct(handle) { ... }
   }
   ```

2. **Odstranit duplikace**
   - Smazat `use-all-categories.ts`, použít jen `use-categories.ts`
   - Refaktorovat `use-home-products.ts` aby používal `use-products.ts`

3. **Centralizovat transformace**
   ```typescript
   // product-service.ts
   export const ProductService = {
     transform: (product) => { ... },
     extractDisplayData: (product) => { ... }
   }
   ```

4. **Vytvořit factory pro hooky**
   ```typescript
   // create-data-hook.ts
   export function createDataHook(queryKey, fetcher, options) {
     return () => useQuery({ queryKey, queryFn: fetcher, ...options })
   }
   ```

## Závěr

Frontend má solidní základ s React Query a TypeScript, ale trpí duplikacemi a nejednotností. Hlavní prioritou by mělo být:

1. Sjednocení API klientů
2. Odstranění duplikovaných hooků
3. Centralizace transformační logiky
4. Vytvoření jednotného service layer patternu

Tím se výrazně zlepší developer experience a údržba kódu.