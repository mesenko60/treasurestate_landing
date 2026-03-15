/**
 * Lodging schema helpers - no Node.js deps, safe for client bundle.
 */
export interface LodgingAccommodation {
  name: string;
  type: string;
  location: string;
  priceRange: string;
  url: string | null;
}

/** Map lodging type string to Schema.org LodgingBusiness subtype */
export function schemaTypeFromLodgingType(type: string): string {
  const t = type.toLowerCase();
  if (t.includes('motel')) return 'Motel';
  if (t.includes('bed') || t.includes('b&b') || t.includes('inn')) return 'BedAndBreakfast';
  if (t.includes('resort')) return 'Resort';
  if (t.includes('hostel')) return 'Hostel';
  if (t.includes('hotel') || t.includes('boutique') || t.includes('chain')) return 'Hotel';
  if (t.includes('lodge') || t.includes('ranch') || t.includes('cabins')) return 'LodgingBusiness';
  return 'LodgingBusiness';
}
