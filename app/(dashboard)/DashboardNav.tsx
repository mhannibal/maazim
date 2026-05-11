'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function SidebarNavLinks() {
  const p = usePathname()
  return (
    <nav className="flex-1 px-3 py-6 space-y-1">
      <NavLink href="/dashboard" active={p === '/dashboard'} icon={<InvitationIcon />}>
        My Invitations
      </NavLink>
      <NavLink href="/dashboard/new" active={p === '/dashboard/new'} icon={<PlusIcon />}>
        New Invitation
      </NavLink>
    </nav>
  )
}

export function MobileBottomNav() {
  const p = usePathname()
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-[#2D1B0E] border-t border-[#FAF7F2]/10 flex">
      <BottomTab href="/dashboard" active={p === '/dashboard'} icon={<InvitationIcon />} label="Invitations" />
      <BottomTab href="/dashboard/new" active={p === '/dashboard/new'} icon={<PlusIcon />} label="New" />
    </nav>
  )
}

function NavLink({
  href,
  active,
  icon,
  children,
}: {
  href: string
  active: boolean
  icon: React.ReactNode
  children: string
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
        active
          ? 'bg-[#FAF7F2]/10 text-[#FAF7F2]'
          : 'text-[#FAF7F2]/60 hover:text-[#FAF7F2] hover:bg-[#FAF7F2]/8'
      }`}
    >
      <span className="w-4 h-4 shrink-0">{icon}</span>
      {children}
    </Link>
  )
}

function BottomTab({
  href,
  active,
  icon,
  label,
}: {
  href: string
  active: boolean
  icon: React.ReactNode
  label: string
}) {
  return (
    <Link
      href={href}
      className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
        active ? 'text-[#C9A96E]' : 'text-[#FAF7F2]/40'
      }`}
    >
      <span className="w-5 h-5">{icon}</span>
      <span>{label}</span>
    </Link>
  )
}

function InvitationIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
    </svg>
  )
}
