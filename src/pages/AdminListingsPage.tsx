import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { BrandHeaderBar } from '../components/layout/BrandHeaderBar';
import { useAuth } from '../context/AuthContext';
import { getFirebaseDb } from '../lib/firebase';
import { formatPrice } from '../lib/format';
import { approveListing, getPendingListings, isCurrentUserAdmin, rejectListing } from '../services/adminService';
import { ID_TYPE_LABEL, OWNERSHIP_DOC_TYPE_LABEL, type OwnerVerificationInfo, type Room } from '../types';

function OwnerInfoPanel({ roomId }: { roomId: string }) {
  const [info, setInfo] = useState<OwnerVerificationInfo | null | undefined>(undefined);

  useEffect(() => {
    getDoc(doc(getFirebaseDb(), 'rooms', roomId, 'owner_info', 'info'))
      .then((snap) => setInfo(snap.exists() ? (snap.data() as OwnerVerificationInfo) : null))
      .catch(() => setInfo(null));
  }, [roomId]);

  if (info === undefined) return <p className="text-xs text-gray-400">Loading owner info…</p>;
  if (info === null) return <p className="text-xs text-red-500">No owner verification info found.</p>;

  return (
    <div className="rounded-xl bg-gray-50 p-3">
      <p className="text-xs font-semibold text-gray-600">Owner verification</p>
      <p className="mt-1 text-xs text-gray-600">{info.fullName} · {info.phone}</p>
      <p className="text-xs text-gray-600">
        {ID_TYPE_LABEL[info.idType]}: {info.idNumber}
      </p>
      <p className="mt-1 text-xs text-gray-500">{OWNERSHIP_DOC_TYPE_LABEL[info.ownershipDocType]}:</p>
      <div className="mt-1 flex gap-2 overflow-x-auto">
        {info.idDocumentUrls.map((url) => (
          <a key={url} href={url} target="_blank" rel="noreferrer">
            <img src={url} alt="Ownership document" className="h-16 w-16 rounded-lg border border-gray-200 object-cover" />
          </a>
        ))}
      </div>
    </div>
  );
}

function ListingCard({ room, onDecided }: { room: Room; onDecided: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);

  const handleApprove = async () => {
    setBusy(true);
    try {
      await approveListing(room.id);
      onDecided();
    } finally {
      setBusy(false);
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) return;
    setBusy(true);
    try {
      await rejectListing(room.id, reason.trim());
      onDecided();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-pink-tint bg-white">
      <button type="button" onClick={() => setExpanded((e) => !e)} className="flex w-full items-center gap-3 p-3 text-left">
        <img src={room.imageUrl} alt={room.title} className="h-16 w-16 shrink-0 rounded-xl bg-[#ECE7E9] object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900">{room.title || 'Untitled listing'}</p>
          <p className="truncate text-xs text-gray-500">{room.address}</p>
          <p className="mt-1 text-xs font-semibold text-pink-cta">
            {formatPrice(room.pricePerHour)}/hr · {formatPrice(room.pricePerNight)}/night
          </p>
        </div>
        <span className="text-gray-300">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="flex flex-col gap-3 border-t border-pink-tint p-3">
          {room.imageUrls?.length > 0 && (
            <div className="flex gap-2 overflow-x-auto">
              {room.imageUrls.map((url) => (
                <img key={url} src={url} alt="" className="h-20 w-28 shrink-0 rounded-lg object-cover" />
              ))}
            </div>
          )}
          <p className="text-xs text-gray-600">{room.description}</p>
          <p className="text-xs text-gray-500">
            Max guests: {room.maxGuests ?? '—'} · Min booking: {room.minBookingHours ?? '—'}h
          </p>

          <OwnerInfoPanel roomId={room.id} />

          {!rejecting ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleApprove}
                disabled={busy}
                className="flex-1 rounded-full bg-teal-cta py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {busy ? '…' : 'Approve'}
              </button>
              <button
                type="button"
                onClick={() => setRejecting(true)}
                disabled={busy}
                className="flex-1 rounded-full border border-red-300 py-2.5 text-sm font-semibold text-red-600 disabled:opacity-60"
              >
                Reject
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason for rejection (shown to the host)"
                rows={2}
                className="w-full resize-none rounded-xl border border-red-200 px-3 py-2 text-sm outline-none"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={busy || !reason.trim()}
                  className="flex-1 rounded-full bg-red-600 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
                >
                  {busy ? '…' : 'Confirm reject'}
                </button>
                <button
                  type="button"
                  onClick={() => setRejecting(false)}
                  className="rounded-full border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function AdminListingsPage() {
  const { user, loading: authLoading } = useAuth();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [listings, setListings] = useState<Room[] | null>(null);

  const reload = () => getPendingListings().then(setListings);

  useEffect(() => {
    if (!user) return;
    isCurrentUserAdmin(user.uid).then((ok) => {
      setAllowed(ok);
      if (ok) reload();
    });
  }, [user]);

  if (authLoading || allowed === null) {
    return <div className="p-6 text-center text-sm text-gray-400">Loading…</div>;
  }

  if (!user || !allowed) {
    return (
      <div className="p-6 text-center text-sm text-gray-400">
        Not authorized. Admin access is granted manually in the Firebase console (set your own users/{'{'}uid{'}'}{' '}
        doc's <code>isAdmin</code> field to <code>true</code>).
      </div>
    );
  }

  return (
    <div className="pb-6">
      <BrandHeaderBar backLabel="Admin — Pending Listings" tagline={false} />
      <div className="p-4">
        {listings === null && <p className="text-center text-sm text-gray-400">Loading…</p>}
        {listings !== null && listings.length === 0 && (
          <p className="text-center text-sm text-gray-400">No listings waiting for review.</p>
        )}
        <div className="flex flex-col gap-3">
          {listings?.map((room) => (
            <ListingCard key={room.id} room={room} onDecided={reload} />
          ))}
        </div>
      </div>
    </div>
  );
}
