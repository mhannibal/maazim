import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { updateInvitationAction } from './actions'
import { EditWizard } from './EditWizard'
import { parseBlocks } from '@/lib/blocks'

export default async function EditInvitationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in')

  const { data: invitation } = await supabase
    .from('invitations')
    .select('id, slug, status, theme_id, music_id, blocks, event_details')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!invitation) notFound()

  const ed = invitation.event_details as Record<string, string | undefined>

  const currentTheme = invitation.theme_id ?? 'champagne'
  const currentMusic = invitation.music_id ?? 'anichmenk10'
  const currentBlocks = parseBlocks(invitation.blocks)
  const updateAction = updateInvitationAction.bind(null, id)

  return (
    <EditWizard
      slug={invitation.slug}
      status={invitation.status}
      currentTheme={currentTheme}
      currentMusic={currentMusic}
      currentBlocks={currentBlocks}
      ed={ed}
      action={updateAction}
    />
  )
}
