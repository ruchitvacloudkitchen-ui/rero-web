import { Link } from 'react-router-dom';
import { LanguageToggle } from './LanguageToggle';
import { useLanguage } from '../../context/LanguageContext';

export function TopBar() {
  const { t } = useLanguage();

  return (
    <header className="bg-pink-dark px-4 pb-6 pt-4 text-white">
      <div className="mx-auto flex max-w-md items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="ReRo" className="h-9 w-9" />
          <span className="text-xl font-bold tracking-tight">{t('appName')}</span>
        </Link>
        <LanguageToggle />
      </div>
      <p className="mx-auto mt-1 max-w-md text-sm text-bright-teal">{t('tagline')}</p>
    </header>
  );
}
