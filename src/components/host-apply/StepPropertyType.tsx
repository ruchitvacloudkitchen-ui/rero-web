import { PROPERTY_TYPE_LABEL, type PropertyType } from '../../types';

const OPTIONS: PropertyType[] = ['entire_place', 'private_room'];

export function StepPropertyType({
  value,
  onChange,
}: {
  value: PropertyType | null;
  onChange: (v: PropertyType) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {OPTIONS.map((opt) => {
        const info = PROPERTY_TYPE_LABEL[opt];
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`rounded-2xl border p-4 text-left transition-colors ${
              value === opt ? 'border-pink-cta bg-pink-tint' : 'border-gray-200 bg-white'
            }`}
          >
            <p className={`text-sm font-semibold ${value === opt ? 'text-on-pink' : 'text-gray-900'}`}>{info.title}</p>
            <p className="mt-0.5 text-xs text-gray-500">{info.subtitle}</p>
          </button>
        );
      })}
    </div>
  );
}
