'use client'

import { useAuth } from '@/hooks/use-auth'
import { STORAGE_KEYS } from '@/lib/constants'
import { useState } from 'react'

export default function TestAuthPage() {
  const { user, login, register, logout, isLoading, error } = useAuth()
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('Test123!')
  const [mode, setMode] = useState<'login' | 'register'>('login')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'login') {
      await login(email, password)
    } else {
      await register(email, password, 'Test', 'User')
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-4 font-bold text-2xl">Auth Test Page</h1>

      {user ? (
        <div className="mb-4 rounded bg-green-100 p-4">
          <p>Logged in as: {user.email}</p>
          <p>
            Name: {user.first_name} {user.last_name}
          </p>
          <button
            onClick={logout}
            className="mt-2 rounded bg-red-500 px-4 py-2 text-white"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="mb-4 rounded bg-gray-100 p-4">
          <p>Not logged in</p>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded bg-red-100 p-4">
          <p>Error: {error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block">Mode:</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as 'login' | 'register')}
            className="rounded border p-2"
          >
            <option value="login">Login</option>
            <option value="register">Register</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border p-2"
            required
          />
        </div>

        <div>
          <label className="mb-2 block">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border p-2"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : mode === 'login' ? 'Login' : 'Register'}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="mb-2 font-bold text-xl">LocalStorage Contents:</h2>
        <pre className="rounded bg-gray-100 p-4">
          {typeof window !== 'undefined' &&
            JSON.stringify(
              {
                auth_token: localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
                  ? 'exists'
                  : 'null',
                cart_id: localStorage.getItem(STORAGE_KEYS.CART_ID)
                  ? 'exists'
                  : 'null',
              },
              null,
              2
            )}
        </pre>
      </div>
    </div>
  )
}
