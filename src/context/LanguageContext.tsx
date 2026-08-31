import { type ReactNode, createContext, useContext, useMemo, useState } from 'react';
import type { AppLanguage } from '../types';

const STRINGS: Record<AppLanguage, Record<string, string>> = {
  en: {
    appName: 'ReRo',
    tagline: 'A quick refresh, not a hotel stay.',
    searchPlaceholder: 'Search rooms, areas near you...',
    nearbyRooms: 'Nearby Rooms',
    popularLocations: 'Popular in Hyderabad',
    categories: 'Browse by Category',
    recommended: 'Recommended for You',
    hourly: 'Hourly',
    overnight: 'Overnight',
    bookNow: 'Book Now',
    home: 'Home',
    search: 'Search',
    bookings: 'Bookings',
    wallet: 'Wallet',
    profile: 'Profile',
    startingAt: 'Starting at',
    perHour: '/hr',
    perNight: '/night',
    availableNow: 'Available Now',
    hostAListing: 'List Your Room',
    support: 'Need help? Call',
  },
  te: {
    appName: 'రీరో',
    tagline: 'ఒక చిన్న విశ్రాంతి, హోటల్ బస కాదు.',
    searchPlaceholder: 'మీ దగ్గర గదులు, ప్రాంతాలు వెతకండి...',
    nearbyRooms: 'సమీప గదులు',
    popularLocations: 'హైదరాబాద్‌లో ప్రసిద్ధమైనవి',
    categories: 'వర్గం ద్వారా బ్రౌజ్ చేయండి',
    recommended: 'మీ కోసం సిఫార్సు చేయబడింది',
    hourly: 'గంటకు',
    overnight: 'రాత్రి బస',
    bookNow: 'ఇప్పుడు బుక్ చేయండి',
    home: 'హోమ్',
    search: 'వెతకండి',
    bookings: 'బుకింగ్‌లు',
    wallet: 'వాలెట్',
    profile: 'ప్రొఫైల్',
    startingAt: 'ప్రారంభం',
    perHour: '/గంట',
    perNight: '/రాత్రి',
    availableNow: 'ఇప్పుడు అందుబాటులో ఉంది',
    hostAListing: 'మీ గదిని జాబితా చేయండి',
    support: 'సహాయం కావాలా? కాల్ చేయండి',
  },
};

interface LanguageContextValue {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: (key: keyof typeof STRINGS.en) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<AppLanguage>('en');

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t: (key) => STRINGS[language][key] ?? STRINGS.en[key],
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
