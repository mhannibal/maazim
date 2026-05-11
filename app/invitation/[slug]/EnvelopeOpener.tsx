"use client";

import { useRef, useState, useEffect } from "react";
import InvitationScene from "./InvitationScene";
import { getTemplate } from "@/lib/templates";
import { getTrack } from "@/lib/music";
import type { Blocks } from "@/lib/blocks";

type Invitation = {
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

export default function EnvelopeOpener({
  invitation,
}: {
  invitation: Invitation;
}) {
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const template = getTemplate(invitation.themeId);
  const track = getTrack(invitation.musicId);

  useEffect(() => {
    audioRef.current = new Audio(track.src);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;
    return () => { audioRef.current?.pause(); };
  }, [track.src]);

  const handleTapToStart = () => {
    setStarted(true);
    videoRef.current?.play();
    audioRef.current?.play().catch(() => {});
  };

  const handleEnd = () => setDone(true);

  const handleSkip = () => {
    videoRef.current?.pause();
    setDone(true);
  };

  return (
    <div className="relative bg-[#0a0704] min-h-screen">
      {/* ── Full-screen video intro ── */}
      {!done && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <div className="relative w-full max-w-[430px] h-full">
          <video
            ref={videoRef}
            src={template.video}
            playsInline
            muted
            onEnded={handleEnd}
            className="w-full h-full object-cover"
          />

          {/* Subtle edge fade */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

          {/* Tap to start — visible until the user taps */}
          {!started && (
            <button
              onClick={handleTapToStart}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 w-full"
              aria-label="Tap to start"
            >
              {/* Pulsing ring */}
              <span className="relative flex items-center justify-center">
                <span className="absolute inline-flex h-16 w-16 rounded-full bg-white/10 animate-ping" />
                <span className="relative inline-flex items-center justify-center h-14 w-14 rounded-full border border-white/40 bg-white/10 backdrop-blur-sm">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M4 2 L16 9 L4 16 Z" fill="white" opacity="0.9" />
                  </svg>
                </span>
              </span>
              <span
                className="text-white/70 text-sm tracking-[0.35em] uppercase"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Tap to start
              </span>
            </button>
          )}

          {/* Skip button — visible only after video has started */}
          {started && (
            <button
              onClick={handleSkip}
              className="absolute bottom-8 right-5 flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 bg-black/30 backdrop-blur-sm text-white/70 text-xs tracking-[0.2em] uppercase transition-all duration-200 hover:border-white/60 hover:text-white active:scale-95"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Skip
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 2 L10 7 L3 12 Z" fill="currentColor" opacity="0.8" />
                <rect x="10" y="2" width="1.5" height="10" rx="0.75" fill="currentColor" opacity="0.8" />
              </svg>
            </button>
          )}
          </div>
        </div>
      )}

      {/* ── Invitation content ── */}
      <div
        className="transition-opacity duration-700"
        style={{ opacity: done ? 1 : 0, pointerEvents: done ? "auto" : "none" }}
      >
        <InvitationScene invitation={invitation} audioRef={audioRef} />
      </div>
    </div>
  );
}
