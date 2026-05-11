'use client'

import { useRef, useState } from 'react'
import { TEMPLATES, type Template } from '@/lib/templates'

function TemplateCard({
  t,
  isSelected,
  onSelect,
}: {
  t: Template
  isSelected: boolean
  onSelect: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isLongPress = useRef(false)
  const disabled = !!t.comingSoon

  // Desktop: hover plays video
  const handleMouseEnter = () => {
    videoRef.current?.play().catch(() => {})
  }
  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  // Mobile: short tap = select, long press = preview video
  const handleTouchStart = () => {
    if (disabled) return
    isLongPress.current = false
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true
      videoRef.current?.play().catch(() => {})
    }, 500)
  }
  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
    if (isLongPress.current) {
      // Stop video preview on finger lift; don't select
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
      }
    }
  }
  const handleClick = () => {
    if (disabled) return
    if (isLongPress.current) {
      // Long press ended — skip selection, already handled in touchEnd
      isLongPress.current = false
      return
    }
    onSelect()
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'manipulation' }}
      className={[
        'relative rounded-xl overflow-hidden border-2 transition-all duration-200 text-left',
        isSelected
          ? 'border-[#C9A96E] shadow-md shadow-[#C9A96E]/20'
          : 'border-transparent hover:border-[#C9A96E]/30',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      <div className="aspect-[9/14] bg-[#1a0f07] relative overflow-hidden">
        {/* Video — first frame as thumbnail, plays silently on hover */}
        <video
          ref={videoRef}
          src={t.video}
          muted
          playsInline
          loop
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0704]/90 via-[#0a0704]/20 to-transparent" />

        {/* Name + description */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-3">
          <p
            className="text-[#C9A96E] leading-none mb-0.5"
            style={{ fontFamily: 'var(--font-great-vibes)', fontSize: '1.05rem' }}
          >
            {t.name}
          </p>
          <p className="text-[#FAF7F2]/40 text-[10px] leading-snug">{t.description}</p>
        </div>

        {/* Selected checkmark */}
        {isSelected && (
          <span className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-[#C9A96E] flex items-center justify-center shadow">
            <svg className="w-3 h-3 text-[#0a0704]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </span>
        )}

        {/* Coming soon badge */}
        {t.comingSoon && (
          <span className="absolute top-2 left-2 z-10 text-[9px] px-1.5 py-0.5 rounded-full bg-[#FAF7F2]/10 text-[#FAF7F2]/50 tracking-wider uppercase">
            Soon
          </span>
        )}
      </div>
    </button>
  )
}

export function TemplatePicker({
  currentThemeId,
  onThemeChange,
}: {
  currentThemeId: string
  onThemeChange?: (themeId: string) => void
}) {
  const [selected, setSelected] = useState(currentThemeId)

  const handleSelect = (id: string) => {
    setSelected(id)
    onThemeChange?.(id)
  }

  return (
    <div>
      {/* Hidden input so the form picks up the selected value */}
      <input type="hidden" name="theme_id" value={selected} />

      <p className="text-xs font-medium text-[#2D1B0E]/40 uppercase tracking-widest mb-3">
        Template
      </p>

      <div className="grid grid-cols-2 gap-3">
        {TEMPLATES.map((t) => (
          <TemplateCard
            key={t.id}
            t={t}
            isSelected={selected === t.id}
            onSelect={() => handleSelect(t.id)}
          />
        ))}
      </div>
    </div>
  )
}
