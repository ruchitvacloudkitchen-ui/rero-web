import { Link } from 'react-router-dom';
import type { Room } from '../../types';
import { formatPrice } from '../../lib/format';

export function RoomCard({
  room,
  className = 'w-[132px] shrink-0',
  imageHeightClass = 'h-20',
}: {
  room: Room;
  className?: string;
  imageHeightClass?: string;
}) {
  return (
    <Link
      to={`/rooms/${room.id}`}
      className={`block overflow-hidden transition-transform active:scale-[0.98] ${className}`}
    >
      <div className={`relative w-full overflow-hidden rounded-[10px] bg-[#ECE7E9] ${imageHeightClass}`}>
        <img src={room.imageUrl} alt={room.title} className="h-full w-full object-cover" loading="lazy" />
        <span className="absolute right-1.5 top-1.5 rounded-md bg-bright-teal px-1.5 py-0.5 text-[10px] font-semibold text-on-teal">
          {formatPrice(room.pricePerHour)}/hr
        </span>
      </div>
      <p className="mt-1.5 truncate text-xs font-medium text-gray-900">{room.title}</p>
      <p className="truncate text-[11px] text-gray-500">
        {room.address.split(',')[0]} · ★ {room.rating.toFixed(1)}
      </p>
    </Link>
  );
}

export function RoomCardSkeleton({ imageHeightClass = 'h-20' }: { imageHeightClass?: string }) {
  return (
    <div className="w-[132px] shrink-0 animate-pulse">
      <div className={`w-full rounded-[10px] bg-pink-tint ${imageHeightClass}`} />
      <div className="mt-1.5 space-y-1.5">
        <div className="h-3 w-3/4 rounded bg-pink-tint" />
        <div className="h-2.5 w-1/2 rounded bg-pink-tint" />
      </div>
    </div>
  );
}
