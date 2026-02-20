import { compose, filter, isEmpty, map, mean, prop, values } from "ramda";
import { sampleCriteria } from "../data/Criteria.js";
import { sampleSnapshot } from "../data/Snapshot.js";
import type { PricingRule } from "./types/criteria.js";
import {
  filterByAge,
  filterByKey,
  getRuleKeyValues,
  toPrices,
  targetPrice,
  validateCurrency,
  applyFloorAndCeiling,
  isDataEmpty,
  validateBySampleSize,
  filterInvalidPrices,
} from "./helpers.js";
import { Result } from "@carbonteq/fp";
import type { Listing } from "./types/market.js";

// Sudo Code

// [DONE] make sure currency is same
// [DONE] transform rules
// [DONE] filter data matching to each criteria
// [DONE] if set in empty or minSample requirement is not met return null
// [DONE] filter data according to maxAgeDays criteria
// [DONE] ignore non-finite prices
// [DONE] result cannot be below zero or floor or above ceiling

const listings = prop("listings", sampleSnapshot);
const rules = prop("rules", sampleCriteria);

validateCurrency(sampleCriteria, sampleSnapshot);

const applyRule = (rule: PricingRule) => {
  const ruleScope = getRuleKeyValues(rule);
  if (!ruleScope) return () => Result.Err(["Invalid Rule"]);
  const maxAge = prop("maxAgeDays", rule) ?? Infinity;
  const minSample = prop("minSample", rule) ?? 0;
  const increment = prop("increment", rule);
  const floor = prop("floor", rule) ?? 0;
  const ceiling = prop("ceiling", rule) ?? Infinity;
  return (list: Listing[]) =>
    Result.Ok(list)
      .map(filter(filterByKey(ruleScope)))
      .map(filter(filterByAge(maxAge)))
      .validate([
        validateBySampleSize(minSample),
        isDataEmpty("No Listings passed maxAgeDays"),
      ])
      .innerMap(toPrices)
      .map(filterInvalidPrices)
      .map(mean)
      .map(targetPrice(increment))
      .map(applyFloorAndCeiling(floor, ceiling));
};

const pricesByData = map(applyRule, rules);

map((fn) => fn(listings), pricesByData).map((result) =>
  console.log(result.isErr() ? result.unwrapErr() : result.safeUnwrap()),
);
