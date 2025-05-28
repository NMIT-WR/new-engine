'use client'
import { Header } from '../../components/header'
import type { NavItem } from '../../components/navigation'
import { Button } from 'ui/src/atoms/button'

export default function HeaderDemoPage() {
  const navigationItems: NavItem[] = [
    { title: 'Home', href: '/' },
    { title: 'Products', href: '/products' },
    {
      title: 'Solutions',
      role: 'submenu',
      children: [
        { title: 'Enterprise', href: '/enterprise' },
        { title: 'Small Business', href: '/small-business' },
        { title: 'Developers', href: '/developers', label: 'New' },
      ],
    },
    { title: 'About', href: '/about' },
    { title: 'Contact', href: '/contact' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-12">
        {/* Basic Header */}
        <section>
          <h2 className="mb-4 px-8 py-4 font-semibold text-xl">Basic Header</h2>
          <Header 
            logo={{ text: 'My Store', icon: 'icon-[mdi--store]' }}
            navigationItems={navigationItems}
          />
        </section>

        {/* Header with User */}
        <section>
          <h2 className="mb-4 px-8 py-4 font-semibold text-xl">Header with User</h2>
          <Header 
            logo={{ text: 'My Store', icon: 'icon-[mdi--store]' }}
            navigationItems={navigationItems}
            user={{ name: 'John Doe' }}
          />
        </section>

        {/* Header with Custom Actions */}
        <section>
          <h2 className="mb-4 px-8 py-4 font-semibold text-xl">Header with Custom Actions</h2>
          <Header 
            logo={{ text: 'My Store', icon: 'icon-[mdi--store]' }}
            navigationItems={navigationItems}
            actions={
              <>
                <Button 
                  variant="tertiary" 
                  theme="borderless"
                  size="sm"
                  icon="icon-[mdi--cart]"
                >
                  Cart (3)
                </Button>
                <Button 
                  variant="tertiary" 
                  theme="borderless"
                  size="sm"
                  icon="icon-[mdi--bell]"
                />
              </>
            }
          />
        </section>

        {/* Dark Header */}
        <section>
          <h2 className="mb-4 px-8 py-4 font-semibold text-xl">Dark Header</h2>
          <Header 
            logo={{ text: 'My Store', icon: 'icon-[mdi--store]' }}
            navigationItems={navigationItems}
            variant="dark"
          />
        </section>

        {/* Transparent Header */}
        <section className="bg-gradient-to-r from-blue-500 to-purple-600 p-8">
          <h2 className="mb-4 font-semibold text-white text-xl">Transparent Header</h2>
          <Header 
            logo={{ text: 'My Store', icon: 'icon-[mdi--store]' }}
            navigationItems={navigationItems}
            variant="transparent"
            className="text-white"
          />
        </section>

        {/* Header without Navigation */}
        <section>
          <h2 className="mb-4 px-8 py-4 font-semibold text-xl">Header without Navigation</h2>
          <Header 
            logo={{ text: 'My Store', icon: 'icon-[mdi--store]' }}
          />
        </section>

        {/* Header with Everything */}
        <section>
          <h2 className="mb-4 px-8 py-4 font-semibold text-xl">Full Featured Header</h2>
          <Header 
            logo={{ text: 'My Store', icon: 'icon-[mdi--store]' }}
            navigationItems={navigationItems}
            user={{ name: 'John Doe' }}
            actions={
              <>
                <Button 
                  variant="tertiary" 
                  theme="borderless"
                  size="sm"
                  icon="icon-[mdi--cart]"
                >
                  Cart (3)
                </Button>
                <Button 
                  variant="tertiary" 
                  theme="borderless"
                  size="sm"
                  icon="icon-[mdi--bell]"
                />
              </>
            }
          />
        </section>
      </div>
    </div>
  )
}