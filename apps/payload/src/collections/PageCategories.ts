import type { CollectionConfig } from 'payload'

import { generateSlugFromTitle } from '../lib/hooks/slug'
import { adminGroups, collectionLabels, fieldLabels } from '../lib/constants/labels'
import { createSlugField, createTitleField } from '../lib/constants/fields'
import { fieldDescriptions } from '../lib/constants/descriptions'
import { requireAuth } from '../lib/access/requireAuth'

export const PageCategories: CollectionConfig = {
  slug: 'page-categories',
  labels: collectionLabels.pageCategories,
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
      description: fieldDescriptions.slugPageCategory,
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
