import { useEffect, useState } from 'react';
import { BrandHeaderBar } from '../components/layout/BrandHeaderBar';
import { formatPrice } from '../lib/format';
import { getWalletBalance, getWalletTransactions } from '../services/walletService';
import type { WalletTransaction } from '../types';

export function WalletPage() {
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[] | null>(null);

  useEffect(() => {
    getWalletBalance().then(setBalance);
    getWalletTransactions().then(setTransactions);
  }, []);

  return (
    <div className="pb-6">
      <BrandHeaderBar />

      <div className="px-4 pt-4">
        <div className="rounded-2xl bg-gradient-to-r from-pink-cta to-teal-cta p-5 text-white">
          <p className="text-xs text-white/80">Available balance</p>
          <p className="mt-1 text-3xl font-extrabold">{formatPrice(balance ?? 0)}</p>
        </div>

        <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-700">
          No real payment gateway is connected yet, so top-ups and refunds don't exist — balance is always{' '}
          {formatPrice(0)}.
        </p>

        <h2 className="mt-5 text-sm font-bold text-gray-900">Transaction history</h2>
        {transactions !== null && transactions.length === 0 && (
          <p className="mt-3 text-center text-sm text-gray-400">No transactions yet.</p>
        )}
      </div>
    </div>
  );
}
