"use client";

import { forwardRef } from "react";

type Props = {
  title: string;
  eulogy: string;
  epitaph: string;
};

export const MemorialCard = forwardRef<HTMLDivElement, Props>(function MemorialCard(
  { title, eulogy, epitaph },
  ref
) {
  return (
    <div
      ref={ref}
      style={{ width: 1080, height: 1350 }}
      className="relative overflow-hidden flex flex-col"
    >
      {/* parchment-on-night background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(700px 400px at 50% 20%, rgba(212,175,55,0.10), transparent 70%), linear-gradient(180deg, #0a0a0d 0%, #14141a 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.7'/></svg>\")",
        }}
      />

      {/* gold ornamental border */}
      <div
        className="absolute"
        style={{
          inset: 60,
          border: "1px solid rgba(212,175,55,0.35)",
          borderRadius: 12,
        }}
      />
      <div
        className="absolute"
        style={{
          inset: 70,
          border: "1px solid rgba(212,175,55,0.18)",
          borderRadius: 8,
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col justify-between px-32 py-32 text-center">
        <div>
          <div
            className="font-mono uppercase text-accent"
            style={{ fontSize: 22, letterSpacing: "0.5em", marginBottom: 24 }}
          >
            in memoriam
          </div>
          <h2
            className="font-display italic text-ink"
            style={{ fontSize: 80, lineHeight: 1.1, fontWeight: 500 }}
          >
            {title}
          </h2>
        </div>

        <p
          className="font-display text-ink mx-auto"
          style={{
            fontSize: 38,
            lineHeight: 1.55,
            fontWeight: 400,
            maxWidth: 800,
          }}
        >
          {eulogy}
        </p>

        <div>
          <div
            className="mx-auto"
            style={{
              width: 120,
              height: 1,
              background: "rgba(212,175,55,0.5)",
              marginBottom: 24,
            }}
          />
          <p
            className="font-display italic text-accent-2"
            style={{ fontSize: 28 }}
          >
            “{epitaph}”
          </p>
          <div
            className="font-mono text-ink-dim mt-8"
            style={{ fontSize: 18, letterSpacing: "0.3em" }}
          >
            🕯️ EULOGY-FOR-AN-ERA
          </div>
        </div>
      </div>
    </div>
  );
});
