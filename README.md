# SupplierStack

Supplier discovery for ecom & drop-shipping brands — starting with **supplements**.

Good ecom businesses guard their manufacturers, and finding suppliers that are
reputable *and* cost-effective *and* willing to work with a new seller is hard.
SupplierStack is a vetted, filterable directory of supplement contract
manufacturers and private-label suppliers worldwide, each scored on the things
that actually matter for a growing brand.

## The SupplierStack Score (0–100)

Every supplier is scored deterministically from published data:

| Weight | Dimension | Why it matters |
| ------ | --------- | -------------- |
| 40 | Compliance & certifications | cGMP, FDA registration, NSF, ISO, organic/kosher/halal — your liability shield |
| 25 | Accessibility for new sellers | Low MOQ, drop-ship support, stock formulas, private label, fulfillment |
| 20 | Track record | Years in operation |
| 15 | Transparency | Are MOQ / lead time / contact knowable up front? |

See `src/lib/scoring.ts` for the exact rubric.

## Features

- 44+ real supplement manufacturers across North America, Europe, Asia, Oceania and South America.
- Filterable directory: region, product format, certifications, capabilities, max MOQ, beginner-friendly, has-public-rating.
- Full-text search and sort by score / customer rating / lowest MOQ / fastest lead time.
- **Customer ratings** pulled from public sources (Trustpilot, Google/Birdeye), with an explicit "No public rating" badge where none exists, and red-flag **cautions** (e.g. bankruptcy) surfaced per supplier.
- Per-supplier detail pages with a score breakdown and sourcing notes.
- "How we vet" methodology page.

### Ratings policy

`rating` is only populated from **customer** reviews. Employee reviews
(Glassdoor/Indeed) are excluded. No rating found → `null` → "No public rating"
in the UI. Absence of reviews is not a negative — most B2B manufacturers don't
collect them.

## Tech stack

Next.js 14 (App Router, static export) · TypeScript · Tailwind CSS. Supplier
data is a typed seed list in `src/data/suppliers.ts` — no database required yet.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to ./out
```

## Deployment

The app is a fully static site (`output: "export"`). A GitHub Actions workflow
(`.github/workflows/deploy.yml`) builds and publishes to **GitHub Pages** on
every push to `main`.

**One-time setup:** in the GitHub repo, go to **Settings → Pages → Build and
deployment → Source** and select **GitHub Actions**. After that, each merge to
`main` publishes automatically to `https://<user>.github.io/supplierstack/`.

Prefer Vercel? Import the repo at vercel.com — it needs no config (remove
`output: "export"` if you later add server features).

## Data disclaimer

The current directory is a curated **seed list** compiled from public sources.
MOQ, lead times, pricing and certifications change over time — always confirm
current terms, request COAs and verify facility certifications directly with a
supplier before committing.

## Roadmap

- Verified supplier submissions with uploaded certifications
- Real MOQ / price-per-unit ranges from brand reviews
- Saved shortlists and side-by-side comparison
- Outreach templates + request-a-quote workflow
- Expansion beyond supplements once the vetting model is proven
