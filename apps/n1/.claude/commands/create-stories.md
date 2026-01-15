# Create Storybook Stories

Generate comprehensive Storybook stories for UI component $ARGUMENTS following project patterns and best practices.

## Task

I'll create complete Storybook stories for the specified component including:

1. Analyze component location (atoms vs molecules) and structure
2. Extract component props, variants, and types from TypeScript interface
3. Generate comprehensive stories with all variants and states
4. Include proper decorators using VariantGroup/VariantContainer from decorator.tsx
5. Add argTypes controls for interactive documentation
6. Create stories covering all component use cases and accessibility scenarios

## Process

I'll follow these steps:

1. **Component Analysis Phase**
   - Detect component location: `src/atoms/` or `src/molecules/`
   - Read component TypeScript file to extract props interface
   - Analyze component variants using tailwind-variants patterns
   - Identify component state variations and special props
   - Determine story placement: `stories/atoms/` or `stories/molecules/`

2. **Component Props Extraction**
   - Parse TypeScript interface to identify all props
   - Extract variant options from tailwind-variants configuration
   - Identify optional vs required props
   - Detect special props (disabled, loading, size, theme, etc.)
   - Analyze compound variants and conditional styling

3. **Story Structure Generation**
   - Create main story file in correct location
   - Set up Meta configuration with proper title and parameters
   - Configure argTypes with controls for all variants
   - Add component description and documentation
   - Set up proper layout and viewport settings
   - Use tailwind tokens from src/tokens (study usage in CLAUDE.md)
     - for example: --color-primary from _semantic.css you can use in .tsx file: className="bg-primary" etc.

4. **Story Variants Creation**
   - **Default**: Basic component with default props
   - **AllVariants**: Comprehensive showcase using VariantGroup/VariantContainer
   - **Sizes**: All size variations if size prop exists
   - **States**: Disabled, loading, active, and other state combinations
   - **Themes**: All theme variations (solid, light, outlined, borderless)
   - **Interactive**: Controlled examples for interactive components
   - **Edge Cases**: Error states, validation, extreme content scenarios

5. **Advanced Story Features**
   - Use decorators from `../../.storybook/decorator` for consistent layout
   - Add accessibility documentation and examples  
   - Include interactive controls for dynamic testing
   - Add real-world usage examples
   - Document component behavior and best practices

## Story Generation Patterns

### Meta Configuration Template
```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { VariantContainer, VariantGroup } from '../../.storybook/decorator'
import { ComponentName } from '../../src/[atoms|molecules]/component-name'

const meta: Meta<typeof ComponentName> = {
  title: '[Atoms|Molecules]/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'ComponentName provides [auto-generated description based on component analysis].'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    // Auto-generated based on component props analysis
    variant: {
      control: { type: 'select' },
      options: ['extracted', 'from', 'component'],
      description: 'Component style variant'
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Component size'
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disabled state'
    }
  }
}
```

### Variant Showcase Stories
Using project's VariantGroup and VariantContainer decorators:

```typescript
export const AllVariants: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Primary variants">
        <ComponentName variant="primary" size="sm">Small</ComponentName>
        <ComponentName variant="primary" size="md">Medium</ComponentName>
        <VariantGroup title="Primary variants">
        <ComponentName variant="primary" size="lg">Large</ComponentName>
      </VariantGroup>
      <VariantGroup title="Secondary variants">
        <ComponentName variant="secondary" size="sm">Small</ComponentName>
        <ComponentName variant="secondary" size="md">Medium</ComponentName>
        <ComponentName variant="secondary" size="lg">Large</ComponentName>
      </VariantGroup>
      {/* Additional variant groups based on component analysis */}
    </VariantContainer>
  )
}
```

### Interactive Component Stories
For Zag.js interactive components:

```typescript
export const Interactive: Story = {
  render: () => {
    const [state, setState] = useState(initialState)
    return (
      <div className="space-y-4">
        <ComponentName
          value={state}
          onValueChange={setState}
          variant="primary"
        >
          Interactive content
        </ComponentName>
        <p className="text-gray-600 text-sm">
          Current state: {JSON.stringify(state)}
        </p>
      </div>
    )
  }
}
```

### State Demonstration Stories
```typescript
export const States: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Normal states">
        <ComponentName variant="primary">Normal</ComponentName>
        <ComponentName variant="secondary">Normal</ComponentName>
      </VariantGroup>
      <VariantGroup title="Disabled states">
        <ComponentName variant="primary" disabled>Disabled</ComponentName>
        <ComponentName variant="secondary" disabled>Disabled</ComponentName>
      </VariantGroup>
      {/* Loading states, validation states, etc. based on component */}
    </VariantContainer>
  )
}
```

## Component-Specific Story Features

### For Atomic Components (Button, Input, Badge, etc.)
- **Variant showcase**: All visual variants with VariantGroup
- **Size variations**: Complete size range demonstration
- **Theme variations**: solid, light, outlined, borderless themes
- **State combinations**: disabled, loading, active states
- **Icon variations**: If component supports icons
- **Accessibility examples**: ARIA labels, keyboard navigation

