import { Link } from 'react-router-dom';
import type { Room } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

export function RoomCard({ room, className = 'w-64 shrink-0' }: { room: Room; className?: string }) {
  const { t } = useLanguage();

  return (
    <Link
      to={`/rooms/${room.id}`}
      className={`block overflow-hidden rounded-2xl border border-pink-tint bg-white shadow-sm transition-transform active:scale-[0.98] ${className}`}
    >
      <div className="relative h-36 w-full overflow-hidden bg-pink-tint">
        <img src={room.imageUrl} alt={room.title} className="h-full w-full object-cover" loading="lazy" />
        {room.isAvailableNow && (
          <span className="absolute left-2 top-2 rounded-full bg-teal-cta px-2 py-0.5 text-[10px] font-semibold text-white shadow">
            {t('availableNow')}
          </span>
        )}
        <span className="absolute right-2 top-2 flex items-center gap-0.5 rounded-full bg-white/90 px-1.5 py-0.5 text-[11px] font-semibold text-on-pink">
          ★ {room.rating.toFixed(1)}
        </span>
      </div>
      <div className="p-3">
        <h3 className="truncate text-sm font-semibold text-gray-900">{room.title}</h3>
        <p className="truncate text-xs text-gray-500">{room.address}</p>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-xs text-gray-400">{t('startingAt')}</span>
          <span className="text-base font-bold text-pink-cta">₹{room.pricePerHour}</span>
          <span className="text-xs text-gray-400">{t('perHour')}</span>
        </div>
      </div>
    </Link>
  );
}

export function RoomCardSkeleton() {
  return (
    <div className="w-64 shrink-0 animate-pulse overflow-hidden rounded-2xl border border-pink-tint bg-white shadow-sm">
      <div className="h-36 w-full bg-pink-tint" />
      <div className="space-y-2 p-3">
        <div className="h-4 w-3/4 rounded bg-pink-tint" />
        <div className="h-3 w-1/2 rounded bg-pink-tint" />
        <div className="h-4 w-1/3 rounded bg-pink-tint" />
      </div>
    </div>
  );
}
