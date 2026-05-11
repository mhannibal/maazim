'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function generateSlug(bride: string, groom: string): string {
  const clean = (s: string) =>
    s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  return `${clean(bride)}-${clean(groom)}-${Math.random().toString(36).slice(2, 6)}`
}

export async function createInvitationAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in')

  const bride = (formData.get('bride') as string).trim()
  const groom = (formData.get('groom') as string).trim()
  const date = formData.get('date') as string
  const venue = (formData.get('venue') as string).trim()
  const city = (formData.get('city') as string).trim()

  const slug = generateSlug(bride, groom)

  const { data, error } = await supabase
    .from('invitations')
    .insert({
      user_id: user.id,
      slug,
      theme_id: 'champagne',
      language: 'en',
      status: 'draft',
      event_details: { bride, groom, date, venue, city },
    })
    .select('id')
    .single()

  if (error || !data) {
    // Retry with a new slug on slug collision
    redirect('/dashboard/new?error=1')
  }

  redirect(`/dashboard/${data.id}/edit`)
}
