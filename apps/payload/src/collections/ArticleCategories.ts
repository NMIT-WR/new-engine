import type { CollectionConfig } from 'payload'

import { generateSlugFromTitle } from '../lib/hooks/slug'
import { adminGroups, collectionLabels } from '../lib/constants/labels'
import { createSlugField, createTitleField } from '../lib/constants/fields'
import { fieldDescriptions } from '../lib/constants/descriptions'
import { requireAuth } from '../lib/access/requireAuth'
import { createMedusaCacheHook } from '../lib/hooks/medusaCache'

const COLLECTION_SLUG = 'article-categories'
const invalidateArticleCategoriesCache = createMedusaCacheHook(COLLECTION_SLUG)

export const ArticleCategories: CollectionConfig = {
  slug: COLLECTION_SLUG,
  labels: collectionLabels.articleCategories,
  admin: {
    useAsTitle: 'title',
    group: adminGroups.library,
  },
  access: {
    read: requireAuth,
  },
  fields: [
    createTitleField(),
    createSlugField({
      description: fieldDescriptions.slugCategory,
    }),
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.title && !data?.slug) {
          data.slug = generateSlugFromTitle(data.title)
        }

        return data
      },
    ],
    afterChange: [invalidateArticleCategoriesCache],
    afterDelete: [invalidateArticleCategoriesCache],
  },
}
