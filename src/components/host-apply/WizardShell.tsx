import type { ReactNode } from 'react';

export function WizardShell({
  stepIndex,
  stepCount,
  title,
  subtitle,
  onBack,
  children,
  footer,
}: {
  stepIndex: number;
  stepCount: number;
  title: string;
  subtitle?: string;
  onBack: () => void;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="pb-24">
      <div className="bg-pink-dark px-4 py-4">
        <button type="button" onClick={onBack} className="mb-3 flex items-center gap-2 text-sm text-pink-on-dark-soft">
          <span aria-hidden>←</span> Back
        </button>

        <div className="mb-3 flex gap-1.5">
          {Array.from({ length: stepCount }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${i <= stepIndex ? 'bg-bright-teal' : 'bg-pink-dark-2'}`}
            />
          ))}
        </div>

        <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-bright-teal">
          Step {stepIndex + 1} of {stepCount}
        </p>
        <p className="text-lg font-semibold text-white">{title}</p>
        {subtitle && <p className="mt-1 text-xs text-pink-on-dark-soft">{subtitle}</p>}
      </div>

      <div className="p-4">{children}</div>

      <div className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-md border-t border-pink-tint bg-white p-4">
        {footer}
      </div>
    </div>
  );
}
