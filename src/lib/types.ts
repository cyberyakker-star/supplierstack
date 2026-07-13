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

export interface Supplier {
  slug: string;
  name: string;
  hqCity: string;
  hqCountry: string;
  region: Region;
  foundedYear: number;
  website: string;
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
  notes: string;
}
