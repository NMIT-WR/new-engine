import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { VariantContainer, VariantGroup } from '../../.storybook/decorator'
import { NumericInput } from '../../src/atoms/numeric-input'

const meta: Meta<typeof NumericInput> = {
  title: 'Atoms/NumericInput',
  component: NumericInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of input field',
    },
    min: {
      control: 'number',
      description: 'Minimum value',
    },
    max: {
      control: 'number',
      description: 'Maximum value',
    },
    step: {
      control: 'number',
      description: 'Step value',
    },
    precision: {
      control: 'number',
      description: 'Decimal precision',
    },
    hideControls: {
      control: 'boolean',
      description: 'Hide increment/decrement buttons',
    },
    allowScrubbing: {
      control: 'boolean',
      description: 'Allow scrubbing interaction',
    },
    allowMouseWheel: {
      control: 'boolean',
      description: 'Allow value change with mouse wheel',
    },
  },
}

export default meta
type Story = StoryObj<typeof NumericInput>

const baseArgs = {
  defaultValue: 5,
  min: 0,
  max: 100,
  step: 1,
}

export const Default: Story = {
  args: {
    ...baseArgs,
  },
}

export const Basic: Story = {
  render: () => {
    const [currentValue, setCurrentValue] = useState(10)
    return (
      <VariantContainer>
        <div className="grid gap-4">
          <NumericInput size="sm" {...baseArgs} />
          <NumericInput size="md" {...baseArgs} />
          <NumericInput size="lg" {...baseArgs} />
        </div>
        <div className="grid gap-4">
          <NumericInput size="sm" disabled {...baseArgs} />
          <NumericInput
            size="sm"
            defaultValue={10}
            invalid={currentValue === 10}
            onChange={(value) => setCurrentValue(value)}
          />
        </div>
      </VariantContainer>
    )
  },
}

export const WithControls: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="With Controls">
        <NumericInput hideControls={false} defaultValue={5} />
        <NumericInput hideControls={false} size="md" defaultValue={10} />
        <NumericInput hideControls={false} size="lg" defaultValue={15} />
      </VariantGroup>
    </VariantContainer>
  ),
}

export const WithBoundaries: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Min/Max Boundaries">
        <NumericInput defaultValue={15} min={10} max={20} />
        <NumericInput defaultValue={50} min={0} max={100} step={10} />
      </VariantGroup>
    </VariantContainer>
  ),
}

export const Formatting: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Formatting Options">
        <NumericInput defaultValue={12.34} precision={2} step={0.01} />
        <NumericInput
          defaultValue={1250}
          formatOptions={{
            style: 'currency',
            currency: 'USD',
          }}
        />
      </VariantGroup>
    </VariantContainer>
  ),
}

export const InteractionMethods: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Interaction Methods">
        <NumericInput allowScrubbing={true} defaultValue={50} />
        <NumericInput allowMouseWheel={false} defaultValue={25} />
      </VariantGroup>
    </VariantContainer>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState(42)
    return (
      <VariantContainer>
        <VariantGroup title="Controlled Component">
          <NumericInput value={value} onChange={setValue} />
          <p>Current value: {value}</p>
        </VariantGroup>
      </VariantContainer>
    )
  },
}