import type { Metadata } from "next";
import EnvelopeOpener from "./EnvelopeOpener";

// Hardcoded sample data for the demo
const SAMPLE_INVITATION = {
  slug: "meriem-mounir",
  couple: {
    partner1: "Meriem",
    partner2: "Mounir",
  },
  date: {
    display: "Saturday, the 27th of September 2026",
    short: "27.09.2026",
  },
  ceremony: {
    time: "4:00 PM",
    venue: "Salle Benflis",
    address: "50 Rue de la Liberté, Batna",
  },
  reception: {
    time: "6:30 PM",
    venue: "Salle Benflis",
    address: "50 Rue de la Liberté, Batna",
  },
  story:
    "Their story began on a quiet autumn afternoon in Fisdis, over a shared umbrella and a coffee that lasted three hours. Two years later, they've never stopped talking.",
  dressCode: "Black Tie",
  rsvpDeadline: "1st June 2026",
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const invitation = SAMPLE_INVITATION;

  if (invitation.slug !== slug) {
    return { title: "Invitation Not Found" };
  }

  return {
    title: `${invitation.couple.partner1} & ${invitation.couple.partner2} — You're Invited`,
    description: `Join us to celebrate the wedding of ${invitation.couple.partner1} & ${invitation.couple.partner2} on ${invitation.date.display}.`,
  };
}

export default async function InvitationPage({ params }: Props) {
  const { slug } = await params;

  // In production this would be a DB lookup
  if (SAMPLE_INVITATION.slug !== slug) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <p className="font-cormorant text-2xl text-[#2D1B0E]/50">
          Invitation not found.
        </p>
      </main>
    );
  }

  return <EnvelopeOpener invitation={SAMPLE_INVITATION} />;
}
