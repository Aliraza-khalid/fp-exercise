import {
  compose,
  curry,
  filter,
  isEmpty,
  map,
  mean,
  prop,
  values,
} from "ramda";
import { sampleCriteria } from "../data/Criteria.js";
import { sampleSnapshot } from "../data/Snapshot.js";
import type { Criteria, PricingRule } from "./types/criteria.js";
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
import type { Listing, MarketSnapshot } from "./types/market.js";

// Sudo Code

// [DONE] make sure currency is same
// [DONE] transform rules
// [DONE] filter data matching to each criteria
// [DONE] if set in empty or minSample requirement is not met return null
// [DONE] filter data according to maxAgeDays criteria
// [DONE] ignore non-finite prices
// [DONE] result cannot be below zero or floor or above ceiling

const applyRules = curry((criteria: Criteria) => {
  const currency = prop("currency", criteria);
  const rules = prop("rules", criteria);

  const compileRule = curry(
    (currency: string, rule: PricingRule, data: MarketSnapshot) => {
      const maxAge = prop("maxAgeDays", rule);
      const minSample = prop("minSample", rule);
      const increment = prop("increment", rule);
      const floor = prop("floor", rule);
      const ceiling = prop("ceiling", rule);

      return Result.fromNullable(
        getRuleKeyValues(rule),
        "Invalid Rule",
      ).flatMap((scope) =>
        Result.Ok(data)
          .validate([validateCurrency(currency)])
          .map(prop("listings"))
          .map(filter(filterByKey(scope)))
          .validate([validateBySampleSize(minSample)])
          .map(filter(filterByAge(maxAge)))
          .validate([isDataEmpty("No listings passed maxAgeDays")])
          .map(map(toPrices))
          .map(filterInvalidPrices)
          .validate([isDataEmpty("No valid prices")])
          .map(mean)
          .map(targetPrice(increment))
          .map(applyFloorAndCeiling(floor, ceiling)),
      );
    },
  );

  return map(compileRule(currency), rules);
});

const pricesByData = applyRules(sampleCriteria);

map((fn: any) => fn(sampleSnapshot), pricesByData).map((result) =>
  console.log(result.isErr() ? result.unwrapErr() : result.safeUnwrap()),
);
