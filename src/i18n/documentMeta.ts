import type { Locale } from './I18nContext';
import { DICTS } from './translations';

// 主屏标签与 manifest 的 short_name 保持一致；英文名在 Android 14 单行约容 15 字符，故用 13 字符短名。
const HOME_SCREEN_NAME: Record<Locale, string> = {
  zh: '蛋白质计算器',
  en: 'ProtnCalc·pwa',
};

/**
 * 让「添加到主屏幕」的名称与当前界面语言一致。
 * - iOS 14 读 <title> / apple-mobile-web-app-title，Android Chrome 读 manifest.short_name；
 *   两者都随 locale 改写，用户切到英文后新添加的图标即为英文名。
 * - document.title 保持完整名（浏览器标签、分享卡片），主屏标签用短名。
 * - 已存在的图标名称在添加时固化，改名后需要删除图标重新添加。
 */
export function applyDocumentLocale(locale: Locale): void {
  if (typeof document === 'undefined') return;
  const name = DICTS[locale].appName;
  document.title = name;
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
