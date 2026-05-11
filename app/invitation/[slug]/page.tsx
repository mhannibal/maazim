import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EnvelopeOpener from "./EnvelopeOpener";
import DraftPreviewWrapper from "./DraftPreviewWrapper";
import { parseBlocks, type Blocks } from "@/lib/blocks";

// Shape stored in event_details JSONB
type EventDetails = {
  bride?: string;
  groom?: string;
  date?: string;
  venue?: string;
  city?: string;
  ceremony_time?: string;
  ceremony_address?: string;
  reception_time?: string;
  reception_venue?: string;
  reception_address?: string;
  story?: string;
  dress_code?: string;
  rsvp_deadline?: string;
  programme_content?: string;
  menu_content?: string;
  gifts_content?: string;
  accommodation_content?: string;
};

// Shape EnvelopeOpener / InvitationScene expect
export type InvitationData = {
  id: string;
  slug: string;
  themeId: string;
  musicId: string;
  blocks: Blocks;
  couple: { partner1: string; partner2: string };
  date: { display: string; short: string; iso: string };
  ceremony: { time: string; venue: string; address: string };
  reception: { time: string; venue: string; address: string };
  story: string;
  dressCode: string;
  rsvpDeadline: string;
  programmeContent: string;
  menuContent: string;
  giftsContent: string;
  accommodationContent: string;
};

function buildInvitationData(
  id: string,
  slug: string,
  themeId: string,
  musicId: string,
  blocks: Blocks,
  ed: EventDetails,
): InvitationData {
  const partner1 = ed.bride ?? "Partner 1";
  const partner2 = ed.groom ?? "Partner 2";

  const rawDate = ed.date ? new Date(ed.date) : null;
  const displayDate = rawDate
    ? rawDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date TBD";
  const shortDate = rawDate
    ? rawDate.toLocaleDateString("en-GB").replace(/\//g, ".")
    : "";

  const venueName = ed.venue ?? "Venue TBD";
  const venueAddress = ed.city ?? "";

  return {
    id,
    slug,
    themeId,
    musicId,
    blocks,
    couple: { partner1, partner2 },
    date: { display: displayDate, short: shortDate, iso: ed.date ?? '' },
    ceremony: {
      time: ed.ceremony_time ?? "Time TBD",
      venue: venueName,
      address: ed.ceremony_address ?? venueAddress,
    },
    reception: {
      time: ed.reception_time ?? "Time TBD",
      venue: ed.reception_venue ?? venueName,
      address: ed.reception_address ?? venueAddress,
    },
    story:
      ed.story ??
      `${partner1} and ${partner2} invite you to celebrate their special day.`,
    dressCode: ed.dress_code ?? "Smart Casual",
    rsvpDeadline: ed.rsvp_deadline ?? "",
    programmeContent: ed.programme_content ?? "",
    menuContent: ed.menu_content ?? "",
    giftsContent: ed.gifts_content ?? "",
    accommodationContent: ed.accommodation_content ?? "",
  };
}

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ theme?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("invitations")
    .select("event_details, status")
    .eq("slug", slug)
    .maybeSingle();

  if (!data) return { title: "Invitation Not Found" };

  if (data.status !== "published") {
    return { title: "Draft Invitation", robots: { index: false, follow: false } };
  }

  const ed = data.event_details as EventDetails;
  const p1 = ed.bride ?? "Partner 1";
  const p2 = ed.groom ?? "Partner 2";
  return {
    title: `${p1} & ${p2} — You're Invited`,
    description: `Join us to celebrate the wedding of ${p1} & ${p2}.`,
  };
}

export default async function InvitationPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { theme: themeOverride } = await searchParams;
  const supabase = await createClient();

  const { data } = await supabase
    .from("invitations")
    .select("id, slug, event_details, status, user_id, theme_id, music_id, blocks")
    .eq("slug", slug)
    .maybeSingle();

  if (!data) notFound();

  // Drafts are only visible to the owner
  if (data.status !== "published") {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id !== data.user_id) notFound();
  }

  const isDraft = data.status !== "published";
  // ?theme= override from edit page preview link (only respected for owners in draft mode)
  const resolvedTheme = (isDraft && themeOverride) ? themeOverride : (data.theme_id ?? 'champagne');
  const resolvedMusic = data.music_id ?? 'anichmenk10';
  const resolvedBlocks = parseBlocks(data.blocks);
  const invitation = buildInvitationData(
    data.id,
    data.slug,
    resolvedTheme,
    resolvedMusic,
    resolvedBlocks,
    data.event_details as EventDetails,
  );

  if (isDraft) {
    return (
      <DraftPreviewWrapper invitation={invitation} invitationId={data.id} initialThemeId={resolvedTheme} />
    );
  }

  return <EnvelopeOpener invitation={invitation} />;
}

