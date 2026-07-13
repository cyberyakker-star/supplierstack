"use client";

import Link from "next/link";
import { useShortlist } from "./shortlist";

export function ShortlistNav() {
  const { slugs, ready } = useShortlist();
  const count = slugs.length;
  return (
    <Link
      href="/rfi"
      className={`relative inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
        count > 0
          ? "bg-brand-500 text-ink hover:bg-brand-400"
          : "text-slate-300 hover:text-white"
      }`}
    >
      Shortlist
      {ready && count > 0 && (
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-ink/20 px-1 text-xs font-bold">
          {count}
        </span>
      )}
    </Link>
  );
}
