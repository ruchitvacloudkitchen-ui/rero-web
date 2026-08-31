import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BOOKING_DURATION_LABEL, type Booking } from '../types';
import { getBookingsForUser } from '../services/bookingService';

export function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);

  useEffect(() => {
    getBookingsForUser().then(setBookings);
  }, []);

  return (
    <div className="px-4 pb-6 pt-4">
      <h1 className="text-lg font-bold text-gray-900">My Bookings</h1>

      {bookings === null && <p className="mt-6 text-center text-sm text-gray-400">Loading…</p>}

      {bookings !== null && bookings.length === 0 && (
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-400">No bookings yet.</p>
          <Link to="/" className="mt-3 inline-block rounded-full bg-pink-cta px-5 py-2 text-sm font-semibold text-white">
            Find a room
          </Link>
        </div>
      )}

      <div className="mt-4 space-y-3">
        {bookings?.map((b) => (
          <div key={b.id} className="flex items-center gap-3 rounded-2xl border border-pink-tint bg-white p-3">
            <img src={b.roomImageUrl} alt={b.roomTitle} className="h-14 w-14 rounded-xl object-cover" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{b.roomTitle}</p>
              <p className="text-xs text-gray-500">{BOOKING_DURATION_LABEL[b.duration]}</p>
              <p className="text-xs text-gray-400">{new Date(b.createdAt).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">₹{b.baseAmount + b.taxAmount + b.platformFee}</p>
              <span
                className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  b.status === 'confirmed' ? 'bg-teal-tint text-on-teal' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {b.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
