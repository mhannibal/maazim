'use server'

import { createClient } from '@/lib/supabase/server'

export type RsvpState = {
  error?: string
  success?: boolean
  name?: string
  attending?: boolean
} | null

export async function submitRsvpAction(
  _prev: RsvpState,
  formData: FormData,
): Promise<RsvpState> {
  const invitationId = formData.get('invitation_id') as string
  const name = (formData.get('name') as string | null)?.trim() ?? ''
  const email = (formData.get('email') as string | null)?.trim() || null
  const phone = (formData.get('phone') as string | null)?.trim() || null
  const attending = formData.get('attending') === 'yes'
  const plusOne = formData.get('plus_one') === 'on'
  const mealPreference = (formData.get('meal_preference') as string | null)?.trim() || null
  const message = (formData.get('message') as string | null)?.trim() || null

  if (!name) return { error: 'Please enter your name.' }
  if (!invitationId) return { error: 'Invalid invitation.' }

  const supabase = await createClient()

  const { error } = await supabase.from('guests').insert({
    invitation_id: invitationId,
    name,
    email,
    phone,
    rsvp_status: attending ? 'attending' : 'declined',
    plus_one: attending ? plusOne : false,
    meal_preference: attending ? mealPreference : null,
    message,
    responded_at: new Date().toISOString(),
  })

  if (error) {
    if (error.code === '23505') {
      return { error: 'An RSVP with this email has already been submitted.' }
    }
    return { error: 'Something went wrong. Please try again.' }
  }

  return { success: true, name, attending }
}
