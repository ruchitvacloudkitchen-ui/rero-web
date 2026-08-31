export function StepTitleDescription({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
}: {
  title: string;
  onTitleChange: (v: string) => void;
  description: string;
  onDescriptionChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs font-semibold text-gray-600">Listing title</label>
        <input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="e.g. Cozy Studio near Banjara Hills"
          maxLength={70}
          className="mt-1 w-full rounded-xl border border-pink-tint px-3 py-2.5 text-sm outline-none focus:border-pink-cta"
        />
        <p className="mt-1 text-right text-[10px] text-gray-400">{title.length}/70</p>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600">Description</label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Tell guests what makes this room a great quick refresh — the space, the neighborhood, what's nearby."
          rows={6}
          maxLength={800}
          className="mt-1 w-full resize-none rounded-xl border border-pink-tint px-3 py-2.5 text-sm outline-none focus:border-pink-cta"
        />
        <p className="mt-1 text-right text-[10px] text-gray-400">{description.length}/800</p>
      </div>
    </div>
  );
}
