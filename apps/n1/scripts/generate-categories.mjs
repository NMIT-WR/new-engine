/**
 * Script to generate static category data for n1 app
 * Based on frontend-demo version but adapted for n1
 *
 * NEW FEATURE: Adds root_category_id to all categories
 *
 * Run with: pnpm run generate:categories
 * Test with: pnpm run test:categories
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables - try .env first, then .env.local
dotenv.config({ path: path.join(__dirname, '../.env') })
dotenv.config({ path: path.join(__dirname, '../.env.local') })

// ============================================================================
// API FETCH FUNCTIONS
// ============================================================================

/**
 * Fetch categories from Medusa API
 */
async function fetchCategoriesDirectly() {
  const baseUrl =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'

  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

  const headers = {
    'Content-Type': 'application/json',
  }

  if (publishableKey) {
    headers['x-publishable-api-key'] = publishableKey
  }

  console.log(`Fetching categories from: ${baseUrl}/store/product-categories`)

  const response = await fetch(
    `${baseUrl}/store/product-categories?limit=1000&fields=id,name,handle,parent_category_id,description`,
    {
      headers,
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`)
  }

  const data = await response.json()
  return data.product_categories || []
}

/**
 * Fetch products and determine which categories have products
 */
async function fetchProductsAndCategorizesByCategory() {
  const baseUrl =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'

  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

  const headers = {
    'Content-Type': 'application/json',
  }

  if (publishableKey) {
    headers['x-publishable-api-key'] = publishableKey
  }

  console.log(`Fetching products from: ${baseUrl}/store/products`)

  const categoriesWithProducts = new Set()
  let offset = 0
  const limit = 100
  let hasMore = true

  while (hasMore) {
    const response = await fetch(
      `${baseUrl}/store/products?limit=${limit}&offset=${offset}&fields=id,categories.id,categories.name,categories.handle`,
      {
        headers,
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`)
    }

    const data = await response.json()
    const products = data.products || []

    products.forEach((product) => {
      if (product.categories && Array.isArray(product.categories)) {
        product.categories.forEach((category) => {
          if (category.id) {
            categoriesWithProducts.add(category.id)
          }
        })
      }
    })

    hasMore = products.length === limit
    offset += limit

    console.log(
      `Processed ${offset} products, found ${categoriesWithProducts.size} categories with products`
    )
  }

  console.log(`Total categories with products: ${categoriesWithProducts.size}`)
  return categoriesWithProducts
}

// ============================================================================
// CATEGORY PROCESSING FUNCTIONS
// ============================================================================

const ROOT_CATEGORY_ORDER = [
  'Pánské',
  'Dámské',
  'Dětské',
  'Oblečení',
  'Cyklo',
  'Moto',
  'Snb-Skate',
  'Ski',
]

/**
 * Build category tree from flat list
 */
function buildCategoryTree(categories) {
  const categoryMap = new Map()
  const rootNodes = []

  // First pass: create all nodes
  categories.forEach((cat) => {
    categoryMap.set(cat.id, {
      id: cat.id,
      name: cat.name,
      handle: cat.handle,
      description: cat.description,
      children: [],
    })
  })

  // Second pass: build tree structure
  categories.forEach((cat) => {
    const node = categoryMap.get(cat.id)

    if (cat.parent_category_id) {
      const parent = categoryMap.get(cat.parent_category_id)
      if (parent) {
        parent.children = parent.children || []
        parent.children.push(node)
      }
    } else {
      rootNodes.push(node)
    }
  })

  // Sort root nodes
  return rootNodes.sort((a, b) => {
    const indexA = ROOT_CATEGORY_ORDER.indexOf(a.name)
    const indexB = ROOT_CATEGORY_ORDER.indexOf(b.name)

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB
    }

    if (indexA !== -1) return -1
    if (indexB !== -1) return 1

    return a.name.localeCompare(b.name)
  })
}

/**
 * Check if category or any descendants has products
 */
function categoryHasProducts(
  categoryId,
  categoriesWithProducts,
  categoryTree,
  categoryMap
) {
  if (categoriesWithProducts.has(categoryId)) {
    return true
  }

  function checkDescendants(node) {
    if (categoriesWithProducts.has(node.id)) {
      return true
    }

    for (const child of node.children) {
      if (checkDescendants(child)) {
        return true
      }
    }

    return false
  }

  function findNodeInTree(nodes, targetId) {
    for (const node of nodes) {
      if (node.id === targetId) {
        return node
      }
      const found = findNodeInTree(node.children, targetId)
      if (found) {
        return found
      }
    }
    return null
  }

  const node = findNodeInTree(categoryTree, categoryId)
  return node ? checkDescendants(node) : false
}

