import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RoomCard, RoomCardSkeleton } from '../components/rooms/RoomCard';
import { searchRooms } from '../services/roomService';
import { ROOM_CATEGORIES, type Room } from '../types';

const FILTER_CHIPS = [
  { key: 'hasAc', label: 'AC' },
  { key: 'hasParking', label: 'Parking' },
  { key: 'hasWifi', label: 'WiFi' },
  { key: 'isInstantBook', label: 'Instant Book' },
  { key: 'isWomenFriendly', label: 'Women Friendly' },
] as const;

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const [text, setText] = useState(params.get('q') ?? '');
  const [category, setCategory] = useState(params.get('category') ?? '');
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [rooms, setRooms] = useState<Room[] | null>(null);

  useEffect(() => {
    searchRooms(text).then(setRooms);
  }, [text]);

  const toggleFilter = (key: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const results = (rooms ?? []).filter((r) => {
    if (category && !r.categoryIds.includes(category)) return false;
    for (const key of activeFilters) {
      if (!(r as unknown as Record<string, boolean>)[key]) return false;
    }
    return true;
  });

  return (
    <div className="px-4 pb-6 pt-2">
      <div className="flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm shadow-lg shadow-pink/10 ring-1 ring-pink-tint">
        <span>🔍</span>
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setParams((p) => {
              const next = new URLSearchParams(p);
              next.set('q', e.target.value);
              return next;
            });
          }}
          placeholder="Search rooms, areas..."
          className="flex-1 bg-transparent text-gray-700 outline-none placeholder:text-gray-400"
          autoFocus
        />
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setCategory('')}
          className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${
            category === '' ? 'border-pink-cta bg-pink-cta text-white' : 'border-pink-tint bg-white text-on-pink'
          }`}
        >
          All
        </button>
        {ROOM_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategory(cat.id === category ? '' : cat.id)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${
              category === cat.id ? 'border-pink-cta bg-pink-cta text-white' : 'border-pink-tint bg-white text-on-pink'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
        {FILTER_CHIPS.map((chip) => (
          <button
            key={chip.key}
            type="button"
            onClick={() => toggleFilter(chip.key)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${
              activeFilters.has(chip.key)
                ? 'border-teal-cta bg-teal-cta text-white'
                : 'border-teal-tint bg-white text-on-teal'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <p className="mt-3 text-xs text-gray-400">{results.length} rooms found</p>

      <div className="mt-2 grid grid-cols-2 gap-3">
        {rooms === null
          ? Array.from({ length: 4 }).map((_, i) => <RoomCardSkeleton key={i} />)
          : results.map((r) => <RoomCard key={r.id} room={r} className="w-full" />)}
      </div>

      {rooms !== null && results.length === 0 && (
        <p className="mt-8 text-center text-sm text-gray-400">No rooms match these filters yet.</p>
      )}
    </div>
  );
}
