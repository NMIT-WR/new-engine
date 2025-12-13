import { headerImgs } from '@/assets/header'
import { allCategories, rootCategories } from '@/data/static/categories'
import { ALL_CATEGORIES_MAP } from '@/lib/constants'
import type { StaticImageData } from 'next/image'

export type SubMenuItem = {
  name: string
  href: string
  image?: StaticImageData
  categoryIds?: string[] // Optional for backward compatibility
}

export type SubmenuCategory = {
  name: string
  href: string
  items: SubMenuItem[]
}

// ============================================
// DYNAMICALLY GENERATED VERSIONS
// ============================================

// Exception mapping for special category names
const CATEGORY_IMAGE_EXCEPTIONS: Record<string, string> = {
  skateboarding: 'skateboard',
  snowboarding: 'snowboard',
  'saty-a-sukne': 'saty',
  'trika-a-tilka': 'trika',
  'doplnky-komponenty': 'doplnky',
}

// Helper: Convert handle to headerImgs key (removes -category-XXX pattern and converts to camelCase)
const handleToImageKey = (handle: string): string => {
  // Remove "-category-XXX" pattern
  const cleanHandle = handle.replace(/-category-\d+$/, '')

  // Check for exceptions first
  if (CATEGORY_IMAGE_EXCEPTIONS[cleanHandle]) {
    return CATEGORY_IMAGE_EXCEPTIONS[cleanHandle]
  }

  // Convert to camelCase
  return cleanHandle
    .split('-')
    .map((word, i) =>
      i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join('')
}

// Helper: Get image for category based on handle path
const getImageForCategory = (
  parentHandle: string,
  childHandle: string
): StaticImageData | undefined => {
  const parentKey = handleToImageKey(parentHandle) as keyof typeof headerImgs

  // Try to find matching image in headerImgs structure
  const parentImages = headerImgs[parentKey]
  if (!parentImages || typeof parentImages !== 'object') return undefined

  // Convert child handle to camelCase for image lookup
  const childKey = handleToImageKey(childHandle) as keyof typeof parentImages

  return parentImages[childKey] as StaticImageData | undefined
}

// Generate navigation links from rootCategories
export const links = [
  {
    href: '/novinky',
    label: 'Novinky',
  },
  ...rootCategories.map((category) => ({
    href: `/kategorie/${category.handle}`,
    label: category.name,
  })),
  {
    href: '/vyprodej',
    label: 'Výprodej',
  },
]

// Generate submenu items from categories
export const submenuItems: SubmenuCategory[] = rootCategories.map((rootCat) => {
  // Find all direct children of this root category
  const directChildren = allCategories.filter(
    (cat) => cat.parent_category_id === rootCat.id
  )

  return {
    name: rootCat.name,
    href: `/kategorie/${rootCat.handle}`,
    items: directChildren.map((child) => ({
      name: child.name,
      href: `/kategorie/${child.handle}`,
      image: getImageForCategory(rootCat.handle, child.handle),
      categoryIds: ALL_CATEGORIES_MAP[child.handle] || [],
    })),
  }
})
