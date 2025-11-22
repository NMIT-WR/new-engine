import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Button } from '../../src/atoms/button'
import { Icon } from '../../src/atoms/icon'
import { Select, type SelectOption } from '../../src/molecules/select'

// Mock data
const countries: SelectOption[] = [
  { label: 'United States', value: 'us' },
  { label: 'Canada', value: 'ca' },
  { label: 'Mexico', value: 'mx' },
  { label: 'Brazil', value: 'br' },
  { label: 'Argentina', value: 'ar' },
  { label: 'Chile', value: 'cl' },
  { label: 'Germany', value: 'de' },
  { label: 'France', value: 'fr' },
  { label: 'United Kingdom', value: 'gb' },
  { label: 'Italy', value: 'it' },
  { label: 'Spain', value: 'es' },
  { label: 'Japan', value: 'jp' },
  { label: 'China', value: 'cn' },
  { label: 'India', value: 'in', disabled: true },
  { label: 'Australia', value: 'au' },
]

const languages: SelectOption[] = [
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Italian', value: 'it' },
  { label: 'Dutch', value: 'nl' },
  { label: 'Russian', value: 'ru' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Chinese', value: 'zh' },
  { label: 'Arabic', value: 'ar' },
  { label: 'Hindi', value: 'hi' },
  { label: 'Bengali', value: 'bn' },
  { label: 'Polish', value: 'pl', disabled: true },
  { label: 'Turkish', value: 'tr', disabled: true },
]

const meta: Meta<typeof Select> = {
  title: 'Molecules/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A select component built with Zag.js that provides accessible dropdown selection with keyboard navigation and typeahead support.

## Features
- Single and multiple selection modes
- Keyboard navigation
- Typeahead support
- Native form integration
- Customizable styling
- Accessible by default
        `,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      const { title, description } = context.parameters

      return (
        <div className="flex w-72 flex-col gap-6 p-4">
          {title && <h3 className="font-medium text-lg">{title}</h3>}
          {description && (
            <p className="mb-2 text-gray-600 text-sm">{description}</p>
          )}
          <div className="space-y-4">
            <Story />
          </div>
        </div>
      )
    },
  ],
  argTypes: {
    // Core props
    options: {
      control: 'object',
      description: 'Array of options to display in the select',
    },
    label: {
      control: 'text',
      description: 'Label for the select',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no option is selected',
    },

    // Variants
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the select',
    },

    // State
    multiple: {
      control: 'boolean',
      description: 'Whether multiple options can be selected',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the select is disabled',
    },
    invalid: {
      control: 'boolean',
      description: 'Whether the select has validation errors',
    },
    required: {
      control: 'boolean',
      description: 'Whether the select is required',
    },
    readOnly: {
      control: 'boolean',
      description: 'Whether the select is read-only',
    },

    closeOnSelect: {
      control: 'boolean',
      description: 'Whether to close the dropdown after selecting an option',
    },
    loopFocus: {
      control: 'boolean',
      description: 'Whether keyboard navigation loops at end of list',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Basic examples
export const Default: Story = {
  args: {
    options: countries,
    label: 'Select a country',
    placeholder: 'Choose a country',
  },
}

export const WithValue: Story = {
  args: {
    options: countries,
    label: 'Select a country',
    defaultValue: ['us'],
  },
}

export const Sizes: Story = {
  render: () => (
    <>
      <Select options={countries} label="Small" size="sm" />
      <Select options={countries} label="Medium (default)" size="md" />
      <Select options={countries} label="Large" size="lg" />
    </>
  ),
}

export const States: Story = {
  render: () => (
    <>
      <Select options={countries} label="Disabled" disabled />
      <Select
        options={countries}
        label="Invalid"
        invalid
        errorText="Please select a valid country"
      />
      <Select
        options={countries}
        label="Required"
        required
        helperText="This field is required"
      />
      <Select
        options={countries}
        label="Read-only"
        readOnly
        defaultValue={['us']}
      />
    </>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates different states of the Select component including disabled, invalid with error message, required with helper text, and read-only with default value.',
      },
    },
  },
}

export const WithHelperText: Story = {
  args: {
    options: countries,
    label: 'Country',
    placeholder: 'Select your country',
    helperText: 'Choose the country where you currently reside',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows how to add helper text below the select to provide additional context to users.',
      },
    },
  },
}

// Multiple selection
export const Multiple: Story = {
  args: {
    options: languages,
    label: 'Select languages',
    placeholder: 'Choose languages',
    multiple: true,
    defaultValue: ['en', 'es'],
  },
}

// Non-string values, here with icons
export const WithIcons: Story = {
  args: {
    options: [
      {
        label: (
          <>
            <Icon icon={'icon-[cif--gb]'} size="sm" /> English
          </>
        ),
        value: 'en',
      },
      {
        label: (
          <>
            <Icon icon={'icon-[cif--es]'} size="sm" /> Spanish
          </>
        ),
        value: 'es',
      },
      {
        label: (
          <>
            <Icon icon={'icon-[cif--fr]'} size="sm" /> French
          </>
        ),
        value: 'fr',
      },
      {
        label: (
          <>
            <Icon icon={'icon-[cif--cz]'} size="sm" /> Czech
          </>
        ),
        value: 'cz',
      },
    ],
    label: 'Select a language',
    placeholder: 'Choose a language',
  },
}

// Controlled state
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['fr'])

    return (
      <>
        <Select
          options={languages}
          label="Select a language"
          placeholder="Choose a language"
          value={value}
          onValueChange={(details) => setValue(details.value)}
        />

        <div className="text-sm">
          <div>
            <strong>Selected:</strong> {value.join(', ') || 'None'}
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" onClick={() => setValue(['en'])}>
            Set to English
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setValue([])}>
            Clear
          </Button>
        </div>
      </>
    )
  },
}

export const WithinForm: Story = {
  render: () => {
    const [formState, setFormState] = useState({
      country: [] as string[],
      language: [] as string[],
    })
    const [submittedData, setSubmittedData] = useState<null | {
      country: string[]
      language: string[]
    }>(null)

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      setSubmittedData(formState)
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          options={countries}
          label="Country"
          required
          invalid={formState.country.length === 0}
          errorText="Please select a country"
          value={formState.country}
          onValueChange={(details) =>
            setFormState((prev) => ({ ...prev, country: details.value }))
          }
        />

        <Select
          options={languages}
          label="Languages"
          multiple
          placeholder="Select languages you speak"
          helperText="You can select multiple languages"
          value={formState.language}
          onValueChange={(details) =>
            setFormState((prev) => ({ ...prev, language: details.value }))
          }
        />

        <Button type="submit" variant="primary">
          Submit Form
        </Button>

        {submittedData && (
          <div className="mt-4 rounded-md border border-green-200 bg-green-50/10 p-4">
            <h4 className="mb-2 font-medium">Form Submitted:</h4>
            <p>
              <strong>Country:</strong>{' '}
              {(countries.find((c) => c.value === submittedData.country[0])
                ?.label) || 'None'}
            </p>
            <p>
              <strong>Languages:</strong>{' '}
              {submittedData.language
                .map((l) => languages.find((lang) => lang.value === l)?.label)
                .join(', ') || 'None'}
            </p>
          </div>
        )}
      </form>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates how Select components integrate with forms, including validation, submission, and displaying the submitted values.',
      },
    },
  },
}
