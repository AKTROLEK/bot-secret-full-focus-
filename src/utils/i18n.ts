import i18next from 'i18next';
import enTranslations from '../locales/en.json';
import arTranslations from '../locales/ar.json';

i18next.init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: { translation: enTranslations },
    ar: { translation: arTranslations },
  },
});

export const t = (key: string, options?: Record<string, string | number>): string => {
  return i18next.t(key, options);
};

export const setLanguage = (lng: string): void => {
  i18next.changeLanguage(lng);
};

export const getLanguage = (): string => {
  return i18next.language;
};

export default i18next;
