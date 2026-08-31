export interface DraftImage {
  id: string;
  url: string | null; // null while uploading
  progress: number;
  error: string | null;
}

export function StepPhotos({
  images,
  onAddFiles,
  onRemove,
  onMove,
}: {
  images: DraftImage[];
  onAddFiles: (files: FileList) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-pink-tint bg-pink-tint/40 py-8 text-center">
        <span aria-hidden className="text-2xl">📷</span>
        <span className="text-sm font-medium text-on-pink">Add photos</span>
        <span className="text-xs text-gray-500">JPG or PNG, at least 1 required</span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) onAddFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </label>

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {images.map((img, i) => (
            <div key={img.id} className="relative overflow-hidden rounded-xl border border-pink-tint bg-white">
              <div className="relative h-28 w-full bg-[#ECE7E9]">
                {img.url ? (
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1">
                    <span className="text-xs text-gray-500">Uploading… {img.progress}%</span>
                    <div className="h-1 w-16 overflow-hidden rounded-full bg-pink-tint">
                      <div className="h-full bg-pink-cta transition-all" style={{ width: `${img.progress}%` }} />
                    </div>
                  </div>
                )}
                {i === 0 && img.url && (
                  <span className="absolute left-1.5 top-1.5 rounded-md bg-bright-teal px-1.5 py-0.5 text-[9px] font-semibold text-on-teal">
                    Cover
                  </span>
                )}
              </div>
              {img.error && <p className="px-2 pt-1 text-[10px] text-red-600">{img.error}</p>}
              <div className="flex items-center justify-between px-2 py-1.5">
                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={i === 0}
                    onClick={() => onMove(img.id, -1)}
                    className="text-xs text-gray-400 disabled:opacity-30"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    disabled={i === images.length - 1}
                    onClick={() => onMove(img.id, 1)}
                    className="text-xs text-gray-400 disabled:opacity-30"
                  >
                    →
                  </button>
                </div>
                <button type="button" onClick={() => onRemove(img.id)} className="text-xs font-medium text-red-500">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
