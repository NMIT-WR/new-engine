import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { VariantContainer } from '../../.storybook/decorator'
import { Tabs } from '../../src/atoms/tabs'

const meta: Meta<typeof Tabs> = {
  title: 'Atoms/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'solid', 'line'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the tabs',
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Tabs orientation',
    },
    dir: {
      control: 'radio',
      options: ['ltr', 'rtl'],
      description: 'Text direction',
    },
    activationMode: {
      control: 'radio',
      options: ['automatic', 'manual'],
      description: 'Tab activation behavior',
    },
    showIndicator: {
      control: 'boolean',
      description: 'Show active tab indicator',
    },
    loopFocus: {
      control: 'boolean',
      description: 'Loop keyboard focus',
    },
  },
}

export default meta
type Story = StoryObj<typeof Tabs>

// Base props shared across stories
const baseItems = [
  {
    value: 'tab1',
    label: 'Tab One',
    content: (
      <div>
        <h3 className="mb-2 font-semibold text-lg">Tab One Content</h3>
        <p>
          This is the content for the first tab. It can contain any React
          elements.
        </p>
      </div>
    ),
  },
  {
    value: 'tab2',
    label: 'Tab Two',
    content: (
      <div>
        <h3 className="mb-2 font-semibold text-md">Tab Two Content</h3>
        <p>
          Second tab content goes here. You can put forms, images, or any
          components.
        </p>
      </div>
    ),
  },
  {
    value: 'tab3',
    label: 'Tab Three',
    content: (
      <div>
        <h3 className="mb-2 font-semibold text-md">Tab Three Content</h3>
        <p>The third tab can have completely different content structure.</p>
      </div>
    ),
  },
  {
    value: 'tab4',
    label: 'Disabled Tab',
    content: (
      <div>
        <h3 className="mb-2 font-semibold text-md">Disabled Tab</h3>
        <p>This content should not be visible as the tab is disabled.</p>
      </div>
    ),
    disabled: true,
  },
]

export const Default: Story = {
  render: () => (
    <div className="w-[600px]">
      <Tabs items={baseItems} defaultValue="tab1" />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <VariantContainer orientation="vertical">
      <div className="w-[600px]">
        <h3 className="mb-2 font-semibold text-md">Default</h3>
        <Tabs items={baseItems} variant="default" />
      </div>
      <div className="w-[600px]">
        <h3 className="mb-2 font-semibold text-md">Solid</h3>
        <Tabs items={baseItems} variant="solid" />
      </div>
      <div className="w-[600px]">
        <h3 className="mb-2 font-semibold text-md">Line</h3>
        <Tabs items={baseItems} variant="line" />
      </div>
    </VariantContainer>
  ),
}

export const Sizes: Story = {
  render: () => (
    <VariantContainer orientation="vertical">
      <div className="w-fit max-w-[600px]">
        <h3 className="mb-2 font-semibold text-md">Small</h3>
        <Tabs items={baseItems} size="sm" />
      </div>
      <div className="w-fit max-w-[600px]">
        <h3 className="mb-2 font-semibold text-lg">Medium (Default)</h3>
        <Tabs items={baseItems} size="md" />
      </div>
      <div className="w-fit max-w-[800px]">
        <h3 className="mb-2 font-semibold text-xl">Large</h3>
        <Tabs items={baseItems} size="lg" />
      </div>
    </VariantContainer>
  ),
}

export const VerticalOrientation: Story = {
  render: () => (
    <div className="h-[400px] w-[600px]">
      <Tabs items={baseItems} orientation="vertical" variant="default" />
    </div>
  ),
}

export const ControlledTabs: Story = {
  render: () => {
    const [selectedTab, setSelectedTab] = useState('tab2')

    return (
      <div className="w-[600px] space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-sm">Current tab: {selectedTab}</span>
          <button
            onClick={() => setSelectedTab('tab1')}
            className="rounded border px-3 py-1 text-sm hover:bg-gray-100/20"
          >
            Go to Tab 1
          </button>
          <button
            onClick={() => setSelectedTab('tab3')}
            className="rounded border px-3 py-1 text-sm hover:bg-gray-100/20"
          >
            Go to Tab 3
          </button>
        </div>
        <Tabs
          items={baseItems}
          value={selectedTab}
          onValueChange={setSelectedTab}
        />
      </div>
    )
  },
}

export const RTLSupport: Story = {
  render: () => (
    <div className="w-[600px]" dir="rtl">
      <Tabs items={baseItems} dir="rtl" />
    </div>
  ),
}
