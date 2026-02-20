import type { Criteria } from "../src/types/criteria";

export const sampleCriteria: Criteria = {
  criteriaId: "CRITERIA-1",
  currency: "USD",
  rules: [
    {
      id: "ZONE_RULE",
      label: "Zone Z1 + 10",
      target: {
        type: "zone",
        zoneIds: ["Z1"],
      },
      increment: 10,
      minSample: 2,
      maxAgeDays: 1,
      floor: 130,
      ceiling: 200,
    },
    {
      id: "SECTION_RULE",
      label: "Section 201 + 5",
      target: {
        type: "section",
        sectionIds: ["201"],
      },
      increment: 5,
      minSample: 1,
      maxAgeDays: 1,
      floor: 10,
      ceiling: 80,
    },
    {
      id: "PROXIMITY_RULE",
      label: "Near section 301 + 0",
      target: {
        type: "proximity",
        ofSectionId: "301",
        radius: 1,
      },
      increment: 0,
      minSample: 2,
      maxAgeDays: 2,
      floor: 0,
      ceiling: 1250,
    },
    {
      id: "EMPTY_RULE",
      label: "empty",
      target: {
        type: "zone",
        zoneIds: ["Z4"],
      },
      increment: 0,
      minSample: 2,
      maxAgeDays: 2,
      floor: 0,
      ceiling: 1250,
    },
    {
      id: "UNKNOWN_RULE",
      label: "unknown",
      target: {
        type: "unknown",
      },
      increment: 0,
      minSample: 2,
      maxAgeDays: 2,
      floor: 0,
      ceiling: 1250,
    },
  ],
};
