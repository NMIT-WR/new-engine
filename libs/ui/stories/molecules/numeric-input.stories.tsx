import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { VariantContainer, VariantGroup } from '../../.storybook/decorator'
import { NumericInput } from '../../src/molecules/numeric-input'

const meta: Meta<typeof NumericInput> = {
  title: 'Molecules/NumericInput',
  component: NumericInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Velikost input fieldu',
    },
    min: {
      control: 'number',
      description: 'Minimální hodnota',
    },
    max: {
      control: 'number',
      description: 'Maximální hodnota',
    },
    step: {
      control: 'number',
      description: 'Krok změny hodnoty',
    },
    precision: {
      control: 'number',
      description: 'Počet desetinných míst',
    },
    hideControls: {
      control: 'boolean',
      description: 'Skrýt increment/decrement tlačítka',
    },
    allowScrubbing: {
      control: 'boolean',
      description: 'Povolit scrubbing interakci (táhnutí myší)',
    },
    allowMouseWheel: {
      control: 'boolean',
      description: 'Povolit změnu hodnoty pomocí kolečka myši',
    },
    labelText: {
      control: 'text',
      description: 'Text labelu',
    },
  },
}

export default meta
type Story = StoryObj<typeof NumericInput>

const baseArgs = {
  placeholder: 'Input value',
  min: 0,
  max: 100,
  step: 1,
}

export const Default: Story = {
  args: {
    placeholder: 'Input value',
    labelText: 'Default',
    min: 0,
    max: 100,
    step: 1,
    size: 'md',
    hideControls: false,
    allowScrubbing: false,
    allowMouseWheel: false,
    precision: 0,
  },
}

export const Basic: Story = {
  render: () => {
    const [currentValue, setCurrentValue] = useState(10)
    return (
      <VariantContainer>
        <div className="grid gap-4">
          <NumericInput labelText="Size sm" size="sm" {...baseArgs} />
          <NumericInput labelText="Size md" size="md" {...baseArgs} />
          <NumericInput labelText="Size lg" size="lg" {...baseArgs} />
        </div>
        <div className="grid gap-4">
          <NumericInput size="sm" labelText="Disabled" disabled {...baseArgs} />
          <NumericInput
            size="sm"
            labelText="INVALID IF VALUE = 10"
            defaultValue={10}
            invalid={currentValue === 10}
            onChange={(value) => setCurrentValue(value)}
          />
        </div>
      </VariantContainer>
    )
  },
}

export const WithDefaultValues: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Default Values">
        <NumericInput
          labelText="Min, Max Boundaries (10, 20)"
          defaultValue={15}
          min={10}
          max={20}
        />
        <NumericInput labelText="Custom Step (5)" defaultValue={25} step={5} />
      </VariantGroup>
    </VariantContainer>
  ),
}

export const FormattingOptions: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Formatting & Precision">
        <NumericInput
          labelText="Decimal Precision (2)"
          defaultValue={12.34}
          precision={2}
          step={0.01}
        />
        <NumericInput
          labelText="Currency Format (CZK)"
          defaultValue={1250}
          formatOptions={{
            style: 'currency',
            currency: 'CZK',
          }}
        />
        <NumericInput
          labelText="Percentage Format"
          defaultValue={0.25}
          min={0}
          max={1}
          step={0.01}
          formatOptions={{
            style: 'percent',
          }}
        />
      </VariantGroup>
    </VariantContainer>
  ),
}

export const WithScrubber: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Interaction Methods">
        <NumericInput
          labelText="With Scrubbing (try drag)"
          allowScrubbing={true}
          defaultValue={50}
        />
      </VariantGroup>
    </VariantContainer>
  ),
}
