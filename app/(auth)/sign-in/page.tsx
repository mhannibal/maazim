'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signInAction } from '@/app/(auth)/actions'

export default function SignInPage() {
  const [state, action, pending] = useActionState(signInAction, null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1
            className="text-4xl text-[#2D1B0E]"
            style={{ fontFamily: 'var(--font-great-vibes)' }}
          >
            Maazim
          </h1>
          <p className="mt-2 text-sm text-[#2D1B0E]/60 tracking-widest uppercase">
            Wedding Invitations
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#C9A96E]/20 px-8 py-10">
          <h2
            className="text-2xl font-semibold text-[#2D1B0E] mb-1"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Welcome back
          </h2>
          <p className="text-sm text-[#2D1B0E]/50 mb-8">
            Sign in to manage your invitations
          </p>

          <form action={action} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#2D1B0E]/70 mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 rounded-lg border border-[#C9A96E]/30 bg-[#FAF7F2] text-[#2D1B0E] placeholder:text-[#2D1B0E]/30 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40 focus:border-[#C9A96E] transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#2D1B0E]/70"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#C9A96E] hover:text-[#2D1B0E] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 rounded-lg border border-[#C9A96E]/30 bg-[#FAF7F2] text-[#2D1B0E] placeholder:text-[#2D1B0E]/30 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40 focus:border-[#C9A96E] transition-colors"
                placeholder="••••••••"
              />
            </div>

            {state?.error && (
              <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full py-3 rounded-lg bg-[#2D1B0E] text-[#FAF7F2] text-sm font-medium tracking-wide hover:bg-[#C9A96E] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {pending ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#2D1B0E]/50">
            Don&apos;t have an account?{' '}
            <Link
              href="/sign-up"
              className="text-[#C9A96E] hover:text-[#2D1B0E] font-medium transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
