import type { Locale } from './I18nContext';

// 主屏标签与 manifest 的 short_name 保持一致；英文名在 Android 14 单行约容 15 字符，故用 13 字符短名。
const HOME_SCREEN_NAME: Record<Locale, string> = {
  zh: '蛋白质计算器',
  en: 'ProtnCalc·pwa',
};

/**
 * 让「添加到主屏幕」的名称与当前界面语言一致。
 * - iOS 14 读 apple-mobile-web-app-title；红米/HyperOS 系统浏览器实测用 document.title
 *   作为快捷方式默认名（忽略 manifest 的 name / short_name），两者都随 locale 改写。
 * - 因此标题与主屏标签统一用短名，App 内的完整名由界面文案呈现。
 * - 已存在的图标名称在添加时固化，改名后需要删除图标重新添加。
 */
export function applyDocumentLocale(locale: Locale): void {
  if (typeof document === 'undefined') return;
  document.title = HOME_SCREEN_NAME[locale];
  document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';

  const manifestLink = document.querySelector('link[rel="manifest"]');
  if (manifestLink) {
    manifestLink.setAttribute('href', `./manifest.${locale}.webmanifest`);
  }

  let appleTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]');
  if (!appleTitle) {
    appleTitle = document.createElement('meta');
    appleTitle.setAttribute('name', 'apple-mobile-web-app-title');
    document.head.appendChild(appleTitle);
  }
  appleTitle.setAttribute('content', HOME_SCREEN_NAME[locale]);
}
