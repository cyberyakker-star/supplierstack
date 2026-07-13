import Link from "next/link";
import { suppliers } from "@/data/suppliers";
import { scoreSupplier } from "@/lib/scoring";
import { Directory } from "@/components/Directory";

export default function Home() {
  const total = suppliers.length;
  const beginner = suppliers.filter((s) => s.beginnerFriendly).length;
  const rated = suppliers.filter((s) => s.rating).length;
  const avgScore = Math.round(
    suppliers.reduce((a, s) => a + scoreSupplier(s).total, 0) / total,
  );

  return (
    <div className="space-y-10">
      <section className="card overflow-hidden p-8 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-400">
          Supplement supplier intelligence
        </p>
        <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Find reputable, cost-effective supplement suppliers — without the
          gatekeeping.
        </h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          Good ecom brands guard their manufacturers. SupplierStack is a vetted,
          filterable directory of supplement contract manufacturers and
          private-label suppliers worldwide — scored on compliance, track record
          and how easily a <span className="text-white">new seller</span> can
          actually work with them. Shortlist your favorites and{" "}
          <span className="text-white">request info from all of them at once</span>.
        </p>
        <div className="mt-6 flex flex-wrap gap-6 text-sm">
          <Metric value={total} label="Suppliers vetted" />
          <Metric value={beginner} label="New-seller friendly" />
          <Metric value={rated} label="With public ratings" />
          <Metric value={avgScore} label="Avg SupplierStack Score" />
        </div>
        <div className="mt-6 flex gap-3">
          <Link
            href="#directory"
            className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-ink hover:bg-brand-400"
          >
            Browse the directory
          </Link>
          <Link
            href="/methodology"
            className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5"
          >
            How scoring works
          </Link>
        </div>
      </section>

      <section id="directory" className="scroll-mt-20 space-y-4">
        <h2 className="text-xl font-bold text-white">Supplier directory</h2>
        <Directory suppliers={suppliers} />
      </section>
    </div>
  );
}

function Metric({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}
