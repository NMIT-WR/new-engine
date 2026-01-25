import type { Endpoint } from 'payload'
import { buildJsonResponse, getLocaleFromRequest, getQueryParam } from '../utils/endpoint'
import { getCategoryDoc, type CategoryDoc } from '../utils/docSelectors'

type PageDoc = {
  title: unknown
  slug?: unknown
  category?: number | CategoryDoc | null
}

export const pageCategoriesWithPagesEndpoint: Endpoint = {
  path: '/page-categories-with-pages',
  method: 'get',
  handler: async (req) => {
    const locale = getLocaleFromRequest(req)
    const categorySlug = getQueryParam(req, 'categorySlug')

    const pagesResult = await req.payload.find({
      collection: 'pages',
      depth: 1,
      pagination: false,
      limit: 0,
      locale,
      where: {
        status: { equals: 'published' },
        ...(categorySlug
          ? {
              'category.slug': { equals: categorySlug },
            }
          : {}),
      },
      select: {
        title: true,
        slug: true,
        category: true,
      },
      req,
    })

    const categoriesById = new Map<
      number,
      { id: number; title: unknown; slug: unknown; pages: { title: unknown; slug?: unknown }[] }
    >()
    for (const page of pagesResult.docs as PageDoc[]) {
      const category = getCategoryDoc(page.category)
      if (!category) {
        continue
      }
      const entry =
        categoriesById.get(category.id) ?? {
          ...category,
          pages: [],
        }
      entry.pages.push({ title: page.title, slug: page.slug })
      categoriesById.set(category.id, entry)
    }

    return buildJsonResponse(req, { categories: Array.from(categoriesById.values()) })
  },
}
