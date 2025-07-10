'use client'
import type { NavSection } from '@/types/navigation'
import { handleFormSubmit } from '@/utils/form-utils'
import { Button } from '@ui/atoms/button'
import { Input } from '@ui/atoms/input'
import { Link } from '@ui/atoms/link'

const footerSections: NavSection[] = [
  {
    title: 'Rychlé odkazy',
    links: [
      { href: '/products', label: 'Všechny produkty' },
      { href: '/categories', label: 'Kategorie' },
      { href: '/about', label: 'O nás' },
      { href: '/contact', label: 'Kontakt' },
    ],
  },
  {
    title: 'Zákaznický servis',
    links: [
      { href: '/shipping', label: 'Informace o dopravě' },
      { href: '/returns', label: 'Vrácení' },
      { href: '/faq', label: 'Časté dotazy' },
      { href: '/support', label: 'Podpora' },
    ],
  },
]

export function Footer() {
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleFormSubmit(e, () => {
      // Handle newsletter submission
    })
  }

  return (
    <footer className="bg-footer-bg text-footer-fg">
      <div className="mx-auto max-w-footer-max-w px-footer-container-x py-footer-container-y sm:px-footer-container-x-sm lg:px-footer-container-x-lg">
        <div className="grid grid-cols-1 gap-footer-section md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <h3 className="mb-footer-heading font-semibold text-footer-heading text-footer-heading">
              Demo obchodu
            </h3>
            <p className="mb-footer-description text-footer-body">
              Váš spolehlivý online obchod s kvalitními produkty za skvělé ceny.
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
              Odběr novinek
            </h4>
            <p className="mb-footer-description text-footer-body">
              Přihlaste se k odběru speciálních nabídek a novinek
            </p>
            <form className="mt-footer-form" onSubmit={handleNewsletterSubmit}>
              <div className="flex flex-col gap-footer-input-gap sm:flex-row">
                <Input
                  type="email"
                  placeholder="Váš email"
                  size="sm"
                  className="w-full border-footer-input-border bg-footer-input-bg text-footer-input-fg placeholder:text-footer-input-placeholder hover:bg-footer-input-bg-hover focus-visible:bg-footer-input-bg-focus sm:max-w-footer-input"
                />
                <Button variant="primary" size="sm" type="submit">
                  Přihlásit se
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-footer-bottom-bar border-footer-border border-t pt-footer-bottom-bar text-center">
          <p className="text-footer-copyright text-footer-fg">
            &copy; 2024 Demo obchodu. Všechna práva vyhrazena.
          </p>
        </div>
      </div>
    </footer>
  )
}
