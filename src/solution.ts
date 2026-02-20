import { compose, curry, filter, map, mean, values } from "ramda";
import { sampleCriteria } from "../data/Criteria.js";
import { sampleSnapshot } from "../data/Snapshot.js";
import type { PriceResult, PricingRule } from "./types/criteria.js";
import type { Listing } from "./types/market.js";
import {
  filterByAge,
  filterByKey,
  getRuleKeyValues,
  toPrices,
  targetPrice,
} from "./helpers.js";

// Sudo Code

// transform rules
// filter data matching to each criteria
// if set in empty or minSample requirement is not met return null
// filter data according to maxAgeDays criteria

// ignore non-finite prices
// price cannot be below zero or floor or above ceiling
// make sure currency is same

const priceByRule = curry(
  (listings: Listing[], rule: PricingRule): PriceResult => {
    const mappedRule = getRuleKeyValues(rule);
    const maxAge = rule.maxAgeDays;
    const increment = rule.increment;
    return compose(
      targetPrice(increment),
      mean,
      compose(map(toPrices), values),
      filter(filterByAge(maxAge!)),
      filter(filterByKey(mappedRule!)),
    )(listings);
  },
);

const rules = sampleCriteria.rules;
const listings = sampleSnapshot.listings;

const result = map(priceByRule(listings), rules);

console.log("RESULTS", result);
