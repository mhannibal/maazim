"use client";

import { useEffect, useRef } from "react";
import MusicPlayer from "./MusicPlayer";

type Invitation = {
  couple: { partner1: string; partner2: string };
  date: { display: string; short: string };
  ceremony: { time: string; venue: string; address: string };
  reception: { time: string; venue: string; address: string };
  story: string;
  dressCode: string;
  rsvpDeadline: string;
};

// ── Scroll-reveal hook ──────────────────────────────────────────────────────
function useReveal(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}

// ── Shared reveal wrapper ───────────────────────────────────────────────────
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref);
  return (
    <div
      ref={ref}
      className={`reveal-block ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ── Decorative components ───────────────────────────────────────────────────
function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-6">
      <div className="h-px flex-1 max-w-16 bg-gradient-to-r from-transparent to-[#C9A96E]/60" />
      <svg width="28" height="10" viewBox="0 0 32 12" fill="none">
        <circle cx="16" cy="6" r="2.5" fill="#C9A96E" />
        <circle cx="8" cy="6" r="1.5" fill="#C9A96E" opacity="0.5" />
        <circle cx="24" cy="6" r="1.5" fill="#C9A96E" opacity="0.5" />
        <circle cx="2" cy="6" r="1" fill="#C9A96E" opacity="0.25" />
        <circle cx="30" cy="6" r="1" fill="#C9A96E" opacity="0.25" />
      </svg>
      <div className="h-px flex-1 max-w-16 bg-gradient-to-l from-transparent to-[#C9A96E]/60" />
    </div>
  );
}

function FloralAccent({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 60" fill="none" className={className} aria-hidden="true">
      <path
        d="M60 55 C40 45, 10 35, 5 15 C20 25, 40 30, 60 10 C80 30, 100 25, 115 15 C110 35, 80 45, 60 55Z"
        fill="#C9A96E" opacity="0.18"
      />
      <path
        d="M60 48 C45 40, 22 32, 18 18 C32 26, 48 28, 60 14 C72 28, 88 26, 102 18 C98 32, 75 40, 60 48Z"
        fill="#C9A96E" opacity="0.12"
      />
      <circle cx="60" cy="10" r="2" fill="#C9A96E" opacity="0.4" />
    </svg>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function InvitationScene({
  invitation,
  audioRef,
}: {
  invitation: Invitation;
  audioRef?: React.RefObject<HTMLAudioElement | null>;
}) {
  return (
    <>
      {/* Global reveal animation styles */}
      <style>{`
        .reveal-block {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .reveal-block.revealed {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <div
        className="relative overflow-x-hidden"
        style={{ fontFamily: "var(--font-cormorant)" }}
      >

        {/* ══════════════════════════════════════════
            SECTION 1 — HERO
        ══════════════════════════════════════════ */}
        <section className="relative min-h-[100svh] flex flex-col items-center justify-center text-center px-5 bg-[#FAF7F2] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,_rgba(201,169,110,0.09)_0%,_transparent_70%)]" />
          <FloralAccent className="absolute top-10 left-1/2 -translate-x-1/2 w-36 sm:w-48 rotate-180 opacity-60" />

          <div className="relative z-10 w-full max-w-sm mx-auto px-2">
            <p
              className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase mb-5"
            >
              Together with their families
            </p>

            <h1
              style={{
                fontFamily: "var(--font-great-vibes)",
                fontSize: "clamp(3.2rem, 15vw, 5.5rem)",
                lineHeight: 1.15,
                color: "#2D1B0E",
              }}
            >
              {invitation.couple.partner1}
              <br />
              <span
                style={{
                  fontSize: "0.5em",
                  fontFamily: "var(--font-cormorant)",
                  letterSpacing: "0.35em",
                  color: "#C9A96E",
                }}
              >
                &amp;
              </span>
              <br />
              {invitation.couple.partner2}
            </h1>

            <GoldDivider />

            <p
              className="text-[#2D1B0E]/75 text-sm tracking-[0.15em] uppercase leading-relaxed"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Request the honour of your presence
            </p>

            <p className="mt-3 text-[#2D1B0E]/55 text-sm tracking-wider">
              {invitation.date.display}
            </p>
          </div>

          <FloralAccent className="absolute bottom-14 left-1/2 -translate-x-1/2 w-36 sm:w-48 opacity-60" />

          {/* Scroll cue */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-35">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#2D1B0E]">
              Scroll
            </span>
            <div className="w-px h-6 bg-[#C9A96E] animate-bounce origin-top" />
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 2 — OUR STORY
        ══════════════════════════════════════════ */}
        <section className="relative py-20 px-5 bg-[#2D1B0E] text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,_rgba(201,169,110,0.06)_0%,_transparent_80%)]" />

          <Reveal className="relative z-10 max-w-md mx-auto">
            <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase mb-5">
              Our Story
            </p>
            <blockquote
              style={{
                fontFamily: "var(--font-great-vibes)",
                fontSize: "clamp(1.7rem, 8vw, 2.6rem)",
                lineHeight: 1.55,
                color: "#FAF7F2",
              }}
            >
              "{invitation.story}"
            </blockquote>
            <GoldDivider />
            <p className="text-[#FAF7F2]/35 text-xs tracking-[0.3em] uppercase">
              {invitation.couple.partner1} &amp; {invitation.couple.partner2}
            </p>
          </Reveal>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 3 — EVENT DETAILS
        ══════════════════════════════════════════ */}
        <section className="relative py-20 px-5 bg-[#FAF7F2]">
          <div className="max-w-2xl mx-auto text-center">
            <Reveal>
              <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase mb-2">
                The Celebration
              </p>
              <h2
                className="text-[#2D1B0E] mb-10"
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "clamp(1.6rem, 7vw, 2.4rem)",
                }}
              >
                Join Us
              </h2>
            </Reveal>

            {/* Stacked on mobile, side-by-side on md+ */}
            <div className="flex flex-col md:flex-row gap-5">
              <Reveal className="flex-1" delay={0}>
                <div className="border border-[#C9A96E]/30 rounded-sm p-6 text-center bg-white/60 shadow-sm h-full">
                  <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7 mx-auto mb-4">
                    <path
                      d="M20 4 L22 14 L32 14 L24 20 L27 30 L20 24 L13 30 L16 20 L8 14 L18 14 Z"
                      fill="#C9A96E" opacity="0.6"
                    />
                  </svg>
                  <p className="text-[#C9A96E] text-[10px] tracking-[0.35em] uppercase mb-3">
                    Ceremony
                  </p>
                  <p
                    className="text-[#2D1B0E] text-xl mb-1"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {invitation.ceremony.time}
                  </p>
                  <p className="text-[#2D1B0E] text-base font-medium mb-1">
                    {invitation.ceremony.venue}
                  </p>
                  <p className="text-[#2D1B0E]/45 text-sm leading-snug">
                    {invitation.ceremony.address}
                  </p>
                </div>
              </Reveal>

              <Reveal className="flex-1" delay={150}>
                <div className="border border-[#C9A96E]/30 rounded-sm p-6 text-center bg-white/60 shadow-sm h-full">
                  <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7 mx-auto mb-4">
                    <path d="M8 32 Q20 12 32 32" stroke="#C9A96E" strokeWidth="1.5" fill="none" opacity="0.7" />
                    <circle cx="20" cy="18" r="3" fill="#C9A96E" opacity="0.5" />
                    <line x1="20" y1="21" x2="20" y2="32" stroke="#C9A96E" strokeWidth="1.5" opacity="0.7" />
                  </svg>
                  <p className="text-[#C9A96E] text-[10px] tracking-[0.35em] uppercase mb-3">
                    Reception
                  </p>
                  <p
                    className="text-[#2D1B0E] text-xl mb-1"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {invitation.reception.time}
                  </p>
                  <p className="text-[#2D1B0E] text-base font-medium mb-1">
                    {invitation.reception.venue}
                  </p>
                  <p className="text-[#2D1B0E]/45 text-sm leading-snug">
                    {invitation.reception.address}
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 4 — DRESS CODE
        ══════════════════════════════════════════ */}
        <section className="py-16 px-5 bg-[#F5EFE4] text-center">
          <Reveal className="max-w-xs mx-auto">
            <GoldDivider />
            <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase mb-3">
              Dress Code
            </p>
            <p
              className="text-[#2D1B0E]"
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(1.5rem, 6vw, 2rem)",
              }}
            >
              {invitation.dressCode}
            </p>
            <GoldDivider />
          </Reveal>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 5 — RSVP
        ══════════════════════════════════════════ */}
        <section className="relative py-24 px-5 bg-[#2D1B0E] text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,_rgba(201,169,110,0.07)_0%,_transparent_80%)]" />
          <FloralAccent className="absolute top-6 left-1/2 -translate-x-1/2 w-44 rotate-180 opacity-40" />

          <Reveal className="relative z-10 max-w-sm mx-auto">
            <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase mb-5">
              Kindly Reply By {invitation.rsvpDeadline}
            </p>
            <h2
              style={{
                fontFamily: "var(--font-great-vibes)",
                fontSize: "clamp(2.4rem, 12vw, 3.8rem)",
                color: "#FAF7F2",
                lineHeight: 1.2,
              }}
            >
              Will you join us?
            </h2>
            <p className="mt-3 text-[#FAF7F2]/45 text-sm tracking-wider mb-8 leading-relaxed">
              We would be honoured to share this moment with you.
            </p>

            {/* Full-width buttons on mobile, inline on sm+ */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <button
                className="w-full sm:w-auto px-8 py-3.5 border border-[#C9A96E] text-[#C9A96E] text-xs tracking-[0.2em] uppercase hover:bg-[#C9A96E] hover:text-[#2D1B0E] active:scale-95 transition-all duration-300 rounded-sm"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Joyfully Accept
              </button>
              <button
                className="w-full sm:w-auto px-8 py-3.5 border border-[#FAF7F2]/20 text-[#FAF7F2]/45 text-xs tracking-[0.2em] uppercase hover:border-[#FAF7F2]/50 hover:text-[#FAF7F2]/75 active:scale-95 transition-all duration-300 rounded-sm"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Regretfully Decline
              </button>
            </div>
          </Reveal>

          <FloralAccent className="absolute bottom-6 left-1/2 -translate-x-1/2 w-44 opacity-40" />

          {/* Footer signature */}
          <div className="relative z-10 mt-20 text-center">
            <p
              style={{
                fontFamily: "var(--font-great-vibes)",
                fontSize: "1.8rem",
                color: "#C9A96E",
                opacity: 0.55,
              }}
            >
              {invitation.couple.partner1} &amp; {invitation.couple.partner2}
            </p>
            <p className="text-[#FAF7F2]/20 text-[10px] tracking-[0.3em] uppercase mt-2">
              {invitation.date.short}
            </p>
          </div>
        </section>

        {/* Floating music player */}
        <MusicPlayer audioRef={audioRef} />
      </div>
    </>
  );
}
