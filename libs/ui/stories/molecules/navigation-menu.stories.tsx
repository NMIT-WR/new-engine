import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { NavigationMenu } from '../../src/molecules/navigation-menu'

const meta: Meta<typeof NavigationMenu> = {
  title: 'Molecules/NavigationMenu',
  component: NavigationMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A navigation menu component with dropdown support, built with Zag.js for accessible interactions.

## Features
- Compound component pattern for flexibility
- Hover and click trigger support
- Configurable open/close delays
- Animated indicator following active trigger
- Keyboard navigation (Arrow keys, Tab, Home/End, Escape)
- RTL support
- Horizontal and vertical orientation
- Viewport pattern for shared content area
- Accessibility compliant (WAI-ARIA)

## Usage Examples

### Basic Usage
\`\`\`tsx
<NavigationMenu>
  <NavigationMenu.List>
    <NavigationMenu.Item value="products">
      <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <NavigationMenu.Link href="/analytics">Analytics</NavigationMenu.Link>
        <NavigationMenu.Link href="/marketing">Marketing</NavigationMenu.Link>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
    <NavigationMenu.Item value="pricing">
      <NavigationMenu.Link href="/pricing">Pricing</NavigationMenu.Link>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
      description: 'Sets the size of the navigation menu',
    },
    orientation: {
      control: { type: 'inline-radio' },
      options: ['horizontal', 'vertical'],
      description: 'Sets the orientation of the menu',
    },
    openDelay: {
      control: { type: 'number' },
      description: 'Delay before opening on hover (ms)',
    },
    closeDelay: {
      control: { type: 'number' },
      description: 'Delay before closing on pointer leave (ms)',
    },
  },
}

export default meta
type Story = StoryObj<typeof NavigationMenu>

// Sample menu items for stories
const productLinks = [
  { href: '/analytics', label: 'Analytics', description: 'Track your metrics' },
  { href: '/marketing', label: 'Marketing', description: 'Grow your audience' },
  { href: '/automation', label: 'Automation', description: 'Automate workflows' },
  { href: '/integrations', label: 'Integrations', description: 'Connect your tools' },
]

const companyLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/team', label: 'Our Team' },
  { href: '/careers', label: 'Careers' },
  { href: '/blog', label: 'Blog' },
]

const developerLinks = [
  { href: '/docs', label: 'Documentation' },
  { href: '/api', label: 'API Reference' },
  { href: '/guides', label: 'Guides' },
  { href: '/examples', label: 'Examples' },
]

// === BASIC USAGE ===
export const Default: Story = {
  render: () => (
    <div className="min-h-[300px] w-[600px]">
      <NavigationMenu>
        <NavigationMenu.List>
          <NavigationMenu.Item value="products">
            <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <div className="flex flex-col gap-100">
                {productLinks.map((link) => (
                  <NavigationMenu.Link key={link.href} href={link.href}>
                    <div className="font-medium">{link.label}</div>
                    {link.description && (
                      <div className="text-sm text-fg-secondary">{link.description}</div>
                    )}
                  </NavigationMenu.Link>
                ))}
              </div>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item value="company">
            <NavigationMenu.Trigger>Company</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <div className="flex flex-col gap-50">
                {companyLinks.map((link) => (
                  <NavigationMenu.Link key={link.href} href={link.href}>
                    {link.label}
                  </NavigationMenu.Link>
                ))}
              </div>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item value="developers">
            <NavigationMenu.Trigger>Developers</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <div className="flex flex-col gap-50">
                {developerLinks.map((link) => (
                  <NavigationMenu.Link key={link.href} href={link.href}>
                    {link.label}
                  </NavigationMenu.Link>
                ))}
              </div>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item value="pricing">
            <NavigationMenu.Link href="/pricing">
              Pricing
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu>
    </div>
  ),
}

// === SIZE VARIANTS ===
export const SizeVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-400 min-h-[400px]">
      <div>
        <h3 className="mb-150 text-sm font-medium">Size: sm</h3>
        <NavigationMenu size="sm">
          <NavigationMenu.List>
            <NavigationMenu.Item value="products">
              <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
              <NavigationMenu.Content>
                <div className="flex flex-col gap-50">
                  {productLinks.slice(0, 3).map((link) => (
                    <NavigationMenu.Link key={link.href} href={link.href}>
                      {link.label}
                    </NavigationMenu.Link>
                  ))}
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
            <NavigationMenu.Item value="pricing">
              <NavigationMenu.Link href="/pricing">
                Pricing
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu>
      </div>

      <div>
        <h3 className="mb-150 text-sm font-medium">Size: md (default)</h3>
        <NavigationMenu size="md">
          <NavigationMenu.List>
            <NavigationMenu.Item value="products">
              <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
              <NavigationMenu.Content>
                <div className="flex flex-col gap-50">
                  {productLinks.slice(0, 3).map((link) => (
                    <NavigationMenu.Link key={link.href} href={link.href}>
                      {link.label}
                    </NavigationMenu.Link>
                  ))}
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
            <NavigationMenu.Item value="pricing">
              <NavigationMenu.Link href="/pricing">
                Pricing
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu>
      </div>

      <div>
        <h3 className="mb-150 text-sm font-medium">Size: lg</h3>
        <NavigationMenu size="lg">
          <NavigationMenu.List>
            <NavigationMenu.Item value="products">
              <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
              <NavigationMenu.Content>
                <div className="flex flex-col gap-50">
                  {productLinks.slice(0, 3).map((link) => (
                    <NavigationMenu.Link key={link.href} href={link.href}>
                      {link.label}
                    </NavigationMenu.Link>
                  ))}
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
            <NavigationMenu.Item value="pricing">
              <NavigationMenu.Link href="/pricing">
                Pricing
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu>
      </div>
    </div>
  ),
}

// === WITH INDICATOR ===
export const WithIndicator: Story = {
  render: () => (
    <div className="min-h-[300px] w-[600px]">
      <NavigationMenu>
        <NavigationMenu.IndicatorTrack>
          <NavigationMenu.List>
            <NavigationMenu.Item value="products">
              <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
              <NavigationMenu.Content>
                <div className="flex flex-col gap-50">
                  {productLinks.map((link) => (
                    <NavigationMenu.Link key={link.href} href={link.href}>
                      {link.label}
                    </NavigationMenu.Link>
                  ))}
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>

            <NavigationMenu.Item value="company">
              <NavigationMenu.Trigger>Company</NavigationMenu.Trigger>
              <NavigationMenu.Content>
                <div className="flex flex-col gap-50">
                  {companyLinks.map((link) => (
                    <NavigationMenu.Link key={link.href} href={link.href}>
                      {link.label}
                    </NavigationMenu.Link>
                  ))}
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>

            <NavigationMenu.Item value="pricing">
              <NavigationMenu.Link href="/pricing">
                Pricing
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            <NavigationMenu.Indicator>
              <NavigationMenu.Arrow />
            </NavigationMenu.Indicator>
          </NavigationMenu.List>
        </NavigationMenu.IndicatorTrack>
      </NavigationMenu>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Navigation menu with an animated indicator that follows the active trigger.',
      },
    },
  },
}

// === CLICK TRIGGER ONLY ===
export const ClickTriggerOnly: Story = {
  render: () => (
    <div className="min-h-[300px] w-[600px]">
      <NavigationMenu disableHoverTrigger>
        <NavigationMenu.List>
          <NavigationMenu.Item value="products">
            <NavigationMenu.Trigger>Products (Click me)</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <div className="flex flex-col gap-50">
                {productLinks.map((link) => (
                  <NavigationMenu.Link key={link.href} href={link.href}>
                    {link.label}
                  </NavigationMenu.Link>
                ))}
              </div>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item value="company">
            <NavigationMenu.Trigger>Company (Click me)</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <div className="flex flex-col gap-50">
                {companyLinks.map((link) => (
                  <NavigationMenu.Link key={link.href} href={link.href}>
                    {link.label}
                  </NavigationMenu.Link>
                ))}
              </div>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Navigation menu that only opens on click, not on hover.',
      },
    },
  },
}

// === CONTROLLED STATE ===
export const Controlled: Story = {
  render: () => {
    const [activeValue, setActiveValue] = useState<string>('')

    return (
      <div className="min-h-[300px] w-[600px]">
        <div className="mb-200">
          <p className="text-sm text-fg-secondary">
            Active menu: <strong>{activeValue || 'None'}</strong>
          </p>
        </div>

        <NavigationMenu
          value={activeValue}
          onValueChange={(details) => setActiveValue(details.value)}
        >
          <NavigationMenu.List>
            <NavigationMenu.Item value="products">
              <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
              <NavigationMenu.Content>
                <div className="flex flex-col gap-50">
                  {productLinks.map((link) => (
                    <NavigationMenu.Link key={link.href} href={link.href}>
                      {link.label}
                    </NavigationMenu.Link>
                  ))}
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>

            <NavigationMenu.Item value="company">
              <NavigationMenu.Trigger>Company</NavigationMenu.Trigger>
              <NavigationMenu.Content>
                <div className="flex flex-col gap-50">
                  {companyLinks.map((link) => (
                    <NavigationMenu.Link key={link.href} href={link.href}>
                      {link.label}
                    </NavigationMenu.Link>
                  ))}
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Controlled navigation menu with external state management.',
      },
    },
  },
}

// === VERTICAL ORIENTATION ===
export const VerticalOrientation: Story = {
  render: () => (
    <div className="min-h-[400px] flex">
      <NavigationMenu orientation="vertical">
        <NavigationMenu.List>
          <NavigationMenu.Item value="products">
            <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <div className="flex flex-col gap-50 min-w-[200px]">
                {productLinks.map((link) => (
                  <NavigationMenu.Link key={link.href} href={link.href}>
                    {link.label}
                  </NavigationMenu.Link>
                ))}
              </div>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item value="company">
            <NavigationMenu.Trigger>Company</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <div className="flex flex-col gap-50 min-w-[200px]">
                {companyLinks.map((link) => (
                  <NavigationMenu.Link key={link.href} href={link.href}>
                    {link.label}
                  </NavigationMenu.Link>
                ))}
              </div>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item value="developers">
            <NavigationMenu.Trigger>Developers</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <div className="flex flex-col gap-50 min-w-[200px]">
                {developerLinks.map((link) => (
                  <NavigationMenu.Link key={link.href} href={link.href}>
                    {link.label}
                  </NavigationMenu.Link>
                ))}
              </div>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Navigation menu in vertical orientation, suitable for sidebars.',
      },
    },
  },
}

// === GRID LAYOUT CONTENT ===
export const GridLayoutContent: Story = {
  render: () => (
    <div className="min-h-[400px] w-[800px]">
      <NavigationMenu>
        <NavigationMenu.List>
          <NavigationMenu.Item value="products">
            <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <div className="grid grid-cols-2 gap-200 w-[400px]">
                {productLinks.map((link) => (
                  <NavigationMenu.Link key={link.href} href={link.href}>
                    <div className="font-medium">{link.label}</div>
                    {link.description && (
                      <div className="text-sm text-fg-secondary mt-50">
                        {link.description}
                      </div>
                    )}
                  </NavigationMenu.Link>
                ))}
              </div>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item value="resources">
            <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <div className="grid grid-cols-3 gap-200 w-[500px]">
                <div>
                  <h4 className="font-medium mb-100 text-fg-secondary text-sm">
                    Learn
                  </h4>
                  <div className="flex flex-col gap-50">
                    <NavigationMenu.Link href="/docs">Documentation</NavigationMenu.Link>
                    <NavigationMenu.Link href="/tutorials">Tutorials</NavigationMenu.Link>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-100 text-fg-secondary text-sm">
                    Community
                  </h4>
                  <div className="flex flex-col gap-50">
                    <NavigationMenu.Link href="/discord">Discord</NavigationMenu.Link>
                    <NavigationMenu.Link href="/github">GitHub</NavigationMenu.Link>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-100 text-fg-secondary text-sm">
                    Support
                  </h4>
                  <div className="flex flex-col gap-50">
                    <NavigationMenu.Link href="/faq">FAQ</NavigationMenu.Link>
                    <NavigationMenu.Link href="/contact">Contact</NavigationMenu.Link>
                  </div>
                </div>
              </div>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item value="pricing">
            <NavigationMenu.Link href="/pricing">
              Pricing
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Navigation menu with grid layout content for mega-menu style dropdowns.',
      },
    },
  },
}

// === CURRENT PAGE LINK ===
export const CurrentPageLink: Story = {
  render: () => (
    <div className="min-h-[300px] w-[600px]">
      <NavigationMenu>
        <NavigationMenu.List>
          <NavigationMenu.Item value="products">
            <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <div className="flex flex-col gap-50">
                <NavigationMenu.Link href="/analytics" current>
                  Analytics (Current Page)
                </NavigationMenu.Link>
                <NavigationMenu.Link href="/marketing">
                  Marketing
                </NavigationMenu.Link>
                <NavigationMenu.Link href="/automation">
                  Automation
                </NavigationMenu.Link>
              </div>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item value="company">
            <NavigationMenu.Trigger>Company</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <div className="flex flex-col gap-50">
                {companyLinks.map((link) => (
                  <NavigationMenu.Link key={link.href} href={link.href}>
                    {link.label}
                  </NavigationMenu.Link>
                ))}
              </div>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Navigation menu with current page indication using the `current` prop.',
      },
    },
  },
}

// === DISABLED ITEMS ===
export const DisabledItems: Story = {
  render: () => (
    <div className="min-h-[300px] w-[600px]">
      <NavigationMenu>
        <NavigationMenu.List>
          <NavigationMenu.Item value="products">
            <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <div className="flex flex-col gap-50">
                {productLinks.map((link) => (
                  <NavigationMenu.Link key={link.href} href={link.href}>
                    {link.label}
                  </NavigationMenu.Link>
                ))}
              </div>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item value="company" disabled>
            <NavigationMenu.Trigger>Company (Disabled)</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <div className="flex flex-col gap-50">
                {companyLinks.map((link) => (
                  <NavigationMenu.Link key={link.href} href={link.href}>
                    {link.label}
                  </NavigationMenu.Link>
                ))}
              </div>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item value="pricing">
            <NavigationMenu.Link href="/pricing">
              Pricing
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Navigation menu with disabled menu items.',
      },
    },
  },
}

// === CUSTOM DELAYS ===
export const CustomDelays: Story = {
  render: () => (
    <div className="min-h-[300px] w-[600px]">
      <p className="mb-200 text-sm text-fg-secondary">
        Open delay: 500ms, Close delay: 1000ms
      </p>
      <NavigationMenu openDelay={500} closeDelay={1000}>
        <NavigationMenu.List>
          <NavigationMenu.Item value="products">
            <NavigationMenu.Trigger>Products (Slow open)</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <div className="flex flex-col gap-50">
                {productLinks.map((link) => (
                  <NavigationMenu.Link key={link.href} href={link.href}>
                    {link.label}
                  </NavigationMenu.Link>
                ))}
              </div>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item value="company">
            <NavigationMenu.Trigger>Company (Slow close)</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <div className="flex flex-col gap-50">
                {companyLinks.map((link) => (
                  <NavigationMenu.Link key={link.href} href={link.href}>
                    {link.label}
                  </NavigationMenu.Link>
                ))}
              </div>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Navigation menu with custom open and close delays for hover interactions.',
      },
    },
  },
}

// === SIMPLE LINKS ONLY ===
export const SimpleLinksOnly: Story = {
  render: () => (
    <div className="min-h-[100px] w-[600px]">
      <NavigationMenu>
        <NavigationMenu.List>
          <NavigationMenu.Item value="home">
            <NavigationMenu.Link href="/">
              Home
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item value="about">
            <NavigationMenu.Link href="/about">
              About
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item value="services">
            <NavigationMenu.Link href="/services">
              Services
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item value="contact">
            <NavigationMenu.Link href="/contact">
              Contact
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Simple navigation menu with direct links only, no dropdowns.',
      },
    },
  },
}
