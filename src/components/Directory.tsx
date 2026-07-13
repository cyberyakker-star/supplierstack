"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type {
  Capability,
  Certification,
  ProductCategory,
  Region,
  Supplier,
} from "@/lib/types";
import { scoreSupplier } from "@/lib/scoring";
import { ScoreBadge } from "./ScoreBadge";

const REGIONS: Region[] = [
  "North America",
  "Europe",
  "Asia",
  "Oceania",
  "South America",
];

const CATEGORIES: ProductCategory[] = [
  "Capsules",
  "Tablets",
  "Softgels",
  "Powders",
  "Gummies",
  "Liquids",
  "Sachets/Stick Packs",
  "Effervescents",
];

const CERTS: Certification[] = [
  "cGMP",
  "FDA-Registered",
  "NSF",
  "ISO 9001",
  "USDA Organic",
  "Halal",
  "Kosher",
];

const CAPS: Capability[] = [
  "Low MOQ",
  "Dropship Support",
  "Stock Formulas",
  "Private Label",
  "Custom Formulation",
  "Fulfillment / 3PL",
];

type SortKey = "score" | "moq" | "leadtime";

export function Directory({ suppliers }: { suppliers: Supplier[] }) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<Region | "">("");
  const [categories, setCategories] = useState<Set<ProductCategory>>(new Set());
  const [certs, setCerts] = useState<Set<Certification>>(new Set());
  const [caps, setCaps] = useState<Set<Capability>>(new Set());
  const [maxMoq, setMaxMoq] = useState<number>(0);
  const [beginnerOnly, setBeginnerOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("score");

  const scored = useMemo(
    () => suppliers.map((s) => ({ supplier: s, score: scoreSupplier(s) })),
    [suppliers],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = scored.filter(({ supplier: s }) => {
      if (q) {
        const hay =
          `${s.name} ${s.summary} ${s.hqCity} ${s.hqCountry} ${s.categories.join(" ")} ${s.certifications.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (region && s.region !== region) return false;
      if (beginnerOnly && !s.beginnerFriendly) return false;
      if (maxMoq > 0 && s.moqUnits > maxMoq) return false;
      for (const c of categories) if (!s.categories.includes(c)) return false;
      for (const c of certs) if (!s.certifications.includes(c)) return false;
      for (const c of caps) if (!s.capabilities.includes(c)) return false;
      return true;
    });

    rows = rows.sort((a, b) => {
      if (sort === "score") return b.score.total - a.score.total;
      if (sort === "moq") return a.supplier.moqUnits - b.supplier.moqUnits;
      return a.supplier.leadTimeWeeks - b.supplier.leadTimeWeeks;
    });
    return rows;
  }, [scored, query, region, categories, certs, caps, maxMoq, beginnerOnly, sort]);

  function toggle<T>(set: Set<T>, value: T, apply: (s: Set<T>) => void) {
    const next = new Set(set);
    next.has(value) ? next.delete(value) : next.add(value);
    apply(next);
  }

  const activeCount =
    (region ? 1 : 0) +
    categories.size +
    certs.size +
    caps.size +
    (maxMoq > 0 ? 1 : 0) +
    (beginnerOnly ? 1 : 0);

  function reset() {
    setQuery("");
    setRegion("");
    setCategories(new Set());
    setCerts(new Set());
    setCaps(new Set());
    setMaxMoq(0);
    setBeginnerOnly(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      {/* Filters */}
      <aside className="card h-fit space-y-5 p-5 lg:sticky lg:top-20">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Filters</h2>
          {activeCount > 0 && (
            <button
              onClick={reset}
              className="text-xs text-brand-400 hover:text-brand-300"
            >
              Clear ({activeCount})
            </button>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400">
            Region
          </label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as Region | "")}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-brand-400"
          >
            <option value="">All regions</option>
            {REGIONS.map((r) => (
              <option key={r} value={r} className="bg-ink">
                {r}
              </option>
            ))}
          </select>
        </div>

        <FilterGroup label="For new sellers">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={beginnerOnly}
              onChange={(e) => setBeginnerOnly(e.target.checked)}
              className="accent-brand-500"
            />
            Beginner-friendly only
          </label>
          <div className="pt-1">
            <label className="mb-1.5 block text-xs font-medium text-slate-400">
              Max MOQ: {maxMoq > 0 ? maxMoq.toLocaleString() + " units" : "any"}
            </label>
            <input
              type="range"
              min={0}
              max={5000}
              step={100}
              value={maxMoq}
              onChange={(e) => setMaxMoq(Number(e.target.value))}
              className="w-full accent-brand-500"
            />
          </div>
        </FilterGroup>

        <FilterGroup label="Capabilities">
          {CAPS.map((c) => (
            <Chip
              key={c}
              label={c}
              active={caps.has(c)}
              onClick={() => toggle(caps, c, setCaps)}
            />
          ))}
        </FilterGroup>

        <FilterGroup label="Certifications">
          {CERTS.map((c) => (
            <Chip
              key={c}
              label={c}
              active={certs.has(c)}
              onClick={() => toggle(certs, c, setCerts)}
            />
          ))}
        </FilterGroup>

        <FilterGroup label="Product formats">
          {CATEGORIES.map((c) => (
            <Chip
              key={c}
              label={c}
              active={categories.has(c)}
              onClick={() => toggle(categories, c, setCategories)}
            />
          ))}
        </FilterGroup>
      </aside>

      {/* Results */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search suppliers, formats, certifications…"
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-brand-400"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-400"
          >
            <option value="score" className="bg-ink">
              Sort: Score
            </option>
            <option value="moq" className="bg-ink">
              Sort: Lowest MOQ
            </option>
            <option value="leadtime" className="bg-ink">
              Sort: Fastest lead time
            </option>
          </select>
        </div>

        <p className="text-sm text-slate-400">
          {filtered.length} supplier{filtered.length === 1 ? "" : "s"}
        </p>

        <div className="grid gap-4">
          {filtered.map(({ supplier: s, score }) => (
            <Link
              key={s.slug}
              href={`/supplier/${s.slug}`}
              className="card group block p-5 transition hover:border-brand-400/40 hover:bg-white/[0.05]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-white group-hover:text-brand-300">
                      {s.name}
                    </h3>
                    {s.beginnerFriendly && (
                      <span className="rounded-full bg-brand-500/15 px-2 py-0.5 text-[11px] font-medium text-brand-300">
                        New-seller friendly
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {s.hqCity}, {s.hqCountry} · {s.region} · est. {s.foundedYear}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-300">
                    {s.summary}
                  </p>
                </div>
                <ScoreBadge score={score} />
              </div>

              <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-400">
                <Stat label="MOQ" value={`${s.moqUnits.toLocaleString()} units`} />
                <Stat label="Lead time" value={`~${s.leadTimeWeeks} wks`} />
                <Stat label="Formats" value={`${s.categories.length}`} />
                <div className="ml-auto flex flex-wrap gap-1.5">
                  {s.certifications.slice(0, 4).map((c) => (
                    <span
                      key={c}
                      className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[11px] text-slate-300"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}

          {filtered.length === 0 && (
            <div className="card p-10 text-center text-slate-400">
              No suppliers match those filters. Try loosening MOQ or
              certifications.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2 border-t border-white/10 pt-4">
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-xs transition ${
        active
          ? "border-brand-400 bg-brand-500/20 text-brand-200"
          : "border-white/10 bg-white/5 text-slate-300 hover:border-white/25"
      }`}
    >
      {label}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span>
      <span className="text-slate-500">{label}:</span>{" "}
      <span className="text-slate-200">{value}</span>
    </span>
  );
}
