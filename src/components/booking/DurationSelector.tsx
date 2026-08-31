import { formatPrice } from '../../lib/format';
import { BOOKING_DURATION_LABEL, type BookingDuration, type Room, basePriceForDuration } from '../../types';

const DURATIONS: BookingDuration[] = ['oneHour', 'twoHours', 'threeHours', 'nightStay'];

export function DurationSelector({
  room,
  value,
  onChange,
}: {
  room: Room;
  value: BookingDuration;
  onChange: (d: BookingDuration) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {DURATIONS.map((d) => (
        <button
          key={d}
          type="button"
          onClick={() => onChange(d)}
          className={`rounded-xl border px-3 py-3 text-left transition-colors ${
            value === d
              ? 'border-pink-cta bg-pink-tint text-on-pink'
              : 'border-gray-200 bg-white text-gray-700'
          }`}
        >
          <div className="text-sm font-semibold">{BOOKING_DURATION_LABEL[d]}</div>
          <div className="text-xs text-gray-500">{formatPrice(basePriceForDuration(d, room))}</div>
        </button>
      ))}
    </div>
  );
}
