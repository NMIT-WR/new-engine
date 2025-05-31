# Task List - Frontend Demo App

## 🚨 Chybějící stránky (VYSOKÁ PRIORITA)

### 1. Search Page (/search)
- [ ] Vytvořit `/app/search/page.tsx`
- [ ] Implementovat vyhledávací formulář (použít `search-form` z UI knihovny)
- [ ] Zobrazit výsledky pomocí `product-card` komponent
- [ ] Přidat filtry (kategorie, cena, velikost, barva)
- [ ] Implementovat řazení (cena, název, novinka)
- [ ] Přidat stránkování výsledků

### 2. Cart Page (/cart)
- [ ] Vytvořit `/app/cart/page.tsx`
- [ ] Zobrazit položky v košíku s obrázky a detaily
- [ ] Implementovat změnu množství (`numeric-input`)
- [ ] Možnost odstranit položku
- [ ] Zobrazit celkovou cenu včetně DPH
- [ ] Tlačítko "Pokračovat k pokladně"
- [ ] Prázdný stav košíku

### 3. Login Page (/login)
- [ ] Vytvořit `/app/login/page.tsx`
- [ ] Formulář s email a heslem (`form-input`)
- [ ] "Zapamatovat si mě" checkbox
- [ ] Link na registraci
- [ ] Link "Zapomenuté heslo"
- [ ] Zobrazení chyb (`error-text`)
- [ ] Toast notifikace při úspěchu

### 4. Register Page (/register)
- [ ] Vytvořit `/app/register/page.tsx`
- [ ] Formulář (jméno, email, heslo, potvrzení hesla)
- [ ] Souhlas s podmínkami checkbox
- [ ] Link na přihlášení
- [ ] Validace formuláře
- [ ] Toast notifikace při úspěchu

## 🔧 Vylepšení navigace a funkcionality

### Header vylepšení
- [ ] Přidat navigační odkazy na Sign In/Sign Up tlačítka
- [ ] Přidat ikonu košíku s počtem položek
- [ ] Implementovat mobilní menu (hamburger)
- [ ] Přidat odkaz na vyhledávání

### Mobilní menu
- [ ] Vytvořit mobilní navigaci (drawer/slide-out)
- [ ] Zobrazit všechny kategorie
- [ ] Přidat odkazy na účet a košík
- [ ] Implementovat zavírání po kliknutí

## 📊 Rozšíření dat

### Mock produkty
- [ ] Přidat více produktů do `mock-products.ts` (min. 20-30)
- [ ] Rozšířit o více kategorií (Accessories, Shoes, Bags)
- [ ] Přidat více barevných variant
- [ ] Různé cenové kategorie
- [ ] Přidat slevy a výprodejové ceny
- [ ] Stock status variace (in stock, low stock, out of stock)

### Regiony a měny
- [ ] Implementovat přepínač regionů (EU/US)
- [ ] Zobrazovat správné měny (EUR/USD)
- [ ] Přizpůsobit ceny podle regionu
- [ ] Lokalizace (cs/en)

## 🎨 UI/UX vylepšení

### Product listing
- [ ] Implementovat grid/list view přepínač
- [ ] Rychlý náhled produktu (modal)
- [ ] Lazy loading obrázků
- [ ] Skeleton loading při načítání

### Product detail
- [ ] Galerie obrázků s zoom funkcí
- [ ] Size guide modal
- [ ] Doporučené produkty
- [ ] Nedávno prohlížené produkty
- [ ] Záložka "Oblíbené"

### Obecné
- [ ] Breadcrumb navigace na všech stránkách
- [ ] 404 stránka
- [ ] Loading states
- [ ] Error boundaries

## 🔍 SEO a Performance

- [ ] Meta tagy pro všechny stránky
- [ ] Strukturovaná data pro produkty
- [ ] Sitemap
- [ ] Optimalizace obrázků (next/image)
- [ ] Bundle size optimalizace

## 🧪 Testování

- [ ] Otestovat responsivitu všech stránek
- [ ] Zkontrolovat přístupnost (ARIA labels, keyboard nav)
- [ ] Cross-browser testování
- [ ] Lighthouse audit

## 📝 Dokumentace

- [ ] Aktualizovat README s instrukcemi
- [ ] Dokumentovat API endpoints
- [ ] Přidat screenshoty všech stránek
- [ ] Deployment guide