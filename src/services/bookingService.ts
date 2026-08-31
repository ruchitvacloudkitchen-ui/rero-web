import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { getFirebaseDb } from '../lib/firebase';
import { isMockMode } from '../lib/mockMode';
import {
  type Booking,
  type BookingDuration,
  type PaymentMethod,
  basePriceForDuration,
  calculatePriceBreakdown,
} from '../types';
import { getMockRoomById } from '../data/mockRooms';

// Mock mode has no real signed-in user, so bookings are scoped to a
// per-browser mock user id and persisted to localStorage — this makes the
// search -> details -> booking -> My Bookings flow genuinely click-through
// (not just a static mockup) without needing real Firebase Auth wired up.
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
  if (isMockMode()) {
    const room = getMockRoomById(input.roomId);
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

  const docRef = await addDoc(collection(getFirebaseDb(), 'bookings'), {
    ...input,
    userId: MOCK_USER_ID,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  });
  return { id: docRef.id, ...input } as unknown as Booking;
}

export async function getBookingsForUser(): Promise<Booking[]> {
  if (isMockMode()) {
    return Promise.resolve(readMockBookings());
  }
  const q = query(collection(getFirebaseDb(), 'bookings'), where('userId', '==', MOCK_USER_ID));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Booking);
}