/**
 * Filter categories to keep only those with products (including ancestors)
 */
function filterCategoriesWithProducts(
  categories,
  categoriesWithProducts,
  categoryTree,
  categoryMap
) {
  const categoriesToKeep = new Set()

  categories.forEach((category) => {
    if (
      categoryHasProducts(
        category.id,
        categoriesWithProducts,
        categoryTree,
        categoryMap
      )
    ) {
      categoriesToKeep.add(category.id)

      // Also mark all ancestors
      let currentId = category.parent_category_id
      while (currentId && !categoriesToKeep.has(currentId)) {
        categoriesToKeep.add(currentId)
        const parentCategory = categoryMap[currentId]
        currentId = parentCategory?.parent_category_id
      }
    }
  })

  return categories.filter((category) => categoriesToKeep.has(category.id))
}

/**
 * NEW FEATURE: Add root_category_id to all categories
 *
 * @param {Array} categories - Array of category objects
 * @param {Object} categoryMap - Map of category id -> category object
 * @returns {Array} - Categories with root_category_id added
 */
function addRootCategoryIds(categories, categoryMap) {
  const rootCache = new Map()

  /**
   * Find root category ID for a given category
   * Uses caching for performance - caches entire path
   */
  function findRootId(categoryId) {
    // Check cache first
    if (rootCache.has(categoryId)) {
      return rootCache.get(categoryId)
    }

    let current = categoryMap[categoryId]
    const path = [categoryId] // Track path for caching

    // Walk up the tree until we find root (parent_category_id === null)
    while (current?.parent_category_id) {
      const parentId = current.parent_category_id
      current = categoryMap[parentId]
      if (!current) break
      path.push(parentId)
    }

    // Root ID is:
    // - null if current category is root (no parent)
    // - ID of the root category if we found it
    const rootId = current?.parent_category_id === null ? current.id : null

    // Cache entire path for future lookups (O(1) for subsequent calls)
    path.forEach(id => {
      rootCache.set(id, rootId)
    })

    return rootId
  }

  // Add root_category_id to all categories
  categories.forEach(cat => {
    // If category is root (no parent), root_category_id is null
    // Otherwise, find the root category
    cat.root_category_id = cat.parent_category_id === null
      ? null
      : findRootId(cat.id)
  })

  return categories
}

/**
 * Extract leaf categories and their parents
 */
function extractLeafsAndParents(categoryTree, allCategoriesMap) {
  const leafCategories = []
  const leafParentsMap = new Map()

  const allLeafIds = new Set()

  function identifyLeafs(node) {
    if (node.children.length === 0) {
      allLeafIds.add(node.id)
      const categoryData = allCategoriesMap[node.id]
      leafCategories.push({
        id: node.id,
        name: node.name,
        handle: node.handle,
        parent_category_id: categoryData?.parent_category_id,
        root_category_id: categoryData?.root_category_id, // NEW: Include root_category_id
      })
    } else {
      node.children.forEach((child) => identifyLeafs(child))
    }
  }

  categoryTree.forEach((rootNode) => identifyLeafs(rootNode))

  function collectAllNestedLeafs(node) {
    const nestedLeafs = []

    function traverse(n) {
      if (n.children.length === 0) {
        nestedLeafs.push(n.id)
      } else {
        n.children.forEach((child) => traverse(child))
      }
    }

    traverse(node)
    return nestedLeafs
  }

  function checkForLeafParents(node) {
    const hasDirectLeafChild = node.children.some((child) =>
      allLeafIds.has(child.id)
    )

    if (hasDirectLeafChild && !allLeafIds.has(node.id)) {
      const allNestedLeafs = collectAllNestedLeafs(node)

      leafParentsMap.set(node.id, {
        id: node.id,
        name: node.name,
        handle: node.handle,
        children: node.children.map((child) => child.id),
        leafs: allNestedLeafs,
      })
    }

    node.children.forEach((child) => checkForLeafParents(child))
  }

  categoryTree.forEach((rootNode) => checkForLeafParents(rootNode))

  return {
    leafCategories,
    leafParents: Array.from(leafParentsMap.values()),
  }
}

