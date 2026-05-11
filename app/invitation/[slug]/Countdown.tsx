"use client";

import { useEffect, useState } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  passed: boolean;
};

function compute(targetIso: string): TimeLeft {
  const diff = new Date(targetIso).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };
  const total = Math.floor(diff / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    passed: false,
  };
}

function Pad({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-sm border border-[#C9A96E]/25 bg-white/50 backdrop-blur-sm shadow-sm"
      >
        {/* subtle inner glow */}
        <div className="absolute inset-0 rounded-sm bg-gradient-to-b from-[#C9A96E]/5 to-transparent pointer-events-none" />
        <span
          className="relative text-2xl sm:text-3xl text-[#2D1B0E] tabular-nums"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[9px] sm:text-[10px] tracking-[0.35em] uppercase text-[#2D1B0E]/40">
        {label}
      </span>
    </div>
  );
}

function Colon() {
  return (
    <span className="text-[#C9A96E]/50 text-xl mb-6 select-none" aria-hidden>
      :
    </span>
  );
}

export default function Countdown({ targetIso }: { targetIso: string }) {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    if (!targetIso) return;
    setTime(compute(targetIso));
    const id = setInterval(() => setTime(compute(targetIso)), 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  // Don't render on server or when no date
  if (!targetIso || !time) return null;

  if (time.passed) {
    return (
      <p
        className="mt-5 text-[#C9A96E] text-sm tracking-[0.25em] uppercase opacity-70"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        The day has arrived
      </p>
    );
  }

  return (
    <div className="mt-6 flex flex-col items-center gap-3">
      <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A96E]/70">
        Compte à rebours
      </p>
      <div className="flex items-end gap-2 sm:gap-3">
        <Pad value={time.days} label="Days" />
        <Colon />
        <Pad value={time.hours} label="Hours" />
        <Colon />
        <Pad value={time.minutes} label="Minutes" />
        <Colon />
        <Pad value={time.seconds} label="Seconds" />
      </div>
    </div>
  );
}
