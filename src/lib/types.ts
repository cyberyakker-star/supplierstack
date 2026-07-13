export type Region =
  | "North America"
  | "Europe"
  | "Asia"
  | "Oceania"
  | "South America";

export type ProductCategory =
  | "Capsules"
  | "Tablets"
  | "Softgels"
  | "Powders"
  | "Gummies"
  | "Liquids"
  | "Sachets/Stick Packs"
  | "Effervescents";

export type Certification =
  | "cGMP"
  | "FDA-Registered"
  | "NSF"
  | "NSF Sport"
  | "ISO 9001"
  | "USDA Organic"
  | "Halal"
  | "Kosher"
  | "Informed Sport";

export type Capability =
  | "Private Label"
  | "White Label"
  | "Custom Formulation"
  | "Stock Formulas"
  | "Dropship Support"
  | "Fulfillment / 3PL"
  | "Low MOQ";

/**
 * A customer review rating found from a public source. If a supplier has no
 * published customer rating, its `rating` is `null` — surfaced in the UI as
 * "No public rating". Employee-only reviews (Glassdoor/Indeed) are NOT used
 * here, since they don't reflect the supplier's service to brands.
 */
export interface Rating {
  /** Average stars, out of 5. */
  value: number;
  /** Number of reviews behind the average. */
  count: number;
  /** Where the rating was sourced (e.g. "Trustpilot", "Google / Birdeye"). */
  source: string;
}

export interface Supplier {
  slug: string;
  name: string;
  hqCity: string;
  hqCountry: string;
  region: Region;
  foundedYear: number;
  website: string;
  /** Public contact email if verified. When absent, the RFI tool suggests one
   * from the domain that the user can review/correct before sending. */
  contactEmail?: string;
  summary: string;
  categories: ProductCategory[];
  capabilities: Capability[];
  certifications: Certification[];
  /** Approximate minimum order quantity in units for private-label runs. */
  moqUnits: number;
  /** Typical production lead time in weeks. */
  leadTimeWeeks: number;
  /** Good fit for a brand-new / small ecom or dropshipping seller? */
  beginnerFriendly: boolean;
  /** Public customer rating, or null if none was found. */
  rating: Rating | null;
  /** Optional red-flag worth surfacing (e.g. bankruptcy, unresolved disputes). */
  caution?: string;
  notes: string;
}
