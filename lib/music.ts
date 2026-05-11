export type Track = {
  id: string
  title: string
  artist: string
  src: string
  /** approximate duration, e.g. "3:24" */
  duration?: string
  comingSoon?: boolean
}

export const TRACKS: Track[] = [
  {
    id: 'anichmenk10',
    title: 'A Thousand Years',
    artist: 'Instrumental',
    src: '/anichmenk10.mp3',
    duration: '4:45',
  },
  {
    id: 'track2',
    title: 'Canon in D',
    artist: 'Instrumental',
    src: '/music/track2.mp3',
    duration: '3:30',
    comingSoon: true,
  },
  {
    id: 'track3',
    title: 'Perfect',
    artist: 'Instrumental',
    src: '/music/track3.mp3',
    duration: '4:20',
    comingSoon: true,
  },
  {
    id: 'track4',
    title: 'Marry Me',
    artist: 'Instrumental',
    src: '/music/track4.mp3',
    duration: '3:50',
    comingSoon: true,
  },
]

export function getTrack(id: string): Track {
  return TRACKS.find((t) => t.id === id) ?? TRACKS[0]
}