// ============================================================================
// TESTING FUNCTIONS
// ============================================================================

/**
 * Test root_category_id correctness
 */
function testRootCategoryIds(allCategories, categoryMap, rootCategories) {
  console.log('\n🧪 Running tests for root_category_id...')

  let passedTests = 0
  let failedTests = 0

  // Test 1: Root categories should have root_category_id === null
  console.log('\n  Test 1: Root categories have root_category_id === null')
  rootCategories.forEach(root => {
    if (root.root_category_id === null) {
      passedTests++
    } else {
      console.error(`    ❌ FAIL: Root category "${root.name}" (${root.id}) has root_category_id=${root.root_category_id}, expected null`)
      failedTests++
    }
  })
  console.log(`    ✅ ${rootCategories.length} root categories checked`)

  // Test 2: Non-root categories should have root_category_id set
  console.log('\n  Test 2: Non-root categories have root_category_id set')
  const nonRootCategories = allCategories.filter(cat => cat.parent_category_id !== null)
  let nonRootWithoutRootId = 0

  nonRootCategories.forEach(cat => {
    if (cat.root_category_id === null || cat.root_category_id === undefined) {
      console.error(`    ❌ FAIL: Non-root category "${cat.name}" (${cat.id}) has root_category_id=${cat.root_category_id}`)
      failedTests++
      nonRootWithoutRootId++
    } else {
      passedTests++
    }
  })

  if (nonRootWithoutRootId === 0) {
    console.log(`    ✅ All ${nonRootCategories.length} non-root categories have root_category_id set`)
  } else {
    console.error(`    ❌ ${nonRootWithoutRootId} non-root categories missing root_category_id`)
  }

  // Test 3: Verify root_category_id points to actual root category
  console.log('\n  Test 3: root_category_id points to valid root category')
  const rootIds = new Set(rootCategories.map(r => r.id))

  nonRootCategories.forEach(cat => {
    if (cat.root_category_id && !rootIds.has(cat.root_category_id)) {
      console.error(`    ❌ FAIL: Category "${cat.name}" has invalid root_category_id=${cat.root_category_id}`)
      failedTests++
    } else if (cat.root_category_id) {
      passedTests++
    }
  })
  console.log(`    ✅ All root_category_id values point to valid root categories`)

  // Test 4: Sample deep categories
  console.log('\n  Test 4: Sample deep category chains')
  const sampleDeepCategories = allCategories
    .filter(cat => {
      // Find categories that are at least 3 levels deep
      let depth = 0
      let current = cat
      while (current?.parent_category_id) {
        depth++
        current = categoryMap[current.parent_category_id]
      }
      return depth >= 3
    })
    .slice(0, 3) // Just test 3 samples

  sampleDeepCategories.forEach(cat => {
    const rootCat = categoryMap[cat.root_category_id]
    if (rootCat && rootCat.parent_category_id === null) {
      console.log(`    ✅ "${cat.name}" → root: "${rootCat.name}"`)
      passedTests++
    } else {
      console.error(`    ❌ FAIL: Deep category "${cat.name}" has incorrect root_category_id`)
      failedTests++
    }
  })

  // Summary
  console.log('\n📊 Test Summary:')
  console.log(`  ✅ Passed: ${passedTests}`)
  console.log(`  ❌ Failed: ${failedTests}`)
  console.log(`  Total: ${passedTests + failedTests}`)

  if (failedTests > 0) {
    throw new Error(`❌ ${failedTests} test(s) failed!`)
  }

  console.log('\n✅ All tests passed!')
  return true
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

async function generateCategories() {
  console.log('🔄 Generating static category data for n1...')
  console.log('📋 NEW FEATURE: Adding root_category_id to all categories\n')

  try {
    // Fetch categories from API
    const categoriesRaw = await fetchCategoriesDirectly()

    // Fetch products and determine which categories have products
    const categoriesWithProducts = await fetchProductsAndCategorizesByCategory()

    // Transform categories
    const allCategoriesRaw = categoriesRaw.map((cat) => ({
      id: cat.id,
      name: cat.name,
      handle: cat.handle,
      description: cat.description || undefined,
      parent_category_id: cat.parent_category_id,
      root_category_id: null, // Will be filled in next step
    }))

    console.log(`Total categories before filtering: ${allCategoriesRaw.length}`)

    // Create category map for lookups
    const categoryMapRaw = {}
    allCategoriesRaw.forEach((cat) => {
      categoryMapRaw[cat.id] = cat
    })

    // Build initial tree to help with descendant checking
    const initialCategoryTree = buildCategoryTree(allCategoriesRaw)

    // Filter categories to keep only those with products or descendants with products
    const allCategories = filterCategoriesWithProducts(
      allCategoriesRaw,
      categoriesWithProducts,
      initialCategoryTree,
      categoryMapRaw
    )

    console.log(`Total categories after filtering: ${allCategories.length}`)
    console.log(
      `Filtered out ${allCategoriesRaw.length - allCategories.length} categories without products`
    )

    // Create category map from filtered categories
    const categoryMap = {}
    allCategories.forEach((cat) => {
      categoryMap[cat.id] = cat
    })

    // ⭐ NEW: Add root_category_id to all categories
    console.log('\n⭐ Adding root_category_id to all categories...')
    addRootCategoryIds(allCategories, categoryMap)
    console.log('✅ root_category_id added to all categories')

    // Filter and sort root categories
    const rootCategories = allCategories
      .filter((cat) => !cat.parent_category_id)
      .sort((a, b) => {
        const indexA = ROOT_CATEGORY_ORDER.indexOf(a.name)
        const indexB = ROOT_CATEGORY_ORDER.indexOf(b.name)

        if (indexA !== -1 && indexB !== -1) {
          return indexA - indexB
        }

        if (indexA !== -1) return -1
        if (indexB !== -1) return 1

        return a.name.localeCompare(b.name)
      })

    // Build tree structure from filtered categories
    const categoryTree = buildCategoryTree(allCategories)

    // Extract leafs and their parents with all nested leafs
    const { leafCategories, leafParents } = extractLeafsAndParents(
      categoryTree,
      categoryMap
    )

    // ⭐ RUN TESTS
    testRootCategoryIds(allCategories, categoryMap, rootCategories)

    const dataToSave = {
      allCategories,
      categoryTree,
      rootCategories,
      categoryMap,
      leafCategories,
      leafParents,
      generatedAt: new Date().toISOString(),
      filteringStats: {
        totalCategoriesBeforeFiltering: allCategoriesRaw.length,
        totalCategoriesAfterFiltering: allCategories.length,
        categoriesWithDirectProducts: categoriesWithProducts.size,
        filteredOutCount: allCategoriesRaw.length - allCategories.length,
      },
    }

    // Write TypeScript module to src/data/static/categories.ts
    const tsOutputPath = path.join(
      __dirname,
      '../src/data/static/categories.ts'
    )
    const tsDir = path.dirname(tsOutputPath)

    if (!fs.existsSync(tsDir)) {
      fs.mkdirSync(tsDir, { recursive: true })
    }

    const tsContent = `// Auto-generated file - DO NOT EDIT
// Generated at: ${new Date().toISOString()}
// Run 'pnpm run generate:categories' to regenerate
// This version filters out categories without products and adds root_category_id

import type { Category, CategoryTreeNode } from '@/data/static/type'

export interface LeafCategory {
  id: string
  name: string
  handle: string
  parent_category_id: string | null
  root_category_id: string | null // NEW: ID of root category
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

const data: StaticCategoryData = ${JSON.stringify(dataToSave, null, 2)}

export default data
export const { allCategories, categoryTree, rootCategories, categoryMap, leafCategories, leafParents, filteringStats } = data
`

    fs.writeFileSync(tsOutputPath, tsContent)

    console.log(
      '\n✅ Category data with root_category_id generated successfully!'
    )
    console.log(`📁 TypeScript module saved to: ${tsOutputPath}`)
    console.log(`📊 Stats:`)
    console.log(
      `   - Total categories (before filtering): ${allCategoriesRaw.length}`
    )
    console.log(
      `   - Total categories (after filtering): ${allCategories.length}`
    )
    console.log(
      `   - Categories with direct products: ${categoriesWithProducts.size}`
    )
    console.log(
      `   - Filtered out categories: ${allCategoriesRaw.length - allCategories.length}`
    )
    console.log(`   - Root categories: ${rootCategories.length}`)
    console.log(`   - Leaf categories: ${leafCategories.length}`)
    console.log(`   - Leaf parents: ${leafParents.length}`)
    console.log(`\n   ⭐ NEW: All categories now have root_category_id attribute`)
  } catch (error) {
    console.error('❌ Error generating categories:', error)
    process.exit(1)
  }
}

// Run the script
generateCategories()