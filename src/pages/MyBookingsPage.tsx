import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BrandHeaderBar } from '../components/layout/BrandHeaderBar';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../lib/format';
import { getBookingsForUser } from '../services/bookingService';
import { BOOKING_DURATION_LABEL, type Booking } from '../types';

export function MyBookingsPage() {
  const { user, signIn, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [pendingSync, setPendingSync] = useState<Set<string>>(new Set());
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    if (!user) {
      setBookings(null);
      return;
    }
    getBookingsForUser(user.uid).then((res) => {
      setBookings(res.bookings);
      setPendingSync(res.pendingSync);
    });
  }, [user]);

  const handleSignIn = async () => {
    setSigningIn(true);
    try {
      await signIn();
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div className="pb-6">
      <BrandHeaderBar />

      <div className="px-4 pt-4">
        {!authLoading && !user && (
          <div className="mt-4 rounded-2xl border border-pink-tint bg-white p-5 text-center">
            <p className="text-sm text-gray-500">Sign in to see your bookings.</p>
            <button
              type="button"
              onClick={handleSignIn}
              disabled={signingIn}
              className="mt-3 rounded-full bg-pink-cta px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {signingIn ? 'Signing in…' : 'Sign in with Google'}
            </button>
          </div>
        )}

        {user && bookings === null && <p className="mt-6 text-center text-sm text-gray-400">Loading…</p>}

        {user && bookings !== null && bookings.length === 0 && (
          <div className="mt-10 text-center">
            <p className="text-sm text-gray-400">No bookings yet.</p>
            <Link
              to="/"
              className="mt-3 inline-block rounded-full bg-pink-cta px-5 py-2 text-sm font-semibold text-white"
            >
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
                <p className="text-sm font-extrabold text-gray-900">
                  {formatPrice(b.baseAmount + b.taxAmount + b.platformFee)}
                </p>
                {pendingSync.has(b.id) ? (
                  <span className="mt-1 inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                    syncing…
                  </span>
                ) : (
                  <span className="mt-1 inline-block rounded-full bg-teal-tint px-2 py-0.5 text-[10px] font-semibold text-on-teal">
                    {b.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
