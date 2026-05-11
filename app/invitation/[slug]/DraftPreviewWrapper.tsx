"use client";

import { useState } from "react";
import { TEMPLATES } from "@/lib/templates";
import EnvelopeOpener from "./EnvelopeOpener";
import type { InvitationData } from "./page";

export default function DraftPreviewWrapper({
  invitation,
  invitationId,
  initialThemeId,
}: {
  invitation: InvitationData;
  invitationId: string;
  initialThemeId?: string;
}) {
  const [themeId, setThemeId] = useState(initialThemeId ?? invitation.themeId);

  // Override themeId so EnvelopeOpener picks the selected theme
  const preview = { ...invitation, themeId };

  return (
    <>
      {/* ── Draft banner with theme switcher ─────────────────────── */}
      <div className="fixed top-0 inset-x-0 z-[9999] bg-[#2D1B0E] border-b border-[#C9A96E]/20">
        {/* Row 1: label + edit link */}
        <div className="flex items-center justify-between gap-4 px-4 py-2 text-xs">
          <span className="text-[#FAF7F2]/50">
            <span className="text-[#C9A96E] font-medium">Draft preview</span>
            {" — "}only you can see this
          </span>
          <a
            href={`/dashboard/${invitationId}/edit`}
            className="text-[#C9A96E] underline underline-offset-2 hover:text-[#FAF7F2] transition-colors whitespace-nowrap"
          >
            Edit invitation
          </a>
        </div>

        {/* Row 2: theme chips */}
        <div className="flex items-center gap-2 px-4 pb-2.5 overflow-x-auto scrollbar-none">
          <span className="text-[10px] text-[#FAF7F2]/30 uppercase tracking-widest shrink-0 mr-1">
            Theme
          </span>
          {TEMPLATES.map((t) => {
            const active = themeId === t.id;
            return (
              <button
                key={t.id}
                disabled={t.comingSoon}
                onClick={() => setThemeId(t.id)}
                className={[
                  "relative shrink-0 px-3 py-1 rounded-full text-[11px] font-medium transition-all border",
                  active
                    ? "border-[#C9A96E] text-[#C9A96E] bg-[#C9A96E]/10"
                    : t.comingSoon
                    ? "border-white/10 text-white/20 cursor-not-allowed"
                    : "border-white/20 text-[#FAF7F2]/50 hover:border-[#C9A96E]/50 hover:text-[#FAF7F2]/80",
                ].join(" ")}
              >
                {t.name}
                {t.comingSoon && (
                  <span className="ml-1 text-[9px] opacity-60">soon</span>
                )}
                {active && (
                  <span className="ml-1 text-[#C9A96E]">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* key resets the entire EnvelopeOpener when theme changes */}
      <EnvelopeOpener key={themeId} invitation={preview} />
    </>
  );
}
