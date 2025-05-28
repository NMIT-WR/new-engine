import { Button } from 'ui/src/atoms/button'
import { Input } from 'ui/src/atoms/input'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div>
            <h3 className="mb-4 font-semibold text-white text-lg">Store Demo</h3>
            <p className="text-sm">
              Your trusted online shopping destination for quality products and great prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-white">All Products</Link></li>
              <li><Link href="/categories" className="hover:text-white">Categories</Link></li>
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="mb-4 font-semibold text-white">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shipping" className="hover:text-white">Shipping Info</Link></li>
              <li><Link href="/returns" className="hover:text-white">Returns</Link></li>
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/support" className="hover:text-white">Support</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-4 font-semibold text-white">Newsletter</h4>
            <p className="mb-4 text-sm">Subscribe to get special offers and updates</p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="flex-1"
              />
              <Button variant="primary" size="sm">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm">
          <p>&copy; 2024 Store Demo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}