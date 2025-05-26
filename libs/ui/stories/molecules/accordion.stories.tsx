import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Accordion } from '../../src/molecules/accordion'

const accordionItems = [
  {
    id: '1',
    value: 'item-1',
    title: 'What is an Accordion?',
    subtitle: 'Accordion with subtitle',
    content:
      "Accordion is a UI component that allows collapsing and expanding content, saving space on the page and enabling users to view only the information they're interested in.",
  },
  {
    id: '2',
    value: 'item-2',
    title: 'How to use an Accordion?',
    content:
      "By clicking on the accordion header, its content expands or collapses. You can have either one or multiple accordions open simultaneously, depending on the component's configuration.",
  },
  {
    id: '3',
    value: 'item-3',
    title: 'Why use an Accordion?',
    content:
      'Accordion is useful for organizing content that may be lengthy or complex. Users can easily navigate through relevant sections without needing to scroll through the entire page.',
    disabled: true,
  },
]

const meta: Meta<typeof Accordion> = {
  title: 'Molecules/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    multiple: {
      control: 'boolean',
      description: 'Allows expanding multiple items simultaneously',
    },
    collapsible: {
      control: 'boolean',
      description: 'Allows collapsing all items',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction with the accordion',
    },
  },
}

export default meta
type Story = StoryObj<typeof Accordion>

export const Default: Story = {
  render: () => (
    <div className="w-96">
      <Accordion items={accordionItems} collapsible={true} multiple={false} />
    </div>
  ),
}

export const Multiple: Story = {
  render: () => (
    <div className="w-96">
      <Accordion items={accordionItems} collapsible={true} multiple={true} />
    </div>
  ),
}

export const ControlledAccordion: Story = {
  render: () => {
    const [activeItems, setActiveItems] = useState<string[]>(['item-1'])

    const handleValueChange = (value: string[]) => {
      setActiveItems(value)
    }

    return (
      <div className="w-96">
        <h2 className="mb-4 font-bold text-lg">Controlled Accordion</h2>
        <div className="mb-4">
          <p className="text-sm">Active items: {activeItems.join(', ')}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {accordionItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  const isActive = activeItems.includes(item.value)
                  if (isActive) {
                    setActiveItems(activeItems.filter((i) => i !== item.value))
                  } else {
                    // For single mode, we would use: setActiveItems([item.value])
                    setActiveItems([...activeItems, item.value])
                  }
                }}
                className="rounded border px-3 py-1 text-sm hover:bg-gray-100/20"
                disabled={item.disabled}
              >
                Toggle {item.title}
              </button>
            ))}
            <button
              onClick={() => setActiveItems([])}
              className="rounded border px-3 py-1 text-sm hover:bg-gray-100/20"
            >
              Close All
            </button>
          </div>
        </div>
        <Accordion
          items={accordionItems}
          value={activeItems}
          onChange={handleValueChange}
          multiple={true}
          collapsible={true}
        />
      </div>
    )
  },
}
