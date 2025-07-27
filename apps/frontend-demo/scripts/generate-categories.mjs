/**
 * Script to generate static category data at build time - V2 with deep leaf extraction
 * Run with: node scripts/generate-categories-2.mjs
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

// We'll make a direct HTTP request since we can't easily import TS files
async function fetchCategoriesDirectly() {
  const baseUrl =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'

  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

  const headers = {
    'Content-Type': 'application/json',
  }

  // Add publishable key if available
  if (publishableKey) {
    headers['x-publishable-api-key'] = publishableKey
  }

  console.log(`Fetching from: ${baseUrl}/store/product-categories`)

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

// Copy of ROOT_CATEGORY_ORDER from category-utils
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

// New function to extract leaf categories and their parents with ALL nested leafs
function extractLeafsAndParents(categoryTree, allCategoriesMap) {
  const leafCategories = []
  const leafParentsMap = new Map()
  
  // First, identify all leaf nodes
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
      })
    } else {
      node.children.forEach(child => identifyLeafs(child))
    }
  }
  
  // Identify all leafs first
  categoryTree.forEach(rootNode => identifyLeafs(rootNode))
  
  // Now find all ancestors of leafs and collect their nested leafs
  function collectAllNestedLeafs(node) {
    const nestedLeafs = []
    
    function traverse(n) {
      if (n.children.length === 0) {
        nestedLeafs.push(n.id)
      } else {
        n.children.forEach(child => traverse(child))
      }
    }
    
    traverse(node)
    return nestedLeafs
  }
  
  // Check each node if it has at least one direct child that is a leaf
  function checkForLeafParents(node) {
    // Check if any direct child is a leaf
    const hasDirectLeafChild = node.children.some(child => allLeafIds.has(child.id))
    
    // If this node has at least one direct leaf child
    if (hasDirectLeafChild && !allLeafIds.has(node.id)) {
      const allNestedLeafs = collectAllNestedLeafs(node)
      
      leafParentsMap.set(node.id, {
        id: node.id,
        name: node.name,
        handle: node.handle,
        children: node.children.map(child => child.id), // Keep original direct children
        leafs: allNestedLeafs // Add all nested leaf IDs
      })
    }
    
    // Check all children recursively
    node.children.forEach(child => checkForLeafParents(child))
  }
  
  // Check all nodes starting from root
  categoryTree.forEach(rootNode => checkForLeafParents(rootNode))

  return {
    leafCategories,
    leafParents: Array.from(leafParentsMap.values()),
  }
}

async function generateCategories() {
  console.log('🔄 Generating static category data V2...')

  try {
    // Fetch categories from API
    const categoriesRaw = await fetchCategoriesDirectly()

    // Transform categories
    const allCategories = categoriesRaw.map((cat) => ({
      id: cat.id,
      name: cat.name,
      handle: cat.handle,
      description: cat.description || undefined,
      parent_category_id: cat.parent_category_id,
    }))

    // Create category map
    const categoryMap = {}
    allCategories.forEach((cat) => {
      categoryMap[cat.id] = cat
    })

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

    // Build tree structure
    const categoryTree = buildCategoryTree(allCategories)

    // Extract leafs and their parents with all nested leafs
    const { leafCategories, leafParents } = extractLeafsAndParents(
      categoryTree,
      categoryMap
    )

    const dataToSave = {
      allCategories,
      categoryTree,
      rootCategories,
      categoryMap,
      leafCategories,
      leafParents,
      generatedAt: new Date().toISOString(),
    }

    // Ensure directory exists
    const dataDir = path.join(__dirname, '../public/data')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    // Write JSON to public directory
    const outputPath = path.join(dataDir, 'categories.json')
    fs.writeFileSync(outputPath, JSON.stringify(dataToSave, null, 2))

    // Generate TypeScript module
    const tsOutputPath = path.join(
      __dirname,
      '../src/lib/static-data/categories.ts'
    )
    const tsDir = path.dirname(tsOutputPath)

    if (!fs.existsSync(tsDir)) {
      fs.mkdirSync(tsDir, { recursive: true })
    }

    const tsContent = `// Auto-generated file - DO NOT EDIT
// Generated at: ${new Date().toISOString()}
// Run 'node scripts/generate-categories-2.mjs' to regenerate

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

export interface StaticCategoryData {
  allCategories: Category[]
  categoryTree: CategoryTreeNode[]
  rootCategories: Category[]
  categoryMap: Record<string, Category>
  leafCategories: LeafCategory[]
  leafParents: LeafParent[]
  generatedAt: string
}

const data: StaticCategoryData = ${JSON.stringify(dataToSave, null, 2)}

export default data
export const { allCategories, categoryTree, rootCategories, categoryMap, leafCategories, leafParents } = data
`

    fs.writeFileSync(tsOutputPath, tsContent)

    console.log('✅ Category data V2 generated successfully!')
    console.log(`📁 JSON saved to: ${outputPath}`)
    console.log(`📁 TypeScript module saved to: ${tsOutputPath}`)
    console.log(`📊 Stats:`)
    console.log(`   - Total categories: ${allCategories.length}`)
    console.log(`   - Root categories: ${rootCategories.length}`)
    console.log(`   - Leaf categories: ${leafCategories.length}`)
    console.log(`   - Leaf parents: ${leafParents.length}`)
    
    // Log some examples of leaf parents with their nested leafs
    console.log('\n📋 Example leaf parents with nested leafs:')
    leafParents.slice(0, 3).forEach(parent => {
      console.log(`   - ${parent.name}: ${parent.leafs.length} leafs`)
    })
    
    console.log(
      `\n   - File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`
    )
  } catch (error) {
    console.error('❌ Error generating categories:', error)
    process.exit(1)
  }
}

// Run the script
generateCategories()