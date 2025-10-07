import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Label } from '../../src/atoms/label'
import { NumericInput } from '../../src/atoms/numeric-input'

const meta: Meta<typeof NumericInput> = {
  title: 'Atoms/NumericInput',
  component: NumericInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible numeric input component using compound pattern. Provides granular control over layout and behavior through composable subcomponents.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof NumericInput>

// Default - Basic usage without label
export const Default: Story = {
  render: () => {
    const [value, setValue] = useState(0)

    return (
      <div className="w-md">
        <NumericInput value={value} onChange={setValue} min={0} max={100}>
          <NumericInput.Control>
            <NumericInput.Input />
            <NumericInput.TriggerContainer>
              <NumericInput.IncrementTrigger />
              <NumericInput.DecrementTrigger />
            </NumericInput.TriggerContainer>
          </NumericInput.Control>
        </NumericInput>
      </div>
    )
  },
}

// With Label - Shows label usage
export const WithLabel: Story = {
  render: () => {
    const [value, setValue] = useState(42)

    return (
      <div className="w-md flex flex-col gap-xs">
        <Label htmlFor="numeric-with-label">Quantity</Label>
        <NumericInput
          id="numeric-with-label"
          value={value}
          onChange={setValue}
          min={0}
          max={100}
        >
          <NumericInput.Control>
            <NumericInput.Input />
            <NumericInput.TriggerContainer>
              <NumericInput.IncrementTrigger />
              <NumericInput.DecrementTrigger />
            </NumericInput.TriggerContainer>
          </NumericInput.Control>
        </NumericInput>
      </div>
    )
  },
}

// All Sizes - Shows all size variants
export const AllSizes: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-lg">
        <div className="w-md flex flex-col gap-xs">
          <Label htmlFor="numeric-sm" size="sm">
            Small (sm)
          </Label>
          <NumericInput id="numeric-sm" size="sm" defaultValue={10}>
            <NumericInput.Control>
              <NumericInput.Input />
              <NumericInput.TriggerContainer>
                <NumericInput.IncrementTrigger />
                <NumericInput.DecrementTrigger />
              </NumericInput.TriggerContainer>
            </NumericInput.Control>
          </NumericInput>
        </div>

        <div className="w-md flex flex-col gap-xs">
          <Label htmlFor="numeric-md" size="md">
            Medium (md)
          </Label>
          <NumericInput id="numeric-md" size="md" defaultValue={20}>
            <NumericInput.Control>
              <NumericInput.Input />
              <NumericInput.TriggerContainer>
                <NumericInput.IncrementTrigger />
                <NumericInput.DecrementTrigger />
              </NumericInput.TriggerContainer>
            </NumericInput.Control>
          </NumericInput>
        </div>

        <div className="w-md flex flex-col gap-xs">
          <Label htmlFor="numeric-lg" size="lg">
            Large (lg)
          </Label>
          <NumericInput id="numeric-lg" size="lg" defaultValue={30}>
            <NumericInput.Control>
              <NumericInput.Input />
              <NumericInput.TriggerContainer>
                <NumericInput.IncrementTrigger />
                <NumericInput.DecrementTrigger />
              </NumericInput.TriggerContainer>
            </NumericInput.Control>
          </NumericInput>
        </div>
      </div>
    )
  },
}

// Without Controls - Clean input without visible buttons
export const WithoutControls: Story = {
  render: () => {
    const [value, setValue] = useState(50)

    return (
      <div className="w-md flex flex-col gap-xs">
        <Label htmlFor="numeric-no-controls">
          Use arrow keys or mouse wheel
        </Label>
        <NumericInput
          id="numeric-no-controls"
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          allowMouseWheel
        >
          <NumericInput.Control>
            <NumericInput.Input />
          </NumericInput.Control>
        </NumericInput>
        <p className="text-fg-muted text-sm mt-xs">
          Current value: {value}
        </p>
      </div>
    )
  },
}

