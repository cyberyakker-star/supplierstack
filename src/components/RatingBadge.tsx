import type { Rating } from "@/lib/types";

export function RatingStars({ value }: { value: number }) {
  const full = Math.round(value);
  return (
    <span className="text-amber-400" aria-hidden>
      {"★".repeat(full)}
      <span className="text-slate-600">{"★".repeat(5 - full)}</span>
    </span>
  );
}

export function RatingBadge({
  rating,
  className = "",
}: {
  rating: Rating | null;
  className?: string;
}) {
  if (!rating) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-slate-400 ${className}`}
        title="No public customer rating was found for this supplier."
      >
        No public rating
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs ${className}`}
      title={`${rating.value} out of 5 from ${rating.count} reviews (${rating.source})`}
    >
      <RatingStars value={rating.value} />
      <span className="font-semibold text-white">{rating.value.toFixed(1)}</span>
      <span className="text-slate-400">
        ({rating.count.toLocaleString()} · {rating.source})
      </span>
    </span>
  );
}
