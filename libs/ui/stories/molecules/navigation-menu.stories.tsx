import type { Meta, StoryObj } from '@storybook/react'
import { NavigationMenu } from '../../src/molecules/navigation-menu'

const meta: Meta<typeof NavigationMenu> = {
  title: 'Molecules/NavigationMenu',
  component: NavigationMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A flexible navigation menu component using compound component pattern, built with Zag.js that supports dropdowns, hover triggers, and keyboard navigation.

## Features
- Compound component pattern for flexibility
- Horizontal and vertical orientation
- Hover and click trigger modes
- Viewport for dropdown positioning
- Visual indicator for active menu
- Arrow/caret support
- Keyboard navigation (arrow keys, tab, escape)
- Accessibility support (ARIA attributes)
- Configurable delays for open/close

## Usage Examples

### Basic Horizontal Menu
\`\`\`tsx
<NavigationMenu>
  <NavigationMenu.List>
    <NavigationMenu.Item value="products">
      <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <NavigationMenu.Link value="product-1">Product 1</NavigationMenu.Link>
        <NavigationMenu.Link value="product-2">Product 2</NavigationMenu.Link>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  </NavigationMenu.List>
  <NavigationMenu.Viewport />
</NavigationMenu>
\`\`\`

### With Indicator
\`\`\`tsx
<NavigationMenu>
  <NavigationMenu.List>
    {/* items */}
  </NavigationMenu.List>
  <NavigationMenu.Indicator />
  <NavigationMenu.Viewport />
</NavigationMenu>
\`\`\`

### Vertical Orientation
\`\`\`tsx
<NavigationMenu orientation="vertical">
  <NavigationMenu.List>
    {/* items */}
  </NavigationMenu.List>
</NavigationMenu>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="flex min-h-96 w-full items-start justify-center p-8">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

// Basic horizontal navigation menu
export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenu.List>
        <NavigationMenu.Item value="home">
          <NavigationMenu.Trigger showChevron={false}>
            Home
          </NavigationMenu.Trigger>
        </NavigationMenu.Item>

        <NavigationMenu.Item value="products">
          <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <div className="grid w-96 grid-cols-2 gap-200">
              <NavigationMenu.Link value="product-1">
                Web Development
              </NavigationMenu.Link>
              <NavigationMenu.Link value="product-2">
                Mobile Apps
              </NavigationMenu.Link>
              <NavigationMenu.Link value="product-3">
                Cloud Services
              </NavigationMenu.Link>
              <NavigationMenu.Link value="product-4">
                AI Solutions
              </NavigationMenu.Link>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item value="about">
          <NavigationMenu.Trigger showChevron={false}>
            About
          </NavigationMenu.Trigger>
        </NavigationMenu.Item>

        <NavigationMenu.Item value="contact">
          <NavigationMenu.Trigger showChevron={false}>
            Contact
          </NavigationMenu.Trigger>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Basic horizontal navigation menu with hover triggers and dropdown content.',
      },
    },
  },
}

// With viewport for better dropdown positioning
export const WithViewport: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenu.List>
        <NavigationMenu.Item value="home">
          <NavigationMenu.Trigger showChevron={false}>
            Home
          </NavigationMenu.Trigger>
        </NavigationMenu.Item>

        <NavigationMenu.Item value="products">
          <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <div className="grid w-[600px] grid-cols-2 gap-200">
              <div>
                <h3 className="mb-150 font-semibold text-fg-primary">
                  Development
                </h3>
                <NavigationMenu.Link value="web-dev">
                  Web Development
                </NavigationMenu.Link>
                <NavigationMenu.Link value="mobile-dev">
                  Mobile Apps
                </NavigationMenu.Link>
                <NavigationMenu.Link value="desktop-dev">
                  Desktop Software
                </NavigationMenu.Link>
              </div>
              <div>
                <h3 className="mb-150 font-semibold text-fg-primary">
                  Infrastructure
                </h3>
                <NavigationMenu.Link value="cloud">
                  Cloud Services
                </NavigationMenu.Link>
                <NavigationMenu.Link value="hosting">Hosting</NavigationMenu.Link>
                <NavigationMenu.Link value="cdn">CDN</NavigationMenu.Link>
              </div>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item value="company">
          <NavigationMenu.Trigger>Company</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <div className="w-[450px]">
              <NavigationMenu.Link value="about">About Us</NavigationMenu.Link>
              <NavigationMenu.Link value="team">Our Team</NavigationMenu.Link>
              <NavigationMenu.Link value="careers">Careers</NavigationMenu.Link>
              <NavigationMenu.Link value="press">Press</NavigationMenu.Link>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item value="pricing">
          <NavigationMenu.Trigger showChevron={false}>
            Pricing
          </NavigationMenu.Trigger>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      <NavigationMenu.Viewport />
    </NavigationMenu>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Navigation menu with viewport component for better dropdown positioning and animations.',
      },
    },
  },
}

// With indicator showing active menu item
export const WithIndicator: Story = {
  render: () => (
    <NavigationMenu defaultValue="products">
      <NavigationMenu.List>
        <NavigationMenu.Item value="home">
          <NavigationMenu.Trigger showChevron={false}>
            Home
          </NavigationMenu.Trigger>
        </NavigationMenu.Item>

        <NavigationMenu.Item value="products">
          <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <div className="grid w-96 grid-cols-2 gap-200">
              <NavigationMenu.Link value="product-1">
                Web Development
              </NavigationMenu.Link>
              <NavigationMenu.Link value="product-2">
                Mobile Apps
              </NavigationMenu.Link>
              <NavigationMenu.Link value="product-3">
                Cloud Services
              </NavigationMenu.Link>
              <NavigationMenu.Link value="product-4">
                AI Solutions
              </NavigationMenu.Link>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item value="docs">
          <NavigationMenu.Trigger>Docs</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <div className="w-80">
              <NavigationMenu.Link value="getting-started">
                Getting Started
              </NavigationMenu.Link>
              <NavigationMenu.Link value="api-reference">
                API Reference
              </NavigationMenu.Link>
              <NavigationMenu.Link value="guides">Guides</NavigationMenu.Link>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item value="about">
          <NavigationMenu.Trigger showChevron={false}>
            About
          </NavigationMenu.Trigger>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      <NavigationMenu.Indicator />
      <NavigationMenu.Viewport />
    </NavigationMenu>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Navigation menu with visual indicator showing which menu item is currently active.',
      },
    },
  },
}

// Vertical orientation
export const Vertical: Story = {
  render: () => (
    <NavigationMenu orientation="vertical">
      <NavigationMenu.List>
        <NavigationMenu.Item value="dashboard">
          <NavigationMenu.Trigger showChevron={false}>
            Dashboard
          </NavigationMenu.Trigger>
        </NavigationMenu.Item>

        <NavigationMenu.Item value="products">
          <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <div className="flex flex-col gap-100 w-64">
              <NavigationMenu.Link value="all-products">
                All Products
              </NavigationMenu.Link>
              <NavigationMenu.Link value="new-products">
                New Arrivals
              </NavigationMenu.Link>
              <NavigationMenu.Link value="sale">On Sale</NavigationMenu.Link>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item value="orders">
          <NavigationMenu.Trigger>Orders</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <div className="flex flex-col gap-100 w-64">
              <NavigationMenu.Link value="active-orders">
                Active Orders
              </NavigationMenu.Link>
              <NavigationMenu.Link value="completed">
                Completed
              </NavigationMenu.Link>
              <NavigationMenu.Link value="cancelled">
                Cancelled
              </NavigationMenu.Link>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item value="settings">
          <NavigationMenu.Trigger showChevron={false}>
            Settings
          </NavigationMenu.Trigger>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Navigation menu in vertical orientation, useful for sidebars.',
      },
    },
  },
}

// Full example with all features
export const FullExample: Story = {
  render: () => (
    <div className="w-full">
      <header className="bg-surface shadow-sm">
        <div className="mx-auto flex items-center justify-between p-250">
          <div className="font-bold text-lg text-fg-primary">Logo</div>

          <NavigationMenu>
            <NavigationMenu.List>
              <NavigationMenu.Item value="products">
                <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
                <NavigationMenu.Content>
                  <div className="grid w-[600px] grid-cols-2 gap-200">
                    <div>
                      <h3 className="mb-150 font-semibold text-fg-primary">
                        Development Tools
                      </h3>
                      <NavigationMenu.Link value="code-editor">
                        Code Editor
                      </NavigationMenu.Link>
                      <NavigationMenu.Link value="debugger">
                        Debugger
                      </NavigationMenu.Link>
                      <NavigationMenu.Link value="testing">
                        Testing Suite
                      </NavigationMenu.Link>
                      <NavigationMenu.Link value="deployment">
                        Deployment Tools
                      </NavigationMenu.Link>
                    </div>
                    <div>
                      <h3 className="mb-150 font-semibold text-fg-primary">
                        Integrations
                      </h3>
                      <NavigationMenu.Link value="git">Git</NavigationMenu.Link>
                      <NavigationMenu.Link value="docker">
                        Docker
                      </NavigationMenu.Link>
                      <NavigationMenu.Link value="kubernetes">
                        Kubernetes
                      </NavigationMenu.Link>
                      <NavigationMenu.Link value="ci-cd">
                        CI/CD Pipelines
                      </NavigationMenu.Link>
                    </div>
                  </div>
                </NavigationMenu.Content>
              </NavigationMenu.Item>

              <NavigationMenu.Item value="company">
                <NavigationMenu.Trigger>Company</NavigationMenu.Trigger>
                <NavigationMenu.Content>
                  <div className="w-[450px] space-y-100">
                    <NavigationMenu.Link value="about">
                      About Us
                    </NavigationMenu.Link>
                    <NavigationMenu.Link value="team">
                      Our Team
                    </NavigationMenu.Link>
                    <NavigationMenu.Link value="careers" current>
                      Careers
                    </NavigationMenu.Link>
                    <NavigationMenu.Link value="press">Press</NavigationMenu.Link>
                    <NavigationMenu.Link value="contact">
                      Contact
                    </NavigationMenu.Link>
                  </div>
                </NavigationMenu.Content>
              </NavigationMenu.Item>

              <NavigationMenu.Item value="developers">
                <NavigationMenu.Trigger>Developers</NavigationMenu.Trigger>
                <NavigationMenu.Content>
                  <div className="grid w-[650px] grid-cols-2 gap-200">
                    <div>
                      <h3 className="mb-150 font-semibold text-fg-primary">
                        Documentation
                      </h3>
                      <NavigationMenu.Link value="getting-started">
                        Getting Started
                      </NavigationMenu.Link>
                      <NavigationMenu.Link value="api-docs">
                        API Reference
                      </NavigationMenu.Link>
                      <NavigationMenu.Link value="tutorials">
                        Tutorials
                      </NavigationMenu.Link>
                      <NavigationMenu.Link value="examples">
                        Examples
                      </NavigationMenu.Link>
                    </div>
                    <div>
                      <h3 className="mb-150 font-semibold text-fg-primary">
                        Resources
                      </h3>
                      <NavigationMenu.Link value="blog">Blog</NavigationMenu.Link>
                      <NavigationMenu.Link value="community">
                        Community
                      </NavigationMenu.Link>
                      <NavigationMenu.Link value="support">
                        Support
                      </NavigationMenu.Link>
                      <NavigationMenu.Link value="changelog">
                        Changelog
                      </NavigationMenu.Link>
                    </div>
                  </div>
                </NavigationMenu.Content>
              </NavigationMenu.Item>

              <NavigationMenu.Item value="pricing">
                <NavigationMenu.Trigger showChevron={false}>
                  Pricing
                </NavigationMenu.Trigger>
              </NavigationMenu.Item>
            </NavigationMenu.List>

            <NavigationMenu.Indicator />
            <NavigationMenu.Viewport />
          </NavigationMenu>

          <button
            type="button"
            className="rounded-md bg-primary px-250 py-150 font-medium text-fg-reverse hover:bg-primary-hover"
          >
            Login
          </button>
        </div>
      </header>

      <div className="p-8 text-center">
        <h1 className="mb-4 font-bold text-2xl">Navigation Menu Demo</h1>
        <p className="text-fg-secondary">
          Hover over the menu items to see the dropdowns with viewport
          positioning
        </p>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Complete example showing a realistic header navigation with all features: viewport, indicator, multiple dropdown menus, and proper styling.',
      },
    },
  },
}

// Click trigger mode (disable hover)
export const ClickTrigger: Story = {
  render: () => (
    <NavigationMenu disableHoverTrigger>
      <NavigationMenu.List>
        <NavigationMenu.Item value="home">
          <NavigationMenu.Trigger showChevron={false}>
            Home
          </NavigationMenu.Trigger>
        </NavigationMenu.Item>

        <NavigationMenu.Item value="products">
          <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <div className="grid w-96 grid-cols-2 gap-200">
              <NavigationMenu.Link value="product-1">
                Web Development
              </NavigationMenu.Link>
              <NavigationMenu.Link value="product-2">
                Mobile Apps
              </NavigationMenu.Link>
              <NavigationMenu.Link value="product-3">
                Cloud Services
              </NavigationMenu.Link>
              <NavigationMenu.Link value="product-4">
                AI Solutions
              </NavigationMenu.Link>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item value="about">
          <NavigationMenu.Trigger showChevron={false}>
            About
          </NavigationMenu.Trigger>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      <NavigationMenu.Viewport />
    </NavigationMenu>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Navigation menu with click trigger mode instead of hover. Click on the menu items to open dropdowns.',
      },
    },
  },
}

// With custom delays
export const CustomDelays: Story = {
  render: () => (
    <NavigationMenu openDelay={500} closeDelay={500}>
      <NavigationMenu.List>
        <NavigationMenu.Item value="home">
          <NavigationMenu.Trigger showChevron={false}>
            Home
          </NavigationMenu.Trigger>
        </NavigationMenu.Item>

        <NavigationMenu.Item value="products">
          <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <div className="w-80">
              <NavigationMenu.Link value="product-1">
                Web Development
              </NavigationMenu.Link>
              <NavigationMenu.Link value="product-2">
                Mobile Apps
              </NavigationMenu.Link>
              <NavigationMenu.Link value="product-3">
                Cloud Services
              </NavigationMenu.Link>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item value="about">
          <NavigationMenu.Trigger showChevron={false}>
            About
          </NavigationMenu.Trigger>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      <NavigationMenu.Viewport />
    </NavigationMenu>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Navigation menu with custom delays (500ms) for opening and closing dropdowns.',
      },
    },
  },
}
