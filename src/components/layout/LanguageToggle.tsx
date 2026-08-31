import { useLanguage } from '../../context/LanguageContext';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-0.5 rounded-full bg-pink-dark-2 p-0.5">
      {(['en', 'te'] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLanguage(lang)}
          className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors ${
            language === lang ? 'bg-bright-teal text-on-teal' : 'text-pink-on-dark-soft'
          }`}
        >
          {lang === 'en' ? 'EN' : 'తెలుగు'}
        </button>
      ))}
    </div>
  );
}
