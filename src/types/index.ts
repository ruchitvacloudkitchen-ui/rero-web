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
}

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
