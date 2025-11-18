'use client';

import { useState } from 'react';

export default function LanguageSwitcher() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
    // In a real implementation, this would update the i18n context
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <button
      onClick={toggleLanguage}
      className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition backdrop-blur-md"
    >
      {language === 'en' ? '🇸🇦 العربية' : '🇺🇸 English'}
    </button>
  );
}
