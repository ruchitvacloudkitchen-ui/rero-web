// Domain types ported from the reri-flutter repo's `features/*/domain/entities/`
// and the Firestore schema documented in that repo's CLAUDE.md. Field names
// and shapes are kept 1:1 with the Flutter app's Firestore documents so the
// same `rooms`/`bookings`/`users`/`popular_locations` collections can back
// both apps without a schema migration.

export type StayDuration = 'hourly' | 'overnight';

export type BookingDuration = 'oneHour' | 'twoHours' | 'threeHours' | 'nightStay';

export const BOOKING_DURATION_LABEL: Record<BookingDuration, string> = {
  oneHour: '1 Hour',
  twoHours: '2 Hours',
  threeHours: '3 Hours',
  nightStay: 'Night Stay',
};

export type PaymentMethod = 'upi' | 'card' | 'netBanking' | 'wallet';

export type BookingStatus = 'confirmed' | 'refunded';

export interface Host {
  id: string;
  name: string;
  photoUrl: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  memberSince?: string; // ISO date
}

export interface Coordinates {
  lat: number;
  lng: number;
}

// A listing's moderation state. Existing mock/seed rooms have no `status`
// field at all and are always treated as `live` (see roomService.ts).
// `draft` is an in-progress host-apply wizard save (see
// hostListingService.ts's getOrCreateDraft/saveDraftProgress) — auto-saved
// on every step, never shown anywhere but the host's own dashboard (which
// filters it out) until actually submitted, at which point it becomes
// `pending_verification`. Flipping a doc's `status` in the Firestore
// console still works, but the admin approval screen is the normal path.
export type ListingStatus = 'draft' | 'pending_verification' | 'live' | 'rejected';

export interface OpenHours {
  start: string; // "HH:mm", 24h
  end: string; // "HH:mm", 24h
}

export interface Room {
  id: string;
  title: string;
  description: string;
  address: string;
  imageUrl: string;
  imageUrls: string[];
  pricePerHour: number;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  categoryIds: string[];
  isAvailableNow: boolean;
  nextAvailableAt?: string;
  createdAt: string;
  location?: Coordinates;
  hasAc: boolean;
  hasParking: boolean;
  hasBathroom: boolean;
  hasWifi: boolean;
  isInstantBook: boolean;
  isWomenFriendly: boolean;
  host: Host;
  status?: ListingStatus;
  rejectionReason?: string;
  propertyType?: PropertyType;
  maxGuests?: number;
  roomSizeSqft?: number;
  minBookingHours?: number;
  openHours?: OpenHours;
  blockedDates?: string[]; // ISO "YYYY-MM-DD", host-set blackout dates
}

export type PropertyType = 'entire_place' | 'private_room';

export const PROPERTY_TYPE_LABEL: Record<PropertyType, { title: string; subtitle: string }> = {
  entire_place: { title: 'An entire place', subtitle: 'Guests have the whole room/flat to themselves' },
  private_room: { title: 'A private room', subtitle: 'Guests have a private room in a shared home' },
};

export type IdType = 'aadhaar' | 'pan' | 'passport';

export const ID_TYPE_LABEL: Record<IdType, string> = {
  aadhaar: 'Aadhaar',
  pan: 'PAN',
  passport: 'Passport',
};

// Proof the submitter actually owns/can list this specific property —
// distinct from idType/idNumber above (personal identity). A photo/scan of
// one of these gets uploaded to Storage at host_kyc/{uid}/**.
export type OwnershipDocType = 'aadhaar' | 'utility_bill' | 'property_document';

export const OWNERSHIP_DOC_TYPE_LABEL: Record<OwnershipDocType, string> = {
  aadhaar: 'Aadhaar',
  utility_bill: 'Utility bill',
  property_document: 'Property document',
};

// Written to `rooms/{roomId}/owner_info/info` — never to the public `rooms`
// doc itself. Locked down by Firestore rules to the submitting user (and
// an admin) — see firestore.rules in the reri-flutter repo. idDocumentUrls
// point into Storage's private host_kyc/{uid}/** path, not the public
// room_images/ path photos use.
export interface OwnerVerificationInfo {
  fullName: string;
  phone: string;
  idType: IdType;
  idNumber: string;
  ownershipDocType: OwnershipDocType;
  idDocumentUrls: string[];
  uid: string;
  createdAt: string;
}

export const LISTING_AMENITIES = [
  { key: 'hasAc', label: 'Air Conditioning', icon: '❄️' },
  { key: 'hasWifi', label: 'WiFi', icon: '📶' },
  { key: 'hasBathroom', label: 'Attached Bathroom', icon: '🚿' },
  { key: 'hasParking', label: 'Parking', icon: '🅿️' },
  { key: 'isInstantBook', label: 'Instant Book', icon: '⚡' },
  { key: 'isWomenFriendly', label: 'Women Friendly', icon: '👩' },
] as const;

export interface RoomCategory {
  id: string;
  label: string;
  icon: string; // lucide icon name, see CategoryChip
}

export const ROOM_CATEGORIES: RoomCategory[] = [
  { id: 'budget', label: 'Budget', icon: 'PiggyBank' },
  { id: 'premium', label: 'Premium', icon: 'Award' },
  { id: 'couple_friendly', label: 'Couple Friendly', icon: 'Heart' },
  { id: 'business', label: 'Business', icon: 'Briefcase' },
  { id: 'family', label: 'Family', icon: 'Users' },
];

export interface PriceBreakdown {
  baseAmount: number;
  taxAmount: number;
  platformFee: number;
  totalAmount: number;
}

const TAX_RATE = 0.12;
const PLATFORM_FEE_FLAT = 49;

export function calculatePriceBreakdown(baseAmount: number): PriceBreakdown {
  const taxAmount = Math.round(baseAmount * TAX_RATE);
  const platformFee = PLATFORM_FEE_FLAT;
  return {
    baseAmount,
    taxAmount,
    platformFee,
    totalAmount: baseAmount + taxAmount + platformFee,
  };
}

export function basePriceForDuration(duration: BookingDuration, room: Room): number {
  switch (duration) {
    case 'oneHour':
      return room.pricePerHour;
    case 'twoHours':
      return room.pricePerHour * 2;
    case 'threeHours':
      return room.pricePerHour * 3;
    case 'nightStay':
      return room.pricePerNight;
  }
}

export interface Booking {
  id: string;
  roomId: string;
  roomTitle: string;
  roomImageUrl: string;
  userId: string;
  hostId: string;
  duration: BookingDuration;
  paymentMethod: PaymentMethod;
  baseAmount: number;
  taxAmount: number;
  platformFee: number;
  status: BookingStatus;
  createdAt: string;
}

export interface PopularLocation {
  id: string;
  name: string;
  imageUrl: string;
  order: number;
}

export interface AppUser {
  uid: string;
  displayName: string | null;
  phoneNumber: string | null;
  email: string | null;
  photoUrl: string | null;
  isAnonymous: boolean;
}

export interface WalletTransaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  label: string;
  createdAt: string;
}

export type AppLanguage = 'en' | 'te';
