import { useLanguage } from '../../context/LanguageContext';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex overflow-hidden rounded-full border border-white/40 bg-white/10 text-xs font-semibold">
      {(['en', 'te'] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLanguage(lang)}
          className={`px-2.5 py-1 transition-colors ${
            language === lang ? 'bg-white text-pink-cta' : 'text-white'
          }`}
        >
          {lang === 'en' ? 'EN' : 'తె'}
        </button>
      ))}
    </div>
  );
}
