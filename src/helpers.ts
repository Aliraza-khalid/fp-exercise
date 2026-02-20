import { Result } from "@carbonteq/fp";
import type {
  ComparableScope,
  Criteria,
  PriceResult,
  PricingRule,
  SignedIncrement,
} from "./types/criteria";
import type { ID, Listing, MarketSnapshot } from "./types/market";
import { add, curry, isEmpty, max, min, range, subtract } from "ramda";

export function getRuleKeyValues(rule: PricingRule): {
  key: "zoneId" | "sectionId";
  values: ID[];
} | null {
  switch (rule.target.type) {
    case "zone":
      return { key: "zoneId", values: rule.target.zoneIds };
    case "section":
      return { key: "sectionId", values: rule.target.sectionIds };
    case "proximity":
      return { key: "sectionId", values: resolveProximityRule(rule.target) };
    default:
      return null;
  }
}

export function resolveProximityRule(
  target: Extract<
    ComparableScope,
    { type: "proximity"; ofSectionId: ID; radius: number }
  >,
) {
  return range(
    subtract(Number(target.ofSectionId), target.radius),
    add(Number(target.ofSectionId), target.radius + 1),
  ).map((v) => v.toString() as ID);
}

export function filterByKey({
  key,
  values,
}: {
  key: Extract<keyof Listing, "zoneId" | "sectionId">;
  values: ID[];
}) {
  return (e: Listing) => values.includes(e[key]);
}

export function filterByAge(maxAge: number = Infinity) {
  return (e: Listing) => e.listing.ageDays <= maxAge;
}

export function toPrices(e: Listing) {
  return e.listing.price;
}

export function filterInvalidPrices(prices: number[]) {
  return prices.filter((p) => !isNaN(p) && p !== Infinity);
}

export function targetPrice(increment: SignedIncrement) {
  return (mean: number) => ({ price: mean + increment }) as PriceResult;
}

export const applyFloorAndCeiling = (floor: number = 0, ceiling: number = Infinity) => {
  return (result: PriceResult) => {
    const price = min(max(floor, result.price), ceiling);
    return { price };
  };
};

// VALIDATORS

export function validateCurrency(currency: string) {
  return (market: MarketSnapshot) =>
    currency === market.event.currency
      ? Result.Ok(true)
      : Result.Err("Currency mismatch");
}

export const isDataEmpty = (message: string) => {
  return (data: any[]) =>
    isEmpty(data) ? Result.Err(message) : Result.Ok(true);
};

export const validateBySampleSize = (minSample: number = 1) => {
  return (data: any[]) =>
    data.length < minSample
      ? Result.Err("Listings less than minSample")
      : Result.Ok(true);
};