### For Molecular Components (Dialog, Accordion, Menu, etc.)
- **Basic usage**: Simple component demonstration
- **Controlled examples**: External state management
- **Advanced scenarios**: Complex content and interactions
- **Behavior variants**: Different configuration options
- **Integration examples**: Using with other components
- **Error handling**: Invalid states and error recovery

## Advanced Story Features

### Accessibility Documentation
```typescript
export const Accessibility: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2">Keyboard Navigation</h3>
        <ComponentName 
          onKeyDown={(e) => console.log('Key pressed:', e.key)}
          aria-label="Accessible component example"
        >
          Use Tab, Enter, Escape to navigate
        </ComponentName>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Screen Reader Support</h3>
        <ComponentName 
          role="button"
          aria-describedby="component-description"
        >
          Accessible component
        </ComponentName>
        <p id="component-description" className="text-sm text-gray-600">
          This component is fully accessible with screen readers
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'This component follows WAI-ARIA guidelines and supports keyboard navigation.'
      }
    }
  }
}
```

### Edge Case Testing
```typescript
export const EdgeCases: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Content edge cases">
        <ComponentName>Short</ComponentName>
        <ComponentName>Very long content that should wrap appropriately and maintain visual consistency</ComponentName>
        <ComponentName></ComponentName> {/* Empty content */}
      </VariantGroup>
      <VariantGroup title="Layout edge cases">
        <div className="w-32">
          <ComponentName block>Constrained width</ComponentName>
        </div>
        <div className="w-96">
          <ComponentName block>Very wide container</ComponentName>
        </div>
      </VariantGroup>
    </VariantContainer>
  )
}
```

## Component Import Analysis

### Import Path Detection
Based on component location:
- **Atoms**: `import { ComponentName } from '../../src/atoms/component-name'`
- **Molecules**: `import { ComponentName } from '../../src/molecules/component-name'`
- **Additional imports**: Extract any dependent components or utilities

### Prop Interface Analysis
Extract and analyze:
```typescript
// Automatic detection of prop types:
interface ComponentProps {
  variant?: 'primary' | 'secondary' | 'tertiary'  // → select control
  size?: 'sm' | 'md' | 'lg'                        // → select control  
  disabled?: boolean                               // → boolean control
  children?: ReactNode                             // → text control
  onClick?: () => void                             // → action control
  className?: string                               // → text control
}
```

## Story File Organization

### File Naming and Location
- **Atoms**: `stories/atoms/component-name.stories.tsx`
- **Molecules**: `stories/molecules/component-name.stories.tsx`
- **Title**: `'Atoms/ComponentName'` or `'Molecules/ComponentName'`

### Story Naming Conventions
- **Default**: Basic component demonstration
- **AllVariants**: Complete variant showcase
- **[VariantType]**: Specific variant category (Sizes, States, Themes)
- **Interactive**: For components with state/events
- **[SpecificUseCase]**: Real-world scenarios (CustomTrigger, Controlled)

## Quality Standards

### Story Completeness Checklist
- [ ] **Meta configuration**: Proper title, component, and parameters
- [ ] **ArgTypes**: Controls for all component props
- [ ] **Default story**: Basic usage example
- [ ] **Variant coverage**: All visual variants demonstrated
- [ ] **State coverage**: All component states (disabled, loading, etc.)
- [ ] **Decorator usage**: VariantGroup and VariantContainer where appropriate
- [ ] **Import accuracy**: Correct component import paths
- [ ] **TypeScript**: Proper Story typing and type safety
- [ ] **Documentation**: Component descriptions and story explanations
- [ ] **Accessibility**: ARIA attributes and keyboard navigation examples

### Interactive Component Requirements
- [ ] **Controlled examples**: External state management demonstrations
- [ ] **Event handlers**: Proper event handling examples
- [ ] **State visualization**: Show current component state
- [ ] **Integration examples**: Using component with others
- [ ] **Error scenarios**: Invalid states and error handling

### Visual Testing Standards
- [ ] **Responsive behavior**: Different viewport sizes
- [ ] **Content variations**: Short, long, and edge case content
- [ ] **Layout testing**: Different container sizes
- [ ] **Theme consistency**: All variants follow design system
- [ ] **Loading states**: If component has async behavior

## Advanced Features

### Custom Decorators
For components requiring special setup:
```typescript
const CustomDecorator = (Story) => (
  <div className="custom-setup-for-component">
    <Story />
  </div>
)

export const SpecialScenario: Story = {
  render: () => <ComponentName />,
  decorators: [CustomDecorator]
}
```

### Performance Stories
For complex components:
```typescript
export const Performance: Story = {
  render: () => (
    <div>
      {Array.from({ length: 100 }, (_, i) => (
        <ComponentName key={i} variant="primary">
          Item {i + 1}
        </ComponentName>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Testing component performance with many instances.'
      }
    }
  }
}
```

I'll analyze your component's structure, extract all props and variants, and generate comprehensive stories that cover every use case while following your project's established patterns and decorators.