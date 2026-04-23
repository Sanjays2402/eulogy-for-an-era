"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, RefreshCw, Share2, Flame } from "lucide-react";
import { toPng } from "html-to-image";
import { MemorialCard } from "@/components/memorial-card";

type Eulogy = { title: string; eulogy: string; epitaph: string };

export default function Home() {
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [eulogy, setEulogy] = useState<Eulogy | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!subject.trim() || loading) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/eulogy", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ subject }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "Something broke.");
      else setEulogy(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setEulogy(null);
    setError(null);
    setSubject("");
  };

  const download = async () => {
    if (!cardRef.current) return;
    const png = await toPng(cardRef.current, { pixelRatio: 1, cacheBust: true });
    const a = document.createElement("a");
    a.href = png;
    a.download = `eulogy-${Date.now()}.png`;
    a.click();
  };

  const share = async () => {
    if (!eulogy) return;
    const text = `“${eulogy.epitaph}” — Eulogy for an Era`;
    if (navigator.share) {
      try {
        await navigator.share({ title: eulogy.title, text });
        return;
      } catch {
        /* fall through */
      }
    }
    await navigator.clipboard.writeText(text);
    alert("Epitaph copied");
  };

  return (
    <main className="flex-1 flex flex-col">
      <header className="px-6 pt-12 sm:pt-20 pb-2 text-center">
        <div className="inline-flex items-center gap-2 mb-6 text-xs font-mono text-accent uppercase tracking-[0.4em]">
          <Flame className="h-3 w-3" />
          in memoriam
        </div>
        <h1 className="text-4xl sm:text-6xl tracking-tight text-ink">
          Say{" "}
          <span className="font-display italic font-medium text-accent-2">
            goodbye
          </span>{" "}
          properly.
        </h1>
        <p className="mt-4 text-ink-dim max-w-md mx-auto">
          Name a person, place, or chapter. We&rsquo;ll write the eulogy.
        </p>
      </header>

      <section className="flex-1 px-6 py-12">
        <AnimatePresence mode="wait">
          {!eulogy ? (
            <motion.form
              key="input"
              onSubmit={submit}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-xl mx-auto"
            >
              <textarea
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="my San Francisco years…"
                rows={3}
                maxLength={200}
                className="w-full bg-bg-2/60 border border-ink-dim/20 rounded-2xl px-6 py-5 text-ink placeholder-ink-dim font-display italic text-xl focus:border-accent/50 focus:outline-none resize-none"
              />
              <div className="mt-2 text-right text-xs text-ink-dim">
                {subject.length}/200
              </div>
              <div className="mt-6 flex justify-center">
                <button
                  type="submit"
                  disabled={!subject.trim() || loading}
                  className="px-8 py-3 rounded-xl bg-accent text-bg font-semibold hover:bg-accent-2 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? "Mourning…" : "Write the eulogy"}
                </button>
              </div>
              {error && (
                <p className="mt-4 text-center text-sm text-rust">{error}</p>
              )}
            </motion.form>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-xl mx-auto"
            >
              <div className="rounded-2xl border border-accent/25 bg-bg-2/50 p-8 text-center">
                <div className="text-xs font-mono uppercase tracking-[0.4em] text-accent">
                  in memoriam
                </div>
                <h2 className="mt-4 font-display italic text-3xl text-ink">
                  {eulogy.title}
                </h2>
                <p className="mt-6 font-display text-lg leading-relaxed text-ink/90">
                  {eulogy.eulogy}
                </p>
                <div className="mx-auto mt-6 h-px w-24 bg-accent/40" />
                <p className="mt-4 font-display italic text-accent-2">
                  &ldquo;{eulogy.epitaph}&rdquo;
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={download}
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-bg font-semibold hover:bg-accent-2 transition"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
                <button
                  onClick={share}
                  className="inline-flex items-center gap-2 rounded-xl border border-ink-dim/30 px-5 py-3 text-ink hover:border-accent/60 hover:text-accent transition"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-2 rounded-xl border border-ink-dim/30 px-5 py-3 text-ink hover:border-accent/60 hover:text-accent transition"
                >
                  <RefreshCw className="h-4 w-4" />
                  New eulogy
                </button>
              </div>

              <div
                aria-hidden
                style={{ position: "fixed", left: "-99999px", top: 0, pointerEvents: "none" }}
              >
                <MemorialCard ref={cardRef} {...eulogy} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <footer className="px-6 py-8 text-center text-xs text-ink-dim">
        🕯️ eulogy-for-an-era · for the chapters that closed
      </footer>
    </main>
  );
}
