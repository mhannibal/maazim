import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

type Guest = {
  id: string
  name: string
  email: string | null
  phone: string | null
  rsvp_status: 'pending' | 'attending' | 'declined'
  plus_one: boolean
  meal_preference: string | null
  message: string | null
  responded_at: string | null
  created_at: string
}

const STATUS_STYLES: Record<string, string> = {
  attending: 'bg-emerald-50 text-emerald-700',
  declined: 'bg-red-50 text-red-600',
  pending: 'bg-amber-50 text-amber-700',
}

export default async function GuestsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in')

  // Verify ownership
  const { data: invitation } = await supabase
    .from('invitations')
    .select('id, slug, status, event_details')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!invitation) notFound()

  const { data: guests } = await supabase
    .from('guests')
    .select('*')
    .eq('invitation_id', id)
    .order('created_at', { ascending: false })

  const guestList = (guests ?? []) as Guest[]
  const attending = guestList.filter((g) => g.rsvp_status === 'attending').length
  const declined = guestList.filter((g) => g.rsvp_status === 'declined').length
  const pending = guestList.filter((g) => g.rsvp_status === 'pending').length
  const plusOnes = guestList.filter((g) => g.plus_one && g.rsvp_status === 'attending').length

  const ed = invitation.event_details as { bride?: string; groom?: string }
  const coupleName =
    ed.bride && ed.groom ? `${ed.bride} & ${ed.groom}` : invitation.slug

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6 sm:mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link href="/dashboard" className="text-sm text-[#2D1B0E]/40 hover:text-[#2D1B0E]">
              ← Dashboard
            </Link>
          </div>
          <h1
            className="text-3xl text-[#2D1B0E]"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            {coupleName}
          </h1>
          <p className="text-sm text-[#2D1B0E]/50 mt-0.5">Guest list</p>
        </div>
        <Link
          href={`/invitation/${invitation.slug}`}
          target="_blank"
          className="self-start text-sm px-4 py-2 rounded-lg border border-[#C9A96E]/30 text-[#C9A96E] hover:bg-[#C9A96E] hover:text-[#0a0704] transition-colors whitespace-nowrap"
        >
          View invitation ↗
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Attending', value: attending + plusOnes, sub: plusOnes ? `+${plusOnes} plus-ones` : undefined, color: 'text-emerald-700' },
          { label: 'Declined', value: declined, color: 'text-red-600' },
          { label: 'Pending', value: pending, color: 'text-amber-700' },
          { label: 'Total RSVPs', value: guestList.length, color: 'text-[#2D1B0E]' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[#C9A96E]/15 px-5 py-4">
            <p className="text-xs text-[#2D1B0E]/40 mb-1">{s.label}</p>
            <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
            {s.sub && <p className="text-xs text-[#2D1B0E]/30 mt-0.5">{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* Table */}
      {guestList.length === 0 ? (
        <div className="text-center py-16 text-[#2D1B0E]/40 text-sm">
          No RSVPs yet. Share the invitation link to start collecting responses.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#C9A96E]/15 overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="border-b border-[#C9A96E]/15">
                <th className="text-left px-4 sm:px-5 py-3 text-xs font-medium text-[#2D1B0E]/40 uppercase tracking-wide">Name</th>
                <th className="hidden sm:table-cell text-left px-5 py-3 text-xs font-medium text-[#2D1B0E]/40 uppercase tracking-wide">Contact</th>
                <th className="text-left px-4 sm:px-5 py-3 text-xs font-medium text-[#2D1B0E]/40 uppercase tracking-wide">Status</th>
                <th className="hidden sm:table-cell text-left px-5 py-3 text-xs font-medium text-[#2D1B0E]/40 uppercase tracking-wide">Plus-one</th>
                <th className="hidden lg:table-cell text-left px-5 py-3 text-xs font-medium text-[#2D1B0E]/40 uppercase tracking-wide">Message</th>
              </tr>
            </thead>
            <tbody>
              {guestList.map((guest, i) => (
                <tr
                  key={guest.id}
                  className={`border-b border-[#C9A96E]/8 last:border-0 ${i % 2 === 0 ? '' : 'bg-[#FAF7F2]/50'}`}
                >
                  <td className="px-4 sm:px-5 py-3.5 font-medium text-[#2D1B0E]">{guest.name}</td>
                  <td className="hidden sm:table-cell px-5 py-3.5 text-[#2D1B0E]/50">
                    {guest.email ?? guest.phone ?? '—'}
                  </td>
                  <td className="px-4 sm:px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[guest.rsvp_status]}`}>
                      {guest.rsvp_status.charAt(0).toUpperCase() + guest.rsvp_status.slice(1)}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell px-5 py-3.5 text-[#2D1B0E]/50">
                    {guest.plus_one ? '✓' : '—'}
                  </td>
                  <td className="hidden lg:table-cell px-5 py-3.5 text-[#2D1B0E]/50 max-w-xs truncate">
                    {guest.message ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
