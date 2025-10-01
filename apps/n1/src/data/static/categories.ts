// Auto-generated file - DO NOT EDIT
// Generated at: 2025-09-30T15:37:52.895Z
// Run 'pnpm run generate:categories' to regenerate
// This version filters out categories without products and adds root_category_id

import type { Category, CategoryTreeNode } from '@/data/static/type'

export interface LeafCategory {
  id: string
  name: string
  handle: string
  parent_category_id: string
  root_category_id: string // NEW: ID of root category
}

export interface LeafParent {
  id: string
  name: string
  handle: string
  children: string[] // Array of direct child category IDs
  leafs: string[] // Array of ALL nested leaf category IDs
}

export interface FilteringStats {
  totalCategoriesBeforeFiltering: number
  totalCategoriesAfterFiltering: number
  categoriesWithDirectProducts: number
  filteredOutCount: number
}

export interface StaticCategoryData {
  allCategories: Category[]
  categoryTree: CategoryTreeNode[]
  rootCategories: Category[]
  categoryMap: Record<string, Category>
  leafCategories: LeafCategory[]
  leafParents: LeafParent[]
  generatedAt: string
  filteringStats: FilteringStats
}

const data: StaticCategoryData = {
  "allCategories": [
    {
      "id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX",
      "name": "Pánské",
      "handle": "panske",
      "parent_category_id": null,
      "root_category_id": null
    },
    {
      "id": "pcat_01K1RB8G1KN4M1GDGNGDHQTZ1D",
      "name": "Oblečení",
      "handle": "obleceni",
      "description": "Pánské oblečení",
      "parent_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8G22NFPVTEJ2NXEK1EB5",
      "name": "Trika a tílka",
      "handle": "trika-a-tilka",
      "description": "Pánská trika a tílka",
      "parent_category_id": "pcat_01K1RB8G1KN4M1GDGNGDHQTZ1D",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8G2KVYFH1P049EASAHMN",
      "name": "Krátké rukávy",
      "handle": "kratke-rukavy",
      "parent_category_id": "pcat_01K1RB8G22NFPVTEJ2NXEK1EB5",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8G322KC5XCT61EPH0750",
      "name": "Dlouhé rukávy",
      "handle": "dlouhe-rukavy",
      "parent_category_id": "pcat_01K1RB8G22NFPVTEJ2NXEK1EB5",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8G3K4AYVXH2FQGK34747",
      "name": "Mikiny",
      "handle": "mikiny",
      "description": "Pánské mikiny",
      "parent_category_id": "pcat_01K1RB8G1KN4M1GDGNGDHQTZ1D",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8G42DZZAM0BEHZ5B1D4R",
      "name": "Na zip",
      "handle": "na-zip",
      "description": "Pánské mikiny na zip",
      "parent_category_id": "pcat_01K1RB8G3K4AYVXH2FQGK34747",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8G4M65DJNZNETQRBGH52",
      "name": "Přes hlavu",
      "handle": "pres-hlavu",
      "description": "Pánské mikiny přes hlavu",
      "parent_category_id": "pcat_01K1RB8G3K4AYVXH2FQGK34747",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8G52K2KF4M0ZJG1NB58W",
      "name": "Bundy",
      "handle": "bundy",
      "description": "Pánské bundy",
      "parent_category_id": "pcat_01K1RB8G1KN4M1GDGNGDHQTZ1D",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8G5K8NAVPNTMFQPNP3ZF",
      "name": "Street",
      "handle": "street",
      "description": "Pánské bundy do města",
      "parent_category_id": "pcat_01K1RB8G52K2KF4M0ZJG1NB58W",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8G63PD8K6JK31CFY4ETC",
      "name": "Zimní",
      "handle": "zimni",
      "description": "Pánské zimní bundy",
      "parent_category_id": "pcat_01K1RB8G52K2KF4M0ZJG1NB58W",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8G6M6WR4F2AKTTPKMDSS",
      "name": "Svetry",
      "handle": "svetry",
      "description": "Pánské svetry",
      "parent_category_id": "pcat_01K1RB8G1KN4M1GDGNGDHQTZ1D",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8G75FEKWR9VYQPJVT0NW",
      "name": "Košile",
      "handle": "kosile",
      "description": "Pánské košile",
      "parent_category_id": "pcat_01K1RB8G1KN4M1GDGNGDHQTZ1D",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8G7KNMHFMKMZ6F1M7WZH",
      "name": "Kalhoty",
      "handle": "kalhoty",
      "description": "Pánské kalhoty",
      "parent_category_id": "pcat_01K1RB8G1KN4M1GDGNGDHQTZ1D",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8G82EJ2WEE85X39HHR83",
      "name": "Street",
      "handle": "street-category-16",
      "description": "Pánské kalhoty pro volný čas",
      "parent_category_id": "pcat_01K1RB8G7KNMHFMKMZ6F1M7WZH",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8G8H6GVT25W97GKGNG9W",
      "name": "Zimní",
      "handle": "zimni-category-17",
      "description": "Pánské zimní kalhoty",
      "parent_category_id": "pcat_01K1RB8G7KNMHFMKMZ6F1M7WZH",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8G92QW3VR24QWG3X2V90",
      "name": "Kraťasy",
      "handle": "kratasy",
      "description": "Pánské kraťasy",
      "parent_category_id": "pcat_01K1RB8G1KN4M1GDGNGDHQTZ1D",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8G9MKY3GT59NYCFVC4R8",
      "name": "Plavky",
      "handle": "plavky",
      "description": "Pánské plavky",
      "parent_category_id": "pcat_01K1RB8G1KN4M1GDGNGDHQTZ1D",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8GA382EKWBZBGY64WHGW",
      "name": "Doplňky",
      "handle": "doplnky",
      "description": "Pánské doplňky",
      "parent_category_id": "pcat_01K1RB8G1KN4M1GDGNGDHQTZ1D",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8GAHR8NYK9BC3KASR4TC",
      "name": "Boty",
      "handle": "boty",
      "description": "Pánské boty",
      "parent_category_id": "pcat_01K1RB8GA382EKWBZBGY64WHGW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8GAYPB72R9KN75S4SZ5Z",
      "name": "Street",
      "handle": "street-category-22",
      "description": "Pánské boty",
      "parent_category_id": "pcat_01K1RB8GAHR8NYK9BC3KASR4TC",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8GBDNM6T8B74ZZDQKTMF",
      "name": "Žabky",
      "handle": "zabky",
      "description": "Pánské žabky",
      "parent_category_id": "pcat_01K1RB8GAHR8NYK9BC3KASR4TC",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8GBTSEZ2X43HXQVJF0F8",
      "name": "Kulichy",
      "handle": "kulichy",
      "description": "Pánské kulichy",
      "parent_category_id": "pcat_01K1RB8GA382EKWBZBGY64WHGW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8GCB3VC2KXQ47C4S8XJB",
      "name": "Kšiltovky",
      "handle": "ksiltovky",
      "description": "Pánské kšiltovky",
      "parent_category_id": "pcat_01K1RB8GA382EKWBZBGY64WHGW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8GCXR2KT7HA2AH6QHFSW",
      "name": "Tašky a batohy",
      "handle": "tasky-a-batohy",
      "description": "Pánské batohy",
      "parent_category_id": "pcat_01K1RB8GA382EKWBZBGY64WHGW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8GDF8KRHJP985HFVDVJY",
      "name": "Rukavice",
      "handle": "rukavice",
      "description": "Pánské rukavice",
      "parent_category_id": "pcat_01K1RB8GA382EKWBZBGY64WHGW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8GDYGRRY1FC8XC9VW7YN",
      "name": "Ponožky",
      "handle": "ponozky",
      "description": "Pánské ponožky",
      "parent_category_id": "pcat_01K1RB8GA382EKWBZBGY64WHGW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8GED44F5AB7DSKA7BAEW",
      "name": "Pásky",
      "handle": "pasky",
      "description": "Pánské pásky",
      "parent_category_id": "pcat_01K1RB8GA382EKWBZBGY64WHGW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8GEYH8M3VFAXD9GHZDBY",
      "name": "Peněženky",
      "handle": "penezenky",
      "description": "Pánské peněženky",
      "parent_category_id": "pcat_01K1RB8GA382EKWBZBGY64WHGW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8GFDEV8T7MVX6TBBJK0H",
      "name": "Sluneční brýle",
      "handle": "slunecni-bryle",
      "description": "Pánské sluneční brýle",
      "parent_category_id": "pcat_01K1RB8GA382EKWBZBGY64WHGW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8GFY3E8FZ8S01K65WF8C",
      "name": "Ostatní",
      "handle": "ostatni",
      "description": "Ostatní doplňky",
      "parent_category_id": "pcat_01K1RB8GA382EKWBZBGY64WHGW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8GGEPF2Z2SWD3TDTTC5A",
      "name": "Cyklo",
      "handle": "cyklo",
      "description": "Pánská cyklistika",
      "parent_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8GGZS38QWGYDGVFZVQWS",
      "name": "Oblečení",
      "handle": "obleceni-category-34",
      "description": "Pánské cyklo oblečení",
      "parent_category_id": "pcat_01K1RB8GGEPF2Z2SWD3TDTTC5A",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8GKB3RJ1A240CWNBHCWX",
      "name": "Kalhoty",
      "handle": "kalhoty-category-39",
      "description": "Pánské cyklo kalhoty",
      "parent_category_id": "pcat_01K1RB8GGZS38QWGYDGVFZVQWS",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8GKTGCW2QABQ9CD1V5T7",
      "name": "XC/DH (volné)",
      "handle": "xc-dh-volne",
      "description": "Pánské cyklo kalhoty XC/DH",
      "parent_category_id": "pcat_01K1RB8GKB3RJ1A240CWNBHCWX",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8GRDSR99AZSHQQWNHYNH",
      "name": "Ponožky",
      "handle": "ponozky-category-49",
      "description": "Pánské cyklo ponožky",
      "parent_category_id": "pcat_01K1RB8GGZS38QWGYDGVFZVQWS",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8GSWXHCZZGDY3XGJG99G",
      "name": "Doplňky",
      "handle": "doplnky-category-52",
      "description": "Cyklistické doplňky",
      "parent_category_id": "pcat_01K1RB8GGZS38QWGYDGVFZVQWS",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8GVBNK4XVFCVQNP1FSK7",
      "name": "Ostatní",
      "handle": "ostatni-category-55",
      "description": "Ostatní doplňky",
      "parent_category_id": "pcat_01K1RB8GSWXHCZZGDY3XGJG99G",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8H6C4NCW44SKVHF9G21B",
      "name": "Moto",
      "handle": "moto",
      "description": "Pánské moto vybavení",
      "parent_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8HG8ES3FY7871PEY71A1",
      "name": "Doplňky",
      "handle": "doplnky-category-98",
      "description": "Pánské moto doplňky",
      "parent_category_id": "pcat_01K1RB8H6C4NCW44SKVHF9G21B",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8HH87HQG6456G9V2EDN6",
      "name": "Ostatní",
      "handle": "ostatni-category-100",
      "description": "Ostatní moto doplňky",
      "parent_category_id": "pcat_01K1RB8HG8ES3FY7871PEY71A1",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8HJ89KCYN54F4AZ0N1YS",
      "name": "Snb-Skate",
      "handle": "snb-skate",
      "description": "Pánský snowboarding a skateboarding",
      "parent_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8HJQTH3Z7NQHDVNKW4NW",
      "name": "Snowboarding",
      "handle": "snowboarding",
      "description": "Pánský snowboarding",
      "parent_category_id": "pcat_01K1RB8HJ89KCYN54F4AZ0N1YS",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8HNNTJ4RFTZK38KE12GW",
      "name": "Bundy",
      "handle": "bundy-category-109",
      "description": "Pánské zimní bundy",
      "parent_category_id": "pcat_01K1RB8HJQTH3Z7NQHDVNKW4NW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8HP4NX291QW6JV5M74GR",
      "name": "Kalhoty",
      "handle": "kalhoty-category-110",
      "description": "Pánské zimní kalhoty",
      "parent_category_id": "pcat_01K1RB8HJQTH3Z7NQHDVNKW4NW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8HPKCS46X8FDTDYS9R3H",
      "name": "Rukavice",
      "handle": "rukavice-category-111",
      "description": "Pánské zimní rukavice",
      "parent_category_id": "pcat_01K1RB8HJQTH3Z7NQHDVNKW4NW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8HQ0JK3PXSZ0TFWQ54H6",
      "name": "Kulichy",
      "handle": "kulichy-category-112",
      "description": "Pánské zimní kulichy",
      "parent_category_id": "pcat_01K1RB8HJQTH3Z7NQHDVNKW4NW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8HTCNMB33QK2C7NJR5ZW",
      "name": "Ski",
      "handle": "ski",
      "description": "Pánské vybavení pro lyžaře",
      "parent_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8HTVJH9W5NE6SQSSDQBN",
      "name": "Oblečení",
      "handle": "obleceni-category-120",
      "description": "Pánské zimní oblečení",
      "parent_category_id": "pcat_01K1RB8HTCNMB33QK2C7NJR5ZW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8HVATG7AJYP99Y83B0YA",
      "name": "Bundy",
      "handle": "bundy-category-121",
      "description": "Pánské zimní bundy",
      "parent_category_id": "pcat_01K1RB8HTVJH9W5NE6SQSSDQBN",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8HVSWXAWST5R680TKG5A",
      "name": "Kalhoty",
      "handle": "kalhoty-category-122",
      "description": "Pánské zimní kalhoty",
      "parent_category_id": "pcat_01K1RB8HTVJH9W5NE6SQSSDQBN",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8HWC2789BSH9VV94QD40",
      "name": "Rukavice",
      "handle": "rukavice-category-123",
      "description": "Pánské zimní rukavice",
      "parent_category_id": "pcat_01K1RB8HTVJH9W5NE6SQSSDQBN",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8HWX662Q6SQQBWQSKXCR",
      "name": "Kulichy",
      "handle": "kulichy-category-124",
      "description": "Pánské zimní kulichy",
      "parent_category_id": "pcat_01K1RB8HTVJH9W5NE6SQSSDQBN",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8HXVKPVAXN5KBJWH46QA",
      "name": "Doplňky",
      "handle": "doplnky-category-126",
      "description": "Pánské zimní doplňky",
      "parent_category_id": "pcat_01K1RB8HTCNMB33QK2C7NJR5ZW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8J0699NT92CG6NBK3H9M",
      "name": "Batohy",
      "handle": "batohy",
      "description": "Pánské batohy",
      "parent_category_id": "pcat_01K1RB8HXVKPVAXN5KBJWH46QA",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8J0QHSR8AB4C0W3CAVKP",
      "name": "Sluneční brýle",
      "handle": "slunecni-bryle-category-132",
      "description": "Pánské sluneční brýle",
      "parent_category_id": "pcat_01K1RB8HXVKPVAXN5KBJWH46QA",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V",
      "name": "Dámské",
      "handle": "damske",
      "parent_category_id": null,
      "root_category_id": null
    },
    {
      "id": "pcat_01K1RB8J1Q7BEA61JK1ZNCW1NA",
      "name": "Oblečení",
      "handle": "obleceni-category-134",
      "description": "Dámské oblečení",
      "parent_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8J26341CPGHSEB6FQZH9",
      "name": "Trika a tílka",
      "handle": "trika-a-tilka-category-135",
      "description": "Dámská trika a tílka",
      "parent_category_id": "pcat_01K1RB8J1Q7BEA61JK1ZNCW1NA",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8J2KZTCKVCWDNTDE33T4",
      "name": "Krátké rukávy",
      "handle": "kratke-rukavy-category-136",
      "description": "Dámská trika s krátkými rukávy",
      "parent_category_id": "pcat_01K1RB8J26341CPGHSEB6FQZH9",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8J349N2WC10BC1A1XZBH",
      "name": "Dlouhé rukávy",
      "handle": "dlouhe-rukavy-category-137",
      "description": "Dámská trika s dlouhými rukávy",
      "parent_category_id": "pcat_01K1RB8J26341CPGHSEB6FQZH9",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8J3J4P3W6FNG3PPVETN9",
      "name": "Mikiny",
      "handle": "mikiny-category-138",
      "description": "Dámské mikiny",
      "parent_category_id": "pcat_01K1RB8J1Q7BEA61JK1ZNCW1NA",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8J44XAVF7ZMBVP0CS1PX",
      "name": "Na zip",
      "handle": "na-zip-category-139",
      "description": "Dámské mikiny na zip",
      "parent_category_id": "pcat_01K1RB8J3J4P3W6FNG3PPVETN9",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8J4JNFATW8H1DSXHXBVZ",
      "name": "Přes hlavu",
      "handle": "pres-hlavu-category-140",
      "description": "Dámské mikiny přes hlavu",
      "parent_category_id": "pcat_01K1RB8J3J4P3W6FNG3PPVETN9",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8J50WM9DWJ515NBRNTBC",
      "name": "Bundy",
      "handle": "bundy-category-141",
      "description": "Dámské bundy",
      "parent_category_id": "pcat_01K1RB8J1Q7BEA61JK1ZNCW1NA",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8J5DTJFSRXBE4RXG43WP",
      "name": "Street",
      "handle": "street-category-142",
      "description": "Dámské bundy pro volný čas",
      "parent_category_id": "pcat_01K1RB8J50WM9DWJ515NBRNTBC",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8J5ZK4EJBCHHGKVV1WQZ",
      "name": "Zimní",
      "handle": "zimni-category-143",
      "description": "Dámské zimní bundy",
      "parent_category_id": "pcat_01K1RB8J50WM9DWJ515NBRNTBC",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8J6EGSN0QE2B0AXZ4SKC",
      "name": "Svetry",
      "handle": "svetry-category-144",
      "description": "Dámské svetry",
      "parent_category_id": "pcat_01K1RB8J1Q7BEA61JK1ZNCW1NA",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8J6Y2KT8CW2RQ16JG1PE",
      "name": "Košile",
      "handle": "kosile-category-145",
      "description": "Dámské košile",
      "parent_category_id": "pcat_01K1RB8J1Q7BEA61JK1ZNCW1NA",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8J7DW042RTPWCBVBXH53",
      "name": "Kalhoty",
      "handle": "kalhoty-category-146",
      "description": "Dámské kalhoty",
      "parent_category_id": "pcat_01K1RB8J1Q7BEA61JK1ZNCW1NA",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8J7WB2Q9V7HWG4D3CESP",
      "name": "Street",
      "handle": "street-category-147",
      "description": "Dámské kalhoty pro volný čas",
      "parent_category_id": "pcat_01K1RB8J7DW042RTPWCBVBXH53",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8J8DZSB3KNT8XCMPVAQC",
      "name": "Zimní",
      "handle": "zimni-category-148",
      "description": "Dámské zimní kalhoty",
      "parent_category_id": "pcat_01K1RB8J7DW042RTPWCBVBXH53",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8J8Y0PR4GBPFT19ET0SV",
      "name": "Kraťasy",
      "handle": "kratasy-category-149",
      "description": "Dámské šortky",
      "parent_category_id": "pcat_01K1RB8J1Q7BEA61JK1ZNCW1NA",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8J9F9RPEJJ23Z8KA4AJW",
      "name": "Plavky",
      "handle": "plavky-category-150",
      "description": "Dámské plavky",
      "parent_category_id": "pcat_01K1RB8J1Q7BEA61JK1ZNCW1NA",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8J9YCTA5RKQMSVVGMDS4",
      "name": "Šaty a sukně",
      "handle": "saty-a-sukne",
      "description": "Dámské šaty a sukně",
      "parent_category_id": "pcat_01K1RB8J1Q7BEA61JK1ZNCW1NA",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JADGFFJXSHEAYP9A8T2",
      "name": "Doplňky",
      "handle": "doplnky-category-152",
      "description": "Dámské doplňky",
      "parent_category_id": "pcat_01K1RB8J1Q7BEA61JK1ZNCW1NA",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JAWN8MFBXGSRMG5VGR3",
      "name": "Boty",
      "handle": "boty-category-153",
      "description": "Dámské boty",
      "parent_category_id": "pcat_01K1RB8JADGFFJXSHEAYP9A8T2",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JBWKBDHPA3GEVV1V5YC",
      "name": "Žabky",
      "handle": "zabky-category-155",
      "description": "Dámské žabky a sandály",
      "parent_category_id": "pcat_01K1RB8JAWN8MFBXGSRMG5VGR3",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JCD4R0NKCWRP16B19J5",
      "name": "Kulichy",
      "handle": "kulichy-category-156",
      "description": "Dámské kulichy",
      "parent_category_id": "pcat_01K1RB8JADGFFJXSHEAYP9A8T2",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JCWQDMKYZZTWDF30J7B",
      "name": "Kšiltovky",
      "handle": "ksiltovky-category-157",
      "description": "Dámské kšiltovky",
      "parent_category_id": "pcat_01K1RB8JADGFFJXSHEAYP9A8T2",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JDEJR7FW9PY3MSG9NGQ",
      "name": "Tašky a batohy",
      "handle": "tasky-a-batohy-category-158",
      "description": "Dámské batohy a kabelky",
      "parent_category_id": "pcat_01K1RB8JADGFFJXSHEAYP9A8T2",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JDWRFRBQQ6KDQKB1WP2",
      "name": "Rukavice",
      "handle": "rukavice-category-159",
      "description": "Dámské rukavice",
      "parent_category_id": "pcat_01K1RB8JADGFFJXSHEAYP9A8T2",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JENFMRDS6E7PTXYEACW",
      "name": "Ponožky",
      "handle": "ponozky-category-160",
      "description": "Dámské ponožky",
      "parent_category_id": "pcat_01K1RB8JADGFFJXSHEAYP9A8T2",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JG7HQHHG8A25R9K7HKC",
      "name": "Sluneční brýle",
      "handle": "slunecni-bryle-category-163",
      "description": "Dámské sluneční brýle",
      "parent_category_id": "pcat_01K1RB8JADGFFJXSHEAYP9A8T2",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JGNFW4SKT22RM2ME8X9",
      "name": "Ostatní",
      "handle": "ostatni-category-164",
      "description": "Ostatní doplňky",
      "parent_category_id": "pcat_01K1RB8JADGFFJXSHEAYP9A8T2",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JH43Y80Y0599VB4NWZ5",
      "name": "Cyklo",
      "handle": "cyklo-category-165",
      "description": "Dámská cyklistika",
      "parent_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JHQMMXK70R6JGCSFE5H",
      "name": "Oblečení",
      "handle": "obleceni-category-166",
      "description": "Dámské cyklo oblečení",
      "parent_category_id": "pcat_01K1RB8JH43Y80Y0599VB4NWZ5",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JKHB9RJQWYPRW51QCY1",
      "name": "Bundy",
      "handle": "bundy-category-170",
      "description": "Dámské cyklo bundy",
      "parent_category_id": "pcat_01K1RB8JHQMMXK70R6JGCSFE5H",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JNJ50AYCQ72T5SAP90W",
      "name": "Kraťasy",
      "handle": "kratasy-category-174",
      "description": "Dámské cyklo kraťasy",
      "parent_category_id": "pcat_01K1RB8JHQMMXK70R6JGCSFE5H",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JP3B26C5CR1SWXYWPGM",
      "name": "XC/DH (volné)",
      "handle": "xc-dh-volne-category-175",
      "description": "Dámské cyklo šortky volné",
      "parent_category_id": "pcat_01K1RB8JNJ50AYCQ72T5SAP90W",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JPJD29HFJ0QS52V9M4X",
      "name": "Bib (elastické)",
      "handle": "bib-elasticke-category-176",
      "description": "Dámské cyklo šortky elastické",
      "parent_category_id": "pcat_01K1RB8JNJ50AYCQ72T5SAP90W",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JQ06DHD9SQK1W12HMD8",
      "name": "Rukavice",
      "handle": "rukavice-category-177",
      "description": "Dámské cyklo rukavice",
      "parent_category_id": "pcat_01K1RB8JHQMMXK70R6JGCSFE5H",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JQJ6EYA4V4V73VFDACS",
      "name": "Dlouhé",
      "handle": "dlouhe-category-178",
      "description": "Dámské cyklo rukavice dlouhé",
      "parent_category_id": "pcat_01K1RB8JQ06DHD9SQK1W12HMD8",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JR1ES9GX5Z7NPGR511N",
      "name": "Krátké",
      "handle": "kratke-category-179",
      "description": "Dámské cyklo rukavice krátké",
      "parent_category_id": "pcat_01K1RB8JQ06DHD9SQK1W12HMD8",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JS0W97FTTXF8CP2Y1VN",
      "name": "Ponožky",
      "handle": "ponozky-category-181",
      "description": "Dámské cyklo ponožky",
      "parent_category_id": "pcat_01K1RB8JHQMMXK70R6JGCSFE5H",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JTJV3Y5NMEPSY16MNDQ",
      "name": "Doplňky",
      "handle": "doplnky-category-184",
      "description": "Dámské cyklo doplňky",
      "parent_category_id": "pcat_01K1RB8JHQMMXK70R6JGCSFE5H",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JW0Q2TQGE0YTZ6C8JMA",
      "name": "Ostatní",
      "handle": "ostatni-category-187",
      "description": "Ostatní doplňky",
      "parent_category_id": "pcat_01K1RB8JTJV3Y5NMEPSY16MNDQ",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8KJ8AFR3ENNMEK6YTJX8",
      "name": "Snb-Skate",
      "handle": "snb-skate-category-233",
      "description": "Dámský snowboarding a skateboarding",
      "parent_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8KJSNPKQPFKMK8QCJQYZ",
      "name": "Snowboarding",
      "handle": "snowboarding-category-234",
      "description": "Dámský snowboarding",
      "parent_category_id": "pcat_01K1RB8KJ8AFR3ENNMEK6YTJX8",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8KNVFF0PMD55Z5XB5469",
      "name": "Bundy",
      "handle": "bundy-category-240",
      "description": "Dámské zimní bundy",
      "parent_category_id": "pcat_01K1RB8KJSNPKQPFKMK8QCJQYZ",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8KPAZQ509BGGAZXWB2NM",
      "name": "Kalhoty",
      "handle": "kalhoty-category-241",
      "description": "Dámské zimní kalhoty",
      "parent_category_id": "pcat_01K1RB8KJSNPKQPFKMK8QCJQYZ",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8KPS9ZHXD3K5VAD87QBF",
      "name": "Rukavice",
      "handle": "rukavice-category-242",
      "description": "Dámské zimní rukavice",
      "parent_category_id": "pcat_01K1RB8KJSNPKQPFKMK8QCJQYZ",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8KQAGZ7B6WT4Q9G4Y91V",
      "name": "Kulichy",
      "handle": "kulichy-category-243",
      "description": "Dámské zimní kulichy",
      "parent_category_id": "pcat_01K1RB8KJSNPKQPFKMK8QCJQYZ",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8KVCXVAG3N85BSYPGHKC",
      "name": "Ski",
      "handle": "ski-category-251",
      "description": "Dámské vybavení pro lyžaře",
      "parent_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8KVWCJAXBDDPR1H3T9V0",
      "name": "Oblečení",
      "handle": "obleceni-category-252",
      "description": "Dámské zimní oblečení",
      "parent_category_id": "pcat_01K1RB8KVCXVAG3N85BSYPGHKC",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8KWE2JPGPDQVFH0BCKT9",
      "name": "Bundy",
      "handle": "bundy-category-253",
      "description": "Dámské zimní bundy",
      "parent_category_id": "pcat_01K1RB8KVWCJAXBDDPR1H3T9V0",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8KWXS5316M51TZYW26YW",
      "name": "Kalhoty",
      "handle": "kalhoty-category-254",
      "description": "Dámské zimní kalhoty",
      "parent_category_id": "pcat_01K1RB8KVWCJAXBDDPR1H3T9V0",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8KXA7E1RFCZ9HAV36NNB",
      "name": "Rukavice",
      "handle": "rukavice-category-255",
      "description": "Dámské zimní rukavice",
      "parent_category_id": "pcat_01K1RB8KVWCJAXBDDPR1H3T9V0",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8KXS5F3ZB4JDXD9NDMPY",
      "name": "Kulichy",
      "handle": "kulichy-category-256",
      "description": "Dámské zimní kulichy",
      "parent_category_id": "pcat_01K1RB8KVWCJAXBDDPR1H3T9V0",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8KYPA0P85FKQ2NPYVCS5",
      "name": "Doplňky",
      "handle": "doplnky-category-258",
      "description": "Dámské zimní doplňky",
      "parent_category_id": "pcat_01K1RB8KVCXVAG3N85BSYPGHKC",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8M1ATZG7Y7R2KFWPMSN5",
      "name": "Batohy",
      "handle": "batohy-category-263",
      "description": "Dámské batohy",
      "parent_category_id": "pcat_01K1RB8KYPA0P85FKQ2NPYVCS5",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8M1S12PRYAEQ5S45W22E",
      "name": "Sluneční brýle",
      "handle": "slunecni-bryle-category-264",
      "description": "Dámské sluneční brýle",
      "parent_category_id": "pcat_01K1RB8KYPA0P85FKQ2NPYVCS5",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8",
      "name": "Dětské",
      "handle": "detske",
      "parent_category_id": null,
      "root_category_id": null
    },
    {
      "id": "pcat_01K1RB8M2V65T9Q08MCZ0DAHW3",
      "name": "Oblečení",
      "handle": "obleceni-category-266",
      "description": "Dětské oblečení",
      "parent_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8M3ABD3W1HJDDH77QTK9",
      "name": "Trika a tílka",
      "handle": "trika-a-tilka-category-267",
      "description": "Dětská trička",
      "parent_category_id": "pcat_01K1RB8M2V65T9Q08MCZ0DAHW3",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8M3V3BZFQZVZSAK5PXY0",
      "name": "Krátké rukávy",
      "handle": "kratke-rukavy-category-268",
      "description": "Dětská trička s krátkými rukávy",
      "parent_category_id": "pcat_01K1RB8M3ABD3W1HJDDH77QTK9",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8M4ANEVV7381SPNDHSMJ",
      "name": "Dlouhé rukávy",
      "handle": "dlouhe-rukavy-category-269",
      "description": "Dětská trička s dlouhými rukávy",
      "parent_category_id": "pcat_01K1RB8M3ABD3W1HJDDH77QTK9",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8M4SVFDX4VW001M0TQ7Z",
      "name": "Mikiny",
      "handle": "mikiny-category-270",
      "description": "Dětské mikiny",
      "parent_category_id": "pcat_01K1RB8M2V65T9Q08MCZ0DAHW3",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8M5TQE14SMWM6S7VAP5A",
      "name": "Přes hlavu",
      "handle": "pres-hlavu-category-272",
      "description": "Dětské mikiny přes hlavu",
      "parent_category_id": "pcat_01K1RB8M4SVFDX4VW001M0TQ7Z",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8M69E5FWCSEB0PPWGX94",
      "name": "Bundy",
      "handle": "bundy-category-273",
      "description": "Dětské bundy",
      "parent_category_id": "pcat_01K1RB8M2V65T9Q08MCZ0DAHW3",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8M6Q6M3XTJ47TCCZ2E93",
      "name": "Street",
      "handle": "street-category-274",
      "description": "Dětské bundy pro volný čas",
      "parent_category_id": "pcat_01K1RB8M69E5FWCSEB0PPWGX94",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8M76KEN6R6XMA7NWNQZ4",
      "name": "Zimní",
      "handle": "zimni-category-275",
      "description": "Dětské zimní bundy",
      "parent_category_id": "pcat_01K1RB8M69E5FWCSEB0PPWGX94",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8M7NT8A13DGAN2H9A7YJ",
      "name": "Kalhoty",
      "handle": "kalhoty-category-276",
      "description": "Dětské kalhoty",
      "parent_category_id": "pcat_01K1RB8M2V65T9Q08MCZ0DAHW3",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8M84R3F4YXNHSTBQCCB2",
      "name": "Street",
      "handle": "street-category-277",
      "description": "Dětské kalhoty pro volný čas",
      "parent_category_id": "pcat_01K1RB8M7NT8A13DGAN2H9A7YJ",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8M8N4FM3AY51A99FFVC4",
      "name": "Zimní",
      "handle": "zimni-category-278",
      "description": "Dětské zimní kalhoty",
      "parent_category_id": "pcat_01K1RB8M7NT8A13DGAN2H9A7YJ",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8M981EYEMCJPJFK3M4Z0",
      "name": "Kraťasy",
      "handle": "kratasy-category-279",
      "description": "Dětské kraťasy",
      "parent_category_id": "pcat_01K1RB8M2V65T9Q08MCZ0DAHW3",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8M9QQXT1XF4WR1JYVJ2T",
      "name": "Plavky",
      "handle": "plavky-category-280",
      "description": "Dětské plavky",
      "parent_category_id": "pcat_01K1RB8M2V65T9Q08MCZ0DAHW3",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8MA6N7BK5DTQH87ENA2Y",
      "name": "Doplňky",
      "handle": "doplnky-category-281",
      "description": "Dětské doplňky",
      "parent_category_id": "pcat_01K1RB8M2V65T9Q08MCZ0DAHW3",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8MAS5PX17DREZTWX98HY",
      "name": "Boty",
      "handle": "boty-category-282",
      "description": "Dětské boty",
      "parent_category_id": "pcat_01K1RB8MA6N7BK5DTQH87ENA2Y",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8MB6YTGE50Y76E8H21HR",
      "name": "Kulichy",
      "handle": "kulichy-category-283",
      "description": "Dětské kulichy",
      "parent_category_id": "pcat_01K1RB8MA6N7BK5DTQH87ENA2Y",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8MBNWA70QYKEMH7H2WJX",
      "name": "Kšiltovky",
      "handle": "ksiltovky-category-284",
      "description": "Dětské kšiltovky",
      "parent_category_id": "pcat_01K1RB8MA6N7BK5DTQH87ENA2Y",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8MC6RP6BB60ZZZZCBMQK",
      "name": "Rukavice",
      "handle": "rukavice-category-285",
      "description": "Dětské rukavice",
      "parent_category_id": "pcat_01K1RB8MA6N7BK5DTQH87ENA2Y",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8MD7R883PNKHYEZ1J659",
      "name": "Ostatní",
      "handle": "ostatni-category-287",
      "description": "Ostatní doplňky",
      "parent_category_id": "pcat_01K1RB8MA6N7BK5DTQH87ENA2Y",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8MZ5FJCTF87D7MD5XZJ0",
      "name": "Snb-Skate",
      "handle": "snb-skate-category-323",
      "description": "Dětský skateboarding a snowboarding",
      "parent_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8MZN3T4V66NEAKX9PV9X",
      "name": "Snowboarding",
      "handle": "snowboarding-category-324",
      "description": "Dětský snowboarding",
      "parent_category_id": "pcat_01K1RB8MZ5FJCTF87D7MD5XZJ0",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8N2HA00C869DRPHQD0ZM",
      "name": "Bundy",
      "handle": "bundy-category-330",
      "description": "Dětské zimní bundy",
      "parent_category_id": "pcat_01K1RB8MZN3T4V66NEAKX9PV9X",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8N30MECRNYV0N1Q2RBRA",
      "name": "Kalhoty",
      "handle": "kalhoty-category-331",
      "description": "Dětské zimní kalhoty",
      "parent_category_id": "pcat_01K1RB8MZN3T4V66NEAKX9PV9X",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8N3FJ31VKM1DJAM6SQHA",
      "name": "Rukavice",
      "handle": "rukavice-category-332",
      "description": "Dětské zimní rukavice",
      "parent_category_id": "pcat_01K1RB8MZN3T4V66NEAKX9PV9X",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8N400MPJPYD72TV1E8GB",
      "name": "Kulichy",
      "handle": "kulichy-category-333",
      "description": "Dětské kulichy",
      "parent_category_id": "pcat_01K1RB8MZN3T4V66NEAKX9PV9X",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8N5CT9KCN8N5HWDFHGTJ",
      "name": "Ski",
      "handle": "ski-category-336",
      "description": "Dětské vybavení pro lyžaře",
      "parent_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8N5TM4PQRVH7A0R3Z422",
      "name": "Oblečení",
      "handle": "obleceni-category-337",
      "description": "Dětské zimní oblečení",
      "parent_category_id": "pcat_01K1RB8N5CT9KCN8N5HWDFHGTJ",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8N69MHDJ8XZS50AR8N7Z",
      "name": "Bundy",
      "handle": "bundy-category-338",
      "description": "Dětské zimní bundy",
      "parent_category_id": "pcat_01K1RB8N5TM4PQRVH7A0R3Z422",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8N6WMWY1424JTBS3XR55",
      "name": "Kalhoty",
      "handle": "kalhoty-category-339",
      "description": "Dětské zimní kalhoty",
      "parent_category_id": "pcat_01K1RB8N5TM4PQRVH7A0R3Z422",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8N7GA2N5AJDW5M1734KJ",
      "name": "Rukavice",
      "handle": "rukavice-category-340",
      "description": "Dětské zimní rukavice",
      "parent_category_id": "pcat_01K1RB8N5TM4PQRVH7A0R3Z422",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8N85RD1EEF80JZW4SQ6E",
      "name": "Kulichy",
      "handle": "kulichy-category-341",
      "description": "Dětské zimní kulichy",
      "parent_category_id": "pcat_01K1RB8N5TM4PQRVH7A0R3Z422",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH",
      "name": "Oblečení",
      "handle": "obleceni-category-347",
      "parent_category_id": null,
      "root_category_id": null
    },
    {
      "id": "pcat_01K1RB8NBSQ39G72J5E3SENF7K",
      "name": "Trika a tílka",
      "handle": "trika-a-tilka-category-348",
      "parent_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NC71VA05V7PQC5ZPQKJ",
      "name": "Krátké rukávy",
      "handle": "kratke-rukavy-category-349",
      "description": "Trika s krátkými rukávy",
      "parent_category_id": "pcat_01K1RB8NBSQ39G72J5E3SENF7K",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NCPJ9X4NAA9DFT1RAS5",
      "name": "Dlouhé rukávy",
      "handle": "dlouhe-rukavy-category-350",
      "description": "Trika s dlouhými rukávy",
      "parent_category_id": "pcat_01K1RB8NBSQ39G72J5E3SENF7K",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8ND8B29HDGCZ349NM632",
      "name": "Mikiny",
      "handle": "mikiny-category-351",
      "parent_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NDSY4KAVFFQVRNP2KAD",
      "name": "Na zip",
      "handle": "na-zip-category-352",
      "description": "Mikiny na zip",
      "parent_category_id": "pcat_01K1RB8ND8B29HDGCZ349NM632",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NEB67KSN2VHMBT1XNX7",
      "name": "Přes hlavu",
      "handle": "pres-hlavu-category-353",
      "description": "Mikiny přes hlavu",
      "parent_category_id": "pcat_01K1RB8ND8B29HDGCZ349NM632",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NEXMD6RSK1CGG87C181",
      "name": "Bundy",
      "handle": "bundy-category-354",
      "parent_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NFE134QRXKQF9KNK28B",
      "name": "Street",
      "handle": "street-category-355",
      "parent_category_id": "pcat_01K1RB8NEXMD6RSK1CGG87C181",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NFX27RB9VYAD56GGEAQ",
      "name": "Zimní",
      "handle": "zimni-category-356",
      "parent_category_id": "pcat_01K1RB8NEXMD6RSK1CGG87C181",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NGE2SFRGFA86DE4D9ZP",
      "name": "Svetry",
      "handle": "svetry-category-357",
      "parent_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NH0F36WEX2E8B2SYCM7",
      "name": "Košile",
      "handle": "kosile-category-358",
      "parent_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NHEXW9WKYHF80S97KDM",
      "name": "Kalhoty",
      "handle": "kalhoty-category-359",
      "parent_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NHXCGCK5HSE4AJZDW7D",
      "name": "Street",
      "handle": "street-category-360",
      "parent_category_id": "pcat_01K1RB8NHEXW9WKYHF80S97KDM",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NJDPKTC2B04RMHG7R3N",
      "name": "Zimní",
      "handle": "zimni-category-361",
      "parent_category_id": "pcat_01K1RB8NHEXW9WKYHF80S97KDM",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NJXBPCGP1KWQ3Y2FBQ6",
      "name": "Kraťasy",
      "handle": "kratasy-category-362",
      "parent_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NKC9HCMYHN07ZQQEJJC",
      "name": "Plavky",
      "handle": "plavky-category-363",
      "parent_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NKWNC7D303770YS2K0E",
      "name": "Doplňky",
      "handle": "doplnky-category-364",
      "parent_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NMA1FXYQ3MXGPH4R9EV",
      "name": "Boty",
      "handle": "boty-category-365",
      "parent_category_id": "pcat_01K1RB8NKWNC7D303770YS2K0E",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NMVY99XGBKDR7G0BHPX",
      "name": "Street",
      "handle": "street-category-366",
      "parent_category_id": "pcat_01K1RB8NMA1FXYQ3MXGPH4R9EV",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NNA02G0XSYX53AJME1F",
      "name": "Žabky",
      "handle": "zabky-category-367",
      "parent_category_id": "pcat_01K1RB8NMA1FXYQ3MXGPH4R9EV",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NNV4Z3GTQH30V97KYM3",
      "name": "Kulichy",
      "handle": "kulichy-category-368",
      "parent_category_id": "pcat_01K1RB8NKWNC7D303770YS2K0E",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NPAHV74FE2NV2YZNCVF",
      "name": "Kšiltovky",
      "handle": "ksiltovky-category-369",
      "parent_category_id": "pcat_01K1RB8NKWNC7D303770YS2K0E",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NPVJRWP76HBVYXJT0WV",
      "name": "Tašky a batohy",
      "handle": "tasky-a-batohy-category-370",
      "parent_category_id": "pcat_01K1RB8NKWNC7D303770YS2K0E",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NQA35Z8YWZNTHZG0MS0",
      "name": "Rukavice",
      "handle": "rukavice-category-371",
      "parent_category_id": "pcat_01K1RB8NKWNC7D303770YS2K0E",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NQVRZQ1ASF9NPJNF2MT",
      "name": "Ponožky",
      "handle": "ponozky-category-372",
      "parent_category_id": "pcat_01K1RB8NKWNC7D303770YS2K0E",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NRC4JBNQT75YG3QSYE1",
      "name": "Pásky",
      "handle": "pasky-category-373",
      "parent_category_id": "pcat_01K1RB8NKWNC7D303770YS2K0E",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NRVDT8RDBTJY8MTT1FQ",
      "name": "Peněženky",
      "handle": "penezenky-category-374",
      "parent_category_id": "pcat_01K1RB8NKWNC7D303770YS2K0E",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NSC13G25VGJ5TBZQVE3",
      "name": "Sluneční brýle",
      "handle": "slunecni-bryle-category-375",
      "parent_category_id": "pcat_01K1RB8NKWNC7D303770YS2K0E",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NSXP1QHK971R2NWAZ2Y",
      "name": "Ostatní",
      "handle": "ostatni-category-376",
      "parent_category_id": "pcat_01K1RB8NKWNC7D303770YS2K0E",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NTFXA34QE8EK857A57F",
      "name": "Šaty a sukně",
      "handle": "saty-a-sukne-category-377",
      "parent_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR",
      "name": "Cyklo",
      "handle": "cyklo-category-378",
      "parent_category_id": null,
      "root_category_id": null
    },
    {
      "id": "pcat_01K1RB8NVFXNHP325802DJR651",
      "name": "Oblečení",
      "handle": "obleceni-category-379",
      "parent_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    {
      "id": "pcat_01K1RB8NXVKJM5Y7Q0B5TMDP6Q",
      "name": "Bundy",
      "handle": "bundy-category-383",
      "parent_category_id": "pcat_01K1RB8NVFXNHP325802DJR651",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    {
      "id": "pcat_01K1RB8NY8BM0JQZVXC7HYBWWB",
      "name": "Kalhoty",
      "handle": "kalhoty-category-384",
      "parent_category_id": "pcat_01K1RB8NVFXNHP325802DJR651",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    {
      "id": "pcat_01K1RB8NYSDBP1F5DWC21K33FT",
      "name": "XC/DH (volné)",
      "handle": "xc-dh-volne-category-385",
      "parent_category_id": "pcat_01K1RB8NY8BM0JQZVXC7HYBWWB",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    {
      "id": "pcat_01K1RB8NZTGM708V9ST8FB2652",
      "name": "Kraťasy",
      "handle": "kratasy-category-387",
      "parent_category_id": "pcat_01K1RB8NVFXNHP325802DJR651",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    {
      "id": "pcat_01K1RB8P08XYEY5K37A6NN7ZAQ",
      "name": "XC/DH (volné)",
      "handle": "xc-dh-volne-category-388",
      "parent_category_id": "pcat_01K1RB8NZTGM708V9ST8FB2652",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    {
      "id": "pcat_01K1RB8P0SG93RV3W9PGK45AQJ",
      "name": "Bib (elastické)",
      "handle": "bib-elasticke-category-389",
      "parent_category_id": "pcat_01K1RB8NZTGM708V9ST8FB2652",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    {
      "id": "pcat_01K1RB8P18611Z2PAVRKHFBQEB",
      "name": "Rukavice",
      "handle": "rukavice-category-390",
      "parent_category_id": "pcat_01K1RB8NVFXNHP325802DJR651",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    {
      "id": "pcat_01K1RB8P1N88H5J6JPESKVYJAK",
      "name": "Dlouhé",
      "handle": "dlouhe-category-391",
      "parent_category_id": "pcat_01K1RB8P18611Z2PAVRKHFBQEB",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    {
      "id": "pcat_01K1RB8P27PE61MP06F4QDSQXT",
      "name": "Krátké",
      "handle": "kratke-category-392",
      "parent_category_id": "pcat_01K1RB8P18611Z2PAVRKHFBQEB",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    {
      "id": "pcat_01K1RB8P36CJVDYD8TGNS2QXEC",
      "name": "Ponožky",
      "handle": "ponozky-category-394",
      "parent_category_id": "pcat_01K1RB8NVFXNHP325802DJR651",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    {
      "id": "pcat_01K1RB8P4NAANW9488G1NY6JRD",
      "name": "Doplňky",
      "handle": "doplnky-category-397",
      "parent_category_id": "pcat_01K1RB8NVFXNHP325802DJR651",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    {
      "id": "pcat_01K1RB8P64SFEP6M7VB69FW1EH",
      "name": "Ostatní",
      "handle": "ostatni-category-400",
      "parent_category_id": "pcat_01K1RB8P4NAANW9488G1NY6JRD",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    {
      "id": "pcat_01K1RB8PJFP4GJVX6P1Z2WF4YD",
      "name": "Moto",
      "handle": "moto-category-424",
      "parent_category_id": null,
      "root_category_id": null
    },
    {
      "id": "pcat_01K1RB8PWAKZDB307746HW64YV",
      "name": "Doplňky",
      "handle": "doplnky-category-444",
      "parent_category_id": "pcat_01K1RB8PJFP4GJVX6P1Z2WF4YD",
      "root_category_id": "pcat_01K1RB8PJFP4GJVX6P1Z2WF4YD"
    },
    {
      "id": "pcat_01K1RB8PXB66KVHA3Q4FSS5D5V",
      "name": "Ostatní",
      "handle": "ostatni-category-446",
      "parent_category_id": "pcat_01K1RB8PWAKZDB307746HW64YV",
      "root_category_id": "pcat_01K1RB8PJFP4GJVX6P1Z2WF4YD"
    },
    {
      "id": "pcat_01K1RB8PY751XV9DETPGD1VE0P",
      "name": "Snb-Skate",
      "handle": "snb-skate-category-448",
      "parent_category_id": null,
      "root_category_id": null
    },
    {
      "id": "pcat_01K1RB8PYR5G4Z4PZDHSCQ66XR",
      "name": "Snowboarding",
      "handle": "snowboarding-category-449",
      "parent_category_id": "pcat_01K1RB8PY751XV9DETPGD1VE0P",
      "root_category_id": "pcat_01K1RB8PY751XV9DETPGD1VE0P"
    },
    {
      "id": "pcat_01K1RB8Q1PMNQR30WV2BWTD768",
      "name": "Bundy",
      "handle": "bundy-category-455",
      "parent_category_id": "pcat_01K1RB8PYR5G4Z4PZDHSCQ66XR",
      "root_category_id": "pcat_01K1RB8PY751XV9DETPGD1VE0P"
    },
    {
      "id": "pcat_01K1RB8Q25X4DK2N59SE5F83A3",
      "name": "Kalhoty",
      "handle": "kalhoty-category-456",
      "parent_category_id": "pcat_01K1RB8PYR5G4Z4PZDHSCQ66XR",
      "root_category_id": "pcat_01K1RB8PY751XV9DETPGD1VE0P"
    },
    {
      "id": "pcat_01K1RB8Q2PBP1A8MFSH0YZMQYT",
      "name": "Rukavice",
      "handle": "rukavice-category-457",
      "parent_category_id": "pcat_01K1RB8PYR5G4Z4PZDHSCQ66XR",
      "root_category_id": "pcat_01K1RB8PY751XV9DETPGD1VE0P"
    },
    {
      "id": "pcat_01K1RB8Q375A8TBV8BH2SD2BM2",
      "name": "Kulichy",
      "handle": "kulichy-category-458",
      "parent_category_id": "pcat_01K1RB8PYR5G4Z4PZDHSCQ66XR",
      "root_category_id": "pcat_01K1RB8PY751XV9DETPGD1VE0P"
    },
    {
      "id": "pcat_01K1RB8Q77BWFKT63XBZRQ84BR",
      "name": "Ski",
      "handle": "ski-category-466",
      "parent_category_id": null,
      "root_category_id": null
    },
    {
      "id": "pcat_01K1RB8Q7P2QPY98AFRK2MWTSG",
      "name": "Oblečení",
      "handle": "obleceni-category-467",
      "parent_category_id": "pcat_01K1RB8Q77BWFKT63XBZRQ84BR",
      "root_category_id": "pcat_01K1RB8Q77BWFKT63XBZRQ84BR"
    },
    {
      "id": "pcat_01K1RB8Q89WGTW50FKQVXAJBBT",
      "name": "Bundy",
      "handle": "bundy-category-468",
      "parent_category_id": "pcat_01K1RB8Q7P2QPY98AFRK2MWTSG",
      "root_category_id": "pcat_01K1RB8Q77BWFKT63XBZRQ84BR"
    },
    {
      "id": "pcat_01K1RB8Q8R0ZT6CN297BY5FFY6",
      "name": "Kalhoty",
      "handle": "kalhoty-category-469",
      "parent_category_id": "pcat_01K1RB8Q7P2QPY98AFRK2MWTSG",
      "root_category_id": "pcat_01K1RB8Q77BWFKT63XBZRQ84BR"
    },
    {
      "id": "pcat_01K1RB8Q97KJCSCWPV4KBCNX50",
      "name": "Rukavice",
      "handle": "rukavice-category-470",
      "parent_category_id": "pcat_01K1RB8Q7P2QPY98AFRK2MWTSG",
      "root_category_id": "pcat_01K1RB8Q77BWFKT63XBZRQ84BR"
    },
    {
      "id": "pcat_01K1RB8Q9PX4F7YQX91Z7QCE6F",
      "name": "Kulichy",
      "handle": "kulichy-category-471",
      "parent_category_id": "pcat_01K1RB8Q7P2QPY98AFRK2MWTSG",
      "root_category_id": "pcat_01K1RB8Q77BWFKT63XBZRQ84BR"
    },
    {
      "id": "pcat_01K1RB8QAM7PEWEJPFTYN6F6V0",
      "name": "Doplňky",
      "handle": "doplnky-category-473",
      "parent_category_id": "pcat_01K1RB8Q77BWFKT63XBZRQ84BR",
      "root_category_id": "pcat_01K1RB8Q77BWFKT63XBZRQ84BR"
    },
    {
      "id": "pcat_01K1RB8QD1Y229MDCZR7BSVAYB",
      "name": "Batohy",
      "handle": "batohy-category-478",
      "parent_category_id": "pcat_01K1RB8QAM7PEWEJPFTYN6F6V0",
      "root_category_id": "pcat_01K1RB8Q77BWFKT63XBZRQ84BR"
    },
    {
      "id": "pcat_01K1RB8QDJWB1DXBQWK24P5P0X",
      "name": "Sluneční brýle",
      "handle": "slunecni-bryle-category-479",
      "parent_category_id": "pcat_01K1RB8QAM7PEWEJPFTYN6F6V0",
      "root_category_id": "pcat_01K1RB8Q77BWFKT63XBZRQ84BR"
    },
    {
      "id": "pcat_01K1RB8V8TJ5JG4A88WYJR5EVQ",
      "name": "Náhradní díly",
      "handle": "nahradni-dily-category-728",
      "parent_category_id": "pcat_01K1RB8HJQTH3Z7NQHDVNKW4NW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8V9P6NKQ7K4HZ9772PTP",
      "name": "Náhradní díly",
      "handle": "nahradni-dily-category-730",
      "parent_category_id": "pcat_01K1RB8PYR5G4Z4PZDHSCQ66XR",
      "root_category_id": "pcat_01K1RB8PY751XV9DETPGD1VE0P"
    },
    {
      "id": "pcat_01K1RB8WRDHF58XJCTDCFVER91",
      "name": "Doplňky",
      "handle": "doplnky-komponenty",
      "parent_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    {
      "id": "pcat_01K1RB8WZ7GH22HXP62J83GSH5",
      "name": "Lahve",
      "handle": "lahve",
      "parent_category_id": "pcat_01K1RB8WRDHF58XJCTDCFVER91",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    }
  ],
  "categoryTree": [
    {
      "id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX",
      "name": "Pánské",
      "handle": "panske",
      "children": [
        {
          "id": "pcat_01K1RB8G1KN4M1GDGNGDHQTZ1D",
          "name": "Oblečení",
          "handle": "obleceni",
          "description": "Pánské oblečení",
          "children": [
            {
              "id": "pcat_01K1RB8G22NFPVTEJ2NXEK1EB5",
              "name": "Trika a tílka",
              "handle": "trika-a-tilka",
              "description": "Pánská trika a tílka",
              "children": [
                {
                  "id": "pcat_01K1RB8G2KVYFH1P049EASAHMN",
                  "name": "Krátké rukávy",
                  "handle": "kratke-rukavy",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8G322KC5XCT61EPH0750",
                  "name": "Dlouhé rukávy",
                  "handle": "dlouhe-rukavy",
                  "children": []
                }
              ]
            },
            {
              "id": "pcat_01K1RB8G3K4AYVXH2FQGK34747",
              "name": "Mikiny",
              "handle": "mikiny",
              "description": "Pánské mikiny",
              "children": [
                {
                  "id": "pcat_01K1RB8G42DZZAM0BEHZ5B1D4R",
                  "name": "Na zip",
                  "handle": "na-zip",
                  "description": "Pánské mikiny na zip",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8G4M65DJNZNETQRBGH52",
                  "name": "Přes hlavu",
                  "handle": "pres-hlavu",
                  "description": "Pánské mikiny přes hlavu",
                  "children": []
                }
              ]
            },
            {
              "id": "pcat_01K1RB8G52K2KF4M0ZJG1NB58W",
              "name": "Bundy",
              "handle": "bundy",
              "description": "Pánské bundy",
              "children": [
                {
                  "id": "pcat_01K1RB8G5K8NAVPNTMFQPNP3ZF",
                  "name": "Street",
                  "handle": "street",
                  "description": "Pánské bundy do města",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8G63PD8K6JK31CFY4ETC",
                  "name": "Zimní",
                  "handle": "zimni",
                  "description": "Pánské zimní bundy",
                  "children": []
                }
              ]
            },
            {
              "id": "pcat_01K1RB8G6M6WR4F2AKTTPKMDSS",
              "name": "Svetry",
              "handle": "svetry",
              "description": "Pánské svetry",
              "children": []
            },
            {
              "id": "pcat_01K1RB8G75FEKWR9VYQPJVT0NW",
              "name": "Košile",
              "handle": "kosile",
              "description": "Pánské košile",
              "children": []
            },
            {
              "id": "pcat_01K1RB8G7KNMHFMKMZ6F1M7WZH",
              "name": "Kalhoty",
              "handle": "kalhoty",
              "description": "Pánské kalhoty",
              "children": [
                {
                  "id": "pcat_01K1RB8G82EJ2WEE85X39HHR83",
                  "name": "Street",
                  "handle": "street-category-16",
                  "description": "Pánské kalhoty pro volný čas",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8G8H6GVT25W97GKGNG9W",
                  "name": "Zimní",
                  "handle": "zimni-category-17",
                  "description": "Pánské zimní kalhoty",
                  "children": []
                }
              ]
            },
            {
              "id": "pcat_01K1RB8G92QW3VR24QWG3X2V90",
              "name": "Kraťasy",
              "handle": "kratasy",
              "description": "Pánské kraťasy",
              "children": []
            },
            {
              "id": "pcat_01K1RB8G9MKY3GT59NYCFVC4R8",
              "name": "Plavky",
              "handle": "plavky",
              "description": "Pánské plavky",
              "children": []
            },
            {
              "id": "pcat_01K1RB8GA382EKWBZBGY64WHGW",
              "name": "Doplňky",
              "handle": "doplnky",
              "description": "Pánské doplňky",
              "children": [
                {
                  "id": "pcat_01K1RB8GAHR8NYK9BC3KASR4TC",
                  "name": "Boty",
                  "handle": "boty",
                  "description": "Pánské boty",
                  "children": [
                    {
                      "id": "pcat_01K1RB8GAYPB72R9KN75S4SZ5Z",
                      "name": "Street",
                      "handle": "street-category-22",
                      "description": "Pánské boty",
                      "children": []
                    },
                    {
                      "id": "pcat_01K1RB8GBDNM6T8B74ZZDQKTMF",
                      "name": "Žabky",
                      "handle": "zabky",
                      "description": "Pánské žabky",
                      "children": []
                    }
                  ]
                },
                {
                  "id": "pcat_01K1RB8GBTSEZ2X43HXQVJF0F8",
                  "name": "Kulichy",
                  "handle": "kulichy",
                  "description": "Pánské kulichy",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8GCB3VC2KXQ47C4S8XJB",
                  "name": "Kšiltovky",
                  "handle": "ksiltovky",
                  "description": "Pánské kšiltovky",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8GCXR2KT7HA2AH6QHFSW",
                  "name": "Tašky a batohy",
                  "handle": "tasky-a-batohy",
                  "description": "Pánské batohy",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8GDF8KRHJP985HFVDVJY",
                  "name": "Rukavice",
                  "handle": "rukavice",
                  "description": "Pánské rukavice",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8GDYGRRY1FC8XC9VW7YN",
                  "name": "Ponožky",
                  "handle": "ponozky",
                  "description": "Pánské ponožky",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8GED44F5AB7DSKA7BAEW",
                  "name": "Pásky",
                  "handle": "pasky",
                  "description": "Pánské pásky",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8GEYH8M3VFAXD9GHZDBY",
                  "name": "Peněženky",
                  "handle": "penezenky",
                  "description": "Pánské peněženky",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8GFDEV8T7MVX6TBBJK0H",
                  "name": "Sluneční brýle",
                  "handle": "slunecni-bryle",
                  "description": "Pánské sluneční brýle",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8GFY3E8FZ8S01K65WF8C",
                  "name": "Ostatní",
                  "handle": "ostatni",
                  "description": "Ostatní doplňky",
                  "children": []
                }
              ]
            }
          ]
        },
        {
          "id": "pcat_01K1RB8GGEPF2Z2SWD3TDTTC5A",
          "name": "Cyklo",
          "handle": "cyklo",
          "description": "Pánská cyklistika",
          "children": [
            {
              "id": "pcat_01K1RB8GGZS38QWGYDGVFZVQWS",
              "name": "Oblečení",
              "handle": "obleceni-category-34",
              "description": "Pánské cyklo oblečení",
              "children": [
                {
                  "id": "pcat_01K1RB8GKB3RJ1A240CWNBHCWX",
                  "name": "Kalhoty",
                  "handle": "kalhoty-category-39",
                  "description": "Pánské cyklo kalhoty",
                  "children": [
                    {
                      "id": "pcat_01K1RB8GKTGCW2QABQ9CD1V5T7",
                      "name": "XC/DH (volné)",
                      "handle": "xc-dh-volne",
                      "description": "Pánské cyklo kalhoty XC/DH",
                      "children": []
                    }
                  ]
                },
                {
                  "id": "pcat_01K1RB8GRDSR99AZSHQQWNHYNH",
                  "name": "Ponožky",
                  "handle": "ponozky-category-49",
                  "description": "Pánské cyklo ponožky",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8GSWXHCZZGDY3XGJG99G",
                  "name": "Doplňky",
                  "handle": "doplnky-category-52",
                  "description": "Cyklistické doplňky",
                  "children": [
                    {
                      "id": "pcat_01K1RB8GVBNK4XVFCVQNP1FSK7",
                      "name": "Ostatní",
                      "handle": "ostatni-category-55",
                      "description": "Ostatní doplňky",
                      "children": []
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "pcat_01K1RB8H6C4NCW44SKVHF9G21B",
          "name": "Moto",
          "handle": "moto",
          "description": "Pánské moto vybavení",
          "children": [
            {
              "id": "pcat_01K1RB8HG8ES3FY7871PEY71A1",
              "name": "Doplňky",
              "handle": "doplnky-category-98",
              "description": "Pánské moto doplňky",
              "children": [
                {
                  "id": "pcat_01K1RB8HH87HQG6456G9V2EDN6",
                  "name": "Ostatní",
                  "handle": "ostatni-category-100",
                  "description": "Ostatní moto doplňky",
                  "children": []
                }
              ]
            }
          ]
        },
        {
          "id": "pcat_01K1RB8HJ89KCYN54F4AZ0N1YS",
          "name": "Snb-Skate",
          "handle": "snb-skate",
          "description": "Pánský snowboarding a skateboarding",
          "children": [
            {
              "id": "pcat_01K1RB8HJQTH3Z7NQHDVNKW4NW",
              "name": "Snowboarding",
              "handle": "snowboarding",
              "description": "Pánský snowboarding",
              "children": [
                {
                  "id": "pcat_01K1RB8HNNTJ4RFTZK38KE12GW",
                  "name": "Bundy",
                  "handle": "bundy-category-109",
                  "description": "Pánské zimní bundy",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8HP4NX291QW6JV5M74GR",
                  "name": "Kalhoty",
                  "handle": "kalhoty-category-110",
                  "description": "Pánské zimní kalhoty",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8HPKCS46X8FDTDYS9R3H",
                  "name": "Rukavice",
                  "handle": "rukavice-category-111",
                  "description": "Pánské zimní rukavice",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8HQ0JK3PXSZ0TFWQ54H6",
                  "name": "Kulichy",
                  "handle": "kulichy-category-112",
                  "description": "Pánské zimní kulichy",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8V8TJ5JG4A88WYJR5EVQ",
                  "name": "Náhradní díly",
                  "handle": "nahradni-dily-category-728",
                  "children": []
                }
              ]
            }
          ]
        },
        {
          "id": "pcat_01K1RB8HTCNMB33QK2C7NJR5ZW",
          "name": "Ski",
          "handle": "ski",
          "description": "Pánské vybavení pro lyžaře",
          "children": [
            {
              "id": "pcat_01K1RB8HTVJH9W5NE6SQSSDQBN",
              "name": "Oblečení",
              "handle": "obleceni-category-120",
              "description": "Pánské zimní oblečení",
              "children": [
                {
                  "id": "pcat_01K1RB8HVATG7AJYP99Y83B0YA",
                  "name": "Bundy",
                  "handle": "bundy-category-121",
                  "description": "Pánské zimní bundy",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8HVSWXAWST5R680TKG5A",
                  "name": "Kalhoty",
                  "handle": "kalhoty-category-122",
                  "description": "Pánské zimní kalhoty",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8HWC2789BSH9VV94QD40",
                  "name": "Rukavice",
                  "handle": "rukavice-category-123",
                  "description": "Pánské zimní rukavice",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8HWX662Q6SQQBWQSKXCR",
                  "name": "Kulichy",
                  "handle": "kulichy-category-124",
                  "description": "Pánské zimní kulichy",
                  "children": []
                }
              ]
            },
            {
              "id": "pcat_01K1RB8HXVKPVAXN5KBJWH46QA",
              "name": "Doplňky",
              "handle": "doplnky-category-126",
              "description": "Pánské zimní doplňky",
              "children": [
                {
                  "id": "pcat_01K1RB8J0699NT92CG6NBK3H9M",
                  "name": "Batohy",
                  "handle": "batohy",
                  "description": "Pánské batohy",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8J0QHSR8AB4C0W3CAVKP",
                  "name": "Sluneční brýle",
                  "handle": "slunecni-bryle-category-132",
                  "description": "Pánské sluneční brýle",
                  "children": []
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V",
      "name": "Dámské",
      "handle": "damske",
      "children": [
        {
          "id": "pcat_01K1RB8J1Q7BEA61JK1ZNCW1NA",
          "name": "Oblečení",
          "handle": "obleceni-category-134",
          "description": "Dámské oblečení",
          "children": [
            {
              "id": "pcat_01K1RB8J26341CPGHSEB6FQZH9",
              "name": "Trika a tílka",
              "handle": "trika-a-tilka-category-135",
              "description": "Dámská trika a tílka",
              "children": [
                {
                  "id": "pcat_01K1RB8J2KZTCKVCWDNTDE33T4",
                  "name": "Krátké rukávy",
                  "handle": "kratke-rukavy-category-136",
                  "description": "Dámská trika s krátkými rukávy",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8J349N2WC10BC1A1XZBH",
                  "name": "Dlouhé rukávy",
                  "handle": "dlouhe-rukavy-category-137",
                  "description": "Dámská trika s dlouhými rukávy",
                  "children": []
                }
              ]
            },
            {
              "id": "pcat_01K1RB8J3J4P3W6FNG3PPVETN9",
              "name": "Mikiny",
              "handle": "mikiny-category-138",
              "description": "Dámské mikiny",
              "children": [
                {
                  "id": "pcat_01K1RB8J44XAVF7ZMBVP0CS1PX",
                  "name": "Na zip",
                  "handle": "na-zip-category-139",
                  "description": "Dámské mikiny na zip",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8J4JNFATW8H1DSXHXBVZ",
                  "name": "Přes hlavu",
                  "handle": "pres-hlavu-category-140",
                  "description": "Dámské mikiny přes hlavu",
                  "children": []
                }
              ]
            },
            {
              "id": "pcat_01K1RB8J50WM9DWJ515NBRNTBC",
              "name": "Bundy",
              "handle": "bundy-category-141",
              "description": "Dámské bundy",
              "children": [
                {
                  "id": "pcat_01K1RB8J5DTJFSRXBE4RXG43WP",
                  "name": "Street",
                  "handle": "street-category-142",
                  "description": "Dámské bundy pro volný čas",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8J5ZK4EJBCHHGKVV1WQZ",
                  "name": "Zimní",
                  "handle": "zimni-category-143",
                  "description": "Dámské zimní bundy",
                  "children": []
                }
              ]
            },
            {
              "id": "pcat_01K1RB8J6EGSN0QE2B0AXZ4SKC",
              "name": "Svetry",
              "handle": "svetry-category-144",
              "description": "Dámské svetry",
              "children": []
            },
            {
              "id": "pcat_01K1RB8J6Y2KT8CW2RQ16JG1PE",
              "name": "Košile",
              "handle": "kosile-category-145",
              "description": "Dámské košile",
              "children": []
            },
            {
              "id": "pcat_01K1RB8J7DW042RTPWCBVBXH53",
              "name": "Kalhoty",
              "handle": "kalhoty-category-146",
              "description": "Dámské kalhoty",
              "children": [
                {
                  "id": "pcat_01K1RB8J7WB2Q9V7HWG4D3CESP",
                  "name": "Street",
                  "handle": "street-category-147",
                  "description": "Dámské kalhoty pro volný čas",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8J8DZSB3KNT8XCMPVAQC",
                  "name": "Zimní",
                  "handle": "zimni-category-148",
                  "description": "Dámské zimní kalhoty",
                  "children": []
                }
              ]
            },
            {
              "id": "pcat_01K1RB8J8Y0PR4GBPFT19ET0SV",
              "name": "Kraťasy",
              "handle": "kratasy-category-149",
              "description": "Dámské šortky",
              "children": []
            },
            {
              "id": "pcat_01K1RB8J9F9RPEJJ23Z8KA4AJW",
              "name": "Plavky",
              "handle": "plavky-category-150",
              "description": "Dámské plavky",
              "children": []
            },
            {
              "id": "pcat_01K1RB8J9YCTA5RKQMSVVGMDS4",
              "name": "Šaty a sukně",
              "handle": "saty-a-sukne",
              "description": "Dámské šaty a sukně",
              "children": []
            },
            {
              "id": "pcat_01K1RB8JADGFFJXSHEAYP9A8T2",
              "name": "Doplňky",
              "handle": "doplnky-category-152",
              "description": "Dámské doplňky",
              "children": [
                {
                  "id": "pcat_01K1RB8JAWN8MFBXGSRMG5VGR3",
                  "name": "Boty",
                  "handle": "boty-category-153",
                  "description": "Dámské boty",
                  "children": [
                    {
                      "id": "pcat_01K1RB8JBWKBDHPA3GEVV1V5YC",
                      "name": "Žabky",
                      "handle": "zabky-category-155",
                      "description": "Dámské žabky a sandály",
                      "children": []
                    }
                  ]
                },
                {
                  "id": "pcat_01K1RB8JCD4R0NKCWRP16B19J5",
                  "name": "Kulichy",
                  "handle": "kulichy-category-156",
                  "description": "Dámské kulichy",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8JCWQDMKYZZTWDF30J7B",
                  "name": "Kšiltovky",
                  "handle": "ksiltovky-category-157",
                  "description": "Dámské kšiltovky",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8JDEJR7FW9PY3MSG9NGQ",
                  "name": "Tašky a batohy",
                  "handle": "tasky-a-batohy-category-158",
                  "description": "Dámské batohy a kabelky",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8JDWRFRBQQ6KDQKB1WP2",
                  "name": "Rukavice",
                  "handle": "rukavice-category-159",
                  "description": "Dámské rukavice",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8JENFMRDS6E7PTXYEACW",
                  "name": "Ponožky",
                  "handle": "ponozky-category-160",
                  "description": "Dámské ponožky",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8JG7HQHHG8A25R9K7HKC",
                  "name": "Sluneční brýle",
                  "handle": "slunecni-bryle-category-163",
                  "description": "Dámské sluneční brýle",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8JGNFW4SKT22RM2ME8X9",
                  "name": "Ostatní",
                  "handle": "ostatni-category-164",
                  "description": "Ostatní doplňky",
                  "children": []
                }
              ]
            }
          ]
        },
        {
          "id": "pcat_01K1RB8JH43Y80Y0599VB4NWZ5",
          "name": "Cyklo",
          "handle": "cyklo-category-165",
          "description": "Dámská cyklistika",
          "children": [
            {
              "id": "pcat_01K1RB8JHQMMXK70R6JGCSFE5H",
              "name": "Oblečení",
              "handle": "obleceni-category-166",
              "description": "Dámské cyklo oblečení",
              "children": [
                {
                  "id": "pcat_01K1RB8JKHB9RJQWYPRW51QCY1",
                  "name": "Bundy",
                  "handle": "bundy-category-170",
                  "description": "Dámské cyklo bundy",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8JNJ50AYCQ72T5SAP90W",
                  "name": "Kraťasy",
                  "handle": "kratasy-category-174",
                  "description": "Dámské cyklo kraťasy",
                  "children": [
                    {
                      "id": "pcat_01K1RB8JP3B26C5CR1SWXYWPGM",
                      "name": "XC/DH (volné)",
                      "handle": "xc-dh-volne-category-175",
                      "description": "Dámské cyklo šortky volné",
                      "children": []
                    },
                    {
                      "id": "pcat_01K1RB8JPJD29HFJ0QS52V9M4X",
                      "name": "Bib (elastické)",
                      "handle": "bib-elasticke-category-176",
                      "description": "Dámské cyklo šortky elastické",
                      "children": []
                    }
                  ]
                },
                {
                  "id": "pcat_01K1RB8JQ06DHD9SQK1W12HMD8",
                  "name": "Rukavice",
                  "handle": "rukavice-category-177",
                  "description": "Dámské cyklo rukavice",
                  "children": [
                    {
                      "id": "pcat_01K1RB8JQJ6EYA4V4V73VFDACS",
                      "name": "Dlouhé",
                      "handle": "dlouhe-category-178",
                      "description": "Dámské cyklo rukavice dlouhé",
                      "children": []
                    },
                    {
                      "id": "pcat_01K1RB8JR1ES9GX5Z7NPGR511N",
                      "name": "Krátké",
                      "handle": "kratke-category-179",
                      "description": "Dámské cyklo rukavice krátké",
                      "children": []
                    }
                  ]
                },
                {
                  "id": "pcat_01K1RB8JS0W97FTTXF8CP2Y1VN",
                  "name": "Ponožky",
                  "handle": "ponozky-category-181",
                  "description": "Dámské cyklo ponožky",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8JTJV3Y5NMEPSY16MNDQ",
                  "name": "Doplňky",
                  "handle": "doplnky-category-184",
                  "description": "Dámské cyklo doplňky",
                  "children": [
                    {
                      "id": "pcat_01K1RB8JW0Q2TQGE0YTZ6C8JMA",
                      "name": "Ostatní",
                      "handle": "ostatni-category-187",
                      "description": "Ostatní doplňky",
                      "children": []
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "pcat_01K1RB8KJ8AFR3ENNMEK6YTJX8",
          "name": "Snb-Skate",
          "handle": "snb-skate-category-233",
          "description": "Dámský snowboarding a skateboarding",
          "children": [
            {
              "id": "pcat_01K1RB8KJSNPKQPFKMK8QCJQYZ",
              "name": "Snowboarding",
              "handle": "snowboarding-category-234",
              "description": "Dámský snowboarding",
              "children": [
                {
                  "id": "pcat_01K1RB8KNVFF0PMD55Z5XB5469",
                  "name": "Bundy",
                  "handle": "bundy-category-240",
                  "description": "Dámské zimní bundy",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8KPAZQ509BGGAZXWB2NM",
                  "name": "Kalhoty",
                  "handle": "kalhoty-category-241",
                  "description": "Dámské zimní kalhoty",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8KPS9ZHXD3K5VAD87QBF",
                  "name": "Rukavice",
                  "handle": "rukavice-category-242",
                  "description": "Dámské zimní rukavice",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8KQAGZ7B6WT4Q9G4Y91V",
                  "name": "Kulichy",
                  "handle": "kulichy-category-243",
                  "description": "Dámské zimní kulichy",
                  "children": []
                }
              ]
            }
          ]
        },
        {
          "id": "pcat_01K1RB8KVCXVAG3N85BSYPGHKC",
          "name": "Ski",
          "handle": "ski-category-251",
          "description": "Dámské vybavení pro lyžaře",
          "children": [
            {
              "id": "pcat_01K1RB8KVWCJAXBDDPR1H3T9V0",
              "name": "Oblečení",
              "handle": "obleceni-category-252",
              "description": "Dámské zimní oblečení",
              "children": [
                {
                  "id": "pcat_01K1RB8KWE2JPGPDQVFH0BCKT9",
                  "name": "Bundy",
                  "handle": "bundy-category-253",
                  "description": "Dámské zimní bundy",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8KWXS5316M51TZYW26YW",
                  "name": "Kalhoty",
                  "handle": "kalhoty-category-254",
                  "description": "Dámské zimní kalhoty",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8KXA7E1RFCZ9HAV36NNB",
                  "name": "Rukavice",
                  "handle": "rukavice-category-255",
                  "description": "Dámské zimní rukavice",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8KXS5F3ZB4JDXD9NDMPY",
                  "name": "Kulichy",
                  "handle": "kulichy-category-256",
                  "description": "Dámské zimní kulichy",
                  "children": []
                }
              ]
            },
            {
              "id": "pcat_01K1RB8KYPA0P85FKQ2NPYVCS5",
              "name": "Doplňky",
              "handle": "doplnky-category-258",
              "description": "Dámské zimní doplňky",
              "children": [
                {
                  "id": "pcat_01K1RB8M1ATZG7Y7R2KFWPMSN5",
                  "name": "Batohy",
                  "handle": "batohy-category-263",
                  "description": "Dámské batohy",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8M1S12PRYAEQ5S45W22E",
                  "name": "Sluneční brýle",
                  "handle": "slunecni-bryle-category-264",
                  "description": "Dámské sluneční brýle",
                  "children": []
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8",
      "name": "Dětské",
      "handle": "detske",
      "children": [
        {
          "id": "pcat_01K1RB8M2V65T9Q08MCZ0DAHW3",
          "name": "Oblečení",
          "handle": "obleceni-category-266",
          "description": "Dětské oblečení",
          "children": [
            {
              "id": "pcat_01K1RB8M3ABD3W1HJDDH77QTK9",
              "name": "Trika a tílka",
              "handle": "trika-a-tilka-category-267",
              "description": "Dětská trička",
              "children": [
                {
                  "id": "pcat_01K1RB8M3V3BZFQZVZSAK5PXY0",
                  "name": "Krátké rukávy",
                  "handle": "kratke-rukavy-category-268",
                  "description": "Dětská trička s krátkými rukávy",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8M4ANEVV7381SPNDHSMJ",
                  "name": "Dlouhé rukávy",
                  "handle": "dlouhe-rukavy-category-269",
                  "description": "Dětská trička s dlouhými rukávy",
                  "children": []
                }
              ]
            },
            {
              "id": "pcat_01K1RB8M4SVFDX4VW001M0TQ7Z",
              "name": "Mikiny",
              "handle": "mikiny-category-270",
              "description": "Dětské mikiny",
              "children": [
                {
                  "id": "pcat_01K1RB8M5TQE14SMWM6S7VAP5A",
                  "name": "Přes hlavu",
                  "handle": "pres-hlavu-category-272",
                  "description": "Dětské mikiny přes hlavu",
                  "children": []
                }
              ]
            },
            {
              "id": "pcat_01K1RB8M69E5FWCSEB0PPWGX94",
              "name": "Bundy",
              "handle": "bundy-category-273",
              "description": "Dětské bundy",
              "children": [
                {
                  "id": "pcat_01K1RB8M6Q6M3XTJ47TCCZ2E93",
                  "name": "Street",
                  "handle": "street-category-274",
                  "description": "Dětské bundy pro volný čas",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8M76KEN6R6XMA7NWNQZ4",
                  "name": "Zimní",
                  "handle": "zimni-category-275",
                  "description": "Dětské zimní bundy",
                  "children": []
                }
              ]
            },
            {
              "id": "pcat_01K1RB8M7NT8A13DGAN2H9A7YJ",
              "name": "Kalhoty",
              "handle": "kalhoty-category-276",
              "description": "Dětské kalhoty",
              "children": [
                {
                  "id": "pcat_01K1RB8M84R3F4YXNHSTBQCCB2",
                  "name": "Street",
                  "handle": "street-category-277",
                  "description": "Dětské kalhoty pro volný čas",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8M8N4FM3AY51A99FFVC4",
                  "name": "Zimní",
                  "handle": "zimni-category-278",
                  "description": "Dětské zimní kalhoty",
                  "children": []
                }
              ]
            },
            {
              "id": "pcat_01K1RB8M981EYEMCJPJFK3M4Z0",
              "name": "Kraťasy",
              "handle": "kratasy-category-279",
              "description": "Dětské kraťasy",
              "children": []
            },
            {
              "id": "pcat_01K1RB8M9QQXT1XF4WR1JYVJ2T",
              "name": "Plavky",
              "handle": "plavky-category-280",
              "description": "Dětské plavky",
              "children": []
            },
            {
              "id": "pcat_01K1RB8MA6N7BK5DTQH87ENA2Y",
              "name": "Doplňky",
              "handle": "doplnky-category-281",
              "description": "Dětské doplňky",
              "children": [
                {
                  "id": "pcat_01K1RB8MAS5PX17DREZTWX98HY",
                  "name": "Boty",
                  "handle": "boty-category-282",
                  "description": "Dětské boty",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8MB6YTGE50Y76E8H21HR",
                  "name": "Kulichy",
                  "handle": "kulichy-category-283",
                  "description": "Dětské kulichy",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8MBNWA70QYKEMH7H2WJX",
                  "name": "Kšiltovky",
                  "handle": "ksiltovky-category-284",
                  "description": "Dětské kšiltovky",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8MC6RP6BB60ZZZZCBMQK",
                  "name": "Rukavice",
                  "handle": "rukavice-category-285",
                  "description": "Dětské rukavice",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8MD7R883PNKHYEZ1J659",
                  "name": "Ostatní",
                  "handle": "ostatni-category-287",
                  "description": "Ostatní doplňky",
                  "children": []
                }
              ]
            }
          ]
        },
        {
          "id": "pcat_01K1RB8MZ5FJCTF87D7MD5XZJ0",
          "name": "Snb-Skate",
          "handle": "snb-skate-category-323",
          "description": "Dětský skateboarding a snowboarding",
          "children": [
            {
              "id": "pcat_01K1RB8MZN3T4V66NEAKX9PV9X",
              "name": "Snowboarding",
              "handle": "snowboarding-category-324",
              "description": "Dětský snowboarding",
              "children": [
                {
                  "id": "pcat_01K1RB8N2HA00C869DRPHQD0ZM",
                  "name": "Bundy",
                  "handle": "bundy-category-330",
                  "description": "Dětské zimní bundy",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8N30MECRNYV0N1Q2RBRA",
                  "name": "Kalhoty",
                  "handle": "kalhoty-category-331",
                  "description": "Dětské zimní kalhoty",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8N3FJ31VKM1DJAM6SQHA",
                  "name": "Rukavice",
                  "handle": "rukavice-category-332",
                  "description": "Dětské zimní rukavice",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8N400MPJPYD72TV1E8GB",
                  "name": "Kulichy",
                  "handle": "kulichy-category-333",
                  "description": "Dětské kulichy",
                  "children": []
                }
              ]
            }
          ]
        },
        {
          "id": "pcat_01K1RB8N5CT9KCN8N5HWDFHGTJ",
          "name": "Ski",
          "handle": "ski-category-336",
          "description": "Dětské vybavení pro lyžaře",
          "children": [
            {
              "id": "pcat_01K1RB8N5TM4PQRVH7A0R3Z422",
              "name": "Oblečení",
              "handle": "obleceni-category-337",
              "description": "Dětské zimní oblečení",
              "children": [
                {
                  "id": "pcat_01K1RB8N69MHDJ8XZS50AR8N7Z",
                  "name": "Bundy",
                  "handle": "bundy-category-338",
                  "description": "Dětské zimní bundy",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8N6WMWY1424JTBS3XR55",
                  "name": "Kalhoty",
                  "handle": "kalhoty-category-339",
                  "description": "Dětské zimní kalhoty",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8N7GA2N5AJDW5M1734KJ",
                  "name": "Rukavice",
                  "handle": "rukavice-category-340",
                  "description": "Dětské zimní rukavice",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8N85RD1EEF80JZW4SQ6E",
                  "name": "Kulichy",
                  "handle": "kulichy-category-341",
                  "description": "Dětské zimní kulichy",
                  "children": []
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH",
      "name": "Oblečení",
      "handle": "obleceni-category-347",
      "children": [
        {
          "id": "pcat_01K1RB8NBSQ39G72J5E3SENF7K",
          "name": "Trika a tílka",
          "handle": "trika-a-tilka-category-348",
          "children": [
            {
              "id": "pcat_01K1RB8NC71VA05V7PQC5ZPQKJ",
              "name": "Krátké rukávy",
              "handle": "kratke-rukavy-category-349",
              "description": "Trika s krátkými rukávy",
              "children": []
            },
            {
              "id": "pcat_01K1RB8NCPJ9X4NAA9DFT1RAS5",
              "name": "Dlouhé rukávy",
              "handle": "dlouhe-rukavy-category-350",
              "description": "Trika s dlouhými rukávy",
              "children": []
            }
          ]
        },
        {
          "id": "pcat_01K1RB8ND8B29HDGCZ349NM632",
          "name": "Mikiny",
          "handle": "mikiny-category-351",
          "children": [
            {
              "id": "pcat_01K1RB8NDSY4KAVFFQVRNP2KAD",
              "name": "Na zip",
              "handle": "na-zip-category-352",
              "description": "Mikiny na zip",
              "children": []
            },
            {
              "id": "pcat_01K1RB8NEB67KSN2VHMBT1XNX7",
              "name": "Přes hlavu",
              "handle": "pres-hlavu-category-353",
              "description": "Mikiny přes hlavu",
              "children": []
            }
          ]
        },
        {
          "id": "pcat_01K1RB8NEXMD6RSK1CGG87C181",
          "name": "Bundy",
          "handle": "bundy-category-354",
          "children": [
            {
              "id": "pcat_01K1RB8NFE134QRXKQF9KNK28B",
              "name": "Street",
              "handle": "street-category-355",
              "children": []
            },
            {
              "id": "pcat_01K1RB8NFX27RB9VYAD56GGEAQ",
              "name": "Zimní",
              "handle": "zimni-category-356",
              "children": []
            }
          ]
        },
        {
          "id": "pcat_01K1RB8NGE2SFRGFA86DE4D9ZP",
          "name": "Svetry",
          "handle": "svetry-category-357",
          "children": []
        },
        {
          "id": "pcat_01K1RB8NH0F36WEX2E8B2SYCM7",
          "name": "Košile",
          "handle": "kosile-category-358",
          "children": []
        },
        {
          "id": "pcat_01K1RB8NHEXW9WKYHF80S97KDM",
          "name": "Kalhoty",
          "handle": "kalhoty-category-359",
          "children": [
            {
              "id": "pcat_01K1RB8NHXCGCK5HSE4AJZDW7D",
              "name": "Street",
              "handle": "street-category-360",
              "children": []
            },
            {
              "id": "pcat_01K1RB8NJDPKTC2B04RMHG7R3N",
              "name": "Zimní",
              "handle": "zimni-category-361",
              "children": []
            }
          ]
        },
        {
          "id": "pcat_01K1RB8NJXBPCGP1KWQ3Y2FBQ6",
          "name": "Kraťasy",
          "handle": "kratasy-category-362",
          "children": []
        },
        {
          "id": "pcat_01K1RB8NKC9HCMYHN07ZQQEJJC",
          "name": "Plavky",
          "handle": "plavky-category-363",
          "children": []
        },
        {
          "id": "pcat_01K1RB8NKWNC7D303770YS2K0E",
          "name": "Doplňky",
          "handle": "doplnky-category-364",
          "children": [
            {
              "id": "pcat_01K1RB8NMA1FXYQ3MXGPH4R9EV",
              "name": "Boty",
              "handle": "boty-category-365",
              "children": [
                {
                  "id": "pcat_01K1RB8NMVY99XGBKDR7G0BHPX",
                  "name": "Street",
                  "handle": "street-category-366",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8NNA02G0XSYX53AJME1F",
                  "name": "Žabky",
                  "handle": "zabky-category-367",
                  "children": []
                }
              ]
            },
            {
              "id": "pcat_01K1RB8NNV4Z3GTQH30V97KYM3",
              "name": "Kulichy",
              "handle": "kulichy-category-368",
              "children": []
            },
            {
              "id": "pcat_01K1RB8NPAHV74FE2NV2YZNCVF",
              "name": "Kšiltovky",
              "handle": "ksiltovky-category-369",
              "children": []
            },
            {
              "id": "pcat_01K1RB8NPVJRWP76HBVYXJT0WV",
              "name": "Tašky a batohy",
              "handle": "tasky-a-batohy-category-370",
              "children": []
            },
            {
              "id": "pcat_01K1RB8NQA35Z8YWZNTHZG0MS0",
              "name": "Rukavice",
              "handle": "rukavice-category-371",
              "children": []
            },
            {
              "id": "pcat_01K1RB8NQVRZQ1ASF9NPJNF2MT",
              "name": "Ponožky",
              "handle": "ponozky-category-372",
              "children": []
            },
            {
              "id": "pcat_01K1RB8NRC4JBNQT75YG3QSYE1",
              "name": "Pásky",
              "handle": "pasky-category-373",
              "children": []
            },
            {
              "id": "pcat_01K1RB8NRVDT8RDBTJY8MTT1FQ",
              "name": "Peněženky",
              "handle": "penezenky-category-374",
              "children": []
            },
            {
              "id": "pcat_01K1RB8NSC13G25VGJ5TBZQVE3",
              "name": "Sluneční brýle",
              "handle": "slunecni-bryle-category-375",
              "children": []
            },
            {
              "id": "pcat_01K1RB8NSXP1QHK971R2NWAZ2Y",
              "name": "Ostatní",
              "handle": "ostatni-category-376",
              "children": []
            }
          ]
        },
        {
          "id": "pcat_01K1RB8NTFXA34QE8EK857A57F",
          "name": "Šaty a sukně",
          "handle": "saty-a-sukne-category-377",
          "children": []
        }
      ]
    },
    {
      "id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR",
      "name": "Cyklo",
      "handle": "cyklo-category-378",
      "children": [
        {
          "id": "pcat_01K1RB8NVFXNHP325802DJR651",
          "name": "Oblečení",
          "handle": "obleceni-category-379",
          "children": [
            {
              "id": "pcat_01K1RB8NXVKJM5Y7Q0B5TMDP6Q",
              "name": "Bundy",
              "handle": "bundy-category-383",
              "children": []
            },
            {
              "id": "pcat_01K1RB8NY8BM0JQZVXC7HYBWWB",
              "name": "Kalhoty",
              "handle": "kalhoty-category-384",
              "children": [
                {
                  "id": "pcat_01K1RB8NYSDBP1F5DWC21K33FT",
                  "name": "XC/DH (volné)",
                  "handle": "xc-dh-volne-category-385",
                  "children": []
                }
              ]
            },
            {
              "id": "pcat_01K1RB8NZTGM708V9ST8FB2652",
              "name": "Kraťasy",
              "handle": "kratasy-category-387",
              "children": [
                {
                  "id": "pcat_01K1RB8P08XYEY5K37A6NN7ZAQ",
                  "name": "XC/DH (volné)",
                  "handle": "xc-dh-volne-category-388",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8P0SG93RV3W9PGK45AQJ",
                  "name": "Bib (elastické)",
                  "handle": "bib-elasticke-category-389",
                  "children": []
                }
              ]
            },
            {
              "id": "pcat_01K1RB8P18611Z2PAVRKHFBQEB",
              "name": "Rukavice",
              "handle": "rukavice-category-390",
              "children": [
                {
                  "id": "pcat_01K1RB8P1N88H5J6JPESKVYJAK",
                  "name": "Dlouhé",
                  "handle": "dlouhe-category-391",
                  "children": []
                },
                {
                  "id": "pcat_01K1RB8P27PE61MP06F4QDSQXT",
                  "name": "Krátké",
                  "handle": "kratke-category-392",
                  "children": []
                }
              ]
            },
            {
              "id": "pcat_01K1RB8P36CJVDYD8TGNS2QXEC",
              "name": "Ponožky",
              "handle": "ponozky-category-394",
              "children": []
            },
            {
              "id": "pcat_01K1RB8P4NAANW9488G1NY6JRD",
              "name": "Doplňky",
              "handle": "doplnky-category-397",
              "children": [
                {
                  "id": "pcat_01K1RB8P64SFEP6M7VB69FW1EH",
                  "name": "Ostatní",
                  "handle": "ostatni-category-400",
                  "children": []
                }
              ]
            }
          ]
        },
        {
          "id": "pcat_01K1RB8WRDHF58XJCTDCFVER91",
          "name": "Doplňky",
          "handle": "doplnky-komponenty",
          "children": [
            {
              "id": "pcat_01K1RB8WZ7GH22HXP62J83GSH5",
              "name": "Lahve",
              "handle": "lahve",
              "children": []
            }
          ]
        }
      ]
    },
    {
      "id": "pcat_01K1RB8PJFP4GJVX6P1Z2WF4YD",
      "name": "Moto",
      "handle": "moto-category-424",
      "children": [
        {
          "id": "pcat_01K1RB8PWAKZDB307746HW64YV",
          "name": "Doplňky",
          "handle": "doplnky-category-444",
          "children": [
            {
              "id": "pcat_01K1RB8PXB66KVHA3Q4FSS5D5V",
              "name": "Ostatní",
              "handle": "ostatni-category-446",
              "children": []
            }
          ]
        }
      ]
    },
    {
      "id": "pcat_01K1RB8PY751XV9DETPGD1VE0P",
      "name": "Snb-Skate",
      "handle": "snb-skate-category-448",
      "children": [
        {
          "id": "pcat_01K1RB8PYR5G4Z4PZDHSCQ66XR",
          "name": "Snowboarding",
          "handle": "snowboarding-category-449",
          "children": [
            {
              "id": "pcat_01K1RB8Q1PMNQR30WV2BWTD768",
              "name": "Bundy",
              "handle": "bundy-category-455",
              "children": []
            },
            {
              "id": "pcat_01K1RB8Q25X4DK2N59SE5F83A3",
              "name": "Kalhoty",
              "handle": "kalhoty-category-456",
              "children": []
            },
            {
              "id": "pcat_01K1RB8Q2PBP1A8MFSH0YZMQYT",
              "name": "Rukavice",
              "handle": "rukavice-category-457",
              "children": []
            },
            {
              "id": "pcat_01K1RB8Q375A8TBV8BH2SD2BM2",
              "name": "Kulichy",
              "handle": "kulichy-category-458",
              "children": []
            },
            {
              "id": "pcat_01K1RB8V9P6NKQ7K4HZ9772PTP",
              "name": "Náhradní díly",
              "handle": "nahradni-dily-category-730",
              "children": []
            }
          ]
        }
      ]
    },
    {
      "id": "pcat_01K1RB8Q77BWFKT63XBZRQ84BR",
      "name": "Ski",
      "handle": "ski-category-466",
      "children": [
        {
          "id": "pcat_01K1RB8Q7P2QPY98AFRK2MWTSG",
          "name": "Oblečení",
          "handle": "obleceni-category-467",
          "children": [
            {
              "id": "pcat_01K1RB8Q89WGTW50FKQVXAJBBT",
              "name": "Bundy",
              "handle": "bundy-category-468",
              "children": []
            },
            {
              "id": "pcat_01K1RB8Q8R0ZT6CN297BY5FFY6",
              "name": "Kalhoty",
              "handle": "kalhoty-category-469",
              "children": []
            },
            {
              "id": "pcat_01K1RB8Q97KJCSCWPV4KBCNX50",
              "name": "Rukavice",
              "handle": "rukavice-category-470",
              "children": []
            },
            {
              "id": "pcat_01K1RB8Q9PX4F7YQX91Z7QCE6F",
              "name": "Kulichy",
              "handle": "kulichy-category-471",
              "children": []
            }
          ]
        },
        {
          "id": "pcat_01K1RB8QAM7PEWEJPFTYN6F6V0",
          "name": "Doplňky",
          "handle": "doplnky-category-473",
          "children": [
            {
              "id": "pcat_01K1RB8QD1Y229MDCZR7BSVAYB",
              "name": "Batohy",
              "handle": "batohy-category-478",
              "children": []
            },
            {
              "id": "pcat_01K1RB8QDJWB1DXBQWK24P5P0X",
              "name": "Sluneční brýle",
              "handle": "slunecni-bryle-category-479",
              "children": []
            }
          ]
        }
      ]
    }
  ],
  "rootCategories": [
    {
      "id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX",
      "name": "Pánské",
      "handle": "panske",
      "parent_category_id": null,
      "root_category_id": null
    },
    {
      "id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V",
      "name": "Dámské",
      "handle": "damske",
      "parent_category_id": null,
      "root_category_id": null
    },
    {
      "id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8",
      "name": "Dětské",
      "handle": "detske",
      "parent_category_id": null,
      "root_category_id": null
    },
    {
      "id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH",
      "name": "Oblečení",
      "handle": "obleceni-category-347",
      "parent_category_id": null,
      "root_category_id": null
    },
    {
      "id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR",
      "name": "Cyklo",
      "handle": "cyklo-category-378",
      "parent_category_id": null,
      "root_category_id": null
    },
    {
      "id": "pcat_01K1RB8PJFP4GJVX6P1Z2WF4YD",
      "name": "Moto",
      "handle": "moto-category-424",
      "parent_category_id": null,
      "root_category_id": null
    },
    {
      "id": "pcat_01K1RB8PY751XV9DETPGD1VE0P",
      "name": "Snb-Skate",
      "handle": "snb-skate-category-448",
      "parent_category_id": null,
      "root_category_id": null
    },
    {
      "id": "pcat_01K1RB8Q77BWFKT63XBZRQ84BR",
      "name": "Ski",
      "handle": "ski-category-466",
      "parent_category_id": null,
      "root_category_id": null
    }
  ],
  "categoryMap": {
    "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX": {
      "id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX",
      "name": "Pánské",
      "handle": "panske",
      "parent_category_id": null,
      "root_category_id": null
    },
    "pcat_01K1RB8G1KN4M1GDGNGDHQTZ1D": {
      "id": "pcat_01K1RB8G1KN4M1GDGNGDHQTZ1D",
      "name": "Oblečení",
      "handle": "obleceni",
      "description": "Pánské oblečení",
      "parent_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8G22NFPVTEJ2NXEK1EB5": {
      "id": "pcat_01K1RB8G22NFPVTEJ2NXEK1EB5",
      "name": "Trika a tílka",
      "handle": "trika-a-tilka",
      "description": "Pánská trika a tílka",
      "parent_category_id": "pcat_01K1RB8G1KN4M1GDGNGDHQTZ1D",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8G2KVYFH1P049EASAHMN": {
      "id": "pcat_01K1RB8G2KVYFH1P049EASAHMN",
      "name": "Krátké rukávy",
      "handle": "kratke-rukavy",
      "parent_category_id": "pcat_01K1RB8G22NFPVTEJ2NXEK1EB5",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8G322KC5XCT61EPH0750": {
      "id": "pcat_01K1RB8G322KC5XCT61EPH0750",
      "name": "Dlouhé rukávy",
      "handle": "dlouhe-rukavy",
      "parent_category_id": "pcat_01K1RB8G22NFPVTEJ2NXEK1EB5",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8G3K4AYVXH2FQGK34747": {
      "id": "pcat_01K1RB8G3K4AYVXH2FQGK34747",
      "name": "Mikiny",
      "handle": "mikiny",
      "description": "Pánské mikiny",
      "parent_category_id": "pcat_01K1RB8G1KN4M1GDGNGDHQTZ1D",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8G42DZZAM0BEHZ5B1D4R": {
      "id": "pcat_01K1RB8G42DZZAM0BEHZ5B1D4R",
      "name": "Na zip",
      "handle": "na-zip",
      "description": "Pánské mikiny na zip",
      "parent_category_id": "pcat_01K1RB8G3K4AYVXH2FQGK34747",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8G4M65DJNZNETQRBGH52": {
      "id": "pcat_01K1RB8G4M65DJNZNETQRBGH52",
      "name": "Přes hlavu",
      "handle": "pres-hlavu",
      "description": "Pánské mikiny přes hlavu",
      "parent_category_id": "pcat_01K1RB8G3K4AYVXH2FQGK34747",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8G52K2KF4M0ZJG1NB58W": {
      "id": "pcat_01K1RB8G52K2KF4M0ZJG1NB58W",
      "name": "Bundy",
      "handle": "bundy",
      "description": "Pánské bundy",
      "parent_category_id": "pcat_01K1RB8G1KN4M1GDGNGDHQTZ1D",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8G5K8NAVPNTMFQPNP3ZF": {
      "id": "pcat_01K1RB8G5K8NAVPNTMFQPNP3ZF",
      "name": "Street",
      "handle": "street",
      "description": "Pánské bundy do města",
      "parent_category_id": "pcat_01K1RB8G52K2KF4M0ZJG1NB58W",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8G63PD8K6JK31CFY4ETC": {
      "id": "pcat_01K1RB8G63PD8K6JK31CFY4ETC",
      "name": "Zimní",
      "handle": "zimni",
      "description": "Pánské zimní bundy",
      "parent_category_id": "pcat_01K1RB8G52K2KF4M0ZJG1NB58W",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8G6M6WR4F2AKTTPKMDSS": {
      "id": "pcat_01K1RB8G6M6WR4F2AKTTPKMDSS",
      "name": "Svetry",
      "handle": "svetry",
      "description": "Pánské svetry",
      "parent_category_id": "pcat_01K1RB8G1KN4M1GDGNGDHQTZ1D",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8G75FEKWR9VYQPJVT0NW": {
      "id": "pcat_01K1RB8G75FEKWR9VYQPJVT0NW",
      "name": "Košile",
      "handle": "kosile",
      "description": "Pánské košile",
      "parent_category_id": "pcat_01K1RB8G1KN4M1GDGNGDHQTZ1D",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8G7KNMHFMKMZ6F1M7WZH": {
      "id": "pcat_01K1RB8G7KNMHFMKMZ6F1M7WZH",
      "name": "Kalhoty",
      "handle": "kalhoty",
      "description": "Pánské kalhoty",
      "parent_category_id": "pcat_01K1RB8G1KN4M1GDGNGDHQTZ1D",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8G82EJ2WEE85X39HHR83": {
      "id": "pcat_01K1RB8G82EJ2WEE85X39HHR83",
      "name": "Street",
      "handle": "street-category-16",
      "description": "Pánské kalhoty pro volný čas",
      "parent_category_id": "pcat_01K1RB8G7KNMHFMKMZ6F1M7WZH",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8G8H6GVT25W97GKGNG9W": {
      "id": "pcat_01K1RB8G8H6GVT25W97GKGNG9W",
      "name": "Zimní",
      "handle": "zimni-category-17",
      "description": "Pánské zimní kalhoty",
      "parent_category_id": "pcat_01K1RB8G7KNMHFMKMZ6F1M7WZH",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8G92QW3VR24QWG3X2V90": {
      "id": "pcat_01K1RB8G92QW3VR24QWG3X2V90",
      "name": "Kraťasy",
      "handle": "kratasy",
      "description": "Pánské kraťasy",
      "parent_category_id": "pcat_01K1RB8G1KN4M1GDGNGDHQTZ1D",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8G9MKY3GT59NYCFVC4R8": {
      "id": "pcat_01K1RB8G9MKY3GT59NYCFVC4R8",
      "name": "Plavky",
      "handle": "plavky",
      "description": "Pánské plavky",
      "parent_category_id": "pcat_01K1RB8G1KN4M1GDGNGDHQTZ1D",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8GA382EKWBZBGY64WHGW": {
      "id": "pcat_01K1RB8GA382EKWBZBGY64WHGW",
      "name": "Doplňky",
      "handle": "doplnky",
      "description": "Pánské doplňky",
      "parent_category_id": "pcat_01K1RB8G1KN4M1GDGNGDHQTZ1D",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8GAHR8NYK9BC3KASR4TC": {
      "id": "pcat_01K1RB8GAHR8NYK9BC3KASR4TC",
      "name": "Boty",
      "handle": "boty",
      "description": "Pánské boty",
      "parent_category_id": "pcat_01K1RB8GA382EKWBZBGY64WHGW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8GAYPB72R9KN75S4SZ5Z": {
      "id": "pcat_01K1RB8GAYPB72R9KN75S4SZ5Z",
      "name": "Street",
      "handle": "street-category-22",
      "description": "Pánské boty",
      "parent_category_id": "pcat_01K1RB8GAHR8NYK9BC3KASR4TC",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8GBDNM6T8B74ZZDQKTMF": {
      "id": "pcat_01K1RB8GBDNM6T8B74ZZDQKTMF",
      "name": "Žabky",
      "handle": "zabky",
      "description": "Pánské žabky",
      "parent_category_id": "pcat_01K1RB8GAHR8NYK9BC3KASR4TC",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8GBTSEZ2X43HXQVJF0F8": {
      "id": "pcat_01K1RB8GBTSEZ2X43HXQVJF0F8",
      "name": "Kulichy",
      "handle": "kulichy",
      "description": "Pánské kulichy",
      "parent_category_id": "pcat_01K1RB8GA382EKWBZBGY64WHGW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8GCB3VC2KXQ47C4S8XJB": {
      "id": "pcat_01K1RB8GCB3VC2KXQ47C4S8XJB",
      "name": "Kšiltovky",
      "handle": "ksiltovky",
      "description": "Pánské kšiltovky",
      "parent_category_id": "pcat_01K1RB8GA382EKWBZBGY64WHGW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8GCXR2KT7HA2AH6QHFSW": {
      "id": "pcat_01K1RB8GCXR2KT7HA2AH6QHFSW",
      "name": "Tašky a batohy",
      "handle": "tasky-a-batohy",
      "description": "Pánské batohy",
      "parent_category_id": "pcat_01K1RB8GA382EKWBZBGY64WHGW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8GDF8KRHJP985HFVDVJY": {
      "id": "pcat_01K1RB8GDF8KRHJP985HFVDVJY",
      "name": "Rukavice",
      "handle": "rukavice",
      "description": "Pánské rukavice",
      "parent_category_id": "pcat_01K1RB8GA382EKWBZBGY64WHGW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8GDYGRRY1FC8XC9VW7YN": {
      "id": "pcat_01K1RB8GDYGRRY1FC8XC9VW7YN",
      "name": "Ponožky",
      "handle": "ponozky",
      "description": "Pánské ponožky",
      "parent_category_id": "pcat_01K1RB8GA382EKWBZBGY64WHGW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8GED44F5AB7DSKA7BAEW": {
      "id": "pcat_01K1RB8GED44F5AB7DSKA7BAEW",
      "name": "Pásky",
      "handle": "pasky",
      "description": "Pánské pásky",
      "parent_category_id": "pcat_01K1RB8GA382EKWBZBGY64WHGW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8GEYH8M3VFAXD9GHZDBY": {
      "id": "pcat_01K1RB8GEYH8M3VFAXD9GHZDBY",
      "name": "Peněženky",
      "handle": "penezenky",
      "description": "Pánské peněženky",
      "parent_category_id": "pcat_01K1RB8GA382EKWBZBGY64WHGW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8GFDEV8T7MVX6TBBJK0H": {
      "id": "pcat_01K1RB8GFDEV8T7MVX6TBBJK0H",
      "name": "Sluneční brýle",
      "handle": "slunecni-bryle",
      "description": "Pánské sluneční brýle",
      "parent_category_id": "pcat_01K1RB8GA382EKWBZBGY64WHGW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8GFY3E8FZ8S01K65WF8C": {
      "id": "pcat_01K1RB8GFY3E8FZ8S01K65WF8C",
      "name": "Ostatní",
      "handle": "ostatni",
      "description": "Ostatní doplňky",
      "parent_category_id": "pcat_01K1RB8GA382EKWBZBGY64WHGW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8GGEPF2Z2SWD3TDTTC5A": {
      "id": "pcat_01K1RB8GGEPF2Z2SWD3TDTTC5A",
      "name": "Cyklo",
      "handle": "cyklo",
      "description": "Pánská cyklistika",
      "parent_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8GGZS38QWGYDGVFZVQWS": {
      "id": "pcat_01K1RB8GGZS38QWGYDGVFZVQWS",
      "name": "Oblečení",
      "handle": "obleceni-category-34",
      "description": "Pánské cyklo oblečení",
      "parent_category_id": "pcat_01K1RB8GGEPF2Z2SWD3TDTTC5A",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8GKB3RJ1A240CWNBHCWX": {
      "id": "pcat_01K1RB8GKB3RJ1A240CWNBHCWX",
      "name": "Kalhoty",
      "handle": "kalhoty-category-39",
      "description": "Pánské cyklo kalhoty",
      "parent_category_id": "pcat_01K1RB8GGZS38QWGYDGVFZVQWS",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8GKTGCW2QABQ9CD1V5T7": {
      "id": "pcat_01K1RB8GKTGCW2QABQ9CD1V5T7",
      "name": "XC/DH (volné)",
      "handle": "xc-dh-volne",
      "description": "Pánské cyklo kalhoty XC/DH",
      "parent_category_id": "pcat_01K1RB8GKB3RJ1A240CWNBHCWX",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8GRDSR99AZSHQQWNHYNH": {
      "id": "pcat_01K1RB8GRDSR99AZSHQQWNHYNH",
      "name": "Ponožky",
      "handle": "ponozky-category-49",
      "description": "Pánské cyklo ponožky",
      "parent_category_id": "pcat_01K1RB8GGZS38QWGYDGVFZVQWS",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8GSWXHCZZGDY3XGJG99G": {
      "id": "pcat_01K1RB8GSWXHCZZGDY3XGJG99G",
      "name": "Doplňky",
      "handle": "doplnky-category-52",
      "description": "Cyklistické doplňky",
      "parent_category_id": "pcat_01K1RB8GGZS38QWGYDGVFZVQWS",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8GVBNK4XVFCVQNP1FSK7": {
      "id": "pcat_01K1RB8GVBNK4XVFCVQNP1FSK7",
      "name": "Ostatní",
      "handle": "ostatni-category-55",
      "description": "Ostatní doplňky",
      "parent_category_id": "pcat_01K1RB8GSWXHCZZGDY3XGJG99G",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8H6C4NCW44SKVHF9G21B": {
      "id": "pcat_01K1RB8H6C4NCW44SKVHF9G21B",
      "name": "Moto",
      "handle": "moto",
      "description": "Pánské moto vybavení",
      "parent_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8HG8ES3FY7871PEY71A1": {
      "id": "pcat_01K1RB8HG8ES3FY7871PEY71A1",
      "name": "Doplňky",
      "handle": "doplnky-category-98",
      "description": "Pánské moto doplňky",
      "parent_category_id": "pcat_01K1RB8H6C4NCW44SKVHF9G21B",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8HH87HQG6456G9V2EDN6": {
      "id": "pcat_01K1RB8HH87HQG6456G9V2EDN6",
      "name": "Ostatní",
      "handle": "ostatni-category-100",
      "description": "Ostatní moto doplňky",
      "parent_category_id": "pcat_01K1RB8HG8ES3FY7871PEY71A1",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8HJ89KCYN54F4AZ0N1YS": {
      "id": "pcat_01K1RB8HJ89KCYN54F4AZ0N1YS",
      "name": "Snb-Skate",
      "handle": "snb-skate",
      "description": "Pánský snowboarding a skateboarding",
      "parent_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8HJQTH3Z7NQHDVNKW4NW": {
      "id": "pcat_01K1RB8HJQTH3Z7NQHDVNKW4NW",
      "name": "Snowboarding",
      "handle": "snowboarding",
      "description": "Pánský snowboarding",
      "parent_category_id": "pcat_01K1RB8HJ89KCYN54F4AZ0N1YS",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8HNNTJ4RFTZK38KE12GW": {
      "id": "pcat_01K1RB8HNNTJ4RFTZK38KE12GW",
      "name": "Bundy",
      "handle": "bundy-category-109",
      "description": "Pánské zimní bundy",
      "parent_category_id": "pcat_01K1RB8HJQTH3Z7NQHDVNKW4NW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8HP4NX291QW6JV5M74GR": {
      "id": "pcat_01K1RB8HP4NX291QW6JV5M74GR",
      "name": "Kalhoty",
      "handle": "kalhoty-category-110",
      "description": "Pánské zimní kalhoty",
      "parent_category_id": "pcat_01K1RB8HJQTH3Z7NQHDVNKW4NW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8HPKCS46X8FDTDYS9R3H": {
      "id": "pcat_01K1RB8HPKCS46X8FDTDYS9R3H",
      "name": "Rukavice",
      "handle": "rukavice-category-111",
      "description": "Pánské zimní rukavice",
      "parent_category_id": "pcat_01K1RB8HJQTH3Z7NQHDVNKW4NW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8HQ0JK3PXSZ0TFWQ54H6": {
      "id": "pcat_01K1RB8HQ0JK3PXSZ0TFWQ54H6",
      "name": "Kulichy",
      "handle": "kulichy-category-112",
      "description": "Pánské zimní kulichy",
      "parent_category_id": "pcat_01K1RB8HJQTH3Z7NQHDVNKW4NW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8HTCNMB33QK2C7NJR5ZW": {
      "id": "pcat_01K1RB8HTCNMB33QK2C7NJR5ZW",
      "name": "Ski",
      "handle": "ski",
      "description": "Pánské vybavení pro lyžaře",
      "parent_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8HTVJH9W5NE6SQSSDQBN": {
      "id": "pcat_01K1RB8HTVJH9W5NE6SQSSDQBN",
      "name": "Oblečení",
      "handle": "obleceni-category-120",
      "description": "Pánské zimní oblečení",
      "parent_category_id": "pcat_01K1RB8HTCNMB33QK2C7NJR5ZW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8HVATG7AJYP99Y83B0YA": {
      "id": "pcat_01K1RB8HVATG7AJYP99Y83B0YA",
      "name": "Bundy",
      "handle": "bundy-category-121",
      "description": "Pánské zimní bundy",
      "parent_category_id": "pcat_01K1RB8HTVJH9W5NE6SQSSDQBN",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8HVSWXAWST5R680TKG5A": {
      "id": "pcat_01K1RB8HVSWXAWST5R680TKG5A",
      "name": "Kalhoty",
      "handle": "kalhoty-category-122",
      "description": "Pánské zimní kalhoty",
      "parent_category_id": "pcat_01K1RB8HTVJH9W5NE6SQSSDQBN",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8HWC2789BSH9VV94QD40": {
      "id": "pcat_01K1RB8HWC2789BSH9VV94QD40",
      "name": "Rukavice",
      "handle": "rukavice-category-123",
      "description": "Pánské zimní rukavice",
      "parent_category_id": "pcat_01K1RB8HTVJH9W5NE6SQSSDQBN",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8HWX662Q6SQQBWQSKXCR": {
      "id": "pcat_01K1RB8HWX662Q6SQQBWQSKXCR",
      "name": "Kulichy",
      "handle": "kulichy-category-124",
      "description": "Pánské zimní kulichy",
      "parent_category_id": "pcat_01K1RB8HTVJH9W5NE6SQSSDQBN",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8HXVKPVAXN5KBJWH46QA": {
      "id": "pcat_01K1RB8HXVKPVAXN5KBJWH46QA",
      "name": "Doplňky",
      "handle": "doplnky-category-126",
      "description": "Pánské zimní doplňky",
      "parent_category_id": "pcat_01K1RB8HTCNMB33QK2C7NJR5ZW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8J0699NT92CG6NBK3H9M": {
      "id": "pcat_01K1RB8J0699NT92CG6NBK3H9M",
      "name": "Batohy",
      "handle": "batohy",
      "description": "Pánské batohy",
      "parent_category_id": "pcat_01K1RB8HXVKPVAXN5KBJWH46QA",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8J0QHSR8AB4C0W3CAVKP": {
      "id": "pcat_01K1RB8J0QHSR8AB4C0W3CAVKP",
      "name": "Sluneční brýle",
      "handle": "slunecni-bryle-category-132",
      "description": "Pánské sluneční brýle",
      "parent_category_id": "pcat_01K1RB8HXVKPVAXN5KBJWH46QA",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8J18WSQP4T07YS5EXQ3V": {
      "id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V",
      "name": "Dámské",
      "handle": "damske",
      "parent_category_id": null,
      "root_category_id": null
    },
    "pcat_01K1RB8J1Q7BEA61JK1ZNCW1NA": {
      "id": "pcat_01K1RB8J1Q7BEA61JK1ZNCW1NA",
      "name": "Oblečení",
      "handle": "obleceni-category-134",
      "description": "Dámské oblečení",
      "parent_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8J26341CPGHSEB6FQZH9": {
      "id": "pcat_01K1RB8J26341CPGHSEB6FQZH9",
      "name": "Trika a tílka",
      "handle": "trika-a-tilka-category-135",
      "description": "Dámská trika a tílka",
      "parent_category_id": "pcat_01K1RB8J1Q7BEA61JK1ZNCW1NA",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8J2KZTCKVCWDNTDE33T4": {
      "id": "pcat_01K1RB8J2KZTCKVCWDNTDE33T4",
      "name": "Krátké rukávy",
      "handle": "kratke-rukavy-category-136",
      "description": "Dámská trika s krátkými rukávy",
      "parent_category_id": "pcat_01K1RB8J26341CPGHSEB6FQZH9",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8J349N2WC10BC1A1XZBH": {
      "id": "pcat_01K1RB8J349N2WC10BC1A1XZBH",
      "name": "Dlouhé rukávy",
      "handle": "dlouhe-rukavy-category-137",
      "description": "Dámská trika s dlouhými rukávy",
      "parent_category_id": "pcat_01K1RB8J26341CPGHSEB6FQZH9",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8J3J4P3W6FNG3PPVETN9": {
      "id": "pcat_01K1RB8J3J4P3W6FNG3PPVETN9",
      "name": "Mikiny",
      "handle": "mikiny-category-138",
      "description": "Dámské mikiny",
      "parent_category_id": "pcat_01K1RB8J1Q7BEA61JK1ZNCW1NA",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8J44XAVF7ZMBVP0CS1PX": {
      "id": "pcat_01K1RB8J44XAVF7ZMBVP0CS1PX",
      "name": "Na zip",
      "handle": "na-zip-category-139",
      "description": "Dámské mikiny na zip",
      "parent_category_id": "pcat_01K1RB8J3J4P3W6FNG3PPVETN9",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8J4JNFATW8H1DSXHXBVZ": {
      "id": "pcat_01K1RB8J4JNFATW8H1DSXHXBVZ",
      "name": "Přes hlavu",
      "handle": "pres-hlavu-category-140",
      "description": "Dámské mikiny přes hlavu",
      "parent_category_id": "pcat_01K1RB8J3J4P3W6FNG3PPVETN9",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8J50WM9DWJ515NBRNTBC": {
      "id": "pcat_01K1RB8J50WM9DWJ515NBRNTBC",
      "name": "Bundy",
      "handle": "bundy-category-141",
      "description": "Dámské bundy",
      "parent_category_id": "pcat_01K1RB8J1Q7BEA61JK1ZNCW1NA",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8J5DTJFSRXBE4RXG43WP": {
      "id": "pcat_01K1RB8J5DTJFSRXBE4RXG43WP",
      "name": "Street",
      "handle": "street-category-142",
      "description": "Dámské bundy pro volný čas",
      "parent_category_id": "pcat_01K1RB8J50WM9DWJ515NBRNTBC",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8J5ZK4EJBCHHGKVV1WQZ": {
      "id": "pcat_01K1RB8J5ZK4EJBCHHGKVV1WQZ",
      "name": "Zimní",
      "handle": "zimni-category-143",
      "description": "Dámské zimní bundy",
      "parent_category_id": "pcat_01K1RB8J50WM9DWJ515NBRNTBC",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8J6EGSN0QE2B0AXZ4SKC": {
      "id": "pcat_01K1RB8J6EGSN0QE2B0AXZ4SKC",
      "name": "Svetry",
      "handle": "svetry-category-144",
      "description": "Dámské svetry",
      "parent_category_id": "pcat_01K1RB8J1Q7BEA61JK1ZNCW1NA",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8J6Y2KT8CW2RQ16JG1PE": {
      "id": "pcat_01K1RB8J6Y2KT8CW2RQ16JG1PE",
      "name": "Košile",
      "handle": "kosile-category-145",
      "description": "Dámské košile",
      "parent_category_id": "pcat_01K1RB8J1Q7BEA61JK1ZNCW1NA",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8J7DW042RTPWCBVBXH53": {
      "id": "pcat_01K1RB8J7DW042RTPWCBVBXH53",
      "name": "Kalhoty",
      "handle": "kalhoty-category-146",
      "description": "Dámské kalhoty",
      "parent_category_id": "pcat_01K1RB8J1Q7BEA61JK1ZNCW1NA",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8J7WB2Q9V7HWG4D3CESP": {
      "id": "pcat_01K1RB8J7WB2Q9V7HWG4D3CESP",
      "name": "Street",
      "handle": "street-category-147",
      "description": "Dámské kalhoty pro volný čas",
      "parent_category_id": "pcat_01K1RB8J7DW042RTPWCBVBXH53",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8J8DZSB3KNT8XCMPVAQC": {
      "id": "pcat_01K1RB8J8DZSB3KNT8XCMPVAQC",
      "name": "Zimní",
      "handle": "zimni-category-148",
      "description": "Dámské zimní kalhoty",
      "parent_category_id": "pcat_01K1RB8J7DW042RTPWCBVBXH53",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8J8Y0PR4GBPFT19ET0SV": {
      "id": "pcat_01K1RB8J8Y0PR4GBPFT19ET0SV",
      "name": "Kraťasy",
      "handle": "kratasy-category-149",
      "description": "Dámské šortky",
      "parent_category_id": "pcat_01K1RB8J1Q7BEA61JK1ZNCW1NA",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8J9F9RPEJJ23Z8KA4AJW": {
      "id": "pcat_01K1RB8J9F9RPEJJ23Z8KA4AJW",
      "name": "Plavky",
      "handle": "plavky-category-150",
      "description": "Dámské plavky",
      "parent_category_id": "pcat_01K1RB8J1Q7BEA61JK1ZNCW1NA",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8J9YCTA5RKQMSVVGMDS4": {
      "id": "pcat_01K1RB8J9YCTA5RKQMSVVGMDS4",
      "name": "Šaty a sukně",
      "handle": "saty-a-sukne",
      "description": "Dámské šaty a sukně",
      "parent_category_id": "pcat_01K1RB8J1Q7BEA61JK1ZNCW1NA",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8JADGFFJXSHEAYP9A8T2": {
      "id": "pcat_01K1RB8JADGFFJXSHEAYP9A8T2",
      "name": "Doplňky",
      "handle": "doplnky-category-152",
      "description": "Dámské doplňky",
      "parent_category_id": "pcat_01K1RB8J1Q7BEA61JK1ZNCW1NA",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8JAWN8MFBXGSRMG5VGR3": {
      "id": "pcat_01K1RB8JAWN8MFBXGSRMG5VGR3",
      "name": "Boty",
      "handle": "boty-category-153",
      "description": "Dámské boty",
      "parent_category_id": "pcat_01K1RB8JADGFFJXSHEAYP9A8T2",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8JBWKBDHPA3GEVV1V5YC": {
      "id": "pcat_01K1RB8JBWKBDHPA3GEVV1V5YC",
      "name": "Žabky",
      "handle": "zabky-category-155",
      "description": "Dámské žabky a sandály",
      "parent_category_id": "pcat_01K1RB8JAWN8MFBXGSRMG5VGR3",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8JCD4R0NKCWRP16B19J5": {
      "id": "pcat_01K1RB8JCD4R0NKCWRP16B19J5",
      "name": "Kulichy",
      "handle": "kulichy-category-156",
      "description": "Dámské kulichy",
      "parent_category_id": "pcat_01K1RB8JADGFFJXSHEAYP9A8T2",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8JCWQDMKYZZTWDF30J7B": {
      "id": "pcat_01K1RB8JCWQDMKYZZTWDF30J7B",
      "name": "Kšiltovky",
      "handle": "ksiltovky-category-157",
      "description": "Dámské kšiltovky",
      "parent_category_id": "pcat_01K1RB8JADGFFJXSHEAYP9A8T2",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8JDEJR7FW9PY3MSG9NGQ": {
      "id": "pcat_01K1RB8JDEJR7FW9PY3MSG9NGQ",
      "name": "Tašky a batohy",
      "handle": "tasky-a-batohy-category-158",
      "description": "Dámské batohy a kabelky",
      "parent_category_id": "pcat_01K1RB8JADGFFJXSHEAYP9A8T2",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8JDWRFRBQQ6KDQKB1WP2": {
      "id": "pcat_01K1RB8JDWRFRBQQ6KDQKB1WP2",
      "name": "Rukavice",
      "handle": "rukavice-category-159",
      "description": "Dámské rukavice",
      "parent_category_id": "pcat_01K1RB8JADGFFJXSHEAYP9A8T2",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8JENFMRDS6E7PTXYEACW": {
      "id": "pcat_01K1RB8JENFMRDS6E7PTXYEACW",
      "name": "Ponožky",
      "handle": "ponozky-category-160",
      "description": "Dámské ponožky",
      "parent_category_id": "pcat_01K1RB8JADGFFJXSHEAYP9A8T2",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8JG7HQHHG8A25R9K7HKC": {
      "id": "pcat_01K1RB8JG7HQHHG8A25R9K7HKC",
      "name": "Sluneční brýle",
      "handle": "slunecni-bryle-category-163",
      "description": "Dámské sluneční brýle",
      "parent_category_id": "pcat_01K1RB8JADGFFJXSHEAYP9A8T2",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8JGNFW4SKT22RM2ME8X9": {
      "id": "pcat_01K1RB8JGNFW4SKT22RM2ME8X9",
      "name": "Ostatní",
      "handle": "ostatni-category-164",
      "description": "Ostatní doplňky",
      "parent_category_id": "pcat_01K1RB8JADGFFJXSHEAYP9A8T2",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8JH43Y80Y0599VB4NWZ5": {
      "id": "pcat_01K1RB8JH43Y80Y0599VB4NWZ5",
      "name": "Cyklo",
      "handle": "cyklo-category-165",
      "description": "Dámská cyklistika",
      "parent_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8JHQMMXK70R6JGCSFE5H": {
      "id": "pcat_01K1RB8JHQMMXK70R6JGCSFE5H",
      "name": "Oblečení",
      "handle": "obleceni-category-166",
      "description": "Dámské cyklo oblečení",
      "parent_category_id": "pcat_01K1RB8JH43Y80Y0599VB4NWZ5",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8JKHB9RJQWYPRW51QCY1": {
      "id": "pcat_01K1RB8JKHB9RJQWYPRW51QCY1",
      "name": "Bundy",
      "handle": "bundy-category-170",
      "description": "Dámské cyklo bundy",
      "parent_category_id": "pcat_01K1RB8JHQMMXK70R6JGCSFE5H",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8JNJ50AYCQ72T5SAP90W": {
      "id": "pcat_01K1RB8JNJ50AYCQ72T5SAP90W",
      "name": "Kraťasy",
      "handle": "kratasy-category-174",
      "description": "Dámské cyklo kraťasy",
      "parent_category_id": "pcat_01K1RB8JHQMMXK70R6JGCSFE5H",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8JP3B26C5CR1SWXYWPGM": {
      "id": "pcat_01K1RB8JP3B26C5CR1SWXYWPGM",
      "name": "XC/DH (volné)",
      "handle": "xc-dh-volne-category-175",
      "description": "Dámské cyklo šortky volné",
      "parent_category_id": "pcat_01K1RB8JNJ50AYCQ72T5SAP90W",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8JPJD29HFJ0QS52V9M4X": {
      "id": "pcat_01K1RB8JPJD29HFJ0QS52V9M4X",
      "name": "Bib (elastické)",
      "handle": "bib-elasticke-category-176",
      "description": "Dámské cyklo šortky elastické",
      "parent_category_id": "pcat_01K1RB8JNJ50AYCQ72T5SAP90W",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8JQ06DHD9SQK1W12HMD8": {
      "id": "pcat_01K1RB8JQ06DHD9SQK1W12HMD8",
      "name": "Rukavice",
      "handle": "rukavice-category-177",
      "description": "Dámské cyklo rukavice",
      "parent_category_id": "pcat_01K1RB8JHQMMXK70R6JGCSFE5H",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8JQJ6EYA4V4V73VFDACS": {
      "id": "pcat_01K1RB8JQJ6EYA4V4V73VFDACS",
      "name": "Dlouhé",
      "handle": "dlouhe-category-178",
      "description": "Dámské cyklo rukavice dlouhé",
      "parent_category_id": "pcat_01K1RB8JQ06DHD9SQK1W12HMD8",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8JR1ES9GX5Z7NPGR511N": {
      "id": "pcat_01K1RB8JR1ES9GX5Z7NPGR511N",
      "name": "Krátké",
      "handle": "kratke-category-179",
      "description": "Dámské cyklo rukavice krátké",
      "parent_category_id": "pcat_01K1RB8JQ06DHD9SQK1W12HMD8",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8JS0W97FTTXF8CP2Y1VN": {
      "id": "pcat_01K1RB8JS0W97FTTXF8CP2Y1VN",
      "name": "Ponožky",
      "handle": "ponozky-category-181",
      "description": "Dámské cyklo ponožky",
      "parent_category_id": "pcat_01K1RB8JHQMMXK70R6JGCSFE5H",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8JTJV3Y5NMEPSY16MNDQ": {
      "id": "pcat_01K1RB8JTJV3Y5NMEPSY16MNDQ",
      "name": "Doplňky",
      "handle": "doplnky-category-184",
      "description": "Dámské cyklo doplňky",
      "parent_category_id": "pcat_01K1RB8JHQMMXK70R6JGCSFE5H",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8JW0Q2TQGE0YTZ6C8JMA": {
      "id": "pcat_01K1RB8JW0Q2TQGE0YTZ6C8JMA",
      "name": "Ostatní",
      "handle": "ostatni-category-187",
      "description": "Ostatní doplňky",
      "parent_category_id": "pcat_01K1RB8JTJV3Y5NMEPSY16MNDQ",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8KJ8AFR3ENNMEK6YTJX8": {
      "id": "pcat_01K1RB8KJ8AFR3ENNMEK6YTJX8",
      "name": "Snb-Skate",
      "handle": "snb-skate-category-233",
      "description": "Dámský snowboarding a skateboarding",
      "parent_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8KJSNPKQPFKMK8QCJQYZ": {
      "id": "pcat_01K1RB8KJSNPKQPFKMK8QCJQYZ",
      "name": "Snowboarding",
      "handle": "snowboarding-category-234",
      "description": "Dámský snowboarding",
      "parent_category_id": "pcat_01K1RB8KJ8AFR3ENNMEK6YTJX8",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8KNVFF0PMD55Z5XB5469": {
      "id": "pcat_01K1RB8KNVFF0PMD55Z5XB5469",
      "name": "Bundy",
      "handle": "bundy-category-240",
      "description": "Dámské zimní bundy",
      "parent_category_id": "pcat_01K1RB8KJSNPKQPFKMK8QCJQYZ",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8KPAZQ509BGGAZXWB2NM": {
      "id": "pcat_01K1RB8KPAZQ509BGGAZXWB2NM",
      "name": "Kalhoty",
      "handle": "kalhoty-category-241",
      "description": "Dámské zimní kalhoty",
      "parent_category_id": "pcat_01K1RB8KJSNPKQPFKMK8QCJQYZ",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8KPS9ZHXD3K5VAD87QBF": {
      "id": "pcat_01K1RB8KPS9ZHXD3K5VAD87QBF",
      "name": "Rukavice",
      "handle": "rukavice-category-242",
      "description": "Dámské zimní rukavice",
      "parent_category_id": "pcat_01K1RB8KJSNPKQPFKMK8QCJQYZ",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8KQAGZ7B6WT4Q9G4Y91V": {
      "id": "pcat_01K1RB8KQAGZ7B6WT4Q9G4Y91V",
      "name": "Kulichy",
      "handle": "kulichy-category-243",
      "description": "Dámské zimní kulichy",
      "parent_category_id": "pcat_01K1RB8KJSNPKQPFKMK8QCJQYZ",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8KVCXVAG3N85BSYPGHKC": {
      "id": "pcat_01K1RB8KVCXVAG3N85BSYPGHKC",
      "name": "Ski",
      "handle": "ski-category-251",
      "description": "Dámské vybavení pro lyžaře",
      "parent_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8KVWCJAXBDDPR1H3T9V0": {
      "id": "pcat_01K1RB8KVWCJAXBDDPR1H3T9V0",
      "name": "Oblečení",
      "handle": "obleceni-category-252",
      "description": "Dámské zimní oblečení",
      "parent_category_id": "pcat_01K1RB8KVCXVAG3N85BSYPGHKC",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8KWE2JPGPDQVFH0BCKT9": {
      "id": "pcat_01K1RB8KWE2JPGPDQVFH0BCKT9",
      "name": "Bundy",
      "handle": "bundy-category-253",
      "description": "Dámské zimní bundy",
      "parent_category_id": "pcat_01K1RB8KVWCJAXBDDPR1H3T9V0",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8KWXS5316M51TZYW26YW": {
      "id": "pcat_01K1RB8KWXS5316M51TZYW26YW",
      "name": "Kalhoty",
      "handle": "kalhoty-category-254",
      "description": "Dámské zimní kalhoty",
      "parent_category_id": "pcat_01K1RB8KVWCJAXBDDPR1H3T9V0",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8KXA7E1RFCZ9HAV36NNB": {
      "id": "pcat_01K1RB8KXA7E1RFCZ9HAV36NNB",
      "name": "Rukavice",
      "handle": "rukavice-category-255",
      "description": "Dámské zimní rukavice",
      "parent_category_id": "pcat_01K1RB8KVWCJAXBDDPR1H3T9V0",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8KXS5F3ZB4JDXD9NDMPY": {
      "id": "pcat_01K1RB8KXS5F3ZB4JDXD9NDMPY",
      "name": "Kulichy",
      "handle": "kulichy-category-256",
      "description": "Dámské zimní kulichy",
      "parent_category_id": "pcat_01K1RB8KVWCJAXBDDPR1H3T9V0",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8KYPA0P85FKQ2NPYVCS5": {
      "id": "pcat_01K1RB8KYPA0P85FKQ2NPYVCS5",
      "name": "Doplňky",
      "handle": "doplnky-category-258",
      "description": "Dámské zimní doplňky",
      "parent_category_id": "pcat_01K1RB8KVCXVAG3N85BSYPGHKC",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8M1ATZG7Y7R2KFWPMSN5": {
      "id": "pcat_01K1RB8M1ATZG7Y7R2KFWPMSN5",
      "name": "Batohy",
      "handle": "batohy-category-263",
      "description": "Dámské batohy",
      "parent_category_id": "pcat_01K1RB8KYPA0P85FKQ2NPYVCS5",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8M1S12PRYAEQ5S45W22E": {
      "id": "pcat_01K1RB8M1S12PRYAEQ5S45W22E",
      "name": "Sluneční brýle",
      "handle": "slunecni-bryle-category-264",
      "description": "Dámské sluneční brýle",
      "parent_category_id": "pcat_01K1RB8KYPA0P85FKQ2NPYVCS5",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8": {
      "id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8",
      "name": "Dětské",
      "handle": "detske",
      "parent_category_id": null,
      "root_category_id": null
    },
    "pcat_01K1RB8M2V65T9Q08MCZ0DAHW3": {
      "id": "pcat_01K1RB8M2V65T9Q08MCZ0DAHW3",
      "name": "Oblečení",
      "handle": "obleceni-category-266",
      "description": "Dětské oblečení",
      "parent_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    "pcat_01K1RB8M3ABD3W1HJDDH77QTK9": {
      "id": "pcat_01K1RB8M3ABD3W1HJDDH77QTK9",
      "name": "Trika a tílka",
      "handle": "trika-a-tilka-category-267",
      "description": "Dětská trička",
      "parent_category_id": "pcat_01K1RB8M2V65T9Q08MCZ0DAHW3",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    "pcat_01K1RB8M3V3BZFQZVZSAK5PXY0": {
      "id": "pcat_01K1RB8M3V3BZFQZVZSAK5PXY0",
      "name": "Krátké rukávy",
      "handle": "kratke-rukavy-category-268",
      "description": "Dětská trička s krátkými rukávy",
      "parent_category_id": "pcat_01K1RB8M3ABD3W1HJDDH77QTK9",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    "pcat_01K1RB8M4ANEVV7381SPNDHSMJ": {
      "id": "pcat_01K1RB8M4ANEVV7381SPNDHSMJ",
      "name": "Dlouhé rukávy",
      "handle": "dlouhe-rukavy-category-269",
      "description": "Dětská trička s dlouhými rukávy",
      "parent_category_id": "pcat_01K1RB8M3ABD3W1HJDDH77QTK9",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    "pcat_01K1RB8M4SVFDX4VW001M0TQ7Z": {
      "id": "pcat_01K1RB8M4SVFDX4VW001M0TQ7Z",
      "name": "Mikiny",
      "handle": "mikiny-category-270",
      "description": "Dětské mikiny",
      "parent_category_id": "pcat_01K1RB8M2V65T9Q08MCZ0DAHW3",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    "pcat_01K1RB8M5TQE14SMWM6S7VAP5A": {
      "id": "pcat_01K1RB8M5TQE14SMWM6S7VAP5A",
      "name": "Přes hlavu",
      "handle": "pres-hlavu-category-272",
      "description": "Dětské mikiny přes hlavu",
      "parent_category_id": "pcat_01K1RB8M4SVFDX4VW001M0TQ7Z",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    "pcat_01K1RB8M69E5FWCSEB0PPWGX94": {
      "id": "pcat_01K1RB8M69E5FWCSEB0PPWGX94",
      "name": "Bundy",
      "handle": "bundy-category-273",
      "description": "Dětské bundy",
      "parent_category_id": "pcat_01K1RB8M2V65T9Q08MCZ0DAHW3",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    "pcat_01K1RB8M6Q6M3XTJ47TCCZ2E93": {
      "id": "pcat_01K1RB8M6Q6M3XTJ47TCCZ2E93",
      "name": "Street",
      "handle": "street-category-274",
      "description": "Dětské bundy pro volný čas",
      "parent_category_id": "pcat_01K1RB8M69E5FWCSEB0PPWGX94",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    "pcat_01K1RB8M76KEN6R6XMA7NWNQZ4": {
      "id": "pcat_01K1RB8M76KEN6R6XMA7NWNQZ4",
      "name": "Zimní",
      "handle": "zimni-category-275",
      "description": "Dětské zimní bundy",
      "parent_category_id": "pcat_01K1RB8M69E5FWCSEB0PPWGX94",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    "pcat_01K1RB8M7NT8A13DGAN2H9A7YJ": {
      "id": "pcat_01K1RB8M7NT8A13DGAN2H9A7YJ",
      "name": "Kalhoty",
      "handle": "kalhoty-category-276",
      "description": "Dětské kalhoty",
      "parent_category_id": "pcat_01K1RB8M2V65T9Q08MCZ0DAHW3",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    "pcat_01K1RB8M84R3F4YXNHSTBQCCB2": {
      "id": "pcat_01K1RB8M84R3F4YXNHSTBQCCB2",
      "name": "Street",
      "handle": "street-category-277",
      "description": "Dětské kalhoty pro volný čas",
      "parent_category_id": "pcat_01K1RB8M7NT8A13DGAN2H9A7YJ",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    "pcat_01K1RB8M8N4FM3AY51A99FFVC4": {
      "id": "pcat_01K1RB8M8N4FM3AY51A99FFVC4",
      "name": "Zimní",
      "handle": "zimni-category-278",
      "description": "Dětské zimní kalhoty",
      "parent_category_id": "pcat_01K1RB8M7NT8A13DGAN2H9A7YJ",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    "pcat_01K1RB8M981EYEMCJPJFK3M4Z0": {
      "id": "pcat_01K1RB8M981EYEMCJPJFK3M4Z0",
      "name": "Kraťasy",
      "handle": "kratasy-category-279",
      "description": "Dětské kraťasy",
      "parent_category_id": "pcat_01K1RB8M2V65T9Q08MCZ0DAHW3",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    "pcat_01K1RB8M9QQXT1XF4WR1JYVJ2T": {
      "id": "pcat_01K1RB8M9QQXT1XF4WR1JYVJ2T",
      "name": "Plavky",
      "handle": "plavky-category-280",
      "description": "Dětské plavky",
      "parent_category_id": "pcat_01K1RB8M2V65T9Q08MCZ0DAHW3",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    "pcat_01K1RB8MA6N7BK5DTQH87ENA2Y": {
      "id": "pcat_01K1RB8MA6N7BK5DTQH87ENA2Y",
      "name": "Doplňky",
      "handle": "doplnky-category-281",
      "description": "Dětské doplňky",
      "parent_category_id": "pcat_01K1RB8M2V65T9Q08MCZ0DAHW3",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    "pcat_01K1RB8MAS5PX17DREZTWX98HY": {
      "id": "pcat_01K1RB8MAS5PX17DREZTWX98HY",
      "name": "Boty",
      "handle": "boty-category-282",
      "description": "Dětské boty",
      "parent_category_id": "pcat_01K1RB8MA6N7BK5DTQH87ENA2Y",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    "pcat_01K1RB8MB6YTGE50Y76E8H21HR": {
      "id": "pcat_01K1RB8MB6YTGE50Y76E8H21HR",
      "name": "Kulichy",
      "handle": "kulichy-category-283",
      "description": "Dětské kulichy",
      "parent_category_id": "pcat_01K1RB8MA6N7BK5DTQH87ENA2Y",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    "pcat_01K1RB8MBNWA70QYKEMH7H2WJX": {
      "id": "pcat_01K1RB8MBNWA70QYKEMH7H2WJX",
      "name": "Kšiltovky",
      "handle": "ksiltovky-category-284",
      "description": "Dětské kšiltovky",
      "parent_category_id": "pcat_01K1RB8MA6N7BK5DTQH87ENA2Y",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    "pcat_01K1RB8MC6RP6BB60ZZZZCBMQK": {
      "id": "pcat_01K1RB8MC6RP6BB60ZZZZCBMQK",
      "name": "Rukavice",
      "handle": "rukavice-category-285",
      "description": "Dětské rukavice",
      "parent_category_id": "pcat_01K1RB8MA6N7BK5DTQH87ENA2Y",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    "pcat_01K1RB8MD7R883PNKHYEZ1J659": {
      "id": "pcat_01K1RB8MD7R883PNKHYEZ1J659",
      "name": "Ostatní",
      "handle": "ostatni-category-287",
      "description": "Ostatní doplňky",
      "parent_category_id": "pcat_01K1RB8MA6N7BK5DTQH87ENA2Y",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    "pcat_01K1RB8MZ5FJCTF87D7MD5XZJ0": {
      "id": "pcat_01K1RB8MZ5FJCTF87D7MD5XZJ0",
      "name": "Snb-Skate",
      "handle": "snb-skate-category-323",
      "description": "Dětský skateboarding a snowboarding",
      "parent_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    "pcat_01K1RB8MZN3T4V66NEAKX9PV9X": {
      "id": "pcat_01K1RB8MZN3T4V66NEAKX9PV9X",
      "name": "Snowboarding",
      "handle": "snowboarding-category-324",
      "description": "Dětský snowboarding",
      "parent_category_id": "pcat_01K1RB8MZ5FJCTF87D7MD5XZJ0",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    "pcat_01K1RB8N2HA00C869DRPHQD0ZM": {
      "id": "pcat_01K1RB8N2HA00C869DRPHQD0ZM",
      "name": "Bundy",
      "handle": "bundy-category-330",
      "description": "Dětské zimní bundy",
      "parent_category_id": "pcat_01K1RB8MZN3T4V66NEAKX9PV9X",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    "pcat_01K1RB8N30MECRNYV0N1Q2RBRA": {
      "id": "pcat_01K1RB8N30MECRNYV0N1Q2RBRA",
      "name": "Kalhoty",
      "handle": "kalhoty-category-331",
      "description": "Dětské zimní kalhoty",
      "parent_category_id": "pcat_01K1RB8MZN3T4V66NEAKX9PV9X",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    "pcat_01K1RB8N3FJ31VKM1DJAM6SQHA": {
      "id": "pcat_01K1RB8N3FJ31VKM1DJAM6SQHA",
      "name": "Rukavice",
      "handle": "rukavice-category-332",
      "description": "Dětské zimní rukavice",
      "parent_category_id": "pcat_01K1RB8MZN3T4V66NEAKX9PV9X",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    "pcat_01K1RB8N400MPJPYD72TV1E8GB": {
      "id": "pcat_01K1RB8N400MPJPYD72TV1E8GB",
      "name": "Kulichy",
      "handle": "kulichy-category-333",
      "description": "Dětské kulichy",
      "parent_category_id": "pcat_01K1RB8MZN3T4V66NEAKX9PV9X",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    "pcat_01K1RB8N5CT9KCN8N5HWDFHGTJ": {
      "id": "pcat_01K1RB8N5CT9KCN8N5HWDFHGTJ",
      "name": "Ski",
      "handle": "ski-category-336",
      "description": "Dětské vybavení pro lyžaře",
      "parent_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    "pcat_01K1RB8N5TM4PQRVH7A0R3Z422": {
      "id": "pcat_01K1RB8N5TM4PQRVH7A0R3Z422",
      "name": "Oblečení",
      "handle": "obleceni-category-337",
      "description": "Dětské zimní oblečení",
      "parent_category_id": "pcat_01K1RB8N5CT9KCN8N5HWDFHGTJ",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    "pcat_01K1RB8N69MHDJ8XZS50AR8N7Z": {
      "id": "pcat_01K1RB8N69MHDJ8XZS50AR8N7Z",
      "name": "Bundy",
      "handle": "bundy-category-338",
      "description": "Dětské zimní bundy",
      "parent_category_id": "pcat_01K1RB8N5TM4PQRVH7A0R3Z422",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    "pcat_01K1RB8N6WMWY1424JTBS3XR55": {
      "id": "pcat_01K1RB8N6WMWY1424JTBS3XR55",
      "name": "Kalhoty",
      "handle": "kalhoty-category-339",
      "description": "Dětské zimní kalhoty",
      "parent_category_id": "pcat_01K1RB8N5TM4PQRVH7A0R3Z422",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    "pcat_01K1RB8N7GA2N5AJDW5M1734KJ": {
      "id": "pcat_01K1RB8N7GA2N5AJDW5M1734KJ",
      "name": "Rukavice",
      "handle": "rukavice-category-340",
      "description": "Dětské zimní rukavice",
      "parent_category_id": "pcat_01K1RB8N5TM4PQRVH7A0R3Z422",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    "pcat_01K1RB8N85RD1EEF80JZW4SQ6E": {
      "id": "pcat_01K1RB8N85RD1EEF80JZW4SQ6E",
      "name": "Kulichy",
      "handle": "kulichy-category-341",
      "description": "Dětské zimní kulichy",
      "parent_category_id": "pcat_01K1RB8N5TM4PQRVH7A0R3Z422",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    "pcat_01K1RB8NB8TRB5G0QREENGXNBH": {
      "id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH",
      "name": "Oblečení",
      "handle": "obleceni-category-347",
      "parent_category_id": null,
      "root_category_id": null
    },
    "pcat_01K1RB8NBSQ39G72J5E3SENF7K": {
      "id": "pcat_01K1RB8NBSQ39G72J5E3SENF7K",
      "name": "Trika a tílka",
      "handle": "trika-a-tilka-category-348",
      "parent_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    "pcat_01K1RB8NC71VA05V7PQC5ZPQKJ": {
      "id": "pcat_01K1RB8NC71VA05V7PQC5ZPQKJ",
      "name": "Krátké rukávy",
      "handle": "kratke-rukavy-category-349",
      "description": "Trika s krátkými rukávy",
      "parent_category_id": "pcat_01K1RB8NBSQ39G72J5E3SENF7K",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    "pcat_01K1RB8NCPJ9X4NAA9DFT1RAS5": {
      "id": "pcat_01K1RB8NCPJ9X4NAA9DFT1RAS5",
      "name": "Dlouhé rukávy",
      "handle": "dlouhe-rukavy-category-350",
      "description": "Trika s dlouhými rukávy",
      "parent_category_id": "pcat_01K1RB8NBSQ39G72J5E3SENF7K",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    "pcat_01K1RB8ND8B29HDGCZ349NM632": {
      "id": "pcat_01K1RB8ND8B29HDGCZ349NM632",
      "name": "Mikiny",
      "handle": "mikiny-category-351",
      "parent_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    "pcat_01K1RB8NDSY4KAVFFQVRNP2KAD": {
      "id": "pcat_01K1RB8NDSY4KAVFFQVRNP2KAD",
      "name": "Na zip",
      "handle": "na-zip-category-352",
      "description": "Mikiny na zip",
      "parent_category_id": "pcat_01K1RB8ND8B29HDGCZ349NM632",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    "pcat_01K1RB8NEB67KSN2VHMBT1XNX7": {
      "id": "pcat_01K1RB8NEB67KSN2VHMBT1XNX7",
      "name": "Přes hlavu",
      "handle": "pres-hlavu-category-353",
      "description": "Mikiny přes hlavu",
      "parent_category_id": "pcat_01K1RB8ND8B29HDGCZ349NM632",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    "pcat_01K1RB8NEXMD6RSK1CGG87C181": {
      "id": "pcat_01K1RB8NEXMD6RSK1CGG87C181",
      "name": "Bundy",
      "handle": "bundy-category-354",
      "parent_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    "pcat_01K1RB8NFE134QRXKQF9KNK28B": {
      "id": "pcat_01K1RB8NFE134QRXKQF9KNK28B",
      "name": "Street",
      "handle": "street-category-355",
      "parent_category_id": "pcat_01K1RB8NEXMD6RSK1CGG87C181",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    "pcat_01K1RB8NFX27RB9VYAD56GGEAQ": {
      "id": "pcat_01K1RB8NFX27RB9VYAD56GGEAQ",
      "name": "Zimní",
      "handle": "zimni-category-356",
      "parent_category_id": "pcat_01K1RB8NEXMD6RSK1CGG87C181",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    "pcat_01K1RB8NGE2SFRGFA86DE4D9ZP": {
      "id": "pcat_01K1RB8NGE2SFRGFA86DE4D9ZP",
      "name": "Svetry",
      "handle": "svetry-category-357",
      "parent_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    "pcat_01K1RB8NH0F36WEX2E8B2SYCM7": {
      "id": "pcat_01K1RB8NH0F36WEX2E8B2SYCM7",
      "name": "Košile",
      "handle": "kosile-category-358",
      "parent_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    "pcat_01K1RB8NHEXW9WKYHF80S97KDM": {
      "id": "pcat_01K1RB8NHEXW9WKYHF80S97KDM",
      "name": "Kalhoty",
      "handle": "kalhoty-category-359",
      "parent_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    "pcat_01K1RB8NHXCGCK5HSE4AJZDW7D": {
      "id": "pcat_01K1RB8NHXCGCK5HSE4AJZDW7D",
      "name": "Street",
      "handle": "street-category-360",
      "parent_category_id": "pcat_01K1RB8NHEXW9WKYHF80S97KDM",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    "pcat_01K1RB8NJDPKTC2B04RMHG7R3N": {
      "id": "pcat_01K1RB8NJDPKTC2B04RMHG7R3N",
      "name": "Zimní",
      "handle": "zimni-category-361",
      "parent_category_id": "pcat_01K1RB8NHEXW9WKYHF80S97KDM",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    "pcat_01K1RB8NJXBPCGP1KWQ3Y2FBQ6": {
      "id": "pcat_01K1RB8NJXBPCGP1KWQ3Y2FBQ6",
      "name": "Kraťasy",
      "handle": "kratasy-category-362",
      "parent_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    "pcat_01K1RB8NKC9HCMYHN07ZQQEJJC": {
      "id": "pcat_01K1RB8NKC9HCMYHN07ZQQEJJC",
      "name": "Plavky",
      "handle": "plavky-category-363",
      "parent_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    "pcat_01K1RB8NKWNC7D303770YS2K0E": {
      "id": "pcat_01K1RB8NKWNC7D303770YS2K0E",
      "name": "Doplňky",
      "handle": "doplnky-category-364",
      "parent_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    "pcat_01K1RB8NMA1FXYQ3MXGPH4R9EV": {
      "id": "pcat_01K1RB8NMA1FXYQ3MXGPH4R9EV",
      "name": "Boty",
      "handle": "boty-category-365",
      "parent_category_id": "pcat_01K1RB8NKWNC7D303770YS2K0E",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    "pcat_01K1RB8NMVY99XGBKDR7G0BHPX": {
      "id": "pcat_01K1RB8NMVY99XGBKDR7G0BHPX",
      "name": "Street",
      "handle": "street-category-366",
      "parent_category_id": "pcat_01K1RB8NMA1FXYQ3MXGPH4R9EV",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    "pcat_01K1RB8NNA02G0XSYX53AJME1F": {
      "id": "pcat_01K1RB8NNA02G0XSYX53AJME1F",
      "name": "Žabky",
      "handle": "zabky-category-367",
      "parent_category_id": "pcat_01K1RB8NMA1FXYQ3MXGPH4R9EV",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    "pcat_01K1RB8NNV4Z3GTQH30V97KYM3": {
      "id": "pcat_01K1RB8NNV4Z3GTQH30V97KYM3",
      "name": "Kulichy",
      "handle": "kulichy-category-368",
      "parent_category_id": "pcat_01K1RB8NKWNC7D303770YS2K0E",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    "pcat_01K1RB8NPAHV74FE2NV2YZNCVF": {
      "id": "pcat_01K1RB8NPAHV74FE2NV2YZNCVF",
      "name": "Kšiltovky",
      "handle": "ksiltovky-category-369",
      "parent_category_id": "pcat_01K1RB8NKWNC7D303770YS2K0E",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    "pcat_01K1RB8NPVJRWP76HBVYXJT0WV": {
      "id": "pcat_01K1RB8NPVJRWP76HBVYXJT0WV",
      "name": "Tašky a batohy",
      "handle": "tasky-a-batohy-category-370",
      "parent_category_id": "pcat_01K1RB8NKWNC7D303770YS2K0E",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    "pcat_01K1RB8NQA35Z8YWZNTHZG0MS0": {
      "id": "pcat_01K1RB8NQA35Z8YWZNTHZG0MS0",
      "name": "Rukavice",
      "handle": "rukavice-category-371",
      "parent_category_id": "pcat_01K1RB8NKWNC7D303770YS2K0E",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    "pcat_01K1RB8NQVRZQ1ASF9NPJNF2MT": {
      "id": "pcat_01K1RB8NQVRZQ1ASF9NPJNF2MT",
      "name": "Ponožky",
      "handle": "ponozky-category-372",
      "parent_category_id": "pcat_01K1RB8NKWNC7D303770YS2K0E",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    "pcat_01K1RB8NRC4JBNQT75YG3QSYE1": {
      "id": "pcat_01K1RB8NRC4JBNQT75YG3QSYE1",
      "name": "Pásky",
      "handle": "pasky-category-373",
      "parent_category_id": "pcat_01K1RB8NKWNC7D303770YS2K0E",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    "pcat_01K1RB8NRVDT8RDBTJY8MTT1FQ": {
      "id": "pcat_01K1RB8NRVDT8RDBTJY8MTT1FQ",
      "name": "Peněženky",
      "handle": "penezenky-category-374",
      "parent_category_id": "pcat_01K1RB8NKWNC7D303770YS2K0E",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    "pcat_01K1RB8NSC13G25VGJ5TBZQVE3": {
      "id": "pcat_01K1RB8NSC13G25VGJ5TBZQVE3",
      "name": "Sluneční brýle",
      "handle": "slunecni-bryle-category-375",
      "parent_category_id": "pcat_01K1RB8NKWNC7D303770YS2K0E",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    "pcat_01K1RB8NSXP1QHK971R2NWAZ2Y": {
      "id": "pcat_01K1RB8NSXP1QHK971R2NWAZ2Y",
      "name": "Ostatní",
      "handle": "ostatni-category-376",
      "parent_category_id": "pcat_01K1RB8NKWNC7D303770YS2K0E",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    "pcat_01K1RB8NTFXA34QE8EK857A57F": {
      "id": "pcat_01K1RB8NTFXA34QE8EK857A57F",
      "name": "Šaty a sukně",
      "handle": "saty-a-sukne-category-377",
      "parent_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR": {
      "id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR",
      "name": "Cyklo",
      "handle": "cyklo-category-378",
      "parent_category_id": null,
      "root_category_id": null
    },
    "pcat_01K1RB8NVFXNHP325802DJR651": {
      "id": "pcat_01K1RB8NVFXNHP325802DJR651",
      "name": "Oblečení",
      "handle": "obleceni-category-379",
      "parent_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    "pcat_01K1RB8NXVKJM5Y7Q0B5TMDP6Q": {
      "id": "pcat_01K1RB8NXVKJM5Y7Q0B5TMDP6Q",
      "name": "Bundy",
      "handle": "bundy-category-383",
      "parent_category_id": "pcat_01K1RB8NVFXNHP325802DJR651",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    "pcat_01K1RB8NY8BM0JQZVXC7HYBWWB": {
      "id": "pcat_01K1RB8NY8BM0JQZVXC7HYBWWB",
      "name": "Kalhoty",
      "handle": "kalhoty-category-384",
      "parent_category_id": "pcat_01K1RB8NVFXNHP325802DJR651",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    "pcat_01K1RB8NYSDBP1F5DWC21K33FT": {
      "id": "pcat_01K1RB8NYSDBP1F5DWC21K33FT",
      "name": "XC/DH (volné)",
      "handle": "xc-dh-volne-category-385",
      "parent_category_id": "pcat_01K1RB8NY8BM0JQZVXC7HYBWWB",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    "pcat_01K1RB8NZTGM708V9ST8FB2652": {
      "id": "pcat_01K1RB8NZTGM708V9ST8FB2652",
      "name": "Kraťasy",
      "handle": "kratasy-category-387",
      "parent_category_id": "pcat_01K1RB8NVFXNHP325802DJR651",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    "pcat_01K1RB8P08XYEY5K37A6NN7ZAQ": {
      "id": "pcat_01K1RB8P08XYEY5K37A6NN7ZAQ",
      "name": "XC/DH (volné)",
      "handle": "xc-dh-volne-category-388",
      "parent_category_id": "pcat_01K1RB8NZTGM708V9ST8FB2652",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    "pcat_01K1RB8P0SG93RV3W9PGK45AQJ": {
      "id": "pcat_01K1RB8P0SG93RV3W9PGK45AQJ",
      "name": "Bib (elastické)",
      "handle": "bib-elasticke-category-389",
      "parent_category_id": "pcat_01K1RB8NZTGM708V9ST8FB2652",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    "pcat_01K1RB8P18611Z2PAVRKHFBQEB": {
      "id": "pcat_01K1RB8P18611Z2PAVRKHFBQEB",
      "name": "Rukavice",
      "handle": "rukavice-category-390",
      "parent_category_id": "pcat_01K1RB8NVFXNHP325802DJR651",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    "pcat_01K1RB8P1N88H5J6JPESKVYJAK": {
      "id": "pcat_01K1RB8P1N88H5J6JPESKVYJAK",
      "name": "Dlouhé",
      "handle": "dlouhe-category-391",
      "parent_category_id": "pcat_01K1RB8P18611Z2PAVRKHFBQEB",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    "pcat_01K1RB8P27PE61MP06F4QDSQXT": {
      "id": "pcat_01K1RB8P27PE61MP06F4QDSQXT",
      "name": "Krátké",
      "handle": "kratke-category-392",
      "parent_category_id": "pcat_01K1RB8P18611Z2PAVRKHFBQEB",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    "pcat_01K1RB8P36CJVDYD8TGNS2QXEC": {
      "id": "pcat_01K1RB8P36CJVDYD8TGNS2QXEC",
      "name": "Ponožky",
      "handle": "ponozky-category-394",
      "parent_category_id": "pcat_01K1RB8NVFXNHP325802DJR651",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    "pcat_01K1RB8P4NAANW9488G1NY6JRD": {
      "id": "pcat_01K1RB8P4NAANW9488G1NY6JRD",
      "name": "Doplňky",
      "handle": "doplnky-category-397",
      "parent_category_id": "pcat_01K1RB8NVFXNHP325802DJR651",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    "pcat_01K1RB8P64SFEP6M7VB69FW1EH": {
      "id": "pcat_01K1RB8P64SFEP6M7VB69FW1EH",
      "name": "Ostatní",
      "handle": "ostatni-category-400",
      "parent_category_id": "pcat_01K1RB8P4NAANW9488G1NY6JRD",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    "pcat_01K1RB8PJFP4GJVX6P1Z2WF4YD": {
      "id": "pcat_01K1RB8PJFP4GJVX6P1Z2WF4YD",
      "name": "Moto",
      "handle": "moto-category-424",
      "parent_category_id": null,
      "root_category_id": null
    },
    "pcat_01K1RB8PWAKZDB307746HW64YV": {
      "id": "pcat_01K1RB8PWAKZDB307746HW64YV",
      "name": "Doplňky",
      "handle": "doplnky-category-444",
      "parent_category_id": "pcat_01K1RB8PJFP4GJVX6P1Z2WF4YD",
      "root_category_id": "pcat_01K1RB8PJFP4GJVX6P1Z2WF4YD"
    },
    "pcat_01K1RB8PXB66KVHA3Q4FSS5D5V": {
      "id": "pcat_01K1RB8PXB66KVHA3Q4FSS5D5V",
      "name": "Ostatní",
      "handle": "ostatni-category-446",
      "parent_category_id": "pcat_01K1RB8PWAKZDB307746HW64YV",
      "root_category_id": "pcat_01K1RB8PJFP4GJVX6P1Z2WF4YD"
    },
    "pcat_01K1RB8PY751XV9DETPGD1VE0P": {
      "id": "pcat_01K1RB8PY751XV9DETPGD1VE0P",
      "name": "Snb-Skate",
      "handle": "snb-skate-category-448",
      "parent_category_id": null,
      "root_category_id": null
    },
    "pcat_01K1RB8PYR5G4Z4PZDHSCQ66XR": {
      "id": "pcat_01K1RB8PYR5G4Z4PZDHSCQ66XR",
      "name": "Snowboarding",
      "handle": "snowboarding-category-449",
      "parent_category_id": "pcat_01K1RB8PY751XV9DETPGD1VE0P",
      "root_category_id": "pcat_01K1RB8PY751XV9DETPGD1VE0P"
    },
    "pcat_01K1RB8Q1PMNQR30WV2BWTD768": {
      "id": "pcat_01K1RB8Q1PMNQR30WV2BWTD768",
      "name": "Bundy",
      "handle": "bundy-category-455",
      "parent_category_id": "pcat_01K1RB8PYR5G4Z4PZDHSCQ66XR",
      "root_category_id": "pcat_01K1RB8PY751XV9DETPGD1VE0P"
    },
    "pcat_01K1RB8Q25X4DK2N59SE5F83A3": {
      "id": "pcat_01K1RB8Q25X4DK2N59SE5F83A3",
      "name": "Kalhoty",
      "handle": "kalhoty-category-456",
      "parent_category_id": "pcat_01K1RB8PYR5G4Z4PZDHSCQ66XR",
      "root_category_id": "pcat_01K1RB8PY751XV9DETPGD1VE0P"
    },
    "pcat_01K1RB8Q2PBP1A8MFSH0YZMQYT": {
      "id": "pcat_01K1RB8Q2PBP1A8MFSH0YZMQYT",
      "name": "Rukavice",
      "handle": "rukavice-category-457",
      "parent_category_id": "pcat_01K1RB8PYR5G4Z4PZDHSCQ66XR",
      "root_category_id": "pcat_01K1RB8PY751XV9DETPGD1VE0P"
    },
    "pcat_01K1RB8Q375A8TBV8BH2SD2BM2": {
      "id": "pcat_01K1RB8Q375A8TBV8BH2SD2BM2",
      "name": "Kulichy",
      "handle": "kulichy-category-458",
      "parent_category_id": "pcat_01K1RB8PYR5G4Z4PZDHSCQ66XR",
      "root_category_id": "pcat_01K1RB8PY751XV9DETPGD1VE0P"
    },
    "pcat_01K1RB8Q77BWFKT63XBZRQ84BR": {
      "id": "pcat_01K1RB8Q77BWFKT63XBZRQ84BR",
      "name": "Ski",
      "handle": "ski-category-466",
      "parent_category_id": null,
      "root_category_id": null
    },
    "pcat_01K1RB8Q7P2QPY98AFRK2MWTSG": {
      "id": "pcat_01K1RB8Q7P2QPY98AFRK2MWTSG",
      "name": "Oblečení",
      "handle": "obleceni-category-467",
      "parent_category_id": "pcat_01K1RB8Q77BWFKT63XBZRQ84BR",
      "root_category_id": "pcat_01K1RB8Q77BWFKT63XBZRQ84BR"
    },
    "pcat_01K1RB8Q89WGTW50FKQVXAJBBT": {
      "id": "pcat_01K1RB8Q89WGTW50FKQVXAJBBT",
      "name": "Bundy",
      "handle": "bundy-category-468",
      "parent_category_id": "pcat_01K1RB8Q7P2QPY98AFRK2MWTSG",
      "root_category_id": "pcat_01K1RB8Q77BWFKT63XBZRQ84BR"
    },
    "pcat_01K1RB8Q8R0ZT6CN297BY5FFY6": {
      "id": "pcat_01K1RB8Q8R0ZT6CN297BY5FFY6",
      "name": "Kalhoty",
      "handle": "kalhoty-category-469",
      "parent_category_id": "pcat_01K1RB8Q7P2QPY98AFRK2MWTSG",
      "root_category_id": "pcat_01K1RB8Q77BWFKT63XBZRQ84BR"
    },
    "pcat_01K1RB8Q97KJCSCWPV4KBCNX50": {
      "id": "pcat_01K1RB8Q97KJCSCWPV4KBCNX50",
      "name": "Rukavice",
      "handle": "rukavice-category-470",
      "parent_category_id": "pcat_01K1RB8Q7P2QPY98AFRK2MWTSG",
      "root_category_id": "pcat_01K1RB8Q77BWFKT63XBZRQ84BR"
    },
    "pcat_01K1RB8Q9PX4F7YQX91Z7QCE6F": {
      "id": "pcat_01K1RB8Q9PX4F7YQX91Z7QCE6F",
      "name": "Kulichy",
      "handle": "kulichy-category-471",
      "parent_category_id": "pcat_01K1RB8Q7P2QPY98AFRK2MWTSG",
      "root_category_id": "pcat_01K1RB8Q77BWFKT63XBZRQ84BR"
    },
    "pcat_01K1RB8QAM7PEWEJPFTYN6F6V0": {
      "id": "pcat_01K1RB8QAM7PEWEJPFTYN6F6V0",
      "name": "Doplňky",
      "handle": "doplnky-category-473",
      "parent_category_id": "pcat_01K1RB8Q77BWFKT63XBZRQ84BR",
      "root_category_id": "pcat_01K1RB8Q77BWFKT63XBZRQ84BR"
    },
    "pcat_01K1RB8QD1Y229MDCZR7BSVAYB": {
      "id": "pcat_01K1RB8QD1Y229MDCZR7BSVAYB",
      "name": "Batohy",
      "handle": "batohy-category-478",
      "parent_category_id": "pcat_01K1RB8QAM7PEWEJPFTYN6F6V0",
      "root_category_id": "pcat_01K1RB8Q77BWFKT63XBZRQ84BR"
    },
    "pcat_01K1RB8QDJWB1DXBQWK24P5P0X": {
      "id": "pcat_01K1RB8QDJWB1DXBQWK24P5P0X",
      "name": "Sluneční brýle",
      "handle": "slunecni-bryle-category-479",
      "parent_category_id": "pcat_01K1RB8QAM7PEWEJPFTYN6F6V0",
      "root_category_id": "pcat_01K1RB8Q77BWFKT63XBZRQ84BR"
    },
    "pcat_01K1RB8V8TJ5JG4A88WYJR5EVQ": {
      "id": "pcat_01K1RB8V8TJ5JG4A88WYJR5EVQ",
      "name": "Náhradní díly",
      "handle": "nahradni-dily-category-728",
      "parent_category_id": "pcat_01K1RB8HJQTH3Z7NQHDVNKW4NW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    "pcat_01K1RB8V9P6NKQ7K4HZ9772PTP": {
      "id": "pcat_01K1RB8V9P6NKQ7K4HZ9772PTP",
      "name": "Náhradní díly",
      "handle": "nahradni-dily-category-730",
      "parent_category_id": "pcat_01K1RB8PYR5G4Z4PZDHSCQ66XR",
      "root_category_id": "pcat_01K1RB8PY751XV9DETPGD1VE0P"
    },
    "pcat_01K1RB8WRDHF58XJCTDCFVER91": {
      "id": "pcat_01K1RB8WRDHF58XJCTDCFVER91",
      "name": "Doplňky",
      "handle": "doplnky-komponenty",
      "parent_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    "pcat_01K1RB8WZ7GH22HXP62J83GSH5": {
      "id": "pcat_01K1RB8WZ7GH22HXP62J83GSH5",
      "name": "Lahve",
      "handle": "lahve",
      "parent_category_id": "pcat_01K1RB8WRDHF58XJCTDCFVER91",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    }
  },
  "leafCategories": [
    {
      "id": "pcat_01K1RB8G2KVYFH1P049EASAHMN",
      "name": "Krátké rukávy",
      "handle": "kratke-rukavy",
      "parent_category_id": "pcat_01K1RB8G22NFPVTEJ2NXEK1EB5",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8G322KC5XCT61EPH0750",
      "name": "Dlouhé rukávy",
      "handle": "dlouhe-rukavy",
      "parent_category_id": "pcat_01K1RB8G22NFPVTEJ2NXEK1EB5",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8G42DZZAM0BEHZ5B1D4R",
      "name": "Na zip",
      "handle": "na-zip",
      "parent_category_id": "pcat_01K1RB8G3K4AYVXH2FQGK34747",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8G4M65DJNZNETQRBGH52",
      "name": "Přes hlavu",
      "handle": "pres-hlavu",
      "parent_category_id": "pcat_01K1RB8G3K4AYVXH2FQGK34747",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8G5K8NAVPNTMFQPNP3ZF",
      "name": "Street",
      "handle": "street",
      "parent_category_id": "pcat_01K1RB8G52K2KF4M0ZJG1NB58W",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8G63PD8K6JK31CFY4ETC",
      "name": "Zimní",
      "handle": "zimni",
      "parent_category_id": "pcat_01K1RB8G52K2KF4M0ZJG1NB58W",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8G6M6WR4F2AKTTPKMDSS",
      "name": "Svetry",
      "handle": "svetry",
      "parent_category_id": "pcat_01K1RB8G1KN4M1GDGNGDHQTZ1D",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8G75FEKWR9VYQPJVT0NW",
      "name": "Košile",
      "handle": "kosile",
      "parent_category_id": "pcat_01K1RB8G1KN4M1GDGNGDHQTZ1D",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8G82EJ2WEE85X39HHR83",
      "name": "Street",
      "handle": "street-category-16",
      "parent_category_id": "pcat_01K1RB8G7KNMHFMKMZ6F1M7WZH",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8G8H6GVT25W97GKGNG9W",
      "name": "Zimní",
      "handle": "zimni-category-17",
      "parent_category_id": "pcat_01K1RB8G7KNMHFMKMZ6F1M7WZH",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8G92QW3VR24QWG3X2V90",
      "name": "Kraťasy",
      "handle": "kratasy",
      "parent_category_id": "pcat_01K1RB8G1KN4M1GDGNGDHQTZ1D",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8G9MKY3GT59NYCFVC4R8",
      "name": "Plavky",
      "handle": "plavky",
      "parent_category_id": "pcat_01K1RB8G1KN4M1GDGNGDHQTZ1D",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8GAYPB72R9KN75S4SZ5Z",
      "name": "Street",
      "handle": "street-category-22",
      "parent_category_id": "pcat_01K1RB8GAHR8NYK9BC3KASR4TC",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8GBDNM6T8B74ZZDQKTMF",
      "name": "Žabky",
      "handle": "zabky",
      "parent_category_id": "pcat_01K1RB8GAHR8NYK9BC3KASR4TC",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8GBTSEZ2X43HXQVJF0F8",
      "name": "Kulichy",
      "handle": "kulichy",
      "parent_category_id": "pcat_01K1RB8GA382EKWBZBGY64WHGW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8GCB3VC2KXQ47C4S8XJB",
      "name": "Kšiltovky",
      "handle": "ksiltovky",
      "parent_category_id": "pcat_01K1RB8GA382EKWBZBGY64WHGW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8GCXR2KT7HA2AH6QHFSW",
      "name": "Tašky a batohy",
      "handle": "tasky-a-batohy",
      "parent_category_id": "pcat_01K1RB8GA382EKWBZBGY64WHGW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8GDF8KRHJP985HFVDVJY",
      "name": "Rukavice",
      "handle": "rukavice",
      "parent_category_id": "pcat_01K1RB8GA382EKWBZBGY64WHGW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8GDYGRRY1FC8XC9VW7YN",
      "name": "Ponožky",
      "handle": "ponozky",
      "parent_category_id": "pcat_01K1RB8GA382EKWBZBGY64WHGW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8GED44F5AB7DSKA7BAEW",
      "name": "Pásky",
      "handle": "pasky",
      "parent_category_id": "pcat_01K1RB8GA382EKWBZBGY64WHGW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8GEYH8M3VFAXD9GHZDBY",
      "name": "Peněženky",
      "handle": "penezenky",
      "parent_category_id": "pcat_01K1RB8GA382EKWBZBGY64WHGW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8GFDEV8T7MVX6TBBJK0H",
      "name": "Sluneční brýle",
      "handle": "slunecni-bryle",
      "parent_category_id": "pcat_01K1RB8GA382EKWBZBGY64WHGW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8GFY3E8FZ8S01K65WF8C",
      "name": "Ostatní",
      "handle": "ostatni",
      "parent_category_id": "pcat_01K1RB8GA382EKWBZBGY64WHGW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8GKTGCW2QABQ9CD1V5T7",
      "name": "XC/DH (volné)",
      "handle": "xc-dh-volne",
      "parent_category_id": "pcat_01K1RB8GKB3RJ1A240CWNBHCWX",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8GRDSR99AZSHQQWNHYNH",
      "name": "Ponožky",
      "handle": "ponozky-category-49",
      "parent_category_id": "pcat_01K1RB8GGZS38QWGYDGVFZVQWS",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8GVBNK4XVFCVQNP1FSK7",
      "name": "Ostatní",
      "handle": "ostatni-category-55",
      "parent_category_id": "pcat_01K1RB8GSWXHCZZGDY3XGJG99G",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8HH87HQG6456G9V2EDN6",
      "name": "Ostatní",
      "handle": "ostatni-category-100",
      "parent_category_id": "pcat_01K1RB8HG8ES3FY7871PEY71A1",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8HNNTJ4RFTZK38KE12GW",
      "name": "Bundy",
      "handle": "bundy-category-109",
      "parent_category_id": "pcat_01K1RB8HJQTH3Z7NQHDVNKW4NW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8HP4NX291QW6JV5M74GR",
      "name": "Kalhoty",
      "handle": "kalhoty-category-110",
      "parent_category_id": "pcat_01K1RB8HJQTH3Z7NQHDVNKW4NW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8HPKCS46X8FDTDYS9R3H",
      "name": "Rukavice",
      "handle": "rukavice-category-111",
      "parent_category_id": "pcat_01K1RB8HJQTH3Z7NQHDVNKW4NW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8HQ0JK3PXSZ0TFWQ54H6",
      "name": "Kulichy",
      "handle": "kulichy-category-112",
      "parent_category_id": "pcat_01K1RB8HJQTH3Z7NQHDVNKW4NW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8V8TJ5JG4A88WYJR5EVQ",
      "name": "Náhradní díly",
      "handle": "nahradni-dily-category-728",
      "parent_category_id": "pcat_01K1RB8HJQTH3Z7NQHDVNKW4NW",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8HVATG7AJYP99Y83B0YA",
      "name": "Bundy",
      "handle": "bundy-category-121",
      "parent_category_id": "pcat_01K1RB8HTVJH9W5NE6SQSSDQBN",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8HVSWXAWST5R680TKG5A",
      "name": "Kalhoty",
      "handle": "kalhoty-category-122",
      "parent_category_id": "pcat_01K1RB8HTVJH9W5NE6SQSSDQBN",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8HWC2789BSH9VV94QD40",
      "name": "Rukavice",
      "handle": "rukavice-category-123",
      "parent_category_id": "pcat_01K1RB8HTVJH9W5NE6SQSSDQBN",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8HWX662Q6SQQBWQSKXCR",
      "name": "Kulichy",
      "handle": "kulichy-category-124",
      "parent_category_id": "pcat_01K1RB8HTVJH9W5NE6SQSSDQBN",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8J0699NT92CG6NBK3H9M",
      "name": "Batohy",
      "handle": "batohy",
      "parent_category_id": "pcat_01K1RB8HXVKPVAXN5KBJWH46QA",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8J0QHSR8AB4C0W3CAVKP",
      "name": "Sluneční brýle",
      "handle": "slunecni-bryle-category-132",
      "parent_category_id": "pcat_01K1RB8HXVKPVAXN5KBJWH46QA",
      "root_category_id": "pcat_01K1RB8G14ZMGF4QJRVFDMWXQX"
    },
    {
      "id": "pcat_01K1RB8J2KZTCKVCWDNTDE33T4",
      "name": "Krátké rukávy",
      "handle": "kratke-rukavy-category-136",
      "parent_category_id": "pcat_01K1RB8J26341CPGHSEB6FQZH9",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8J349N2WC10BC1A1XZBH",
      "name": "Dlouhé rukávy",
      "handle": "dlouhe-rukavy-category-137",
      "parent_category_id": "pcat_01K1RB8J26341CPGHSEB6FQZH9",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8J44XAVF7ZMBVP0CS1PX",
      "name": "Na zip",
      "handle": "na-zip-category-139",
      "parent_category_id": "pcat_01K1RB8J3J4P3W6FNG3PPVETN9",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8J4JNFATW8H1DSXHXBVZ",
      "name": "Přes hlavu",
      "handle": "pres-hlavu-category-140",
      "parent_category_id": "pcat_01K1RB8J3J4P3W6FNG3PPVETN9",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8J5DTJFSRXBE4RXG43WP",
      "name": "Street",
      "handle": "street-category-142",
      "parent_category_id": "pcat_01K1RB8J50WM9DWJ515NBRNTBC",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8J5ZK4EJBCHHGKVV1WQZ",
      "name": "Zimní",
      "handle": "zimni-category-143",
      "parent_category_id": "pcat_01K1RB8J50WM9DWJ515NBRNTBC",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8J6EGSN0QE2B0AXZ4SKC",
      "name": "Svetry",
      "handle": "svetry-category-144",
      "parent_category_id": "pcat_01K1RB8J1Q7BEA61JK1ZNCW1NA",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8J6Y2KT8CW2RQ16JG1PE",
      "name": "Košile",
      "handle": "kosile-category-145",
      "parent_category_id": "pcat_01K1RB8J1Q7BEA61JK1ZNCW1NA",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8J7WB2Q9V7HWG4D3CESP",
      "name": "Street",
      "handle": "street-category-147",
      "parent_category_id": "pcat_01K1RB8J7DW042RTPWCBVBXH53",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8J8DZSB3KNT8XCMPVAQC",
      "name": "Zimní",
      "handle": "zimni-category-148",
      "parent_category_id": "pcat_01K1RB8J7DW042RTPWCBVBXH53",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8J8Y0PR4GBPFT19ET0SV",
      "name": "Kraťasy",
      "handle": "kratasy-category-149",
      "parent_category_id": "pcat_01K1RB8J1Q7BEA61JK1ZNCW1NA",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8J9F9RPEJJ23Z8KA4AJW",
      "name": "Plavky",
      "handle": "plavky-category-150",
      "parent_category_id": "pcat_01K1RB8J1Q7BEA61JK1ZNCW1NA",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8J9YCTA5RKQMSVVGMDS4",
      "name": "Šaty a sukně",
      "handle": "saty-a-sukne",
      "parent_category_id": "pcat_01K1RB8J1Q7BEA61JK1ZNCW1NA",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JBWKBDHPA3GEVV1V5YC",
      "name": "Žabky",
      "handle": "zabky-category-155",
      "parent_category_id": "pcat_01K1RB8JAWN8MFBXGSRMG5VGR3",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JCD4R0NKCWRP16B19J5",
      "name": "Kulichy",
      "handle": "kulichy-category-156",
      "parent_category_id": "pcat_01K1RB8JADGFFJXSHEAYP9A8T2",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JCWQDMKYZZTWDF30J7B",
      "name": "Kšiltovky",
      "handle": "ksiltovky-category-157",
      "parent_category_id": "pcat_01K1RB8JADGFFJXSHEAYP9A8T2",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JDEJR7FW9PY3MSG9NGQ",
      "name": "Tašky a batohy",
      "handle": "tasky-a-batohy-category-158",
      "parent_category_id": "pcat_01K1RB8JADGFFJXSHEAYP9A8T2",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JDWRFRBQQ6KDQKB1WP2",
      "name": "Rukavice",
      "handle": "rukavice-category-159",
      "parent_category_id": "pcat_01K1RB8JADGFFJXSHEAYP9A8T2",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JENFMRDS6E7PTXYEACW",
      "name": "Ponožky",
      "handle": "ponozky-category-160",
      "parent_category_id": "pcat_01K1RB8JADGFFJXSHEAYP9A8T2",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JG7HQHHG8A25R9K7HKC",
      "name": "Sluneční brýle",
      "handle": "slunecni-bryle-category-163",
      "parent_category_id": "pcat_01K1RB8JADGFFJXSHEAYP9A8T2",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JGNFW4SKT22RM2ME8X9",
      "name": "Ostatní",
      "handle": "ostatni-category-164",
      "parent_category_id": "pcat_01K1RB8JADGFFJXSHEAYP9A8T2",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JKHB9RJQWYPRW51QCY1",
      "name": "Bundy",
      "handle": "bundy-category-170",
      "parent_category_id": "pcat_01K1RB8JHQMMXK70R6JGCSFE5H",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JP3B26C5CR1SWXYWPGM",
      "name": "XC/DH (volné)",
      "handle": "xc-dh-volne-category-175",
      "parent_category_id": "pcat_01K1RB8JNJ50AYCQ72T5SAP90W",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JPJD29HFJ0QS52V9M4X",
      "name": "Bib (elastické)",
      "handle": "bib-elasticke-category-176",
      "parent_category_id": "pcat_01K1RB8JNJ50AYCQ72T5SAP90W",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JQJ6EYA4V4V73VFDACS",
      "name": "Dlouhé",
      "handle": "dlouhe-category-178",
      "parent_category_id": "pcat_01K1RB8JQ06DHD9SQK1W12HMD8",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JR1ES9GX5Z7NPGR511N",
      "name": "Krátké",
      "handle": "kratke-category-179",
      "parent_category_id": "pcat_01K1RB8JQ06DHD9SQK1W12HMD8",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JS0W97FTTXF8CP2Y1VN",
      "name": "Ponožky",
      "handle": "ponozky-category-181",
      "parent_category_id": "pcat_01K1RB8JHQMMXK70R6JGCSFE5H",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8JW0Q2TQGE0YTZ6C8JMA",
      "name": "Ostatní",
      "handle": "ostatni-category-187",
      "parent_category_id": "pcat_01K1RB8JTJV3Y5NMEPSY16MNDQ",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8KNVFF0PMD55Z5XB5469",
      "name": "Bundy",
      "handle": "bundy-category-240",
      "parent_category_id": "pcat_01K1RB8KJSNPKQPFKMK8QCJQYZ",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8KPAZQ509BGGAZXWB2NM",
      "name": "Kalhoty",
      "handle": "kalhoty-category-241",
      "parent_category_id": "pcat_01K1RB8KJSNPKQPFKMK8QCJQYZ",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8KPS9ZHXD3K5VAD87QBF",
      "name": "Rukavice",
      "handle": "rukavice-category-242",
      "parent_category_id": "pcat_01K1RB8KJSNPKQPFKMK8QCJQYZ",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8KQAGZ7B6WT4Q9G4Y91V",
      "name": "Kulichy",
      "handle": "kulichy-category-243",
      "parent_category_id": "pcat_01K1RB8KJSNPKQPFKMK8QCJQYZ",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8KWE2JPGPDQVFH0BCKT9",
      "name": "Bundy",
      "handle": "bundy-category-253",
      "parent_category_id": "pcat_01K1RB8KVWCJAXBDDPR1H3T9V0",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8KWXS5316M51TZYW26YW",
      "name": "Kalhoty",
      "handle": "kalhoty-category-254",
      "parent_category_id": "pcat_01K1RB8KVWCJAXBDDPR1H3T9V0",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8KXA7E1RFCZ9HAV36NNB",
      "name": "Rukavice",
      "handle": "rukavice-category-255",
      "parent_category_id": "pcat_01K1RB8KVWCJAXBDDPR1H3T9V0",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8KXS5F3ZB4JDXD9NDMPY",
      "name": "Kulichy",
      "handle": "kulichy-category-256",
      "parent_category_id": "pcat_01K1RB8KVWCJAXBDDPR1H3T9V0",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8M1ATZG7Y7R2KFWPMSN5",
      "name": "Batohy",
      "handle": "batohy-category-263",
      "parent_category_id": "pcat_01K1RB8KYPA0P85FKQ2NPYVCS5",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8M1S12PRYAEQ5S45W22E",
      "name": "Sluneční brýle",
      "handle": "slunecni-bryle-category-264",
      "parent_category_id": "pcat_01K1RB8KYPA0P85FKQ2NPYVCS5",
      "root_category_id": "pcat_01K1RB8J18WSQP4T07YS5EXQ3V"
    },
    {
      "id": "pcat_01K1RB8M3V3BZFQZVZSAK5PXY0",
      "name": "Krátké rukávy",
      "handle": "kratke-rukavy-category-268",
      "parent_category_id": "pcat_01K1RB8M3ABD3W1HJDDH77QTK9",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8M4ANEVV7381SPNDHSMJ",
      "name": "Dlouhé rukávy",
      "handle": "dlouhe-rukavy-category-269",
      "parent_category_id": "pcat_01K1RB8M3ABD3W1HJDDH77QTK9",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8M5TQE14SMWM6S7VAP5A",
      "name": "Přes hlavu",
      "handle": "pres-hlavu-category-272",
      "parent_category_id": "pcat_01K1RB8M4SVFDX4VW001M0TQ7Z",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8M6Q6M3XTJ47TCCZ2E93",
      "name": "Street",
      "handle": "street-category-274",
      "parent_category_id": "pcat_01K1RB8M69E5FWCSEB0PPWGX94",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8M76KEN6R6XMA7NWNQZ4",
      "name": "Zimní",
      "handle": "zimni-category-275",
      "parent_category_id": "pcat_01K1RB8M69E5FWCSEB0PPWGX94",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8M84R3F4YXNHSTBQCCB2",
      "name": "Street",
      "handle": "street-category-277",
      "parent_category_id": "pcat_01K1RB8M7NT8A13DGAN2H9A7YJ",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8M8N4FM3AY51A99FFVC4",
      "name": "Zimní",
      "handle": "zimni-category-278",
      "parent_category_id": "pcat_01K1RB8M7NT8A13DGAN2H9A7YJ",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8M981EYEMCJPJFK3M4Z0",
      "name": "Kraťasy",
      "handle": "kratasy-category-279",
      "parent_category_id": "pcat_01K1RB8M2V65T9Q08MCZ0DAHW3",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8M9QQXT1XF4WR1JYVJ2T",
      "name": "Plavky",
      "handle": "plavky-category-280",
      "parent_category_id": "pcat_01K1RB8M2V65T9Q08MCZ0DAHW3",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8MAS5PX17DREZTWX98HY",
      "name": "Boty",
      "handle": "boty-category-282",
      "parent_category_id": "pcat_01K1RB8MA6N7BK5DTQH87ENA2Y",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8MB6YTGE50Y76E8H21HR",
      "name": "Kulichy",
      "handle": "kulichy-category-283",
      "parent_category_id": "pcat_01K1RB8MA6N7BK5DTQH87ENA2Y",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8MBNWA70QYKEMH7H2WJX",
      "name": "Kšiltovky",
      "handle": "ksiltovky-category-284",
      "parent_category_id": "pcat_01K1RB8MA6N7BK5DTQH87ENA2Y",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8MC6RP6BB60ZZZZCBMQK",
      "name": "Rukavice",
      "handle": "rukavice-category-285",
      "parent_category_id": "pcat_01K1RB8MA6N7BK5DTQH87ENA2Y",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8MD7R883PNKHYEZ1J659",
      "name": "Ostatní",
      "handle": "ostatni-category-287",
      "parent_category_id": "pcat_01K1RB8MA6N7BK5DTQH87ENA2Y",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8N2HA00C869DRPHQD0ZM",
      "name": "Bundy",
      "handle": "bundy-category-330",
      "parent_category_id": "pcat_01K1RB8MZN3T4V66NEAKX9PV9X",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8N30MECRNYV0N1Q2RBRA",
      "name": "Kalhoty",
      "handle": "kalhoty-category-331",
      "parent_category_id": "pcat_01K1RB8MZN3T4V66NEAKX9PV9X",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8N3FJ31VKM1DJAM6SQHA",
      "name": "Rukavice",
      "handle": "rukavice-category-332",
      "parent_category_id": "pcat_01K1RB8MZN3T4V66NEAKX9PV9X",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8N400MPJPYD72TV1E8GB",
      "name": "Kulichy",
      "handle": "kulichy-category-333",
      "parent_category_id": "pcat_01K1RB8MZN3T4V66NEAKX9PV9X",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8N69MHDJ8XZS50AR8N7Z",
      "name": "Bundy",
      "handle": "bundy-category-338",
      "parent_category_id": "pcat_01K1RB8N5TM4PQRVH7A0R3Z422",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8N6WMWY1424JTBS3XR55",
      "name": "Kalhoty",
      "handle": "kalhoty-category-339",
      "parent_category_id": "pcat_01K1RB8N5TM4PQRVH7A0R3Z422",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8N7GA2N5AJDW5M1734KJ",
      "name": "Rukavice",
      "handle": "rukavice-category-340",
      "parent_category_id": "pcat_01K1RB8N5TM4PQRVH7A0R3Z422",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8N85RD1EEF80JZW4SQ6E",
      "name": "Kulichy",
      "handle": "kulichy-category-341",
      "parent_category_id": "pcat_01K1RB8N5TM4PQRVH7A0R3Z422",
      "root_category_id": "pcat_01K1RB8M2BQ9QYD7EFZ4F2NSR8"
    },
    {
      "id": "pcat_01K1RB8NC71VA05V7PQC5ZPQKJ",
      "name": "Krátké rukávy",
      "handle": "kratke-rukavy-category-349",
      "parent_category_id": "pcat_01K1RB8NBSQ39G72J5E3SENF7K",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NCPJ9X4NAA9DFT1RAS5",
      "name": "Dlouhé rukávy",
      "handle": "dlouhe-rukavy-category-350",
      "parent_category_id": "pcat_01K1RB8NBSQ39G72J5E3SENF7K",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NDSY4KAVFFQVRNP2KAD",
      "name": "Na zip",
      "handle": "na-zip-category-352",
      "parent_category_id": "pcat_01K1RB8ND8B29HDGCZ349NM632",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NEB67KSN2VHMBT1XNX7",
      "name": "Přes hlavu",
      "handle": "pres-hlavu-category-353",
      "parent_category_id": "pcat_01K1RB8ND8B29HDGCZ349NM632",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NFE134QRXKQF9KNK28B",
      "name": "Street",
      "handle": "street-category-355",
      "parent_category_id": "pcat_01K1RB8NEXMD6RSK1CGG87C181",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NFX27RB9VYAD56GGEAQ",
      "name": "Zimní",
      "handle": "zimni-category-356",
      "parent_category_id": "pcat_01K1RB8NEXMD6RSK1CGG87C181",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NGE2SFRGFA86DE4D9ZP",
      "name": "Svetry",
      "handle": "svetry-category-357",
      "parent_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NH0F36WEX2E8B2SYCM7",
      "name": "Košile",
      "handle": "kosile-category-358",
      "parent_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NHXCGCK5HSE4AJZDW7D",
      "name": "Street",
      "handle": "street-category-360",
      "parent_category_id": "pcat_01K1RB8NHEXW9WKYHF80S97KDM",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NJDPKTC2B04RMHG7R3N",
      "name": "Zimní",
      "handle": "zimni-category-361",
      "parent_category_id": "pcat_01K1RB8NHEXW9WKYHF80S97KDM",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NJXBPCGP1KWQ3Y2FBQ6",
      "name": "Kraťasy",
      "handle": "kratasy-category-362",
      "parent_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NKC9HCMYHN07ZQQEJJC",
      "name": "Plavky",
      "handle": "plavky-category-363",
      "parent_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NMVY99XGBKDR7G0BHPX",
      "name": "Street",
      "handle": "street-category-366",
      "parent_category_id": "pcat_01K1RB8NMA1FXYQ3MXGPH4R9EV",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NNA02G0XSYX53AJME1F",
      "name": "Žabky",
      "handle": "zabky-category-367",
      "parent_category_id": "pcat_01K1RB8NMA1FXYQ3MXGPH4R9EV",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NNV4Z3GTQH30V97KYM3",
      "name": "Kulichy",
      "handle": "kulichy-category-368",
      "parent_category_id": "pcat_01K1RB8NKWNC7D303770YS2K0E",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NPAHV74FE2NV2YZNCVF",
      "name": "Kšiltovky",
      "handle": "ksiltovky-category-369",
      "parent_category_id": "pcat_01K1RB8NKWNC7D303770YS2K0E",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NPVJRWP76HBVYXJT0WV",
      "name": "Tašky a batohy",
      "handle": "tasky-a-batohy-category-370",
      "parent_category_id": "pcat_01K1RB8NKWNC7D303770YS2K0E",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NQA35Z8YWZNTHZG0MS0",
      "name": "Rukavice",
      "handle": "rukavice-category-371",
      "parent_category_id": "pcat_01K1RB8NKWNC7D303770YS2K0E",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NQVRZQ1ASF9NPJNF2MT",
      "name": "Ponožky",
      "handle": "ponozky-category-372",
      "parent_category_id": "pcat_01K1RB8NKWNC7D303770YS2K0E",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NRC4JBNQT75YG3QSYE1",
      "name": "Pásky",
      "handle": "pasky-category-373",
      "parent_category_id": "pcat_01K1RB8NKWNC7D303770YS2K0E",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NRVDT8RDBTJY8MTT1FQ",
      "name": "Peněženky",
      "handle": "penezenky-category-374",
      "parent_category_id": "pcat_01K1RB8NKWNC7D303770YS2K0E",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NSC13G25VGJ5TBZQVE3",
      "name": "Sluneční brýle",
      "handle": "slunecni-bryle-category-375",
      "parent_category_id": "pcat_01K1RB8NKWNC7D303770YS2K0E",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NSXP1QHK971R2NWAZ2Y",
      "name": "Ostatní",
      "handle": "ostatni-category-376",
      "parent_category_id": "pcat_01K1RB8NKWNC7D303770YS2K0E",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NTFXA34QE8EK857A57F",
      "name": "Šaty a sukně",
      "handle": "saty-a-sukne-category-377",
      "parent_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH",
      "root_category_id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH"
    },
    {
      "id": "pcat_01K1RB8NXVKJM5Y7Q0B5TMDP6Q",
      "name": "Bundy",
      "handle": "bundy-category-383",
      "parent_category_id": "pcat_01K1RB8NVFXNHP325802DJR651",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    {
      "id": "pcat_01K1RB8NYSDBP1F5DWC21K33FT",
      "name": "XC/DH (volné)",
      "handle": "xc-dh-volne-category-385",
      "parent_category_id": "pcat_01K1RB8NY8BM0JQZVXC7HYBWWB",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    {
      "id": "pcat_01K1RB8P08XYEY5K37A6NN7ZAQ",
      "name": "XC/DH (volné)",
      "handle": "xc-dh-volne-category-388",
      "parent_category_id": "pcat_01K1RB8NZTGM708V9ST8FB2652",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    {
      "id": "pcat_01K1RB8P0SG93RV3W9PGK45AQJ",
      "name": "Bib (elastické)",
      "handle": "bib-elasticke-category-389",
      "parent_category_id": "pcat_01K1RB8NZTGM708V9ST8FB2652",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    {
      "id": "pcat_01K1RB8P1N88H5J6JPESKVYJAK",
      "name": "Dlouhé",
      "handle": "dlouhe-category-391",
      "parent_category_id": "pcat_01K1RB8P18611Z2PAVRKHFBQEB",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    {
      "id": "pcat_01K1RB8P27PE61MP06F4QDSQXT",
      "name": "Krátké",
      "handle": "kratke-category-392",
      "parent_category_id": "pcat_01K1RB8P18611Z2PAVRKHFBQEB",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    {
      "id": "pcat_01K1RB8P36CJVDYD8TGNS2QXEC",
      "name": "Ponožky",
      "handle": "ponozky-category-394",
      "parent_category_id": "pcat_01K1RB8NVFXNHP325802DJR651",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    {
      "id": "pcat_01K1RB8P64SFEP6M7VB69FW1EH",
      "name": "Ostatní",
      "handle": "ostatni-category-400",
      "parent_category_id": "pcat_01K1RB8P4NAANW9488G1NY6JRD",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    {
      "id": "pcat_01K1RB8WZ7GH22HXP62J83GSH5",
      "name": "Lahve",
      "handle": "lahve",
      "parent_category_id": "pcat_01K1RB8WRDHF58XJCTDCFVER91",
      "root_category_id": "pcat_01K1RB8NTZ87B7Z4EQ7091ZNJR"
    },
    {
      "id": "pcat_01K1RB8PXB66KVHA3Q4FSS5D5V",
      "name": "Ostatní",
      "handle": "ostatni-category-446",
      "parent_category_id": "pcat_01K1RB8PWAKZDB307746HW64YV",
      "root_category_id": "pcat_01K1RB8PJFP4GJVX6P1Z2WF4YD"
    },
    {
      "id": "pcat_01K1RB8Q1PMNQR30WV2BWTD768",
      "name": "Bundy",
      "handle": "bundy-category-455",
      "parent_category_id": "pcat_01K1RB8PYR5G4Z4PZDHSCQ66XR",
      "root_category_id": "pcat_01K1RB8PY751XV9DETPGD1VE0P"
    },
    {
      "id": "pcat_01K1RB8Q25X4DK2N59SE5F83A3",
      "name": "Kalhoty",
      "handle": "kalhoty-category-456",
      "parent_category_id": "pcat_01K1RB8PYR5G4Z4PZDHSCQ66XR",
      "root_category_id": "pcat_01K1RB8PY751XV9DETPGD1VE0P"
    },
    {
      "id": "pcat_01K1RB8Q2PBP1A8MFSH0YZMQYT",
      "name": "Rukavice",
      "handle": "rukavice-category-457",
      "parent_category_id": "pcat_01K1RB8PYR5G4Z4PZDHSCQ66XR",
      "root_category_id": "pcat_01K1RB8PY751XV9DETPGD1VE0P"
    },
    {
      "id": "pcat_01K1RB8Q375A8TBV8BH2SD2BM2",
      "name": "Kulichy",
      "handle": "kulichy-category-458",
      "parent_category_id": "pcat_01K1RB8PYR5G4Z4PZDHSCQ66XR",
      "root_category_id": "pcat_01K1RB8PY751XV9DETPGD1VE0P"
    },
    {
      "id": "pcat_01K1RB8V9P6NKQ7K4HZ9772PTP",
      "name": "Náhradní díly",
      "handle": "nahradni-dily-category-730",
      "parent_category_id": "pcat_01K1RB8PYR5G4Z4PZDHSCQ66XR",
      "root_category_id": "pcat_01K1RB8PY751XV9DETPGD1VE0P"
    },
    {
      "id": "pcat_01K1RB8Q89WGTW50FKQVXAJBBT",
      "name": "Bundy",
      "handle": "bundy-category-468",
      "parent_category_id": "pcat_01K1RB8Q7P2QPY98AFRK2MWTSG",
      "root_category_id": "pcat_01K1RB8Q77BWFKT63XBZRQ84BR"
    },
    {
      "id": "pcat_01K1RB8Q8R0ZT6CN297BY5FFY6",
      "name": "Kalhoty",
      "handle": "kalhoty-category-469",
      "parent_category_id": "pcat_01K1RB8Q7P2QPY98AFRK2MWTSG",
      "root_category_id": "pcat_01K1RB8Q77BWFKT63XBZRQ84BR"
    },
    {
      "id": "pcat_01K1RB8Q97KJCSCWPV4KBCNX50",
      "name": "Rukavice",
      "handle": "rukavice-category-470",
      "parent_category_id": "pcat_01K1RB8Q7P2QPY98AFRK2MWTSG",
      "root_category_id": "pcat_01K1RB8Q77BWFKT63XBZRQ84BR"
    },
    {
      "id": "pcat_01K1RB8Q9PX4F7YQX91Z7QCE6F",
      "name": "Kulichy",
      "handle": "kulichy-category-471",
      "parent_category_id": "pcat_01K1RB8Q7P2QPY98AFRK2MWTSG",
      "root_category_id": "pcat_01K1RB8Q77BWFKT63XBZRQ84BR"
    },
    {
      "id": "pcat_01K1RB8QD1Y229MDCZR7BSVAYB",
      "name": "Batohy",
      "handle": "batohy-category-478",
      "parent_category_id": "pcat_01K1RB8QAM7PEWEJPFTYN6F6V0",
      "root_category_id": "pcat_01K1RB8Q77BWFKT63XBZRQ84BR"
    },
    {
      "id": "pcat_01K1RB8QDJWB1DXBQWK24P5P0X",
      "name": "Sluneční brýle",
      "handle": "slunecni-bryle-category-479",
      "parent_category_id": "pcat_01K1RB8QAM7PEWEJPFTYN6F6V0",
      "root_category_id": "pcat_01K1RB8Q77BWFKT63XBZRQ84BR"
    }
  ],
  "leafParents": [
    {
      "id": "pcat_01K1RB8G1KN4M1GDGNGDHQTZ1D",
      "name": "Oblečení",
      "handle": "obleceni",
      "children": [
        "pcat_01K1RB8G22NFPVTEJ2NXEK1EB5",
        "pcat_01K1RB8G3K4AYVXH2FQGK34747",
        "pcat_01K1RB8G52K2KF4M0ZJG1NB58W",
        "pcat_01K1RB8G6M6WR4F2AKTTPKMDSS",
        "pcat_01K1RB8G75FEKWR9VYQPJVT0NW",
        "pcat_01K1RB8G7KNMHFMKMZ6F1M7WZH",
        "pcat_01K1RB8G92QW3VR24QWG3X2V90",
        "pcat_01K1RB8G9MKY3GT59NYCFVC4R8",
        "pcat_01K1RB8GA382EKWBZBGY64WHGW"
      ],
      "leafs": [
        "pcat_01K1RB8G2KVYFH1P049EASAHMN",
        "pcat_01K1RB8G322KC5XCT61EPH0750",
        "pcat_01K1RB8G42DZZAM0BEHZ5B1D4R",
        "pcat_01K1RB8G4M65DJNZNETQRBGH52",
        "pcat_01K1RB8G5K8NAVPNTMFQPNP3ZF",
        "pcat_01K1RB8G63PD8K6JK31CFY4ETC",
        "pcat_01K1RB8G6M6WR4F2AKTTPKMDSS",
        "pcat_01K1RB8G75FEKWR9VYQPJVT0NW",
        "pcat_01K1RB8G82EJ2WEE85X39HHR83",
        "pcat_01K1RB8G8H6GVT25W97GKGNG9W",
        "pcat_01K1RB8G92QW3VR24QWG3X2V90",
        "pcat_01K1RB8G9MKY3GT59NYCFVC4R8",
        "pcat_01K1RB8GAYPB72R9KN75S4SZ5Z",
        "pcat_01K1RB8GBDNM6T8B74ZZDQKTMF",
        "pcat_01K1RB8GBTSEZ2X43HXQVJF0F8",
        "pcat_01K1RB8GCB3VC2KXQ47C4S8XJB",
        "pcat_01K1RB8GCXR2KT7HA2AH6QHFSW",
        "pcat_01K1RB8GDF8KRHJP985HFVDVJY",
        "pcat_01K1RB8GDYGRRY1FC8XC9VW7YN",
        "pcat_01K1RB8GED44F5AB7DSKA7BAEW",
        "pcat_01K1RB8GEYH8M3VFAXD9GHZDBY",
        "pcat_01K1RB8GFDEV8T7MVX6TBBJK0H",
        "pcat_01K1RB8GFY3E8FZ8S01K65WF8C"
      ]
    },
    {
      "id": "pcat_01K1RB8G22NFPVTEJ2NXEK1EB5",
      "name": "Trika a tílka",
      "handle": "trika-a-tilka",
      "children": [
        "pcat_01K1RB8G2KVYFH1P049EASAHMN",
        "pcat_01K1RB8G322KC5XCT61EPH0750"
      ],
      "leafs": [
        "pcat_01K1RB8G2KVYFH1P049EASAHMN",
        "pcat_01K1RB8G322KC5XCT61EPH0750"
      ]
    },
    {
      "id": "pcat_01K1RB8G3K4AYVXH2FQGK34747",
      "name": "Mikiny",
      "handle": "mikiny",
      "children": [
        "pcat_01K1RB8G42DZZAM0BEHZ5B1D4R",
        "pcat_01K1RB8G4M65DJNZNETQRBGH52"
      ],
      "leafs": [
        "pcat_01K1RB8G42DZZAM0BEHZ5B1D4R",
        "pcat_01K1RB8G4M65DJNZNETQRBGH52"
      ]
    },
    {
      "id": "pcat_01K1RB8G52K2KF4M0ZJG1NB58W",
      "name": "Bundy",
      "handle": "bundy",
      "children": [
        "pcat_01K1RB8G5K8NAVPNTMFQPNP3ZF",
        "pcat_01K1RB8G63PD8K6JK31CFY4ETC"
      ],
      "leafs": [
        "pcat_01K1RB8G5K8NAVPNTMFQPNP3ZF",
        "pcat_01K1RB8G63PD8K6JK31CFY4ETC"
      ]
    },
    {
      "id": "pcat_01K1RB8G7KNMHFMKMZ6F1M7WZH",
      "name": "Kalhoty",
      "handle": "kalhoty",
      "children": [
        "pcat_01K1RB8G82EJ2WEE85X39HHR83",
        "pcat_01K1RB8G8H6GVT25W97GKGNG9W"
      ],
      "leafs": [
        "pcat_01K1RB8G82EJ2WEE85X39HHR83",
        "pcat_01K1RB8G8H6GVT25W97GKGNG9W"
      ]
    },
    {
      "id": "pcat_01K1RB8GA382EKWBZBGY64WHGW",
      "name": "Doplňky",
      "handle": "doplnky",
      "children": [
        "pcat_01K1RB8GAHR8NYK9BC3KASR4TC",
        "pcat_01K1RB8GBTSEZ2X43HXQVJF0F8",
        "pcat_01K1RB8GCB3VC2KXQ47C4S8XJB",
        "pcat_01K1RB8GCXR2KT7HA2AH6QHFSW",
        "pcat_01K1RB8GDF8KRHJP985HFVDVJY",
        "pcat_01K1RB8GDYGRRY1FC8XC9VW7YN",
        "pcat_01K1RB8GED44F5AB7DSKA7BAEW",
        "pcat_01K1RB8GEYH8M3VFAXD9GHZDBY",
        "pcat_01K1RB8GFDEV8T7MVX6TBBJK0H",
        "pcat_01K1RB8GFY3E8FZ8S01K65WF8C"
      ],
      "leafs": [
        "pcat_01K1RB8GAYPB72R9KN75S4SZ5Z",
        "pcat_01K1RB8GBDNM6T8B74ZZDQKTMF",
        "pcat_01K1RB8GBTSEZ2X43HXQVJF0F8",
        "pcat_01K1RB8GCB3VC2KXQ47C4S8XJB",
        "pcat_01K1RB8GCXR2KT7HA2AH6QHFSW",
        "pcat_01K1RB8GDF8KRHJP985HFVDVJY",
        "pcat_01K1RB8GDYGRRY1FC8XC9VW7YN",
        "pcat_01K1RB8GED44F5AB7DSKA7BAEW",
        "pcat_01K1RB8GEYH8M3VFAXD9GHZDBY",
        "pcat_01K1RB8GFDEV8T7MVX6TBBJK0H",
        "pcat_01K1RB8GFY3E8FZ8S01K65WF8C"
      ]
    },
    {
      "id": "pcat_01K1RB8GAHR8NYK9BC3KASR4TC",
      "name": "Boty",
      "handle": "boty",
      "children": [
        "pcat_01K1RB8GAYPB72R9KN75S4SZ5Z",
        "pcat_01K1RB8GBDNM6T8B74ZZDQKTMF"
      ],
      "leafs": [
        "pcat_01K1RB8GAYPB72R9KN75S4SZ5Z",
        "pcat_01K1RB8GBDNM6T8B74ZZDQKTMF"
      ]
    },
    {
      "id": "pcat_01K1RB8GGZS38QWGYDGVFZVQWS",
      "name": "Oblečení",
      "handle": "obleceni-category-34",
      "children": [
        "pcat_01K1RB8GKB3RJ1A240CWNBHCWX",
        "pcat_01K1RB8GRDSR99AZSHQQWNHYNH",
        "pcat_01K1RB8GSWXHCZZGDY3XGJG99G"
      ],
      "leafs": [
        "pcat_01K1RB8GKTGCW2QABQ9CD1V5T7",
        "pcat_01K1RB8GRDSR99AZSHQQWNHYNH",
        "pcat_01K1RB8GVBNK4XVFCVQNP1FSK7"
      ]
    },
    {
      "id": "pcat_01K1RB8GKB3RJ1A240CWNBHCWX",
      "name": "Kalhoty",
      "handle": "kalhoty-category-39",
      "children": [
        "pcat_01K1RB8GKTGCW2QABQ9CD1V5T7"
      ],
      "leafs": [
        "pcat_01K1RB8GKTGCW2QABQ9CD1V5T7"
      ]
    },
    {
      "id": "pcat_01K1RB8GSWXHCZZGDY3XGJG99G",
      "name": "Doplňky",
      "handle": "doplnky-category-52",
      "children": [
        "pcat_01K1RB8GVBNK4XVFCVQNP1FSK7"
      ],
      "leafs": [
        "pcat_01K1RB8GVBNK4XVFCVQNP1FSK7"
      ]
    },
    {
      "id": "pcat_01K1RB8HG8ES3FY7871PEY71A1",
      "name": "Doplňky",
      "handle": "doplnky-category-98",
      "children": [
        "pcat_01K1RB8HH87HQG6456G9V2EDN6"
      ],
      "leafs": [
        "pcat_01K1RB8HH87HQG6456G9V2EDN6"
      ]
    },
    {
      "id": "pcat_01K1RB8HJQTH3Z7NQHDVNKW4NW",
      "name": "Snowboarding",
      "handle": "snowboarding",
      "children": [
        "pcat_01K1RB8HNNTJ4RFTZK38KE12GW",
        "pcat_01K1RB8HP4NX291QW6JV5M74GR",
        "pcat_01K1RB8HPKCS46X8FDTDYS9R3H",
        "pcat_01K1RB8HQ0JK3PXSZ0TFWQ54H6",
        "pcat_01K1RB8V8TJ5JG4A88WYJR5EVQ"
      ],
      "leafs": [
        "pcat_01K1RB8HNNTJ4RFTZK38KE12GW",
        "pcat_01K1RB8HP4NX291QW6JV5M74GR",
        "pcat_01K1RB8HPKCS46X8FDTDYS9R3H",
        "pcat_01K1RB8HQ0JK3PXSZ0TFWQ54H6",
        "pcat_01K1RB8V8TJ5JG4A88WYJR5EVQ"
      ]
    },
    {
      "id": "pcat_01K1RB8HTVJH9W5NE6SQSSDQBN",
      "name": "Oblečení",
      "handle": "obleceni-category-120",
      "children": [
        "pcat_01K1RB8HVATG7AJYP99Y83B0YA",
        "pcat_01K1RB8HVSWXAWST5R680TKG5A",
        "pcat_01K1RB8HWC2789BSH9VV94QD40",
        "pcat_01K1RB8HWX662Q6SQQBWQSKXCR"
      ],
      "leafs": [
        "pcat_01K1RB8HVATG7AJYP99Y83B0YA",
        "pcat_01K1RB8HVSWXAWST5R680TKG5A",
        "pcat_01K1RB8HWC2789BSH9VV94QD40",
        "pcat_01K1RB8HWX662Q6SQQBWQSKXCR"
      ]
    },
    {
      "id": "pcat_01K1RB8HXVKPVAXN5KBJWH46QA",
      "name": "Doplňky",
      "handle": "doplnky-category-126",
      "children": [
        "pcat_01K1RB8J0699NT92CG6NBK3H9M",
        "pcat_01K1RB8J0QHSR8AB4C0W3CAVKP"
      ],
      "leafs": [
        "pcat_01K1RB8J0699NT92CG6NBK3H9M",
        "pcat_01K1RB8J0QHSR8AB4C0W3CAVKP"
      ]
    },
    {
      "id": "pcat_01K1RB8J1Q7BEA61JK1ZNCW1NA",
      "name": "Oblečení",
      "handle": "obleceni-category-134",
      "children": [
        "pcat_01K1RB8J26341CPGHSEB6FQZH9",
        "pcat_01K1RB8J3J4P3W6FNG3PPVETN9",
        "pcat_01K1RB8J50WM9DWJ515NBRNTBC",
        "pcat_01K1RB8J6EGSN0QE2B0AXZ4SKC",
        "pcat_01K1RB8J6Y2KT8CW2RQ16JG1PE",
        "pcat_01K1RB8J7DW042RTPWCBVBXH53",
        "pcat_01K1RB8J8Y0PR4GBPFT19ET0SV",
        "pcat_01K1RB8J9F9RPEJJ23Z8KA4AJW",
        "pcat_01K1RB8J9YCTA5RKQMSVVGMDS4",
        "pcat_01K1RB8JADGFFJXSHEAYP9A8T2"
      ],
      "leafs": [
        "pcat_01K1RB8J2KZTCKVCWDNTDE33T4",
        "pcat_01K1RB8J349N2WC10BC1A1XZBH",
        "pcat_01K1RB8J44XAVF7ZMBVP0CS1PX",
        "pcat_01K1RB8J4JNFATW8H1DSXHXBVZ",
        "pcat_01K1RB8J5DTJFSRXBE4RXG43WP",
        "pcat_01K1RB8J5ZK4EJBCHHGKVV1WQZ",
        "pcat_01K1RB8J6EGSN0QE2B0AXZ4SKC",
        "pcat_01K1RB8J6Y2KT8CW2RQ16JG1PE",
        "pcat_01K1RB8J7WB2Q9V7HWG4D3CESP",
        "pcat_01K1RB8J8DZSB3KNT8XCMPVAQC",
        "pcat_01K1RB8J8Y0PR4GBPFT19ET0SV",
        "pcat_01K1RB8J9F9RPEJJ23Z8KA4AJW",
        "pcat_01K1RB8J9YCTA5RKQMSVVGMDS4",
        "pcat_01K1RB8JBWKBDHPA3GEVV1V5YC",
        "pcat_01K1RB8JCD4R0NKCWRP16B19J5",
        "pcat_01K1RB8JCWQDMKYZZTWDF30J7B",
        "pcat_01K1RB8JDEJR7FW9PY3MSG9NGQ",
        "pcat_01K1RB8JDWRFRBQQ6KDQKB1WP2",
        "pcat_01K1RB8JENFMRDS6E7PTXYEACW",
        "pcat_01K1RB8JG7HQHHG8A25R9K7HKC",
        "pcat_01K1RB8JGNFW4SKT22RM2ME8X9"
      ]
    },
    {
      "id": "pcat_01K1RB8J26341CPGHSEB6FQZH9",
      "name": "Trika a tílka",
      "handle": "trika-a-tilka-category-135",
      "children": [
        "pcat_01K1RB8J2KZTCKVCWDNTDE33T4",
        "pcat_01K1RB8J349N2WC10BC1A1XZBH"
      ],
      "leafs": [
        "pcat_01K1RB8J2KZTCKVCWDNTDE33T4",
        "pcat_01K1RB8J349N2WC10BC1A1XZBH"
      ]
    },
    {
      "id": "pcat_01K1RB8J3J4P3W6FNG3PPVETN9",
      "name": "Mikiny",
      "handle": "mikiny-category-138",
      "children": [
        "pcat_01K1RB8J44XAVF7ZMBVP0CS1PX",
        "pcat_01K1RB8J4JNFATW8H1DSXHXBVZ"
      ],
      "leafs": [
        "pcat_01K1RB8J44XAVF7ZMBVP0CS1PX",
        "pcat_01K1RB8J4JNFATW8H1DSXHXBVZ"
      ]
    },
    {
      "id": "pcat_01K1RB8J50WM9DWJ515NBRNTBC",
      "name": "Bundy",
      "handle": "bundy-category-141",
      "children": [
        "pcat_01K1RB8J5DTJFSRXBE4RXG43WP",
        "pcat_01K1RB8J5ZK4EJBCHHGKVV1WQZ"
      ],
      "leafs": [
        "pcat_01K1RB8J5DTJFSRXBE4RXG43WP",
        "pcat_01K1RB8J5ZK4EJBCHHGKVV1WQZ"
      ]
    },
    {
      "id": "pcat_01K1RB8J7DW042RTPWCBVBXH53",
      "name": "Kalhoty",
      "handle": "kalhoty-category-146",
      "children": [
        "pcat_01K1RB8J7WB2Q9V7HWG4D3CESP",
        "pcat_01K1RB8J8DZSB3KNT8XCMPVAQC"
      ],
      "leafs": [
        "pcat_01K1RB8J7WB2Q9V7HWG4D3CESP",
        "pcat_01K1RB8J8DZSB3KNT8XCMPVAQC"
      ]
    },
    {
      "id": "pcat_01K1RB8JADGFFJXSHEAYP9A8T2",
      "name": "Doplňky",
      "handle": "doplnky-category-152",
      "children": [
        "pcat_01K1RB8JAWN8MFBXGSRMG5VGR3",
        "pcat_01K1RB8JCD4R0NKCWRP16B19J5",
        "pcat_01K1RB8JCWQDMKYZZTWDF30J7B",
        "pcat_01K1RB8JDEJR7FW9PY3MSG9NGQ",
        "pcat_01K1RB8JDWRFRBQQ6KDQKB1WP2",
        "pcat_01K1RB8JENFMRDS6E7PTXYEACW",
        "pcat_01K1RB8JG7HQHHG8A25R9K7HKC",
        "pcat_01K1RB8JGNFW4SKT22RM2ME8X9"
      ],
      "leafs": [
        "pcat_01K1RB8JBWKBDHPA3GEVV1V5YC",
        "pcat_01K1RB8JCD4R0NKCWRP16B19J5",
        "pcat_01K1RB8JCWQDMKYZZTWDF30J7B",
        "pcat_01K1RB8JDEJR7FW9PY3MSG9NGQ",
        "pcat_01K1RB8JDWRFRBQQ6KDQKB1WP2",
        "pcat_01K1RB8JENFMRDS6E7PTXYEACW",
        "pcat_01K1RB8JG7HQHHG8A25R9K7HKC",
        "pcat_01K1RB8JGNFW4SKT22RM2ME8X9"
      ]
    },
    {
      "id": "pcat_01K1RB8JAWN8MFBXGSRMG5VGR3",
      "name": "Boty",
      "handle": "boty-category-153",
      "children": [
        "pcat_01K1RB8JBWKBDHPA3GEVV1V5YC"
      ],
      "leafs": [
        "pcat_01K1RB8JBWKBDHPA3GEVV1V5YC"
      ]
    },
    {
      "id": "pcat_01K1RB8JHQMMXK70R6JGCSFE5H",
      "name": "Oblečení",
      "handle": "obleceni-category-166",
      "children": [
        "pcat_01K1RB8JKHB9RJQWYPRW51QCY1",
        "pcat_01K1RB8JNJ50AYCQ72T5SAP90W",
        "pcat_01K1RB8JQ06DHD9SQK1W12HMD8",
        "pcat_01K1RB8JS0W97FTTXF8CP2Y1VN",
        "pcat_01K1RB8JTJV3Y5NMEPSY16MNDQ"
      ],
      "leafs": [
        "pcat_01K1RB8JKHB9RJQWYPRW51QCY1",
        "pcat_01K1RB8JP3B26C5CR1SWXYWPGM",
        "pcat_01K1RB8JPJD29HFJ0QS52V9M4X",
        "pcat_01K1RB8JQJ6EYA4V4V73VFDACS",
        "pcat_01K1RB8JR1ES9GX5Z7NPGR511N",
        "pcat_01K1RB8JS0W97FTTXF8CP2Y1VN",
        "pcat_01K1RB8JW0Q2TQGE0YTZ6C8JMA"
      ]
    },
    {
      "id": "pcat_01K1RB8JNJ50AYCQ72T5SAP90W",
      "name": "Kraťasy",
      "handle": "kratasy-category-174",
      "children": [
        "pcat_01K1RB8JP3B26C5CR1SWXYWPGM",
        "pcat_01K1RB8JPJD29HFJ0QS52V9M4X"
      ],
      "leafs": [
        "pcat_01K1RB8JP3B26C5CR1SWXYWPGM",
        "pcat_01K1RB8JPJD29HFJ0QS52V9M4X"
      ]
    },
    {
      "id": "pcat_01K1RB8JQ06DHD9SQK1W12HMD8",
      "name": "Rukavice",
      "handle": "rukavice-category-177",
      "children": [
        "pcat_01K1RB8JQJ6EYA4V4V73VFDACS",
        "pcat_01K1RB8JR1ES9GX5Z7NPGR511N"
      ],
      "leafs": [
        "pcat_01K1RB8JQJ6EYA4V4V73VFDACS",
        "pcat_01K1RB8JR1ES9GX5Z7NPGR511N"
      ]
    },
    {
      "id": "pcat_01K1RB8JTJV3Y5NMEPSY16MNDQ",
      "name": "Doplňky",
      "handle": "doplnky-category-184",
      "children": [
        "pcat_01K1RB8JW0Q2TQGE0YTZ6C8JMA"
      ],
      "leafs": [
        "pcat_01K1RB8JW0Q2TQGE0YTZ6C8JMA"
      ]
    },
    {
      "id": "pcat_01K1RB8KJSNPKQPFKMK8QCJQYZ",
      "name": "Snowboarding",
      "handle": "snowboarding-category-234",
      "children": [
        "pcat_01K1RB8KNVFF0PMD55Z5XB5469",
        "pcat_01K1RB8KPAZQ509BGGAZXWB2NM",
        "pcat_01K1RB8KPS9ZHXD3K5VAD87QBF",
        "pcat_01K1RB8KQAGZ7B6WT4Q9G4Y91V"
      ],
      "leafs": [
        "pcat_01K1RB8KNVFF0PMD55Z5XB5469",
        "pcat_01K1RB8KPAZQ509BGGAZXWB2NM",
        "pcat_01K1RB8KPS9ZHXD3K5VAD87QBF",
        "pcat_01K1RB8KQAGZ7B6WT4Q9G4Y91V"
      ]
    },
    {
      "id": "pcat_01K1RB8KVWCJAXBDDPR1H3T9V0",
      "name": "Oblečení",
      "handle": "obleceni-category-252",
      "children": [
        "pcat_01K1RB8KWE2JPGPDQVFH0BCKT9",
        "pcat_01K1RB8KWXS5316M51TZYW26YW",
        "pcat_01K1RB8KXA7E1RFCZ9HAV36NNB",
        "pcat_01K1RB8KXS5F3ZB4JDXD9NDMPY"
      ],
      "leafs": [
        "pcat_01K1RB8KWE2JPGPDQVFH0BCKT9",
        "pcat_01K1RB8KWXS5316M51TZYW26YW",
        "pcat_01K1RB8KXA7E1RFCZ9HAV36NNB",
        "pcat_01K1RB8KXS5F3ZB4JDXD9NDMPY"
      ]
    },
    {
      "id": "pcat_01K1RB8KYPA0P85FKQ2NPYVCS5",
      "name": "Doplňky",
      "handle": "doplnky-category-258",
      "children": [
        "pcat_01K1RB8M1ATZG7Y7R2KFWPMSN5",
        "pcat_01K1RB8M1S12PRYAEQ5S45W22E"
      ],
      "leafs": [
        "pcat_01K1RB8M1ATZG7Y7R2KFWPMSN5",
        "pcat_01K1RB8M1S12PRYAEQ5S45W22E"
      ]
    },
    {
      "id": "pcat_01K1RB8M2V65T9Q08MCZ0DAHW3",
      "name": "Oblečení",
      "handle": "obleceni-category-266",
      "children": [
        "pcat_01K1RB8M3ABD3W1HJDDH77QTK9",
        "pcat_01K1RB8M4SVFDX4VW001M0TQ7Z",
        "pcat_01K1RB8M69E5FWCSEB0PPWGX94",
        "pcat_01K1RB8M7NT8A13DGAN2H9A7YJ",
        "pcat_01K1RB8M981EYEMCJPJFK3M4Z0",
        "pcat_01K1RB8M9QQXT1XF4WR1JYVJ2T",
        "pcat_01K1RB8MA6N7BK5DTQH87ENA2Y"
      ],
      "leafs": [
        "pcat_01K1RB8M3V3BZFQZVZSAK5PXY0",
        "pcat_01K1RB8M4ANEVV7381SPNDHSMJ",
        "pcat_01K1RB8M5TQE14SMWM6S7VAP5A",
        "pcat_01K1RB8M6Q6M3XTJ47TCCZ2E93",
        "pcat_01K1RB8M76KEN6R6XMA7NWNQZ4",
        "pcat_01K1RB8M84R3F4YXNHSTBQCCB2",
        "pcat_01K1RB8M8N4FM3AY51A99FFVC4",
        "pcat_01K1RB8M981EYEMCJPJFK3M4Z0",
        "pcat_01K1RB8M9QQXT1XF4WR1JYVJ2T",
        "pcat_01K1RB8MAS5PX17DREZTWX98HY",
        "pcat_01K1RB8MB6YTGE50Y76E8H21HR",
        "pcat_01K1RB8MBNWA70QYKEMH7H2WJX",
        "pcat_01K1RB8MC6RP6BB60ZZZZCBMQK",
        "pcat_01K1RB8MD7R883PNKHYEZ1J659"
      ]
    },
    {
      "id": "pcat_01K1RB8M3ABD3W1HJDDH77QTK9",
      "name": "Trika a tílka",
      "handle": "trika-a-tilka-category-267",
      "children": [
        "pcat_01K1RB8M3V3BZFQZVZSAK5PXY0",
        "pcat_01K1RB8M4ANEVV7381SPNDHSMJ"
      ],
      "leafs": [
        "pcat_01K1RB8M3V3BZFQZVZSAK5PXY0",
        "pcat_01K1RB8M4ANEVV7381SPNDHSMJ"
      ]
    },
    {
      "id": "pcat_01K1RB8M4SVFDX4VW001M0TQ7Z",
      "name": "Mikiny",
      "handle": "mikiny-category-270",
      "children": [
        "pcat_01K1RB8M5TQE14SMWM6S7VAP5A"
      ],
      "leafs": [
        "pcat_01K1RB8M5TQE14SMWM6S7VAP5A"
      ]
    },
    {
      "id": "pcat_01K1RB8M69E5FWCSEB0PPWGX94",
      "name": "Bundy",
      "handle": "bundy-category-273",
      "children": [
        "pcat_01K1RB8M6Q6M3XTJ47TCCZ2E93",
        "pcat_01K1RB8M76KEN6R6XMA7NWNQZ4"
      ],
      "leafs": [
        "pcat_01K1RB8M6Q6M3XTJ47TCCZ2E93",
        "pcat_01K1RB8M76KEN6R6XMA7NWNQZ4"
      ]
    },
    {
      "id": "pcat_01K1RB8M7NT8A13DGAN2H9A7YJ",
      "name": "Kalhoty",
      "handle": "kalhoty-category-276",
      "children": [
        "pcat_01K1RB8M84R3F4YXNHSTBQCCB2",
        "pcat_01K1RB8M8N4FM3AY51A99FFVC4"
      ],
      "leafs": [
        "pcat_01K1RB8M84R3F4YXNHSTBQCCB2",
        "pcat_01K1RB8M8N4FM3AY51A99FFVC4"
      ]
    },
    {
      "id": "pcat_01K1RB8MA6N7BK5DTQH87ENA2Y",
      "name": "Doplňky",
      "handle": "doplnky-category-281",
      "children": [
        "pcat_01K1RB8MAS5PX17DREZTWX98HY",
        "pcat_01K1RB8MB6YTGE50Y76E8H21HR",
        "pcat_01K1RB8MBNWA70QYKEMH7H2WJX",
        "pcat_01K1RB8MC6RP6BB60ZZZZCBMQK",
        "pcat_01K1RB8MD7R883PNKHYEZ1J659"
      ],
      "leafs": [
        "pcat_01K1RB8MAS5PX17DREZTWX98HY",
        "pcat_01K1RB8MB6YTGE50Y76E8H21HR",
        "pcat_01K1RB8MBNWA70QYKEMH7H2WJX",
        "pcat_01K1RB8MC6RP6BB60ZZZZCBMQK",
        "pcat_01K1RB8MD7R883PNKHYEZ1J659"
      ]
    },
    {
      "id": "pcat_01K1RB8MZN3T4V66NEAKX9PV9X",
      "name": "Snowboarding",
      "handle": "snowboarding-category-324",
      "children": [
        "pcat_01K1RB8N2HA00C869DRPHQD0ZM",
        "pcat_01K1RB8N30MECRNYV0N1Q2RBRA",
        "pcat_01K1RB8N3FJ31VKM1DJAM6SQHA",
        "pcat_01K1RB8N400MPJPYD72TV1E8GB"
      ],
      "leafs": [
        "pcat_01K1RB8N2HA00C869DRPHQD0ZM",
        "pcat_01K1RB8N30MECRNYV0N1Q2RBRA",
        "pcat_01K1RB8N3FJ31VKM1DJAM6SQHA",
        "pcat_01K1RB8N400MPJPYD72TV1E8GB"
      ]
    },
    {
      "id": "pcat_01K1RB8N5TM4PQRVH7A0R3Z422",
      "name": "Oblečení",
      "handle": "obleceni-category-337",
      "children": [
        "pcat_01K1RB8N69MHDJ8XZS50AR8N7Z",
        "pcat_01K1RB8N6WMWY1424JTBS3XR55",
        "pcat_01K1RB8N7GA2N5AJDW5M1734KJ",
        "pcat_01K1RB8N85RD1EEF80JZW4SQ6E"
      ],
      "leafs": [
        "pcat_01K1RB8N69MHDJ8XZS50AR8N7Z",
        "pcat_01K1RB8N6WMWY1424JTBS3XR55",
        "pcat_01K1RB8N7GA2N5AJDW5M1734KJ",
        "pcat_01K1RB8N85RD1EEF80JZW4SQ6E"
      ]
    },
    {
      "id": "pcat_01K1RB8NB8TRB5G0QREENGXNBH",
      "name": "Oblečení",
      "handle": "obleceni-category-347",
      "children": [
        "pcat_01K1RB8NBSQ39G72J5E3SENF7K",
        "pcat_01K1RB8ND8B29HDGCZ349NM632",
        "pcat_01K1RB8NEXMD6RSK1CGG87C181",
        "pcat_01K1RB8NGE2SFRGFA86DE4D9ZP",
        "pcat_01K1RB8NH0F36WEX2E8B2SYCM7",
        "pcat_01K1RB8NHEXW9WKYHF80S97KDM",
        "pcat_01K1RB8NJXBPCGP1KWQ3Y2FBQ6",
        "pcat_01K1RB8NKC9HCMYHN07ZQQEJJC",
        "pcat_01K1RB8NKWNC7D303770YS2K0E",
        "pcat_01K1RB8NTFXA34QE8EK857A57F"
      ],
      "leafs": [
        "pcat_01K1RB8NC71VA05V7PQC5ZPQKJ",
        "pcat_01K1RB8NCPJ9X4NAA9DFT1RAS5",
        "pcat_01K1RB8NDSY4KAVFFQVRNP2KAD",
        "pcat_01K1RB8NEB67KSN2VHMBT1XNX7",
        "pcat_01K1RB8NFE134QRXKQF9KNK28B",
        "pcat_01K1RB8NFX27RB9VYAD56GGEAQ",
        "pcat_01K1RB8NGE2SFRGFA86DE4D9ZP",
        "pcat_01K1RB8NH0F36WEX2E8B2SYCM7",
        "pcat_01K1RB8NHXCGCK5HSE4AJZDW7D",
        "pcat_01K1RB8NJDPKTC2B04RMHG7R3N",
        "pcat_01K1RB8NJXBPCGP1KWQ3Y2FBQ6",
        "pcat_01K1RB8NKC9HCMYHN07ZQQEJJC",
        "pcat_01K1RB8NMVY99XGBKDR7G0BHPX",
        "pcat_01K1RB8NNA02G0XSYX53AJME1F",
        "pcat_01K1RB8NNV4Z3GTQH30V97KYM3",
        "pcat_01K1RB8NPAHV74FE2NV2YZNCVF",
        "pcat_01K1RB8NPVJRWP76HBVYXJT0WV",
        "pcat_01K1RB8NQA35Z8YWZNTHZG0MS0",
        "pcat_01K1RB8NQVRZQ1ASF9NPJNF2MT",
        "pcat_01K1RB8NRC4JBNQT75YG3QSYE1",
        "pcat_01K1RB8NRVDT8RDBTJY8MTT1FQ",
        "pcat_01K1RB8NSC13G25VGJ5TBZQVE3",
        "pcat_01K1RB8NSXP1QHK971R2NWAZ2Y",
        "pcat_01K1RB8NTFXA34QE8EK857A57F"
      ]
    },
    {
      "id": "pcat_01K1RB8NBSQ39G72J5E3SENF7K",
      "name": "Trika a tílka",
      "handle": "trika-a-tilka-category-348",
      "children": [
        "pcat_01K1RB8NC71VA05V7PQC5ZPQKJ",
        "pcat_01K1RB8NCPJ9X4NAA9DFT1RAS5"
      ],
      "leafs": [
        "pcat_01K1RB8NC71VA05V7PQC5ZPQKJ",
        "pcat_01K1RB8NCPJ9X4NAA9DFT1RAS5"
      ]
    },
    {
      "id": "pcat_01K1RB8ND8B29HDGCZ349NM632",
      "name": "Mikiny",
      "handle": "mikiny-category-351",
      "children": [
        "pcat_01K1RB8NDSY4KAVFFQVRNP2KAD",
        "pcat_01K1RB8NEB67KSN2VHMBT1XNX7"
      ],
      "leafs": [
        "pcat_01K1RB8NDSY4KAVFFQVRNP2KAD",
        "pcat_01K1RB8NEB67KSN2VHMBT1XNX7"
      ]
    },
    {
      "id": "pcat_01K1RB8NEXMD6RSK1CGG87C181",
      "name": "Bundy",
      "handle": "bundy-category-354",
      "children": [
        "pcat_01K1RB8NFE134QRXKQF9KNK28B",
        "pcat_01K1RB8NFX27RB9VYAD56GGEAQ"
      ],
      "leafs": [
        "pcat_01K1RB8NFE134QRXKQF9KNK28B",
        "pcat_01K1RB8NFX27RB9VYAD56GGEAQ"
      ]
    },
    {
      "id": "pcat_01K1RB8NHEXW9WKYHF80S97KDM",
      "name": "Kalhoty",
      "handle": "kalhoty-category-359",
      "children": [
        "pcat_01K1RB8NHXCGCK5HSE4AJZDW7D",
        "pcat_01K1RB8NJDPKTC2B04RMHG7R3N"
      ],
      "leafs": [
        "pcat_01K1RB8NHXCGCK5HSE4AJZDW7D",
        "pcat_01K1RB8NJDPKTC2B04RMHG7R3N"
      ]
    },
    {
      "id": "pcat_01K1RB8NKWNC7D303770YS2K0E",
      "name": "Doplňky",
      "handle": "doplnky-category-364",
      "children": [
        "pcat_01K1RB8NMA1FXYQ3MXGPH4R9EV",
        "pcat_01K1RB8NNV4Z3GTQH30V97KYM3",
        "pcat_01K1RB8NPAHV74FE2NV2YZNCVF",
        "pcat_01K1RB8NPVJRWP76HBVYXJT0WV",
        "pcat_01K1RB8NQA35Z8YWZNTHZG0MS0",
        "pcat_01K1RB8NQVRZQ1ASF9NPJNF2MT",
        "pcat_01K1RB8NRC4JBNQT75YG3QSYE1",
        "pcat_01K1RB8NRVDT8RDBTJY8MTT1FQ",
        "pcat_01K1RB8NSC13G25VGJ5TBZQVE3",
        "pcat_01K1RB8NSXP1QHK971R2NWAZ2Y"
      ],
      "leafs": [
        "pcat_01K1RB8NMVY99XGBKDR7G0BHPX",
        "pcat_01K1RB8NNA02G0XSYX53AJME1F",
        "pcat_01K1RB8NNV4Z3GTQH30V97KYM3",
        "pcat_01K1RB8NPAHV74FE2NV2YZNCVF",
        "pcat_01K1RB8NPVJRWP76HBVYXJT0WV",
        "pcat_01K1RB8NQA35Z8YWZNTHZG0MS0",
        "pcat_01K1RB8NQVRZQ1ASF9NPJNF2MT",
        "pcat_01K1RB8NRC4JBNQT75YG3QSYE1",
        "pcat_01K1RB8NRVDT8RDBTJY8MTT1FQ",
        "pcat_01K1RB8NSC13G25VGJ5TBZQVE3",
        "pcat_01K1RB8NSXP1QHK971R2NWAZ2Y"
      ]
    },
    {
      "id": "pcat_01K1RB8NMA1FXYQ3MXGPH4R9EV",
      "name": "Boty",
      "handle": "boty-category-365",
      "children": [
        "pcat_01K1RB8NMVY99XGBKDR7G0BHPX",
        "pcat_01K1RB8NNA02G0XSYX53AJME1F"
      ],
      "leafs": [
        "pcat_01K1RB8NMVY99XGBKDR7G0BHPX",
        "pcat_01K1RB8NNA02G0XSYX53AJME1F"
      ]
    },
    {
      "id": "pcat_01K1RB8NVFXNHP325802DJR651",
      "name": "Oblečení",
      "handle": "obleceni-category-379",
      "children": [
        "pcat_01K1RB8NXVKJM5Y7Q0B5TMDP6Q",
        "pcat_01K1RB8NY8BM0JQZVXC7HYBWWB",
        "pcat_01K1RB8NZTGM708V9ST8FB2652",
        "pcat_01K1RB8P18611Z2PAVRKHFBQEB",
        "pcat_01K1RB8P36CJVDYD8TGNS2QXEC",
        "pcat_01K1RB8P4NAANW9488G1NY6JRD"
      ],
      "leafs": [
        "pcat_01K1RB8NXVKJM5Y7Q0B5TMDP6Q",
        "pcat_01K1RB8NYSDBP1F5DWC21K33FT",
        "pcat_01K1RB8P08XYEY5K37A6NN7ZAQ",
        "pcat_01K1RB8P0SG93RV3W9PGK45AQJ",
        "pcat_01K1RB8P1N88H5J6JPESKVYJAK",
        "pcat_01K1RB8P27PE61MP06F4QDSQXT",
        "pcat_01K1RB8P36CJVDYD8TGNS2QXEC",
        "pcat_01K1RB8P64SFEP6M7VB69FW1EH"
      ]
    },
    {
      "id": "pcat_01K1RB8NY8BM0JQZVXC7HYBWWB",
      "name": "Kalhoty",
      "handle": "kalhoty-category-384",
      "children": [
        "pcat_01K1RB8NYSDBP1F5DWC21K33FT"
      ],
      "leafs": [
        "pcat_01K1RB8NYSDBP1F5DWC21K33FT"
      ]
    },
    {
      "id": "pcat_01K1RB8NZTGM708V9ST8FB2652",
      "name": "Kraťasy",
      "handle": "kratasy-category-387",
      "children": [
        "pcat_01K1RB8P08XYEY5K37A6NN7ZAQ",
        "pcat_01K1RB8P0SG93RV3W9PGK45AQJ"
      ],
      "leafs": [
        "pcat_01K1RB8P08XYEY5K37A6NN7ZAQ",
        "pcat_01K1RB8P0SG93RV3W9PGK45AQJ"
      ]
    },
    {
      "id": "pcat_01K1RB8P18611Z2PAVRKHFBQEB",
      "name": "Rukavice",
      "handle": "rukavice-category-390",
      "children": [
        "pcat_01K1RB8P1N88H5J6JPESKVYJAK",
        "pcat_01K1RB8P27PE61MP06F4QDSQXT"
      ],
      "leafs": [
        "pcat_01K1RB8P1N88H5J6JPESKVYJAK",
        "pcat_01K1RB8P27PE61MP06F4QDSQXT"
      ]
    },
    {
      "id": "pcat_01K1RB8P4NAANW9488G1NY6JRD",
      "name": "Doplňky",
      "handle": "doplnky-category-397",
      "children": [
        "pcat_01K1RB8P64SFEP6M7VB69FW1EH"
      ],
      "leafs": [
        "pcat_01K1RB8P64SFEP6M7VB69FW1EH"
      ]
    },
    {
      "id": "pcat_01K1RB8WRDHF58XJCTDCFVER91",
      "name": "Doplňky",
      "handle": "doplnky-komponenty",
      "children": [
        "pcat_01K1RB8WZ7GH22HXP62J83GSH5"
      ],
      "leafs": [
        "pcat_01K1RB8WZ7GH22HXP62J83GSH5"
      ]
    },
    {
      "id": "pcat_01K1RB8PWAKZDB307746HW64YV",
      "name": "Doplňky",
      "handle": "doplnky-category-444",
      "children": [
        "pcat_01K1RB8PXB66KVHA3Q4FSS5D5V"
      ],
      "leafs": [
        "pcat_01K1RB8PXB66KVHA3Q4FSS5D5V"
      ]
    },
    {
      "id": "pcat_01K1RB8PYR5G4Z4PZDHSCQ66XR",
      "name": "Snowboarding",
      "handle": "snowboarding-category-449",
      "children": [
        "pcat_01K1RB8Q1PMNQR30WV2BWTD768",
        "pcat_01K1RB8Q25X4DK2N59SE5F83A3",
        "pcat_01K1RB8Q2PBP1A8MFSH0YZMQYT",
        "pcat_01K1RB8Q375A8TBV8BH2SD2BM2",
        "pcat_01K1RB8V9P6NKQ7K4HZ9772PTP"
      ],
      "leafs": [
        "pcat_01K1RB8Q1PMNQR30WV2BWTD768",
        "pcat_01K1RB8Q25X4DK2N59SE5F83A3",
        "pcat_01K1RB8Q2PBP1A8MFSH0YZMQYT",
        "pcat_01K1RB8Q375A8TBV8BH2SD2BM2",
        "pcat_01K1RB8V9P6NKQ7K4HZ9772PTP"
      ]
    },
    {
      "id": "pcat_01K1RB8Q7P2QPY98AFRK2MWTSG",
      "name": "Oblečení",
      "handle": "obleceni-category-467",
      "children": [
        "pcat_01K1RB8Q89WGTW50FKQVXAJBBT",
        "pcat_01K1RB8Q8R0ZT6CN297BY5FFY6",
        "pcat_01K1RB8Q97KJCSCWPV4KBCNX50",
        "pcat_01K1RB8Q9PX4F7YQX91Z7QCE6F"
      ],
      "leafs": [
        "pcat_01K1RB8Q89WGTW50FKQVXAJBBT",
        "pcat_01K1RB8Q8R0ZT6CN297BY5FFY6",
        "pcat_01K1RB8Q97KJCSCWPV4KBCNX50",
        "pcat_01K1RB8Q9PX4F7YQX91Z7QCE6F"
      ]
    },
    {
      "id": "pcat_01K1RB8QAM7PEWEJPFTYN6F6V0",
      "name": "Doplňky",
      "handle": "doplnky-category-473",
      "children": [
        "pcat_01K1RB8QD1Y229MDCZR7BSVAYB",
        "pcat_01K1RB8QDJWB1DXBQWK24P5P0X"
      ],
      "leafs": [
        "pcat_01K1RB8QD1Y229MDCZR7BSVAYB",
        "pcat_01K1RB8QDJWB1DXBQWK24P5P0X"
      ]
    }
  ],
  "generatedAt": "2025-09-30T15:37:52.894Z",
  "filteringStats": {
    "totalCategoriesBeforeFiltering": 580,
    "totalCategoriesAfterFiltering": 212,
    "categoriesWithDirectProducts": 213,
    "filteredOutCount": 368
  }
}

export default data
export const { allCategories, categoryTree, rootCategories, categoryMap, leafCategories, leafParents, filteringStats } = data
