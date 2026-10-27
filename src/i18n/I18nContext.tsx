import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dict, DICTS, fmt } from './translations';

/**
 * Change B：语言状态独立于业务 schema（v1/v2 迁移不感知）。
 * - 持久化：独立 AsyncStorage 键 `locale`（'zh' | 'en'），默认 zh；
 * - 无 Provider 时回退 zh（既有测试与渐进接入不破坏）；
 * - 切换即时生效：context value 变化触发全量重渲染。
 */
export type Locale = 'zh' | 'en';
export type LocalePreference = 'system' | Locale;

const LOCALE_STORAGE_KEY = 'locale';

interface I18nContextValue {
  locale: Locale;
  preference: LocalePreference;
  setLocale: (locale: LocalePreference) => void;
  t: Dict;
}

const zhValue: I18nContextValue = {
  locale: 'zh',
  preference: 'system',
  setLocale: () => undefined,
  t: DICTS.zh,
};

const I18nContext = createContext<I18nContextValue>(zhValue);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const resolveSystem = (): Locale =>
    typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('en') ? 'en' : 'zh';
  const [preference, setPreference] = useState<LocalePreference>('system');
  const [systemLocale, setSystemLocale] = useState<Locale>(resolveSystem);
  const locale = preference === 'system' ? systemLocale : preference;

  useEffect(() => {
    if (typeof document !== 'undefined') document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
  }, [locale]);

  useEffect(() => {
    const update = () => setSystemLocale(resolveSystem());
    if (typeof window !== 'undefined') window.addEventListener('languagechange', update);
    return () => { if (typeof window !== 'undefined') window.removeEventListener('languagechange', update); };
  }, []);

  // 启动时读取持久化语言偏好；坏值/读取失败一律回退 zh。
  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(LOCALE_STORAGE_KEY)
      .then((raw) => {
        if (!cancelled && (raw === 'system' || raw === 'zh' || raw === 'en')) {
          setPreference(raw);
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const setLocale = (next: LocalePreference) => {
    setPreference(next);
    AsyncStorage.setItem(LOCALE_STORAGE_KEY, next).catch(() => undefined);
  };

  const value = useMemo<I18nContextValue>(
    () => ({ locale, preference, setLocale, t: DICTS[locale] }),
    [locale, preference],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useT(): I18nContextValue {
  return useContext(I18nContext);
}

/** 食物展示名：EN 优先字典映射（custom 食物无映射回退原名），zh 用原名。 */
export function foodName(food: { id: string; name: string }, t: Dict, locale: Locale): string {
  if (locale === 'en') {
    return t.foods[food.id] ?? food.name;
  }
  return food.name;
}

/** 榜单展示名：EN 优先 rankingNames 映射，zh 用榜单原名。 */
export function rankingName(
  entry: { foodId: string; rankingDisplayName: string },
  t: Dict,
  locale: Locale,
): string {
  if (locale === 'en') {
    return t.rankingNames[entry.foodId] ?? entry.rankingDisplayName;
  }
  return entry.rankingDisplayName;
}

/** 单位展示名：个/块/瓶/盒/袋/根按语言映射，g/ml 与未知单位原样。 */
export function unitLabel(unit: string, t: Dict): string {
  return t.units[unit] ?? unit;
}

/** 校验错误本地化：未知错误原文透传。 */
export function localizeError(error: string, t: Dict): string {
  return t.validationErrors[error] ?? error;
}

export { fmt };
