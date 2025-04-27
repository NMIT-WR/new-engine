import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from '../../src/atoms/checkbox'

const meta = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Checked state of the checkbox',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state of the checkbox',
    },
    onChange: { action: 'changed' },
  },
  args: {
    checked: false,
    disabled: false,
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: function Render() {
    return <Checkbox id="checkbox" />
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const WithLabel: Story = {
  render: function Render() {
    return (
      <div className="flex items-center gap-2">
        <Checkbox id="terms" />
        <label htmlFor="terms" className="cursor-pointer text-sm">
          I agree to the terms and conditions
        </label>
      </div>
    )
  },
}
