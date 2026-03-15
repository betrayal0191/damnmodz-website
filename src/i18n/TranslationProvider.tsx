'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Dictionary } from './getDictionary';
import type { Locale } from './config';

interface TranslationContextValue {
  dict: Dictionary;
  locale: Locale;
}

const TranslationContext = createContext<TranslationContextValue | null>(null);

export function TranslationProvider({
  dict,
  locale,
  children,
}: {
  dict: Dictionary;
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <TranslationContext.Provider value={{ dict, locale }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(TranslationContext);
  if (!ctx) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return ctx;
}
