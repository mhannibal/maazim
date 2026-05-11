'use client'

import { useActionState, useState } from 'react'
import { submitRsvpAction, type RsvpState } from './rsvp-action'

export default function RsvpForm({
  invitationId,
  coupleName,
  rsvpDeadline,
}: {
  invitationId: string
  coupleName: string
  rsvpDeadline?: string
}) {
  const [state, action, pending] = useActionState<RsvpState, FormData>(
    submitRsvpAction,
    null,
  )
  const [attending, setAttending] = useState<boolean | null>(null)
  const [showForm, setShowForm] = useState(false)

  // ── Success screen ──────────────────────────────────────────────
  if (state?.success) {
    return (
      <div className="text-center py-8 px-4">
        <div className="w-12 h-12 rounded-full bg-[#C9A96E]/15 flex items-center justify-center mx-auto mb-5">
          {state.attending ? (
            <svg className="w-6 h-6 text-[#C9A96E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-[#FAF7F2]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
        </div>
        <p
          className="text-[#FAF7F2] mb-2"
          style={{ fontFamily: 'var(--font-great-vibes)', fontSize: '1.7rem' }}
        >
          {state.attending ? `See you there, ${state.name}!` : `We'll miss you, ${state.name}`}
        </p>
        <p className="text-[#FAF7F2]/40 text-sm">
          {state.attending
            ? 'Your RSVP has been received. We can\'t wait to celebrate with you.'
            : 'Thank you for letting us know. We appreciate your response.'}
        </p>
      </div>
    )
  }

  // ── Initial choice buttons (before form opens) ──────────────────
  if (!showForm) {
    return (
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
        <button
          onClick={() => { setAttending(true); setShowForm(true) }}
          className="w-full sm:w-auto px-8 py-3.5 border border-[#C9A96E] text-[#C9A96E] text-xs tracking-[0.2em] uppercase hover:bg-[#C9A96E] hover:text-[#2D1B0E] active:scale-95 transition-all duration-300 rounded-sm"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          Joyfully Accept
        </button>
        <button
          onClick={() => { setAttending(false); setShowForm(true) }}
          className="w-full sm:w-auto px-8 py-3.5 border border-[#FAF7F2]/20 text-[#FAF7F2]/45 text-xs tracking-[0.2em] uppercase hover:border-[#FAF7F2]/50 hover:text-[#FAF7F2]/75 active:scale-95 transition-all duration-300 rounded-sm"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          Regretfully Decline
        </button>
      </div>
    )
  }

  // ── RSVP form ───────────────────────────────────────────────────
  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Back button */}
      <button
        type="button"
        onClick={() => setShowForm(false)}
        className="text-[#FAF7F2]/30 text-xs tracking-widest uppercase mb-5 hover:text-[#FAF7F2]/60 transition-colors"
      >
        ← Back
      </button>

      <p
        className="text-[#C9A96E]/80 text-sm mb-6 text-center"
        style={{ fontFamily: 'var(--font-cormorant)' }}
      >
        {attending ? 'We\'re thrilled you\'ll be joining us.' : 'We\'re sorry you can\'t make it.'}
      </p>

      <form action={action} className="space-y-4">
        {/* Hidden fields */}
        <input type="hidden" name="invitation_id" value={invitationId} />
        <input type="hidden" name="attending" value={attending ? 'yes' : 'no'} />

        <RsvpField
          name="name"
          label="Your name"
          placeholder="Full name"
          required
          dark
        />
        <RsvpField
          name="email"
          label="Email (optional)"
          type="email"
          placeholder="you@example.com"
          dark
        />
        <RsvpField
          name="phone"
          label="Phone (optional)"
          type="tel"
          placeholder="+213 555 000 000"
          dark
        />

        {attending && (
          <>
            <div className="flex items-center gap-3 py-1">
              <input
                id="plus_one"
                name="plus_one"
                type="checkbox"
                className="w-4 h-4 rounded border-[#C9A96E]/40 bg-transparent accent-[#C9A96E]"
              />
              <label htmlFor="plus_one" className="text-sm text-[#FAF7F2]/60">
                I'll be bringing a plus-one
              </label>
            </div>
            <RsvpField
              name="meal_preference"
              label="Meal preference (optional)"
              placeholder="Vegetarian, vegan, halal…"
              dark
            />
          </>
        )}

        <RsvpTextarea
          name="message"
          label="Message to the couple (optional)"
          placeholder="Leave a warm wish…"
          rows={3}
          dark
        />

        {state?.error && (
          <p className="text-sm text-red-400 bg-red-900/20 px-4 py-3 rounded-lg">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full py-3.5 rounded-sm border border-[#C9A96E] bg-[#C9A96E] text-[#2D1B0E] text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#FAF7F2] hover:border-[#FAF7F2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          {pending ? 'Sending…' : attending ? 'Confirm Attendance' : 'Send Response'}
        </button>
      </form>
    </div>
  )
}

// ── Sub-components ──────────────────────────────────────────────────────────

function RsvpField({
  name,
  label,
  placeholder,
  type = 'text',
  required = false,
  dark = false,
}: {
  name: string
  label: string
  placeholder?: string
  type?: string
  required?: boolean
  dark?: boolean
}) {
  const inputCls = dark
    ? 'bg-[#FAF7F2]/5 border-[#C9A96E]/20 text-[#FAF7F2] placeholder:text-[#FAF7F2]/20 focus:border-[#C9A96E] focus:ring-[#C9A96E]/20'
    : 'bg-[#FAF7F2] border-[#C9A96E]/30 text-[#2D1B0E] placeholder:text-[#2D1B0E]/30 focus:border-[#C9A96E] focus:ring-[#C9A96E]/40'
  const labelCls = dark ? 'text-[#FAF7F2]/50' : 'text-[#2D1B0E]/70'

  return (
    <div>
      <label htmlFor={name} className={`block text-xs font-medium mb-1 tracking-wide ${labelCls}`}>
        {label}
        {required && <span className="text-[#C9A96E] ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-2.5 rounded-sm border text-sm focus:outline-none focus:ring-1 transition-colors ${inputCls}`}
      />
    </div>
  )
}

function RsvpTextarea({
  name,
  label,
  placeholder,
  rows = 3,
  dark = false,
}: {
  name: string
  label: string
  placeholder?: string
  rows?: number
  dark?: boolean
}) {
  const cls = dark
    ? 'bg-[#FAF7F2]/5 border-[#C9A96E]/20 text-[#FAF7F2] placeholder:text-[#FAF7F2]/20 focus:border-[#C9A96E] focus:ring-[#C9A96E]/20'
    : 'bg-[#FAF7F2] border-[#C9A96E]/30 text-[#2D1B0E] placeholder:text-[#2D1B0E]/30 focus:border-[#C9A96E] focus:ring-[#C9A96E]/40'
  const labelCls = dark ? 'text-[#FAF7F2]/50' : 'text-[#2D1B0E]/70'

  return (
    <div>
      <label htmlFor={name} className={`block text-xs font-medium mb-1 tracking-wide ${labelCls}`}>
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-sm border text-sm focus:outline-none focus:ring-1 transition-colors resize-none ${cls}`}
      />
    </div>
  )
}
