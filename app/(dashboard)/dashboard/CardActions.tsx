'use client'

import { useState } from 'react'
import Link from 'next/link'
import { deleteInvitationAction } from './actions'

export function CardActions({
  id,
  slug,
  status,
  guestCount,
}: {
  id: string
  slug: string
  status: 'draft' | 'published'
  guestCount: number
}) {
  const [confirming, setConfirming] = useState(false)
  const deleteAction = deleteInvitationAction.bind(null, id)

  if (confirming) {
    return (
      <div className="mt-auto space-y-2.5">
        <p className="text-xs text-center text-[#2D1B0E]/50">
          {status === 'published' && guestCount > 0
            ? `This will also delete ${guestCount} guest RSVP${guestCount !== 1 ? 's' : ''}.`
            : 'Delete this invitation?'}
        </p>
        <div className="flex gap-2">
          <form action={deleteAction} className="flex-1">
            <button
              type="submit"
              className="w-full text-center text-xs py-2 rounded-lg bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
            >
              Delete forever
            </button>
          </form>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="flex-1 text-xs py-2 rounded-lg bg-[#2D1B0E]/5 text-[#2D1B0E]/60 hover:bg-[#2D1B0E]/10 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-2 mt-auto">
      {status === 'published' ? (
        <Link
          href={`/dashboard/${id}/guests`}
          className="flex-1 text-center text-xs py-2 rounded-lg border border-[#C9A96E]/30 text-[#2D1B0E]/60 hover:border-[#C9A96E] hover:text-[#2D1B0E] transition-colors"
        >
          Guests
        </Link>
      ) : (
        <Link
          href={`/invitation/${slug}`}
          target="_blank"
          className="flex-1 text-center text-xs py-2 rounded-lg border border-[#C9A96E]/30 text-[#2D1B0E]/60 hover:border-[#C9A96E] hover:text-[#2D1B0E] transition-colors"
        >
          Preview ↗
        </Link>
      )}
      <Link
        href={`/dashboard/${id}/edit`}
        className="flex-1 text-center text-xs py-2 rounded-lg bg-[#2D1B0E]/5 text-[#2D1B0E]/60 hover:bg-[#2D1B0E] hover:text-[#FAF7F2] transition-colors"
      >
        Edit
      </Link>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label="Delete invitation"
        className="px-2.5 py-2 rounded-lg text-[#2D1B0E]/25 hover:text-red-600 hover:bg-red-50 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  )
}
