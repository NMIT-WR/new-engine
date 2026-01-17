import type { CollectionConfig } from 'payload'
import { lexicalHTMLField } from '@payloadcms/richtext-lexical'

import { createLexicalEditor } from '../lib/editors/lexical'
import { generateSlugFromTitle } from '../lib/hooks/slug'
import { adminGroups, collectionLabels, fieldLabels } from '../lib/constants/labels'
import { seoGroupField } from '../lib/constants/fieldGroups'
import { fieldDescriptions } from '../lib/constants/descriptions'
import { requireAuth } from '../lib/access/requireAuth'
import {
  createContentField,
  createPublishedDateField,
  createSlugField,
  createStatusField,
  createTitleField,
} from '../lib/constants/fields'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: collectionLabels.pages,
  admin: {
    useAsTitle: 'title',
    group: adminGroups.content,
  },
  access: {
    read: requireAuth,
  },
  fields: [
    createTitleField(),
    createSlugField({
      description: fieldDescriptions.slugPage,
    }),
    {
      name: 'category',
      label: fieldLabels.category,
      type: 'relationship',
      relationTo: 'page-categories',
      required: false,
    },
    createContentField({ editor: createLexicalEditor() }),
    lexicalHTMLField({
      htmlFieldName: 'contentHTML',
      lexicalFieldName: 'content',
    }),
    {
      name: 'visibility',
      label: fieldLabels.visibility,
      type: 'select',
      required: true,
      defaultValue: 'public',
      options: [
        {
          label: fieldLabels.visibilityPublic,
          value: 'public',
        },
        {
          label: fieldLabels.visibilityCustomersOnly,
          value: 'customers-only',
        },
      ],
    },
    createStatusField(),
    createPublishedDateField(),
    seoGroupField,
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
    afterRead: [
      ({ doc, req }) => {
        if (req?.method !== 'GET') {
          return doc
        }

        if (doc.contentHTML !== undefined) {
          const { contentHTML, ...rest } = doc
          return {
            ...rest,
            content: contentHTML,
          }
        }

        return doc
      },
    ],
  },
}
