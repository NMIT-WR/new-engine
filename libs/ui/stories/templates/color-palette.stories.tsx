import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import '../../src/tokens/_colors.css'
import '../../src/tokens/_semantic.css'

const meta: Meta = {
  title: 'Templates/Color Palette',
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

function ColorSwatch({ 
  color, 
  variant, 
  state,
  showLabel = true 
}: { 
  color: string
  variant: string
  state: string
  showLabel?: boolean
}) {
  const [copied, setCopied] = useState(false)
  
  const baseColorVar = `--color-${color}${variant}`
  
  // For disabled state, we use the predefined -disabled variant
  // For other states, we calculate the color modification
  const computedColor = state === 'disabled' 
    ? `var(--color-${color}${variant}-disabled)`
    : state && state !== ''
    ? `oklch(from var(${baseColorVar}) calc(l + var(--state-${state})) c h)`
    : `var(${baseColorVar})`
  
  // Get the correct CSS variable name to copy
  const colorVar = state === 'disabled' 
    ? `--color-${color}${variant}-disabled`
    : baseColorVar
  
  const handleCopy = () => {
    navigator.clipboard.writeText(colorVar)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <div 
      className="group relative flex flex-col items-center gap-2 p-3 rounded-lg transition-all hover:bg-fill-hover cursor-pointer"
      onClick={handleCopy}
    >
      <div 
        className="relative w-20 h-20 rounded-lg shadow-md transition-transform group-hover:scale-110 border border-stroke-primary"
        style={{ 
          backgroundColor: computedColor,
        }}
      >
        {copied && (
          <div className="absolute inset-0 flex items-center justify-center bg-base-reverse/75 text-fg-reverse text-xs rounded-lg">
            Copied!
          </div>
        )}
      </div>
      {showLabel && (
        <div className="text-center">
          <div className="text-xs font-medium text-fg-primary">
            {color}{variant}
          </div>
          {state && (
            <div className="text-xs text-fg-secondary-light">
              {state}
            </div>
          )}
          <div className="text-xs font-mono text-fg-secondary-light mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {colorVar}
          </div>
        </div>
      )}
    </div>
  )
}

function ColorGroup({ color }: { color: string }) {
  return (
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
            <div className="grid grid-cols-4 gap-2">
              {stateVariants.map(({ state, label: stateLabel }) => (
                <ColorSwatch
                  key={state}
                  color={color}
                  variant={suffix}
                  state={state}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ColorPaletteGrid() {
  const [filter, setFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  const filteredColors = filter === 'all' 
    ? semanticColors 
    : semanticColors.filter(c => c === filter)
  
  return (
    <div className="min-h-screen bg-base p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-fg-primary mb-2">
            Color Palette
          </h1>
          <p className="text-fg-secondary">
            Click any color swatch to copy its CSS variable name
          </p>
        </div>
        
        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary text-fg-reverse'
                  : 'bg-fill-base hover:bg-fill-hover text-fg-primary'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary text-fg-reverse'
                  : 'bg-fill-base hover:bg-fill-hover text-fg-primary'
              }`}
            >
              List View
            </button>
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-surface border border-stroke-primary text-fg-primary"
          >
            <option value="all">All Colors</option>
            {semanticColors.map(color => (
              <option key={color} value={color} className="capitalize">
                {color}
              </option>
            ))}
          </select>
        </div>
        
        {/* Color Grid/List */}
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
            : 'space-y-6'
        }>
          {filteredColors.map(color => (
            <ColorGroup key={color} color={color} />
          ))}
        </div>
        
        {/* Quick Reference */}
        <div className="mt-12 bg-surface rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-fg-primary">
            Quick Reference
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-fg-secondary mb-3">
                Color Variants
              </h3>
              <div className="space-y-2">
                {colorVariants.map(({ suffix, label }) => (
                  <div key={suffix} className="flex justify-between text-sm">
                    <span className="text-fg-primary">{label}</span>
                    <code className="font-mono text-fg-secondary-light">
                      {suffix || '(default)'}
                    </code>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-fg-secondary mb-3">
                State Modifiers
              </h3>
              <div className="space-y-2">
                {stateVariants.map(({ state, label }) => (
                  <div key={state} className="flex justify-between text-sm">
                    <span className="text-fg-primary">{label}</span>
                    <code className="font-mono text-fg-secondary-light">
                      {state ? `--state-${state}` : '(default)'}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-overlay rounded-lg">
            <h3 className="text-sm font-medium text-fg-secondary mb-2">
              Usage Example
            </h3>
            <code className="text-sm font-mono text-fg-primary">
              background-color: var(--color-primary-light);
            </code>
          </div>
        </div>
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => <ColorPaletteGrid />,
}

// Compact view for all colors at once
function CompactColorGrid() {
  return (
    <div className="min-h-screen bg-base p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-fg-primary mb-8">
          Color Palette - Compact View
        </h1>
        
        <div className="bg-surface rounded-xl shadow-lg p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stroke-primary">
                  <th className="text-left py-3 px-4 text-sm font-medium text-fg-secondary">
                    Color
                  </th>
                  {colorVariants.map(({ label }) => (
                    <th key={label} colSpan={4} className="text-center py-3 px-2 text-sm font-medium text-fg-secondary">
                      {label}
                    </th>
                  ))}
                </tr>
                <tr className="border-b border-stroke-primary">
                  <th></th>
                  {colorVariants.map(({ label }) => (
                    <React.Fragment key={label}>
                      {stateVariants.map(({ label: stateLabel }) => (
                        <th key={stateLabel} className="text-center py-2 px-1 text-xs text-fg-secondary-light">
                          {stateLabel}
                        </th>
                      ))}
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {semanticColors.map(color => (
                  <tr key={color} className="border-b border-stroke-primary/50">
                    <td className="py-4 px-4 font-medium capitalize text-fg-primary">
                      {color}
                    </td>
                    {colorVariants.map(({ suffix }) => (
                      <React.Fragment key={suffix}>
                        {stateVariants.map(({ state }) => (
                          <td key={state} className="p-2">
                            <ColorSwatch
                              color={color}
                              variant={suffix}
                              state={state}
                              showLabel={false}
                            />
                          </td>
                        ))}
                      </React.Fragment>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export const Compact: Story = {
  render: () => <CompactColorGrid />,
}