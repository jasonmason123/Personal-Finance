import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface TranslationDictionary {
  [key: string]: string | TranslationDictionary;
}

interface I18nContextValue {
  locale: string;
  setLocale: (nextLocale: string) => void;
  t: (key: string, fallback?: string) => string;
  isLocaleLoading: boolean;
}

const LOCALE_STORAGE_KEY = "app_locale";
const DEFAULT_LOCALE = "vi-VN";
const SUPPORTED_LOCALES = ["vi-VN", "en-US"] as const;

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

function isSupportedLocale(locale: string | null): locale is (typeof SUPPORTED_LOCALES)[number] {
  return !!locale && SUPPORTED_LOCALES.includes(locale as (typeof SUPPORTED_LOCALES)[number]);
}

function normalizeLocale(locale: string | null): (typeof SUPPORTED_LOCALES)[number] | null {
  if (!locale) {
    return null;
  }

  const normalized = locale.replace("_", "-");
  return isSupportedLocale(normalized) ? normalized : null;
}

function getInitialLocale(): (typeof SUPPORTED_LOCALES)[number] {
  const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY);
  const normalizedSavedLocale = normalizeLocale(savedLocale);
  if (normalizedSavedLocale) {
    return normalizedSavedLocale;
  }

  return DEFAULT_LOCALE;
}

function resolveTranslation(dict: TranslationDictionary, key: string): string | undefined {
  const path = key.split(".");
  let cursor: string | TranslationDictionary | undefined = dict;

  for (const segment of path) {
    if (!cursor || typeof cursor === "string") {
      return undefined;
    }
    cursor = cursor[segment];
  }

  return typeof cursor === "string" ? cursor : undefined;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<(typeof SUPPORTED_LOCALES)[number]>(getInitialLocale);
  const [translations, setTranslations] = useState<TranslationDictionary>({});
  const [isLocaleLoading, setIsLocaleLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLocaleLoading(true);

    fetch(`/locales/${locale}.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load locale ${locale}`);
        }
        return response.json() as Promise<TranslationDictionary>;
      })
      .then((dictionary) => {
        if (!cancelled) {
          setTranslations(dictionary);
          document.documentElement.lang = locale;
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTranslations({});
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLocaleLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [locale]);

  const setLocale = useCallback((nextLocale: string) => {
    const normalizedLocale = normalizeLocale(nextLocale);
    if (!normalizedLocale) {
      return;
    }

    localStorage.setItem(LOCALE_STORAGE_KEY, normalizedLocale);
    setLocaleState(normalizedLocale);
  }, []);

  const t = useCallback(
    (key: string, fallback?: string) => resolveTranslation(translations, key) ?? fallback ?? key,
    [translations],
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      isLocaleLoading,
    }),
    [isLocaleLoading, locale, setLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
