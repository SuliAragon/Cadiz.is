import es from './es.json';
import en from './en.json';
import fr from './fr.json';

export type Lang = 'es' | 'en' | 'fr';

const translations = { es, en, fr } as const;

export function t(lang: Lang, key: string, vars?: Record<string, string | number>): string {
  const keys = key.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let value: any = translations[lang];
  for (const k of keys) {
    value = value?.[k];
  }
  if (typeof value !== 'string') return key;
  if (vars) {
    return value.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
  }
  return value;
}

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang === 'en' || lang === 'fr') return lang;
  return 'es';
}

export function getRouteForLang(lang: Lang, currentPath: string): string {
  // Replace language prefix in path
  const parts = currentPath.split('/').filter(Boolean);
  const knownLangs: Lang[] = ['es', 'en', 'fr'];
  if (knownLangs.includes(parts[0] as Lang)) {
    parts[0] = lang;
  } else {
    parts.unshift(lang);
  }
  return '/' + parts.join('/');
}

export const CATEGORIES = {
  fiestas:    { es: 'Fiestas',    en: 'Festivals',  fr: 'Fêtes',        color: '#e07a5f' },
  turismo:    { es: 'Turismo',    en: 'Tourism',    fr: 'Tourisme',      color: '#0466c8' },
  gastronomia:{ es: 'Gastronomía',en: 'Food',       fr: 'Gastronomie',  color: '#10b981' },
  cultura:    { es: 'Cultura',    en: 'Culture',    fr: 'Culture',       color: '#a855f7' },
} as const;

export type Category = keyof typeof CATEGORIES;
