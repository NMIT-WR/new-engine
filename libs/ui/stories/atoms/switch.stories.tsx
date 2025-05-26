import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { VariantContainer } from '../../.storybook/decorator'
import { Switch } from '../../src/atoms/switch'

const meta: Meta<typeof Switch> = {
  title: 'Atoms/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    readOnly: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {
  args: {

  }
}

export const ControlledSwitch: Story = {
  render: () => {
    const [isChecked, setIsChecked] = useState(false)

    const handleChange = (checked: boolean) => {
      console.log('Switch state changed:', checked)
      setIsChecked(checked)
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Switch checked={isChecked} onCheckedChange={handleChange}>
            Controlled switch
          </Switch>
          <span className="text-sm">Status: {isChecked ? 'ON' : 'OFF'}</span>
        </div>
        <button
          onClick={() => setIsChecked((prev) => !prev)}
          className="rounded border px-3 py-1 text-sm hover:bg-gray-100/20"
        >
          Toggle switch
        </button>
      </div>
    )
  },
}
