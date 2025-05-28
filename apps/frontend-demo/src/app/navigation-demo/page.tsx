'use client'
import { Navigation, type NavItem } from '../../components/navigation'

export default function NavigationDemoPage() {
  const basicItems: NavItem[] = [
    { title: 'Home', href: '/' },
    { title: 'Products', href: '/products' },
    { title: 'About', href: '/about' },
    { title: 'Contact', href: '/contact' },
  ]

  const advancedItems: NavItem[] = [
    { title: 'Dashboard', href: '/dashboard', icon: 'icon-[mdi--home]' },
    {
      title: 'Products',
      icon: 'icon-[mdi--shopping]',
      role: 'submenu',
      children: [
        { title: 'All Products', href: '/products' },
        { title: 'Categories', href: '/categories' },
        { title: 'Brands', href: '/brands', label: 'New' },
        { title: 'Sale Items', href: '/sale', icon: 'icon-[mdi--percent]' },
      ],
    },
    {
      title: 'Company',
      icon: 'icon-[mdi--office-building]',
      role: 'submenu',
      children: [
        { title: 'About Us', href: '/about' },
        { title: 'Our Team', href: '/team' },
        { title: 'Careers', href: '/careers', label: 'Hiring' },
        { title: 'Blog', href: 'https://blog.example.com', external: true },
      ],
    },
    { title: 'Contact', href: '/contact' },
    {
      title: 'External',
      href: 'https://google.com',
      external: true,
      icon: 'icon-[mdi--open-in-new]',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-500 p-8">
      <div className="mx-auto max-w-7xl space-y-12">
        <div>
          <h1 className="mb-8 font-bold text-3xl">
            Navigation Light Component Demo
          </h1>
        </div>

        {/* Basic Navigation */}
        <section>
          <h2 className="mb-4 font-semibold text-xl">Basic Navigation</h2>
          <div className="rounded-lg bg-white p-4 shadow">
            <Navigation items={basicItems} />
          </div>
        </section>

        {/* Advanced Navigation with Icons and Submenus */}
        <section>
          <h2 className="mb-4 font-semibold text-xl">
            Advanced Navigation (with icons, labels, submenu)
          </h2>
          <div className="rounded-lg bg-white p-4 shadow">
            <Navigation items={advancedItems} />
          </div>
        </section>

        {/* Different Variants */}
        <section>
          <h2 className="mb-4 font-semibold text-xl">Variants</h2>
          <div className="space-y-4">
            <div className="rounded-lg bg-white p-4 shadow">
              <p className="mb-2 text-gray-600 text-sm">Default variant:</p>
              <Navigation items={basicItems} variant="default" />
            </div>
            <div className="rounded-lg bg-white p-4 shadow">
              <p className="mb-2 text-gray-600 text-sm">Primary variant:</p>
              <Navigation items={basicItems} variant="primary" />
            </div>
            <div className="rounded-lg bg-white p-4 shadow">
              <p className="mb-2 text-gray-600 text-sm">Ghost variant:</p>
              <Navigation items={basicItems} variant="ghost" />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
