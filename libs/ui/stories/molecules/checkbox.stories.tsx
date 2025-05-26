import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Checkbox } from '../../src/molecules/checkbox'

const meta = {
  title: 'Molecules/Checkbox',
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
    defaultChecked: {
      control: 'boolean',
      description: 'Default checked state (uncontrolled component)',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Indeterminate state (partially checked)',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state of the checkbox',
    },
    'aria-invalid': {
      control: 'boolean',
      description: 'Shows invalid state styling',
    },
    'aria-required': {
      control: 'boolean',
      description: 'Marks checkbox as required for accessibility',
    },
    onChange: { action: 'changed' },
  },
  args: {
    checked: undefined,
    defaultChecked: false,
    indeterminate: false,
    disabled: false,
    'aria-invalid': false,
    'aria-required': false,
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

// Basic stories
export const Default: Story = {
  args: {},
}

export const Indeterminate: Story = {
  render: function Render() {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Checkbox id="indeterminate-test" indeterminate />
          <label htmlFor="indeterminate-test">Indeterminate state</label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="checked-test" defaultChecked />
          <label htmlFor="checked-test">Checked state</label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="unchecked-test" />
          <label htmlFor="unchecked-test">Unchecked state</label>
        </div>
      </div>
    )
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
}

export const InvalidState: Story = {
  args: {
    invalid: true,
  },
}

export const RequiredState: Story = {
  args: {
    'aria-required': true,
  },
}

// Advanced stories with custom renders
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

export const AllStates: Story = {
  render: function Render() {
    return (
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <div className="flex items-center gap-2">
          <Checkbox id="default" />
          <label htmlFor="default" className="text-sm">
            Default
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="checked" defaultChecked />
          <label htmlFor="checked" className="text-sm">
            Checked
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="indeterminate" indeterminate />
          <label htmlFor="indeterminate" className="text-sm">
            Indeterminate
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="disabled" disabled />
          <label htmlFor="disabled" className="text-sm">
            Disabled
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="disabled-checked" disabled defaultChecked />
          <label htmlFor="disabled-checked" className="text-sm">
            Disabled + Checked
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="invalid" invalid />
          <label htmlFor="invalid" className="text-sm">
            Invalid
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="required" aria-required />
          <label htmlFor="required" className="text-sm">
            Required
          </label>
        </div>
      </div>
    )
  },
}

export const IndeterminateTest: Story = {
  render: function Render() {
    const [items, setItems] = useState([
      { id: 1, name: 'Item A', checked: false },
      { id: 2, name: 'Item B', checked: true },
      { id: 3, name: 'Item C', checked: true },
    ])

    const checkedCount = items.filter((item) => item.checked).length
    const allChecked = checkedCount === items.length
    const noneChecked = checkedCount === 0
    const isIndeterminate = !allChecked && !noneChecked

    const handleParentChange = (checked: boolean) => {
      setItems((prevItems) => prevItems.map((item) => ({ ...item, checked })))
    }

    const handleChildChange = (id: number, checked: boolean) => {
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === id ? { ...item, checked } : item))
      )
    }

    return (
      <div className="w-48 rounded border p-4">
        {/* Parent checkbox */}
        <div className="mb-4 flex items-center gap-2 font-medium">
          <Checkbox
            id="parent"
            checked={allChecked}
            indeterminate={isIndeterminate}
            onChange={handleParentChange}
          />
          <label htmlFor="parent">
            Select All ({checkedCount}/{items.length})
          </label>
        </div>

        {/* Child checkboxes */}
        <div className="space-y-2 pl-6">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <Checkbox
                id={`item-${item.id}`}
                checked={item.checked}
                onChange={(checked) => handleChildChange(item.id, checked)}
              />
              <label htmlFor={`item-${item.id}`}>{item.name}</label>
            </div>
          ))}
        </div>
      </div>
    )
  },
}
