import { formatPrice } from '../../lib/format';

export function StepPricing({
  pricePerHour,
  onChange,
}: {
  pricePerHour: string;
  onChange: (v: string) => void;
}) {
  const numeric = Number(pricePerHour) || 0;
  const platformFee = 49;
  const guestSees = Math.round(numeric * 1.12) + platformFee;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs font-semibold text-gray-600">Your hourly rate</label>
        <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-pink-tint px-3 py-2.5">
          <span className="text-sm font-semibold text-gray-500">Rs</span>
          <input
            type="number"
            min={49}
            value={pricePerHour}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 bg-transparent text-lg font-extrabold text-gray-900 outline-none"
          />
          <span className="text-xs text-gray-400">/ hour</span>
        </div>
        <p className="mt-1.5 text-xs text-gray-500">ReRo's model is hourly, not nightly — this is your base rate.</p>
      </div>

      <div className="rounded-xl bg-teal-tint p-3">
        <p className="text-xs text-on-teal">A guest booking 1 hour sees roughly</p>
        <p className="text-lg font-extrabold text-on-teal">{formatPrice(guestSees)}</p>
        <p className="mt-0.5 text-[10px] text-on-teal">(your rate + platform taxes/fees, same breakdown guests see at checkout)</p>
      </div>
    </div>
  );
}
