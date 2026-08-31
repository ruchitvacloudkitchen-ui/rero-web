import { LISTING_AMENITIES } from '../../types';

export interface Amenities {
  hasAc: boolean;
  hasWifi: boolean;
  hasBathroom: boolean;
  hasParking: boolean;
  isInstantBook: boolean;
  isWomenFriendly: boolean;
}

export function StepDetails({
  description,
  onDescriptionChange,
  maxGuests,
  onMaxGuestsChange,
  roomSizeSqft,
  onRoomSizeChange,
  amenities,
  onToggleAmenity,
}: {
  description: string;
  onDescriptionChange: (v: string) => void;
  maxGuests: number;
  onMaxGuestsChange: (v: number) => void;
  roomSizeSqft: string;
  onRoomSizeChange: (v: string) => void;
  amenities: Amenities;
  onToggleAmenity: (key: keyof Amenities) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="text-xs font-semibold text-gray-600">Description</label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Tell guests what makes this room a great quick refresh — the space, the neighborhood, what's nearby."
          rows={5}
          maxLength={800}
          className="mt-1 w-full resize-none rounded-xl border border-pink-tint px-3 py-2.5 text-sm outline-none focus:border-pink-cta"
        />
        <p className="mt-1 text-right text-[10px] text-gray-400">{description.length}/800</p>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600">Max guest capacity</label>
        <div className="mt-1.5 flex items-center gap-4">
          <button
            type="button"
            onClick={() => onMaxGuestsChange(Math.max(1, maxGuests - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-pink-tint text-lg text-on-pink"
          >
            −
          </button>
          <span className="w-6 text-center text-base font-semibold text-gray-900">{maxGuests}</span>
          <button
            type="button"
            onClick={() => onMaxGuestsChange(Math.min(12, maxGuests + 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-pink-tint text-lg text-on-pink"
          >
            +
          </button>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600">Room size (sq. ft, optional)</label>
        <input
          type="number"
          min={0}
          value={roomSizeSqft}
          onChange={(e) => onRoomSizeChange(e.target.value)}
          placeholder="e.g. 180"
          className="mt-1 w-full rounded-xl border border-pink-tint px-3 py-2.5 text-sm outline-none focus:border-pink-cta"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600">Amenities</label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {LISTING_AMENITIES.map((a) => (
            <button
              key={a.key}
              type="button"
              onClick={() => onToggleAmenity(a.key)}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-medium ${
                amenities[a.key]
                  ? 'border-teal-cta bg-teal-tint text-on-teal'
                  : 'border-gray-200 bg-white text-gray-700'
              }`}
            >
              <span aria-hidden>{a.icon}</span> {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
