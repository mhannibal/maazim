'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { parseBlocks } from '@/lib/blocks'

export async function updateInvitationAction(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in')

  const get = (key: string) => (formData.get(key) as string | null)?.trim() ?? ''

  // Parse blocks JSON submitted by BlocksPanel hidden input
  let blocks
  try {
    blocks = parseBlocks(JSON.parse(get('blocks_json') || '{}'))
  } catch {
    blocks = undefined
  }

  const { error } = await supabase
    .from('invitations')
    .update({
      status: get('status') as 'draft' | 'published',
      theme_id: get('theme_id') || 'champagne',
      music_id: get('music_id') || 'anichmenk10',
      ...(blocks ? { blocks } : {}),
      event_details: {
        bride: get('bride'),
        groom: get('groom'),
        date: get('date'),
        story: get('story'),
        // Lieu block fields
        venue: get('venue'),
        city: get('city'),
        ceremony_time: get('ceremony_time'),
        ceremony_address: get('ceremony_address'),
        reception_time: get('reception_time'),
        reception_venue: get('reception_venue'),
        reception_address: get('reception_address'),
        // New content block fields
        programme_content: get('programme_content'),
        menu_content: get('menu_content'),
        gifts_content: get('gifts_content'),
        accommodation_content: get('accommodation_content'),
        // Single-field blocks
        dress_code: get('dress_code'),
        rsvp_deadline: get('rsvp_deadline'),
      },
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) redirect(`/dashboard/${id}/edit?error=1`)

  redirect(`/dashboard/${id}/edit?saved=1`)
}
