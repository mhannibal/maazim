export type Template = {
  id: string
  name: string
  description: string
  video: string
  audio: string
  comingSoon?: boolean
}

export const TEMPLATES: Template[] = [
  {
    id: 'champagne',
    name: 'Champagne',
    description: 'Warm candlelight tones, golden haze',
    video: '/letterinvit1.mp4',
    audio: '/anichmenk10.mp3',
  },
  {
    id: 'garden',
    name: 'Garden',
    description: 'Soft daylight, floral drifts',
    video: '/letterinvit2.mp4',
    audio: '/anichmenk10.mp3',
    comingSoon: false,
  },
  {
    id: 'baroque',
    name: 'Baroque',
    description: 'Deep shadows, opulent grandeur',
    video: '/letterinvit3.mp4',
    audio: '/anichmenk10.mp3',
    comingSoon: false,
  },
  {
    id: 'coastal',
    name: 'Coastal',
    description: 'Sea breeze, sun-bleached linen',
    video: '/letterinvit1.mp4',
    audio: '/anichmenk10.mp3',
    comingSoon: true,
  },
]

export function getTemplate(id: string): Template {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0]
}
