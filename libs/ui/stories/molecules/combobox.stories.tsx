import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { VariantContainer } from '../../.storybook/decorator'
import { Combobox, type ComboboxItem } from '../../src/molecules/combobox'

const countries: ComboboxItem[] = [
  { id: '1', label: 'Czech Republic', value: 'cz' },
  { id: '2', label: 'Slovakia', value: 'sk' },
  { id: '3', label: 'Germany', value: 'de' },
  { id: '4', label: 'Austria', value: 'at', disabled: true },
  { id: '5', label: 'Poland', value: 'pl' },
  { id: '6', label: 'France', value: 'fr', disabled: true },
  { id: '7', label: 'Italy', value: 'it' },
  { id: '8', label: 'Spain', value: 'es' },
  { id: '9', label: 'Great Britain', value: 'gb' },
  { id: '10', label: 'USA', value: 'us' },
]

const meta: Meta<typeof Combobox> = {
  title: 'Molecules/Combobox',
  component: Combobox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    validateStatus: {
      control: { type: 'select' },
      options: ['default', 'error', 'success', 'warning'],
      description: 'Validation status of the combobox',
    },
    helpText: {
      control: 'text',
      description: 'Help text displayed below the combobox',
    },
    showHelpTextIcon: {
      control: 'boolean',
      description: 'Whether to show an icon with the help text',
    },
    multiple: {
      control: 'boolean',
      description: 'Allows selection of multiple values',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction with the combobox',
    },
    clearable: {
      control: 'boolean',
      description: 'Allows clearing the selection',
    },
    closeOnSelect: {
      control: 'boolean',
      description: 'Closes the dropdown when an option is selected',
    },
  },
}

export default meta
type Story = StoryObj<typeof Combobox>

export const Default: Story = {
  args: {
    label: 'Select Country',
    placeholder: 'Choose a country...',
    items: countries,
    helpText: 'Select your country of residence',
  },
}

export const ValidationStates: Story = {
  render: () => (
    <VariantContainer>
      <Combobox
        label="Default State"
        placeholder="Select country"
        items={countries}
        helpText="Default state without validation"
      />
      <Combobox
        label="Error State"
        placeholder="Select country"
        items={countries}
        validateStatus="error"
        helpText="Please select a valid country"
      />
      <Combobox
        label="Success State"
        placeholder="Select country"
        items={countries}
        validateStatus="success"
        helpText="Your choice is valid"
      />
      <Combobox
        label="Warning State"
        placeholder="Select country"
        items={countries}
        validateStatus="warning"
        helpText="This country may require additional verification"
      />
    </VariantContainer>
  ),
}

export const MultipleSelection: Story = {
  args: {
    label: 'Select Countries',
    placeholder: 'Choose countries...',
    items: countries,
    helpText: 'Select the countries you have visited',
    multiple: true,
    closeOnSelect: false,
  },
}

export const Sizes: Story = {
  render: () => (
    <VariantContainer>
      <Combobox
        label="Small Size"
        placeholder="Select country"
        items={countries}
        helpText="Small combobox variant"
        size="sm"
      />
      <Combobox
        label="Medium Size"
        placeholder="Select country"
        items={countries}
        helpText="Medium combobox variant (default)"
        size="md"
      />
      <Combobox
        label="Large Size"
        placeholder="Select country"
        items={countries}
        helpText="Large combobox variant"
        size="lg"
      />
    </VariantContainer>
  ),
}

export const ComplexStory: Story = {
  render: () => {
    const [selectedCountryValue, setSelectedCountryValue] = useState<
      string | null
    >(null)

    const validateStatus =
      selectedCountryValue === 'us'
        ? 'error'
        : selectedCountryValue === 'sk'
          ? 'warning'
          : selectedCountryValue === 'cz'
            ? 'success'
            : 'default'

    const dynamicHelpText =
      validateStatus === 'error'
        ? 'USA is currently unavailable'
        : validateStatus === 'warning'
          ? 'Slovakia requires additional identity verification'
          : validateStatus === 'success'
            ? 'Country successfully selected'
            : 'Select your country of residence'

    return (
      <div className="w-72 space-y-8">
        {' '}
        <Combobox
          label="Select Country (Dynamic Validation)"
          placeholder="Choose a country..."
          items={countries}
          onChange={(value) => {
            const singleValue = Array.isArray(value) ? value[0] : value
            setSelectedCountryValue(singleValue ?? null)
          }}
          validateStatus={validateStatus}
          helpText={dynamicHelpText}
        />
        <div className="text-sm ">
          Try selecting different countries to see validation states change:
          <ul className="mt-2 ml-5 list-disc">
            <li>USA - error</li>
            <li>Slovakia - warning</li>
            <li>Czech Republic - success</li>
          </ul>
        </div>
      </div>
    )
  },
}
