import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="min-h-screen bg-[#0a0704] text-[#FAF7F2] flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-5 md:px-12 py-5">
        <span
          className="text-3xl text-[#C9A96E]"
          style={{ fontFamily: 'var(--font-great-vibes)' }}
        >
          Maazim
        </span>
        <div className="flex items-center gap-4">
          {user ? (
            <Link
              href="/dashboard"
              className="text-sm px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-[#C9A96E]/50 text-[#C9A96E] hover:bg-[#C9A96E] hover:text-[#0a0704] transition-colors whitespace-nowrap"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm text-[#FAF7F2]/60 hover:text-[#FAF7F2] transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="text-sm px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-[#C9A96E]/50 text-[#C9A96E] hover:bg-[#C9A96E] hover:text-[#0a0704] transition-colors whitespace-nowrap"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-12 pb-24">
        <p className="text-xs tracking-[0.3em] uppercase text-[#C9A96E]/60 mb-6">
          Digital Wedding Invitations
        </p>
        <h1
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-tight text-[#FAF7F2] mb-6"
          style={{ fontFamily: 'var(--font-great-vibes)' }}
        >
          Tell your story
          <br />
          <span className="text-[#C9A96E]">beautifully</span>
        </h1>
        <p
          className="max-w-lg text-lg md:text-xl text-[#FAF7F2]/50 leading-relaxed mb-12"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          Cinematic digital invitations crafted like a mise en scène. Share a link.
          Let your guests feel the magic.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="/sign-up"
            className="px-8 py-4 rounded-full bg-[#C9A96E] text-[#0a0704] text-sm font-semibold tracking-wide hover:bg-[#FAF7F2] transition-colors"
          >
            Create your invitation
          </Link>
          <Link
            href="/invitation/sarah-thomas"
            className="px-8 py-4 rounded-full border border-[#FAF7F2]/20 text-[#FAF7F2]/70 text-sm hover:border-[#C9A96E]/40 hover:text-[#C9A96E] transition-colors"
          >
            See a demo
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-[#FAF7F2]/8 px-6 py-14">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {[
            {
              title: 'Cinematic opener',
              desc: "Full-screen video reveal with synchronized music — an entrance your guests won't forget.",
            },
            {
              title: 'Live RSVP tracking',
              desc: 'Dashboard with guest list, attendance counts, and meal preferences in real time.',
            },
            {
              title: 'One link, zero printing',
              desc: 'Share a beautiful link. Works on every device, no app required.',
            },
          ].map((f) => (
            <div key={f.title}>
              <h3
                className="text-lg text-[#C9A96E] mb-2"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                {f.title}
              </h3>
              <p className="text-sm text-[#FAF7F2]/40 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#FAF7F2]/8 px-6 py-6 text-center">
        <p className="text-xs text-[#FAF7F2]/20">
          © {new Date().getFullYear()} Maazim. All rights reserved.
        </p>
      </footer>
    </main>
  )
}
