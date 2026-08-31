import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getRoomById } from '../services/roomService';
import type { Room } from '../types';

const AMENITY_LABELS: [keyof Room, string, string][] = [
  ['hasAc', '❄️', 'Air Conditioning'],
  ['hasParking', '🅿️', 'Parking'],
  ['hasBathroom', '🚿', 'Private Bathroom'],
  ['hasWifi', '📶', 'WiFi'],
  ['isInstantBook', '⚡', 'Instant Book'],
  ['isWomenFriendly', '👩', 'Women Friendly'],
];

export function RoomDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null | undefined>(undefined);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!id) return;
    getRoomById(id).then((r) => setRoom(r ?? null));
  }, [id]);

  if (room === undefined) {
    return <div className="p-6 text-center text-sm text-gray-400">Loading room…</div>;
  }
  if (room === null) {
    return <div className="p-6 text-center text-sm text-gray-400">Room not found.</div>;
  }

  return (
    <div className="pb-28">
      <div className="relative h-72 w-full overflow-hidden bg-pink-tint">
        <img src={room.imageUrls[activeImg] ?? room.imageUrl} alt={room.title} className="h-full w-full object-cover" />
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-lg shadow"
        >
          ←
        </button>
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {room.imageUrls.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveImg(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === activeImg ? 'w-5 bg-white' : 'w-1.5 bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="px-4 pt-4">
        <h1 className="text-xl font-bold text-gray-900">{room.title}</h1>
        <p className="mt-1 text-sm text-gray-500">{room.address}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="rounded-full bg-pink-tint px-2 py-0.5 text-xs font-semibold text-on-pink">
            ★ {room.rating.toFixed(1)} ({room.reviewCount})
          </span>
          {room.isAvailableNow ? (
            <span className="rounded-full bg-teal-tint px-2 py-0.5 text-xs font-semibold text-on-teal">
              Available Now
            </span>
          ) : (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
              Next available soon
            </span>
          )}
        </div>

        {/* Host card */}
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-pink-tint p-3">
          <img src={room.host.photoUrl} alt={room.host.name} className="h-11 w-11 rounded-full object-cover" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">
              {room.host.name} {room.host.isVerified && <span className="text-teal-cta">✓</span>}
            </p>
            <p className="text-xs text-gray-500">
              ★ {room.host.rating.toFixed(1)} · {room.host.reviewCount} reviews
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-gray-600">{room.description}</p>

        {/* Amenities */}
        <div className="mt-4">
          <h2 className="text-sm font-bold text-gray-900">Amenities</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {AMENITY_LABELS.filter(([key]) => room[key]).map(([key, icon, label]) => (
              <span
                key={key}
                className="flex items-center gap-1 rounded-full border border-pink-tint bg-white px-2.5 py-1 text-xs text-gray-600"
              >
                {icon} {label}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-pink-tint bg-pink-tint p-3">
            <p className="text-xs text-on-pink">Hourly</p>
            <p className="text-lg font-bold text-on-pink">₹{room.pricePerHour}</p>
          </div>
          <div className="rounded-2xl border border-teal-tint bg-teal-tint p-3">
            <p className="text-xs text-on-teal">Overnight</p>
            <p className="text-lg font-bold text-on-teal">₹{room.pricePerNight}</p>
          </div>
        </div>
      </div>

      {/* Sticky booking bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 mx-auto flex max-w-md items-center justify-between border-t border-pink-tint bg-white p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <div>
          <p className="text-xs text-gray-400">Starting at</p>
          <p className="text-lg font-bold text-gray-900">₹{room.pricePerHour}/hr</p>
        </div>
        <Link
          to={`/booking/${room.id}`}
          className="rounded-full bg-pink-cta px-6 py-3 text-sm font-semibold text-white shadow"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
