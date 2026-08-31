import { formatPrice } from '../../lib/format';

export function StepPricing({
  pricePerHour,
  onPricePerHourChange,
  pricePerNight,
  onPricePerNightChange,
}: {
  pricePerHour: string;
  onPricePerHourChange: (v: string) => void;
  pricePerNight: string;
  onPricePerNightChange: (v: string) => void;
}) {
  const hourlyNumeric = Number(pricePerHour) || 0;
  const platformFee = 49;
  const guestSeesHourly = Math.round(hourlyNumeric * 1.12) + platformFee;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs font-semibold text-gray-600">Hourly rate (Rs)</label>
        <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-pink-tint px-3 py-2.5">
          <span className="text-sm font-semibold text-gray-500">Rs</span>
          <input
            type="number"
            min={49}
            value={pricePerHour}
            onChange={(e) => onPricePerHourChange(e.target.value)}
            className="flex-1 bg-transparent text-lg font-extrabold text-gray-900 outline-none"
          />
          <span className="text-xs text-gray-400">/ hour</span>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600">Night rate (Rs)</label>
        <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-teal-tint px-3 py-2.5">
          <span className="text-sm font-semibold text-gray-500">Rs</span>
          <input
            type="number"
            min={49}
            value={pricePerNight}
            onChange={(e) => onPricePerNightChange(e.target.value)}
            className="flex-1 bg-transparent text-lg font-extrabold text-gray-900 outline-none"
          />
          <span className="text-xs text-gray-400">/ night</span>
        </div>
        <p className="mt-1.5 text-xs text-gray-500">
          ReRo guests can book by the hour or overnight — set a fair rate for each.
        </p>
      </div>

      <div className="rounded-xl bg-teal-tint p-3">
        <p className="text-xs text-on-teal">A guest booking 1 hour sees roughly</p>
        <p className="text-lg font-extrabold text-on-teal">{formatPrice(guestSeesHourly)}</p>
        <p className="mt-0.5 text-[10px] text-on-teal">(your rate + platform taxes/fees, same breakdown guests see at checkout)</p>
      </div>
    </div>
  );
}
