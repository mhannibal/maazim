import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOutAction } from '@/app/(auth)/actions'
import { SidebarNavLinks, MobileBottomNav } from './DashboardNav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/sign-in')

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* ── Desktop sidebar ────────────────────────────────────────── */}
      <aside className="fixed inset-y-0 left-0 w-60 bg-[#2D1B0E] flex-col z-40 hidden md:flex">
        <div className="px-6 pt-8 pb-6 border-b border-[#FAF7F2]/8">
          <Link href="/dashboard">
            <span className="text-2xl text-[#C9A96E]" style={{ fontFamily: 'var(--font-great-vibes)' }}>
              Maazim
            </span>
          </Link>
        </div>

        <SidebarNavLinks />

        <div className="px-4 pb-6 border-t border-[#FAF7F2]/8 pt-4">
          <p className="text-xs text-[#FAF7F2]/30 truncate mb-3">{user.email}</p>
          <form action={signOutAction}>
            <button
              type="submit"
              className="w-full text-left text-xs text-[#FAF7F2]/40 hover:text-[#C9A96E] transition-colors py-1"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Mobile top header ──────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5 h-14 bg-[#2D1B0E] md:hidden">
        <Link href="/dashboard">
          <span className="text-2xl text-[#C9A96E]" style={{ fontFamily: 'var(--font-great-vibes)' }}>
            Maazim
          </span>
        </Link>
        <form action={signOutAction}>
          <button
            type="submit"
            className="text-xs text-[#FAF7F2]/40 hover:text-[#C9A96E] transition-colors"
          >
            Sign out
          </button>
        </form>
      </header>

      {/* ── Mobile bottom nav ──────────────────────────────────────── */}
      <MobileBottomNav />

      {/* ── Main content ───────────────────────────────────────────── */}
      <main className="md:ml-60 pt-14 md:pt-0 pb-20 md:pb-0 min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  )
}
