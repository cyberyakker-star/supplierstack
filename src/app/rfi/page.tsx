"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { suppliers } from "@/data/suppliers";
import type { Supplier } from "@/lib/types";
import { useShortlist } from "@/components/shortlist";

interface Req {
  brand: string;
  contactName: string;
  contactEmail: string;
  product: string;
  formats: string;
  targetQty: string;
  monthlyVolume: string;
  certs: string;
  timeline: string;
  notes: string;
}

const EMPTY_REQ: Req = {
  brand: "",
  contactName: "",
  contactEmail: "",
  product: "",
  formats: "",
  targetQty: "",
  monthlyVolume: "",
  certs: "",
  timeline: "",
  notes: "",
};

const REQ_KEY = "supplierstack.rfi.req.v1";

function domainEmail(website: string): string {
  try {
    const host = new URL(website).hostname.replace(/^www\./, "");
    return `info@${host}`;
  } catch {
    return "";
  }
}

export default function RfiPage() {
  const { slugs, remove, clear, ready } = useShortlist();

  const selected: Supplier[] = useMemo(
    () =>
      slugs
        .map((slug) => suppliers.find((s) => s.slug === slug))
        .filter((s): s is Supplier => Boolean(s)),
    [slugs],
  );

  const [req, setReq] = useState<Req>(EMPTY_REQ);
  const [emails, setEmails] = useState<Record<string, string>>({});
  const [fileName, setFileName] = useState<string>("");
  const [copied, setCopied] = useState(false);

  // Restore saved requirements.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(REQ_KEY);
      if (raw) setReq({ ...EMPTY_REQ, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  // Persist requirements.
  useEffect(() => {
    try {
      localStorage.setItem(REQ_KEY, JSON.stringify(req));
    } catch {
      /* ignore */
    }
  }, [req]);

  // Seed per-supplier email suggestions as the shortlist changes.
  useEffect(() => {
    setEmails((prev) => {
      const next = { ...prev };
      for (const s of selected) {
        if (next[s.slug] === undefined)
          next[s.slug] = s.contactEmail ?? domainEmail(s.website);
      }
      return next;
    });
  }, [selected]);

  function set<K extends keyof Req>(key: K, value: string) {
    setReq((r) => ({ ...r, [key]: value }));
  }

  const subject = `Supplement supplier inquiry (RFI)${req.brand ? ` — ${req.brand}` : ""}`;

  const body = useMemo(() => {
    const L: string[] = [];
    L.push("Hello,");
    L.push("");
    L.push(
      `We're evaluating manufacturing partners for our supplement line${req.brand ? ` (${req.brand})` : ""} and would like to request information and a quote.`,
    );
    L.push("");
    L.push("REQUIREMENTS");
    const row = (label: string, v: string) => v && L.push(`• ${label}: ${v}`);
    row("Product / goal", req.product);
    row("Delivery formats", req.formats);
    row("Initial order quantity", req.targetQty);
    row("Estimated monthly volume", req.monthlyVolume);
    row("Required certifications", req.certs);
    row("Target timeline", req.timeline);
    row("Additional notes", req.notes);
    L.push("");
    L.push("Specifically, we'd appreciate:");
    L.push("  1. Your minimum order quantity and price-per-unit at our volumes");
    L.push("  2. Available stock formulas vs. custom formulation options and costs");
    L.push("  3. Lead times and current capacity");
    L.push("  4. Certifications and a sample COA (certificate of analysis)");
    L.push("  5. Whether you support private label, dropship and fulfillment");
    L.push("");
    if (fileName)
      L.push(
        `(A requirements document "${fileName}" is attached to this email.)`,
      );
    L.push("");
    L.push("Thank you — looking forward to your response.");
    L.push("");
    if (req.contactName) L.push(req.contactName);
    if (req.brand) L.push(req.brand);
    if (req.contactEmail) L.push(req.contactEmail);
    return L.join("\r\n");
  }, [req, fileName]);

  const recipientList = selected
    .map((s) => emails[s.slug]?.trim())
    .filter(Boolean) as string[];

  const mailto = useMemo(() => {
    const params = new URLSearchParams();
    if (recipientList.length) params.set("bcc", recipientList.join(","));
    params.set("subject", subject);
    params.set("body", body);
    // Space-encoding: URLSearchParams uses "+"; mail clients want %20.
    const qs = params.toString().replace(/\+/g, "%20");
    const to = req.contactEmail ? encodeURIComponent(req.contactEmail) : "";
    return `mailto:${to}?${qs}`;
  }, [recipientList, subject, body, req.contactEmail]);

  async function copyAll() {
    const text = `To (BCC): ${recipientList.join(", ")}\r\nSubject: ${subject}\r\n\r\n${body}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  function downloadRfi() {
    const text = `${subject}\n\n${body}`;
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `RFI-${req.brand || "supplierstack"}.md`.replace(/\s+/g, "-");
    a.click();
    URL.revokeObjectURL(url);
  }

  const tooManyForMailto = mailto.length > 1900;

  if (!ready) return null;

  if (selected.length === 0) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <h1 className="text-2xl font-bold text-white">Your shortlist is empty</h1>
        <p className="mt-3 text-slate-400">
          Browse the directory and tap “+ Add to shortlist” on the suppliers you
          want to contact. They’ll collect here so you can request info from all
          of them at once.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-ink hover:bg-brand-400"
        >
          Browse suppliers
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Request info from {selected.length} supplier
            {selected.length === 1 ? "" : "s"}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Fill in your requirements once, then send a single RFI to everyone on
            your shortlist.
          </p>
        </div>
        <button
          onClick={clear}
          className="text-xs text-slate-400 hover:text-white"
        >
          Clear shortlist
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Requirements form */}
        <section className="card space-y-4 p-6">
          <h2 className="text-sm font-semibold text-white">Your requirements</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Your brand / company">
              <input
                value={req.brand}
                onChange={(e) => set("brand", e.target.value)}
                placeholder="e.g. Northpeak Wellness"
                className={inputCls}
              />
            </Field>
            <Field label="Your name">
              <input
                value={req.contactName}
                onChange={(e) => set("contactName", e.target.value)}
                placeholder="e.g. Alex Rivera"
                className={inputCls}
              />
            </Field>
            <Field label="Your email (recipients reply here)">
              <input
                type="email"
                value={req.contactEmail}
                onChange={(e) => set("contactEmail", e.target.value)}
                placeholder="you@brand.com"
                className={inputCls}
              />
            </Field>
            <Field label="Delivery formats">
              <input
                value={req.formats}
                onChange={(e) => set("formats", e.target.value)}
                placeholder="e.g. Capsules, gummies"
                className={inputCls}
              />
            </Field>
            <Field label="Product / goal" full>
              <input
                value={req.product}
                onChange={(e) => set("product", e.target.value)}
                placeholder="e.g. Magnesium glycinate + ashwagandha sleep blend"
                className={inputCls}
              />
            </Field>
            <Field label="Initial order quantity">
              <input
                value={req.targetQty}
                onChange={(e) => set("targetQty", e.target.value)}
                placeholder="e.g. 500 units to start"
                className={inputCls}
              />
            </Field>
            <Field label="Est. monthly volume">
              <input
                value={req.monthlyVolume}
                onChange={(e) => set("monthlyVolume", e.target.value)}
                placeholder="e.g. 1,000–2,000/mo"
                className={inputCls}
              />
            </Field>
            <Field label="Required certifications">
              <input
                value={req.certs}
                onChange={(e) => set("certs", e.target.value)}
                placeholder="e.g. cGMP, NSF"
                className={inputCls}
              />
            </Field>
            <Field label="Timeline">
              <input
                value={req.timeline}
                onChange={(e) => set("timeline", e.target.value)}
                placeholder="e.g. Launch in 8–10 weeks"
                className={inputCls}
              />
            </Field>
            <Field label="Additional notes" full>
              <textarea
                value={req.notes}
                onChange={(e) => set("notes", e.target.value)}
                rows={3}
                placeholder="Anything else suppliers should know…"
                className={inputCls}
              />
            </Field>
          </div>

          <div className="border-t border-white/10 pt-4">
            <label className="mb-1.5 block text-xs font-medium text-slate-400">
              Requirements document (optional)
            </label>
            <input
              type="file"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
              className="block w-full text-sm text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-white/20"
            />
            {fileName && (
              <p className="mt-2 text-xs text-brand-300">
                “{fileName}” ready — attach it in your email app after the draft
                opens (browsers can’t attach files to an email for you).
              </p>
            )}
          </div>
        </section>

        {/* Recipients + actions */}
        <aside className="space-y-4">
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-white">
              Recipients ({selected.length})
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Emails are best-guess suggestions from each site — verify them
              against the supplier’s contact page before sending.
            </p>
            <ul className="mt-3 space-y-3">
              {selected.map((s) => (
                <li key={s.slug} className="text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      href={`/supplier/${s.slug}`}
                      className="font-medium text-white hover:text-brand-300"
                    >
                      {s.name}
                    </Link>
                    <div className="flex items-center gap-2">
                      <a
                        href={s.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-400 hover:text-white"
                        title="Open supplier site to confirm contact"
                      >
                        site ↗
                      </a>
                      <button
                        onClick={() => remove(s.slug)}
                        className="text-xs text-slate-500 hover:text-red-300"
                        aria-label={`Remove ${s.name}`}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <input
                    value={emails[s.slug] ?? ""}
                    onChange={(e) =>
                      setEmails((m) => ({ ...m, [s.slug]: e.target.value }))
                    }
                    placeholder="add email…"
                    className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white outline-none focus:border-brand-400"
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="card space-y-3 p-5">
            <a
              href={mailto}
              className="block rounded-xl bg-brand-500 px-4 py-2.5 text-center text-sm font-semibold text-ink hover:bg-brand-400"
            >
              Open draft in email app
            </a>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={copyAll}
                className="rounded-xl border border-white/15 px-3 py-2 text-sm font-medium text-white hover:bg-white/5"
              >
                {copied ? "Copied ✓" : "Copy email"}
              </button>
              <button
                onClick={downloadRfi}
                className="rounded-xl border border-white/15 px-3 py-2 text-sm font-medium text-white hover:bg-white/5"
              >
                Download RFI
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Suppliers go in <strong className="text-slate-200">BCC</strong> so
              they don’t see each other. The draft opens in your own email app —
              review, attach your document, and send.
            </p>
            {tooManyForMailto && (
              <p className="rounded-lg border border-amber-400/20 bg-amber-400/5 p-2 text-xs text-amber-200/80">
                This RFI is long for a mailto link and may get truncated by your
                email app. Use <strong>Copy email</strong> and paste into a new
                message, or send to fewer suppliers at a time.
              </p>
            )}
          </div>
        </aside>
      </div>

      {/* Live preview */}
      <section className="card p-6">
        <h2 className="text-sm font-semibold text-white">Email preview</h2>
        <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-4 text-sm">
          <p className="text-slate-400">
            <span className="text-slate-500">Subject:</span> {subject}
          </p>
          <pre className="mt-3 whitespace-pre-wrap font-sans text-slate-200">
            {body}
          </pre>
        </div>
      </section>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-brand-400";

function Field({
  label,
  full,
  children,
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-1.5 block text-xs font-medium text-slate-400">
        {label}
      </label>
      {children}
    </div>
  );
}
