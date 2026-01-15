import type { CollectionConfig } from 'payload'

import { generateSlugFromTitle } from '../lib/hooks/slug'
import { adminGroups, collectionLabels } from '../lib/constants/labels'
import { createSlugField, createTitleField } from '../lib/constants/fields'
import { fieldDescriptions } from '../lib/constants/descriptions'
import { requireAuth } from '../lib/access/requireAuth'

export const ArticleCategories: CollectionConfig = {
  slug: 'article-categories',
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
  },
}
