'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type AuthState = {
  error?: string
  success?: boolean
  email?: string
} | null

export async function signInAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Invalid email or password. Please try again.' }
  }

  redirect('/dashboard')
}

export async function signUpAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
  })

  if (error) {
    if (error.code === 'user_already_exists') {
      return { error: 'An account with this email already exists.' }
    }
    return { error: error.message }
  }

  return { success: true, email }
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/sign-in')
}
