'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from 'ui/atoms/button'
import { FormInput } from 'ui/molecules/form-input'
import { FormCheckbox } from 'ui/molecules/form-checkbox'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login:', { email, password, rememberMe })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple header */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-xl font-bold">
              Demo Shop
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-center mb-8">Přihlášení</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput
                label="E-mail"
                type="email"
                placeholder="vas@email.cz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <FormInput
                label="Heslo"
                type="password"
                placeholder="Zadejte heslo"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="flex items-center justify-between">
                <FormCheckbox
                  label="Zapamatovat si mě"
                  checked={rememberMe}
                  onChange={setRememberMe}
                />
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Zapomněli jste heslo?
                </Link>
              </div>

              <Button type="submit" variant="primary" theme="solid" size="lg" block>
                Přihlásit se
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">nebo</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button variant="secondary" theme="outlined" size="lg" block>
                  <span className="flex items-center justify-center gap-2">
                    <span>🔷</span> Pokračovat s Google
                  </span>
                </Button>
                <Button variant="secondary" theme="outlined" size="lg" block>
                  <span className="flex items-center justify-center gap-2">
                    <span>📘</span> Pokračovat s Facebook
                  </span>
                </Button>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-gray-600">
              Nemáte účet?{' '}
              <Link href="/register" className="font-medium text-blue-600 hover:underline">
                Zaregistrujte se
              </Link>
            </p>
          </div>

          {/* Benefits */}
          <div className="mt-8 text-center">
            <h2 className="text-lg font-semibold mb-4">Proč se přihlásit?</h2>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>✓ Sledování objednávek</li>
              <li>✓ Historie nákupů</li>
              <li>✓ Rychlejší objednávání</li>
              <li>✓ Exkluzivní slevy a nabídky</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}