import {
  type Booking,
  type BookingDuration,
  type PaymentMethod,
  basePriceForDuration,
  calculatePriceBreakdown,
} from '../types';
import { getRoomById } from './roomService';

// Firestore's deployed `bookings/{id}` rules require `create` to come from a
// real signed-in user matching `resource.data.userId` (see the reference
// `firestore.rules` in the reri-flutter repo). This web app has no real
// Firebase Auth flow yet — deliberately out of scope for this pass — so a
// booking write can never satisfy that rule regardless of whether
// VITE_FIREBASE_* holds real or placeholder values. Bookings therefore
// always go through this local, per-browser path (real room data included)
// until real Auth is wired up; only then should this switch to a real
// `addDoc`/`getDocs` against Firestore.
const MOCK_USER_ID = 'mock-user-local';
const STORAGE_KEY = 'rero_mock_bookings';

function readMockBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Booking[]) : [];
  } catch {
    return [];
  }
}

function writeMockBookings(bookings: Booking[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export interface CreateBookingInput {
  roomId: string;
  duration: BookingDuration;
  paymentMethod: PaymentMethod;
}

export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  const room = await getRoomById(input.roomId);
  if (!room) throw new Error('Room not found');

  const base = basePriceForDuration(input.duration, room);
  const breakdown = calculatePriceBreakdown(base);

  // Simulated checkout delay, matching the Flutter app's honesty pattern —
  // this is not a real charge, just a delay so "Confirm & Pay" feels real.
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const booking: Booking = {
    id: `booking-${Date.now()}`,
    roomId: room.id,
    roomTitle: room.title,
    roomImageUrl: room.imageUrl,
    userId: MOCK_USER_ID,
    hostId: room.host.id,
    duration: input.duration,
    paymentMethod: input.paymentMethod,
    baseAmount: breakdown.baseAmount,
    taxAmount: breakdown.taxAmount,
    platformFee: breakdown.platformFee,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  const bookings = readMockBookings();
  bookings.unshift(booking);
  writeMockBookings(bookings);
  return booking;
}

export async function getBookingsForUser(): Promise<Booking[]> {
  return Promise.resolve(readMockBookings());
}
