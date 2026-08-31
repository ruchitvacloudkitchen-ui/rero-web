import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BrandHeaderBar } from '../components/layout/BrandHeaderBar';
import { useAuth } from '../context/AuthContext';

const MENU: { to: string; icon: string; label: string }[] = [
  { to: '/bookings', icon: '🗓️', label: 'My Bookings' },
  { to: '/wallet', icon: '👛', label: 'Wallet' },
  { to: '/host', icon: '🏠', label: 'Become a Host' },
];

const SUPPORT_PHONE = '8999 999 333';

export function ProfilePage() {
  const { user, signIn, signOut, loading } = useAuth();
  const [busy, setBusy] = useState(false);

  const handleSignIn = async () => {
    setBusy(true);
    try {
      await signIn();
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    if (!window.confirm('Sign out of ReRo?')) return;
    setBusy(true);
    try {
      await signOut();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pb-6">
      <BrandHeaderBar tagline={false} />

      <div className="px-4 pt-4">
        <div className="flex items-center gap-3 rounded-2xl border border-pink-tint bg-white p-4">
          {user?.photoUrl ? (
            <img src={user.photoUrl} alt={user.displayName ?? 'You'} className="h-14 w-14 rounded-full object-cover" />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-tint text-2xl text-on-pink">
              🙂
            </div>
          )}
          <div className="flex-1">
            <p className="text-base font-bold text-gray-900">{user?.displayName ?? 'Guest'}</p>
            <p className="text-xs text-gray-500">{user?.email ?? 'Not signed in'}</p>
          </div>
          {!loading &&
            (user ? (
              <button
                type="button"
                onClick={handleSignOut}
                disabled={busy}
                className="rounded-full border border-pink-tint px-3 py-1.5 text-xs font-semibold text-on-pink disabled:opacity-60"
              >
                Sign out
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSignIn}
                disabled={busy}
                className="rounded-full bg-pink-cta px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
              >
                {busy ? '…' : 'Sign in'}
              </button>
            ))}
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
          <a href={`tel:${SUPPORT_PHONE.replace(/\s/g, '')}`} className="mt-1 block text-lg font-extrabold text-pink-cta">
            {SUPPORT_PHONE}
          </a>
        </div>

        <p className="mt-6 text-center text-xs text-gray-300">ReRo v0.1.0 · Hyderabad</p>
      </div>
    </div>
  );
}
