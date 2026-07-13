import type { ScoreBreakdown } from "@/lib/scoring";

const tierColor: Record<ScoreBreakdown["tier"], string> = {
  Elite: "bg-brand-500 text-ink",
  Strong: "bg-brand-400/20 text-brand-300 border border-brand-400/40",
  Solid: "bg-sky-400/15 text-sky-300 border border-sky-400/30",
  Emerging: "bg-white/10 text-slate-300 border border-white/15",
};

export function ScoreBadge({ score }: { score: ScoreBreakdown }) {
  return (
    <div className="flex items-center gap-2">
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/[0.04] text-lg font-bold text-white ring-1 ring-white/10">
        {score.total}
      </div>
      <span
        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tierColor[score.tier]}`}
      >
        {score.tier}
      </span>
    </div>
  );
}
