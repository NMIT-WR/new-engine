import type { Meta, StoryObj } from '@storybook/react'
import '../../src/tokens/_colors.css'
import '../../src/tokens/_semantic.css'
import { ColorSelect } from '../../src/atoms/color-select'

const meta: Meta = {
  title: 'Overview/Color Palette',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj

const semanticColors = [
  'primary',
  'secondary', 
  'tertiary',
  'info',
  'success',
  'warning',
  'danger',
] as const

const colorVariants = [
  { suffix: '', label: 'Default' },
  { suffix: '-light', label: 'Light' },
] as const

const stateVariants = [
  { state: '', label: 'Default' },
  { state: 'hover', label: 'Hover' },
  { state: 'active', label: 'Active' },
  { state: 'disabled', label: 'Disabled' },
] as const



export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-base p-8">
      <div className="max-w-7xl mx-auto">
        
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {semanticColors.map(color => (
            <div className="bg-surface rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 capitalize text-fg-primary">
              {color}
            </h3>
      
      <div className="space-y-6">
        {colorVariants.map(({ suffix, label }) => (
          <div key={suffix}>
            <h4 className="text-sm font-medium text-fg-secondary mb-3">
              {label}
            </h4>
            <div className="grid grid-cols-4 gap-4">
              {stateVariants.map(({ state, label: stateLabel }) => {
                const baseColorVar = `--color-${color}${suffix}`
                const computedColor = state === 'disabled' 
                  ? `var(--color-${color}${suffix}-disabled)`
                  : state !== ''
                  ? `oklch(from var(${baseColorVar}) calc(l + var(--state-${state})) c h)`
                  : `var(${baseColorVar})`

                const colorTokenName = state === 'disabled' 
                  ? `--color-${color}${suffix}-disabled`
                  : state !== ''
                  ? `--color-${color}${suffix}-${state}`
                  : `--color-${color}${suffix}`

                return (
                  <div key={state} className="flex flex-col items-center gap-2 min-w-0">
                    <div className='h-16 w-16 flex-shrink-0'>
                      <ColorSelect
                        color={computedColor}
                        size='full'
                        radius='md'
                      />
                    </div>
                    <div className="text-center w-full">
                      <div className="text-xs font-medium text-fg-primary truncate">
                        {state || 'Default'}
                      </div>
                      <div className="text-xs font-mono text-fg-secondary mt-1 break-all leading-tight">
                        {colorTokenName}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
          ))}
        </div>        
      </div>
    </div>
  ),
}
