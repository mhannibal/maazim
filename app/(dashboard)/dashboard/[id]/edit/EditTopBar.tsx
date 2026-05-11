'use client'

import Link from 'next/link'

export function EditTopBar({
  slug,
  currentThemeId,
}: {
  slug: string
  currentThemeId: string
}) {
  // Read the currently selected theme from the hidden input inside the form at click time
  const handlePreviewClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const input = document.querySelector<HTMLInputElement>('input[name="theme_id"]')
    const theme = input?.value ?? currentThemeId
    e.preventDefault()
    window.open(`/invitation/${slug}?theme=${theme}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      {/* Desktop — sticky bar with Dashboard ⪷ Preview */}
      <div className="hidden md:flex sticky top-0 z-10 bg-[#FAF7F2]/90 backdrop-blur border-b border-[#C9A96E]/15 px-8 py-3 items-center justify-between">
        <Link
          href="/dashboard"
          className="text-sm text-[#2D1B0E]/40 hover:text-[#2D1B0E] transition-colors"
        >
          ← Dashboard
        </Link>
        <a
          href={`/invitation/${slug}?theme=${currentThemeId}`}
          onClick={handlePreviewClick}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2D1B0E] text-[#FAF7F2] text-xs font-medium hover:bg-[#C9A96E] hover:text-[#2D1B0E] transition-all duration-200 active:scale-95"
        >
          Preview
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M2 6h7M6 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>

      {/* Mobile — Preview button injected beside Sign out in the fixed header (z above layout header z-40) */}
      <a
        href={`/invitation/${slug}?theme=${currentThemeId}`}
        onClick={handlePreviewClick}
        target="_blank"
        rel="noopener noreferrer"
        className="md:hidden fixed top-0 z-[45] h-14 flex items-center right-[4.5rem] text-xs text-[#FAF7F2]/60 hover:text-[#C9A96E] transition-colors"
      >
        Preview
      </a>
    </>
  )
}
