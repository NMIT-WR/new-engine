import type { Meta, StoryObj } from '@storybook/react'
import type { SelectItem } from '../../src/molecules/select'
import { SelectTemplate } from '../../src/templates/select'

const defaultItems: SelectItem[] = [
  { value: 'cz', label: 'Czech Republic' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'pl', label: 'Poland' },
]

const meta: Meta<typeof SelectTemplate> = {
  title: 'Templates/SelectTemplate',
  component: SelectTemplate,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
          A ready-to-use select template with props-based API.
          This template provides a simplified interface for the Select compound component,
          making it ideal for Storybook controls and rapid prototyping.

          Part of the templates layer in atomic design architecture.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: 'object',
      description: 'Array of select items',
      table: {
        category: 'Content',
      },
    },
    label: {
      control: 'text',
      description: 'Select label text',
      table: {
        category: 'Content',
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no value is selected',
      table: {
        category: 'Content',
      },
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Size variant',
      table: {
        category: 'Appearance',
      },
    },
    validateStatus: {
      control: 'select',
      options: ['default', 'error', 'success', 'warning'],
      description: 'Validation status styling',
      table: {
        category: 'State',
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the select',
      table: {
        category: 'State',
      },
    },
    required: {
      control: 'boolean',
      description: 'Mark as required field',
      table: {
        category: 'State',
      },
    },
    showIndicator: {
      control: 'boolean',
      description: 'Show selection indicator for items',
      table: {
        category: 'Appearance',
      },
    },
    onValueChange: {
      action: 'value-changed',
      table: {
        category: 'Events',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof SelectTemplate>

export const Default: Story = {
  args: {
    items: defaultItems,
    label: 'Country',
    placeholder: 'Select a country',
    size: 'md',
    defaultValue: ['cz'],
  },
}

export const Playground: Story = {
  name: '🎮 Interactive Playground',
  args: {
    items: [
      ...defaultItems,
      { value: 'es', label: 'Spain', disabled: true },
    ],
    label: 'Country',
    placeholder: 'Select a country',
    size: 'md',
    showIndicator: true,
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex w-full max-w-container-sm flex-col gap-300">
      {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
        <SelectTemplate
          defaultValue={['cz']}
          items={defaultItems}
          key={size}
          label={`Size ${size.toUpperCase()}`}
          placeholder="Select a country"
          size={size}
        />
      ))}
    </div>
  ),
}
