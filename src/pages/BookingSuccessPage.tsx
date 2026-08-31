import { useLocation, useNavigate } from 'react-router-dom';
import type { Booking } from '../types';

export function BookingSuccessPage() {
  const { state } = useLocation() as { state: { booking?: Booking } | null };
  const navigate = useNavigate();
  const booking = state?.booking;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-tint text-4xl">✅</div>
      <h1 className="mt-5 text-xl font-bold text-gray-900">Booking Confirmed!</h1>
      {booking && (
        <p className="mt-2 text-sm text-gray-500">
          {booking.roomTitle} · ₹{booking.baseAmount + booking.taxAmount + booking.platformFee}
        </p>
      )}
      <p className="mt-1 text-xs text-gray-400">Booking ID: {booking?.id ?? '—'}</p>

      <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
        <button
          type="button"
          onClick={() => navigate('/bookings')}
          className="w-full rounded-full bg-pink-cta py-3 text-sm font-semibold text-white shadow"
        >
          View My Bookings
        </button>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="w-full rounded-full border border-pink-tint py-3 text-sm font-semibold text-on-pink"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
