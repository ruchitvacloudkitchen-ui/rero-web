import { ID_TYPE_LABEL, type IdType } from '../../types';

export interface OwnerInfoDraft {
  fullName: string;
  phone: string;
  idType: IdType;
  idNumber: string;
}

const ID_TYPES: IdType[] = ['aadhaar', 'pan', 'passport'];

export function StepOwnerVerification({
  value,
  onChange,
}: {
  value: OwnerInfoDraft;
  onChange: (patch: Partial<OwnerInfoDraft>) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-700">
        This is for manual review only — ReRo doesn't run real-time ID verification yet. Your details are kept
        private and are never shown on your public listing.
      </p>

      <div>
        <label className="text-xs font-semibold text-gray-600">Full name (as on ID)</label>
        <input
          value={value.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
          className="mt-1 w-full rounded-xl border border-pink-tint px-3 py-2.5 text-sm outline-none focus:border-pink-cta"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600">Phone number</label>
        <input
          value={value.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          placeholder="10-digit mobile number"
          className="mt-1 w-full rounded-xl border border-pink-tint px-3 py-2.5 text-sm outline-none focus:border-pink-cta"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600">ID type</label>
        <div className="mt-1.5 flex gap-2">
          {ID_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onChange({ idType: t })}
              className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium ${
                value.idType === t ? 'border-pink-cta bg-pink-tint text-on-pink' : 'border-gray-200 bg-white text-gray-700'
              }`}
            >
              {ID_TYPE_LABEL[t]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600">{ID_TYPE_LABEL[value.idType]} number</label>
        <input
          value={value.idNumber}
          onChange={(e) => onChange({ idNumber: e.target.value })}
          className="mt-1 w-full rounded-xl border border-pink-tint px-3 py-2.5 text-sm outline-none focus:border-pink-cta"
        />
      </div>
    </div>
  );
}
