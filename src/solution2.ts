import { compose, filter, map, mean, values } from "ramda";
import { sampleCriteria } from "../data/Criteria.js";
import { sampleSnapshot } from "../data/Snapshot.js";
import type { PricingRule } from "./types/criteria.js";
import {
  filterByAge,
  filterByKey,
  getRuleKeyValues,
  toPrices,
  targetPrice,
} from "./helpers.js";

// Sudo Code

// [DONE] transform rules
// [DONE] filter data matching to each criteria
// if set in empty or minSample requirement is not met return null
// [DONE] filter data according to maxAgeDays criteria

// ignore non-finite prices
// price cannot be below zero or floor or above ceiling
// make sure currency is same

const priceByRule = (rule: PricingRule) => {
  const mappedRule = getRuleKeyValues(rule);
  const maxAge = rule.maxAgeDays;
  const increment = rule.increment;
  return compose(
    // check price ceiling & floor
    targetPrice(increment),
    mean,
    // filter non finite prices
    compose(map(toPrices), values),
    filter(filterByAge(maxAge!)),
    // check for min sample
    filter(filterByKey(mappedRule!)),
    // validate currency
  );
};

const rules = sampleCriteria.rules;
const listings = sampleSnapshot.listings;

// const rule1 = rules[0]!;
// console.log(priceByRule(rule1)(data.listings))

const pricesByData = map(priceByRule, rules);
// console.log(priceByRules[0](data.listings))
// console.log(map((fn) => fn(data.listings), priceByRules));

const result = map((fn) => fn(listings), pricesByData);

console.log("RESULTS", result);
