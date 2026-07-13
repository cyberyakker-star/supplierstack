import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "SupplierStack — Vetted supplement suppliers for ecom brands",
  description:
    "Find, filter and vet reputable supplement manufacturers and private-label suppliers worldwide. Built for ecom and drop-shipping brands.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500 font-black text-ink">
                S
              </span>
              <span className="text-lg font-bold tracking-tight text-white">
                Supplier<span className="text-brand-400">Stack</span>
              </span>
            </Link>
            <nav className="flex items-center gap-5 text-sm">
              <Link href="/" className="text-slate-300 hover:text-white">
                Directory
              </Link>
              <Link
                href="/methodology"
                className="text-slate-300 hover:text-white"
              >
                How we vet
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="mt-16 border-t border-white/10">
          <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-400">
            <p>
              SupplierStack — supplement supplier discovery for ecom brands.
              Supplier data is a seed shortlist compiled from public sources;
              always verify current terms, certifications and pricing directly
              before committing.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
