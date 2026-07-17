import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import en, { type LocaleStrings } from "./locales/en";
import zh from "./locales/zh";

export type Locale = "en" | "zh";
export type InstrumentLabel = "short" | "full";

const LS_KEY = "muscriptor-locale";

const locales: Record<Locale, LocaleStrings> = { en, zh };

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function resolve(obj: unknown, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== "object") return path;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : path;
}

function interpolate(template: string, params?: Record<string, string>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) => params[key] ?? `{${key}}`);
}

function loadLocale(): Locale {
  try {
    const stored = localStorage.getItem(LS_KEY);
    if (stored === "en" || stored === "zh") return stored;
  } catch {
    // localStorage unavailable
  }
  // Detect browser language preference
  try {
    const navLang = navigator.language?.toLowerCase() ?? "";
    if (navLang.startsWith("zh")) return "zh";
  } catch {
    // navigator.language unavailable
  }
  return "en";
}

export function LocaleProvider(props: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(loadLocale);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(LS_KEY, l);
    } catch {
      // ignore
    }
    document.documentElement.lang = l === "zh" ? "zh-CN" : "en";
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [locale]);

  const t = useCallback(
    (key: string, params?: Record<string, string>): string => {
      const strings = locales[locale];
      const value = resolve(strings, key);
      return interpolate(value, params);
    },
    [locale],
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {props.children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within LocaleProvider");
  return ctx;
}
