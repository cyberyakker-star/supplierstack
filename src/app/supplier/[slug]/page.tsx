import Link from "next/link";
import { notFound } from "next/navigation";
import { suppliers } from "@/data/suppliers";
import { scoreSupplier } from "@/lib/scoring";
import { ScoreBadge } from "@/components/ScoreBadge";
import { RatingBadge } from "@/components/RatingBadge";
import { ShortlistButton } from "@/components/ShortlistButton";

export function generateStaticParams() {
  return suppliers.map((s) => ({ slug: s.slug }));
}

export default function SupplierPage({
  params,
}: {
  params: { slug: string };
}) {
  const supplier = suppliers.find((s) => s.slug === params.slug);
  if (!supplier) notFound();
  const score = scoreSupplier(supplier);

  const bars: { label: string; value: number; max: number }[] = [
    { label: "Compliance & certifications", value: score.compliance, max: 40 },
    { label: "Track record", value: score.trackRecord, max: 20 },
    { label: "Accessibility for new sellers", value: score.accessibility, max: 25 },
    { label: "Transparency", value: score.transparency, max: 15 },
  ];

  return (
    <div className="space-y-8">
      <Link href="/" className="text-sm text-brand-400 hover:text-brand-300">
        ← Back to directory
      </Link>

      <div className="card p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">{supplier.name}</h1>
            <p className="mt-1 text-sm text-slate-400">
              {supplier.hqCity}, {supplier.hqCountry} · {supplier.region} · est.{" "}
              {supplier.foundedYear}
            </p>
          </div>
          <ScoreBadge score={score} />
        </div>

        <div className="mt-3">
          <RatingBadge rating={supplier.rating} />
        </div>

        <p className="mt-4 max-w-2xl text-slate-300">{supplier.summary}</p>

        {supplier.caution && (
          <p className="mt-4 flex items-start gap-2 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-200">
            <span aria-hidden>⚠</span>
            <span>{supplier.caution}</span>
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <ShortlistButton slug={supplier.slug} variant="detail" />
          <a
            href={supplier.website}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5"
          >
            Visit website ↗
          </a>
          {supplier.contactEmails?.[0] && (
            <a
              href={`mailto:${supplier.contactEmails[0]}`}
              className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5"
            >
              {supplier.contactEmails[0]}
            </a>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-white">
            SupplierStack Score breakdown
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Deterministic from published data.{" "}
            <Link href="/methodology" className="text-brand-400 hover:underline">
              See rubric
            </Link>
            .
          </p>
          <div className="mt-4 space-y-3">
            {bars.map((b) => (
              <div key={b.label}>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>{b.label}</span>
                  <span className="text-slate-400">
                    {b.value}/{b.max}
                  </span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-white/5">
                  <div
                    className="h-2 rounded-full bg-brand-500"
                    style={{ width: `${(b.value / b.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card space-y-4 p-6">
          <h2 className="text-sm font-semibold text-white">Key facts</h2>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <Fact label="Minimum order" value={`${supplier.moqUnits.toLocaleString()} units`} />
            <Fact label="Lead time" value={`~${supplier.leadTimeWeeks} weeks`} />
            <Fact
              label="New-seller fit"
              value={supplier.beginnerFriendly ? "Yes" : "Scale-focused"}
            />
            <Fact label="Region" value={supplier.region} />
          </dl>

          <div>
            <p className="mb-2 text-xs font-medium text-slate-400">Capabilities</p>
            <div className="flex flex-wrap gap-1.5">
              {supplier.capabilities.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-brand-400/30 bg-brand-500/10 px-2.5 py-1 text-xs text-brand-200"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-slate-400">Certifications</p>
            <div className="flex flex-wrap gap-1.5">
              {supplier.certifications.map((c) => (
                <span
                  key={c}
                  className="rounded border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-200"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-slate-400">Product formats</p>
            <div className="flex flex-wrap gap-1.5">
              {supplier.categories.map((c) => (
                <span
                  key={c}
                  className="rounded border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-200"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-sm font-semibold text-white">Sourcing notes</h2>
        <p className="mt-2 text-sm text-slate-300">{supplier.notes}</p>
        <p className="mt-4 rounded-lg border border-amber-400/20 bg-amber-400/5 p-3 text-xs text-amber-200/80">
          Seed data compiled from public sources. MOQ, lead times, pricing and
          certifications change — confirm current terms directly with the
          supplier and request their COAs and facility certifications before you
          commit.
        </p>
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="text-slate-200">{value}</dd>
    </div>
  );
}
