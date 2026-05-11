export type BlockId =
  | 'countdown'
  | 'date'
  | 'lieu'
  | 'programme'
  | 'menu'
  | 'cadeaux'
  | 'hebergement'
  | 'dress_code'
  | 'rsvp'

export type Blocks = Record<BlockId, boolean>

/** Shown by default when a user has no saved blocks yet */
export const BLOCK_DEFAULTS: Blocks = {
  countdown: true,
  date: true,
  lieu: true,
  programme: false,
  menu: false,
  cadeaux: false,
  hebergement: false,
  dress_code: true,
  rsvp: true,
}

export const BLOCK_LABELS: Record<BlockId, string> = {
  countdown: 'Compte à rebours',
  date: 'Date',
  lieu: 'Lieu',
  programme: 'Programme',
  menu: 'Menu',
  cadeaux: 'Liste de cadeaux',
  hebergement: 'Hébergement',
  dress_code: 'Dress code',
  rsvp: 'RSVP',
}

export const BLOCK_ORDER: BlockId[] = [
  'countdown',
  'date',
  'lieu',
  'programme',
  'menu',
  'cadeaux',
  'hebergement',
  'dress_code',
  'rsvp',
]

/** Which blocks have additional content fields in the edit form */
export const BLOCKS_WITH_FIELDS = new Set<BlockId>([
  'lieu',
  'programme',
  'menu',
  'cadeaux',
  'hebergement',
  'dress_code',
  'rsvp',
])

export function parseBlocks(raw: unknown): Blocks {
  const defaults = { ...BLOCK_DEFAULTS }
  if (!raw || typeof raw !== 'object') return defaults
  const obj = raw as Record<string, unknown>
  for (const key of Object.keys(defaults) as BlockId[]) {
    if (typeof obj[key] === 'boolean') {
      defaults[key] = obj[key] as boolean
    }
  }
  return defaults
}
