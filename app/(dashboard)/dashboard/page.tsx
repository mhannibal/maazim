import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CardActions } from './CardActions'

type Invitation = {
  id: string
  slug: string
  status: 'draft' | 'published'
  event_details: {
    bride?: string
    groom?: string
    date?: string
    venue?: string
  }
  created_at: string
  guests: { count: number }[]
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: invitations } = await supabase
    .from('invitations')
    .select('id, slug, status, event_details, created_at, guests(count)')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-10">
        <div>
          <h1
            className="text-3xl text-[#2D1B0E]"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            My Invitations
          </h1>
          <p className="text-sm text-[#2D1B0E]/50 mt-1">
            {invitations?.length ?? 0} invitation{invitations?.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/dashboard/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2D1B0E] text-[#FAF7F2] text-sm hover:bg-[#C9A96E] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New invitation
        </Link>
      </div>

      {/* Empty state */}
      {!invitations?.length ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-[#C9A96E]/10 flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-[#C9A96E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2
            className="text-xl text-[#2D1B0E] mb-2"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            No invitations yet
          </h2>
          <p className="text-sm text-[#2D1B0E]/50 mb-6 max-w-xs">
            Create your first cinematic wedding invitation and share it with your guests.
          </p>
          <Link
            href="/dashboard/new"
            className="px-6 py-3 rounded-lg bg-[#2D1B0E] text-[#FAF7F2] text-sm hover:bg-[#C9A96E] transition-colors"
          >
            Create your first invitation
          </Link>
        </div>
      ) : (
        /* Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(invitations as Invitation[]).map((inv) => (
            <InvitationCard key={inv.id} invitation={inv} />
          ))}
        </div>
      )}
    </div>
  )
}

function InvitationCard({ invitation }: { invitation: Invitation }) {
  const { event_details: ed, slug, status } = invitation
  const coupleName =
    ed.bride && ed.groom
      ? `${ed.bride} & ${ed.groom}`
      : slug.replace(/-/g, ' ')

  const eventDate = ed.date
    ? new Date(ed.date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  const guestCount = invitation.guests?.[0]?.count ?? 0

  return (
    <div className="bg-white rounded-xl border border-[#C9A96E]/15 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      {/* Status badge */}
      <div className="flex items-center justify-between">
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            status === 'published'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-amber-50 text-amber-700'
          }`}
        >
          {status === 'published' ? 'Published' : 'Draft'}
        </span>
        {status === 'published' && (
          <Link
            href={`/invitation/${slug}`}
            target="_blank"
            className="text-xs text-[#C9A96E] hover:underline"
          >
            Preview ↗
          </Link>
        )}
      </div>

      {/* Couple name */}
      <div>
        <h3
          className="text-xl text-[#2D1B0E] leading-tight"
          style={{ fontFamily: 'var(--font-great-vibes)' }}
        >
          {coupleName}
        </h3>
        {eventDate && (
          <p className="text-xs text-[#2D1B0E]/40 mt-1">{eventDate}</p>
        )}
        {ed.venue && (
          <p className="text-xs text-[#2D1B0E]/40">{ed.venue}</p>
        )}
      </div>

      {/* Actions */}
      <CardActions id={invitation.id} slug={slug} status={status} guestCount={guestCount} />
    </div>
  )
}
