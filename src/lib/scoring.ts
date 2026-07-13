import type { Supplier } from "./types";

export interface ScoreBreakdown {
  total: number;
  compliance: number;
  trackRecord: number;
  accessibility: number;
  transparency: number;
  tier: "Elite" | "Strong" | "Solid" | "Emerging";
}

const CURRENT_YEAR = 2026;

/**
 * SupplierStack Score (0-100). Deterministic from a supplier's data.
 * The rubric weights the four things that actually matter when a new ecom
 * brand is choosing a supplement manufacturer:
 *
 *   Compliance (40)     – certifications & regulatory standing
 *   Track record (20)   – years operating
 *   Accessibility (25)  – can a small/new seller actually work with them?
 *   Transparency (15)   – is pricing/MOQ/lead time knowable up front?
 */
export function scoreSupplier(s: Supplier): ScoreBreakdown {
  // --- Compliance (max 40) ---
  const certWeights: Record<string, number> = {
    cGMP: 14,
    "FDA-Registered": 9,
    NSF: 7,
    "NSF Sport": 4,
    "Informed Sport": 4,
    "ISO 9001": 4,
    "USDA Organic": 3,
    Halal: 2,
    Kosher: 2,
  };
  let compliance = 0;
  for (const cert of s.certifications) compliance += certWeights[cert] ?? 0;
  compliance = Math.min(40, compliance);

  // --- Track record (max 20) ---
  const years = Math.max(0, CURRENT_YEAR - s.foundedYear);
  const trackRecord = Math.min(20, Math.round((years / 30) * 20));

  // --- Accessibility for new sellers (max 25) ---
  let accessibility = 0;
  const caps = new Set(s.capabilities);
  if (caps.has("Low MOQ")) accessibility += 7;
  if (caps.has("Dropship Support")) accessibility += 6;
  if (caps.has("Stock Formulas")) accessibility += 4;
  if (caps.has("Private Label")) accessibility += 3;
  if (caps.has("Fulfillment / 3PL")) accessibility += 3;
  // MOQ sliding scale
  if (s.moqUnits <= 100) accessibility += 2;
  else if (s.moqUnits <= 500) accessibility += 1;
  accessibility = Math.min(25, accessibility);

  // --- Transparency (max 15) ---
  let transparency = 0;
  if (s.moqUnits > 0) transparency += 5;
  if (s.leadTimeWeeks > 0) transparency += 5;
  if (s.website) transparency += 5;
  transparency = Math.min(15, transparency);

  const total = Math.round(
    compliance + trackRecord + accessibility + transparency,
  );

  const tier =
    total >= 85
      ? "Elite"
      : total >= 72
        ? "Strong"
        : total >= 58
          ? "Solid"
          : "Emerging";

  return { total, compliance, trackRecord, accessibility, transparency, tier };
}