// With Scrubber - Drag to change value
export const WithScrubber: Story = {
  render: () => {
    const [value, setValue] = useState(50)

    return (
      <div className="w-md flex flex-col gap-xs">
        <Label htmlFor="numeric-scrubber">
          Drag left/right to change value
        </Label>
        <NumericInput
          id="numeric-scrubber"
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          step={5}
        >
          <NumericInput.Control>
            <NumericInput.Scrubber />
            <NumericInput.Input />
            <NumericInput.TriggerContainer>
              <NumericInput.IncrementTrigger />
              <NumericInput.DecrementTrigger />
            </NumericInput.TriggerContainer>
          </NumericInput.Control>
        </NumericInput>
        <p className="text-fg-muted text-sm mt-xs">
          Current value: {value}
        </p>
      </div>
    )
  },
}

// Min Max - Shows value constraints
export const MinMax: Story = {
  render: () => {
    const [value, setValue] = useState(5)

    return (
      <div className="w-md flex flex-col gap-xs">
        <Label htmlFor="numeric-minmax">
          Range: 0-10 (clamped on blur)
        </Label>
        <NumericInput
          id="numeric-minmax"
          value={value}
          onChange={setValue}
          min={0}
          max={10}
          step={1}
          clampValueOnBlur
        >
          <NumericInput.Control>
            <NumericInput.Input />
            <NumericInput.TriggerContainer>
              <NumericInput.IncrementTrigger />
              <NumericInput.DecrementTrigger />
            </NumericInput.TriggerContainer>
          </NumericInput.Control>
        </NumericInput>
        <p className="text-fg-muted text-sm mt-xs">
          Try typing a value outside the range and blur the input
        </p>
      </div>
    )
  },
}

// Invalid State - Shows error state
export const InvalidState: Story = {
  render: () => {
    const [value, setValue] = useState(150)
    const isInvalid = value < 0 || value > 100

    return (
      <div className="w-md flex flex-col gap-xs">
        <Label htmlFor="numeric-invalid">Valid range: 0-100</Label>
        <NumericInput
          id="numeric-invalid"
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          invalid={isInvalid}
          allowOverflow
        >
          <NumericInput.Control>
            <NumericInput.Input />
            <NumericInput.TriggerContainer>
              <NumericInput.IncrementTrigger />
              <NumericInput.DecrementTrigger />
            </NumericInput.TriggerContainer>
          </NumericInput.Control>
        </NumericInput>
        {isInvalid && (
          <p className="text-fg-danger text-sm mt-xs">
            Value must be between 0 and 100
          </p>
        )}
      </div>
    )
  },
}

// Precision - Decimal values
export const WithPrecision: Story = {
  render: () => {
    const [value, setValue] = useState(3.14)

    return (
      <div className="w-md flex flex-col gap-xs">
        <Label htmlFor="numeric-precision">
          Pi approximation (2 decimals)
        </Label>
        <NumericInput
          id="numeric-precision"
          value={value}
          onChange={setValue}
          min={0}
          max={10}
          step={0.1}
          precision={2}
        >
          <NumericInput.Control>
            <NumericInput.Input />
            <NumericInput.TriggerContainer>
              <NumericInput.IncrementTrigger />
              <NumericInput.DecrementTrigger />
            </NumericInput.TriggerContainer>
          </NumericInput.Control>
        </NumericInput>
        <p className="text-fg-muted text-sm mt-xs">
          Current value: {value}
        </p>
      </div>
    )
  },
}

// Custom Layout - Horizontal triggers
export const CustomLayoutHorizontal: Story = {
  render: () => {
    const [value, setValue] = useState(50)

    return (
      <div className="w-md flex flex-col gap-xs">
        <Label htmlFor="numeric-custom-h">Custom Layout</Label>
        <NumericInput
          id="numeric-custom-h"
          value={value}
          onChange={setValue}
          min={0}
          max={100}
        >
          <div className="flex gap-xs">
            <NumericInput.DecrementTrigger className='bg-overlay' icon='icon-[mdi--minus]'/>
            <NumericInput.Control className="flex-1">
              <NumericInput.Input />
            </NumericInput.Control>
            <NumericInput.IncrementTrigger className='bg-overlay' icon='icon-[mdi--plus]'/>
          </div>
        </NumericInput>
      </div>
    )
  },
}


