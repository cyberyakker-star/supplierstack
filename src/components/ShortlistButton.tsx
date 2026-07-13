"use client";

import { useShortlist } from "./shortlist";

export function ShortlistButton({
  slug,
  variant = "card",
}: {
  slug: string;
  variant?: "card" | "detail";
}) {
  const { has, toggle } = useShortlist();
  const active = has(slug);

  return (
    <button
      type="button"
      onClick={(e) => {
        // On cards the button sits inside a link — don't navigate.
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      aria-pressed={active}
      className={
        variant === "detail"
          ? `rounded-xl px-4 py-2 text-sm font-semibold transition ${
              active
                ? "bg-brand-500/20 text-brand-200 ring-1 ring-brand-400/40"
                : "bg-brand-500 text-ink hover:bg-brand-400"
            }`
          : `rounded-lg px-2.5 py-1 text-xs font-medium transition ${
              active
                ? "bg-brand-500/20 text-brand-200 ring-1 ring-brand-400/40"
                : "bg-white/5 text-slate-300 ring-1 ring-white/10 hover:bg-white/10"
            }`
      }
    >
      {active ? "✓ In shortlist" : "+ Add to shortlist"}
    </button>
  );
}
