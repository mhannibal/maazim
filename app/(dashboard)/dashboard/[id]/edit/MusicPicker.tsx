'use client'

import { useRef, useState } from 'react'
import { TRACKS, type Track } from '@/lib/music'

function TrackCard({
  track,
  isSelected,
  onSelect,
}: {
  track: Track
  isSelected: boolean
  onSelect: () => void
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isLongPress = useRef(false)
  const [playing, setPlaying] = useState(false)
  const disabled = !!track.comingSoon

  const startPreview = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(track.src)
      audioRef.current.volume = 0.6
      audioRef.current.onended = () => setPlaying(false)
    }
    audioRef.current.currentTime = 0
    audioRef.current.play().catch(() => {})
    setPlaying(true)
  }

  const stopPreview = () => {
    audioRef.current?.pause()
    if (audioRef.current) audioRef.current.currentTime = 0
    setPlaying(false)
  }

  // Desktop: hover to preview
  const handleMouseEnter = () => { if (!disabled) startPreview() }
  const handleMouseLeave = () => { stopPreview() }

  // Mobile: short tap = select, long press = preview
  const handleTouchStart = () => {
    if (disabled) return
    isLongPress.current = false
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true
      startPreview()
    }, 500)
  }
  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
    if (isLongPress.current) stopPreview()
  }
  const handleClick = () => {
    if (disabled) return
    if (isLongPress.current) {
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
        'relative w-full rounded-xl border-2 transition-all duration-200 text-left px-3 py-3 flex items-center gap-3',
        isSelected
          ? 'border-[#C9A96E] bg-[#C9A96E]/5 shadow-md shadow-[#C9A96E]/10'
          : 'border-[#C9A96E]/15 hover:border-[#C9A96E]/40 bg-white/60',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      {/* Play indicator */}
      <span className={[
        'shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors',
        isSelected ? 'bg-[#C9A96E]/20' : 'bg-[#2D1B0E]/5',
      ].join(' ')}>
        {playing ? (
          /* animated bars when previewing */
          <span className="flex items-end gap-[2px] h-4">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-[3px] bg-[#C9A96E] rounded-full animate-bounce"
                style={{ height: `${8 + i * 4}px`, animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </span>
        ) : (
          <svg className="w-3.5 h-3.5 text-[#C9A96E] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </span>

      {/* Track info */}
      <span className="flex-1 min-w-0">
        <span className="block text-sm text-[#2D1B0E] font-medium leading-tight truncate"
          style={{ fontFamily: 'var(--font-playfair)' }}>
          {track.title}
        </span>
        <span className="block text-[10px] text-[#2D1B0E]/40 truncate mt-0.5">
          {track.comingSoon ? 'Coming soon' : track.artist}{track.duration && !track.comingSoon ? ` · ${track.duration}` : ''}
        </span>
      </span>

      {/* Selected check */}
      {isSelected && (
        <span className="shrink-0 w-4 h-4 rounded-full bg-[#C9A96E] flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-[#0a0704]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
    </button>
  )
}

export function MusicPicker({
  currentMusicId,
  onMusicChange,
}: {
  currentMusicId: string
  onMusicChange?: (id: string) => void
}) {
  const [selected, setSelected] = useState(currentMusicId)

  const handleSelect = (id: string) => {
    setSelected(id)
    onMusicChange?.(id)
  }

  return (
    <div>
      <input type="hidden" name="music_id" value={selected} />

      <p className="text-xs font-medium text-[#2D1B0E]/40 uppercase tracking-widest mb-3">
        Music
      </p>
      <p className="text-[10px] text-[#2D1B0E]/30 mb-3 leading-snug">
        Hover (desktop) or long-press (mobile) to preview
      </p>

      <div className="flex flex-col gap-2">
        {TRACKS.map((track) => (
          <TrackCard
            key={track.id}
            track={track}
            isSelected={selected === track.id}
            onSelect={() => handleSelect(track.id)}
          />
        ))}
      </div>
    </div>
  )
}
