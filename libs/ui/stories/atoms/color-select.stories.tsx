import type { Meta, StoryObj } from '@storybook/react'
import { VariantContainer, VariantGroup } from '../../.storybook/decorator'
import { ColorSelect } from '../../src/atoms/color-select'
import { useState } from 'react'

const meta: Meta<typeof ColorSelect> = {
  title: 'Atoms/ColorSelect',
  component: ColorSelect,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'ColorSelect is an atom component for selecting colors. It displays a color swatch with optional name and count, supporting various sizes and states including selected and disabled.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: { type: 'color' },
      description: 'The color to display (hex, rgb, hsl, or named color)'
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the color selector'
    },
    radius: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'full'],
      description: 'Border radius variant'
    },
    selected: {
      control: { type: 'boolean' },
      description: 'Whether the color is currently selected'
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the color selector is disabled'
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler for color selection'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    color: '#3b82f6',
    colorName: 'Blue',
    size: 'md',
    radius: 'full',
    selected: false,
    disabled: false
  }
}

export const States: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="States">
        <ColorSelect 
          color="#3b82f6" 
          aria-label="Select blue color for theme"
        />
        <ColorSelect 
          color="#3b82f6" 
          selected
          aria-label="Success color currently selected"
        />
        <ColorSelect 
          color="#3b82f6" 
          disabled
          aria-label="Error color (unavailable)"
        />
      </VariantGroup>
    </VariantContainer>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Accessibility features including proper ARIA labels, descriptions, and keyboard navigation support.'
      }
    }
  }
}

export const AllVariants: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Radius Variants">
        <ColorSelect color="#ef4444" radius="sm" size="lg" />
        <ColorSelect color="#10b981" radius="md" size="lg" />
        <ColorSelect color="#3b82f6" radius="lg" size="lg" />
        <ColorSelect color="#f59e0b" radius="full" size="lg" selected />
      </VariantGroup>
      
      <VariantGroup title="Size Variants - Full Radius">
        <ColorSelect color="#8b5cf6" size="sm" radius="full" />
        <ColorSelect color="#ec4899" size="md" radius="full" />
        <ColorSelect color="#06b6d4" size="lg" radius="full" selected />
      </VariantGroup>
      
      <VariantGroup title='Custom size'>
        <div className='h-16'>
          <ColorSelect color="#6366f1" radius='md' size="full" />
        </div>
      </VariantGroup>
    </VariantContainer>
  )
}

export const Interactive: Story = {
  render: () => {
    const [selectedColor, setSelectedColor] = useState<string | null>(null)
    const [selectedColors, setSelectedColors] = useState<string[]>([])
    const colors = [
      { hex: '#ef4444', name: 'Red' },
      { hex: '#f97316', name: 'Orange' },
      { hex: '#f59e0b', name: 'Amber' },
      { hex: '#84cc16', name: 'Lime' },
      { hex: '#10b981', name: 'Emerald' },
      { hex: '#06b6d4', name: 'Cyan' },
    ]

        const toggleColor = (colorHex: string) => {
      setSelectedColors(prev => 
        prev.includes(colorHex) 
          ? prev.filter(c => c !== colorHex)
          : [...prev, colorHex]
      )
    }
    
    return (
      <div className="space-y-6">
          <p className="text-fg-secondary text-sm mb-4">
            Selected: {selectedColor ? colors.find(c => c.hex === selectedColor)?.name : 'None'}
          </p>
          <VariantGroup title="Interactive Color Selection">
            {colors.map((color) => (
              <ColorSelect
                key={color.hex}
                color={color.hex}
                selected={selectedColor === color.hex}
                onClick={() => setSelectedColor(color.hex === selectedColor ? null : color.hex)}
              />
            ))}
          </VariantGroup>

          <VariantGroup title="Multi-Select Color Palette">
            {colors.map((color) => (
              <ColorSelect
                key={color.hex}
                color={color.hex}
                selected={selectedColors.includes(color.hex)}
                onClick={() => toggleColor(color.hex)}
              />
            ))}
          </VariantGroup>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example with useState for selection management. Click colors to select/deselect.'
      }
    }
  }
}


