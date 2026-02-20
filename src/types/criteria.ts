import type { ID } from "./market.js";

export type NumericBound = number | undefined;
export type SignedIncrement = number;

export type ComparableScope =
  | { type: "zone"; zoneIds: ID[] }
  | { type: "section"; sectionIds: ID[] }
  | { type: "proximity"; ofSectionId: ID; radius: number };

export interface PricingRule {
  id: ID;
  label: string;
  target: ComparableScope;
  increment: SignedIncrement;
  floor?: NumericBound;
  ceiling?: NumericBound;
  minSample?: number; // minimum seats data required
  maxAgeDays?: number; // data should not be older than this
}

export interface Criteria {
  criteriaId: ID;
  currency: string;
  rules: PricingRule[];
}

export interface PriceResult {
  price: number;
}

export interface PricingRuleValidated {
  key: string;
  values: string[];
  increment: SignedIncrement;
  floor: NumericBound;
  ceiling: NumericBound;
  minSample: number;
  maxAgeDays: number;
}
