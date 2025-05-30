'use client'

import { Button } from 'ui/src/atoms/button'
import { Input } from 'ui/src/atoms/input'
import { Link } from 'ui/src/atoms/link'
import { tv } from 'ui/src/utils'
import type { NavSection } from '../types/navigation'
import { handleFormSubmit } from '../utils/form-utils'

const footerVariants = tv({
  slots: {
    root: 'bg-footer-bg text-footer-fg',
    container:
      'mx-auto max-w-footer-max-w px-footer-container-x py-footer-container-y sm:px-footer-container-x-sm lg:px-footer-container-x-lg',
    grid: 'grid grid-cols-1 gap-footer-section md:grid-cols-2 lg:grid-cols-4',
    section: '',
    heading:
      'mb-footer-heading font-semibold text-footer-heading text-footer-heading',
    list: 'space-y-footer-list text-footer-body',
    listItem: '',
    link: 'text-footer-link hover:text-footer-link-hover transition-colors',
    description: 'text-footer-body mb-footer-description',
    newsletterForm: 'mt-footer-form',
    newsletterWrapper: 'flex flex-col sm:flex-row gap-footer-input-gap',
    newsletterInput:
      'w-full hover:bg-footer-input-bg-hover sm:max-w-footer-input bg-footer-input-bg text-footer-input-fg placeholder:text-footer-input-placeholder border-footer-input-border focus-visible:bg-footer-input-bg-focus',
    bottomBar:
      'mt-footer-bottom-bar border-t border-footer-border pt-footer-bottom-bar text-center',
    copyright: 'text-footer-copyright text-footer-fg',
  },
})

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
  const styles = footerVariants()

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleFormSubmit(e, () => {
      // Handle newsletter submission
      console.log('Newsletter form submitted')
    })
  }

  return (
    <footer className={styles.root()}>
      <div className={styles.container()}>
        <div className={styles.grid()}>
          {/* Company Info */}
          <div className={styles.section()}>
            <h3 className={styles.heading()}>Store Demo</h3>
            <p className={styles.description()}>
              Your trusted online shopping destination for quality products and
              great prices.
            </p>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className={styles.section()}>
              <h4 className={styles.heading()}>{section.title}</h4>
              <ul className={styles.list()}>
                {section.links.map((link) => (
                  <li key={link.href} className={styles.listItem()}>
                    <Link href={link.href} className={styles.link()}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className={styles.section()}>
            <h4 className={styles.heading()}>Newsletter</h4>
            <p className={styles.description()}>
              Subscribe to get special offers and updates
            </p>
            <form
              className={styles.newsletterForm()}
              onSubmit={handleNewsletterSubmit}
            >
              <div className={styles.newsletterWrapper()}>
                <Input
                  type="email"
                  placeholder="Your email"
                  size="sm"
                  className={styles.newsletterInput()}
                />
                <Button variant="primary" size="sm" type="submit">
                  Subscribe
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar()}>
          <p className={styles.copyright()}>
            &copy; 2024 Store Demo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
