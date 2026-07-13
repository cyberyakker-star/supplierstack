import Link from "next/link";

export const metadata = {
  title: "How we vet — SupplierStack",
};

export default function Methodology() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Link href="/" className="text-sm text-brand-400 hover:text-brand-300">
          ← Back to directory
        </Link>
        <h1 className="mt-3 text-3xl font-bold text-white">
          How the SupplierStack Score works
        </h1>
        <p className="mt-3 text-slate-300">
          Every supplier gets a single 0–100 score, computed deterministically
          from published data — no pay-to-play, no vanity rankings. The rubric
          is built around the four things that actually decide whether a
          supplement manufacturer is a good bet for a growing ecom brand.
        </p>
      </div>

      <Rubric
        weight="40 pts"
        title="Compliance & certifications"
        body="The non-negotiable layer. cGMP and FDA registration carry the most weight, with NSF, ISO 9001, and organic/kosher/halal certifications adding to the score. In supplements, a facility's quality systems are your liability shield."
      />
      <Rubric
        weight="25 pts"
        title="Accessibility for new sellers"
        body="This is where most directories fail you. We reward genuinely low MOQs, drop-ship support, ready-to-launch stock formulas, private-label programs and in-house fulfillment — the things that let a new brand start small and validate demand before locking up capital."
      />
      <Rubric
        weight="20 pts"
        title="Track record"
        body="Years in operation, scaled so that a decade-plus of manufacturing history counts meaningfully but doesn't lock out capable newer players."
      />
      <Rubric
        weight="15 pts"
        title="Transparency"
        body="Whether MOQ, lead times and contact paths are knowable up front. Suppliers who make their terms discoverable save you weeks of back-and-forth."
      />

      <div className="card p-5">
        <h2 className="font-semibold text-white">
          Customer ratings vs. the Score
        </h2>
        <p className="mt-2 text-sm text-slate-300">
          The SupplierStack Score and the customer rating are two different
          signals shown side by side. The Score is our structured vetting of
          compliance and fit; the rating is real customer feedback pulled from
          public platforms (Trustpilot, Google/Birdeye). We only show{" "}
          <span className="text-white">customer</span> reviews — employee reviews
          from sites like Glassdoor are excluded because they say nothing about
          how a supplier treats the brands it produces for.
        </p>
        <p className="mt-2 text-sm text-slate-300">
          Many B2B manufacturers simply don&apos;t collect public reviews, so a{" "}
          <span className="text-white">&ldquo;No public rating&rdquo;</span> badge
          is common and is <span className="text-white">not</span> a negative —
          it just means the crowd hasn&apos;t weighed in. Where we find a genuine
          red flag (bankruptcy, unresolved disputes), we surface it as a warning
          on the supplier.
        </p>
      </div>

      <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5 text-sm text-amber-200/80">
        <p className="font-semibold text-amber-200">On the data</p>
        <p className="mt-2">
          The current directory is a curated seed list drawn from public sources.
          Scores are only as good as the underlying data — treat them as a
          ranked shortlist to shorten your search, not a substitute for due
          diligence. Always request current pricing, MOQs, COAs (certificates of
          analysis) and facility certifications directly before committing to a
          supplier.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-slate-300">
        <p className="font-semibold text-white">Where this is headed</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Verified supplier submissions with uploaded certifications.</li>
          <li>Real MOQ / price-per-unit ranges gathered from brand reviews.</li>
          <li>Saved shortlists and side-by-side supplier comparison.</li>
          <li>Outreach templates and a request-a-quote workflow.</li>
          <li>Expansion beyond supplements once the vetting model is proven.</li>
        </ul>
      </div>
    </div>
  );
}

function Rubric({
  weight,
  title,
  body,
}: {
  weight: string;
  title: string;
  body: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-white">{title}</h2>
        <span className="rounded-full bg-brand-500/15 px-2.5 py-0.5 text-xs font-semibold text-brand-300">
          {weight}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-300">{body}</p>
    </div>
  );
}
