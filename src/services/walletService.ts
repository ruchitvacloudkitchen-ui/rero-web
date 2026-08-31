import type { WalletTransaction } from '../types';

// Matches reri-flutter's wallet/: real read shape, no writer anywhere yet
// (no real payment gateway means no real top-up/refund flow) — balance is
// always 0 and history always empty, same as the Flutter app, and the UI
// says so rather than faking data.
export async function getWalletBalance(): Promise<number> {
  return Promise.resolve(0);
}

export async function getWalletTransactions(): Promise<WalletTransaction[]> {
  return Promise.resolve([]);
}
