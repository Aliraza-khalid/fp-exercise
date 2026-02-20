export type ID = string;

export interface EventMeta {
  eventId: ID;
  name: string;
  venue: string;
  dateISO: string;
  currency: string;
}

// Flat row for a seat
export interface Listing {
  eventId: ID;
  zoneId: ID;
  sectionId: ID;
  seatId: ID;
  zoneLabel: string;
  zoneName?: string;
  sectionLabel: string;
  sectionName?: string;
  seatNumber: string;
  seatLabel?: string; // e.g., "Row A, Seat 12"
  fullName?: string; // e.g., "Zone 1 - Section 112 - Row A Seat 12"
  listing: ListingSnapshot;
}

// A market snapshot contains a collection of **listings** for a single event
export interface MarketSnapshot {
  event: EventMeta;
  listings: Listing[]; // collection of Listing rows
}

interface ListingSnapshot {
  price: number;
  ageDays: number;
}
