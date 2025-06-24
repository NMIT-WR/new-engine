# Jak pracovat s kategoriemi - průvodce pro vývojáře

## 🎯 Rychlý přehled

Backend obsahuje **580+ kategorií** organizovaných do stromové struktury s až 5 úrovněmi hierarchie.

### Základní struktura:
```
ROOT kategorie (pohlaví nebo obecné)
└── Level 1 (Oblečení, Cyklo, Moto...)
    └── Level 2 (Mikiny, Bundy, Kalhoty...)
        └── Level 3 (Na zip, Přes hlavu...)
            └── Level 4 (specifické podkategorie)
```

## 📋 ROOT kategorie

Existuje **8 hlavních root kategorií** (bez parent_category_id):

| Název | Handle | ID | Typ |
|-------|--------|-----|-----|
| Pánské | `panske` | `pcat_01JYERRCJGHMCBWSWD91X1DKC7` | Gender |
| Dámské | `damske` | `pcat_01JYERRF472Y089AH84CR8G6JZ` | Gender |
| Dětské | `detske` | `pcat_01JYERRHQ0RZVNG6385W59YR8D` | Gender |
| Oblečení | `obleceni-category-347` | `pcat_01JYERRKB1MVNQ4CNHGYYMNGCF` | Obecné |
| Cyklo | `cyklo-category-378` | `pcat_01JYERRKZ0S59AM6S49PP1RMP6` | Obecné |
| Moto | `moto-category-424` | `pcat_01JYERRMVRA45GBAS2E0MPAWQW` | Obecné |
| Snb-Skate | `snb-skate-category-448` | `pcat_01JYERRNAJJ776Y5QJ5WTEGR80` | Obecné |
| Ski | `ski-category-466` | `pcat_01JYERRNNQF5EBA6D38VC25TYT` | Obecné |

## 🔑 Klíčové koncepty

### 1. **mpath (Materialized Path)**
Každá kategorie má `mpath` - cestu přes všechny nadřazené kategorie oddělené tečkami:
```
pcat_01JYERRCJGHMCBWSWD91X1DKC7.pcat_01JYERRCK693SNXR06859VRXHQ.pcat_01JYERRCNJZV96EZRWSHV5C28H
└── Pánské                      └── Oblečení                     └── Mikiny
```

### 2. **Úrovně hierarchie**
- **Level 0**: ROOT kategorie (bez parent_category_id)
- **Level 1**: Hlavní kategorie pod ROOT (Oblečení, Cyklo, Moto...)
- **Level 2**: Podkategorie (Mikiny, Bundy, Kalhoty...)
- **Level 3**: Detailní kategorie (Na zip, Přes hlavu...)
- **Level 4**: Velmi specifické kategorie

### 3. **Handle vs ID**
- **Handle**: URL-friendly název (`mikiny`, `na-zip`)
- **ID**: Unikátní identifikátor (`pcat_01JYERRCNJZV96EZRWSHV5C28H`)

## 📡 API endpointy

### Získat všechny kategorie se stromem:
```bash
GET /store/product-categories?include_descendants_tree=true
```

### Získat konkrétní kategorii:
```bash
GET /store/product-categories/{category_id}
```

### Filtrovat produkty podle kategorie:
```bash
GET /store/products?category_id[]={category_id}
```

### Parametry pro kategorie:
- `limit`: Počet výsledků (max 1000)
- `offset`: Stránkování
- `include_descendants_tree`: Zahrnout celý podstrom
- `parent_category_id`: Filtrovat podle nadřazené kategorie

## 🚀 Praktické příklady

### 1. Získat všechny pánské kategorie:
```javascript
const response = await fetch(
  `${BACKEND_URL}/store/product-categories?parent_category_id=pcat_01JYERRCJGHMCBWSWD91X1DKC7&include_descendants_tree=true`,
  { headers: { 'x-publishable-api-key': PUBLISHABLE_KEY } }
);
```

