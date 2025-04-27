import type { Meta, StoryObj } from '@storybook/react'
import { FormCheckbox } from '../../src/molecules/form-checkbox'

const meta: Meta<typeof FormCheckbox> = {
  title: 'Molecules/FormCheckbox',
  component: FormCheckbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FormCheckbox>

// Basic checkbox
export const Default: Story = {
  args: {
    id: 'default-checkbox',
    label: 'Accept terms and conditions',
  },
}

// Checked checkbox
export const Checked: Story = {
  args: {
    ...Default.args,
    id: 'checked-checkbox',
    defaultChecked: true,
  },
}

// With error state
export const WithError: Story = {
  args: {
    ...Default.args,
    id: 'error-checkbox',
    validateStatus: 'error',
    helpText: 'You must accept the terms to continue',
  },
}

// With helper text
export const WithHelperText: Story = {
  args: {
    ...Default.args,
    id: 'helper-checkbox',
    helpText: 'By checking this box, you agree to our terms of service',
  },
}

// With extra text
export const WithExtraText: Story = {
  args: {
    ...Default.args,
    id: 'extra-checkbox',
    extraText: 'This option is recommended for new users',
  },
}

// Disabled checkbox
export const Disabled: Story = {
  args: {
    ...Default.args,
    id: 'disabled-checkbox',
    disabled: true,
  },
}

// Required checkbox
export const Required: Story = {
  args: {
    ...Default.args,
    id: 'required-checkbox',
    required: true,
  },
}
