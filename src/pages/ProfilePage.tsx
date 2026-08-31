import { Link } from 'react-router-dom';

const MENU: { to: string; icon: string; label: string }[] = [
  { to: '/bookings', icon: '🗓️', label: 'My Bookings' },
  { to: '/wallet', icon: '👛', label: 'Wallet' },
  { to: '/host', icon: '🏠', label: 'Become a Host' },
];

const SUPPORT_PHONE = '8999 999 333';

export function ProfilePage() {
  return (
    <div className="px-4 pb-6 pt-4">
      <div className="flex items-center gap-3 rounded-2xl border border-pink-tint bg-white p-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-tint text-2xl text-on-pink">
          🙂
        </div>
        <div>
          <p className="text-base font-bold text-gray-900">Guest User</p>
          <p className="text-xs text-gray-500">Signed in with mock data</p>
        </div>
      </div>

      <div className="mt-4 divide-y divide-pink-tint overflow-hidden rounded-2xl border border-pink-tint bg-white">
        {MENU.map((item) => (
          <Link key={item.to} to={item.to} className="flex items-center gap-3 px-4 py-3.5">
            <span className="text-lg">{item.icon}</span>
            <span className="flex-1 text-sm font-medium text-gray-800">{item.label}</span>
            <span className="text-gray-300">›</span>
          </Link>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-pink-tint bg-white p-4 text-center">
        <p className="text-xs text-gray-400">Need help? Call us</p>
        <a href={`tel:${SUPPORT_PHONE.replace(/\s/g, '')}`} className="mt-1 block text-lg font-bold text-pink-cta">
          {SUPPORT_PHONE}
        </a>
      </div>

      <p className="mt-6 text-center text-xs text-gray-300">ReRo v0.1.0 · Hyderabad</p>
    </div>
  );
}
