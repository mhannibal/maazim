"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function MusicPlayer({
  audioRef: externalAudioRef,
}: {
  audioRef?: React.RefObject<HTMLAudioElement | null>;
}) {
  const [playing, setPlaying] = useState(false);
  const internalAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioRef = externalAudioRef ?? internalAudioRef;
  const barsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const barAnimations = useRef<gsap.core.Tween[]>([]);

  useEffect(() => {
    // Only create a new Audio instance if no external one was provided
    if (!externalAudioRef) {
      internalAudioRef.current = new Audio("/anichmenk10.mp3");
      internalAudioRef.current.loop = true;
      internalAudioRef.current.volume = 0.4;
    }
    return () => { internalAudioRef.current?.pause(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync playing state with the external audio (already started on tap)
  useEffect(() => {
    if (externalAudioRef?.current) {
      setPlaying(true);
    }
  }, [externalAudioRef]);

  // Animate sound-wave bars when playing
  useGSAP(
    () => {
      if (!barsRef.current) return;
      const bars = barsRef.current.querySelectorAll<HTMLElement>("[data-bar]");

      barAnimations.current.forEach((t) => t.kill());
      barAnimations.current = [];

      if (playing) {
        bars.forEach((bar, i) => {
          const tween = gsap.to(bar, {
            scaleY: gsap.utils.random(0.3, 1.4),
            duration: gsap.utils.random(0.3, 0.6),
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            delay: i * 0.07,
          });
          barAnimations.current.push(tween);
        });
      } else {
        bars.forEach((bar) => {
          gsap.to(bar, { scaleY: 0.3, duration: 0.3, ease: "power2.out" });
        });
      }
    },
    { dependencies: [playing] }
  );

  const toggle = async () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setPlaying(true);
      } catch {
        // Autoplay blocked — silently ignored; user must interact first
        setPlaying(false);
      }
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={toggle}
      aria-label={playing ? "Pause music" : "Play ambient music"}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-full shadow-lg border backdrop-blur-sm transition-colors duration-300"
      style={{
        background: "rgba(45, 27, 14, 0.85)",
        borderColor: "rgba(201, 169, 110, 0.4)",
        fontFamily: "var(--font-cormorant)",
      }}
    >
      {/* Sound wave bars */}
      <div
        ref={barsRef}
        className="flex items-end gap-[3px]"
        style={{ height: 18 }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            data-bar
            style={{
              width: 3,
              height: 18,
              background: "#C9A96E",
              borderRadius: 2,
              transformOrigin: "bottom",
              transform: "scaleY(0.3)",
            }}
          />
        ))}
      </div>

      {/* Label */}
      <span
        className="text-xs tracking-[0.2em] uppercase text-[#C9A96E]"
        style={{ fontFamily: "var(--font-cormorant)" }}
      >
        {playing ? "Music" : "Music"}
      </span>

      {/* Play / Pause icon */}
      <span className="text-[#C9A96E] opacity-70 text-xs">
        {playing ? (
          // Pause icon
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="1" y="1" width="4" height="10" rx="1" fill="#C9A96E" />
            <rect x="7" y="1" width="4" height="10" rx="1" fill="#C9A96E" />
          </svg>
        ) : (
          // Play icon
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 1 L11 6 L2 11 Z" fill="#C9A96E" />
          </svg>
        )}
      </span>
    </button>
  );
}
