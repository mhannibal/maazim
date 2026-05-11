'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import { TemplatePicker } from './TemplatePicker'
import { MusicPicker } from './MusicPicker'
import { BlocksPanel } from './BlocksPanel'
import type { Blocks } from '@/lib/blocks'

const STEPS = [
  { label: 'Infos' },
  { label: 'Sections' },
  { label: 'Thème' },
  { label: 'Musique' },
]

// ── Local field helpers ──────────────────────────────────────────────────────
function Field({
  name,
  label,
  defaultValue,
  placeholder,
  type = 'text',
  required = false,
}: {
  name: string
  label: string
  defaultValue?: string
  placeholder?: string
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-[10px] font-medium text-[#2D1B0E]/40 uppercase tracking-widest mb-2"
      >
        {label}
        {required && <span className="text-[#C9A96E] ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ''}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3.5 rounded-2xl border border-[#2D1B0E]/10 bg-white text-[#2D1B0E] text-[15px] placeholder:text-[#2D1B0E]/20 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 focus:border-[#C9A96E] transition-colors"
      />
    </div>
  )
}

function TextareaField({
  name,
  label,
  defaultValue,
  placeholder,
  rows = 4,
}: {
  name: string
  label: string
  defaultValue?: string
  placeholder?: string
  rows?: number
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-[10px] font-medium text-[#2D1B0E]/40 uppercase tracking-widest mb-2"
      >
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue ?? ''}
        placeholder={placeholder}
        className="w-full px-4 py-3.5 rounded-2xl border border-[#2D1B0E]/10 bg-white text-[#2D1B0E] text-[15px] placeholder:text-[#2D1B0E]/20 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 focus:border-[#C9A96E] transition-colors resize-none"
      />
    </div>
  )
}

// ── Wizard ───────────────────────────────────────────────────────────────────
export function EditWizard({
  slug,
  status,
  currentTheme,
  currentMusic,
  currentBlocks,
  ed,
  action,
}: {
  slug: string
  status: string
  currentTheme: string
  currentMusic: string
  currentBlocks: Blocks
  ed: Record<string, string | undefined>
  action: (formData: FormData) => void | Promise<void>
}) {
  const [step, setStep] = useState(0)
  const [pending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const total = STEPS.length
  const waspending = useRef(false)

  // Detect when the transition completes after a save
  useEffect(() => {
    if (waspending.current && !pending) setSaved(true)
    waspending.current = pending
  }, [pending])

  const handleSave = () => {
    if (!formRef.current) return
    const formData = new FormData(formRef.current)
    startTransition(() => action(formData))
  }

  const handlePreview = () => {
    const input = document.querySelector<HTMLInputElement>('input[name="theme_id"]')
    const theme = input?.value ?? currentTheme
    window.open(`/invitation/${slug}?theme=${theme}`, '_blank', 'noopener,noreferrer')
  }

  return (
    // No native form action — submission is only triggered by the explicit handleSave call.
    // This prevents any accidental submission (Enter key, mobile browser quirks) from
    // firing the server action mid-wizard.
    <form
      ref={formRef}
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col overflow-x-hidden"
    >

      {/* ── Save confirmation overlay ─────────────────────────────────── */}
      {saved && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF7F2]/95 backdrop-blur-sm px-6">
          {/* Check icon */}
          <div className="w-16 h-16 rounded-full bg-[#C9A96E]/15 flex items-center justify-center mb-6">
            <svg width="28" height="28" fill="none" stroke="#C9A96E" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2
            className="text-2xl text-[#2D1B0E] mb-2 text-center"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Modifications enregistrées
          </h2>
          <p className="text-[#2D1B0E]/40 text-sm text-center mb-10">
            Votre invitation a été mise à jour avec succès.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <button
              type="button"
              onClick={handlePreview}
              style={{ touchAction: 'manipulation' }}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border-2 border-[#C9A96E] text-[#C9A96E] text-sm font-medium hover:bg-[#C9A96E]/10 transition-all duration-200 active:scale-95"
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Aperçu
            </button>

            <Link
              href="/dashboard"
              style={{ touchAction: 'manipulation' }}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#2D1B0E] text-[#FAF7F2] text-sm font-medium hover:bg-[#C9A96E] transition-all duration-200 active:scale-95"
            >
              Dashboard
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Continue editing */}
          <button
            type="button"
            onClick={() => setSaved(false)}
            style={{ touchAction: 'manipulation' }}
            className="mt-6 text-xs text-[#2D1B0E]/30 hover:text-[#2D1B0E]/60 transition-colors underline underline-offset-2"
          >
            Continuer à éditer
          </button>
        </div>
      )}

      {/* ── Top bar — sticky within main's scroll container ── */}
      <div className="sticky top-0 z-20 bg-[#FAF7F2]/95 backdrop-blur-sm border-b border-[#C9A96E]/10 flex items-center gap-3 px-4 py-3 shrink-0">

        {/* Dashboard link — always visible */}
        <Link
          href="/dashboard"
          className="w-9 h-9 flex items-center justify-center rounded-full text-[#2D1B0E]/40 hover:text-[#2D1B0E] hover:bg-[#2D1B0E]/5 transition-colors shrink-0"
          aria-label="Retour au dashboard"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        {/* Progress segments — Instagram Stories style */}
        <div className="flex-1 flex gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-[3px] rounded-full bg-[#2D1B0E]/10 overflow-hidden"
            >
              <div
                className="h-full rounded-full bg-[#C9A96E] transition-all duration-400"
                style={{ width: i <= step ? '100%' : '0%', opacity: i < step ? 1 : i === step ? 0.8 : 0 }}
              />
            </div>
          ))}
        </div>

        {/* Preview eye icon */}
        <button
          type="button"
          onClick={handlePreview}
          className="w-9 h-9 flex items-center justify-center rounded-full text-[#C9A96E] hover:bg-[#C9A96E]/10 transition-colors shrink-0"
          style={{ touchAction: 'manipulation' }}
          aria-label="Aperçu"
        >
          <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      </div>

      {/* ── Sliding steps strip ── */}
      {/*
        The track is (total * 100)% wide. Each step is (100/total)% of the track = 100% of the
        visible container. translateX shifts the visible window to the current step.
        overflow-x-hidden on the outer <form> clips non-visible steps.
      */}
      <div
        className="flex transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          transform: `translateX(-${step * (100 / total)}%)`,
          width: `${total * 100}%`,
        }}
      >

        {/* ── STEP 0 — Infos ── */}
        <div style={{ width: `${100 / total}%` }} className="min-w-0">
          <div className="px-5 pt-8 pb-40 max-w-lg mx-auto space-y-6">
            <div>
              <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase mb-1.5">
                {step + 1} / {total}
              </p>
              <h2
                className="text-[1.9rem] font-normal text-[#2D1B0E] leading-tight"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Votre histoire
              </h2>
              <p className="text-[#2D1B0E]/40 text-sm mt-1.5">
                Les informations essentielles de votre invitation
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field name="bride" label="Mariée" defaultValue={ed.bride} required placeholder="Sophie" />
              <Field name="groom" label="Marié" defaultValue={ed.groom} required placeholder="Thomas" />
            </div>

            <Field name="date" label="Date du mariage" type="date" defaultValue={ed.date} required />

            <TextareaField
              name="story"
              label="Votre histoire"
              rows={4}
              defaultValue={ed.story}
              placeholder="Comment vous êtes-vous rencontrés ? Partagez un moment…"
            />

            <div>
              <label className="block text-[10px] font-medium text-[#2D1B0E]/40 uppercase tracking-widest mb-2">
                Statut
              </label>
              <select
                name="status"
                defaultValue={status}
                className="w-full px-4 py-3.5 rounded-2xl border border-[#2D1B0E]/10 bg-white text-[#2D1B0E] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 focus:border-[#C9A96E] transition-colors"
              >
                <option value="draft">Brouillon — visible par vous seulement</option>
                <option value="published">Publié — accessible à vos invités</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── STEP 1 — Sections ── */}
        <div style={{ width: `${100 / total}%` }} className="min-w-0">
          <div className="px-5 pt-8 pb-40 max-w-lg mx-auto space-y-6">
            <div>
              <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase mb-1.5">
                2 / {total}
              </p>
              <h2
                className="text-[1.9rem] font-normal text-[#2D1B0E] leading-tight"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Sections
              </h2>
              <p className="text-[#2D1B0E]/40 text-sm mt-1.5">
                Activez et personnalisez chaque bloc de l'invitation
              </p>
            </div>
            <BlocksPanel initialBlocks={currentBlocks} ed={ed} />
          </div>
        </div>

        {/* ── STEP 2 — Thème ── */}
        <div style={{ width: `${100 / total}%` }} className="min-w-0">
          <div className="px-5 pt-8 pb-40 max-w-lg mx-auto space-y-6">
            <div>
              <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase mb-1.5">
                3 / {total}
              </p>
              <h2
                className="text-[1.9rem] font-normal text-[#2D1B0E] leading-tight"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Thème
              </h2>
              <p className="text-[#2D1B0E]/40 text-sm mt-1.5">
                Choisissez l'ambiance visuelle de votre invitation
              </p>
            </div>
            <TemplatePicker currentThemeId={currentTheme} />
          </div>
        </div>

        {/* ── STEP 3 — Musique ── */}
        <div style={{ width: `${100 / total}%` }} className="min-w-0">
          <div className="px-5 pt-8 pb-40 max-w-lg mx-auto space-y-6">
            <div>
              <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase mb-1.5">
                4 / {total}
              </p>
              <h2
                className="text-[1.9rem] font-normal text-[#2D1B0E] leading-tight"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Musique
              </h2>
              <p className="text-[#2D1B0E]/40 text-sm mt-1.5">
                La mélodie qui accompagnera votre invitation
              </p>
            </div>
            <MusicPicker currentMusicId={currentMusic} />
          </div>
        </div>

      </div>

      {/* ── Bottom navigation bar ──
           Mobile:  fixed, 80px from bottom (above MobileBottomNav which reserves pb-20=80px in main)
           Desktop: fixed at bottom-0, starting after the 240px sidebar
      ── */}
      <div className="fixed bottom-20 md:bottom-0 left-0 right-0 md:left-60 z-30 bg-[#FAF7F2]/95 backdrop-blur-sm border-t border-[#C9A96E]/10 px-5 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">

          {/* Précédent — hidden on step 0 but keeps layout stable */}
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              style={{ touchAction: 'manipulation' }}
              className="flex items-center gap-2 px-5 py-3 rounded-full border border-[#2D1B0E]/15 text-[#2D1B0E]/60 text-sm font-medium hover:border-[#2D1B0E]/30 hover:text-[#2D1B0E] transition-all duration-200 active:scale-95"
            >
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Précédent
            </button>
          ) : (
            <span />
          )}

          {/* Suivant / Enregistrer */}
          {step === total - 1 ? (
            <button
              type="button"
              onClick={handleSave}
              disabled={pending}
              className="flex items-center gap-2 px-7 py-3 rounded-full bg-[#2D1B0E] text-[#FAF7F2] text-sm font-medium hover:bg-[#C9A96E] transition-all duration-200 active:scale-95 disabled:opacity-60"
              style={{ touchAction: 'manipulation' }}
            >
              {pending ? 'Enregistrement…' : 'Enregistrer'}
              {!pending && (
                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStep(s => s + 1)}
              className="flex items-center gap-2 px-7 py-3 rounded-full bg-[#2D1B0E] text-[#FAF7F2] text-sm font-medium hover:bg-[#C9A96E] transition-all duration-200 active:scale-95"
              style={{ touchAction: 'manipulation' }}
            >
              Suivant
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>

    </form>
  )
}