// Disabled State
export const Disabled: Story = {
  render: () => {
    return (
      <div className="w-md flex flex-col gap-xs">
        <Label htmlFor="numeric-disabled">Disabled Input</Label>
        <NumericInput id="numeric-disabled" defaultValue={42} disabled>
          <NumericInput.Control>
            <NumericInput.Input />
            <NumericInput.TriggerContainer>
              <NumericInput.IncrementTrigger />
              <NumericInput.DecrementTrigger />
            </NumericInput.TriggerContainer>
          </NumericInput.Control>
        </NumericInput>
      </div>
    )
  },
}

// Custom Button Props - Shows Button customization options
export const CustomButtonProps: Story = {
  render: () => {
    const [value1, setValue1] = useState(10)
    const [value2, setValue2] = useState(20)
    const [value3, setValue3] = useState(30)
    const [value4, setValue4] = useState(40)

    return (
      <div className="flex flex-col gap-lg">
        {/* Variant customization */}
        <div className="w-md flex flex-col gap-xs">
          <Label htmlFor="numeric-variant">Different Variants</Label>
          <NumericInput
            id="numeric-variant"
            value={value1}
            onChange={setValue1}
            min={0}
            max={100}
          >
            <NumericInput.Control>
              <NumericInput.Input />
              <NumericInput.TriggerContainer>
                <NumericInput.IncrementTrigger variant="primary" />
                <NumericInput.DecrementTrigger variant="danger" />
              </NumericInput.TriggerContainer>
            </NumericInput.Control>
          </NumericInput>
        </div>

        {/* Size customization */}
        <div className="w-md flex flex-col gap-xs">
          <Label htmlFor="numeric-size">Different Themes</Label>
          <NumericInput
            id="numeric-size"
            value={value3}
            onChange={setValue3}
            min={0}
            max={100}
          >
            <NumericInput.Control>
              <NumericInput.Input />
              <NumericInput.TriggerContainer>
                <NumericInput.IncrementTrigger variant='primary' theme='solid' />
                <NumericInput.DecrementTrigger variant='danger' theme='solid' />
              </NumericInput.TriggerContainer>
            </NumericInput.Control>
          </NumericInput>
        </div>
      </div>
    )
  },
}

// Interactive Demo - Full featured
export const InteractiveDemo: Story = {
  render: () => {
    const [value, setValue] = useState(50)
    const [min] = useState(0)
    const [max] = useState(100)
    const [step] = useState(5)

    return (
      <div className="flex flex-col gap-md w-lg">
        <div className="flex flex-col gap-xs">
          <Label htmlFor="numeric-interactive">
            Interactive Numeric Input
          </Label>
          <NumericInput
            id="numeric-interactive"
            value={value}
            onChange={setValue}
            min={min}
            max={max}
            step={step}
            clampValueOnBlur={true}
            allowMouseWheel={true}
          >
            <NumericInput.Control>
              <NumericInput.Input />
              <NumericInput.TriggerContainer>
                <NumericInput.IncrementTrigger />
                <NumericInput.DecrementTrigger />
              </NumericInput.TriggerContainer>
            </NumericInput.Control>
          </NumericInput>
        </div>

        <div className="bg-surface-secondary p-md rounded-md">
          <h3 className="text-fg-primary font-semibold mb-sm">Info</h3>
          <ul className="text-fg-muted text-sm space-y-xs">
            <li>
              Current value: <strong>{value}</strong>
            </li>
            <li>
              Min: {min}, Max: {max}
            </li>
            <li>Step: {step}</li>
            <li>Features:</li>
            <ul className="ml-md space-y-xs">
              <li>✓ Arrow keys (↑/↓)</li>
              <li>✓ Button controls</li>
              <li>✓ Keyboard shortcuts (Home/End, Page Up/Down)</li>
            </ul>
          </ul>
        </div>
      </div>
    )
  },
}
