import { useEffect, useRef } from 'react';

type Options = {
  /** 当前是否有弹层（Sheet / Modal / 详情页）打开 */
  hasOverlay: boolean;
  /** 关闭最上层弹层 */
  onCloseOverlay: () => void;
  /** 首页按返回时的提示（再按一次退出） */
  onShowExitHint: () => void;
};

/**
 * Android PWA 的返回键守卫。
 *
 * PWA 里的网页无法用脚本主动退出应用，所以这里用「二次返回」做确认：
 * 1. 挂载时压入两条守卫记录：红米 PWAActivity 在「退完历史栈」时会立刻结束应用，
 *    单层守卫退一层就归零、来不及拦截，两层才能让第一下返回停在可后退状态；
 * 2. 有弹层时，返回键先关弹层，并补回守卫；
 * 3. 首页按返回：显示「再按一次返回退出」，暂不补守卫，2 秒内再按返回由系统退出；
 *    超过 2 秒没再按，补回守卫，下次仍需二次确认。
 */
export function useBackExitGuard({ hasOverlay, onCloseOverlay, onShowExitHint }: Options): void {
  const latest = useRef({ hasOverlay, onCloseOverlay, onShowExitHint });
  useEffect(() => {
    latest.current = { hasOverlay, onCloseOverlay, onShowExitHint };
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const pushGuard = () => {
      window.history.pushState({ __backGuard: true }, '');
    };
    let rearmTimer: number | undefined;

    pushGuard();
    pushGuard();

    const handlePopState = () => {
      if (latest.current.hasOverlay) {
        latest.current.onCloseOverlay();
        pushGuard();
        return;
      }

      latest.current.onShowExitHint();
      window.clearTimeout(rearmTimer);
      rearmTimer = window.setTimeout(pushGuard, 2000);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.clearTimeout(rearmTimer);
    };
  }, []);
}
