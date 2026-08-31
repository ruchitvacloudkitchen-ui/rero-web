import { HYDERABAD_AREAS } from '../../data/areas';

export function StepLocation({
  address,
  onAddressChange,
  area,
  onAreaChange,
}: {
  address: string;
  onAddressChange: (v: string) => void;
  area: string;
  onAreaChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs font-semibold text-gray-600">Street address / landmark</label>
        <input
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder="e.g. Plot 12, Road No. 4"
          className="mt-1 w-full rounded-xl border border-pink-tint px-3 py-2.5 text-sm outline-none focus:border-pink-cta"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600">Area</label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {HYDERABAD_AREAS.map((a) => (
            <button
              key={a.name}
              type="button"
              onClick={() => onAreaChange(a.name)}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm ${
                area === a.name ? 'border-pink-cta bg-pink-tint text-on-pink' : 'border-gray-200 bg-white text-gray-700'
              }`}
            >
              <span aria-hidden>{a.icon}</span> {a.name}
            </button>
          ))}
        </div>
      </div>

      <p className="rounded-xl bg-teal-tint p-3 text-xs text-on-teal">
        ReRo is Hyderabad-only for now — every listing needs a Hyderabad area.
      </p>
    </div>
  );
}
