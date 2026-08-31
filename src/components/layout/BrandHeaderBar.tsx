import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { CallToBookBar } from './CallToBookBar';
import { LanguageToggle } from './LanguageToggle';

// Shared maroon header treatment from the reference mockups: the pink
// call-to-book strip, then a #2B0518 block. On top-level tabs it shows the
// wordmark + language toggle (+ optional tagline card); on sub-pages
// (Room Details' own gallery header aside) it shows a back chevron + title
// instead, matching the Become-a-Host reference's header pattern.
export function BrandHeaderBar({
  backLabel,
  tagline = true,
}: {
  backLabel?: string;
  tagline?: boolean;
}) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div>
      <CallToBookBar />
      <div className="bg-pink-dark px-4 py-4">
        {backLabel ? (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-3 flex items-center gap-2 text-sm text-pink-on-dark-soft"
          >
            <span aria-hidden>←</span> {backLabel}
          </button>
        ) : (
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-[22px] font-medium text-pink-on-dark">{t('appName')}</span>
            <LanguageToggle />
          </div>
        )}
        {tagline && (
          <div className="flex items-center gap-1.5 rounded-[10px] bg-pink-dark-2 px-3 py-2">
            <span aria-hidden className="text-sm text-bright-teal">✨</span>
            <span className="text-xs font-medium text-pink-on-dark-soft">Refresh. Rest. Reset.</span>
          </div>
        )}
      </div>
    </div>
  );
}
