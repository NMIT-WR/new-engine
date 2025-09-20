import type { Meta, StoryObj } from '@storybook/react'
import { Footer } from '../../src/organisms/footer'

const meta: Meta<typeof Footer> = {
  title: 'Organisms/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A flexible compound footer component with context-based sizing.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Footer>

export const Default: Story = {
  render: () => (
    <Footer>
      <Footer.Container>
        <Footer.Section>
          <Footer.Title>Company</Footer.Title>
          <Footer.Link href="/about">About Us</Footer.Link>
          <Footer.Link href="/team">Team</Footer.Link>
          <Footer.Link href="/careers">Careers</Footer.Link>
          <Footer.Link href="/contact">Contact</Footer.Link>
        </Footer.Section>

        <Footer.Section>
          <Footer.Title>Products</Footer.Title>
          <Footer.Link href="/features">Features</Footer.Link>
          <Footer.Link href="/pricing">Pricing</Footer.Link>
          <Footer.Link href="/enterprise">Enterprise</Footer.Link>
          <Footer.Link href="/changelog">Changelog</Footer.Link>
        </Footer.Section>

        <Footer.Section>
          <Footer.Title>Resources</Footer.Title>
          <Footer.Link href="/docs">Documentation</Footer.Link>
          <Footer.Link href="/blog">Blog</Footer.Link>
          <Footer.Link href="/guides">Guides</Footer.Link>
          <Footer.Link href="/api">API Reference</Footer.Link>
        </Footer.Section>

        <Footer.Section>
          <Footer.Title>Legal</Footer.Title>
          <Footer.Link href="/privacy">Privacy Policy</Footer.Link>
          <Footer.Link href="/terms">Terms of Service</Footer.Link>
          <Footer.Link href="/cookies">Cookie Policy</Footer.Link>
          <Footer.Text>© 2024 Company Inc.</Footer.Text>
        </Footer.Section>
      </Footer.Container>
    </Footer>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-lg">
      <div className="border-t border-border-primary">
        <Footer size="sm">
          <Footer.Container>
            <Footer.Section>
              <Footer.Title>Products</Footer.Title>
              <Footer.Link href="/features">Features</Footer.Link>
              <Footer.Link href="/pricing">Pricing</Footer.Link>
              <Footer.Link href="/enterprise">Enterprise</Footer.Link>
              <Footer.Link href="/changelog">Changelog</Footer.Link>
            </Footer.Section>
            <Footer.Section>
              <Footer.Title>Company</Footer.Title>
              <Footer.Link href="/about">About Us</Footer.Link>
              <Footer.Link href="/careers">Careers</Footer.Link>
              <Footer.Link href="/blog">Blog</Footer.Link>
              <Footer.Link href="/press">Press</Footer.Link>
            </Footer.Section>
            <Footer.Section>
              <Footer.Title>Resources</Footer.Title>
              <Footer.Link href="/docs">Documentation</Footer.Link>
              <Footer.Link href="/support">Support</Footer.Link>
              <Footer.Link href="/api">API Status</Footer.Link>
              <Footer.Text>© 2024 Acme Inc.</Footer.Text>
            </Footer.Section>
            <Footer.Section>
              <Footer.Title>Legal</Footer.Title>
              <Footer.Link href="/privacy">Privacy Policy</Footer.Link>
              <Footer.Link href="/terms">Terms of Service</Footer.Link>
              <Footer.Link href="/cookies">Cookie Policy</Footer.Link>
              <Footer.Link href="/gdpr">GDPR</Footer.Link>
            </Footer.Section>
          </Footer.Container>
        </Footer>
      </div>

      <div className="border-t border-border-primary">
        <Footer size="md">
          <Footer.Container>
            <Footer.Section>
              <Footer.Title>Products</Footer.Title>
              <Footer.Link href="/features">Features</Footer.Link>
              <Footer.Link href="/pricing">Pricing</Footer.Link>
              <Footer.Link href="/enterprise">Enterprise</Footer.Link>
              <Footer.Link href="/changelog">Changelog</Footer.Link>
            </Footer.Section>
            <Footer.Section>
              <Footer.Title>Company</Footer.Title>
              <Footer.Link href="/about">About Us</Footer.Link>
              <Footer.Link href="/careers">Careers</Footer.Link>
              <Footer.Link href="/blog">Blog</Footer.Link>
              <Footer.Link href="/press">Press</Footer.Link>
            </Footer.Section>
            <Footer.Section>
              <Footer.Title>Resources</Footer.Title>
              <Footer.Link href="/docs">Documentation</Footer.Link>
              <Footer.Link href="/support">Support</Footer.Link>
              <Footer.Link href="/api">API Status</Footer.Link>
              <Footer.Text>© 2024 Acme Inc.</Footer.Text>
            </Footer.Section>
            <Footer.Section>
              <Footer.Title>Legal</Footer.Title>
              <Footer.Link href="/privacy">Privacy Policy</Footer.Link>
              <Footer.Link href="/terms">Terms of Service</Footer.Link>
              <Footer.Link href="/cookies">Cookie Policy</Footer.Link>
              <Footer.Link href="/gdpr">GDPR</Footer.Link>
            </Footer.Section>
          </Footer.Container>
        </Footer>
      </div>

      <div className="border-t border-border-primary">
        <Footer size="lg">
          <Footer.Container>
            <Footer.Section>
              <Footer.Title>Products</Footer.Title>
              <Footer.Link href="/features">Features</Footer.Link>
              <Footer.Link href="/pricing">Pricing</Footer.Link>
              <Footer.Link href="/enterprise">Enterprise</Footer.Link>
              <Footer.Link href="/changelog">Changelog</Footer.Link>
            </Footer.Section>
            <Footer.Section>
              <Footer.Title>Company</Footer.Title>
              <Footer.Link href="/about">About Us</Footer.Link>
              <Footer.Link href="/careers">Careers</Footer.Link>
              <Footer.Link href="/blog">Blog</Footer.Link>
              <Footer.Link href="/press">Press</Footer.Link>
            </Footer.Section>
            <Footer.Section>
              <Footer.Title>Resources</Footer.Title>
              <Footer.Link href="/docs">Documentation</Footer.Link>
              <Footer.Link href="/support">Support</Footer.Link>
              <Footer.Link href="/api">API Status</Footer.Link>
              <Footer.Text>© 2024 Acme Inc.</Footer.Text>
            </Footer.Section>
            <Footer.Section>
              <Footer.Title>Legal</Footer.Title>
              <Footer.Link href="/privacy">Privacy Policy</Footer.Link>
              <Footer.Link href="/terms">Terms of Service</Footer.Link>
              <Footer.Link href="/cookies">Cookie Policy</Footer.Link>
              <Footer.Link href="/gdpr">GDPR</Footer.Link>
            </Footer.Section>
          </Footer.Container>
        </Footer>
      </div>
    </div>
  ),
}

export const Layouts: Story = {
  render: () => (
    <div className="flex flex-col gap-lg">
      <div className="border-t border-border-primary">
        <Footer>
          <Footer.Container>
            <Footer.Section>
              <Footer.Title>Simple Layout</Footer.Title>
              <Footer.Link href="/home">Home</Footer.Link>
              <Footer.Link href="/about">About</Footer.Link>
              <Footer.Text>© 2024 Simple Company</Footer.Text>
            </Footer.Section>
          </Footer.Container>
        </Footer>
      </div>

      <div className="border-t border-border-primary">
        <Footer>
          <Footer.Container>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
              <Footer.Section>
                <Footer.Title>Company</Footer.Title>
                <Footer.Link href="/about">About</Footer.Link>
                <Footer.Link href="/team">Team</Footer.Link>
              </Footer.Section>

              <Footer.Section>
                <Footer.Title>Support</Footer.Title>
                <Footer.Link href="/help">Help Center</Footer.Link>
                <Footer.Link href="/contact">Contact</Footer.Link>
              </Footer.Section>

              <Footer.Section>
                <Footer.Title>Connect</Footer.Title>
                <Footer.Link href="https://twitter.com" external>
                  Twitter
                </Footer.Link>
                <Footer.Link href="https://github.com" external>
                  GitHub
                </Footer.Link>
                <Footer.Text>Follow us on social media</Footer.Text>
              </Footer.Section>
            </div>
          </Footer.Container>
        </Footer>
      </div>

      <div className="border-t border-border-primary">
        <Footer>
          <Footer.Container>
            <div className="flex flex-col gap-md">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
                <Footer.Section>
                  <Footer.Title>Product</Footer.Title>
                  <Footer.Link href="/features">Features</Footer.Link>
                  <Footer.Link href="/pricing">Pricing</Footer.Link>
                  <Footer.Link href="/security">Security</Footer.Link>
                </Footer.Section>

                <Footer.Section>
                  <Footer.Title>Company</Footer.Title>
                  <Footer.Link href="/about">About</Footer.Link>
                  <Footer.Link href="/blog">Blog</Footer.Link>
                  <Footer.Link href="/careers">Careers</Footer.Link>
                </Footer.Section>

                <Footer.Section>
                  <Footer.Title>Resources</Footer.Title>
                  <Footer.Link href="/docs">Docs</Footer.Link>
                  <Footer.Link href="/api">API</Footer.Link>
                  <Footer.Link href="/status">Status</Footer.Link>
                </Footer.Section>

                <Footer.Section>
                  <Footer.Title>Legal</Footer.Title>
                  <Footer.Link href="/privacy">Privacy</Footer.Link>
                  <Footer.Link href="/terms">Terms</Footer.Link>
                  <Footer.Link href="/cookies">Cookies</Footer.Link>
                </Footer.Section>
              </div>

              <div className="border-t border-border-primary pt-md">
                <Footer.Text>© 2024 Company Inc. All rights reserved.</Footer.Text>
              </div>
            </div>
          </Footer.Container>
        </Footer>
      </div>
    </div>
  ),
}