import { type ComponentType, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CallToBookBar } from '../components/layout/CallToBookBar';
import { LanguageToggle } from '../components/layout/LanguageToggle';
import { RoomCard, RoomCardSkeleton } from '../components/rooms/RoomCard';
import { useLanguage } from '../context/LanguageContext';
import { HYDERABAD_AREAS } from '../data/areas';
import { formatPrice } from '../lib/format';
import { getAllRooms } from '../services/roomService';
import type { Room } from '../types';

const ROTATING_LINES = ['Refresh your time.', 'Rest for your thoughts.', 'Reset your mind.', 'Relax your heart.'];

function RotatingPromoCard() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % ROTATING_LINES.length), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <button
      type="button"
      onClick={() => setIndex((i) => (i + 1) % ROTATING_LINES.length)}
      className="rounded-xl border border-pink-tint bg-pink-tint p-4 text-left"
    >
      <p className="min-h-[28px] text-lg font-semibold text-on-pink">{ROTATING_LINES[index]}</p>
      <div className="mt-2 flex gap-1.5">
        {ROTATING_LINES.map((line, i) => (
          <span
            key={line}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? 'w-5 bg-pink-cta' : 'w-1.5 bg-pink-cta/30'
            }`}
          />
        ))}
      </div>
    </button>
  );
}

const AREA_ICON_COLOR = 'text-pink-dark';

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <rect x="6" y="3" width="12" height="18" rx="1" />
      {[7, 10, 13, 16].map((y) => (
        <g key={y}>
          <line x1="9" y1={y} x2="9" y2={y} strokeWidth={2.4} strokeLinecap="round" />
          <line x1="15" y1={y} x2="15" y2={y} strokeWidth={2.4} strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}

function TrainIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <rect x="4" y="5" width="16" height="11" rx="3" />
      <line x1="4" y1="11" x2="20" y2="11" />
      <circle cx="8" cy="19" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="16" cy="19" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CityIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <rect x="3" y="10" width="5" height="11" />
      <rect x="9.5" y="5" width="5" height="16" />
      <rect x="16" y="13" width="5" height="8" />
    </svg>
  );
}

function HouseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <path d="M4 12 L9 7 L14 12 V19 H4 Z" />
      <path d="M13 15 L18 10 L22 14 V19 H13" />
    </svg>
  );
}

const AREA_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  Madhapur: BuildingIcon,
  Secunderabad: TrainIcon,
  Gachibowli: CityIcon,
  'Banjara Hills': HouseIcon,
};

export function HomePage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[] | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState<'nearby' | 'top' | 'ac'>('nearby');

  useEffect(() => {
    getAllRooms().then(setRooms);
  }, []);

  const submitSearch = () => navigate(`/search?q=${encodeURIComponent(searchText)}`);

  const filteredRooms = (rooms ?? []).filter((r) => {
    if (filter === 'ac') return r.hasAc;
    if (filter === 'top') return r.rating >= 4.5;
    return true;
  });

  return (
    <div className="pb-6">
      {/* Full maroon hero — matches rero_home_pink_teal_final.html exactly */}
      <CallToBookBar />
      <div className="bg-pink-dark px-4 pb-4 pt-4">
        <div className="mb-3.5 flex items-start justify-between">
          <img src="/logo.png" alt={t('appName')} className="h-24 w-auto" />
          <div className="flex flex-col items-end gap-1.5">
            <LanguageToggle />
            <span className="inline-flex items-center gap-1 rounded-full bg-teal-tint px-2.5 py-1.5 text-[11px] font-medium text-on-teal">
              📍 Live in Hyderabad
            </span>
          </div>
        </div>

        <div className="mb-3.5 flex items-center gap-2 rounded-[10px] bg-pink-dark-2 px-3 py-2.5">
          <span aria-hidden className="text-base text-bright-teal">✨</span>
          <span className="text-base font-semibold text-pink-on-dark-soft">Refresh. Rest. Reset.</span>
        </div>

        <div className="mb-1.5 flex items-baseline gap-1.5">
          <span className="text-[44px] font-extrabold leading-none text-bright-teal">Rs 99</span>
          <span className="text-[15px] text-pink-on-dark-soft">/ hour</span>
        </div>
        <p className="mb-4 text-[13px] text-pink-on-dark-soft">
          Real homes near you, hosted by real Hyderabad families.
        </p>

        <div className="flex flex-col gap-2.5 rounded-xl bg-pink-dark-2 p-3">
          <div
            onClick={() => navigate('/search')}
            className="flex cursor-pointer items-center gap-2"
          >
            <span aria-hidden>🔍</span>
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.key === 'Enter' && submitSearch()}
              placeholder="Search by area or landmark"
              className="flex-1 bg-transparent text-sm text-pink-on-dark-soft outline-none placeholder:text-pink-on-dark-soft"
            />
          </div>
          <button
            type="button"
            onClick={submitSearch}
            className="rounded-lg bg-pink-cta py-3 text-sm font-medium text-white"
          >
            Find a room near me
          </button>
        </div>
      </div>

      {/* Pill tags */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3.5">
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-pink-tint px-3 py-1.5 text-xs font-medium text-on-pink">
          🛡️ Verified hosts
        </span>
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-teal-tint px-3 py-1.5 text-xs font-medium text-on-teal">
          🏷️ Flat {formatPrice(99)}/hr
        </span>
      </div>

      {/* Promo card stack */}
      <div className="flex flex-col gap-2.5 px-4 pb-2.5">
        <div className="flex items-center justify-between rounded-xl bg-pink-dark p-4">
          <div>
            <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-bright-teal">
              Hyderabad's own
            </p>
            <p className="mb-2.5 text-lg font-medium leading-tight text-white">
              Refresh Spots
              <br />
              Near You
            </p>
            <Link to="/search" className="inline-block rounded-full bg-white px-4 py-2 text-xs font-medium text-pink-dark">
              Explore
            </Link>
          </div>
          <span aria-hidden className="text-4xl text-bright-teal">🏘️</span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-teal-cta p-4">
          <div>
            <p className="text-base font-medium text-white">Weekend Refresh</p>
            <p className="text-xs text-teal-tint">Flat rate, every room</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-teal-tint">Only</p>
            <p className="text-[26px] font-extrabold leading-none text-white">Rs 99</p>
          </div>
        </div>

        <RotatingPromoCard />
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto px-4 py-2.5">
        {(
          [
            ['nearby', 'Nearby'],
            ['top', 'Top rated'],
            ['ac', 'AC rooms'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === key
                ? 'bg-pink-cta text-white'
                : 'border border-gray-300 text-gray-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Nearby homes */}
      <section className="px-4 pt-3">
        <h2 className="mb-2.5 text-[15px] font-semibold text-gray-900">Nearby homes</h2>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {rooms
            ? filteredRooms.slice(0, 6).map((r) => <RoomCard key={r.id} room={r} />)
            : Array.from({ length: 3 }).map((_, i) => <RoomCardSkeleton key={i} />)}
        </div>
      </section>

      {/* Popular Hyderabad areas — two-tone icon cards */}
      <section className="px-4 py-3.5">
        <h2 className="mb-2.5 text-[15px] font-semibold text-gray-900">Popular Hyderabad areas</h2>
        <div className="grid grid-cols-2 gap-2.5">
          {HYDERABAD_AREAS.slice(0, 4).map((area) => {
            const Icon = AREA_ICONS[area.name] ?? BuildingIcon;
            return (
              <Link key={area.name} to={`/search?q=${encodeURIComponent(area.name)}`}>
                <div
                  className={`flex h-14 items-center justify-center rounded-[10px] ${
                    area.tint === 'pink' ? 'bg-pink-tint' : 'bg-teal-tint'
                  }`}
                >
                  <Icon className={`h-8 w-8 ${AREA_ICON_COLOR}`} />
                </div>
                <p className="mt-1.5 text-xs font-medium text-gray-900">{area.name}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
