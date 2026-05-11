'use client'

import { useState } from 'react'
import {
  BLOCK_ORDER,
  BLOCK_LABELS,
  BLOCKS_WITH_FIELDS,
  BLOCK_DEFAULTS,
  parseBlocks,
  type Blocks,
  type BlockId,
} from '@/lib/blocks'
import Countdown from '@/app/invitation/[slug]/Countdown'

// ── Field helpers (server-safe, no deps) ────────────────────────────────────
function Field({
  name,
  label,
  defaultValue,
  placeholder,
  type = 'text',
}: {
  name: string
  label: string
  defaultValue?: string
  placeholder?: string
  type?: string
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs font-medium text-[#2D1B0E]/50 mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ''}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-lg border border-[#C9A96E]/30 bg-[#FAF7F2] text-[#2D1B0E] text-sm placeholder:text-[#2D1B0E]/25 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40 focus:border-[#C9A96E] transition-colors"
      />
    </div>
  )
}

function TextareaField({
  name,
  label,
  defaultValue,
  placeholder,
  rows = 3,
}: {
  name: string
  label: string
  defaultValue?: string
  placeholder?: string
  rows?: number
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs font-medium text-[#2D1B0E]/50 mb-1">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue ?? ''}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-lg border border-[#C9A96E]/30 bg-[#FAF7F2] text-[#2D1B0E] text-sm placeholder:text-[#2D1B0E]/25 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40 focus:border-[#C9A96E] transition-colors resize-none"
      />
    </div>
  )
}

// ── Block content fields ─────────────────────────────────────────────────────
function BlockFields({
  blockId,
  ed,
}: {
  blockId: BlockId
  ed: Record<string, string | undefined>
}) {
  if (blockId === 'lieu') {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field name="venue" label="Nom du lieu" defaultValue={ed.venue} placeholder="Château de Versailles" />
          <Field name="city" label="Ville" defaultValue={ed.city} placeholder="Versailles" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field name="ceremony_time" label="Heure cérémonie" defaultValue={ed.ceremony_time} placeholder="16h00" />
          <Field name="ceremony_address" label="Adresse cérémonie" defaultValue={ed.ceremony_address} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field name="reception_time" label="Heure réception" defaultValue={ed.reception_time} placeholder="19h30" />
          <Field name="reception_venue" label="Lieu réception" defaultValue={ed.reception_venue} />
        </div>
        <Field name="reception_address" label="Adresse réception" defaultValue={ed.reception_address} />
      </div>
    )
  }
  if (blockId === 'programme') {
    return (
      <TextareaField
        name="programme_content"
        label="Programme"
        rows={5}
        defaultValue={ed.programme_content}
        placeholder={"16h00 — Cérémonie\n17h00 — Vin d'honneur\n19h30 — Dîner\n23h00 — Soirée dansante"}
      />
    )
  }
  if (blockId === 'menu') {
    return (
      <TextareaField
        name="menu_content"
        label="Menu"
        rows={5}
        defaultValue={ed.menu_content}
        placeholder={"Entrée : Velouté de butternut\nPlat : Filet de bœuf\nDessert : Pièce montée"}
      />
    )
  }
  if (blockId === 'cadeaux') {
    return (
      <TextareaField
        name="gifts_content"
        label="Liste de cadeaux"
        rows={3}
        defaultValue={ed.gifts_content}
        placeholder="Lien vers la liste, ou instructions pour vos invités…"
      />
    )
  }
  if (blockId === 'hebergement') {
    return (
      <TextareaField
        name="accommodation_content"
        label="Hébergement"
        rows={4}
        defaultValue={ed.accommodation_content}
        placeholder={"Hôtel Le Grand — 2 min à pied\nCode promo MARIAGE2026\nTél. : 01 23 45 67 89"}
      />
    )
  }
  if (blockId === 'dress_code') {
    return (
      <Field
        name="dress_code"
        label="Dress code"
        defaultValue={ed.dress_code}
        placeholder="Black Tie, Cocktail, Bohème…"
      />
    )
  }
  if (blockId === 'rsvp') {
    return (
      <Field
        name="rsvp_deadline"
        label="Date limite RSVP"
        defaultValue={ed.rsvp_deadline}
        placeholder="1er juin 2026"
      />
    )
  }
  return null
}

// ── Block preview (countdown + date) ────────────────────────────────────────
function BlockPreview({
  blockId,
  dateIso,
}: {
  blockId: BlockId
  dateIso?: string
}) {
  const noDate = (
    <p className="text-xs text-[#2D1B0E]/30 italic text-center">
      Définissez la date dans l'étape <span className="not-italic font-medium">Infos</span>
    </p>
  )

  if (blockId === 'date') {
    if (!dateIso) return <div className="py-5">{noDate}</div>
    const display = new Date(dateIso).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    return (
      <div className="flex items-center justify-center py-5">
        <p
          className="text-[#2D1B0E]/60 text-sm tracking-wider capitalize"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {display}
        </p>
      </div>
    )
  }

  if (blockId === 'countdown') {
    if (!dateIso) return <div className="py-5">{noDate}</div>
    return (
      <div className="flex justify-center py-1 origin-top" style={{ transform: 'scale(0.85)' }}>
        <Countdown targetIso={dateIso} />
      </div>
    )
  }

  return null
}

// ── Main component ───────────────────────────────────────────────────────────
export function BlocksPanel({
  initialBlocks,
  ed,
}: {
  initialBlocks: Blocks
  ed: Record<string, string | undefined>
}) {
  const [blocks, setBlocks] = useState<Blocks>(() => parseBlocks(initialBlocks))
  const [expanded, setExpanded] = useState<BlockId | null>(null)

  const toggle = (id: BlockId) => {
    setBlocks((prev) => ({ ...prev, [id]: !prev[id] }))
    // If turning off a currently-expanded block, collapse it
    if (expanded === id && blocks[id]) setExpanded(null)
  }

  const toggleExpand = (id: BlockId) => {
    setExpanded((prev) => (prev === id ? null : id))
  }

  const canExpand = (id: BlockId) => BLOCKS_WITH_FIELDS.has(id)

  return (
    <div>
      {/* Hidden input carries block state as JSON */}
      <input type="hidden" name="blocks_json" value={JSON.stringify(blocks)} />

      <p className="text-xs font-medium text-[#2D1B0E]/40 uppercase tracking-widest mb-3">
        Sections
      </p>

      <div className="divide-y divide-[#C9A96E]/10 border border-[#C9A96E]/15 rounded-xl overflow-hidden">
        {BLOCK_ORDER.map((id) => {
          const isOn = blocks[id]
          const isExpanded = expanded === id
          const expandable = canExpand(id)
          const isPreviewBlock = id === 'date' || id === 'countdown'

          return (
            <div key={id} className="bg-white/50">
              {/* Row header */}
              <div className="flex items-center gap-3 px-3 py-3">
                {/* Toggle switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={isOn}
                  onClick={() => toggle(id)}
                  style={{ touchAction: 'manipulation' }}
                  className={[
                    'relative shrink-0 w-9 h-5 rounded-full transition-colors duration-200',
                    isOn ? 'bg-[#C9A96E]' : 'bg-[#2D1B0E]/15',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
                      isOn ? 'translate-x-4' : 'translate-x-0',
                    ].join(' ')}
                  />
                </button>

                {/* Label — tapping expands if there are editable fields */}
                <span
                  className={[
                    'flex-1 text-sm transition-colors',
                    isOn ? 'text-[#2D1B0E]' : 'text-[#2D1B0E]/35',
                    expandable ? 'cursor-pointer select-none' : '',
                  ].join(' ')}
                  onClick={() => expandable && toggleExpand(id)}
                >
                  {BLOCK_LABELS[id]}
                </span>

                {/* Chevron — only for blocks with editable fields */}
                {expandable && (
                  <button
                    type="button"
                    onClick={() => toggleExpand(id)}
                    style={{ touchAction: 'manipulation' }}
                    className="shrink-0 p-1 text-[#2D1B0E]/30 hover:text-[#C9A96E] transition-colors"
                    aria-label={isExpanded ? 'Réduire' : 'Modifier'}
                  >
                    <svg
                      className={[
                        'w-4 h-4 transition-transform duration-200',
                        isExpanded ? 'rotate-180' : '',
                      ].join(' ')}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Inline preview — always visible when block is on (date / countdown) */}
              {isPreviewBlock && isOn && (
                <div className="px-3 pb-4 border-t border-[#C9A96E]/10 bg-[#FAF7F2]/60">
                  <BlockPreview blockId={id} dateIso={ed.date} />
                </div>
              )}

              {/* Accordion fields — editable blocks only */}
              {expandable && isExpanded && (
                <div className="px-3 pb-4 pt-1 border-t border-[#C9A96E]/10 bg-[#FAF7F2]/60">
                  <BlockFields blockId={id} ed={ed} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
