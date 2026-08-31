import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RoomCard, RoomCardSkeleton } from '../components/rooms/RoomCard';
import { useLanguage } from '../context/LanguageContext';
import { MOCK_POPULAR_LOCATIONS } from '../data/mockPopularLocations';
import { getAllRooms } from '../services/roomService';
import { ROOM_CATEGORIES, type Room, type StayDuration } from '../types';

const CATEGORY_EMOJI: Record<string, string> = {
  budget: '💰',
  premium: '✨',
  couple_friendly: '💞',
  business: '💼',
  family: '👨‍👩‍👧',
};

export function HomePage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[] | null>(null);
  const [duration, setDuration] = useState<StayDuration>('hourly');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getAllRooms().then(setRooms);
  }, []);

  const submitSearch = () => {
    navigate(`/search?q=${encodeURIComponent(searchText)}`);
  };

  return (
    <div className="pb-6">
      {/* Search hero */}
      <div className="px-4 pt-2">
        <div
          onClick={() => navigate('/search')}
          className="flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-3 text-sm text-gray-400 shadow-lg shadow-pink/10 ring-1 ring-pink-tint"
        >
          <span>🔍</span>
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.key === 'Enter' && submitSearch()}
            placeholder={t('searchPlaceholder')}
            className="flex-1 bg-transparent text-gray-700 outline-none placeholder:text-gray-400"
          />
        </div>

        {/* Promo banner, OYO-style */}
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-gradient-to-r from-pink-cta to-teal-cta p-4 text-white">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
              Hyderabad Launch Offer
            </p>
            <p className="text-lg font-bold">Rooms from ₹99/hour</p>
          </div>
          <span className="text-3xl">🎉</span>
        </div>

        {/* Hourly / Overnight toggle */}
        <div className="mt-4 flex rounded-full bg-pink-tint p-1">
          {(['hourly', 'overnight'] as StayDuration[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDuration(d)}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
                duration === d ? 'bg-pink-cta text-white shadow' : 'text-on-pink'
              }`}
            >
              {t(d)}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="mt-6">
        <h2 className="px-4 text-base font-bold text-gray-900">{t('categories')}</h2>
        <div className="mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
          {ROOM_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/search?category=${cat.id}`}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-pink-tint bg-white px-3 py-2 text-xs font-medium text-on-pink shadow-sm"
            >
              <span>{CATEGORY_EMOJI[cat.id] ?? '🏷️'}</span>
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Nearby rooms */}
      <section className="mt-6">
        <h2 className="px-4 text-base font-bold text-gray-900">{t('nearbyRooms')}</h2>
        <div className="mt-3 flex gap-3 overflow-x-auto px-4 pb-1">
          {rooms
            ? rooms.slice(0, 4).map((r) => <RoomCard key={r.id} room={r} />)
            : Array.from({ length: 3 }).map((_, i) => <RoomCardSkeleton key={i} />)}
        </div>
      </section>

      {/* Popular locations */}
      <section className="mt-6">
        <h2 className="px-4 text-base font-bold text-gray-900">{t('popularLocations')}</h2>
        <div className="mt-3 flex gap-3 overflow-x-auto px-4 pb-1">
          {MOCK_POPULAR_LOCATIONS.map((loc) => (
            <Link
              key={loc.id}
              to={`/search?q=${encodeURIComponent(loc.name)}`}
              className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl"
            >
              <img src={loc.imageUrl} alt={loc.name} className="h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute bottom-1.5 left-2 text-xs font-semibold text-white">{loc.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recommended */}
      <section className="mt-6">
        <h2 className="px-4 text-base font-bold text-gray-900">{t('recommended')}</h2>
        <div className="mt-3 flex gap-3 overflow-x-auto px-4 pb-1">
          {rooms
            ? [...rooms].reverse().map((r) => <RoomCard key={r.id} room={r} />)
            : Array.from({ length: 3 }).map((_, i) => <RoomCardSkeleton key={i} />)}
        </div>
      </section>

      {/* Become a host CTA */}
      <div className="mx-4 mt-6 rounded-2xl border border-dashed border-teal-cta bg-teal-tint p-4 text-center">
        <p className="text-sm text-on-teal">Have a spare room in Hyderabad?</p>
        <Link
          to="/host"
          className="mt-2 inline-block rounded-full bg-teal-cta px-5 py-2 text-sm font-semibold text-white"
        >
          {t('hostAListing')}
        </Link>
      </div>
    </div>
  );
}
