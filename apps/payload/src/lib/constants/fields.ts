import type {
  DateField,
  RichTextField,
  SelectField,
  TextField,
} from 'payload'

import { fieldLabels } from './labels'
import { statusOptions } from './statusOptions'

type LocalizedLabel = {
  en: string
  cs: string
  sk: string
}

type Description = LocalizedLabel

type TextFieldOptions = {
  label?: LocalizedLabel
  required?: boolean
  localized?: boolean
  maxLength?: number
}

type SlugFieldOptions = {
  label?: LocalizedLabel
  description: Description
  localized?: boolean
}

type ContentFieldOptions = {
  label?: LocalizedLabel
  localized?: boolean
  editor: RichTextField['editor']
  required?: boolean
  admin?: RichTextField['admin']
}

export const createTitleField = (options: TextFieldOptions = {}): TextField => ({
  name: 'title',
  type: 'text',
  required: options.required ?? true,
  localized: options.localized ?? true,
  ...(options.maxLength ? { maxLength: options.maxLength } : {}),
  label: options.label ?? fieldLabels.title,
})

export const createSlugField = (options: SlugFieldOptions): TextField => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  localized: options.localized ?? true,
  label: options.label ?? fieldLabels.slug,
  admin: {
    description: options.description,
  },
})

export const createContentField = (options: ContentFieldOptions): RichTextField => ({
  name: 'content',
  type: 'richText',
  editor: options.editor,
  localized: options.localized ?? true,
  required: options.required,
  admin: options.admin,
  label: options.label ?? fieldLabels.content,
})

export const createStatusField = (): SelectField => ({
  name: 'status',
  type: 'select',
  required: true,
  defaultValue: 'draft',
  label: fieldLabels.status,
  options: statusOptions,
})

export const createPublishedDateField = (): DateField => ({
  name: 'publishedDate',
  type: 'date',
  required: true,
  defaultValue: () => new Date(),
  label: fieldLabels.publishDate,
  admin: {
    date: {
      pickerAppearance: 'dayOnly',
      displayFormat: 'dd.MM.yyyy',
    },
  },
})
