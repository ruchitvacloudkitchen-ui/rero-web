import { HYDERABAD_AREAS } from '../../data/areas';
import { PROPERTY_TYPE_LABEL, type PropertyType } from '../../types';
import { MapPinPicker } from './MapPinPicker';

const PROPERTY_TYPES: PropertyType[] = ['entire_place', 'private_room'];

export function StepLocation({
  title,
  onTitleChange,
  propertyType,
  onPropertyTypeChange,
  address,
  onAddressChange,
  area,
  onAreaChange,
  lat,
  lng,
  onLocationChange,
}: {
  title: string;
  onTitleChange: (v: string) => void;
  propertyType: PropertyType | null;
  onPropertyTypeChange: (v: PropertyType) => void;
  address: string;
  onAddressChange: (v: string) => void;
  area: string;
  onAreaChange: (v: string) => void;
  lat: number | null;
  lng: number | null;
  onLocationChange: (lat: number, lng: number) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs font-semibold text-gray-600">House / room name</label>
        <input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="e.g. Cozy Studio near Banjara Hills"
          maxLength={70}
          className="mt-1 w-full rounded-xl border border-pink-tint px-3 py-2.5 text-sm outline-none focus:border-pink-cta"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600">What are you listing?</label>
        <div className="mt-1.5 flex gap-2">
          {PROPERTY_TYPES.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onPropertyTypeChange(opt)}
              className={`flex-1 rounded-xl border px-3 py-2.5 text-left text-xs font-medium ${
                propertyType === opt ? 'border-pink-cta bg-pink-tint text-on-pink' : 'border-gray-200 bg-white text-gray-700'
              }`}
            >
              {PROPERTY_TYPE_LABEL[opt].title}
            </button>
          ))}
        </div>
      </div>

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

      <div>
        <label className="text-xs font-semibold text-gray-600">Drop a pin on the exact location</label>
        <div className="mt-1.5">
          <MapPinPicker lat={lat} lng={lng} onChange={onLocationChange} />
        </div>
        <p className="mt-1.5 text-[11px] text-gray-500">Tap the map or drag the pin — this helps guests find you.</p>
      </div>

      <p className="rounded-xl bg-teal-tint p-3 text-xs text-on-teal">
        ReRo is Hyderabad-only for now — every listing needs a Hyderabad area.
      </p>
    </div>
  );
}
