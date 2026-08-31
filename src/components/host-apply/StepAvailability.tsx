import type { OpenHours } from '../../types';

export function StepAvailability({
  openHours,
  onOpenHoursChange,
  blockedDates,
  onAddBlockedDate,
  onRemoveBlockedDate,
}: {
  openHours: OpenHours;
  onOpenHoursChange: (patch: Partial<OpenHours>) => void;
  blockedDates: string[];
  onAddBlockedDate: (date: string) => void;
  onRemoveBlockedDate: (date: string) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="text-xs font-semibold text-gray-600">Default open hours</label>
        <div className="mt-1.5 flex items-center gap-3">
          <input
            type="time"
            value={openHours.start}
            onChange={(e) => onOpenHoursChange({ start: e.target.value })}
            className="flex-1 rounded-xl border border-pink-tint px-3 py-2.5 text-sm outline-none focus:border-pink-cta"
          />
          <span className="text-sm text-gray-400">to</span>
          <input
            type="time"
            value={openHours.end}
            onChange={(e) => onOpenHoursChange({ end: e.target.value })}
            className="flex-1 rounded-xl border border-pink-tint px-3 py-2.5 text-sm outline-none focus:border-pink-cta"
          />
        </div>
        <p className="mt-1.5 text-xs text-gray-500">Guests will only be able to book within these hours by default.</p>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600">Blackout dates (optional)</label>
        <input
          type="date"
          min={today}
          onChange={(e) => {
            if (e.target.value) onAddBlockedDate(e.target.value);
            e.target.value = '';
          }}
          className="mt-1.5 w-full rounded-xl border border-pink-tint px-3 py-2.5 text-sm outline-none focus:border-pink-cta"
        />
        <p className="mt-1.5 text-xs text-gray-500">Pick any dates your house won't be available — add as many as you need.</p>

        {blockedDates.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {blockedDates.map((date) => (
              <span
                key={date}
                className="flex items-center gap-1.5 rounded-full bg-pink-tint px-3 py-1.5 text-xs font-medium text-on-pink"
              >
                {new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                <button type="button" onClick={() => onRemoveBlockedDate(date)} className="text-on-pink/70">
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
