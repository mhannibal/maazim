'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signUpAction } from '@/app/(auth)/actions'

export default function SignUpPage() {
  const [state, action, pending] = useActionState(signUpAction, null)

  if (state?.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] px-4">
        <div className="w-full max-w-md text-center">
          <div
            className="text-4xl text-[#2D1B0E] mb-6"
            style={{ fontFamily: 'var(--font-great-vibes)' }}
          >
            Maazim
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-[#C9A96E]/20 px-8 py-12">
            <div className="w-14 h-14 rounded-full bg-[#C9A96E]/10 flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-[#C9A96E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2
              className="text-2xl font-semibold text-[#2D1B0E] mb-2"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Check your inbox
            </h2>
            <p className="text-sm text-[#2D1B0E]/50">
              We sent a confirmation link to{' '}
              <span className="text-[#2D1B0E] font-medium">{state.email}</span>.
              Click it to activate your account.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] px-4">
      <div className="w-full max-w-md">
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
            Create your account
          </h2>
          <p className="text-sm text-[#2D1B0E]/50 mb-8">
            Start crafting your cinematic invitation
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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#2D1B0E]/70 mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-lg border border-[#C9A96E]/30 bg-[#FAF7F2] text-[#2D1B0E] placeholder:text-[#2D1B0E]/30 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40 focus:border-[#C9A96E] transition-colors"
                placeholder="Min. 8 characters"
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
              {pending ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#2D1B0E]/50">
            Already have an account?{' '}
            <Link
              href="/sign-in"
              className="text-[#C9A96E] hover:text-[#2D1B0E] font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