### 2. Navigace podle handle:
```javascript
// Pro URL: /categories/panske/obleceni/mikiny
const pathSegments = ['panske', 'obleceni', 'mikiny'];

// Najít kategorii podle handle
const findCategoryByPath = (categories, pathSegments) => {
  let current = categories.find(cat => cat.handle === pathSegments[0]);
  
  for (let i = 1; i < pathSegments.length; i++) {
    if (!current?.category_children) break;
    current = current.category_children.find(
      cat => cat.handle === pathSegments[i]
    );
  }
  
  return current;
};
```

### 3. Získat úroveň kategorie z mpath:
```javascript
const getCategoryLevel = (category) => {
  if (!category.mpath) return 0;
  return category.mpath.split('.').length - 1;
};
```

### 4. Vybudovat breadcrumbs:
```javascript
const buildBreadcrumbs = (category, allCategories) => {
  if (!category.mpath) return [category];
  
  const pathIds = category.mpath.split('.');
  return pathIds.map(id => 
    allCategories.find(cat => cat.id === id)
  ).filter(Boolean);
};
```

## 🎨 Routing strategie

### Dynamické cesty:
```
/categories/[...slug]

Příklady:
- /categories/panske
- /categories/panske/obleceni
- /categories/panske/obleceni/mikiny
- /categories/panske/obleceni/mikiny/na-zip
```

### Alternativní přístupy:
1. **Podle ID**: `/category/[id]` - rychlé, ale ne SEO-friendly
2. **Podle handle**: `/c/[handle]` - jednoduché, ale bez hierarchie
3. **Kombinace**: `/c/[id]/[...slug]` - ID pro rychlost, slug pro SEO

## ⚠️ Důležité poznámky

1. **Duplicitní handles**: Některé kategorie mají podobné handles s číselnými příponami (`street`, `street-category-16`). Při hledání podle handle buďte opatrní.

2. **Inactive kategorie**: Zkontrolujte `is_active` před zobrazením kategorie.

3. **Rank**: Kategorie mají `rank` pro řazení na stejné úrovni.

4. **Category children**: Ne všechny kategorie mají `category_children` pole, i když mají potomky. Použijte `include_descendants_tree=true`.

## 📊 Statistiky

- **Celkový počet kategorií**: 580+
- **Maximální hloubka**: 5 úrovní
- **ROOT kategorií**: 8
- **Aktivních kategorií**: většina (zkontrolujte `is_active`)

## 🔧 Utility funkce

### Filtrovat pouze aktivní kategorie:
```javascript
const filterActive = (categories) => 
  categories.filter(cat => cat.is_active);
```

### Seřadit podle rank:
```javascript
const sortByRank = (categories) => 
  [...categories].sort((a, b) => (a.rank || 0) - (b.rank || 0));
```

### Najít všechny kategorie dané úrovně:
```javascript
const getCategoriesByLevel = (categories, level) => 
  categories.filter(cat => {
    if (level === 0) return !cat.parent_category_id;
    if (!cat.mpath) return false;
    return cat.mpath.split('.').length - 1 === level;
  });
```

## 🏃 Quick Start

```javascript
// 1. Načíst všechny kategorie
const { product_categories } = await fetchCategories();

// 2. Najít ROOT kategorie
const rootCategories = product_categories.filter(
  cat => !cat.parent_category_id
);

// 3. Zobrazit strom
const displayTree = (categories, parentId = null, indent = '') => {
  const children = categories
    .filter(cat => cat.parent_category_id === parentId)
    .sort((a, b) => a.rank - b.rank);
    
  children.forEach(child => {
    console.log(`${indent}${child.name} (${child.handle})`);
    displayTree(categories, child.id, indent + '  ');
  });
};

displayTree(product_categories);
```

---

💡 **Pro další informace**: Viz soubory `category-examples.json` a `category-tree-structure.txt` v tomto adresáři.