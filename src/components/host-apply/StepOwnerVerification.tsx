import { ID_TYPE_LABEL, OWNERSHIP_DOC_TYPE_LABEL, type IdType, type OwnershipDocType } from '../../types';
import type { DraftImage } from './StepPhotos';

export interface OwnerInfoDraft {
  fullName: string;
  phone: string;
  idType: IdType;
  idNumber: string;
  ownershipDocType: OwnershipDocType;
}

const ID_TYPES: IdType[] = ['aadhaar', 'pan', 'passport'];
const OWNERSHIP_DOC_TYPES: OwnershipDocType[] = ['aadhaar', 'utility_bill', 'property_document'];

export function StepOwnerVerification({
  value,
  onChange,
  docFiles,
  onAddDocFiles,
  onRemoveDocFile,
}: {
  value: OwnerInfoDraft;
  onChange: (patch: Partial<OwnerInfoDraft>) => void;
  docFiles: DraftImage[];
  onAddDocFiles: (files: FileList) => void;
  onRemoveDocFile: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-700">
        This is for manual review only — ReRo doesn't run real-time ID verification yet. Your details and
        documents are kept private and are never shown on your public listing.
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

      <div className="border-t border-pink-tint pt-4">
        <label className="text-xs font-semibold text-gray-600">Proof of ownership</label>
        <p className="mt-0.5 mb-2 text-[11px] text-gray-500">
          Upload a photo of one of the documents below, showing your name and this address.
        </p>
        <div className="flex gap-2">
          {OWNERSHIP_DOC_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onChange({ ownershipDocType: t })}
              className={`flex-1 rounded-xl border px-2 py-2.5 text-[11px] font-medium ${
                value.ownershipDocType === t
                  ? 'border-teal-cta bg-teal-tint text-on-teal'
                  : 'border-gray-200 bg-white text-gray-700'
              }`}
            >
              {OWNERSHIP_DOC_TYPE_LABEL[t]}
            </button>
          ))}
        </div>

        <label className="mt-3 flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-pink-tint bg-pink-tint/40 py-4 text-center">
          <span aria-hidden>📄</span>
          <span className="text-sm font-medium text-on-pink">Upload document photo</span>
          <input
            type="file"
            accept="image/*,.pdf"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) onAddDocFiles(e.target.files);
              e.target.value = '';
            }}
          />
        </label>

        {docFiles.length > 0 && (
          <div className="mt-2 flex flex-col gap-1.5">
            {docFiles.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                <span className="text-xs text-gray-600">
                  {doc.url ? '✓ Uploaded' : `Uploading… ${doc.progress}%`}
                  {doc.error && <span className="text-red-500"> — {doc.error}</span>}
                </span>
                <button type="button" onClick={() => onRemoveDocFile(doc.id)} className="text-xs font-medium text-red-500">
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
