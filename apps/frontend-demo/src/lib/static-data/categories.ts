// Auto-generated file - DO NOT EDIT
// Generated at: 2025-11-20T19:18:15.532Z
// Run 'node scripts/generate-categories-2.mjs' to regenerate
// This version filters out categories without products

import type { Category, CategoryTreeNode } from '@/lib/server/categories'

export interface LeafCategory {
  id: string
  name: string
  handle: string
  parent_category_id: string | null
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
      "id": "pcat_01KAGV68663VFPVHHVCAZXZJWK",
      "name": "Sweatshirts",
      "handle": "sweatshirts",
      "parent_category_id": null
    },
    {
      "id": "pcat_01KAGV6866597K1ZHJ9SQ158JF",
      "name": "Merch",
      "handle": "merch",
      "parent_category_id": null
    },
    {
      "id": "pcat_01KAGV6866FDTE5WATJF1N8QG8",
      "name": "Shirts",
      "handle": "shirts",
      "parent_category_id": null
    },
    {
      "id": "pcat_01KAGV6866W70T024DM1GYS60W",
      "name": "Pants",
      "handle": "pants",
      "parent_category_id": null
    }
  ],
  "categoryTree": [
    {
      "id": "pcat_01KAGV6866597K1ZHJ9SQ158JF",
      "name": "Merch",
      "handle": "merch",
      "children": []
    },
    {
      "id": "pcat_01KAGV6866W70T024DM1GYS60W",
      "name": "Pants",
      "handle": "pants",
      "children": []
    },
    {
      "id": "pcat_01KAGV6866FDTE5WATJF1N8QG8",
      "name": "Shirts",
      "handle": "shirts",
      "children": []
    },
    {
      "id": "pcat_01KAGV68663VFPVHHVCAZXZJWK",
      "name": "Sweatshirts",
      "handle": "sweatshirts",
      "children": []
    }
  ],
  "rootCategories": [
    {
      "id": "pcat_01KAGV6866597K1ZHJ9SQ158JF",
      "name": "Merch",
      "handle": "merch",
      "parent_category_id": null
    },
    {
      "id": "pcat_01KAGV6866W70T024DM1GYS60W",
      "name": "Pants",
      "handle": "pants",
      "parent_category_id": null
    },
    {
      "id": "pcat_01KAGV6866FDTE5WATJF1N8QG8",
      "name": "Shirts",
      "handle": "shirts",
      "parent_category_id": null
    },
    {
      "id": "pcat_01KAGV68663VFPVHHVCAZXZJWK",
      "name": "Sweatshirts",
      "handle": "sweatshirts",
      "parent_category_id": null
    }
  ],
  "categoryMap": {
    "pcat_01KAGV68663VFPVHHVCAZXZJWK": {
      "id": "pcat_01KAGV68663VFPVHHVCAZXZJWK",
      "name": "Sweatshirts",
      "handle": "sweatshirts",
      "parent_category_id": null
    },
    "pcat_01KAGV6866597K1ZHJ9SQ158JF": {
      "id": "pcat_01KAGV6866597K1ZHJ9SQ158JF",
      "name": "Merch",
      "handle": "merch",
      "parent_category_id": null
    },
    "pcat_01KAGV6866FDTE5WATJF1N8QG8": {
      "id": "pcat_01KAGV6866FDTE5WATJF1N8QG8",
      "name": "Shirts",
      "handle": "shirts",
      "parent_category_id": null
    },
    "pcat_01KAGV6866W70T024DM1GYS60W": {
      "id": "pcat_01KAGV6866W70T024DM1GYS60W",
      "name": "Pants",
      "handle": "pants",
      "parent_category_id": null
    }
  },
  "leafCategories": [
    {
      "id": "pcat_01KAGV6866597K1ZHJ9SQ158JF",
      "name": "Merch",
      "handle": "merch",
      "parent_category_id": null
    },
    {
      "id": "pcat_01KAGV6866W70T024DM1GYS60W",
      "name": "Pants",
      "handle": "pants",
      "parent_category_id": null
    },
    {
      "id": "pcat_01KAGV6866FDTE5WATJF1N8QG8",
      "name": "Shirts",
      "handle": "shirts",
      "parent_category_id": null
    },
    {
      "id": "pcat_01KAGV68663VFPVHHVCAZXZJWK",
      "name": "Sweatshirts",
      "handle": "sweatshirts",
      "parent_category_id": null
    }
  ],
  "leafParents": [],
  "generatedAt": "2025-11-20T19:18:15.532Z",
  "filteringStats": {
    "totalCategoriesBeforeFiltering": 4,
    "totalCategoriesAfterFiltering": 4,
    "categoriesWithDirectProducts": 4,
    "filteredOutCount": 0
  }
}

export default data
export const { allCategories, categoryTree, rootCategories, categoryMap, leafCategories, leafParents, filteringStats } = data
