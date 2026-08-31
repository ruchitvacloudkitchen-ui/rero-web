import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { getFirebaseDb } from '../lib/firebase';
import { isMockMode } from '../lib/mockMode';
import {
  type Booking,
  type BookingDuration,
  type PaymentMethod,
  basePriceForDuration,
  calculatePriceBreakdown,
} from '../types';
import { getRoomById } from './roomService';

// Bookings write to Firestore for a real signed-in user (the deployed
// `bookings/{id}` rule requires `request.auth.uid == resource.data.userId`
// — see reri-flutter's firestore.rules). localStorage is only an offline
// fallback if that write itself fails (e.g. no network) — not the default
// path anymore. Mock mode (no real Firebase config) still uses localStorage
// unconditionally, same as before, since there's no real backend to write to.
const PENDING_STORAGE_KEY = 'rero_pending_bookings'; // offline-fallback writes only
const MOCK_STORAGE_KEY = 'rero_mock_bookings'; // full mock-mode path

function readLocalBookings(key: string): Booking[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Booking[]) : [];
  } catch {
    return [];
  }
}

function writeLocalBookings(key: string, bookings: Booking[]) {
  localStorage.setItem(key, JSON.stringify(bookings));
}

export interface CreateBookingInput {
  roomId: string;
  duration: BookingDuration;
  paymentMethod: PaymentMethod;
  userId: string;
}

export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  const room = await getRoomById(input.roomId);
  if (!room) throw new Error('Room not found');

  const base = basePriceForDuration(input.duration, room);
  const breakdown = calculatePriceBreakdown(base);

  // Simulated checkout delay, matching the Flutter app's honesty pattern —
  // this is not a real charge, just a delay so "Confirm & Pay" feels real.
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const bookingBase = {
    roomId: room.id,
    roomTitle: room.title,
    roomImageUrl: room.imageUrl,
    userId: input.userId,
    hostId: room.host.id,
    duration: input.duration,
    paymentMethod: input.paymentMethod,
    baseAmount: breakdown.baseAmount,
    taxAmount: breakdown.taxAmount,
    platformFee: breakdown.platformFee,
    status: 'confirmed' as const,
  };

  if (isMockMode()) {
    const booking: Booking = { id: `booking-${Date.now()}`, ...bookingBase, createdAt: new Date().toISOString() };
    const bookings = readLocalBookings(MOCK_STORAGE_KEY);
    bookings.unshift(booking);
    writeLocalBookings(MOCK_STORAGE_KEY, bookings);
    return booking;
  }

  try {
    const docRef = await addDoc(collection(getFirebaseDb(), 'bookings'), {
      ...bookingBase,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...bookingBase, createdAt: new Date().toISOString() };
  } catch (err) {
    // Offline fallback only — e.g. no network, or a transient Firestore
    // error. Tagged so My Bookings can show it as pending-sync rather than
    // silently merging it in as if it were confirmed server-side.
    console.error('Real booking write failed, falling back to local storage:', err);
    const booking: Booking = { id: `pending-${Date.now()}`, ...bookingBase, createdAt: new Date().toISOString() };
    const pending = readLocalBookings(PENDING_STORAGE_KEY);
    pending.unshift(booking);
    writeLocalBookings(PENDING_STORAGE_KEY, pending);
    return booking;
  }
}

export async function getBookingsForUser(userId: string): Promise<{ bookings: Booking[]; pendingSync: Set<string> }> {
  if (isMockMode()) {
    return { bookings: readLocalBookings(MOCK_STORAGE_KEY), pendingSync: new Set() };
  }

  const q = query(collection(getFirebaseDb(), 'bookings'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  const remote = snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      createdAt: data.createdAt?.toDate?.().toISOString?.() ?? new Date().toISOString(),
    } as Booking;
  });

  const pending = readLocalBookings(PENDING_STORAGE_KEY).filter((b) => b.userId === userId);
  const merged = [...pending, ...remote].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return { bookings: merged, pendingSync: new Set(pending.map((b) => b.id)) };
}
