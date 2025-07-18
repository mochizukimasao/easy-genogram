
import React, { createContext, useState, useContext, useMemo } from 'react';
import { translations, Language } from '../i18n/locales';

// Helper to safely access nested properties
const getTranslation = (lang: Language, key: string): string => {
    const keys = key.split('.');
    let result: any = translations[lang];
    for (const k of keys) {
        result = result?.[k];
        if (result === undefined) return '';
    }
    return result as string;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, options?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ja');

  const t = useMemo(() => (key: string, options?: Record<string, string | number>): string => {
    let translation = getTranslation(language, key) || getTranslation('en', key) || key;
    
    if (options) {
        Object.entries(options).forEach(([optionKey, value]) => {
            const regex = new RegExp(`{{${optionKey}}}`, 'g');
            translation = translation.replace(regex, String(value));
        });
    }
    return translation;
  }, [language]);

  const value = { language, setLanguage, t };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
