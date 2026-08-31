import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const TABS = [
  { to: '/', key: 'home', icon: '🏠' },
  { to: '/search', key: 'search', icon: '🔍' },
  { to: '/bookings', key: 'bookings', icon: '🗓️' },
  { to: '/wallet', key: 'wallet', icon: '👛' },
  { to: '/profile', key: 'profile', icon: '👤' },
] as const;

export function BottomNav() {
  const { t } = useLanguage();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 mx-auto flex max-w-md items-stretch justify-between border-t border-pink-tint bg-white/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition-colors ${
              isActive ? 'text-pink-cta' : 'text-gray-400'
            }`
          }
        >
          <span className="text-lg leading-none">{tab.icon}</span>
          {t(tab.key)}
        </NavLink>
      ))}
    </nav>
  );
}
