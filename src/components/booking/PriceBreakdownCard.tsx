import { formatPrice } from '../../lib/format';
import type { PriceBreakdown } from '../../types';

export function PriceBreakdownCard({ breakdown }: { breakdown: PriceBreakdown }) {
  const rows: [string, number][] = [
    ['Base amount', breakdown.baseAmount],
    ['Taxes (12%)', breakdown.taxAmount],
    ['Platform fee', breakdown.platformFee],
  ];

  return (
    <div className="rounded-2xl border border-pink-tint bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-700">Price breakdown</h3>
      <div className="space-y-1.5">
        {rows.map(([label, amount]) => (
          <div key={label} className="flex justify-between text-sm text-gray-500">
            <span>{label}</span>
            <span>{formatPrice(amount)}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-between border-t border-pink-tint pt-3 text-base font-extrabold text-gray-900">
        <span>Total</span>
        <span>{formatPrice(breakdown.totalAmount)}</span>
      </div>
    </div>
  );
}
