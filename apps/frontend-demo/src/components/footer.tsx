'use client'
import type { NavSection } from '@/types/navigation'
import { handleFormSubmit } from '@/utils/form-utils'
import { Button } from '@ui/atoms/button'
import { Input } from '@ui/atoms/input'
import { Link } from '@ui/atoms/link'

const footerSections: NavSection[] = [
  {
    title: 'Quick Links',
    links: [
      { href: '/products', label: 'All Products' },
      { href: '/categories', label: 'Categories' },
      { href: '/about', label: 'About Us' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Customer Service',
    links: [
      { href: '/shipping', label: 'Shipping Info' },
      { href: '/returns', label: 'Returns' },
      { href: '/faq', label: 'FAQ' },
      { href: '/support', label: 'Support' },
    ],
  },
]

export function Footer() {
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleFormSubmit(e, () => {
      // Handle newsletter submission
      console.log('Newsletter form submitted')
    })
  }

  return (
    <footer className="bg-footer-bg text-footer-fg">
      <div className="mx-auto max-w-footer-max-w px-footer-container-x py-footer-container-y sm:px-footer-container-x-sm lg:px-footer-container-x-lg">
        <div className="grid grid-cols-1 gap-footer-section md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <h3 className="mb-footer-heading font-semibold text-footer-heading text-footer-heading">
              Store Demo
            </h3>
            <p className="mb-footer-description text-footer-body">
              Your trusted online shopping destination for quality products and
              great prices.
            </p>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="mb-footer-heading font-semibold text-footer-heading text-footer-heading">
                {section.title}
              </h4>
              <ul className="space-y-footer-list text-footer-body">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-footer-link transition-colors hover:text-footer-link-hover"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <h4 className="mb-footer-heading font-semibold text-footer-heading text-footer-heading">
              Newsletter
            </h4>
            <p className="mb-footer-description text-footer-body">
              Subscribe to get special offers and updates
            </p>
            <form className="mt-footer-form" onSubmit={handleNewsletterSubmit}>
              <div className="flex flex-col gap-footer-input-gap sm:flex-row">
                <Input
                  type="email"
                  placeholder="Your email"
                  size="sm"
                  className="w-full border-footer-input-border bg-footer-input-bg text-footer-input-fg placeholder:text-footer-input-placeholder hover:bg-footer-input-bg-hover focus-visible:bg-footer-input-bg-focus sm:max-w-footer-input"
                />
                <Button variant="primary" size="sm" type="submit">
                  Subscribe
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-footer-bottom-bar border-footer-border border-t pt-footer-bottom-bar text-center">
          <p className="text-footer-copyright text-footer-fg">
            &copy; 2024 Store Demo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
