"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getMessage, LOCALES } from "@/lib/i18n";
import type { Locale, Messages } from "@/lib/i18n";
import ru from "@/messages/ru";
import en from "@/messages/en";
import fr from "@/messages/fr";
import de from "@/messages/de";
import it from "@/messages/it";
import es from "@/messages/es";
import zh from "@/messages/zh";
import pt from "@/messages/pt";
import ja from "@/messages/ja";
import ko from "@/messages/ko";

const STORAGE_KEY = "family-stars-locale";

const messagesMap: Record<Locale, Messages> = {
  ru,
  en,
  fr,
  de,
  it,
  es,
  zh,
  pt,
  ja,
  ko,
};

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getStoredLocale(): Locale {
  if (typeof window === "undefined") return "ru";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (LOCALES.includes(stored as Locale)) return stored as Locale;
  return "ru";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ru");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocaleState(getStoredLocale());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = locale;
  }, [mounted, locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, newLocale);
    }
  }, []);

  const t = useCallback(
    (key: string) => getMessage(messagesMap[locale], key),
    [locale]
  );

  const value = useMemo<LanguageContextValue>(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within LanguageProvider");
  }
  return ctx;
}
