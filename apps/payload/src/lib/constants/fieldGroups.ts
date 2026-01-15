import type { Field } from 'payload'

import { fieldLabels } from './labels'

export const seoGroupField: Field = {
  name: 'seo',
  label: fieldLabels.seo,
  type: 'group',
  fields: [
    {
      name: 'metaTitle',
      label: fieldLabels.metaTitle,
      type: 'text',
      localized: true,
    },
    {
      name: 'metaDescription',
      label: fieldLabels.metaDescription,
      type: 'textarea',
      localized: true,
    },
    {
      name: 'metaImage',
      label: fieldLabels.metaImage,
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
