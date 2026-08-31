import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROOM_CATEGORIES } from '../types';

export function HostPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [pricePerHour, setPricePerHour] = useState('99');
  const [category, setCategory] = useState(ROOM_CATEGORIES[0].id);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-tint text-3xl">🎉</div>
        <h1 className="mt-4 text-lg font-bold text-gray-900">Listing submitted!</h1>
        <p className="mt-2 max-w-xs text-sm text-gray-500">
          "{title || 'Your room'}" has been submitted for review. This is a demo flow — no listing is actually
          created in Firestore yet.
        </p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-6 rounded-full bg-pink-cta px-6 py-3 text-sm font-semibold text-white shadow"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 pb-10">
      <button type="button" onClick={() => navigate(-1)} className="mb-3 text-sm text-gray-500">
        ← Back
      </button>
      <h1 className="text-lg font-bold text-gray-900">List Your Room</h1>
      <p className="mt-1 text-sm text-gray-500">Earn extra income by hosting travelers for a few hours or a night.</p>

      <form onSubmit={submit} className="mt-5 space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-600">Room title</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Cozy Studio near Banjara Hills"
            className="mt-1 w-full rounded-xl border border-pink-tint px-3 py-2.5 text-sm outline-none focus:border-pink-cta"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-600">Address</label>
          <input
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Street, area, Hyderabad"
            className="mt-1 w-full rounded-xl border border-pink-tint px-3 py-2.5 text-sm outline-none focus:border-pink-cta"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-600">Price per hour (₹)</label>
          <input
            required
            type="number"
            min={49}
            value={pricePerHour}
            onChange={(e) => setPricePerHour(e.target.value)}
            className="mt-1 w-full rounded-xl border border-pink-tint px-3 py-2.5 text-sm outline-none focus:border-pink-cta"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-600">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-xl border border-pink-tint bg-white px-3 py-2.5 text-sm outline-none focus:border-pink-cta"
          >
            {ROOM_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-700">
          Demo flow — no KYC, image upload, or real Firestore write happens yet. Submitting just shows a
          confirmation screen.
        </p>

        <button
          type="submit"
          className="w-full rounded-full bg-teal-cta py-3 text-sm font-semibold text-white shadow"
        >
          Submit Listing
        </button>
      </form>
    </div>
  );
}
