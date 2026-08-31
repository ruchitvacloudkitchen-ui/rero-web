import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BrandHeaderBar } from '../components/layout/BrandHeaderBar';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../lib/format';
import { getMyListings } from '../services/hostListingService';
import type { ListingStatus, Room } from '../types';

const STATUS_BADGE: Record<ListingStatus, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-gray-100 text-gray-500' },
  pending_verification: { label: 'Pending Verification', className: 'bg-amber-50 text-amber-700' },
  live: { label: 'Live', className: 'bg-teal-tint text-on-teal' },
  rejected: { label: 'Rejected', className: 'bg-red-50 text-red-600' },
};

export function HostDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [listings, setListings] = useState<Room[] | null>(null);

  useEffect(() => {
    if (!user) return;
    getMyListings(user.uid).then(setListings);
  }, [user]);

  if (!authLoading && !user) {
    return (
      <div className="p-6 text-center text-sm text-gray-400">
        Sign in from <Link to="/host" className="text-pink-cta">Become a Host</Link> to see your listings.
      </div>
    );
  }

  return (
    <div className="pb-6">
      <BrandHeaderBar backLabel="My Listings" tagline={false} />

      <div className="p-4">
        {listings === null && <p className="text-center text-sm text-gray-400">Loading…</p>}

        {listings !== null && listings.length === 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">You haven't listed a house yet.</p>
            <Link
              to="/host/apply"
              className="mt-3 inline-block rounded-full bg-pink-cta px-5 py-2 text-sm font-semibold text-white"
            >
              List your first house
            </Link>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {listings?.map((room) => {
            const status = room.status ?? 'live';
            const badge = STATUS_BADGE[status];
            return (
              <div key={room.id} className="overflow-hidden rounded-2xl border border-pink-tint bg-white">
                <div className="flex gap-3 p-3">
                  <img
                    src={room.imageUrl}
                    alt={room.title}
                    className="h-16 w-16 rounded-xl bg-[#ECE7E9] object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">{room.title || 'Untitled listing'}</p>
                    <p className="truncate text-xs text-gray-500">{room.address}</p>
                    <p className="mt-1 text-xs font-semibold text-pink-cta">{formatPrice(room.pricePerHour)}/hr</p>
                  </div>
                  <span className={`h-fit shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${badge.className}`}>
                    {badge.label}
                  </span>
                </div>
                {status === 'rejected' && room.rejectionReason && (
                  <p className="border-t border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
                    Reason: {room.rejectionReason}
                  </p>
                )}
                {status === 'pending_verification' && (
                  <p className="border-t border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                    Under review — typically goes live within 24–72 hours.
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {listings !== null && listings.length > 0 && (
          <Link
            to="/host/apply"
            className="mt-4 block w-full rounded-full border border-pink-cta py-3 text-center text-sm font-semibold text-pink-cta"
          >
            + Add another house
          </Link>
        )}
      </div>
    </div>
  );
}
