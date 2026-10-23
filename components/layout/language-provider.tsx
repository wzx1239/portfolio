'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Language, Localized } from '@/lib/types';
type LanguageContext = { language: Language; setLanguage: (language: Language) => void; t: (text: Localized) => string };
const Context = createContext<LanguageContext | null>(null);
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  useEffect(() => {
    try { if (localStorage.getItem('portfolio-language') === 'zh') setLanguage('zh'); } catch { /* Storage is optional. */ }
  }, []);
  useEffect(() => {
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
    try { localStorage.setItem('portfolio-language', language); } catch { /* Storage is optional. */ }
  }, [language]);
  return <Context.Provider value={{ language, setLanguage, t: text => text[language] }}>{children}</Context.Provider>;
}
export function useLanguage() {
  const value = useContext(Context);
  if (!value) throw new Error('LanguageProvider is required');
  return value;
}
