import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DurationSelector } from '../components/booking/DurationSelector';
import { PriceBreakdownCard } from '../components/booking/PriceBreakdownCard';
import { BrandHeaderBar } from '../components/layout/BrandHeaderBar';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../lib/format';
import { createBooking } from '../services/bookingService';
import { getRoomById } from '../services/roomService';
import {
  type BookingDuration,
  type PaymentMethod,
  type Room,
  basePriceForDuration,
  calculatePriceBreakdown,
} from '../types';

const PAYMENT_METHODS: { key: PaymentMethod; label: string; icon: string }[] = [
  { key: 'upi', label: 'UPI', icon: '📱' },
  { key: 'card', label: 'Card', icon: '💳' },
  { key: 'netBanking', label: 'Net Banking', icon: '🏦' },
  { key: 'wallet', label: 'Wallet', icon: '👛' },
];

export function BookingPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  const [room, setRoom] = useState<Room | null | undefined>(undefined);
  const [duration, setDuration] = useState<BookingDuration>('oneHour');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [submitting, setSubmitting] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) return;
    getRoomById(roomId).then((r) => setRoom(r ?? null));
  }, [roomId]);

  if (room === undefined) {
    return <div className="p-6 text-center text-sm text-gray-400">Loading…</div>;
  }
  if (room === null) {
    return <div className="p-6 text-center text-sm text-gray-400">Room not found.</div>;
  }

  const breakdown = calculatePriceBreakdown(basePriceForDuration(duration, room));

  // Sign-in is only required here, at Confirm & Pay — browsing/searching
  // rooms never gates on auth. Firestore's deployed `bookings` rule needs a
  // real signed-in user matching the booking's userId, so we get one first.
  const confirm = async () => {
    setSignInError(null);
    setSubmitting(true);
    try {
      let currentUser = user;
      if (!currentUser) {
        try {
          currentUser = await signIn();
        } catch {
          setSignInError('Sign-in was cancelled or failed — try again to confirm your booking.');
          return;
        }
      }
      const booking = await createBooking({
        roomId: room.id,
        duration,
        paymentMethod,
        userId: currentUser.uid,
      });
      navigate('/booking/success', { state: { booking } });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pb-28">
      <BrandHeaderBar backLabel="Back" tagline={false} />

      <div className="p-4">
        <div className="flex items-center gap-3 rounded-2xl border border-pink-tint p-3">
          <img src={room.imageUrl} alt={room.title} className="h-14 w-14 rounded-xl object-cover" />
          <div>
            <p className="text-sm font-semibold text-gray-900">{room.title}</p>
            <p className="text-xs text-gray-500">{room.address}</p>
          </div>
        </div>

        <h2 className="mb-2 mt-5 text-sm font-bold text-gray-900">Choose duration</h2>
        <DurationSelector room={room} value={duration} onChange={setDuration} />

        <h2 className="mb-2 mt-5 text-sm font-bold text-gray-900">Payment method</h2>
        <div className="grid grid-cols-2 gap-2">
          {PAYMENT_METHODS.map((pm) => (
            <button
              key={pm.key}
              type="button"
              onClick={() => setPaymentMethod(pm.key)}
              className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium ${
                paymentMethod === pm.key
                  ? 'border-teal-cta bg-teal-tint text-on-teal'
                  : 'border-gray-200 bg-white text-gray-700'
              }`}
            >
              <span>{pm.icon}</span> {pm.label}
            </button>
          ))}
        </div>

        <div className="mt-5">
          <PriceBreakdownCard breakdown={breakdown} />
        </div>

        {!user && (
          <p className="mt-3 rounded-xl bg-teal-tint p-3 text-xs text-on-teal">
            You'll be asked to sign in with Google to confirm this booking.
          </p>
        )}
        {signInError && <p className="mt-3 rounded-xl bg-red-50 p-3 text-xs text-red-600">{signInError}</p>}

        <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-700">
          This is a simulated checkout — no real payment gateway is connected yet, so no money will actually move.
        </p>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-md border-t border-pink-tint bg-white p-4">
        <button
          type="button"
          onClick={confirm}
          disabled={submitting}
          className="w-full rounded-full bg-pink-cta py-3 text-sm font-semibold text-white shadow disabled:opacity-60"
        >
          {submitting
            ? user
              ? 'Confirming…'
              : 'Signing in…'
            : `${user ? 'Confirm & Pay' : 'Sign in & Confirm'} ${formatPrice(breakdown.totalAmount)}`}
        </button>
      </div>
    </div>
  );
}
